import { IoIosSearch } from "react-icons/io";
import { FaPlus, FaCheckCircle } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { ListGroup, Dropdown } from "react-bootstrap";
import { TbCircleDashedCheck } from "react-icons/tb";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { deleteQuiz, setQuizzes, updateQuiz } from "./reducer";
import * as quizzesClient from "./client";

export default function Quizzes() {
    const { cid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const courseQuizzes = quizzes
        .filter((quiz: any) => quiz.course === cid)
        .sort((a: any, b: any) => {
            const dateA = new Date(a.availableFrom || 0).getTime();
            const dateB = new Date(b.availableFrom || 0).getTime();
            return dateA - dateB; // Sort in ascending order (earliest first)
        });

    const fetchQuizzes = async () => {
        try {
            const quizzes = await quizzesClient.findQuizzesForCourse(cid as string);
            dispatch(setQuizzes(quizzes));
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);
        }
    };
    
    useEffect(() => {
        fetchQuizzes();
    }, [cid]);

    const handleDeleteQuiz = async (quizId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this quiz?");
        if (confirmDelete) {
            try {
                await quizzesClient.deleteQuiz(quizId);
                dispatch(deleteQuiz(quizId));
            } catch (error) {
                console.error("Failed to delete quiz:", error);
                alert("Failed to delete quiz. Please try again.");
            }
        }
    };

    const handleTogglePublish = async (quiz: any) => {
        try {
            const updatedQuiz = { ...quiz, published: !quiz.published };
            await quizzesClient.updateQuiz(updatedQuiz);
            dispatch(updateQuiz(updatedQuiz));
        } catch (error) {
            console.error("Failed to update quiz:", error);
            alert("Failed to update quiz. Please try again.");
        }
    };

    const handleEditQuiz = (quizId: string) => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Editor`);
    };

    const getAvailabilityStatus = (quiz: any) => {
        const now = new Date();
        const availableFrom = new Date(quiz.availableFrom);
        const availableUntil = new Date(quiz.availableUntil);

        if (now < availableFrom) {
            return `Not available until ${availableFrom.toLocaleDateString()}`;
        } else if (now > availableUntil) {
            return "Closed";
        } else {
            return "Available";
        }
    };

    const getQuizScore = (quiz: any) => {
        // This would typically come from quiz attempts/submissions data
        // You would fetch this from your backend: /api/quizzes/{quizId}/attempts?userId={currentUser._id}
        if (currentUser.role === "STUDENT") {
            // Simulate different scores based on quiz ID for demo
            const mockScores: { [key: string]: string } = {
                "Q101": "85 / 100",
                "Q102": "-- / 150", // No attempt yet
                "Q103": "72 / 75"
            };
            return mockScores[quiz._id] || "-- / " + quiz.points;
        }
        return null;
    };

    return (
        <div id="wd-quizzes">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="input-group" style={{maxWidth: "300px"}}>
                    <span className="input-group-text bg-white border-end-0">
                        <IoIosSearch />
                    </span>
                    <input 
                        placeholder="Search for Quizzes"
                        id="wd-search-quiz" 
                        className="form-control border-start-0"
                    />
                </div>
                <div>
                    {currentUser.role === "FACULTY" && (
                        <button id="wd-add-quiz" className="btn btn-danger btn-lg"
                                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/Editor`)}>
                            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                            Quiz
                        </button>
                    )}
                </div>
            </div>
            <br /><br /><br /><br />
            <ListGroup className="rounded-0" id="wd-quiz-list">
                <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> QUIZZES 
                        {currentUser.role === "FACULTY" && (
                            <button className="btn btn-outline-dark btn-sm float-end"
                                    onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/Editor`)}>
                                <FaPlus />
                            </button>
                        )}
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        {courseQuizzes.map((quiz: any) => (
                            <ListGroup.Item key={quiz._id} className="wd-lesson p-3 ps-1">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <BsGripVertical className="me-2" />
                                        <button 
                                            className="btn btn-link text-decoration-none p-0 wd-quiz-link"
                                            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`)}
                                            style={{ textAlign: 'left' }}
                                        >
                                            {quiz.title}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        {quiz.published ? (
                                            <FaCheckCircle 
                                                className="text-success me-2" 
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleTogglePublish(quiz)}
                                                title="Click to unpublish"
                                            />
                                        ) : (
                                            <TbCircleDashedCheck 
                                                className="text-secondary me-2" 
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleTogglePublish(quiz)}
                                                title="Click to publish"
                                            />
                                        )}
                                        {currentUser.role === "FACULTY" && (
                                            <Dropdown>
                                                <Dropdown.Toggle 
                                                    variant="link" 
                                                    className="text-dark p-0 border-0 bg-transparent"
                                                    id={`dropdown-quiz-${quiz._id}`}
                                                    bsPrefix="btn"
                                                    style={{ boxShadow: 'none' }}
                                                >
                                                    <IoEllipsisVertical />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleEditQuiz(quiz._id)}>
                                                        Edit
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDeleteQuiz(quiz._id)}>
                                                        Delete
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleTogglePublish(quiz)}>
                                                        {quiz.published ? "Unpublish" : "Publish"}
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        )}
                                    </div>
                                </div>
                                <div className="wd-quiz-list-item-description text-muted small ms-4">
                                    <b>{getAvailabilityStatus(quiz)}</b> | <b>Due</b> {new Date(quiz.dueDate).toLocaleDateString()} | <b>{quiz.points} pts</b> | <b>{quiz.questions?.length || 0} questions</b>
                                    {currentUser.role === "STUDENT" && getQuizScore(quiz) && (
                                        <span> | <b>Score:</b> {getQuizScore(quiz)}</span>
                                    )}
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}
