module secret_sips_addr::secret_sips {
    use std::string::String;
    use std::signer;
    use std::vector;

    use aptos_framework::object::{Self, ExtendRef};
    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    // --- Error Constants ---
    const E_POST_NOT_FOUND: u64 = 1;
    const E_ALREADY_UPVOTED: u64 = 2;
    const E_INSUFFICIENT_APT_FOR_REWARD: u64 = 3;
    const E_NOT_POST_OWNER: u64 = 4;
    const E_INSUFFICIENT_REWARD_TOKENS_TO_REDEEM: u64 = 5;

    // --- Constants ---
    const APP_OBJECT_SEED: vector<u8> = b"secret_sips";
    const UPVOTE_REWARD_AMOUNT: u64 = 1000000; // 0.01 APT (1,000,000 Octas)

    // --- Structs ---

    struct Post has store {
        id: u64,
        owner: address,
        title: String,
        content: String,
        image_url: String,
        upvotes: u64,
        earned_tokens: u64,
        redeemed_tokens: u64,
        upvoters: vector<address>,
        timestamp: u64,
    }

    struct AppData has key {
        posts: vector<Post>,
        next_post_id: u64,
    }

    struct AppObjectController has key {
        extend_ref: ExtendRef,
    }

    // --- Initialization ---

    fun init_module(sender: &signer) {
        let constructor_ref = object::create_named_object(sender, APP_OBJECT_SEED);
        let object_signer = object::generate_signer(&constructor_ref);

        move_to(&object_signer, AppObjectController {
            extend_ref: object::generate_extend_ref(&constructor_ref),
        });

        move_to(&object_signer, AppData {
            posts: vector::empty<Post>(),
            next_post_id: 0,
        });
    }


    fun get_app_object_address(): address {
        object::create_object_address(&@secret_sips_addr, APP_OBJECT_SEED)
    }

    fun get_app_object_signer(): signer acquires AppObjectController {
        let controller_addr = get_app_object_address();
        let controller = borrow_global<AppObjectController>(controller_addr);
        object::generate_signer_for_extending(&controller.extend_ref)
    }


    public entry fun create_post(
        sender: &signer,
        title: String,
        content: String,
        image_url: String
    ) acquires AppData {
        let app_data_addr = get_app_object_address();
        let app_data = borrow_global_mut<AppData>(app_data_addr);

        let post_id = app_data.next_post_id;
        app_data.next_post_id = post_id + 1;

        let new_post = Post {
            id: post_id,
            owner: signer::address_of(sender),
            title,
            content,
            image_url,
            upvotes: 0,
            earned_tokens: 0,
            redeemed_tokens: 0,
            upvoters: vector::empty<address>(),
            timestamp: timestamp::now_seconds(),
        };
        vector::push_back(&mut app_data.posts, new_post);
    }

    public entry fun upvote_post(
        sender: &signer,
        post_id: u64
    ) acquires AppData {
        let sender_addr = signer::address_of(sender);
        let app_data_addr = get_app_object_address();
        let app_data = borrow_global_mut<AppData>(app_data_addr);

        let post_idx = find_post_index_by_id(&app_data.posts, post_id);
        let post = vector::borrow_mut(&mut app_data.posts, post_idx);

        assert!(!vector::contains(&post.upvoters, &sender_addr), E_ALREADY_UPVOTED);

        vector::push_back(&mut post.upvoters, sender_addr);
        post.upvotes = post.upvotes + 1;
        post.earned_tokens = post.earned_tokens + UPVOTE_REWARD_AMOUNT;

        assert!(coin::balance<AptosCoin>(sender_addr) >= UPVOTE_REWARD_AMOUNT, E_INSUFFICIENT_APT_FOR_REWARD);
        coin::transfer<AptosCoin>(sender, post.owner, UPVOTE_REWARD_AMOUNT);
    }

    public entry fun redeem_tokens(
        sender: &signer,
        post_id: u64,
        amount_to_redeem: u64
    ) acquires AppData {
        let sender_addr = signer::address_of(sender);
        let app_data_addr = get_app_object_address();
        let app_data = borrow_global_mut<AppData>(app_data_addr);

        let post_idx = find_post_index_by_id(&app_data.posts, post_id);
        let post = vector::borrow_mut(&mut app_data.posts, post_idx);

        assert!(post.owner == sender_addr, E_NOT_POST_OWNER);
        let available_to_redeem = post.earned_tokens - post.redeemed_tokens;
        assert!(available_to_redeem >= amount_to_redeem, E_INSUFFICIENT_REWARD_TOKENS_TO_REDEEM);

        post.redeemed_tokens = post.redeemed_tokens + amount_to_redeem;
    }


    struct PostView has copy, drop, store {
        id: u64,
        owner: address,
        title: String,
        content: String,
        image_url: String,
        upvotes: u64,
        earned_tokens: u64,
        redeemed_tokens: u64,
        timestamp: u64,
    }

    fun post_to_view(post: &Post): PostView {
        PostView {
            id: post.id,
            owner: post.owner,
            title: post.title,
            content: post.content,
            image_url: post.image_url,
            upvotes: post.upvotes,
            earned_tokens: post.earned_tokens,
            redeemed_tokens: post.redeemed_tokens,
            timestamp: post.timestamp,
        }
    }

    #[view]
    public fun get_feed(start_index: u64, limit: u64): vector<PostView> acquires AppData {
        let app_data_addr = get_app_object_address();
        let app_data = borrow_global<AppData>(app_data_addr);
        let posts_vec = &app_data.posts;
        let len = vector::length(posts_vec);
        let feed_results = vector::empty<PostView>();

        if (start_index >= len || limit == 0) {
            return feed_results;
        };

        let count = 0u64;
        let current_vec_idx_plus_1 = len - start_index;

        while (count < limit && current_vec_idx_plus_1 > 0) {
            let current_vec_idx = current_vec_idx_plus_1 - 1;
            let post_ref = vector::borrow(posts_vec, current_vec_idx);
            vector::push_back(&mut feed_results, post_to_view(post_ref));
            count = count + 1;
            current_vec_idx_plus_1 = current_vec_idx;
        };
        feed_results
    }

    #[view]
    public fun get_post_by_id(post_id: u64): PostView acquires AppData {
        let app_data_addr = get_app_object_address();
        let app_data = borrow_global<AppData>(app_data_addr);
        let post_idx = find_post_index_by_id(&app_data.posts, post_id);
        let post_ref = vector::borrow(&app_data.posts, post_idx);
        post_to_view(post_ref)
    }

    #[view]
    public fun get_leaderboard(limit: u64): vector<PostView> acquires AppData {
        let app_data_addr = get_app_object_address();
        let app_data = borrow_global<AppData>(app_data_addr);

        let posts_to_sort = vector::empty<PostView>();
        let i = 0;
        let len_posts = vector::length(&app_data.posts);
        while (i < len_posts) {
            vector::push_back(&mut posts_to_sort, post_to_view(vector::borrow(&app_data.posts, i)));
            i = i + 1;
        };

        let n = vector::length(&posts_to_sort);
        if (n > 1) {
            let j = 0;
            while (j < n - 1) {
                let k = 0;
                while (k < n - j - 1) {
                    if (vector::borrow(&posts_to_sort, k).upvotes < vector::borrow(&posts_to_sort, k + 1).upvotes) {
                        vector::swap(&mut posts_to_sort, k, k + 1);
                    };
                    k = k + 1;
                };
                j = j + 1;
            };
        };

        let leaderboard_results = vector::empty<PostView>();
        let count = 0u64;
        let final_len = vector::length(&posts_to_sort);
        while (count < limit && count < final_len) {
            vector::push_back(&mut leaderboard_results, *vector::borrow(&posts_to_sort, count));
            count = count + 1;
        };
        leaderboard_results
    }

    fun find_post_index_by_id(posts_vec: &vector<Post>, post_id: u64): u64 {
        let i = 0;
        let len = vector::length(posts_vec);
        while (i < len) {
            if (vector::borrow(posts_vec, i).id == post_id) {
                return i
            };
            i = i + 1;
        };
        abort E_POST_NOT_FOUND
    }
}