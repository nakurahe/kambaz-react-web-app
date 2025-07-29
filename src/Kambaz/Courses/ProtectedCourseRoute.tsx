import { useSelector } from "react-redux";
import { useParams, Navigate } from "react-router";

export default function ProtectedCourseRoute({ children }: { children: any }) {
    const { cid } = useParams();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

    // Check if user is enrolled in the course
    const isEnrolled = enrollments.some(
        (enrollment: any) => 
            enrollment.user === currentUser._id && enrollment.course === cid
    );

    // Faculty can access any course
    if (currentUser.role === "FACULTY" || isEnrolled) {
        return children;
    }

    // Redirect to dashboard if not enrolled
    return <Navigate to="/Kambaz/Dashboard" replace />;
}
