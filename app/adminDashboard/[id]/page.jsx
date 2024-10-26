"use client"
import { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../Firebase/firebase-config";
import { useParams, useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import CommentSection from "../../components/polls/CommentSection";


const PollDetails = () => {
  const { id } = useParams(); 
  const router = useRouter();
  const [poll, setPoll] = useState({
    options: [],
    votes: {},
    creatorId: null,
  });
  const [userVote, setUserVote] = useState(null); 
  const [isVoting, setIsVoting] = useState(false); 
  const [isCreator, setIsCreator] = useState(false); 
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const pollRef = doc(db, "polls", id);

    const unsubscribe = onSnapshot(
      pollRef,
      (pollDoc) => {
        if (pollDoc.exists()) {
          const pollData = pollDoc.data();
          setPoll({
            question: pollData.question,
            options: Array.isArray(pollData.options) ? pollData.options : [],
            votes: pollData.votes || {},
            creatorId: pollData.creatorId || null,
            comments: pollData.comments || [],
          });

          if (currentUserId && pollData.votes && pollData.votes[currentUserId]) {
            setUserVote(pollData.votes[currentUserId]);
          }

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

    return () => unsubscribe();
  }, [id, currentUserId]);

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

      const updatedVotes = { ...poll.votes, [currentUserId]: optionId };

      const pollRef = doc(db, "polls", id);
      await updateDoc(pollRef, {
        options: updatedOptions,
        votes: updatedVotes,
      });

      setPoll((prevPoll) => ({
        ...prevPoll,
        options: updatedOptions,
        votes: updatedVotes,
      }));

      setUserVote(optionId); 
      toast.success("Vote submitted successfully!");
    } catch (error) {
      console.error("Error updating vote:", error);
      toast.error("Error submitting vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleDeletePoll = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this poll?");
    if (!confirmDelete) return;

    try {
      const pollRef = doc(db, "polls", id);
      await deleteDoc(pollRef);
      toast.success("Poll deleted successfully.");
      router.push("/adminDashboard");
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Error deleting poll. Please try again.");
    }
  };

  const handleSharePoll = () => {
    const pollLink = `${window.location.origin}/adminDashboard/${id}`;
    navigator.clipboard
      .writeText(pollLink)
      .then(() => {
        toast.success("Poll link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying link:", error);
        toast.error("Failed to copy the link. Please try again.");
      });
  };

  if (!poll || !Array.isArray(poll.options)) return <p className="loader"></p>;

  const totalVotes = poll.options.reduce((total, option) => total + option.votes, 0);

  return (
    <div className="flex flex-col items-center justify-center h-auto md:h-[80vh] gap-6 md:gap-10 p-4 md:p-0 md:mt-[4vh] x-sm:mt-[6vh] sm:mt-[6vh]">
      <Toaster />
      <div className="flex items-center justify-center gap-6 lg:flex-row x-sm:flex-col">
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-bold">Poll Question</h1>
          <div className="flex flex-col gap-3 w-full md:w-[40rem] bg-white p-6 rounded-md border-2 border-blue-700 x-sm:w-[24rem] sm:w-[32rem] ">
            <h3 className="text-2xl font-bold text-center uppercase break-words md:text-3xl x-sm:text-[18px]">{poll.question}</h3>
            <h1 className="text-lg font-bold md:text-xl">Make a Choice:</h1>

            {poll.options.map((option) => {
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              const isSelected = userVote === option.id;
              
              return (
                <div key={option.id} className="mb-4">
                  <div className="flex items-center justify-between border-2 rounded-xl">
                    <button
                      className={`w-full overflow-y-scroll text-justify p-2 uppercase h-[4.5rem] border-2 border-blue-800 border-opacity-45 rounded-[10px] x-sm:w-full font-bold flex justify-between items-center  ${
                        isSelected ? 'gradient-bg text-white' : 'bg-gray-200'
                      }`}
                      onClick={() => handleVote(option.id)}
                      disabled={isVoting || !!userVote}
                      style={{
                        transition: "width 1s ease-in-out",
                        fontSize: option.text.length > 15 ? '0.875rem' : '1rem',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                      }}
                    >
                      <div className="w-full px-2">{option.text}</div>
                     
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                  <div className="text-sm text-justify text-gray-600">{option.votes} votes</div>
                  <p className="text-right">{percentage}%</p>
                  </div>
              
                </div>
              );
            })}

            {isCreator && (
              <div className="flex flex-row items-center justify-center gap-4 mt-6">
                <button
                  onClick={handleDeletePoll}
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 x-sm:text-[14px] text-[1rem]"
                >
                  Delete Poll
                </button>
                <button
                  onClick={handleSharePoll}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 x-sm:text-[14px] text-[1rem]"
                >
                  Share Poll Link
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full x-sm:pb-[20vh] lg:pb-[2vh]">
          <CommentSection pollId={id} comments={poll.comments} />
        </div>
      </div>
    </div>
  );
};

export default PollDetails;
