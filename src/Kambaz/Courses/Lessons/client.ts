import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const LESSONS_API = `${REMOTE_SERVER}/api/lessons`;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

const axiosWithCredentials = axios.create({ withCredentials: true });

// Get all lessons for a module
export const findLessonsForModule = async (moduleId: string) => {
    const { data } = await axiosWithCredentials.get(`${MODULES_API}/${moduleId}/lessons`);
    return data;
};

// Get all lessons for a course
export const findLessonsForCourse = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/lessons`);
    return data;
};

// Get a single lesson
export const findLessonById = async (lessonId: string) => {
    const { data } = await axiosWithCredentials.get(`${LESSONS_API}/${lessonId}`);
    return data;
};

// Create a new lesson with video upload
export const createLesson = async (
    moduleId: string, 
    lessonData: {
        name: string;
        description?: string;
        course: string;
        generateQuiz?: boolean;
        numQuestions?: number;
        difficulty?: string;
    },
    videoFile?: File
) => {
    const formData = new FormData();
    formData.append("name", lessonData.name);
    formData.append("description", lessonData.description || "");
    formData.append("course", lessonData.course);
    
    if (lessonData.generateQuiz) {
        formData.append("generateQuiz", "true");
        formData.append("numQuestions", String(lessonData.numQuestions || 10));
        formData.append("difficulty", lessonData.difficulty || "medium");
    }
    
    if (videoFile) {
        formData.append("video", videoFile);
    }
    
    const { data } = await axiosWithCredentials.post(
        `${MODULES_API}/${moduleId}/lessons`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return data;
};

// Update a lesson
export const updateLesson = async (
    lessonId: string,
    updates: {
        name?: string;
        description?: string;
        generateQuiz?: boolean;
        numQuestions?: number;
        difficulty?: string;
    },
    videoFile?: File
) => {
    const formData = new FormData();
    
    if (updates.name) formData.append("name", updates.name);
    if (updates.description !== undefined) formData.append("description", updates.description);
    
    if (updates.generateQuiz) {
        formData.append("generateQuiz", "true");
        formData.append("numQuestions", String(updates.numQuestions || 10));
        formData.append("difficulty", updates.difficulty || "medium");
    }
    
    if (videoFile) {
        formData.append("video", videoFile);
    }
    
    const { data } = await axiosWithCredentials.put(
        `${LESSONS_API}/${lessonId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return data;
};

// Delete a lesson
export const deleteLesson = async (lessonId: string) => {
    const { data } = await axiosWithCredentials.delete(`${LESSONS_API}/${lessonId}`);
    return data;
};

// Trigger quiz generation for an existing lesson
export const generateQuizForLesson = async (
    lessonId: string,
    options: { numQuestions?: number; difficulty?: string } = {}
) => {
    const { data } = await axiosWithCredentials.post(
        `${LESSONS_API}/${lessonId}/generate-quiz`,
        options
    );
    return data;
};

// Get video URL for a lesson
export const getLessonVideoUrl = (lessonId: string) => {
    return `${LESSONS_API}/${lessonId}/video`;
};
