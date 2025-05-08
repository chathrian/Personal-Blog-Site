import connectMongo from "@/utils/connectMongo";
import EnquiryModel from "@/models/enquiryModel";

export async function POST(req) {
  try {
    const { name, email, message, date } = await req.json();
    const enquiry = { name, email, message, date };
    await connectMongo();
    await EnquiryModel.create(enquiry);

    return Response.json({ message: "Successfully Submited" });
  } catch (error) {
    return Response.json({ message: error._message });
  }
}

export async function GET(req) {
  try {
    await connectMongo();
    const enquiryData = await EnquiryModel.find({}).sort({ created_at: -1 });;
    return Response.json(enquiryData);
  } catch (error) {
    return Response.json({ message: error.message });
  }
}