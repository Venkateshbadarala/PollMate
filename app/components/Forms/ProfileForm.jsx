"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import toast, { Toaster } from "react-hot-toast";
import { updateProfile, updatePassword, signOut } from "firebase/auth"; 
import { auth, storage, db } from "../../Firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc } from "firebase/firestore"; 
import { useAuth } from "../../context/Authcontext";

if (typeof window !== "undefined") {
  Modal.setAppElement(document.body);
}

const Profile = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [photoURL, setPhotoURL] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  
  const router = useRouter();
  const { userData } = useAuth();
  // Check if the current user is a Google user
  const currentUser = auth.currentUser;
  const isGoogleUser = currentUser?.providerData.some(provider => provider.providerId === 'google.com');

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);

      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUsername(userData.displayName || currentUser.displayName);
          setEmail(userData.email || currentUser.email);
          setPhotoURL(userData.photoURL || currentUser.photoURL);
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      let newPhotoURL = photoURL;

      if (photoFile) {
        const storageRef = ref(storage, `profileImages/${photoFile.name}`);
        await uploadBytes(storageRef, photoFile);
        newPhotoURL = await getDownloadURL(storageRef);
      }

      const profileUpdates = {
        displayName: username,
        photoURL: newPhotoURL,
      };

      // Update Firebase Auth profile
      await updateProfile(currentUser, profileUpdates);

      // Update Firestore with new profile data
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: username,
        photoURL: newPhotoURL,
        email: email, // Update email if necessary
      });

      if (password && !isGoogleUser) {
        await updatePassword(currentUser, password);
      } else if (password && isGoogleUser) {
        toast.error("Google users cannot change their password directly.");
      }

      toast.success("Profile updated successfully!");
      setModalIsOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoURL(URL.createObjectURL(file)); 
    }
  };

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
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <div className="p-8 text-center bg-white rounded-lg shadow-lg w-[23rem]">
        <h1 className="mb-6 text-4xl font-bold text-violet-700">Profile</h1>
        {/* Check if userData exists before accessing its properties */}
        {userData ? (
          <Image
            src={userData.image || "https://placehold.co/300x300.png"}
            alt="Profile"
            width={128}
            height={128}
            className="object-cover w-32 h-32 mx-auto mb-4 border-4 rounded-full border-violet-400"
          />
        ) : (
          <Image
            src="https://placehold.co/300x300.png"
            alt="Default Profile"
            width={128}
            height={128}
            className="object-cover w-32 h-32 mx-auto mb-4 border-4 rounded-full border-violet-400"
          />
        )}
       
        <h2 className="text-2xl font-semibold text-gray-700">{userData?.name || "Loading..."}</h2>
        <p className="text-gray-500">{userData?.email || "Loading..."}</p>

        <div className="flex items-center justify-center gap-10 mt-4">
          <button
            className={`px-6 py-3 font-bold text-white bg-violet-500 rounded ${isGoogleUser ? "opacity-50 cursor-not-allowed" : "hover:bg-violet-600"}`}
            onClick={() => !isGoogleUser && setModalIsOpen(true)}
            disabled={isGoogleUser}
          >
            {isGoogleUser ? "Edit in Google Account" : "Edit"}
          </button>
          <button
            className="p-2 font-bold text-black border-2 rounded border-violet-600 hover:bg-violet-600 hover:text-white"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center outline-none focus:outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="relative w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
          <button
            className="absolute text-gray-600 top-3 right-3 hover:text-gray-900 focus:outline-none"
            onClick={() => setModalIsOpen(false)}
          >
            &times;
          </button>

          <h2 className="mb-4 text-2xl font-bold text-center text-violet-700">Edit Profile</h2>
          <form onSubmit={handleUpdateProfile} className="flex flex-col space-y-4">
            <div className="flex flex-col items-center mb-4">
              <label htmlFor="image-upload" className="cursor-pointer">
                <Image
                  src={photoURL || "https://placehold.co/300x300.png"}
                  alt="Profile Preview"
                  className="object-cover border-2 rounded-full h-25 w-25 border-violet-500"
                  width={80}
                  height={80}
                />
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
            />

            <button
              type="submit"
              className="w-full py-2 font-bold text-white rounded bg-violet-600 hover:bg-violet-700"
            >
              Update Profile
            </button>
          </form>
        </div>
      </Modal>
      <Toaster />
    </div>
  );
};

export default Profile;
