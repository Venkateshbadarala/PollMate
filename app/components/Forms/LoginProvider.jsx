import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../Firebase/firebase-config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import GoogleIcon from '../../Assets/images/google.png';

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

                const userDocRef = doc(db, 'users', userEmail);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    alert('Email already exists. Please log in with your credentials.');
                } else {
                    alert('Welcome! Redirecting to your dashboard.');
                    router.push('/adminDashboard');
                }
            } catch (error) {
                console.error("Error during Google sign-in:", error);
                alert(error.message);
            }
        }
    };

    return (
        <div>
            {providers.map((item, index) => (
                <button
                    onClick={() => handleSignin(item.name)}
                    key={index}
                    className='flex flex-row items-center justify-center gap-6 text-xl font-bold bg-violet-400 rounded shadow-2xl sm:w-[24rem] h-14 x-sm:w-[20rem]'>
                    {item.displayName}
                    <Image src={item.icon} height={30} width={30} alt='Google icon' />
                </button>
            ))}
        </div>
    );
};

export default LoginProvider;
