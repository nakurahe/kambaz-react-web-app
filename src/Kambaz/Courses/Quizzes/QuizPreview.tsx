import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import * as questionsClient from "./questionsClient";
import QuestionPreview from "./QuestionPreview";

export default function QuizPreview() {
    const { qid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const quiz = quizzes.find((q: any) => q._id === qid);
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (qid) {
                try {
                    const questions = await questionsClient.findQuestionsForQuiz(qid);
                    setQuestions(questions);
                } catch (error) {
                    setQuestions([]);
                }
            }
        };
        fetchQuestions();
    }, [qid]);

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
                    <strong>Total Points: {quiz.points}</strong> | 
                    <strong> Time Limit: {quiz.timeLimit} minutes</strong>
                </div>
            </div>

            <Card className="mb-3">
                <Card.Header>
                    <h5 className="mb-0">Quiz Instructions</h5>
                </Card.Header>
                <Card.Body>
                    <p>This is a preview of the quiz. Questions are displayed as they would appear to students.</p>
                    <p><strong>Total Questions:</strong> {questions.length}</p>
                    <p><strong>Total Points:</strong> {quiz.points}</p>
                </Card.Body>
            </Card>

            <QuestionPreview 
                questions={questions} 
                onEdit={() => {}} 
                onDelete={() => {}} 
                isPreviewMode={true}
            />
        </div>
    );
}
