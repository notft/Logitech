import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    let dataUrl: string;
    
    // Handle both cases: when the file is a string (data URL) or a Blob
    if (typeof file === 'string') {
      // Already a data URL from canvas.toDataURL()
      dataUrl = file;
    } else if (file instanceof Blob) {
      // Convert Blob to data URL
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    } else {
      return NextResponse.json(
        { error: 'Invalid file format' },
        { status: 400 }
      );
    }

    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    // For data URLs, we can just pass them directly to Cloudinary
    const result = await cloudinary.uploader.upload(dataUrl, {
      upload_preset: uploadPreset,
      folder: 'map-screenshots',
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}