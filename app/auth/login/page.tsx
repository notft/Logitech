"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Lock, AlertCircle, Loader2, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
      setLoading(false)
      setError("Invalid credentials. Please try again.")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
     
      <div className="m-auto w-full max-w-6xl h-[600px] bg-slate-900 rounded-3xl overflow-hidden flex shadow-xl">
       
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-10">
              <h1 className="text-blue-400 text-3xl font-bold">LogiScale</h1>
            </div>
            <h2 className="text-gray-300 text-xl font-medium">Welcome back</h2>
            <p className="text-gray-400 mt-1">Please enter your details to sign in</p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center p-3 mb-4 text-sm rounded-lg bg-red-500/10 text-red-400 border border-red-500/30"
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
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Label htmlFor="username" className="text-gray-400">
                Username
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-gray-800 border border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 text-gray-200"
                  placeholder="johnsmith001@gmail.com"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Label htmlFor="password" className="text-gray-400">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-800 border border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 text-gray-200"
                  placeholder="••••••"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400"
                >
                  Remember me
                </label>
              </div>
              <Link href="#" className="text-sm text-blue-400 hover:text-blue-500 transition-colors">
                Forgot Password?
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-400 text-white h-11 rounded-full"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    className="flex items-center justify-center"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </motion.div>
                ) : (
                  "LOGIN"
                )}
              </Button>
            </motion.div>
          </form>
        </div>

        <div className="hidden lg:flex w-1/2 bg-slate-800 relative">
          <motion.img
            src="/logisiticP.png"
            alt="Logistics Illustration"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}
