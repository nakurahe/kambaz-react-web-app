import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const PEOPLE_API = `${REMOTE_SERVER}/api/people`;

export const findPeopleForCourse = async (courseId: string) => {
    const response = await axios.get(`${PEOPLE_API}/${courseId}`);
    return response.data;
};

export const createPerson = async (person: any) => {
    const response = await axios.post(PEOPLE_API, person);
    return response.data;
};

export const updatePerson = async (personId: string, personUpdates: any) => {
    const response = await axios.put(`${PEOPLE_API}/${personId}`, personUpdates);
    return response.data;
};

export const deletePerson = async (personId: string) => {
    const response = await axios.delete(`${PEOPLE_API}/${personId}`);
    return response.data;
};
