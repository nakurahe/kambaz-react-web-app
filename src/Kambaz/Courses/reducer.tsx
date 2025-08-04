import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    courses: [],
    course: {
        _id: "1234",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        description: "New Description",
        department: "",
        credits: 4
    },
};

const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        addCourse: (state, { payload: course }) => {
            const newCourse: any = {
                ...course,
                _id: uuidv4(),
            };
            state.courses = [...state.courses, newCourse] as any;
        },
        deleteCourse: (state, { payload: courseId }) => {
            state.courses = state.courses.filter(
                (c: any) => c._id !== courseId);
        },
        updateCourse: (state, { payload: course }) => {
            state.courses = state.courses.map((c: any) =>
                c._id === course._id ? course : c) as any;
        },
        editCourse: (state, { payload: courseId }) => {
            const courseToEdit = state.courses.find((c: any) => c._id === courseId);
            if (courseToEdit) {
                state.course = courseToEdit as any;
            }
        },
        setCourse: (state, { payload: course }) => {
            state.course = course;
        },
        updateCourseField: (state, { payload: { field, value } }) => {
            state.course = { ...state.course, [field]: value };
        },
        setCourses: (state, { payload: courses }) => {
            state.courses = courses;
        },
    },
});

export const { 
    addCourse, 
    deleteCourse, 
    updateCourse, 
    editCourse, 
    setCourse, 
    updateCourseField,
    setCourses 
} = coursesSlice.actions;
export default coursesSlice.reducer;
