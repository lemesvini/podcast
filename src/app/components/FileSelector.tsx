import { useEffect, useState } from "react";
import Image from "next/image";

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

interface YouTubeAPIResponse {
  items: YouTubeVideo[];
}

const FileSelector = ({ onVideoSelect }: { onVideoSelect: (videoId: string) => void }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const apiKey = "AIzaSyAOvd1BZwdxspJgOaTrSvQ9CHN7NUTwl70";
  const channelId = "UCHp3gWr4QlKv5cF0d6sZczg";

  // Fetch videos from the YouTube API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`
        );

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data: YouTubeAPIResponse = await response.json();

        // Ensure items exist in the response
        if (!data.items) {
          throw new Error("No videos found in the response.");
        }

        // Filter valid video items
        const videoItems = data.items?.filter(item => item.id.videoId) || [];
        setVideos(videoItems);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        setVideos([]); // Set videos to an empty array in case of an error
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-black p-4">
      {selectedVideoId ? (
        // Display the selected video player
        <div className="w-full h-full flex justify-center items-center bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        // Display the video list
        videos.map(video => (
          <button
            key={video.id.videoId}
            className="flex items-center justify-between p-2 mb-2 bg-green-800 transition duration-200"
            onClick={() => {
              setSelectedVideoId(video.id.videoId);
              onVideoSelect(video.id.videoId); 
            }}
          >
            {/* Title */}
            <span className="text-white font-medium">{video.snippet.title}</span>
            <div className="w-20 h-16 mr-4 flex-shrink-0 relative">
              {/* Thumbnail */}
              <Image
                src={video.snippet.thumbnails.high.url}
                alt={video.snippet.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            
          </button>
        ))
      )}
    </div>
  );
};

export default FileSelector;
