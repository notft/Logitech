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
    <div className="flex min-h-screen bg-slate-950 items-center justify-center px-4 sm:px-8">
    <div className="w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center text-center p-8 shadow-lg">

    <div className="w-full p-6 sm:p-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold">
              <span className="text-white ">Logi</span>
              <span className="text-red-400">Scale</span>
            </h1>
            <h2 className="text-gray-300 text-xl font-medium mt-2">Welcome back</h2>
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
                  className="text-sm font-medium text-gray-400"
                >
                  Remember me
                </label>
              </div>
              <Link href="/auth/register" className="text-sm text-blue-400 hover:text-blue-500 transition-colors">
                Register
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
                    transition={{ duration: 1, repeat: Infinity }}
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

       
      </div>
    </div>
  )
}
