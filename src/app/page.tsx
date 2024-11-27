"use client";
import { useState } from "react";
import Image from "next/image";
import FileSelector from "./components/FileSelector";
import tvFrame from "../../public/tvbackclean.webp";
import staticFrame from "../../public/tvstatic.gif";

export default function Home() {
  const [isTvOn, setIsTvOn] = useState(false);
  const [showStatic, setShowStatic] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Turn the TV on
  const turnTvOn = () => {
    setIsTvOn(true); // Turn the TV on
    setShowStatic(true); // Show the static frame

    // After 2 seconds, hide the static frame and show content
    setTimeout(() => {
      setShowStatic(false);
    }, 700);
  };

  // Turn the TV off
  const turnTvOff = () => {
    setIsTvOn(false); // Turn the TV off
    setShowStatic(false); // Immediately hide static and content
    setSelectedVideo(null); // Clear selected video
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col md:items-center justify-center p-12">
      {isTvOn && (
        <div
          className="absolute h-full w-full opacity-20"
          style={{
            background: "radial-gradient(circle, black 60%, rgba(255, 255, 255, 0.8) 160%, white 100%)",
          }}
        ></div>
      )}

      <div className="relative" style={{ height: 500, width: 700 }}>
        {/* TV Frame */}
        <Image src={tvFrame} alt="Old TV" style={{ objectFit: "cover" }} />

        {/* Screen Content */}
        <div className="absolute top-[8%] left-[12%] w-[76%] h-[62%] border rounded-md flex items-center justify-center transition-all duration-500">
          {isTvOn ? (
            showStatic ? (
              // Static frame displayed initially
              <Image
                className="w-full h-full opacity-100 transition-opacity duration-[2000ms] ease-out"
                src={staticFrame}
                alt="Static TV Frame"
                style={{ objectFit: "cover" }}
              />
            ) : selectedVideo ? (
              // Selected video player
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              // File selector when no video is selected
              <FileSelector onVideoSelect={(videoId) => setSelectedVideo(videoId)} />
            )
          ) : (
            // Black screen when TV is off
            <div className="w-full h-full bg-black opacity-60"></div>
          )}
        </div>

        {/* Buttons */}
        <div className="absolute top-[77%] w-[25.5%] left-[50%] translate-x-[-50%] h-6 rounded-md shadow-md flex flex-row items-center">
          {isTvOn && (
            <div
              className="fixed left-[63.5%] bottom-[20%] w-3 h-3 rounded-full opacity-90"
              style={{
                background: "radial-gradient(circle, rgba(239, 68, 68, 1) 0%, black 100%)",
              }}
            ></div>
          )}
          <button
            onClick={isTvOn ? turnTvOff : turnTvOn}
            className="cursor-pointer text-transparent ml-auto h-8 w-7 flex items-center justify-center"
          >
            {isTvOn ? "Off" : "On"}
          </button>
        </div>
      </div>
    </div>
  );
}
