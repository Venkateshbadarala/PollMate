"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { auth } from "../../Firebase/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import LoginNavbar from "./LoginBar/LoginNavbar";

const RegisterForm = () => {
  const menuItems = [
    { name: "Login", route: '/login' },
    { name: "Register", route: '/register' },
  ];
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    
    if (selectedImage) {
      const previewURL = URL.createObjectURL(selectedImage);
      setImagePreview(previewURL);
    }
  };

  const handleRegister = async (data) => {
    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      const storage = getStorage();
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`); 

      await uploadBytes(storageRef, image); 
      const downloadURL = await getDownloadURL(storageRef); 

      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        image: downloadURL,
        createdAt: new Date(),
      });
      toast.success("User registered successfully!");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists");
      } else {
        toast.error("Registration failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-950 to-violet-950">
      <LoginNavbar menuItems={menuItems}/>
      <div className="flex flex-col items-center justify-center lg:flex-row ">
        <div className="flex items-center justify-center w-full lg:w-1/2 pt-[2%] ">
          <div className="sm:w-[28rem] p-8 bg-white rounded-[15px] shadow-lg h-full x-sm:w-[23rem]">
            <h2 className="mb-1 text-[1.7rem] font-extrabold text-black text-start">Create an Account</h2>
            <p className="mb-6 text-gray-700 text-start">Please fill in your details below</p>

            <form onSubmit={handleSubmit(handleRegister)} className="relative flex flex-col gap-5 text-black ">
              <div className="absolute right-0 flex flex-col items-center mb-2 -top-[6rem]">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Image
                    src={imagePreview || "https://placehold.co/300x300.png"}
                    alt="Profile Preview"
                    className="rounded-full w-[5rem] h-15 border-2 border-violet-500"
                    width={80}
                    height={80}
                  />
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="name" className="text-base font-semibold">Username</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full h-[3.5rem] font-bold px-4 py-2 border rounded-md"
                />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
              </div>

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

              <div className="grid gap-1.5">
                <label htmlFor="password" className="text-base font-semibold">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="********"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                  className="w-full h-[3.5rem] font-bold px-4 py-2 border rounded-md"
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
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
                ) : 'Register'}
              </button>
            </form>
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
