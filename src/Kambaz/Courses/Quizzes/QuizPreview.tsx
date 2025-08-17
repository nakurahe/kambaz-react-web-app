import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import * as questionsClient from "./questionsClient";
import QuestionPreview from "./QuestionPreview";

export default function QuizPreview() {
    const { qid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const quiz = quizzes.find((q: any) => q._id === qid);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

    const handleSubmitQuiz = () => {
        // In a real application, this would submit the quiz answers
        alert(`Quiz "${quiz.title}" submitted successfully!\n\nThis is a preview mode - no actual submission occurred.`);
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
                            isPreviewMode={true}
                            globalQuestions={questions}
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
