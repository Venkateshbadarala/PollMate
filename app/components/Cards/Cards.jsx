"use client";

import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { getFirestore, collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Image from 'next/image';
import pic1 from '../../Assets/images/Poll.png';
import pic2 from '../../Assets/images/users.png';
import png1 from '../../Assets/images/Up.png';
import png3 from '../../Assets/images/Increase.png';

const Cards = () => {
  const [pollCount, setPollCount] = useState(0);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [successPredictionCount] = useState(98); // Static for now

  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();

    // Function to fetch polls created by the logged-in user
    const fetchPollCount = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const pollsRef = collection(db, 'polls');
        const userPollsQuery = query(pollsRef, where('creatorId', '==', currentUser.uid)); // Filter polls by creatorId
        const userPollsSnapshot = await getDocs(userPollsQuery);

        setPollCount(userPollsSnapshot.size); // Set the count of polls created by the user
      }
    };

    // Fetch active user count and polls
    const fetchData = () => {
      // Listener for users count
      const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        setActiveUserCount(snapshot.size); // Set the number of active users
      });

      // Fetch poll count for the logged-in user
      fetchPollCount();

      // Cleanup function for the snapshot listener
      return () => {
        unsubscribeUsers();
      };
    };

    fetchData();
  }, []);

  const stats = [
    {
      num: pollCount,
      title: 'Number of Polls',
      image: pic1,
      png: png1,
    },
    {
      num: activeUserCount,
      title: 'Active Users',
      image: pic2,
      png: png3,
    },
  ];

  return (
    <div className='flex items-center justify-center gap-8 p-3 sm:flex-row sm:gap-1 x-sm:gap-8 lg:gap-8 x-sm:flex-col '>
      {stats.map((item, index) => (
        <div
          key={index}
          className="text-center mx-1 flex relative flex-row justify-around items-center w-[23rem] h-[10rem] rounded-[10px] border border-blue-600 shadow-md shadow-blue-300 hover:shadow-blue-600 transition-shadow duration-300 ease-in-out p-4 bg-blue-800"
        >
          <div className="flex flex-col gap-2">
            <p className="text-[20px] font-extrabold text-white">{item.title}</p>
            <div className="flex items-center ml-7">
              <CountUp
                end={item.num}
                duration={5}
                delay={2}
                className="text-[3rem] font-bold text-white"
              />
              <Image
                src={item.png}
                width={300}
                height={300}
                alt="icon"
                className="object-fit h-[1.8rem] w-[2.3rem]"
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src={item.image}
              width={300}
              height={300}
              alt={item.title}
              className="mb-2 h-[6rem] w-[6rem] rounded-full border-2 p-4"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
