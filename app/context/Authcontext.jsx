"use client";
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase-config";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore();

  const fetchUserData = useCallback(async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [db]);

  const updateUserStatus = useCallback(async (userId, status) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        status: status,
        lastActive: new Date(),
        loginTimestamp: new Date().getTime(),
      });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  }, [db]);

  const checkAutoLogout = useCallback(async (userId) => {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const { loginTimestamp } = docSnap.data();
      if (new Date().getTime() - loginTimestamp > THIRTY_DAYS_MS) {
        await logout();
      }
    }
  }, [db]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
        await checkAutoLogout(currentUser.uid);
        await updateUserStatus(currentUser.uid, "online");
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserData, checkAutoLogout, updateUserStatus, router]);

  const logout = async () => {
    const confirmation = window.confirm("Are you sure you want to log out?");
    if (confirmation && user) {
      try {
        await updateUserStatus(user.uid, "offline");
        await signOut(auth);
        setUser(null);
        setUserData(null);
        router.push("/login");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <AuthContext.Provider value={{ user, userData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
