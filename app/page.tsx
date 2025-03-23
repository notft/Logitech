/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import Loading from "@/components/ui/Loading";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const type = Cookies.get("type");
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false); 
      if(type==="admin"){
      router.push("/government/dashboard");
      }else if(type==="driver"){
        router.push("/driver");
      }else if(type==="company"){
        router.push("/company");
      }else{
        router.push("/auth/login");
      }
    }, 4000);
    return () => clearTimeout(timeoutId);
    
  }, []);
   return (
    <>
    <Loading/>
    </>
   )
}
