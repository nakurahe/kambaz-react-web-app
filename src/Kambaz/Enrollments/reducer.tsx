import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    enrollments: [],
    showAllCourses: false,
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        enrollInCourse: (state, { payload: { userId, courseId } }) => {
            const existingEnrollment = state.enrollments.find(
                (enrollment: any) => 
                    enrollment.user === userId && enrollment.course === courseId
            );
            
            if (!existingEnrollment) {
                const newEnrollment = {
                    _id: uuidv4(),
                    user: userId,
                    course: courseId,
                };
                state.enrollments = [...state.enrollments, newEnrollment] as any;
            }
        },
        unenrollFromCourse: (state, { payload: { userId, courseId } }) => {
            state.enrollments = state.enrollments.filter(
                (enrollment: any) => 
                    !(enrollment.user === userId && enrollment.course === courseId)
            );
        },
        toggleShowAllCourses: (state) => {
            state.showAllCourses = !state.showAllCourses;
        },
        setShowAllCourses: (state, { payload: showAll }) => {
            state.showAllCourses = showAll;
        },
        setEnrollments: (state, { payload: enrollments }) => {
            state.enrollments = enrollments;
        },
    },
});

export const { 
    enrollInCourse, 
    unenrollFromCourse, 
    toggleShowAllCourses, 
    setShowAllCourses,
    setEnrollments 
} = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
