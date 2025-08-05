import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import "./styles.css";
import ProtectedRoute from "./Account/ProtectedRoute";
import ProtectedCourseRoute from "./Courses/ProtectedCourseRoute";
import Session from "./Account/Session";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCourses } from "./Courses/reducer";
import * as userClient from "./Account/client";

export default function Kambaz() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const fetchCourses = async () => {
        try {
            const courses = await userClient.findMyCourses();
            dispatch(setCourses(courses));
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchCourses();
        }
    }, [currentUser]);
    
    return (
        <Session>
            <div id="wd-kambaz">
                <KambazNavigation />
                <div className="wd-main-content-offset p-3">
                    <Routes>
                        <Route key="root" path="/" element={<Navigate to="Account" />} />
                        <Route key="account" path="/Account/*" element={<Account />} />
                        <Route key="dashboard" path="/Dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route key="courses-list" path="/Courses" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route key="courses-detail" path="/Courses/:cid/*" element={
                            <ProtectedRoute>
                                <ProtectedCourseRoute>
                                    <Courses />
                                </ProtectedCourseRoute>
                            </ProtectedRoute>
                        } />
                        <Route key="calendar" path="Calendar" element={<h1>Calendar</h1>} />
                        <Route key="inbox" path="Inbox" element={<h1>Inbox</h1>} />
                    </Routes>
                </div>
            </div>
        </Session>
    );
}