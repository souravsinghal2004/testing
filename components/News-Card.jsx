import React from 'react';
import { Card } from './ui/card';

export const NewsCard = ({ title, image, description, url, publishedAt, source }) => {
  // Format the published date
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });


  return (
   <Card className="bg-zinc-800 text-white rounded-xl overflow-hidden shadow-lg w-full max-w-md mx-auto">
  <div className="p-4">
    <h2 className="text-xl font-bold mb-2 line-clamp-2">{title}</h2>

    {/* ✅ Image Check + Fallback */}
    {image ? (
      <img
        src={image}
        alt={"/fallback.jpg"}
        className="w-full h-[200px] object-cover rounded-lg mb-4"
      />
    ) : (
     <img
        src={"/fallback.jpg"}
        alt={"Image Broke Due To Some Undefined Url"}
        className="w-full h-[200px] object-cover rounded-lg mb-4"
      />
    )}

    {/* ✅ Description */}
    <p className="text-sm text-gray-300 mb-4 line-clamp-3">
      {description || "No description available."}
    </p>

    {/* ✅ Read More */}
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:underline text-sm mb-4 inline-block"
    >
      Read Full Article →
    </a>

    {/* ✅ Footer Info */}
    <div className="flex justify-between text-xs text-gray-400 mt-2">
      <p>Published: {formattedDate}</p>
      <p>Source: {source || "Unknown"}</p>
    </div>
  </div>
</Card>

  );
};
