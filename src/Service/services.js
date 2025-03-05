import axios from "axios";
import Config from "./Config";

const API_URL = Config.API_BASE_URL;

export const fetchData = async () => {
  const response = await axios.get(`${API_URL}items`);
  return response.data;
};

export const updateItem = async (updatedData) => {
  const token = sessionStorage.getItem("token"); // Retrieve token from session storage
  const response = await axios.put(`${API_URL}item/edit`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`, // Add Bearer token to the headers
    },
  });
  return response.data;
};

export const deleteItem = async (id) => {
  const token = sessionStorage.getItem("token"); // Retrieve token from session storage
  const response = await axios.delete(`${API_URL}item/delete`, {
    headers: {
      Authorization: `Bearer ${token}`, // Add Bearer token to the headers
    },
    params: {
      ID: id,
    },
  });
  return response.data;
};

// export const requestItem = async (updatedData) => {
//   const token = sessionStorage.getItem("token"); // Retrieve token from session storage
//   console.log("Sending request with data:", updatedData); // Add this line
//   const response = await axios.post(`${API_URL}request/request`, updatedData, {
//     headers: {
//       Authorization: `Bearer ${token}`, // Add Bearer token to the headers
//     },
//   });
//   console.log("Response received:", response.data); // Add this line
//   return response.data;
// };
export const requestItem = async (updatedData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}request/request`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json", // Ensure this matches Postman
          Authorization: `Bearer ${token}`, // Ensure this matches Postman
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in requestItem:", error);
    throw error;
  }
};
