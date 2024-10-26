import React from 'react';
import Image from 'next/image';
import { auth, db } from '../../Firebase/firebase-config'; // Ensure db (Firestore) is configured
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import Firestore methods
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
    const searchParams = useSearchParams(); // Fetch URL parameters
    const pollId = searchParams.get("pollId"); // Get pollId from the query parameters

    const checkIfNewUser = async (uid) => {
        const userDoc = doc(db, "users", uid);
        const userRef = await getDoc(userDoc);
        console.log("Checking if user exists in Firestore:", userRef.exists());
        return userRef;
    };

    const createNewUser = async (user) => {
        const userDoc = doc(db, "users", user.uid);
        await setDoc(userDoc, {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            image: user.photoURL,
        });
        console.log("New user created in Firestore:", {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            image: user.photoURL,
        });
    };

    const handleSignin = async (providerName) => {
        if (providerName === "google") {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log("User data after sign-in:", user);

                // Check if user exists in Firestore
                const userRef = await checkIfNewUser(user.uid);

                if (userRef.exists()) {
                    console.log("User exists, redirecting...");
                } else {
                    await createNewUser(user);
                    console.log("New user created, redirecting...");
                }

                
                if (pollId) {
                    router.push(`/adminDashboard/${pollId}`);
                } else {
                    router.push('/adminDashboard');
                }

            } catch (error) {
                console.error("Error signing in:", error.message);
            }
        }
    };

    return (
        <div>
            {providers.map((item, index) => (
                <button
                    onClick={() => handleSignin(item.name)}
                    key={index}
                    className='flex flex-row items-center justify-center gap-6 text-[15px] font-bold bg-violet-400 rounded shadow-2xl sm:w-[24rem] h-14 x-sm:w-[16rem]'>
                    {item.displayName}
                    <Image src={item.icon} height={30} width={30} alt='Google icon' />
                </button>
            ))}
        </div>
    );
};

export default LoginProvider;
