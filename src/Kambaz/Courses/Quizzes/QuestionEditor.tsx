import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { Button, ListGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

export default function QuestionEditor() {
    const { qid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const quiz = quizzes.find((q: any) => q._id === qid);
    const [questions, setQuestions] = useState<any[]>([]);
    const questionsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (quiz && quiz.questions) {
            setQuestions(quiz.questions);
        } else if (quiz && (!quiz.questions || quiz.questions.length === 0)) {
            // Add sample questions for testing if no questions exist
            const sampleQuestions = [
                {
                    _id: "question_sample_1",
                    title: "Sample Multiple Choice Question",
                    type: "Multiple Choice",
                    points: 5,
                    question: "What is the capital of France?",
                    answers: [
                        { text: "London", correct: false },
                        { text: "Berlin", correct: false },
                        { text: "Paris", correct: true },
                        { text: "Madrid", correct: false }
                    ]
                },
                {
                    _id: "question_sample_2",
                    title: "Sample True/False Question",
                    type: "True/False",
                    points: 3,
                    question: "React is a JavaScript library for building user interfaces.",
                    answers: [
                        { text: "True", correct: true },
                        { text: "False", correct: false }
                    ]
                }
            ];
            setQuestions(sampleQuestions);
        }
    }, [quiz]);

    const scrollToBottom = () => {
        questionsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            _id: `question_${Date.now()}`,
            title: `Question ${questions.length + 1}`,
            type: "Multiple Choice",
            points: 1,
            question: "",
            answers: [
                { text: "", correct: true },
                { text: "", correct: false },
                { text: "", correct: false },
                { text: "", correct: false }
            ]
        };
        
        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        
        // Scroll to the new question after a brief delay to ensure DOM update
        setTimeout(scrollToBottom, 100);
    };

    const handleDeleteQuestion = (questionId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this question?");
        if (confirmDelete) {
            setQuestions(questions.filter(q => q._id !== questionId));
        }
    };

    if (!quiz) {
        return (
            <div className="text-center p-4">
                Loading quiz...
            </div>
        );
    }

    return (
        <div id="wd-question-editor" className="p-3">
            {/* Add New Question Button */}
            <div className="d-flex justify-content-start mb-4">
                <Button 
                    variant="danger" 
                    size="lg"
                    onClick={handleAddQuestion}
                    className="d-flex align-items-center"
                >
                    <FaPlus className="me-2" />
                    New Question
                </Button>
            </div>

            {/* Questions List */}
            <div className="questions-list">
                {questions.length === 0 ? (
                    <div className="text-center p-5 border border-dashed rounded">
                        <p className="text-muted mb-3">No questions yet.</p>
                        <p className="text-muted">Click "New Question" to add your first question.</p>
                    </div>
                ) : (
                    <ListGroup>
                        {questions.map((question, index) => (
                            <ListGroup.Item key={question._id} className="mb-3 border rounded">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-2 text-primary">
                                            Question {index + 1}: {question.title}
                                        </h6>
                                        <div className="text-muted small mb-2">
                                            <span className="badge bg-secondary me-2">{question.type}</span>
                                            <span className="fw-bold">{question.points} pts</span>
                                        </div>
                                        <div className="mb-2 p-2 bg-light rounded">
                                            {question.question || <em className="text-muted">Question text not set</em>}
                                        </div>
                                        {question.answers && question.answers.length > 0 && (
                                            <div className="ms-3">
                                                <small className="text-muted fw-bold">Answers:</small>
                                                <ul className="small mt-1 list-unstyled">
                                                    {question.answers.map((answer: any, answerIndex: number) => (
                                                        <li key={answerIndex} className={`mb-1 p-1 ${answer.correct ? "text-success fw-bold bg-light-success" : "text-muted"}`}>
                                                            <span className="me-2">{String.fromCharCode(65 + answerIndex)}.</span>
                                                            {answer.text || <em className="text-muted">Answer text not set</em>}
                                                            {answer.correct && <span className="text-success ms-2">✓ Correct</span>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => console.log("Edit question", question._id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleDeleteQuestion(question._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
                {/* Scroll target */}
                <div ref={questionsEndRef} />
            </div>
        </div>
    );
}
