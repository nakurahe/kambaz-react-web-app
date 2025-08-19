import { Button, ListGroup, Form } from "react-bootstrap";

export default function QuestionPreview({ 
    questions, 
    onEdit, 
    onDelete, 
    isPreviewMode = false, 
    showEditButtons = true,
    globalQuestions,
    userAnswers = {},
    onAnswerChange
}: {
    questions: any[];
    onEdit: (questionId: string) => void;
    onDelete: (questionId: string) => void;
    isPreviewMode?: boolean;
    showEditButtons?: boolean;
    globalQuestions?: any[];
    userAnswers?: {[questionId: string]: any[]};
    onAnswerChange?: (questionId: string, answers: any[]) => void;
}) {
    const renderQuestionContent = (question: any, index: number) => {
        const questionTitle = question.title || "Untitled Question";
        const questionDescription = question.questionDescription || "";
        
        // If globalQuestions is provided, find the correct index from the full list
        const actualIndex = globalQuestions ? 
            globalQuestions.findIndex(q => q._id === question._id) : 
            index;
        
        return (
            <div className="flex-grow-1">
                <h6 className="fw-bold mb-2 text-primary">
                    Question {actualIndex + 1}: {questionTitle}
                </h6>
                <div className="text-muted small mb-2">
                    <span className="badge bg-secondary me-2">{question.questionType}</span>
                    <span className="fw-bold">{question.points} pts</span>
                </div>
                
                {/* Question Content */}
                <div className="mb-3 p-3 bg-light rounded">
                    {questionDescription ? (
                        <p className="mb-0">{questionDescription}</p>
                    ) : (
                        <em className="text-muted">No question description provided</em>
                    )}
                </div>

                {/* Render answers based on question type */}
                {question.questionType === "MultipleChoice" && question.answers && (
                    <div className="ms-3">
                        <div className="fw-bold mb-2">Select the best answer:</div>
                        {question.answers.map((answer: string, answerIndex: number) => {
                            const isSelected = userAnswers[question._id]?.includes(answer);
                            return (
                                <div key={answerIndex} className="mb-2">
                                    <Form.Check 
                                        type="radio" 
                                        name={`question-${question._id}`}
                                        label={`${String.fromCharCode(65 + answerIndex)}. ${answer}`}
                                        disabled={isPreviewMode && !onAnswerChange}
                                        checked={isSelected}
                                        onChange={(e) => {
                                            if (e.target.checked && onAnswerChange) {
                                                onAnswerChange(question._id, [answer]);
                                            }
                                        }}
                                    />
                                    {isPreviewMode && question.correctAnswers && question.correctAnswers.includes(answer) && 
                                        <span className="text-success ms-2">✓ Correct Answer</span>
                                    }
                                </div>
                            );
                        })}
                    </div>
                )}

                {question.questionType === "True/False" && (
                    <div className="ms-3">
                        <div className="fw-bold mb-2">Select True or False:</div>
                        {["True", "False"].map((option) => {
                            const isSelected = userAnswers[question._id]?.includes(option);
                            return (
                                <div key={option} className="mb-2">
                                    <Form.Check 
                                        type="radio" 
                                        name={`question-${question._id}`}
                                        label={option}
                                        disabled={isPreviewMode && !onAnswerChange}
                                        checked={isSelected}
                                        onChange={(e) => {
                                            if (e.target.checked && onAnswerChange) {
                                                onAnswerChange(question._id, [option]);
                                            }
                                        }}
                                    />
                                    {isPreviewMode && question.correctAnswers && question.correctAnswers.includes(option) && 
                                        <span className="text-success ms-2">✓ Correct Answer</span>
                                    }
                                </div>
                            );
                        })}
                    </div>
                )}

                {question.questionType === "FillInBlank" && (
                    <div className="ms-3">
                        <div className="fw-bold mb-2">Enter your answer:</div>
                        <Form.Control 
                            type="text" 
                            placeholder="Type your answer here..."
                            disabled={isPreviewMode && !onAnswerChange}
                            value={userAnswers[question._id]?.[0] || ""}
                            onChange={(e) => {
                                if (onAnswerChange) {
                                    onAnswerChange(question._id, [e.target.value]);
                                }
                            }}
                            className="mb-2"
                        />
                        {isPreviewMode && question.correctAnswers && question.correctAnswers.length > 0 && (
                            <div className="text-success">
                                <strong>Correct answers:</strong> {question.correctAnswers.join(", ")}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="questions-list">
            {questions.length === 0 ? (
                <div className="text-center p-5 border border-dashed rounded">
                    <p className="text-muted mb-3">No questions yet.</p>
                    {!isPreviewMode && <p className="text-muted">Click "New Question" to add your first question.</p>}
                </div>
            ) : (
                <ListGroup>
                    {questions.map((question, index) => (
                        <ListGroup.Item key={question._id} className="mb-3 border rounded">
                            <div className="d-flex justify-content-between align-items-start">
                                {renderQuestionContent(question, index)}
                                {showEditButtons && (
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
                                )}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
}
