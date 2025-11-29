import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const VIDEO_QUIZ_API = `${REMOTE_SERVER}/api/video-quiz`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

// Check pipeline status
export const getPipelineStatus = async () => {
    const { data } = await axiosWithCredentials.get(`${VIDEO_QUIZ_API}/status`);
    return data;
};

// Get all jobs for a course
export const findJobsForCourse = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/video-quiz/jobs`);
    return data;
};

// Get job by ID
export const findJobById = async (jobId: string) => {
    const { data } = await axiosWithCredentials.get(`${VIDEO_QUIZ_API}/jobs/${jobId}`);
    return data;
};

// Upload video and start processing
export const uploadVideo = async (
    courseId: string, 
    videoFile: File, 
    options: { numQuestions?: number; difficulty?: string } = {}
) => {
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("numQuestions", String(options.numQuestions || 10));
    formData.append("difficulty", options.difficulty || "medium");
    
    const { data } = await axiosWithCredentials.post(
        `${COURSES_API}/${courseId}/video-quiz/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return data;
};

// Delete a job
export const deleteJob = async (jobId: string) => {
    const { data } = await axiosWithCredentials.delete(`${VIDEO_QUIZ_API}/jobs/${jobId}`);
    return data;
};

// Retry a failed job
export const retryJob = async (jobId: string) => {
    const { data } = await axiosWithCredentials.post(`${VIDEO_QUIZ_API}/jobs/${jobId}/retry`);
    return data;
};
