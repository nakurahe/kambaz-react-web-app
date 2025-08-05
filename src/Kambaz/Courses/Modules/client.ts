import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;

// export const fetchAllModules = async () => {
//     const { data } = await axios.get(MODULES_API);
//     return data;
// };

export const deleteModule = async (moduleId: string) => {
    const { data } = await axios.delete(`${MODULES_API}/${moduleId}`);
    return data;
};

// export const updateModule = async (module: any) => {
//     const { data } = await axios.put(`${MODULES_API}/${module._id}`, module);
//     return data;
// };

// export const findLessonsForModule = async (moduleId: string) => {
//     const response = await axios.get(`${MODULES_API}/${moduleId}/lessons`);
//     return response.data;
// };

// export const createLessonForModule = async (moduleId: string, lesson: any) => {
//     const response = await axios.post(
//         `${MODULES_API}/${moduleId}/lessons`,
//         lesson
//     );
//     return response.data;
// };
