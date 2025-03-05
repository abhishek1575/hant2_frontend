import axios from "axios";
import config from "./Config";

const BASE_URL = config.API_BASE_URL + "auth/";

class AuthService {
  async login(email, password) {
    const response = await axios.post(
      BASE_URL + "login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.jwt) {
      // console.log("We are Logged in");
      sessionStorage.setItem("UserId", response.data.id);
      sessionStorage.setItem("Email", response.data.email);
      sessionStorage.setItem("Name", response.data.name);

      sessionStorage.setItem("Role", response.data.role);
      sessionStorage.setItem("type", response.data.type);
      sessionStorage.setItem("token", response.data.jwt);
      sessionStorage.setItem("isLoggedIn", true);
      console.log(sessionStorage.getItem("UserId"));
      console.log(sessionStorage.getItem("Email"));
      console.log(sessionStorage.getItem("Name"));
      console.log(sessionStorage.getItem("Email"));
      console.log(sessionStorage.getItem("Role"));
    }
    return response;
  }

  logout() {
    sessionStorage.clear();
  }

  getCurrentUser() {
    return {
      id: sessionStorage.getItem("UserId"),
      name: sessionStorage.getItem("Name"),
      email: sessionStorage.getItem("Email"),
      role: sessionStorage.getItem("Role"),
      token: sessionStorage.getItem("Token"),
      type: sessionStorage.getItem("Type"),
    };
  }

  authHeader() {
    const token = sessionStorage.getItem("Token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return {};
    }
  }
}

export default new AuthService();
