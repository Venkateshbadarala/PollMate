import React, { useState, useEffect } from 'react';
import { RxHamburgerMenu, RxCross2 } from 'react-icons/rx';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import PollRoundedIcon from '@mui/icons-material/PollRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import { auth } from '../../Firebase/firebase-config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define icons for the Sidebar menu
const NavbarIcons = [
  {
    Name: 'Dashboard',
    IconName: GridViewRoundedIcon,
    href: '/adminDashboard',
  },
  {
    Name: 'All Poll',
    IconName: PollRoundedIcon,
    href: '/adminDashboard/polllist',
  },
];

const Burgermenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div>
      {/* Burger Menu Icon */}
      <div className="p-2 lg:hidden md:flex">
        <button
          className="text-2xl text-black focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <RxCross2 /> : <RxHamburgerMenu />}
        </button>
      </div>

      {/* Burger Menu Content */}
      <div
        className={`fixed inset-0 z-20 flex flex-col space-y-10 items-center bg-white p-5 transition-transform transform shadow-new-shadow rounded-r-[30px] w-[16rem] ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-0 right-0 p-5">
          <button
            className="text-2xl focus:outline-none"
            onClick={() => setIsMenuOpen(false)}
          >
            <RxCross2 />
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <div className="flex flex-col space-y-3 text-black">
          <div>
            <h1 className='text-2xl'>PollMate</h1>
          </div>
          <h1 className="p-2 border-t-2 text-[14px]">Main</h1>
          {NavbarIcons.map((icon, index) => (
            <div
              key={index}
              className="relative flex items-center gap-4 mb-3 text-[18px] text-pretty p-3 w-[12rem] rounded-[10px] group hover:bg-violet-50 hover:border-r-[3px] border-violet-400"
            >
              <icon.IconName className="text-xl" />
              <Link href={icon.href} className="text-[18px] font-semibold">
                {icon.Name}
              </Link>
            </div>
          ))}

          <div className="relative flex items-center gap-4 text-[18px] p-3 w-[12rem] rounded-[10px] hover:bg-slate-100 hover:border-r-[3px] border-violet-400">
            <ExitToAppRoundedIcon />
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-10 transition-opacity duration-300 bg-black opacity-50"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Burgermenu;
