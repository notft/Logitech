/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import Loading from "@/components/ui/Loading";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
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
