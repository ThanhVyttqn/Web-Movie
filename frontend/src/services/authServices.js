// authService.js
import axios from './axiosToken';

const API = "http://localhost:8000/auth";

export const logout = () => axios.get(`${API}/logout`);
export const login = (email, password) => axios.post(`${API}/signin`, { email, password });
export const register = (userName, email, password, confirmPassword) => axios.post(`${API}/signup`, {userName, email, password, confirmPassword});
export const changepassword = (userId, newPassword, confirmPassword, token) =>
  axios.put(
    `${API}/password/${userId}`,  // Sử dụng đúng URL với userId
    { newPassword, confirmPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,  // Gửi token trong header nếu cần
      },
    }
  );