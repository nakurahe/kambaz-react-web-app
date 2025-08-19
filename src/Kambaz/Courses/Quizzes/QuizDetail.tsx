import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { updateQuiz } from "./reducer";
import * as quizzesClient from "./client";
import * as quizAttemptsClient from "./quizAttemptsClient";

export default function QuizDetail() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [attemptInfo, setAttemptInfo] = useState<{attemptCount: number, maxAttempts: number} | null>(null);
    
    const quiz = quizzes.find((q: any) => q._id === qid);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                if (qid) {
                    const fetchedQuiz = await quizzesClient.findQuizById(qid as string);
                    if (fetchedQuiz) {
                        dispatch(updateQuiz(fetchedQuiz));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch quiz:", error);
            }
        };
        fetchQuiz();
    }, [qid, dispatch]);

    // Fetch attempt info for students
    useEffect(() => {
        const fetchAttemptInfo = async () => {
            if (currentUser?.role === "STUDENT" && qid && quiz) {
                try {
                    const existingAttempts = await quizAttemptsClient.findAttemptsByUserAndQuiz(currentUser._id, qid);
                    const attemptCount = existingAttempts.length;
                    const maxAttempts = quiz.howManyAttempts || 1;
                    setAttemptInfo({ attemptCount, maxAttempts });
                } catch (error) {
                    console.error("Error fetching attempt info:", error);
                }
            }
        };
        
        if (quiz) {
            fetchAttemptInfo();
        }
    }, [currentUser, qid, quiz]);
    
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
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Preview`);
    };

    const handleStartQuiz = async () => {
        if (!currentUser || !qid) {
            alert("You must be logged in to take a quiz.");
            return;
        }

        try {
            // Check user's existing attempts for this quiz
            const existingAttempts = await quizAttemptsClient.findAttemptsByUserAndQuiz(currentUser._id, qid);
            const attemptCount = existingAttempts.length;
            const maxAttempts = quiz.howManyAttempts || 1;

            if (attemptCount >= maxAttempts) {
                // User has exhausted attempts, redirect to result page
                // alert(`You have used all ${maxAttempts} attempt(s) for this quiz. Redirecting to your results.`);
                navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/result`);
                return;
            }

            // User can take the quiz, navigate to preview (quiz taking interface)
            navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Preview`);
        } catch (error) {
            console.error("Error checking quiz attempts:", error);
            alert("Failed to check quiz attempts. Please try again.");
        }
    };

    const handleViewResults = () => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/result`);
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
                    <>
                        {/* Start Quiz Button - Always show if attempts remain */}
                        {attemptInfo && attemptInfo.attemptCount < attemptInfo.maxAttempts ? (
                            <Button 
                                variant="danger" 
                                onClick={handleStartQuiz}
                            >
                                Start Quiz
                                {attemptInfo && ` (${attemptInfo.attemptCount}/${attemptInfo.maxAttempts} attempts used)`}
                            </Button>
                        ) : attemptInfo && attemptInfo.attemptCount >= attemptInfo.maxAttempts ? (
                            <Button 
                                variant="secondary" 
                                onClick={handleViewResults}
                            >
                                View Results
                            </Button>
                        ) : (
                            <Button 
                                variant="danger" 
                                onClick={handleStartQuiz}
                            >
                                Start Quiz
                            </Button>
                        )}
                        
                        {/* View Results Button - Show if student has made at least one attempt */}
                        {attemptInfo && attemptInfo.attemptCount > 0 && attemptInfo.attemptCount < attemptInfo.maxAttempts && (
                            <Button 
                                variant="outline-secondary" 
                                onClick={handleViewResults}
                            >
                                View Previous Results
                            </Button>
                        )}
                    </>
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
