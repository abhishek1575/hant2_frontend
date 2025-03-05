export default function authHeader() {
  const userId = sessionStorage.getItem("UserID");
  const accessToken = sessionStorage.getItem("Token");

  if (userId && accessToken) {
    return { Authorization: "Bearer " + accessToken };
  } else {
    return {};
  }
}
