import API from "./api";

export const loginUser = async (email, password) => {
  const response = await API.post("/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await API.post("/register", {
    username,
    email,
    password,
  });

  return response.data;
};