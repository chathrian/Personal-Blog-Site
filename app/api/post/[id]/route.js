import PostModal from "../../../../models/postModel";
import connectMongo from "../../../../utils/connectMongo";

export async function GET(req, {params}) {
  try {
    await connectMongo();
    const { id } = await params;
    console.log("params", params)
    const postData = await PostModal.findOne({_id:id});
    return Response.json(postData);
  } catch (error) {
    return Response.json({ message: error.message });
  }
}
