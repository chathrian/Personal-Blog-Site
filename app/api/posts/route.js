// app/api/posts/route.js (or route.ts if using TypeScript)
import formidable from "formidable";
import fs from "fs";
import PostModal from "../../../models/postModel";
import connectMongo from "../../../utils/connectMongo";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";

// Disable Next.js built-in body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req) {
  const query = req.nextUrl.searchParams.get("q");
  console.log("query", query);

  try {
    await connectMongo();
    let postData;

    if (query) {
      postData = await PostModal.find({
        $or: [
          { title: new RegExp(query, "i") },
          { description: new RegExp(query, "i") },
        ],
      }).sort({ created_at: -1 });;
    } else {
      postData = await PostModal.find({}).sort({ created_at: -1 });;
    }

    return new Response(JSON.stringify(postData), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
}

  export async function POST(req) {
    try {
      const formData = await req.formData();
      const title = formData.get("title");
      const description = formData.get("description");
      const date = formData.get("date");
      const file = formData.get("image");
  
      if (!file || !title) {
        return NextResponse.json({ error: "Missing title or file" }, { status: 400 });
      }
  
      // Convert the file to a Buffer and then to a base64 string
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mime = file.type;
      const dataUri = `data:${mime};base64,${base64}`;
  
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "nextjs-uploads",
      });
  
      // Save to MongoDB
      await connectMongo();
      const post = await PostModal.create({
        title,
        description,
        created_at:date,
        image: uploadResult.secure_url,
      });
  
      return NextResponse.json({ success: true, post });
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  
  }

  export async function PUT(req) {
    try {
      const formData = await req.formData();
      const id = formData.get("id");
      const title = formData.get("title");
      const description = formData.get("description");
      const date = formData.get("date");
      const file = formData.get("image");
  
      if (!id) {
        return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
      }
  
      await connectMongo();
  
      const updateData = {
        title,
        description,
        created_at: date,
      };
  
      // Handle image upload if a new file is provided
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString("base64");
        const mime = file.type;
        const dataUri = `data:${mime};base64,${base64}`;
  
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "nextjs-uploads",
        });
  
        updateData.image = uploadResult.secure_url;
      }
  
      const updatedPost = await PostModal.findByIdAndUpdate(id, updateData, {
        new: true,
      });
  
      if (!updatedPost) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, post: updatedPost });
    } catch (error) {
      console.error("Update Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
  export async function DELETE(req) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
  
      if (!id) {
        return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
      }
  
      await connectMongo();
  
      const deletedPost = await PostModal.findByIdAndDelete(id);
  
      if (!deletedPost) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, message: "Post deleted" });
    } catch (error) {
      console.error("Delete Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }


  



