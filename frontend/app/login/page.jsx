'use client';

import { Button } from '@/components/ui/button';
import { SignInButton , useUser } from '@clerk/nextjs';
import Link from 'next/link';


export default function Home() {
  const { user } = useUser();
 

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        
        <SignInButton mode='modal' afterSignInUrl="/onboarding"/>
      </div>
    );
  }
  

  return (
    <div className="flex items-center justify-center h-screen">
      Welcome {user.firstName}!
      <Link href="/onboarding">
      <Button >Onboarding</Button>
      </Link>

    </div>
  );
}