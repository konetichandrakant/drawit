import axios from "axios";

export const logIn = async () => {
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/login`, {}, {
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

export const register = async () => {
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/register`, {}, {
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

export const logOut = async () => {
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