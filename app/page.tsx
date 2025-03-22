"use client";
import Loading from "@/components/ui/Loading";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false); 
      router.push("/auth/register");
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
      <h1>Main</h1>
      )}
    </>
  );
}
