import jwt from 'jsonwebtoken';
import connectMongo from "../../../utils/connectMongo";
import Admin from '../../../models/admin';  // Import the Admin model

// Export POST method for handling login
export async function POST(req) {
  const { username, password } = await req.json();  // Next.js uses req.json() in App Router

  if (!username || !password) {
    return new Response(JSON.stringify({ message: 'Username and password are required' }), { status: 400 });
  }

  try {
    await connectMongo(); // Connect to MongoDB using Mongoose

    // Query the 'admin' collection using the Admin model
    const user = await Admin.findOne({username});
console.log("user", user, "username", username, "password", password)
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 401 });
    }

    if (password !== user.password) {
      return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = new Response(JSON.stringify({ message: 'Login Success' }), { status: 200 });
    res.headers.set(
      'Set-Cookie',
      `token=${token}; Path=/; SameSite=Strict; Max-Age=3600` // 1 hour expiration
    );

    return res;

  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
