"use client";
import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "../../Firebase/firebase-config"; // Import db from firebase-config

const PollVoting = ({ poll, user }) => {
  const [isVoting, setIsVoting] = useState(false);

  // Handle voting for an option
  const handleVote = async (optionId) => {
    if (isVoting || !poll || !poll.options || poll.userVote === optionId) {
      return;
    }

    setIsVoting(true); // Set voting state to true
    try {
      const updatedOptions = poll.options.map((option) => {
        if (option.id === optionId) {
          return { ...option, votes: option.votes + 1 }; // Increment vote for selected option
        } else if (option.id === poll.userVote) {
          return { ...option, votes: option.votes - 1 }; // Decrement vote for previously voted option
        }
        return option;
      });

      const pollRef = doc(db, 'users', user.uid, 'polls', poll.id); // Ensure poll.id exists and db is imported
      await updateDoc(pollRef, { options: updatedOptions, userVote: optionId }); // Update database with new vote

      toast.success("Vote submitted successfully!"); // Notify user of success
    } catch (error) {
      console.error("Error updating vote:", error);
      toast.error("Error submitting vote. Please try again."); // Handle error
    } finally {
      setIsVoting(false); // Reset voting state
    }
  };

  // Calculate the percentage of votes for a given option
  const calculatePercentage = (optionVotes, totalVotes) => {
    return totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
  };

  // Calculate total votes across all options
  const totalVotes = poll.options.reduce((total, option) => total + option.votes, 0);

  return (
    <div>
      <h1 className="p-4 text-xl font-bold">Make a Choice:</h1>
      {poll.options.map((option) => {
        const percentage = calculatePercentage(option.votes, totalVotes);

        return (
          <div key={option.id} className="mb-4">
            <div className="flex items-center justify-between border-2 rounded-xl">
              <button
                className={`w-full p-2 uppercase h-[3.5rem] border-2 border-blue-800 border-opacity-45 rounded-[10px] font-bold flex justify-between items-center text-left bg-gray-200 ${poll.userVote === option.id ? 'bg-blue-100' : ''}`}
                onClick={() => handleVote(option.id)}
                disabled={isVoting}
                style={{
                  width: `${percentage}%`,
                  background: `linear-gradient(90deg, rgba(52,211,153,1) 0%, rgba(56,189,248,1) 100%)`,
                  transition: "width 1s ease-in-out",
                }}
              >
                <div className="px-5">{option.text}</div>
                <div className="flex px-5"><p>{percentage}%</p></div>
              </button>
            </div>
            <p className="text-sm text-right text-gray-600">{option.votes} votes</p>
          </div>
        );
      })}
    </div>
  );
};

export default PollVoting;
