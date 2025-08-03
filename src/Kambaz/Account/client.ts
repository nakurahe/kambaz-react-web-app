import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;
export const signin = async (credentials: any) => {
    const response = await axios.post(`${USERS_API}/signin`, credentials);
    return response.data;
};
export const signup = async (user: any) => {
    const response = await axios.post(`${USERS_API}/signup`, user);
    return response.data;
};
export const updateUser = async (user: any) => {
    const response = await axios.put(`${USERS_API}/${user.id}`, user);
    return response.data;
};