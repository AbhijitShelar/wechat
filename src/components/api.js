// api.js

import axios from 'axios';

export const fetchUsersList = async () => {
  const myId = sessionStorage.getItem('userId');
  try {
    const response = await axios.get("http://localhost:3000/api/userslist");
    console.log(response.data);
    
   
    const transformedData = response.data
      .filter(user => user.userId !== myId)  // Filtered out the record with the specified ID
      .map(({ userId, name}) => ({
        name: name,
        recieverId: userId,
      }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching users list:", error);
    return [];
  }
};
