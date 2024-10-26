import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const Ads = ({ ads, onDelete, isAdmin }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
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
    <div className="flex flex-col items-center justify-center w-full px-4 overflow-hidden">
      {ads.length > 0 ? (
        <div className="relative p-4 text-center transition-transform transform bg-white rounded-lg shadow-lg hover:scale-102 sm:w-[40rem] md:w-[50rem] w-full lg:w-[70rem] h-auto x-sm:w-[18.8rem]">
          <Image
            src={ads[currentIndex]?.imgSrc}
            alt={ads[currentIndex]?.description}
            className="rounded-lg w-full h-[70%] object-cover sm:h-[250px] h-[150px]"
            onClick={() => handleAdClick(ads[currentIndex]?.url)}
            width={400}
            height={400}
          />
          <p
            className="mt-2 text-sm text-lg font-semibold text-gray-800 text-start line-clamp-3 sm:text-lg"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
            }}
            title={ads[currentIndex]?.description}
          >
            {ads[currentIndex]?.description}
          </p>
          <div className="absolute top-2 right-4">
            {isAdmin && (
              <button
                onClick={() => onDelete(ads[currentIndex]?.id)}
                className="flex items-center px-2 py-1 text-red-600 transition duration-200 rounded hover:bg-red-50"
                title="Delete Ad"
              >
                <AiOutlineClose className="mr-1" />
                <span className="hidden sm:inline">Delete</span>
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
