import axios from "axios";
import Config from "./Config";


// Function to get all data
export const getAllData = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${Config.API_BASE_URL}item/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the data so it can be used in Dashboard
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error; // Re-throw the error to handle it in Dashboard
  }
};

// Function to change password
export const changePassword = async (oldPassword, newPassword) => {
  try {
    // Retrieve token and id from sessionStorage
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("UserId");

    // Check if token and id are present
    if (!token || !id) {
      console.error("Token or ID is missing");
      throw new Error("Token or User ID is missing");
    }

    // Make API call to change password
    const response = await axios.post(
      `${Config.API_BASE_URL}api/changePassword`,
      {
        id: parseInt(id, 10), // Ensure id is sent as a number
        oldPassword,
        newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Return response data for further handling
  } catch (error) {
    console.error("API error:", error);
    throw error; // Re-throw for handling in Dashboard.jsx
  }
};

export const fetchNewRequests = async () => {
  try {
    const token = sessionStorage.getItem("token"); // Retrieve JWT token from storage
    if (!token) {
      console.error("No authentication token found");
      return false;
    }

    const response = await fetch(`${Config.API_BASE_URL}item/hasNewRequests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Include JWT token in the request
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch new requests: ${response.status}`);
    }

    const data = await response.json();
    return data; // Returns true or false
  } catch (error) {
    console.error("Error fetching new requests:", error);
    return false; // Default to false in case of an error
  }
};


export const getHistoryByUserId = async (userId, token) => {
  try {
    const response = await fetch(
      // `http://localhost:8083/request/getRequestByUserId?userId=${userId}`,
      `${Config.API_BASE_URL}request/getRequestByUserId?userId=${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch history data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching history data:", error);
    throw error;
  }
};

