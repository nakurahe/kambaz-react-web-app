import { useSelector } from "react-redux";
import { useParams, Navigate } from "react-router";

export default function ProtectedCourseRoute({ children }: { children: any }) {
    const { cid } = useParams();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { courses } = useSelector((state: any) => state.coursesReducer);

    // Check if user is enrolled in the course by checking if the course exists in their courses
    const isEnrolled = courses.some((course: any) => course._id === cid);

    // Faculty can access any course
    if (currentUser?.role === "FACULTY" || isEnrolled) {
        return children;
    }

    // Redirect to dashboard if not enrolled
    return <Navigate to="/Kambaz/Dashboard" replace />;
}
