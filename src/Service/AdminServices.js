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



// purchaseRequestService.js

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - true if expired, false otherwise
 */
export const isTokenExpired = (token) => {
  try {
    if (!token) return true;
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Submit purchase requests for selected items
 * @param {Array} selectedItems - Array of selected item IDs
 * @param {Array} tableData - Array of all items
 * @param {Object} itemRequests - Object containing quantity and returnDate for each item
 * @param {string} globalProjectName - Project name for the request
 * @param {string} globalRemark - Remark/reason for the request
 * @returns {Promise<void>}
 */
export const handleSubmitPurchaseRequest = async (
  selectedItems,
  tableData,
  itemRequests,
  globalProjectName,
  globalRemark
) => {
  // Validation
  if (!globalProjectName.trim()) {
    alert("Please enter project name");
    return;
  }
  if (!globalRemark.trim()) {
    alert("Please enter reason/remark");
    return;
  }

  const validItems = selectedItems.filter((id) => {
    const request = itemRequests[id];
    return request && request.quantity > 0;
  });

  if (validItems.length === 0) {
    alert("Please select items and enter quantities");
    return;
  }

  // Validate return dates for returnable items
  for (const itemId of validItems) {
    const item = tableData.find((i) => i.id === itemId);
    if (item.isReturnable && !itemRequests[itemId].returnDate) {
      alert(`Please enter return date for ${item.name}`);
      return;
    }
  }

  // Get user info and token
  let token = sessionStorage.getItem("token") || "";

  // Check if token is expired
  if (isTokenExpired(token)) {
    console.warn("Token is expired. Please log in again.");
    alert("Your session has expired. Please log in again.");
    // Optionally redirect to login
    // window.location.href = "/login";
    return;
  }

  if (!token) {
    alert("Authentication token not found. Please log in again.");
    return;
  }

  const userId = sessionStorage.getItem("UserId") || 1;
  const userName = sessionStorage.getItem("Name") || "Admin User";

  // Submit requests for each selected item
  try {
    const failedRequests = [];

    for (const itemId of validItems) {
      const item = tableData.find((i) => i.id === itemId);
      const request = itemRequests[itemId];

      const payload = {
        quantityRequested: request.quantity,
        userName: userName,
        userId: parseInt(userId),
        projectName: globalProjectName,
        remark: globalRemark,
        item: { id: itemId },
      };

      if (item.isReturnable && request.returnDate) {
        payload.returnDate = new Date(request.returnDate).toISOString();
      }

      console.log("Submitting payload:", payload);
      console.log("Token being used:", token.substring(0, 20) + "...");

      try {
        const response = await fetch(`${Config.API_BASE_URL}request/request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        console.log(`Response status for ${item.name}:`, response.status);

        if (!response.ok) {
          const errorData = await response.text();
          console.error(
            `Server response for ${item.name}:`,
            response.status,
            errorData
          );

          if (response.status === 403) {
            failedRequests.push(
              `${item.name}: Authorization failed. Check your permissions.`
            );
          } else if (response.status === 401) {
            failedRequests.push(
              `${item.name}: Authentication failed. Your session may have expired.`
            );
          } else {
            failedRequests.push(
              `${item.name}: ${response.statusText} (Status: ${response.status})`
            );
          }
        }
      } catch (fetchError) {
        console.error(`Fetch error for ${item.name}:`, fetchError);
        failedRequests.push(`${item.name}: Network error - ${fetchError.message}`);
      }
    }

    // Handle results
    if (failedRequests.length === 0) {
      alert("Purchase requests submitted successfully!");
      return true; // Indicate success
    } else if (failedRequests.length === validItems.length) {
      // All failed
      alert(
        `Failed to submit all requests:\n\n${failedRequests.join("\n")}`
      );
      return false;
    } else {
      // Partial success
      const successCount = validItems.length - failedRequests.length;
      alert(
        `Partial success: ${successCount} of ${validItems.length} requests submitted.\n\nFailed items:\n${failedRequests.join("\n")}`
      );
      return true;
    }
  } catch (error) {
    console.error("Error submitting purchase requests:", error);
    alert(`Failed to submit purchase requests: ${error.message}`);
    return false;
  }
};