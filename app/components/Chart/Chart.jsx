// import React, { useEffect, useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { collection, query, onSnapshot } from 'firebase/firestore';
// import { db } from '../../Firebase/firebase-config'; // Firebase config

// const UserActivityGraph = () => {
//   const [userData, setUserData] = useState([]);
//   const [activeUsers, setActiveUsers] = useState(0);
//   const [totalUsers, setTotalUsers] = useState(0);

//   useEffect(() => {
//     // Fetch user data from Firebase collection 'users'
//     const usersQuery = query(collection(db, 'users'));
//     const unsubscribeUsers = onSnapshot(usersQuery, (querySnapshot) => {
//       const users = [];
//       querySnapshot.forEach((doc) => {
//         const user = doc.data();
//         users.push({ ...user, id: doc.id });
//       });

//       // Count active users and total users
//       const activeUserCount = users.filter((user) => user.status === 'active').length;
//       setActiveUsers(activeUserCount);
//       setTotalUsers(users.length);

//       // Prepare data for the graph (grouped by active time)
//       const activityData = {};
//       users.forEach((user) => {
//         if (user.lastActive) {
//           const date = new Date(user.lastActive.toDate()); // Convert Firestore timestamp
//           const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

//           if (!activityData[key]) {
//             activityData[key] = { name: key, active: 0, total: users.length }; // Include total users
//           }
//           activityData[key].active += user.status === 'active' ? 1 : 0;
//         }
//       });

//       // Convert activity data to an array for the graph
//       const graphData = Object.values(activityData);
//       setUserData(graphData);
//     });

//     // Clean up subscriptions on unmount
//     return () => {
//       unsubscribeUsers();
//     };
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center w-[40rem] p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="mb-4 text-2xl font-bold text-gray-800">
//         User Activity Overview
//         <p className="text-gray-700">Active Users: {activeUsers}</p>
//         <p className="text-gray-700">Total Users: {totalUsers}</p>
//       </h2>

//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart
//           data={userData}
//           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />

//           {/* Line showing active users */}
//           <Line type="monotone" dataKey="active" stroke="#82ca9d" activeDot={{ r: 8 }} name="Active Users" />

//           {/* Line showing total users */}
//           <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Users" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default UserActivityGraph;


import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PiUserSwitchThin } from "react-icons/pi";
import { HiUserGroup } from "react-icons/hi";

// Generate fake user data
const generateFakeUserData = () => {
  const today = new Date();
  const data = [];

  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const activeUsers = Math.floor(Math.random() * 100);
    const totalUsers = Math.floor(Math.random() * 150 + activeUsers);

    data.push({
      name: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      active: activeUsers,
      total: totalUsers,
    });
  }

  return data.reverse();
};

const UserActivityGraph = () => {
  const [userData, setUserData] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fakeUserData = generateFakeUserData();
    setUserData(fakeUserData);

    const activeUserCount = fakeUserData.reduce((sum, item) => sum + item.active, 0);
    const totalUserCount = fakeUserData.reduce((sum, item) => sum + item.total, 0);
    setActiveUsers(activeUserCount);
    setTotalUsers(totalUserCount);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full lg:w-[60rem] lg:bg-white rounded-lg lg:shadow-lg lg:p-6">
      <h2 className="flex flex-col md:flex-row md:justify-between md:items-center text-2xl font-bold text-gray-800 mb-4">
        <div className=''>User Activity Overview</div>
        <div className="flex gap-4 mt-4 md:mt-0 ">
          <div className="flex items-center gap-2 text-blue-900">
            <PiUserSwitchThin size={24} />
            <p className="font-semibold">{activeUsers}</p>
          </div>
          <div className="flex items-center gap-2 text-blue-900">
            <HiUserGroup size={24} />
            <p className="font-semibold">{totalUsers}</p>
          </div>
        </div>
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={userData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="active" stroke="#82ca9d" activeDot={{ r: 8 }} name="Active Users" />
          <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Users" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserActivityGraph;

