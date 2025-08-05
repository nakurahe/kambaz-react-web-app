import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

export const findAllEnrollments = async (userId: string) => {
    const response = await axios.get(`${ENROLLMENTS_API}/${userId}`);
    return response.data;
};

export const enrollInCourse = async (userId: string, courseId: string) => {
    const response = await axios.post(ENROLLMENTS_API, { userId, courseId });
    return response.data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
    const response = await axios.delete(ENROLLMENTS_API, { 
        data: { userId, courseId } 
    });
    return response.data;
};
