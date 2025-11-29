import { createSlice } from "@reduxjs/toolkit";

export interface Lesson {
    _id: string;
    name: string;
    description?: string;
    module: string;
    course: string;
    videoPath?: string;
    videoFileName?: string;
    quizId?: string;
    quizGenerationStatus: "none" | "pending" | "processing" | "completed" | "error";
    quizGenerationError?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface LessonsState {
    lessons: Lesson[];
    currentLesson: Lesson | null;
    loading: boolean;
    error: string | null;
}

const initialState: LessonsState = {
    lessons: [],
    currentLesson: null,
    loading: false,
    error: null
};

const lessonsSlice = createSlice({
    name: "lessons",
    initialState,
    reducers: {
        setLessons: (state, action) => {
            state.lessons = action.payload;
        },
        addLesson: (state, action) => {
            state.lessons.push(action.payload);
        },
        updateLesson: (state, action) => {
            const index = state.lessons.findIndex(l => l._id === action.payload._id);
            if (index !== -1) {
                state.lessons[index] = action.payload;
            }
        },
        upsertLesson: (state, action) => {
            const index = state.lessons.findIndex(l => l._id === action.payload._id);
            if (index !== -1) {
                state.lessons[index] = action.payload;
            } else {
                state.lessons.push(action.payload);
            }
        },
        deleteLesson: (state, action) => {
            state.lessons = state.lessons.filter(l => l._id !== action.payload);
        },
        setCurrentLesson: (state, action) => {
            state.currentLesson = action.payload;
        },
        clearCurrentLesson: (state) => {
            state.currentLesson = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        // Get lessons for a specific module
        getLessonsForModule: (state, action) => {
            return {
                ...state,
                lessons: state.lessons.filter(l => l.module === action.payload)
            };
        }
    }
});

export const {
    setLessons,
    addLesson,
    updateLesson,
    upsertLesson,
    deleteLesson,
    setCurrentLesson,
    clearCurrentLesson,
    setLoading,
    setError
} = lessonsSlice.actions;

export default lessonsSlice.reducer;
