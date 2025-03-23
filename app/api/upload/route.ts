import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    const cloudForm = new FormData();
    cloudForm.append("file", blob, file.name);
    cloudForm.append("upload_preset", "tester");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: cloudForm,
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Upload failed" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ message: "Upload successful", imgUrl: data.secure_url });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
