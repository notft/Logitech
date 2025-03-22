"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, Lock, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating login process
    setTimeout(() => {
      setLoading(false);
      setError("Invalid credentials!"); // Example error message
    }, 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <Card className="relative bg-gray-800/20 border-gray-700/30 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden w-[380px] p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl z-0"></div>

        <CardHeader className="relative z-10 pb-2 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
              Login to BloodLink
            </CardTitle>
            <p className="text-gray-400 mt-2 text-sm">
              Your connection to life-saving donations
            </p>
          </motion.div>
        </CardHeader>

        <CardContent className="relative z-10 pt-4">
          <motion.div 
            className="mb-6 flex justify-center space-x-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              type="button"
              variant={loginType === "email" ? "default" : "outline"}
              onClick={() => setLoginType("email")}
              className="relative overflow-hidden bg-gray-700/30 border-gray-600/50 text-white"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button
              type="button"
              variant={loginType === "phone" ? "default" : "outline"}
              onClick={() => setLoginType("phone")}
              className="relative overflow-hidden bg-gray-700/30 border-gray-600/50 text-white"
            >
              <Phone className="mr-2 h-4 w-4" />
              Phone
            </Button>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center p-3 mb-4 text-sm rounded-lg bg-red-500/20 text-red-200 border border-red-500/30"
              >
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Label htmlFor="identifier" className="text-gray-100 flex items-center">
                {loginType === "email" ? (
                  <>
                    <Mail className="h-4 w-4 mr-2 text-red-400" />
                    Email Address
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2 text-red-400" />
                    Phone Number
                  </>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="identifier"
                  type={loginType === "email" ? "email" : "tel"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="bg-gray-700/30 border-gray-600/50 text-white placeholder-gray-400 pl-10 focus:border-red-500/50 focus:ring-red-500/20 transition-all duration-300"
                  placeholder={loginType === "email" ? "your.email@example.com" : "Your phone number"}
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Label htmlFor="password" className="text-gray-100 flex items-center">
                <Lock className="h-4 w-4 mr-2 text-red-400" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700/30 border-gray-600/50 text-white placeholder-gray-400 pl-10 focus:border-red-500/50 focus:ring-red-500/20 transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-none mt-6 h-11"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    className="flex items-center justify-center"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </motion.div>
                ) : (
                  "Login"
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div 
            className="mt-6 text-center text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-red-400 hover:text-red-300 transition-colors font-medium">
                Sign up
              </Link>
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
