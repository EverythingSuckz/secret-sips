import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large (max 5MB)' },
        { status: 400 }
      );
    }

    const uploadData = new FormData();
    uploadData.append('key', process.env.FREEIMAGE_API_KEY || '');
    uploadData.append('action', 'upload');
    uploadData.append('source', file);
    uploadData.append('format', 'json');

    const response = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: uploadData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to hosting service');
    }

    const data = await response.json();
    
    if (data.status_code === 200 && data.success) {
      return NextResponse.json({
        url: data.image.url,
        success: true,
      });
    } else {
      throw new Error(data.status_txt || 'Unknown error from image host');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: (error as Error).message },
      { status: 500 }
    );
  }
}
