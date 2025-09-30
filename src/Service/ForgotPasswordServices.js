import Config from "./Config";
// src/Services/ForgotPasswordServices.js
const forgotPasswordUrl = `${Config.API_BASE_URL}auth/forgetPassword`;


const resetPassword = async (email, newPassword) => {
  try {
    const response = await fetch(forgotPasswordUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
        body: JSON.stringify({ email, newPassword })
    });
   
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset password.");
    }

    return await response.json();
  } catch (error) {
    
    throw new Error(
      error.message || "An error occurred while resetting the password."
    );
  }
};

export default { resetPassword };

