"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../Firebase/firebase-config";
import { useParams, useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import CommentSection from "../../components/polls/CommentSection";

const PollDetails = () => {
  const { id } = useParams(); // Get the poll ID from the URL
  const router = useRouter();
  const [poll, setPoll] = useState({
    options: [],
    votes: {}, // To store users' votes (userId: optionId)
    creatorId: null,
  });
  const [userVote, setUserVote] = useState(null); // User's vote for the poll
  const [isVoting, setIsVoting] = useState(false); // State to manage voting status
  const [isCreator, setIsCreator] = useState(false); // State to check if current user is poll creator
  const currentUserId = auth.currentUser?.uid;

  // Fetch poll details when the component mounts
  useEffect(() => {
    const pollRef = doc(db, "polls", id);

    // Listen for changes to the poll document
    const unsubscribe = onSnapshot(
      pollRef,
      (pollDoc) => {
        if (pollDoc.exists()) {
          const pollData = pollDoc.data();
          setPoll({
            question: pollData.question,
            options: Array.isArray(pollData.options) ? pollData.options : [],
            votes: pollData.votes || {}, // Get users' votes from Firebase
            creatorId: pollData.creatorId || null,
            comments: pollData.comments || [],
          });

          // Check if the current user has already voted
          if (currentUserId && pollData.votes && pollData.votes[currentUserId]) {
            setUserVote(pollData.votes[currentUserId]); // Set the user's previous vote
          }

          // Check if the current user is the poll creator
          if (auth.currentUser && pollData.creatorId === auth.currentUser.uid) {
            setIsCreator(true);
          }
        } else {
          toast.error("Poll not found.");
        }
      },
      (error) => {
        console.error("Error fetching poll:", error);
        toast.error("Error fetching poll. Please try again.");
      }
    );

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [id, currentUserId]);

  // Handle voting for an option
  const handleVote = async (optionId) => {
    if (isVoting || !poll || !poll.options || userVote === optionId) return;

    setIsVoting(true);
    try {
      const updatedOptions = poll.options.map((option) => {
        if (option.id === optionId) {
          return { ...option, votes: option.votes + 1 };
        } else if (option.id === userVote) {
          return { ...option, votes: option.votes - 1 };
        }
        return option;
      });

      // Store the user's vote in the "votes" field of the poll document
      const updatedVotes = { ...poll.votes, [currentUserId]: optionId };

      const pollRef = doc(db, "polls", id);
      await updateDoc(pollRef, {
        options: updatedOptions,
        votes: updatedVotes, // Update the votes map in Firebase
      });

      setPoll((prevPoll) => ({
        ...prevPoll,
        options: updatedOptions,
        votes: updatedVotes,
      }));

      setUserVote(optionId); // Update the local state with the user's vote
      toast.success("Vote submitted successfully!");
    } catch (error) {
      toast.error("Error updating vote:", error);
      toast.error("Error submitting vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  // Handle poll deletion by the creator
  const handleDeletePoll = async () => {
    const confirmDelete = toast.confirm("Are you sure you want to delete this poll?");
    if (!confirmDelete) return;

    try {
      const pollRef = doc(db, "polls", id);
      await deleteDoc(pollRef);
      toast.success("Poll deleted successfully.");
      router.push("/adminDashboard"); // Redirect to polls list or homepage after deletion
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Error deleting poll. Please try again.");
    }
  };

  // Handle sharing the poll link
  const handleSharePoll = () => {
    const pollLink = `${window.location.origin}/polls/${id}`;
    navigator.clipboard
      .writeText(pollLink)
      .then(() => {
        toast.success("Poll link copied to clipboard!");
      })
      .catch((error) => {
        toast.error("Error copying link:", error);
        toast.error("Failed to copy the link. Please try again.");
      });
  };

  // Show loading message if poll data is not available
  if (!poll || !Array.isArray(poll.options)) return <p className="loader"></p>;

  // Calculate total votes across all options
  const totalVotes = poll.options.reduce((total, option) => total + option.votes, 0);

  return (
    <div className="flex px-10 justify-center h-[80vh] gap-10 md:mt-[4vh]  x-sm:mt-[20vh] flex-row sm:mt-[6vh] ">
      <Toaster />
      <div className="flex flex-row items-center justify-center gap-10 x-sm:flex-col md:flex-row">
        <div className="flex flex-col gap-10">
          <h1 className="font-extrabold lg:text-3xl x-sm:text-2xl text-start">Poll Question</h1>
          <div className="flex items-center justify-center gap-10 x-sm:flex-col md:flex-row">
            <div className="flex flex-col w-[40rem] bg-white p-6 rounded-md border-2 border-blue-700 x-sm:w-[26rem] sm:w-[32rem]">
              <h3 className="text-3xl font-extrabold text-center uppercase">{poll.question}</h3>
              <h1 className="p-4 text-xl font-bold">Make a Choice:</h1>

              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                return (
                  <div key={option.id} className="mb-4">
                    <div className="flex items-center justify-between border-2 rounded-xl">
                      <button
                        className={`w-full p-2 uppercase h-[3.5rem] border-2 border-blue-800 border-opacity-45 rounded-[10px] font-bold flex justify-between items-center text-left bg-gray-200 ${userVote === option.id ? 'bg-blue-100' : ''}`}
                        onClick={() => handleVote(option.id)}
                        disabled={isVoting || !!userVote}
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, rgba(52,211,153,1) 0%, rgba(56,189,248,1) 100%)`,
                          transition: "width 1s ease-in-out",
                        }}
                      >
                        <div className="px-5">{option.text}</div>
                        <div className="flex px-5">
                          <p>{percentage}%</p>
                        </div>
                      </button>
                    </div>
                    <p className="text-sm text-right text-gray-600">{option.votes} votes</p>
                  </div>
                );
              })}

              {/* Poll creator options */}
              {isCreator && (
                <div className="flex flex-row items-center justify-center gap-4 mt-6">
                  <button
                    onClick={handleDeletePoll}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete Poll
                  </button>
                  <button
                    onClick={handleSharePoll}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Share Poll Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <CommentSection pollId={id} comments={poll.comments} />
        </div>
      </div>
    </div>
  );
};

export default PollDetails;
