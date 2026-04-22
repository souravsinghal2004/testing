"use client";
import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const cursorRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e) => {
      // Using requestAnimationFrame for maximum performance
      window.requestAnimationFrame(() => {
        if (cursor) {
          cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "20px",
        height: "20px",
        backgroundColor: "#00ffff", // Bright Cyan
        borderRadius: "50%",
        pointerEvents: "none",
        // This is the "Nuclear" Z-Index to stay above everything (Clerk, Modals, etc.)
        zIndex: 9999999, 
        boxShadow: "0 0 20px #00ffff, 0 0 40px #00ffff",
        marginLeft: "-10px", // Center the 20px circle
        marginTop: "-10px",  // Center the 20px circle
        border: "2px solid white", // Temporary border to help you find it
        willChange: "transform",
      }}
    />
  );
}