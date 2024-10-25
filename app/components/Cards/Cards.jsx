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

    const fetchPollCount = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const pollsRef = collection(db, 'polls');
        const userPollsQuery = query(pollsRef, where('creatorId', '==', currentUser.uid));
        const userPollsSnapshot = await getDocs(userPollsQuery);

        setPollCount(userPollsSnapshot.size);
      }
    };

    const fetchData = () => {
      const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        setActiveUserCount(snapshot.size);
      });

      fetchPollCount();

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
    <div className="flex  items-center justify-center gap-4 sm:flex-row sm:gap-8 x-sm:flex-col">
      {stats.map((item, index) => (
        <div
          key={index}
          className="text-center flex flex-col x-sm:flex-row x-sm:gap-2 sm:flex-row items-center w-full sm:w-[20rem]  lg:w-[23rem] p-6 rounded-[10px] border border-blue-600 shadow-md shadow-blue-300 hover:shadow-blue-600 transition-shadow duration-300 ease-in-out bg-blue-800"
        >
          <div className="flex flex-col items-center gap-2 sm:mr-4">
            <p className="text-lg md:text-xl font-extrabold text-white">{item.title}</p>
            <div className="flex items-center">
              <CountUp
                end={item.num}
                duration={5}
                delay={2}
                className="text-3xl md:text-4xl font-bold text-white"
              />
              <Image
                src={item.png}
                width={30}
                height={30}
                alt="icon"
                className="h-7 w-8 ml-2"
              />
            </div>
          </div>
          <div className="flex items-center justify-center mt-4 sm:mt-0">
            <Image
              src={item.image}
              width={100}
              height={100}
              alt={item.title}
              className="h-24 w-24 rounded-full border-2 p-2"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
