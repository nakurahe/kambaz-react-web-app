import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
import quizzesReducer from "./Courses/Quizzes/reducer";
import coursesReducer from "./Courses/reducer";
import enrollmentsReducer from "./Enrollments/reducer";
import peopleReducer from "./Courses/People/reducer";
import videoQuizReducer from "./Courses/VideoQuiz/reducer";

const store = configureStore({
    reducer: {
        modulesReducer,
        accountReducer,
        assignmentsReducer,
        quizzesReducer,
        coursesReducer,
        enrollmentsReducer,
        peopleReducer,
        videoQuizReducer,
    },
});
export default store;
