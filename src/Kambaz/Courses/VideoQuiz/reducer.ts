import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface VideoQuizJob {
    _id: string;
    course: string;
    createdBy: string;
    status: "pending" | "processing" | "completed" | "error";
    videoFileName: string;
    videoPath: string;
    outputDir?: string;
    numQuestions: number;
    difficulty: string;
    generatedQuizId?: string;
    progress: number;
    progressMessage: string;
    errorMessage?: string;
    startedAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

interface VideoQuizState {
    jobs: VideoQuizJob[];
    currentJob: VideoQuizJob | null;
    pipelineAvailable: boolean;
    isUploading: boolean;
    uploadError: string | null;
}

const initialState: VideoQuizState = {
    jobs: [],
    currentJob: null,
    pipelineAvailable: false,
    isUploading: false,
    uploadError: null
};

const videoQuizSlice = createSlice({
    name: "videoQuiz",
    initialState,
    reducers: {
        setJobs: (state, action: PayloadAction<VideoQuizJob[]>) => {
            state.jobs = action.payload;
        },
        addJob: (state, action: PayloadAction<VideoQuizJob>) => {
            state.jobs.unshift(action.payload);
        },
        updateJob: (state, action: PayloadAction<VideoQuizJob>) => {
            const index = state.jobs.findIndex(j => j._id === action.payload._id);
            if (index !== -1) {
                state.jobs[index] = action.payload;
            }
            if (state.currentJob?._id === action.payload._id) {
                state.currentJob = action.payload;
            }
        },
        removeJob: (state, action: PayloadAction<string>) => {
            state.jobs = state.jobs.filter(j => j._id !== action.payload);
            if (state.currentJob?._id === action.payload) {
                state.currentJob = null;
            }
        },
        setCurrentJob: (state, action: PayloadAction<VideoQuizJob | null>) => {
            state.currentJob = action.payload;
        },
        setPipelineAvailable: (state, action: PayloadAction<boolean>) => {
            state.pipelineAvailable = action.payload;
        },
        setUploading: (state, action: PayloadAction<boolean>) => {
            state.isUploading = action.payload;
        },
        setUploadError: (state, action: PayloadAction<string | null>) => {
            state.uploadError = action.payload;
        }
    }
});

export const {
    setJobs,
    addJob,
    updateJob,
    removeJob,
    setCurrentJob,
    setPipelineAvailable,
    setUploading,
    setUploadError
} = videoQuizSlice.actions;

export default videoQuizSlice.reducer;
