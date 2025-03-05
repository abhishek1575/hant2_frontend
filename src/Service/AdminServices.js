import  Config from "./Config"; 
import axios from "axios";



export const addItem = async (dataToSubmit) => {
  const token = sessionStorage.getItem("token");
  console.log("Token:", token);
  console.log("API URL:", `${Config.API_BASE_URL}item/add`);

  try {
    const response = await fetch(`${Config.API_BASE_URL}item/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        
        
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (!response.ok) {
      throw new Error("Failed to submit the form");
    }

    return response.json(); // Return response data if needed
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error; // Rethrow for handling in the component
  }
};



export const fetchRequests = async () => {
    const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${Config.API_BASE_URL}item/getAllNonApprovedRequests`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw new Error("Failed to fetch data. Please try again later.");
  }
};

export const approveRequest = async (id) => {
    const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `${Config.API_BASE_URL}item/approved?requestId=${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error("Error approving the request:", error);
    throw new Error("Error occurred while approving the request.");
  }
};

export const denyRequest = async (id) => {
    const token = sessionStorage.getItem("token");
  try {
    const response = await axios.delete(
      `${Config.API_BASE_URL}item/deleteRequest?requestId=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error("Error denying the request:", error);
    throw new Error("Error occurred while denying the request.");
  }
};

