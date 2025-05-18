import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Copy, Check, User } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AccountInfo() {
  const { account } = useWallet();
  const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({});
  
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({...copyStatus, [field]: true});
    
    setTimeout(() => {
      setCopyStatus({...copyStatus, [field]: false});
    }, 2000);
  };
  
  // Format address for display (first 6 and last 4 chars)
  const formatAddress = (address: string) => {
    if (!address) return "Not Connected";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-green-100">
          <AvatarFallback className="bg-green-100 text-green-700">
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium text-gray-800">
            {account?.ansName || "SecretSips User"}
          </h4>
          <p className="text-sm text-gray-500">
            Connected with {account?.address ? "APT wallet" : "No wallet"}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {account?.address && (
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-green-100">
            <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-gray-700 truncate">
                {formatAddress(account.address.toString())}
              </p>
              <button 
                onClick={() => copyToClipboard(account.address.toString(), 'address')}
                className="h-6 w-6 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              >
                {copyStatus['address'] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        )}

        {account?.publicKey && (
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-green-100">
            <p className="text-xs text-gray-500 mb-1">Public Key</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-gray-700 truncate">
                {`${account.publicKey.toString().substring(0, 6)}...${account.publicKey.toString().substring(account.publicKey.toString().length - 4)}`}
              </p>
              <button 
                onClick={() => copyToClipboard(account.publicKey.toString(), 'publicKey')}
                className="h-6 w-6 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              >
                {copyStatus['publicKey'] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        )}
        
        {account?.ansName && (
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-green-100">
            <p className="text-xs text-gray-500 mb-1">ANS Name</p>
            <p className="text-sm font-medium text-gray-700">{account.ansName}</p>
          </div>
        )}
      </div>
    </div>
  );
}
