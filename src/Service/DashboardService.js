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

// export const multipleItemsSubmit = async (payload) => {
//   const token = sessionStorage.getItem("token");
//   const userName = sessionStorage.getItem("Name");
//   const userId = sessionStorage.getItem("UserId");

//   if (!token || !userName || !userId) {
//     throw new Error("User session data is missing.");
//   }

//   const { requests, projectName, remark } = payload;

//   const submissionPromises = requests.map(request => {
//     const requestPayload = {
//       id: request.id,
//       quantityRequested: request.quantity,
//       userName: userName,
//       userId: parseInt(userId, 10),
//       projectName: projectName,
//       remark: remark,
//       returnDate: null,
//       approvedBy: null,
//     };

//     // Using axios for consistency and better error handling
//     return axios.post(`${Config.API_BASE_URL}request/request`, requestPayload, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   });

//   // Promise.all will automatically reject if any of the axios requests fail
//   await Promise.all(submissionPromises);

//   return "Requests submitted successfully!";
// };


export const multipleItemsSubmit = async (payload) => {
  console.log("[SERVICE] multipleItemsSubmit called with payload:", payload);

  const token = sessionStorage.getItem("token");
  const userName = sessionStorage.getItem("Name");
  const userId = sessionStorage.getItem("UserId");

  if (!token || !userName || !userId) {
    console.error("[SERVICE] Missing session data");
    throw new Error("User session data is missing. Please login again.");
  }

  const { requests, projectName, remark } = payload;

  if (!requests || requests.length === 0) {
    console.error("[SERVICE] No requests provided");
    throw new Error("No requests provided.");
  }

  if (!projectName || !projectName.trim()) {
    console.error("[SERVICE] Team name is missing");
    throw new Error("Team name is required.");
  }

  if (!remark || !remark.trim()) {
    console.error("[SERVICE] Remark is missing");
    throw new Error("Reason (Remark) is required.");
  }

  console.log("[SERVICE] Processing", requests.length, "requests");

  // Map each request to match the backend's expected format
  const submissionPromises = requests.map((request, index) => {
    const requestPayload = {
      id: request.id,
      quantityRequested: request.quantity,
      userName: userName,
      userId: parseInt(userId, 10),
      projectName: projectName.trim(),
      remark: remark.trim(),
      returnDate: request.returnDate || null,
      item: {
        id: request.id,
      },
    };

    console.log(
      `[SERVICE] Request ${index + 1}/${requests.length} payload:`,
      JSON.stringify(requestPayload, null, 2)
    );

    return axios
      .post(`${Config.API_BASE_URL}request/request`, requestPayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(
          `[SERVICE] Request ${index + 1} successful:`,
          response.data
        );
        return { success: true, data: response.data, itemId: request.id };
      })
      .catch((error) => {
        console.error(
          `[SERVICE] Request ${index + 1} failed:`,
          error.response?.data || error.message
        );
        return {
          success: false,
          error: error.response?.data?.message || error.message,
          itemId: request.id,
        };
      });
  });

  try {
    const results = await Promise.all(submissionPromises);

    // Check if any requests failed
    const failedRequests = results.filter((r) => !r.success);

    if (failedRequests.length > 0) {
      console.error("[SERVICE] Some requests failed:", failedRequests);
      throw new Error(
        `${failedRequests.length} out of ${results.length} requests failed. Please try again.`
      );
    }

    console.log("[SERVICE] All requests completed successfully");
    return results;
  } catch (error) {
    console.error("[SERVICE] Error during submission:", error);
    throw error;
  }
};