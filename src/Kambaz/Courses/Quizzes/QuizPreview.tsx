import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import * as questionsClient from "./questionsClient";
import * as quizAttemptsClient from "./quizAttemptsClient";
import QuestionPreview from "./QuestionPreview";

export default function QuizPreview() {
    const { qid } = useParams();
    const navigate = useNavigate();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const quiz = quizzes.find((q: any) => q._id === qid);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{[questionId: string]: any[]}>({});

    useEffect(() => {
        const fetchQuestions = async () => {
            if (qid) {
                try {
                    const questions = await questionsClient.findQuestionsForQuiz(qid);
                    setQuestions(questions);
                    setCurrentQuestionIndex(0); // Reset to first question when questions load
                } catch (error) {
                    setQuestions([]);
                }
            }
        };
        fetchQuestions();
    }, [qid]);

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
    };

    const handleAnswerChange = (questionId: string, answers: any[]) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answers
        }));
    };

    const handleSubmitQuiz = async () => {
        if (!currentUser) {
            alert("You must be logged in to submit a quiz.");
            return;
        }

        // Check for unanswered questions
        const unansweredQuestions = questions.filter(q => !userAnswers[q._id] || userAnswers[q._id].length === 0);
        if (unansweredQuestions.length > 0) {
            const confirmSubmit = confirm(
                `You have ${unansweredQuestions.length} unanswered question(s). Are you sure you want to submit?`
            );
            if (!confirmSubmit) {
                return;
            }
        }

        try {
            // Prepare answers for submission - backend expects questionId property
            const answersForSubmission = questions.map(question => ({
                questionId: question._id,
                answer: userAnswers[question._id] || []
            }));

            // Backend expects userId, quizId, answers structure
            const submissionData: quizAttemptsClient.QuizSubmissionData = {
                userId: currentUser._id,
                quizId: qid!,
                answers: answersForSubmission
            };

            await quizAttemptsClient.submitQuizAttempt(submissionData);
            alert(`Quiz "${quiz.title}" submitted successfully!`);
            
            // Navigate to quiz results page
            navigate(`/Kambaz/Courses/${quiz.course}/Quizzes/${qid}/result`);
        } catch (error) {
            console.error("Error submitting quiz:", error);
            alert("Failed to submit quiz. Please try again.");
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    if (!quiz) {
        return (
            <div className="text-center p-4">
                Loading quiz...
            </div>
        );
    }

    return (
        <div id="wd-quiz-preview" className="p-3">
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
                    <h5 className="mb-0">Quiz Instructions</h5>
                </Card.Header>
                <Card.Body>
                    <p>This is a preview of the quiz. Questions are displayed as they would appear to students.</p>
                </Card.Body>
            </Card>

            {/* Edit Quiz Button for Faculty */}
            {currentUser?.role === "FACULTY" && (
                <div className="mb-3 text-end">
                    <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => navigate(`/Kambaz/Courses/${quiz.course}/Quizzes/${qid}/Editor`)}
                    >
                        Edit this quiz
                    </Button>
                </div>
            )}

            {questions.length === 0 ? (
                <div className="text-center p-5 border border-dashed rounded">
                    <p className="text-muted mb-3">No questions available for this quiz.</p>
                </div>
            ) : (
                <div>
                    {/* Question Progress */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="text-muted">
                            Question {currentQuestionIndex + 1} of {questions.length}
                            <span className="ms-2 small">
                                ({Object.keys(userAnswers).length} answered)
                            </span>
                        </div>
                        <div className="d-flex gap-2">
                            <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={handleNextQuestion}
                                disabled={currentQuestionIndex === questions.length - 1}
                            >
                                Next
                            </Button>
                        </div>
                    </div>

                    {/* Current Question Display */}
                    {currentQuestion && (
                        <QuestionPreview 
                            questions={[currentQuestion]} 
                            onEdit={() => {}} 
                            onDelete={() => {}} 
                            isPreviewMode={false}
                            showEditButtons={false}
                            globalQuestions={questions}
                            userAnswers={userAnswers}
                            onAnswerChange={handleAnswerChange}
                        />
                    )}

                    {/* Submit Section on Last Question */}
                    {currentQuestionIndex === questions.length - 1 && (
                        <div className="text-end">
                            <Button 
                                variant="success" 
                                size="sm"
                                onClick={handleSubmitQuiz}
                                className="px-5"
                            >
                                Submit
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
