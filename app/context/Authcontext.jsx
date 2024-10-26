"use client";
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase-config";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const [pollData, setPollData] = useState(null);
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname to get the current path
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

  const fetchPollData = useCallback(async (pollId) => {
    try {
      const pollDocRef = doc(db, "polls", pollId);
      const pollSnap = await getDoc(pollDocRef);
      if (pollSnap.exists()) {
        setPollData(pollSnap.data());
        return true;
      } else {
        console.error("Poll not found");
        return false;
      }
    } catch (error) {
      console.error("Error fetching poll data:", error);
      return false;
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
        if (!userData) {
          await fetchUserData(currentUser.uid);
          await checkAutoLogout(currentUser.uid);
          await updateUserStatus(currentUser.uid, "online");
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserData, checkAutoLogout, updateUserStatus, userData]);

  useEffect(() => {
    const pollIdMatch = pathname.match(/\/adminDashboard\/([^/]+)/);
    const pollId = pollIdMatch ? pollIdMatch[1] : null;

    const redirectUser = async () => {
      if (!loading && !redirected) {
        if (user && userData) {
          if (pollId) {
            const pollExists = await fetchPollData(pollId);
            if (pollExists) {
              router.push(`/adminDashboard/${pollId}`);
            } else {
              router.push("/adminDashboard");
            }
          } else {
            router.push("/adminDashboard");
          }
          setRedirected(true);
        } else if (!user) {
          router.push("/login");
        }
      }
    };

    redirectUser();
  }, [user, userData, loading, pathname, router, redirected, fetchPollData]);

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
    <AuthContext.Provider value={{ user, userData, logout, pollData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
