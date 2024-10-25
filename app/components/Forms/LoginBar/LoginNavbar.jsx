"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = ({ menuItems = [] }) => {
  const pathname = usePathname();

  return (
    <nav className='flex items-center justify-between sm:p-8 x-sm:p-4 x-sm:gap-10 '>
      <div className="flex items-center gap-4">
        <h1 className='sm:text-[2rem] text-white asteriod x-sm:text-[1.5rem]'>PollMate</h1>
      </div>
      <div className="flex gap-10 mr-[10%] font-bold x-sm:gap-4">
        {menuItems.map((menuItem, index) => (
          <Link
            href={menuItem.route}
            key={index}
            className={`p-2 text-[16px] x-sm:text-[11px] text-white border border-white rounded-[5px] px-5 border-opacity-30 ${
              pathname === menuItem.route ? 'bg-violet-600' : 'bg-transparent'
            }`}
          >
            {menuItem.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
