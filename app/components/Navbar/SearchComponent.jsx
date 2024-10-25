import React, { useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../Firebase/firebase-config'; // Import auth to get current user ID
import Link from 'next/link';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get the current user ID from Firebase auth
  const currentUserId = auth.currentUser?.uid;

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Ensure a search term is entered
    if (!searchTerm) {
      setResults([]); // Clear results if no search term
      return;
    }

    setLoading(true); // Show loading indicator
    setError(null); // Reset any errors
    setResults([]); // Clear previous results

    try {
      // Step 1: Fetch the current user's 'polls' collection
      const pollsCollectionRef = collection(db, 'polls');
      const q = query(pollsCollectionRef, where('creatorId', '==', currentUserId)); // Filter by current user's ID
      const pollsSnapshot = await getDocs(q);

      // Step 2: Filter by search term (case-insensitive)
      const filteredPolls = pollsSnapshot.docs
        .map((pollDoc) => ({
          id: pollDoc.id,
          ...pollDoc.data(),
        }))
        .filter((poll) =>
          poll.question && poll.question.toLowerCase().includes(searchTerm.toLowerCase()) // Case-insensitive filtering
        );

      // Step 3: Set the results in state
      setResults(filteredPolls);

    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to fetch search results.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const handleResultClick = () => {
    setSearchTerm(''); // Clear the search input when a result is clicked
    setResults([]); // Clear the results after selection
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch}> {/* Wrap input inside a form */}
        <SearchRoundedIcon className="absolute text-gray-500 top-1" />
        <input
          type="text"
          className="w-full py-2 pl-10 text-sm text-gray-700 placeholder-gray-400 rounded-lg outline-none"
          placeholder="Search poll questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search poll questions"
        />
      </form>

      {/* Loading Indicator */}
      {loading && <p className="mt-2 text-gray-500">Loading...</p>}

      {/* Error Message */}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      {/* Displaying Search Results */}
      <div>
        {results.length > 0 ? (
          <div className="mt-2 bg-white rounded-lg shadow-md">
            {results.map((item) => (
              <Link key={item.id} href={`/adminDashboard/${item.id}`} passHref> {/* Dynamic link to poll page */}
                <a
                  className="block p-2 border-b cursor-pointer last:border-b-0 hover:bg-gray-100"
                  onClick={handleResultClick} // Clear search on click
                >
                  <h3 className="font-semibold text-gray-800">{item.question}</h3> {/* Poll question */}
                </a>
              </Link>
            ))}
          </div>
        ) : !loading && searchTerm && (
          <p className="mt-2 text-gray-500">No results found.</p> // Message when no results are found
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
