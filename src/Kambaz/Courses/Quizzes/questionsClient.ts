import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;

// Get all questions for a quiz
export const findQuestionsForQuiz = async (quizId: string) => {
    const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/questions`);
    return data;
};

// Get all questions
export const findAllQuestions = async () => {
    const { data } = await axiosWithCredentials.get(`${QUESTIONS_API}`);
    return data;
};

// Get question by ID
export const findQuestionById = async (questionId: string) => {
    const { data } = await axiosWithCredentials.get(`${QUESTIONS_API}/${questionId}`);
    return data;
};

// Create new question for a quiz
export const createQuestionForQuiz = async (quizId: string, question: any) => {
    const { data } = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/questions`, question);
    return data;
};

// Delete question
export const deleteQuestion = async (questionId: string) => {
    const { data } = await axiosWithCredentials.delete(`${QUESTIONS_API}/${questionId}`);
    return data;
};

// Update question
export const updateQuestion = async (questionId: string, questionUpdates: any) => {
    const { data } = await axiosWithCredentials.put(`${QUESTIONS_API}/${questionId}`, questionUpdates);
    return data;
};

// Delete all questions for a quiz
export const deleteQuestionsForQuiz = async (quizId: string) => {
    const { data } = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}/questions`);
    return data;
};
