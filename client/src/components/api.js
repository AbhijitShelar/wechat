// api.js
import BASE_URL from './config';

import axios from 'axios';

export const fetchUsersList = async () => {
  const myId = sessionStorage.getItem('userId');
  const getUserToken = () => {
    // Implement your logic to retrieve the user's token (from local storage, cookies, etc.)
    // For example, if you stored the token in local storage:
    return sessionStorage.getItem('token');
  };
  
  // Set the default headers for Axios with the Authorization header
  axios.defaults.headers.common['Authorization'] = `Bearer ${getUserToken()}`;
  
  try {
    const response = await axios.get(`${BASE_URL}/api/userslist`);
    console.log(response.data);
    
   
    const transformedData = response.data
      .filter(user => user.userId !== myId  && user.socketId !== null)  // Filtered out the record with the specified ID
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
