// app/api/posts/route.js (or route.ts if using TypeScript)
import formidable from "formidable";
import fs from "fs";
import PostModal from "../../../models/postModel";
import connectMongo from "../../../utils/connectMongo";

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
      });
    } else {
      postData = await PostModal.find({});
    }

    return new Response(JSON.stringify(postData), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
}
// Helper to parse form with a Promise
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: false }); // Accept one file
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  export async function POST(req) {
    return new Response(JSON.stringify({ message: "API reached" }), {
      status: 200,
    });
  }
  



