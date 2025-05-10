import Link from "next/link";
import { Rock_Salt } from "next/font/google";

// Import the Rock Salt font
const rockSalt = Rock_Salt({
  weight: "400", // Specify weight as 400
  subsets: ["latin"],
});

export default function Header() {
  return (
    <header className="bg-white/30 backdrop-blur-lg border border-white/20 shadow-lg rounded-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/">
          <h1 className={`text-2xl pl-10 font-semibold tracking-[10px] ${rockSalt.className}`}>Blog</h1>
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="text-indigo-600 font-semibold">
            Home
          </Link>
          <Link href="/about" className="text-indigo-600 font-semibold">
            About
          </Link>
          <Link href="/contact" className="text-indigo-600 font-semibold">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
