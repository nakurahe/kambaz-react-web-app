import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import "./styles.css";
import * as db from "./Database";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Kambaz() {
    const [courses, setCourses] = useState<any[]>(db.courses);
    const [course, setCourse] = useState<any>({
        _id: "1234",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        description: "New Description"
    });

    const addNewCourse = () => {
        setCourse([...courses, { ...course, _id: uuidv4() }]);
    };

    const updateCourse = () => {
        setCourse(
            courses.map((c) => {
                if (c._id === course._id) {
                    return course;
                } else {
                    return c;
                }
            })
        );
    };

    const deleteCourse = (courseId: any) => {
        setCourses(courses.filter((c) => c._id !== courseId));
    };

    return (
        <div id="wd-kambaz">
            <KambazNavigation />
            <div className="wd-main-content-offset p-3">
                <Routes>
                    <Route path="/" element={<Navigate to="Account" />} />
                    <Route path="/Account/*" element={<Account />} />
                    <Route path="/Dashboard" element={
                        <Dashboard
                            courses={courses}
                            course={course}
                            setCourse={setCourse}
                            addNewCourse={addNewCourse}
                            updateCourse={updateCourse}
                            deleteCourse={deleteCourse}
                        />
                    } />
                    <Route path="/Courses" element={<Navigate to="/Kambaz/Courses/RS101/Home" />} />
                    <Route path="/Courses/:cid/*" element={<Courses courses={courses} />} />
                    <Route path="Calendar" element={<h1>Calendar</h1>} />
                    <Route path="Inbox" element={<h1>Inbox</h1>} />
                </Routes>
            </div>
        </div>
    );
}