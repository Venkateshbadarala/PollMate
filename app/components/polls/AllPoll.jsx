"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../Firebase/firebase-config";
import { useRouter } from "next/navigation"; // Import router for redirection
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast"; // If using toast for notifications

const AllPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = auth.currentUser;

  // Fetch polls created by the authenticated user
  useEffect(() => {
    if (!user) return; // Exit if no user is authenticated

    const fetchPolls = async () => {
      try {
        const pollsRef = collection(db, "polls");
        const q = query(pollsRef, where("creatorId", "==", user.uid)); // Query for polls where creatorId matches user UID

        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const userPolls = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setPolls(userPolls); // Set fetched polls to state
            setLoading(false); // Set loading to false after fetching
          },
          (error) => {
            console.error("Error fetching polls:", error);
            toast.error("Error fetching polls.");
            setLoading(false);
          }
        );

        return () => unsubscribe(); // Clean up Firestore listener on unmount
      } catch (error) {
        console.error("Error fetching polls:", error);
        setLoading(false);
      }
    };

    fetchPolls();
  }, [user]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (loading) return <div>Loading polls...</div>;

  if (polls.length === 0) return <div className="pl-10">No polls available</div>;

  return (
    <div className="p-4">
      <Toaster/>
      <div className="grid gap-8 mt-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <Link href={`/adminDashboard/${poll.id}`} key={poll.id}>
            <div className="flex items-center justify-center w-full max-w-xs p-4 mx-auto uppercase transition-shadow duration-200 border border-blue-500 rounded shadow-md hover:shadow-lg xsm:w-64 lg:w-80">
              <h2 className="overflow-y-auto text-lg font-bold text-center sm:text-md lg:text-xl">
                {poll.question}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllPolls;
