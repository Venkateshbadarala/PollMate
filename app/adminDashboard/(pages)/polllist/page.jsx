"use client"

import React, { useState, useEffect } from 'react';
import AllPoll from '../../../components/polls/AllPoll'

import { db } from '../../../Firebase/firebase-config';
const page = () => {
   
  return (
    <div className=' pt-[6%]'>
       <h1 className='p-2  text-3xl font-bold  '>Polls List</h1>
     
      <AllPoll/>
    </div>
  )
}

export default page