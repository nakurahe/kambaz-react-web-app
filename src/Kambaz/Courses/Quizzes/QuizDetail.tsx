import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table } from "react-bootstrap";
import { useEffect } from "react";
import { setQuizzes } from "./reducer";
import * as quizzesClient from "./client";

export default function QuizDetail() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    
    const quiz = quizzes.find((q: any) => q._id === qid);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                if (quizzes.length === 0) {
                    const fetchedQuizzes = await quizzesClient.findQuizzesForCourse(cid as string);
                    dispatch(setQuizzes(fetchedQuizzes));
                }
            } catch (error) {
                console.error("Failed to fetch quizzes:", error);
            }
        };
        
        fetchQuizzes();
    }, [cid, dispatch, quizzes.length, qid]);
    
    if (!quiz && quizzes.length > 0) {
        return (
            <div className="alert alert-danger">
                Quiz not found.
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="text-center p-4">
                Loading...
            </div>
        );
    }

    const handleEdit = () => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Editor`);
    };

    const handlePreview = () => {
        // For now, just navigate to the quiz detail page
        // You can implement a preview mode later
        console.log("Preview mode - to be implemented");
    };

    const handleStartQuiz = () => {
        // This would typically navigate to a quiz taking interface
        console.log("Start quiz - to be implemented");
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "Not specified";
        const date = new Date(dateString);
        return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
    };

    const formatYesNo = (value: boolean) => {
        return value ? "Yes" : "No";
    };

    return (
        <div id="wd-quiz-detail" className="p-3">
            {/* Button Area - First Row */}
            <div className="d-flex justify-center justify-content-center gap-2 mb-3">
                {currentUser.role === "FACULTY" ? (
                    <>
                        <Button variant="outline-secondary" onClick={handlePreview}>
                            Preview
                        </Button>
                        <Button variant="outline-secondary" onClick={handleEdit}>
                            Edit
                        </Button>
                    </>
                ) : (
                    <Button variant="danger" onClick={handleStartQuiz}>
                        Start Quiz
                    </Button>
                )}
            </div>

            {/* Quiz Details Container with Dotted Border */}
            <div style={{ border: "2px dotted #ccc", padding: "20px" }}>
                {/* Quiz Title - Second Row */}
                <h2 className="mb-4" style={{ fontSize: "2rem", fontWeight: "bold" }}>
                    {quiz.title}
                </h2>

                {/* Quiz Properties - Third to 14th Row */}
                <div className="mb-4">
                    <div className="row mb-2">
                        <div className="col-5"><strong>Quiz Type:</strong></div>
                        <div className="col-7">{quiz.quizType}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5"><strong>Points:</strong></div>
                        <div className="col-7">{quiz.points}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5"><strong>Assignment Group:</strong></div>
                        <div className="col-7">{quiz.assignmentGroup}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5"><strong>Shuffle Answers:</strong></div>
                        <div className="col-7">{formatYesNo(quiz.shuffleAnswers)}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5"><strong>Time Limit:</strong></div>
                        <div className="col-7">{quiz.timeLimit} Minutes</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5"><strong>Multiple Attempts:</strong></div>
                        <div className="col-7">
                            {formatYesNo(quiz.multipleAttempts)}
                            {quiz.multipleAttempts && quiz.howManyAttempts && 
                                `, Total Attempts: ${quiz.howManyAttempts}`
                            }
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5"><strong>Show Correct Answers:</strong></div>
                        <div className="col-7">{formatYesNo(quiz.showCorrectAnswers)}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5"><strong>Access Code:</strong></div>
                        <div className="col-7">{quiz.accessCode || "None"}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5"><strong>One Question at a Time:</strong></div>
                        <div className="col-7">{formatYesNo(quiz.oneQuestionAtATime)}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5"><strong>Webcam Required:</strong></div>
                        <div className="col-7">{formatYesNo(quiz.webcamRequired)}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5"><strong>Lock Questions After Answering:</strong></div>
                        <div className="col-7">{formatYesNo(quiz.lockQuestionsAfterAnswering)}</div>
                    </div>
                </div>

                {/* Date Information Table - Last Two Rows */}
                <Table className="mb-0" style={{ border: "1px solid #dee2e6" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #dee2e6" }}>
                            <th style={{ border: "none", padding: "12px" }}>Due</th>
                            <th style={{ border: "none", padding: "12px" }}>For</th>
                            <th style={{ border: "none", padding: "12px" }}>Available from</th>
                            <th style={{ border: "none", padding: "12px" }}>Until</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: "none", padding: "12px" }}>{formatDate(quiz.dueDate)}</td>
                            <td style={{ border: "none", padding: "12px" }}>Everyone</td>
                            <td style={{ border: "none", padding: "12px" }}>{formatDate(quiz.availableFrom)}</td>
                            <td style={{ border: "none", padding: "12px" }}>{formatDate(quiz.availableUntil)}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
