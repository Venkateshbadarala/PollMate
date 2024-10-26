"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import LoginProvider from './LoginProvider';
import Link from 'next/link';
import LoginNavbar from './LoginBar/LoginNavbar';
import { auth } from '../../Firebase/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginForm = () => {
  const menuItems = [
    { name: "Login", route: '/login' },
    { name: "Register", route: '/register' },
  ];

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const handleLogin = async (data) => {
    setLoading(true);
    const { email, password } = data;

  
    const loadingToastId = toast.loading("Logging in...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      router.push('/adminDashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      // Dismiss the loading toast
      toast.dismiss(loadingToastId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-950 to-violet-950">
      <Toaster />
      <LoginNavbar menuItems={menuItems} />

      <div className="flex flex-col items-center justify-center lg:flex-row">
        <div className="flex items-center justify-center w-full lg:w-1/2 pt-[2%] h-[80vh]">
          <div className="sm:w-[28rem] p-8 bg-white rounded-[15px] shadow-lg  x-sm:w-[20rem] ">
            <h2 className="mb-1 text-3xl font-extrabold text-black text-start x-sm:text-xl">Welcome Back...</h2>
            <p className="mb-6 text-gray-700 text-start">Please enter your email and password</p>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4 text-black">
              <div>
                <label htmlFor="email" className="block text-sm font-bold">Email</label>
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  id="email"
                  placeholder="user@gmail.com"
                  className="w-full h-[3.5rem] font-bold px-4 py-2 border rounded-md"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold">Password</label>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  id="password"
                  placeholder="********"
                  className="w-full h-[3.5rem] px-4 py-2 border rounded-md"
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <div className='flex items-center justify-center gap-2'>
                <div className='w-1/2'>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full py-2 text-white rounded-md bg-violet-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg className="w-5 h-5 mr-3 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    ) : 'Login'}
                  </button>
                </div>

                <div className='flex items-center justify-center w-1/2 p-2 border-2 border-opacity-50 rounded border-violet-500'>
                  <Link href='/forgot' className='text-[15px] x-sm:text-[11px]'>Forgot Password</Link>
                </div>
              </div>
            </form>

            <div className="flex items-center my-6">
              <div className="w-full h-px bg-gray-300" />
              <p className="mx-4 text-sm text-gray-600">or</p>
              <div className="w-full h-px bg-gray-300" />
            </div>

            <LoginProvider />

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;


