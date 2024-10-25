"use client";

import React from 'react';
import { useAuth } from '../context/Authcontext';
import Ads from '../components/Ads/Ads';
import Cards from '../components/Cards/Cards';
import { Poll } from '@mui/icons-material';

import Chart from '../components/Chart/Chart';
import CreateAds from '../components/Ads/CreateAds';
import AllPoll from '../components/polls/AllPoll';

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center lg:items-start lg:p-8 mt-10 x-sm:mt-4 sm:justify-center">
      <h1 className="text-3xl font-semibold text-center lg:text-left sm:text-left lg:ml-4 mb-6">Dashboard</h1>

      {/* Create Ads Section */}
      <div className="w-full flex justify-center lg:justify-start mb-6">
        <CreateAds />
      </div>

      {/* Cards Section */}
      <div className="w-full flex justify-center items-center mb-8">
        <Cards />
      </div>

      {/* Graph Analysis Section */}
      <div className="w-full px-4">
        <h1 className="text-2xl font-bold border-l-4 border-blue-900 pl-2 mb-4">Graph Analysis</h1>
        <div className="flex flex-col items-center justify-center gap-3 py-6 lg:ml-10 md:ml-4">
          <Chart />
        </div>
      </div>

      {/* Polls List Section */}
      <div className="w-full px-4 mb-10">
        <h1 className="text-2xl font-bold border-l-4 border-blue-900 pl-2 mb-4">Polls List</h1>
        <div className="flex flex-col gap-4 x-sm:pb-16">
          <AllPoll />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
