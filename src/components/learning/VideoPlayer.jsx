import React from 'react';

const EMBED_BASE = 'https://www.youtube.com/embed/';

export default function VideoPlayer({ videoId, title }) {
  const src = videoId ? `${EMBED_BASE}${videoId}` : null;

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      {src ? (
        <iframe
          title={title || 'Lesson video'}
          src={src}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Select a lesson
        </div>
      )}
    </div>
  );
}
