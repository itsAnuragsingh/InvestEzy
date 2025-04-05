"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function IntroNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4  backdrop-blur-md">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-semibold text-black">
          INVESTEzy
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <SignedOut>
          <SignInButton
            mode="modal"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 px-4 py-2 rounded"
          >
            Sign-in
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              Dashboard
            </Button>
          </Link>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}