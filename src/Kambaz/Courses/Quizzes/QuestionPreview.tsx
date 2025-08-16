import { Button, ListGroup } from "react-bootstrap";

export default function QuestionPreview({ questions, onEdit, onDelete }: {
    questions: any[];
    onEdit: (questionId: string) => void;
    onDelete: (questionId: string) => void;
}) {
    return (
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
                                        <span className="badge bg-secondary me-2">{question.questionType}</span>
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
                                        onClick={() => onEdit(question._id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => onDelete(question._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
}
