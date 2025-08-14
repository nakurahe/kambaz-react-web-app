import { IoIosSearch } from "react-icons/io";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { BsGripVertical } from "react-icons/bs";
import { ListGroup } from "react-bootstrap";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { deleteQuiz, setQuizzes } from "./reducer";
import * as quizzesClient from "./client";

export default function Quizzes() {
    const { cid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const courseQuizzes = quizzes.filter((quiz: any) => quiz.course === cid);

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
                                        <GreenCheckmark />
                                        {currentUser.role === "FACULTY" && (
                                            <button 
                                                className="btn btn-danger btn-sm ms-2"
                                                onClick={() => handleDeleteQuiz(quiz._id)}
                                                title="Delete Quiz"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="wd-quiz-list-item-description text-muted small ms-4">
                                    Multiple Modules | <b>Not available until</b> {new Date(quiz.availableFrom).toLocaleDateString()} | <b>Due</b> {new Date(quiz.dueDate).toLocaleDateString()} | <b>{quiz.points} pts</b>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}
