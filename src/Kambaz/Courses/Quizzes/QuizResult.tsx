import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import * as questionsClient from "./questionsClient";
import * as quizAttemptsClient from "./quizAttemptsClient";

export default function QuizResult() {
    const { qid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const quiz = quizzes.find((q: any) => q._id === qid);
    const [questions, setQuestions] = useState<any[]>([]);
    const [attempt, setAttempt] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizResult = async () => {
            if (qid && currentUser) {
                try {
                    // Fetch questions
                    const questionsData = await questionsClient.findQuestionsForQuiz(qid);
                    setQuestions(questionsData);

                    // Fetch user's latest attempt for this quiz
                    const attempts = await quizAttemptsClient.findAttemptsByUserAndQuiz(currentUser._id, qid);
                    if (attempts.length > 0) {
                        // Get the most recent attempt
                        const latestAttempt = attempts[0];
                        setAttempt(latestAttempt);
                    }
                } catch (error) {
                    console.error("Error fetching quiz result:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchQuizResult();
    }, [qid, currentUser]);

    const renderQuestionResult = (question: any, index: number) => {
        const attemptAnswer = attempt?.answers?.find((a: any) => a.question === question._id);
        const userAnswers = attemptAnswer?.answer || [];
        const isCorrect = attemptAnswer?.isCorrect || false;
        const pointsEarned = attemptAnswer?.pointsEarned || 0;

        return (
            <ListGroup.Item key={question._id} className="mb-3 border rounded">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                            <h6 className="fw-bold mb-0 text-primary me-3">
                                Question {index + 1}: {question.title || "Untitled Question"}
                            </h6>
                            {isCorrect ? (
                                <Badge bg="success" className="d-flex align-items-center">
                                    <span className="me-1">✓</span> Correct
                                </Badge>
                            ) : (
                                <Badge bg="danger" className="d-flex align-items-center">
                                    <span className="me-1">✗</span> Incorrect
                                </Badge>
                            )}
                        </div>
                        <div className="text-muted small mb-2">
                            <span className="badge bg-secondary me-2">{question.questionType}</span>
                            <span className="fw-bold">{pointsEarned}/{question.points} pts</span>
                        </div>
                    </div>
                </div>

                {/* Question Content */}
                <div className="mb-3 p-3 bg-light rounded">
                    {question.questionDescription ? (
                        <p className="mb-0">{question.questionDescription}</p>
                    ) : (
                        <em className="text-muted">No question description provided</em>
                    )}
                </div>

                {/* Render answers based on question type */}
                {question.questionType === "MultipleChoice" && question.answers && (
                    <div className="ms-3">
                        <div className="fw-bold mb-2">Your Answer:</div>
                        {question.answers.map((answer: string, answerIndex: number) => {
                            const isUserAnswer = userAnswers.includes(answer);
                            const isCorrectAnswer = question.correctAnswers?.includes(answer);
                            
                            return (
                                <div key={answerIndex} className="mb-2 d-flex align-items-center">
                                    <span className={`me-2 ${isUserAnswer ? 'fw-bold' : ''}`}>
                                        {String.fromCharCode(65 + answerIndex)}. {answer}
                                    </span>
                                    {isUserAnswer && (
                                        <span className="me-2">
                                            <Badge bg="info">Your Answer</Badge>
                                        </span>
                                    )}
                                    {isCorrectAnswer && (
                                        <span className="text-success">
                                            ✓ Correct Answer
                                        </span>
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                        <span className="text-danger ms-2">
                                            ✗ Incorrect
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {question.questionType === "True/False" && (
                    <div className="ms-3">
                        <div className="fw-bold mb-2">Your Answer:</div>
                        {["True", "False"].map((option) => {
                            const isUserAnswer = userAnswers.includes(option);
                            const isCorrectAnswer = question.correctAnswers?.includes(option);
                            
                            return (
                                <div key={option} className="mb-2 d-flex align-items-center">
                                    <span className={`me-2 ${isUserAnswer ? 'fw-bold' : ''}`}>
                                        {option}
                                    </span>
                                    {isUserAnswer && (
                                        <span className="me-2">
                                            <Badge bg="info">Your Answer</Badge>
                                        </span>
                                    )}
                                    {isCorrectAnswer && (
                                        <span className="text-success">
                                            ✓ Correct Answer
                                        </span>
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                        <span className="text-danger ms-2">
                                            ✗ Incorrect
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {question.questionType === "FillInBlank" && (
                    <div className="ms-3">
                        <div className="fw-bold mb-2">Your Answer:</div>
                        <div className="mb-2">
                            <span className="fw-bold">Your response: </span>
                            <span className={isCorrect ? "text-success" : "text-danger"}>
                                "{userAnswers[0] || "No answer provided"}"
                            </span>
                            {isCorrect ? (
                                <span className="text-success ms-2">✓ Correct</span>
                            ) : (
                                <span className="text-danger ms-2">✗ Incorrect</span>
                            )}
                        </div>
                        {question.correctAnswers && question.correctAnswers.length > 0 && (
                            <div className="text-success">
                                <strong>Correct answers:</strong> {question.correctAnswers.join(", ")}
                            </div>
                        )}
                    </div>
                )}
            </ListGroup.Item>
        );
    };

    if (loading) {
        return (
            <div className="text-center p-4">
                Loading quiz results...
            </div>
        );
    }

    if (!quiz || !attempt) {
        return (
            <div className="text-center p-4">
                <h4>Quiz results not found</h4>
                <p className="text-muted">Unable to load your quiz results.</p>
            </div>
        );
    }

    return (
        <div id="wd-quiz-result" className="p-3">
            <div className="text-center mb-4">
                <h2>{quiz.title}</h2>
                <p className="text-muted">{quiz.description}</p>
                <div className="text-muted">
                    <strong>Total Questions: {questions.length}</strong> | 
                    <strong> Total Points: {quiz.points}</strong> | 
                    <strong> Time Limit: {quiz.timeLimit} minutes</strong>
                </div>
            </div>

            <Card className="mb-3">
                <Card.Header>
                    <h5 className="mb-0">Quiz Results</h5>
                </Card.Header>
                <Card.Body>
                    <div className="row text-center">
                        <div className="col-md-3">
                            <h4 className="text-primary">{attempt.score}%</h4>
                            <p className="text-muted">Final Score</p>
                        </div>
                        <div className="col-md-3">
                            <h4 className="text-success">{attempt.totalPoints}</h4>
                            <p className="text-muted">Points Earned</p>
                        </div>
                        <div className="col-md-3">
                            <h4 className="text-info">{attempt.maxPoints}</h4>
                            <p className="text-muted">Total Points</p>
                        </div>
                        <div className="col-md-3">
                            <h4 className="text-warning">
                                {attempt.answers?.filter((a: any) => a.isCorrect).length || 0}
                            </h4>
                            <p className="text-muted">Correct Answers</p>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {questions.length === 0 ? (
                <div className="text-center p-5 border border-dashed rounded">
                    <p className="text-muted mb-3">No questions available for this quiz.</p>
                </div>
            ) : (
                <div>
                    <h4 className="mb-3">Question Details</h4>
                    <ListGroup>
                        {questions.map((question, index) => renderQuestionResult(question, index))}
                    </ListGroup>
                </div>
            )}
        </div>
    );
}
