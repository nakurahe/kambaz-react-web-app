import Form from "react-bootstrap/Form";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addQuiz, updateQuiz, setQuizzes } from "./reducer";
import { useState, useEffect } from "react";
import * as quizzesClient from "./client";

export default function QuizEditor() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    
    const existingQuiz = qid ? quizzes.find((q: any) => q._id === qid) : null;
    const isEditing = !!qid && !!existingQuiz;

    const [quiz, setQuiz] = useState({
        title: "New Quiz",
        description: "",
        points: 100,
        dueDate: "",
        availableFrom: "",
        availableUntil: "",
        course: cid
    });
    
    const [loading, setLoading] = useState(false);
    const [quizNotFound, setQuizNotFound] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                if (quizzes.length === 0) {
                    const fetchedQuizzes = await quizzesClient.findQuizzesForCourse(cid as string);
                    dispatch(setQuizzes(fetchedQuizzes));
                }
            } catch (error) {
                console.error("Failed to fetch quizzes:", error);
            } finally {
                setLoading(false);
            }
        };
        
        const fetchSpecificQuiz = async () => {
            if (qid && !existingQuiz) {
                try {
                    setLoading(true);
                    const fetchedQuiz = await quizzesClient.findQuizById(qid);
                    if (fetchedQuiz) {
                        const formatDate = (dateString: string) => {
                            if (!dateString) return "";
                            const date = new Date(dateString);
                            return date.toISOString().split('T')[0];
                        };
                        
                        setQuiz({
                            ...fetchedQuiz,
                            dueDate: formatDate(fetchedQuiz.dueDate),
                            availableFrom: formatDate(fetchedQuiz.availableFrom),
                            availableUntil: formatDate(fetchedQuiz.availableUntil)
                        });
                    } else {
                        setQuizNotFound(true);
                    }
                } catch (error) {
                    console.error("Failed to fetch quiz:", error);
                    setQuizNotFound(true);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchQuizzes();
        if (qid) {
            fetchSpecificQuiz();
        }
    }, [cid, qid, dispatch, quizzes.length, existingQuiz]);

    useEffect(() => {
        if (existingQuiz && !loading) {
            const formatDate = (dateString: string) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };
            
            setQuiz({
                ...existingQuiz,
                dueDate: formatDate(existingQuiz.dueDate),
                availableFrom: formatDate(existingQuiz.availableFrom),
                availableUntil: formatDate(existingQuiz.availableUntil)
            });
        }
    }, [existingQuiz, loading]);

    const handleCancel = () => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            
            // Create ISO date strings for server
            const quizData = {
                ...quiz,
                dueDate: quiz.dueDate ? new Date(quiz.dueDate).toISOString() : "",
                availableFrom: quiz.availableFrom ? new Date(quiz.availableFrom).toISOString() : "",
                availableUntil: quiz.availableUntil ? new Date(quiz.availableUntil).toISOString() : ""
            };

            if (isEditing) {
                const updatedQuiz = await quizzesClient.updateQuiz(quizData);
                dispatch(updateQuiz(updatedQuiz));
            } else {
                const newQuiz = await quizzesClient.createQuizForCourse(cid as string, quizData);
                dispatch(addQuiz(newQuiz));
            }
            
            navigate(`/Kambaz/Courses/${cid}/Quizzes`);
        } catch (error) {
            console.error("Failed to save quiz:", error);
            alert("Failed to save quiz. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (quizNotFound) {
        return <div>Quiz not found</div>;
    }

    return (
        <div id="wd-quiz-editor" className="container-fluid">
            <h3>{isEditing ? "Edit Quiz" : "New Quiz"}</h3>
            <hr />
            
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="wd-quiz-title">Quiz Name</Form.Label>
                    <Form.Control
                        id="wd-quiz-title"
                        type="text"
                        value={quiz.title}
                        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                        placeholder="Enter quiz title"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="wd-quiz-description">Quiz Instructions</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        id="wd-quiz-description"
                        value={quiz.description}
                        onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                        placeholder="Enter quiz instructions"
                    />
                </Form.Group>

                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="wd-quiz-points">Points</Form.Label>
                            <Form.Control
                                id="wd-quiz-points"
                                type="number"
                                value={quiz.points}
                                onChange={(e) => setQuiz({ ...quiz, points: parseInt(e.target.value) || 0 })}
                            />
                        </Form.Group>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="wd-quiz-available-from">Available from</Form.Label>
                            <Form.Control
                                id="wd-quiz-available-from"
                                type="date"
                                value={quiz.availableFrom}
                                onChange={(e) => setQuiz({ ...quiz, availableFrom: e.target.value })}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-4">
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="wd-quiz-due-date">Due</Form.Label>
                            <Form.Control
                                id="wd-quiz-due-date"
                                type="date"
                                value={quiz.dueDate}
                                onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-4">
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="wd-quiz-available-until">Available until</Form.Label>
                            <Form.Control
                                id="wd-quiz-available-until"
                                type="date"
                                value={quiz.availableUntil}
                                onChange={(e) => setQuiz({ ...quiz, availableUntil: e.target.value })}
                            />
                        </Form.Group>
                    </div>
                </div>

                <hr />
                <div className="d-flex justify-content-end">
                    <button 
                        type="button" 
                        className="btn btn-secondary me-2"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-danger"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </Form>
        </div>
    );
}
