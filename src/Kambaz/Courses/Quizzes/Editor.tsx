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
        course: cid,
        quizType: "Graded Quiz",
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        howManyAttempts: 1,
        showCorrectAnswers: false,
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        published: false,
        questions: []
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
                            availableUntil: formatDate(fetchedQuiz.availableUntil),
                            // Ensure all boolean and number fields have defaults
                            shuffleAnswers: fetchedQuiz.shuffleAnswers ?? true,
                            timeLimit: fetchedQuiz.timeLimit ?? 20,
                            multipleAttempts: fetchedQuiz.multipleAttempts ?? false,
                            howManyAttempts: fetchedQuiz.howManyAttempts ?? 1,
                            showCorrectAnswers: fetchedQuiz.showCorrectAnswers ?? false,
                            accessCode: fetchedQuiz.accessCode ?? "",
                            oneQuestionAtATime: fetchedQuiz.oneQuestionAtATime ?? true,
                            webcamRequired: fetchedQuiz.webcamRequired ?? false,
                            lockQuestionsAfterAnswering: fetchedQuiz.lockQuestionsAfterAnswering ?? false,
                            quizType: fetchedQuiz.quizType ?? "Graded Quiz",
                            assignmentGroup: fetchedQuiz.assignmentGroup ?? "Quizzes",
                            published: fetchedQuiz.published ?? false,
                            questions: fetchedQuiz.questions ?? []
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
                availableUntil: formatDate(existingQuiz.availableUntil),
                // Ensure all boolean and number fields have defaults
                shuffleAnswers: existingQuiz.shuffleAnswers ?? true,
                timeLimit: existingQuiz.timeLimit ?? 20,
                multipleAttempts: existingQuiz.multipleAttempts ?? false,
                howManyAttempts: existingQuiz.howManyAttempts ?? 1,
                showCorrectAnswers: existingQuiz.showCorrectAnswers ?? false,
                accessCode: existingQuiz.accessCode ?? "",
                oneQuestionAtATime: existingQuiz.oneQuestionAtATime ?? true,
                webcamRequired: existingQuiz.webcamRequired ?? false,
                lockQuestionsAfterAnswering: existingQuiz.lockQuestionsAfterAnswering ?? false,
                quizType: existingQuiz.quizType ?? "Graded Quiz",
                assignmentGroup: existingQuiz.assignmentGroup ?? "Quizzes",
                published: existingQuiz.published ?? false,
                questions: existingQuiz.questions ?? []
            });
        }
    }, [existingQuiz, loading]);

    const handleCancel = () => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    };

    const handleInputChange = (field: string, value: any) => {
        setQuiz({ ...quiz, [field]: value });
    };

    const handleSave = async (shouldPublish = false, shouldNavigate = true) => {
        try {
            setLoading(true);
            
            // Create ISO date strings for server
            const quizData = {
                ...quiz,
                dueDate: quiz.dueDate ? new Date(quiz.dueDate).toISOString() : "",
                availableFrom: quiz.availableFrom ? new Date(quiz.availableFrom).toISOString() : "",
                availableUntil: quiz.availableUntil ? new Date(quiz.availableUntil).toISOString() : "",
                published: shouldPublish ? true : quiz.published // Set published status
            };

            if (isEditing) {
                const updatedQuiz = await quizzesClient.updateQuiz(quizData);
                dispatch(updateQuiz(updatedQuiz));
            } else {
                const newQuiz = await quizzesClient.createQuizForCourse(cid as string, quizData);
                dispatch(addQuiz(newQuiz));
            }

            if (!shouldNavigate) {
                window.location.reload();
            } else {
                navigate(`/Kambaz/Courses/${cid}/Quizzes`);
            }
        } catch (error) {
            console.error("Failed to save quiz:", error);
            alert("Failed to save quiz. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveOnly = () => {
        handleSave(false, false); // Don't navigate
    };

    const handleSaveAndPublish = () => {
        handleSave(true, true); // Navigate back to list
    };

    if (loading) {
        return (
            <div id="wd-quiz-editor">
                <h3>Loading...</h3>
            </div>
        );
    }

    if (quizNotFound) {
        return (
            <div id="wd-quiz-editor">
                <h3>Quiz not found</h3>
                <button onClick={handleCancel} className="btn btn-secondary">
                    Back to Quizzes
                </button>
            </div>
        );
    }

    return (
        <div id="wd-quiz-editor">
            <h3>{isEditing ? "Edit Quiz" : "New Quiz"}</h3>
            <Form.Group controlId="wd-name">
                <Form.Label>Quiz Name</Form.Label>
                <Form.Control 
                    type="text" 
                    value={quiz.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="wd-description">
                <Form.Label>Quiz Instructions</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={5} 
                    value={quiz.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                />
            </Form.Group>
            <br />
            
            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end" htmlFor="wd-quiz-type">
                    Quiz Type
                </Form.Label>
                <div className="col-sm-10">
                    <Form.Select 
                        id="wd-quiz-type" 
                        value={quiz.quizType}
                        onChange={(e) => handleInputChange("quizType", e.target.value)}
                    >
                        <option value="Graded Quiz">Graded Quiz</option>
                        <option value="Practice Quiz">Practice Quiz</option>
                        <option value="Graded Survey">Graded Survey</option>
                        <option value="Ungraded Survey">Ungraded Survey</option>
                    </Form.Select>
                </div>
            </Form.Group>

            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end" htmlFor="wd-points">
                    Points
                </Form.Label>
                <div className="col-sm-10">
                    <Form.Control 
                        id="wd-points" 
                        type="number" 
                        value={quiz.points}
                        onChange={(e) => handleInputChange("points", parseInt(e.target.value) || 0)}
                    />
                </div>
            </Form.Group>

            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end" htmlFor="wd-assignment-group">
                    Assignment Group
                </Form.Label>
                <div className="col-sm-10">
                    <Form.Select 
                        id="wd-assignment-group" 
                        value={quiz.assignmentGroup}
                        onChange={(e) => handleInputChange("assignmentGroup", e.target.value)}
                    >
                        <option value="Quizzes">Quizzes</option>
                        <option value="Exams">Exams</option>
                        <option value="Assignments">Assignments</option>
                        <option value="Project">Project</option>
                    </Form.Select>
                </div>
            </Form.Group>

            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end align-top">
                    Options
                </Form.Label>
                <div className="col-sm-10">
                    <div className="border p-3">
                        <Form.Check 
                            type="checkbox" 
                            id="wd-shuffle-answers" 
                            label="Shuffle Answers"
                            checked={quiz.shuffleAnswers}
                            onChange={(e) => handleInputChange("shuffleAnswers", e.target.checked)}
                        />
                        
                        <Form.Group className="row mb-3 mt-3">
                            <Form.Label column sm={3} htmlFor="wd-time-limit">
                                Time Limit
                            </Form.Label>
                            <div className="col-sm-9">
                                <div className="d-flex align-items-center">
                                    <Form.Control 
                                        id="wd-time-limit" 
                                        type="number" 
                                        value={quiz.timeLimit}
                                        onChange={(e) => handleInputChange("timeLimit", parseInt(e.target.value) || 0)}
                                        style={{ width: "100px" }}
                                    />
                                    <span className="ms-2">Minutes</span>
                                </div>
                            </div>
                        </Form.Group>

                        <Form.Check 
                            type="checkbox" 
                            id="wd-multiple-attempts" 
                            label="Allow Multiple Attempts"
                            checked={quiz.multipleAttempts}
                            onChange={(e) => handleInputChange("multipleAttempts", e.target.checked)}
                        />

                        {quiz.multipleAttempts && (
                            <Form.Group className="row mb-3 mt-2">
                                <Form.Label column sm={3} htmlFor="wd-attempts">
                                    How Many Attempts
                                </Form.Label>
                                <div className="col-sm-9">
                                    <Form.Control 
                                        id="wd-attempts" 
                                        type="number" 
                                        value={quiz.howManyAttempts}
                                        onChange={(e) => handleInputChange("howManyAttempts", parseInt(e.target.value) || 1)}
                                        style={{ width: "100px" }}
                                    />
                                </div>
                            </Form.Group>
                        )}

                        <Form.Check 
                            type="checkbox" 
                            id="wd-show-correct-answers" 
                            label="Show Correct Answers"
                            checked={quiz.showCorrectAnswers}
                            onChange={(e) => handleInputChange("showCorrectAnswers", e.target.checked)}
                        />

                        <Form.Group className="mb-3 mt-3">
                            <Form.Label htmlFor="wd-access-code">Access Code</Form.Label>
                            <Form.Control 
                                id="wd-access-code" 
                                type="text" 
                                value={quiz.accessCode}
                                onChange={(e) => handleInputChange("accessCode", e.target.value)}
                                placeholder="Optional access code"
                            />
                        </Form.Group>

                        <Form.Check 
                            type="checkbox" 
                            id="wd-one-question-at-time" 
                            label="One Question at a Time"
                            checked={quiz.oneQuestionAtATime}
                            onChange={(e) => handleInputChange("oneQuestionAtATime", e.target.checked)}
                        />

                        <Form.Check 
                            type="checkbox" 
                            id="wd-webcam-required" 
                            label="Webcam Required"
                            checked={quiz.webcamRequired}
                            onChange={(e) => handleInputChange("webcamRequired", e.target.checked)}
                        />

                        <Form.Check 
                            type="checkbox" 
                            id="wd-lock-questions" 
                            label="Lock Questions After Answering"
                            checked={quiz.lockQuestionsAfterAnswering}
                            onChange={(e) => handleInputChange("lockQuestionsAfterAnswering", e.target.checked)}
                        />
                    </div>
                </div>
            </Form.Group>

            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end align-top" htmlFor="wd-assign">
                    Assign
                </Form.Label>
                <div className="col-sm-10">
                    <div className="border p-3">
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="wd-assign-to">Assign to</Form.Label>
                            <Form.Control id="wd-assign-to" type="text" defaultValue="Everyone" />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="wd-due-date">Due</Form.Label>
                            <Form.Control 
                                id="wd-due-date" 
                                type="date" 
                                value={quiz.dueDate}
                                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                            />
                        </Form.Group>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label htmlFor="wd-available-from">Available From</Form.Label>
                                    <Form.Control 
                                        id="wd-available-from" 
                                        type="date" 
                                        value={quiz.availableFrom}
                                        onChange={(e) => handleInputChange("availableFrom", e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label htmlFor="wd-available-until">Until</Form.Label>
                                    <Form.Control 
                                        id="wd-available-until" 
                                        type="date" 
                                        value={quiz.availableUntil}
                                        onChange={(e) => handleInputChange("availableUntil", e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </Form.Group>
            <hr />
            <div className="text-end">
                <button 
                    onClick={handleCancel} 
                    className="btn btn-secondary me-2"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSaveOnly} 
                    className="btn btn-warning me-2"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
                <button 
                    onClick={handleSaveAndPublish} 
                    className="btn btn-danger"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save & Publish"}
                </button>
            </div>
        </div>
    );
}
