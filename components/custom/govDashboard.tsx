"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const videoSources = [
  "https://www.shutterstock.com/shutterstock/videos/3748279689/preview/stock-footage-kochi-kerala-india-shot-of-a-narrow-street-bustling-with-parked-and-passing-tuk.webm",
  "https://www.shutterstock.com/shutterstock/videos/3687812423/preview/stock-footage-the-bustling-mallappally-town-in-kerala-th-january.webm",
  "https://www.shutterstock.com/shutterstock/videos/14073356/preview/stock-footage-kozhikode-ctiy-scape-kozhikode-kerala-india-december-kozhikode-also-known-as-calicut-is-a.webm",
  "https://media.istockphoto.com/id/684764514/video/old-cctv-security-camera.mp4?s=mp4-640x640-is&k=20&c=S95ztafzN62XOYFeiKDEgH8CaT_jAIEjjyLAhTf1J0k=",
  "https://media.istockphoto.com/id/476719522/video/paulista-busy-avenue-traffic.mp4?s=mp4-640x640-is&k=20&c=Yf0ttb_cw81wGFMVqPcfkWiAbC3pNTHA78YK2LRlDu4=",
  "https://media.istockphoto.com/id/492769488/video/traffic-on-multiple-lane-highway-in-thailand.mp4?s=mp4-640x640-is&k=20&c=etJRLSWzfqrKlHr0CApGx8J3DTTm6827rtCAgtbzjaY=",
  "https://media.istockphoto.com/id/1403829292/video/beijing-urban-main-road.mp4?s=mp4-640x640-is&k=20&c=2WtxTYRuJF2BuDzm4QP3vfOa9s10AJhVVanZ78DJHmk=",
  "https://media.istockphoto.com/id/462839646/video/street-traffic-in-kerala-india.mp4?s=mp4-640x640-is&k=20&c=q5yN8Fnj-PogvvulwnFq7J1nAwBa5dDgl64tWrcQe1Y=",
  "https://www.shutterstock.com/shutterstock/videos/1044159811/preview/stock-footage--k-timelapse-shot-of-traffic-management-at-four-way-junction-of-kochi-the-beautiful-city-of-india.webm",
  "https://www.shutterstock.com/shutterstock/videos/2141324/preview/stock-footage-trivandrum-india-feb-indian-street-traffic-february-in-trivandrum-kerala-india.webm",
  "https://www.shutterstock.com/shutterstock/videos/1110194567/preview/stock-footage-kerala-india-oct-aerial-view-of-cars-and-vehicles-in-a-traffic-jam-during-the-rush-hour.webm",
  "https://www.shutterstock.com/shutterstock/videos/1104232661/preview/stock-footage-munnar-kerala-india-may-local-area-in-monsoon.webm",
]

export default function GovDash() {
  const [layout, setLayout] = useState<"grid" | "compact">("grid")
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [alertCount, setAlertCount] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [visibleCameras, setVisibleCameras] = useState<number[]>([...Array(videoSources.length).keys()])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videoSources.length)
  }, [videoSources.length])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())

      if (Math.random() > 0.95) {
        setAlertCount((prev) => prev + 1)

        const randomCameraIndex = Math.floor(Math.random() * videoSources.length)
        const cameraElement = document.getElementById(`camera-${randomCameraIndex}`)
        if (cameraElement) {
          cameraElement.classList.add("alert-flash")
          setTimeout(() => {
            cameraElement.classList.remove("alert-flash")
          }, 1000)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleVideoClick = (index: number) => {
    setSelectedCamera(selectedCamera === index ? null : index)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)

    videoRefs.current.forEach((video) => {
      if (video) {
        if (isPaused) {
          video.play().catch((e) => console.error("Error playing video:", e))
        } else {
          video.pause()
        }
      }
    })
  }
const logOut = ()=> {
  Cookies.remove("token");
Cookies.remove("type");
window.location.href = "/";
}
  const toggleFullscreen = (index: number) => {
    if (selectedCamera === index) {
      setSelectedCamera(null)
      setIsFullscreen(false)
    } else {
      setSelectedCamera(index)
      setIsFullscreen(true)
    }
  }

  const itemsPerPage = 4
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(videoSources.length / itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const start = currentPage * itemsPerPage
    const end = start + itemsPerPage
    setVisibleCameras([...Array(videoSources.length).keys()].slice(start, end))
  }, [currentPage])

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

  const statsCardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.2 },
    },
  }

  const fullscreenVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <motion.header
        className="sticky top-0 z-10 border-b border-gray-800 p-4 backdrop-blur-md bg-black/60"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white">
              Logi
              <motion.span
                className="text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Scale
              </motion.span>
              <span className="text-sm font-normal text-gray-400 ml-2">Government Monitoring</span>
            </h1>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-800/50 transition-colors duration-200">
                  <Menu className="h-5 w-5 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-950/90 text-white border-gray-800 backdrop-blur-md">
                <DropdownMenuItem className="hover:bg-gray-800/50 focus:bg-gray-800/50 cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logOut} className="hover:bg-gray-800/50 focus:bg-gray-800/50 cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </motion.header>

      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} whileHover="hover">
            <motion.div variants={statsCardVariants}>
              <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-blue-500/5"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <CardContent className="p-4 flex items-center gap-4 relative z-10">
                  <motion.div
                    className="bg-blue-500/20 p-3 rounded-full"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Shield className="h-6 w-6 text-blue-500" />
                  </motion.div>
                  <div>
                    <p className="text-gray-400 text-sm">Active Cameras</p>
                    <motion.p
                      className="text-2xl text-white font-bold"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {videoSources.length}
                    </motion.p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover">
            <motion.div variants={statsCardVariants}>
              <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-amber-500/5"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                <CardContent className="p-4 flex items-center gap-4 relative z-10">
                  <motion.div
                    className="bg-amber-500/20 p-3 rounded-full"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  </motion.div>
                  <div>
                    <p className="text-gray-400 text-sm">Alerts Today</p>
                    <motion.p
                      className="text-2xl text-white font-bold"
                      key={alertCount}
                      initial={{ scale: 1.2, color: "#f59e0b" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.3 }}
                    >
                      {alertCount}
                    </motion.p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover">
            <motion.div variants={statsCardVariants}>
              <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-green-500/5"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
                <CardContent className="p-4 flex items-center gap-4 relative z-10">
                  <motion.div
                    className="bg-green-500/20 p-3 rounded-full"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Users className="h-6 w-6 text-green-500" />
                  </motion.div>
                  <div>
                    <p className="text-gray-400 text-sm">Personnel On Duty</p>
                    <motion.p
                      className="text-2xl text-white font-bold"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      24
                    </motion.p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover">
            <motion.div variants={statsCardVariants}>
              <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-purple-500/5"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
                <CardContent className="p-4 flex items-center gap-4 relative z-10">
                  <motion.div
                    className="bg-purple-500/20 p-3 rounded-full"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Calendar className="h-6 w-6 text-purple-500" />
                  </motion.div>
                  <div>
                    <p className="text-gray-400 text-sm">Current Time</p>
                    <motion.p
                      className="text-2xl text-white font-bold"
                      key={currentTime}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentTime}
                    </motion.p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-between items-center mb-6 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              className="bg-gray-900/50 border-gray-800 hover:bg-gray-800"
              disabled={totalPages <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-400">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              className="bg-gray-900/50 border-gray-800 hover:bg-gray-800"
              disabled={totalPages <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-gray-900/50 border-gray-800 hover:bg-gray-800 transition-all duration-300"
                onClick={togglePause}
              >
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
            </motion.div>

            <motion.div
              className="flex bg-gray-900/50 rounded-md p-1 border border-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
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
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isFullscreen && selectedCamera !== null ? (
            <motion.div
              key="fullscreen"
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              variants={fullscreenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="relative w-full max-w-6xl aspect-video">
                <video
                  className="w-full h-full object-cover rounded-lg"
                  autoPlay
                  muted
                  loop
                  ref={(el) => {
                    if (selectedCamera !== null) {
                      videoRefs.current[selectedCamera] = el
                    }
                  }}
                >
                  <source src={videoSources[selectedCamera]} type="video/mp4" />
                </video>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium">Camera #{selectedCamera + 1}</p>
                      <p className="text-sm text-gray-400">Sector {String.fromCharCode(65 + (selectedCamera % 6))}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFullscreen(selectedCamera)}
                      className="hover:bg-gray-800/50"
                    >
                      Close
                    </Button>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  LIVE
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

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
          {videoSources.map((src, index) => {
             const isMobile = typeof window !== "undefined" && window.innerWidth < 640
            const shouldShow = isMobile ? visibleCameras.includes(index) : true

            if (!shouldShow) return null

            return (
              <motion.div
                key={index}
                className={cn(
                  "relative rounded-lg overflow-hidden shadow-lg transform-gpu",
                  selectedCamera === index && !isFullscreen ? "md:col-span-2 md:row-span-2" : "",
                )}
                variants={itemVariants}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                id={`camera-${index}`}
                layoutId={`camera-${index}`}
              >
                <video
                  className="rounded w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  onClick={() => handleVideoClick(index)}
                  ref={(el) => {
                    videoRefs.current[index] = el
                  }}
                >
                  <source src={src} type="video/mp4" />
                </video>

                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
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
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFullscreen(index)
                        }}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="absolute top-3 left-3 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  LIVE
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <style jsx global>{`
        .alert-flash {
          animation: flash 1s ease;
        }
        
        @keyframes flash {
          0%, 100% { box-shadow: 0 0 0 rgba(239, 68, 68, 0); }
          50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.7); }
        }
      `}</style>
    </div>
  )
}

