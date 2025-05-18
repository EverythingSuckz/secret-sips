import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Route handler for image uploads
 * Processes image file uploads and sends them to freeimage.host
 */
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

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large (max 5MB)' },
        { status: 400 }
      );
    }

    const apiKey = process.env.FREEIMAGE_API_KEY;
    if (!apiKey) {
      console.error('Missing FREEIMAGE_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const uploadData = new FormData();
    uploadData.append('key', apiKey);
    uploadData.append('action', 'upload');
    uploadData.append('source', file);
    uploadData.append('format', 'json');

    const response = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: uploadData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image host response error:', response.status, errorText);
      return NextResponse.json(
        { 
          error: 'Failed to upload image to hosting service', 
          status: response.status,
          details: response.statusText 
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    
    if (data.status_code === 200 && data.success) {
      return NextResponse.json({
        url: data.image.url,
        success: true,
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Image hosting service error', 
          details: data.status_txt || 'Unknown error from image host'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: 'Failed to upload image', details: errorMessage },
      { status: 500 }
    );
  }
}
