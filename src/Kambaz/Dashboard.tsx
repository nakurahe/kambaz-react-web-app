import { Button, Card, Col, FormControl, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addCourse, deleteCourse, updateCourse, setCourse, updateCourseField } from "./Courses/reducer";
import { toggleShowAllCourses } from "./Enrollments/reducer";
import * as coursesClient from "./Courses/client";
import { setCourses } from "./Courses/reducer";
import * as userClient from "./Account/client";
import { setCurrentUser } from "./Account/reducer";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { courses, course } = useSelector((state: any) => state.coursesReducer);
    const { showAllCourses } = useSelector((state: any) => state.enrollmentsReducer);

    const handleAddNewCourse = () => {
        dispatch(addCourse(course));
    };

    const handleUpdateCourse = () => {
        dispatch(updateCourse(course));
    };

    const handleDeleteCourse = (courseId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (confirmDelete) {
            dispatch(deleteCourse(courseId));
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
            {currentUser && currentUser.role === "FACULTY" && <h5> New Course
                <Button className="btn btn-primary float-end"
                    id="wd-add-new-course-click"
                    onClick={handleAddNewCourse} > Add </Button>
                <Button className="btn btn-warning float-end me-2"
                    id="wd-update-course-click"
                    onClick={handleUpdateCourse} > Update </Button>
            </h5>}<hr />
            <FormControl value={course.name} className="mb-2"
                onChange={(e) => handleCourseFieldChange("name", e.target.value)} />
            <FormControl value={course.description} as="textarea" rows={3}
                onChange={(e) => handleCourseFieldChange("description", e.target.value)} />
            <hr />
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