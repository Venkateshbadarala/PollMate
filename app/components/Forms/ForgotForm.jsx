"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../../Firebase/firebase-config';
import { sendPasswordResetEmail } from "firebase/auth";
import { Toaster, toast } from 'react-hot-toast';

const ForgotForm = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleSubmitForm = async (data) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, data.email);
      toast.success('Password reset link sent successfully!');
    } catch (error) {
      console.log("Error during password reset:", error); 
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'No user found with this email.'
        : 'Failed to send reset link. Please try again later.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col gap-5">
          <div className="grid gap-1.5">
            <label htmlFor="email" className="text-base font-semibold">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Example@gmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full h-[3.5rem] font-bold px-4 py-2 border rounded-md"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
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
                ) : 'Submit'}
              </button>
        </form>
      </div>
    
      <Toaster position="top-center" />
    </div>
  );
};

export default ForgotForm;
