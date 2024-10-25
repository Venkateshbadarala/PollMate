"use client";

import React from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SearchComponent from './SearchComponent'
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/Authcontext';

import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore'; 
import BurgerMenu from '../Sidebar/BurgerMenu'
import CreatePoll from '../polls/CreatePoll'
const Navbar = () => {
  const { userData } = useAuth();
  const db = getFirestore();

  return (
    <div className='flex flex-row items-center  lg:justify-between x-sm:p-0 md:p-1 md:gap-8 sm:gap-[4.5rem] lg:gap-[14rem]'>
      <div className='flex items-center '>
        <div className='sm:hidden x-sm:hidden md:flex lg:hidden'>
        <BurgerMenu/>
        </div>
      
     
      <div className='flex flex-col items-start '>
        <h1 className='p-4 text-2xl font-semibold text-pretty x-sm:hidden md:flex md:text-xl lg:flex'>
          Hello... <span className='text-2xl font-bold md:text-xl'>{userData?.name || 'Guest'}</span>
        </h1>
      </div>
      </div>

      <div className='flex items-center md:flex-row x-sm:flex-col md:gap-6'>
        <div>
          <div className="relative flex items-center bg-white rounded-lg lg:w-[300px] md:w-[250px] p-1 border x-sm:w-[150px] x-sm:hidden md:flex x-sm:py-3 md:p-2 sm:w-[200px]" >
           <SearchComponent/>
          </div>
        </div>

        

        <div className='flex flex-row items-center x-sm:justify-between x-sm:gap-[3rem] p-1 font-medium text-[12px] x-sm:pr- sm:gap-[12rem] '>
        <div className='flex items-center justify-center gap-1 md:hidden sm:flex '>
        <BurgerMenu/>
        <p className='sm:text-3xl md:hidden x-sm:text-xl'>PollMate</p>
          </div>
         
        <div className='flex items-center gap-6'>
        <CreatePoll/>
        
          <Link href='/adminDashboard/profile' className='flex items-center gap-2   rounded-lg text-[13px] hover:bg-blue-50'>
            <Image
              src={userData?.image || "https://placehold.co/300x300.png"}
              alt="Profile"
              className="w-10 h-10 border border-blue-400 rounded-full"
              width={20}
              height={20}
            />
            <div className='flex-col x-sm:hidden md:flex'>
              <p>Personal</p>
              <p>{userData?.name || 'Guest'}</p>
            </div>
          </Link>
        </div>
        </div>

        <div className='p-2'>
          <div className="relative flex items-center justify-center  bg-white rounded-lg w-[300px] p-1 border  x-sm:flex md:hidden sm:w-[500px] ">
          <SearchComponent/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
