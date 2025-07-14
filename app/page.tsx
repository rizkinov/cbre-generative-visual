"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/src/components/ui/button";
import { CBREButton } from "@/src/components/cbre/CBREButton";
import { CBREStyledCard } from "@/src/components/cbre/CBREStyledCard";
import { CBREArrowButton } from "@/src/components/cbre/CBREArrowButton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the elements example page
    router.push('/elements-example');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl font-calibre">Redirecting to UI elements...</p>
    </div>
  );
}
