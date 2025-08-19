import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZ_ATTEMPTS_API = `${REMOTE_SERVER}/api/quiz-attempts`;

export interface QuizAttempt {
    _id?: string;
    user: string;
    quiz: string;
    attemptNumber?: number;
    answers: {
        question: string;
        answer: any[];
        isCorrect?: boolean;
        pointsEarned?: number;
    }[];
    totalPoints?: number;
    maxPoints: number;
    score?: number;
    submittedAt?: Date;
    gradedAt?: Date;
    isGraded?: boolean;
}

export interface QuizSubmissionData {
    userId: string;
    quizId: string;
    answers: {
        questionId: string;
        answer: any[];
    }[];
}

// Submit quiz attempt
export const submitQuizAttempt = async (submissionData: QuizSubmissionData): Promise<QuizAttempt> => {
    const response = await axiosWithCredentials.post(QUIZ_ATTEMPTS_API, submissionData);
    return response.data;
};

// Get user's attempts for a quiz
export const findAttemptsByUserAndQuiz = async (userId: string, quizId: string): Promise<QuizAttempt[]> => {
    const response = await axiosWithCredentials.get(`${QUIZ_ATTEMPTS_API}/user/${userId}/quiz/${quizId}`);
    return response.data;
};

// Get all attempts for a quiz (for instructors)
export const findAttemptsByQuiz = async (quizId: string): Promise<QuizAttempt[]> => {
    const response = await axiosWithCredentials.get(`${QUIZ_ATTEMPTS_API}/quiz/${quizId}`);
    return response.data;
};

// Get attempt by ID
export const findAttemptById = async (attemptId: string): Promise<QuizAttempt> => {
    const response = await axiosWithCredentials.get(`${QUIZ_ATTEMPTS_API}/${attemptId}`);
    return response.data;
};

// Grade a quiz attempt
export const gradeQuizAttempt = async (attemptId: string, gradingData: any): Promise<QuizAttempt> => {
    const response = await axiosWithCredentials.put(`${QUIZ_ATTEMPTS_API}/${attemptId}/grade`, gradingData);
    return response.data;
};
