import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../Firebase/firebase-config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import GoogleIcon from '../../Assets/images/google.png';
import { toast, Toaster } from 'react-hot-toast';

const providers = [
    {
        name: "google",
        displayName: "Continue with Google",
        icon: GoogleIcon,
    },
];

const LoginProvider = () => {
    const router = useRouter();

    const handleSignin = async (providerName) => {
        if (providerName === "google") {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const userEmail = result.user.email;

                // Check if user document already exists
                const userDocRef = doc(db, 'users', userEmail);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    toast.error('Email already exists. Please log in with your credentials.');
                } else {
                    toast.success('Welcome! Redirecting to your dashboard.');
                    router.push('/adminDashboard');
                }
            } catch (error) {
                console.error("Error during Google sign-in:", error);
                toast.error("Error during sign-in. Please try again.");
            }
        }
    };

    return (
        <div>
            <Toaster /> {/* Initialize Toaster for react-hot-toast */}
            {providers.map((item, index) => (
                <button
                    onClick={() => handleSignin(item.name)}
                    key={index}
                    className='flex flex-row items-center justify-center gap-6 text-xl font-bold bg-violet-400 rounded shadow-2xl sm:w-[24rem] h-14 x-sm:w-[16rem] x-sm:text-[15px]'>
                    {item.displayName}
                    <Image src={item.icon} height={30} width={30} alt='Google icon' />
                </button>
            ))}
        </div>
    );
};

export default LoginProvider;
