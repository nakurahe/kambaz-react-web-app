import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const PEOPLE_API = `${REMOTE_SERVER}/api/people`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const findPeopleForCourse = async (courseId: string) => {
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/users`);
    return response.data;
};

export const createPerson = async (person: any) => {
    const response = await axiosWithCredentials.post(PEOPLE_API, person);
    return response.data;
};

export const updatePerson = async (personId: string, personUpdates: any) => {
    const response = await axiosWithCredentials.put(`${PEOPLE_API}/${personId}`, personUpdates);
    return response.data;
};

export const deletePerson = async (personId: string) => {
    const response = await axiosWithCredentials.delete(`${PEOPLE_API}/${personId}`);
    return response.data;
};
