import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "../assets/logo";
import { motion, AnimatePresence } from "framer-motion";

import img1 from "@/assets/gym-assets/gym-1.jpg";
import img2 from "@/assets/gym-assets/gym-2.jpg";
import img3 from "@/assets/gym-assets/gym-3.jpg";
import img4 from "@/assets/gym-assets/gym-4.jpg";
import img5 from "@/assets/gym-assets/gym-5.jpg";
import img6 from "@/assets/gym-assets/gym-6.jpg";
import img7 from "@/assets/gym-assets/gym-7.jpg";

const gymImages = [img1, img2, img3, img4, img5, img6, img7];

const transitions = [
  // { opacity: 0, x: 100 }, // slide from right
  // { opacity: 0, x: -100 }, // slide from left
  { opacity: 0, scale: 0.8 }, // slide from right
  { opacity: 0, scale: 1.2 }, // slide from left
  { opacity: 0, scale: 0.8 }, // zoom in
  { opacity: 0, scale: 1.2 }, // zoom out
  { opacity: 0, scale: 0.8 }, // slide from bottom
  { opacity: 0, scale: 1.2 }, // slide from top
  // { opacity: 0, y: 100 }, // slide from bottom
  // { opacity: 0, y: -100 }, // slide from top
  { opacity: 0 }, // fade
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % gymImages.length);
    }, 10000); // 3.5 seconds per image
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
            {/* <LoginForm /> */}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={gymImages[index]}
            alt={`Gym ${index + 1}`}
            initial={transitions[index % transitions.length]}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={transitions[(index + 1) % transitions.length]}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
      </div>
    </div>
  );
}
