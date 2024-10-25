"use client";
import { useState } from "react";
import { auth, db } from "../../Firebase/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const CreatePoll = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newPollOptions];
    updatedOptions[index] = value;
    setNewPollOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setNewPollOptions([...newPollOptions, '']);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewPollQuestion('');
    setNewPollOptions(['', '']);
  };

  const createPoll = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to create a poll.');
      return;
    }

    if (newPollQuestion.trim() && newPollOptions.every(option => option.trim())) {
      setLoading(true);
      try {
        // Poll data structure
        const pollData = {
          question: newPollQuestion,
          options: newPollOptions.map((option, index) => ({
            id: index,
            text: option,
            votes: 0,
          })),
          votes: [], // Store user votes
          creatorId: user.uid, // Current user as poll creator
          createdAt: new Date(),
          allowedUsers: [], // Placeholder for user-specific polls
          comments: [], // Placeholder for comments
        };

        // Save poll data to Firestore
        await addDoc(collection(db, "polls"), pollData);

        // Redirect to the poll list
        router.push("/adminDashboard/polllist");

        // Reset the form and close modal
        setNewPollQuestion('');
        setNewPollOptions(['', '']);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error creating poll: ", error);
        alert('Error creating poll. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter a valid question and options.');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full text-white transition duration-300 bg-blue-500 rounded-md hover:bg-blue-700"
      >
        <p className="p-2 text-[16px]">Create Poll</p>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-center">Create Poll</h1>
            <form onSubmit={createPoll}>
              <input
                type="text"
                value={newPollQuestion}
                onChange={(e) => setNewPollQuestion(e.target.value)}
                placeholder="Poll Title"
                className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[3.5rem] text-xl"
                required
              />

              <h2 className="mb-2 text-xl font-semibold">Options:</h2>
              {newPollOptions.map((option, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-[3.2rem] text-lg"
                    required
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddOption}
                className="w-full p-2 mb-4 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 h-[2.5rem] text-lg"
              >
                Add Option
              </button>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full p-2 text-white transition duration-300 bg-red-500 rounded-lg hover:bg-red-600 h-[3rem] text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full p-2 ml-2 text-white transition duration-300 bg-green-500 rounded-lg hover:bg-green-600 h-[3rem] text-lg"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Poll'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePoll;
