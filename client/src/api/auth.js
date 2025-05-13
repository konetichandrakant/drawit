import axios from "axios";

export const logOutService = async () => {
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/logout`, {}, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    });
    localStorage.removeItem('token');
    window.location.href = '/login';
  } catch (err) {
    console.error(err);
  }
};