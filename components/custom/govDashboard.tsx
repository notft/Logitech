"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import {
  Menu,
  Grid3x3,
  Grid2x2,
  Shield,
  AlertTriangle,
  Users,
  Calendar,
  PlayCircle,
  PauseCircle,
  Maximize2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const videoSources = Array(12).fill(null).map((_, index) => `/cctv${(index % 3) + 1}.mp4`)

export default function GovDash() {
  const [layout, setLayout] = useState<"grid" | "compact">("grid")
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [alertCount, setAlertCount] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())
      if (Math.random() > 0.95) {
        setAlertCount((prev) => prev + 1)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleVideoClick = (index: number) => {
    setSelectedCamera(selectedCamera === index ? null : index)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)

    const videos = document.querySelectorAll("video")
    videos.forEach((video) => {
      if (isPaused) {
        video.play()
      } else {
        video.pause()
      }
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.header
        className="border-b border-gray-800 p-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white ">
              Logi<span className="text-red-600">Scale</span> <span className="text-sm font-normal text-gray-400">Government Monitoring</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
           

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-950/70 text-white border-gray-800">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto p-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Cameras</p>
                  <p className="text-2xl text-white font-bold">{videoSources.length}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-amber-500/20 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Orders Today</p>
                  <p className="text-2xl text-white font-bold">{alertCount}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Personnel On Duty</p>
                  <p className="text-2xl text-white font-bold">24</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Current Time</p>
                  <p className="text-2xl text-white font-bold">{currentTime}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-end items-center mb-6 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >

          <div className="flex items-center gap-4 text-black">
            <Button variant="outline" size="sm" className="gap-2" onClick={togglePause}>
              {isPaused ? (
                <>
                  <PlayCircle className="h-4 w-4" /> Resume
                </>
              ) : (
                <>
                  <PauseCircle className="h-4 w-4" /> Pause All
                </>
              )}
            </Button>

            <div className="flex bg-gray-900 rounded-md p-1">
              <Button
                variant={layout === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="px-2"
                onClick={() => setLayout("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={layout === "compact" ? "secondary" : "ghost"}
                size="sm"
                className="px-2"
                onClick={() => setLayout("compact")}
              >
                <Grid2x2 className="h-4 w-4" />
              </Button>
            </div>

           
          </div>
        </motion.div>
        <motion.div
          className={`grid gap-4 ${
            layout === "grid"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
          }`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {videoSources.map((src, index) => (
            <motion.div
              key={index}
              className={`relative rounded-lg overflow-hidden ${
                selectedCamera === index ? "col-span-2 row-span-2" : ""
              }`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <video
                className="rounded w-full h-full object-cover"
                autoPlay
                muted
                loop
                onClick={() => handleVideoClick(index)}
              >
                <source src={src} type="video/mp4" />
              </video>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Camera #{index + 1}</p>
                    <p className="text-xs text-gray-400">Sector {String.fromCharCode(65 + (index % 6))}</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white/80 hover:text-white"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="absolute top-3 left-3 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

