// api.js
import BASE_URL from './config';

import axios from 'axios';

export const fetchUsersList = async () => {
  const myId = sessionStorage.getItem('userId');
  const getUserToken = () => {
   
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

export  const fetchAccountDetails= async () =>{
  const myId = sessionStorage.getItem('userId');

  try{
    const response=await axios.post(`${BASE_URL}/api/accountdetails`,myId);
    return response.data;
  } catch(error){
    console.error("Error fetching users list:", error);
    
  }

}