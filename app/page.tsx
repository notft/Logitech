"use client";
import Loading from "@/components/ui/Loading";
import React, { useState, useEffect } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false); 
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
