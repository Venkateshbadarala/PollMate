import React, { useState, useEffect } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { useAuth } from '../../context/Authcontext';
import Ads from './Ads';
import { db, storage } from '../../Firebase/firebase-config';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AdsComponent = ({ user }) => {
  const [adsModalOpen, setAdsModalOpen] = useState(false);
  const [adImage, setAdImage] = useState(null);
  const [adDescription, setAdDescription] = useState('');
  const [adLink, setAdLink] = useState('');
  const [ads, setAds] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { userData } = useAuth();
  const adminEmail = '21pa1a1206@vishnu.edu.in';
  const isAdmin = userData?.email === adminEmail;

  // Fetch ads from Firebase
  const fetchAds = async () => {
    try {
      const adsCollection = collection(db, 'ads');
      const adsSnapshot = await getDocs(adsCollection);
      const adsList = adsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAds(adsList);
    } catch (error) {
      console.error('Error fetching ads: ', error);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleAdImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Image size should not exceed 10MB.');
        return;
      }
      setAdImage(file);
      setErrorMessage('');
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    if (!adImage || !adDescription) {
      setErrorMessage('Image and description are required.');
      return;
    }

    try {
      const imageRef = ref(storage, `ads/${adImage.name}`);
      await uploadBytes(imageRef, adImage);
      const imgSrc = await getDownloadURL(imageRef);

      const newAd = {
        imgSrc,
        description: adDescription,
        url: adLink || '',
      };

      const docRef = await addDoc(collection(db, 'ads'), newAd);
      const addedAd = { id: docRef.id, ...newAd };
      setAds([...ads, addedAd]);

      toast.success('Ad added successfully!');
      resetForm();
    } catch (error) {
      console.error('Error adding ad: ', error);
      toast.error('Error adding ad, please try again.');
    }
  };

  const resetForm = () => {
    setAdImage(null);
    setAdDescription('');
    setAdLink('');
    setAdsModalOpen(false);
    setErrorMessage('');
  };

  const handleAdDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'ads', id));
      setAds(ads.filter((ad) => ad.id !== id));
      toast.success('Ad deleted successfully!');
    } catch (error) {
      console.error('Error deleting ad: ', error);
      toast.error('Error deleting ad, please try again.');
    }
  };

  return (
    <div className="relative p-4">
      <div className="absolute p-2 right-[1rem] -top-[4rem]">
        {isAdmin && (
          <button
            className="px-4 py-2 mt-4 text-white transition duration-200 bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => setAdsModalOpen(true)}
          >
            Add Ad
          </button>
        )}
      </div>

      {/* Ads Modal for Admin */}
      <Modal open={adsModalOpen} onClose={resetForm} center >
        <div className='p-6 bg-white rounded-lg'>
          <h2 className="text-lg font-bold">Submit New Ad</h2>
          <form onSubmit={handleAdSubmit} className="mt-4 space-y-4">
            {/* Image Upload Section */}
            <label className="block cursor-pointer">
              <span className="font-semibold">Image: (max 1MB)</span>
              <div className="flex items-center justify-center w-full h-32 mt-2 border-2 border-gray-400 border-dashed rounded-lg">
                {adImage ? (
                  <img
                    src={URL.createObjectURL(adImage)}
                    alt="Ad Preview"
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <p className="text-gray-500">Click to upload an image</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAdImageChange}
                  className="hidden" // Hide the default file input
                  required
                  onClick={(e) => { e.target.value = null }} // Reset the input value
                />
              </div>
            </label>
            {/* Description Input */}
            <label className="block">
              <span className="font-semibold">Description:</span>
              <textarea
                rows="3"
                value={adDescription}
                onChange={(e) => setAdDescription(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </label>
            {/* Link Input */}
            <label className="block">
              <span className="font-semibold">Link (optional):</span>
              <input
                type="url"
                value={adLink}
                onChange={(e) => setAdLink(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </label>
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Submit Ad
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Ads ads={ads} onDelete={handleAdDelete} isAdmin={isAdmin} />
    </div>
  );
};

export default AdsComponent;
