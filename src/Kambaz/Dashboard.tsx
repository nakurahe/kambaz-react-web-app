import { Button, Card, Col, FormControl, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addCourse, deleteCourse, updateCourse, setCourse, updateCourseField } from "./Courses/reducer";
import { toggleShowAllCourses, enrollInCourse, unenrollFromCourse, setEnrollments } from "./Enrollments/reducer";
import * as coursesClient from "./Courses/client";
import * as enrollmentsClient from "./Enrollments/client";
import { setCourses } from "./Courses/reducer";
import * as userClient from "./Account/client";
import { setCurrentUser } from "./Account/reducer";
import { useEffect } from "react";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { courses, course } = useSelector((state: any) => state.coursesReducer);
    const { showAllCourses, enrollments } = useSelector((state: any) => state.enrollmentsReducer);

    useEffect(() => {
        // Load initial enrollments data
        const loadEnrollments = async () => {
            if (!currentUser?._id) {
                return; // Don't try to load enrollments if no user is logged in
            }
            
            try {
                // Try to fetch from server first (if GET endpoint exists)
                const enrollmentsData = await enrollmentsClient.findAllEnrollments(currentUser._id);
                // Filter out any null or invalid enrollments
                const validEnrollments = enrollmentsData.filter((enrollment: any) => 
                    enrollment && enrollment.user && enrollment.course
                );
                dispatch(setEnrollments(validEnrollments));
            } catch (error) {
                console.error("Failed to load enrollments:", error);
                // Fall back to local state if server isn't available
            }
        };

        // Load initial courses data
        const loadInitialCourses = async () => {
            try {
                if (showAllCourses) {
                    // Load all courses when showAllCourses is true (default)
                    const allCourses = await coursesClient.fetchAllCourses();
                    dispatch(setCourses(allCourses));
                } else {
                    // Load user's courses when showAllCourses is false
                    if (currentUser?._id) {
                        const userCourses = await userClient.findMyCourses();
                        dispatch(setCourses(userCourses));
                    }
                }
            } catch (error) {
                console.error("Failed to load courses:", error);
            }
        };

        loadEnrollments();
        loadInitialCourses();
    }, [currentUser, showAllCourses, dispatch]);

    const isUserEnrolledInCourse = (courseId: string) => {
        if (!currentUser) return false;
        return enrollments.some((enrollment: any) => 
            enrollment.user === currentUser._id && enrollment.course === courseId
        );
    };

    const handleEnrollInCourse = async (courseId: string) => {
        if (!currentUser) return;
        try {
            await enrollmentsClient.enrollInCourse(currentUser._id, courseId);
            dispatch(enrollInCourse({ userId: currentUser._id, courseId }));
        } catch (error) {
            console.error("Failed to enroll in course:", error);
            alert("Failed to enroll in course. Please try again.");
        }
    };

    const handleUnenrollFromCourse = async (courseId: string) => {
        if (!currentUser) return;
        const confirmUnenroll = window.confirm("Are you sure you want to unenroll from this course?");
        if (confirmUnenroll) {
            try {
                await enrollmentsClient.unenrollFromCourse(currentUser._id, courseId);
                dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));
                
                // If we're currently showing "My Courses", refresh the course list to remove the unenrolled course
                if (!showAllCourses) {
                    const userCourses = await userClient.findMyCourses();
                    dispatch(setCourses(userCourses));
                }
            } catch (error) {
                console.error("Failed to unenroll from course:", error);
                alert("Failed to unenroll from course. Please try again.");
            }
        }
    };

    const handleAddNewCourse = async () => {
        const newCourse = await userClient.createCourse(course);
        dispatch(addCourse(newCourse));
        
        // Backend automatically enrolls the creator, so we need to update local enrollment state
        if (currentUser && newCourse._id) {
            dispatch(enrollInCourse({ userId: currentUser._id, courseId: newCourse._id }));
        }
    };

    const handleUpdateCourse = async () => {
        try {
            const updatedCourse = await coursesClient.updateCourse(course);
            dispatch(updateCourse(updatedCourse));
        } catch (error: any) {
            console.error("Failed to update course:", error);
            alert("Failed to update course. Please try again.");
        }
    };

    const handleDeleteCourse = async (courseId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (confirmDelete) {
            try {
                await coursesClient.deleteCourse(courseId);
                dispatch(deleteCourse(courseId));
            } catch (error: any) {
                console.error("Failed to delete course:", error);
                alert("Failed to delete course. Please try again.");
            }
        }
    };

    const handleSetCourse = (courseToEdit: any) => {
        dispatch(setCourse(courseToEdit));
    };

    const handleCourseFieldChange = (field: string, value: string) => {
        dispatch(updateCourseField({ field, value }));
    };

    const handleToggleShowAllCourses = async () => {
        try {
            if (!showAllCourses) {
                // Currently showing user's courses, switch to all courses
                const allCourses = await coursesClient.fetchAllCourses();
                dispatch(setCourses(allCourses));
            } else {
                // Currently showing all courses, switch to user's enrolled courses
                const userCourses = await userClient.findMyCourses();
                dispatch(setCourses(userCourses));
            }
            dispatch(toggleShowAllCourses());
        } catch (error: any) {
            if (error.response?.status === 401) {
                // Clear user state to force re-login
                dispatch(setCurrentUser(null));
            }
        }
    };

    const getCoursesToDisplay = () => {
        return courses;
    };
    return (
        <div id="wd-dashboard">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 id="wd-dashboard-title">Dashboard</h1>
                <Button 
                    className="btn btn-primary"
                    onClick={handleToggleShowAllCourses}
                >
                    {showAllCourses ? "Show My Courses" : "Show All Courses"}
                </Button>
            </div>
            <hr />
            {currentUser && currentUser.role === "FACULTY" && (
                <>
                    <h5> New Course
                        <Button className="btn btn-primary float-end"
                            id="wd-add-new-course-click"
                            onClick={handleAddNewCourse} > Add </Button>
                        <Button className="btn btn-warning float-end me-2"
                            id="wd-update-course-click"
                            onClick={handleUpdateCourse} > Update </Button>
                    </h5>
                    <hr />
                    <FormControl value={course.name} className="mb-2"
                        onChange={(e) => handleCourseFieldChange("name", e.target.value)} />
                    <FormControl value={course.description} as="textarea" rows={3}
                        onChange={(e) => handleCourseFieldChange("description", e.target.value)} />
                    <hr />
                </>
            )}
            <h2 id="wd-dashboard-published">
                {showAllCourses ? "All Courses" : "My Courses"} ({getCoursesToDisplay().length})
            </h2> 
            <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {getCoursesToDisplay().map((courseItem: any) => (
                        <Col className="wd-dashboard-course" style={{ width: "300px" }} key={courseItem._id}>
                            <Card>
                                <Link to={`/Kambaz/Courses/${courseItem._id}/Home`}
                                    className="wd-dashboard-course-link text-decoration-none text-dark">
                                    <Card.Img src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                                    <Card.Body className="card-body">
                                        <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                            {courseItem.name}
                                        </Card.Title>
                                        <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                            {courseItem.description}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <Button variant="primary" size="sm"> Go </Button>
                                            
                                            {/* Enrollment buttons - show for any user when viewing all courses */}
                                            {currentUser && showAllCourses && (
                                                <div className="d-flex gap-2">
                                                    {isUserEnrolledInCourse(courseItem._id) ? (
                                                        <Button variant="danger" size="sm"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                handleUnenrollFromCourse(courseItem._id);
                                                            }}>
                                                            Unenroll
                                                        </Button>
                                                    ) : (
                                                        <Button variant="success" size="sm"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                handleEnrollInCourse(courseItem._id);
                                                            }}>
                                                            Enroll
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {/* Faculty-only course management buttons */}
                                            {currentUser && currentUser.role === "FACULTY" && (
                                                <div className="d-flex gap-2">
                                                    <Button variant="warning" size="sm"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            handleSetCourse(courseItem);
                                                        }}
                                                        id="wd-edit-course-click"> Edit </Button>
                                                    <Button variant="danger" size="sm"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            handleDeleteCourse(courseItem._id);
                                                        }}
                                                        id="wd-delete-course-click"> Delete </Button>
                                                </div>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Link>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}
