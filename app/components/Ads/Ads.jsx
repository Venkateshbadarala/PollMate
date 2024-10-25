import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Importing the cross icon from react-icons

const Ads = ({ ads, onDelete, isAdmin }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Only set interval if there are ads available
    if (ads.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [ads.length]);

  const handleAdClick = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {ads.length > 0 ? (
        <div className="lg:w-full relative p-4 text-center transition-transform transform bg-white rounded-lg shadow-lg hover:scale-102 sm:w-[40rem] md:w-[50rem] x-sm:w-[25rem] h-[10rem]">
          {/* Ad Image */}
          <Image
            src={ads[currentIndex]?.imgSrc} // Use optional chaining
            alt={ads[currentIndex]?.description} // Use optional chaining
            className="rounded-lg w-full h-[70%] object-contain" // Adjust image height to 70%
            onClick={() => handleAdClick(ads[currentIndex]?.url)} // Use optional chaining
          />
          {/* Description */}
          <p
            className="mt-2 overflow-hidden text-lg font-semibold text-gray-800 text-start line-clamp-3"
            style={{
              display: '-webkit-box', // Required for webkit-based browsers
              WebkitBoxOrient: 'vertical', // Specify the vertical orientation of the box
              WebkitLineClamp: 3, // Limit the text to 3 lines
              overflow: 'hidden', // Hide the overflowing text
            }}
            title={ads[currentIndex]?.description} // Add tooltip for full description
          >
            {ads[currentIndex]?.description} {/* Truncate description to 2-3 lines */}
          </p>
          <div className="absolute top-2 right-4">
            {isAdmin && (
              <button
                onClick={() => onDelete(ads[currentIndex]?.id)} // Use ad id for deletion
                className="flex items-center px-4 py-2 mt-2 text-red-600 transition duration-200 rounded"
                title="Delete Ad" // Tooltip for accessibility
              >
                <AiOutlineClose className="mr-2" /> {/* Cross icon with some margin */}
                <span className="hidden sm:inline">Delete</span> {/* Show text only on larger screens */}
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No ads available.</p>
      )}
    </div>
  );
};

export default Ads;
