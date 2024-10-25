"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/Authcontext';
import Ads from '../components/Ads/Ads';
import Cards from '../components/Cards/Cards';
import { Poll } from '@mui/icons-material';

import Chart from '../components/Chart/Chart'

import CreateAds from '../components/Ads/CreateAds'
import AllPOll from '../components/polls/AllPoll'
const Dashboard = () => {

  return (
    <div className='flex flex-col mt-10 lg:p-8 x-sm:mt-0 x-sm:mr-[12rem] '>
      <h1 className='p- text-[2rem] x-sm:p-0'>Dashboard</h1>
      <div >
        <CreateAds/>
      </div>
       <div className=''>
       <Cards/>
       </div>
       <div className='p-10 x-sm:p-0'>
        
      
       <h1 className='p-2 py-3 text-2xl font-bold border-l-4 border-l-blue-900 text-start'>Graph Analysis</h1>
       <div className='flex flex-col items-center justify-center gap-3 py-6 lg:ml-[10rem] md:ml-[1rem]'>
       
      <Chart/>
       </div>
       </div>
          <div className='p-10'>
          <h1 className='p-2 py-3 text-2xl font-bold border-l-4 border-l-blue-900 text-start'>Polls List</h1>
       
       <div className='flex flex-col gap-3 x-sm:pb-[6rem]' >
     
       {/* <PollComponent/> */}<AllPOll/>
       </div>
       
       </div>
    </div>
  );
};

export default Dashboard;
