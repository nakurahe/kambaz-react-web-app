import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { Button, Dropdown, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import * as questionsClient from "./questionsClient";
import QuestionPreview from "./QuestionPreview";

export default function QuestionEditor() {
    const { qid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const quiz = quizzes.find((q: any) => q._id === qid);
    const [questions, setQuestions] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<any | null>(null);
    const [isNew, setIsNew] = useState(false);
    const questionsEndRef = useRef<HTMLDivElement>(null);

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

    // Enter edit mode for a question
    const handleEditQuestion = (questionId: string) => {
        const question = questions.find(q => q._id === questionId);
        if (question) {
            setEditingId(questionId);
            setEditData({ ...question });
            setIsNew(false);
        }
    };

    // Enter new question mode
    const handleAddQuestion = async () => {
        if (!qid) return;
        const newQuestion = {
            title: "",
            questionType: "MultipleChoice",
            points: 1,
            answers: ["", ""],
            correctAnswers: [],
        };
        setEditingId("new");
        setEditData(newQuestion);
        setIsNew(true);
        setTimeout(scrollToBottom, 100);
    };

    const scrollToBottom = () => {
        questionsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleDeleteQuestion = async (questionId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this question?");
        if (confirmDelete) {
            try {
                await questionsClient.deleteQuestion(questionId);
                setQuestions(questions.filter(q => q._id !== questionId));
            } catch (error) {
                // handle error
            }
        }
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData(null);
        setIsNew(false);
    };

    // Save or update question
    const handleSaveOrUpdate = async () => {
        if (!qid || !editData) return;
        // Sanitize payload to match backend schema
        let payload = { ...editData };
        // Always use correct questionType spelling
        if (payload.questionType === "Multiple Choice") payload.questionType = "MultipleChoice";
        if (payload.questionType === "True/False") payload.questionType = "True/False";
        if (payload.questionType === "FillInBlank") payload.questionType = "FillInBlank";
        // Answers must be string[]
        if (Array.isArray(payload.answers)) {
            payload.answers = payload.answers.map((a: any) => typeof a === "string" ? a : (a.text ?? ""));
        }
        // correctAnswers must be string[] or boolean[]
        if (payload.questionType === "True/False") {
            payload.answers = ["True", "False"];
            // Only one correct answer
            payload.correctAnswers = [payload.correctAnswers[0] ?? "True"];
        } else if (payload.questionType === "FillInBlank") {
            payload.answers = [""];
            payload.correctAnswers = payload.correctAnswers.filter((a: any) => a !== "");
        } else if (payload.questionType === "MultipleChoice") {
            // correctAnswers: selected answer text as string array
            payload.correctAnswers = payload.correctAnswers[0] ? [payload.correctAnswers[0]] : [];
        }
        try {
            let saved;
            if (isNew) {
                saved = await questionsClient.createQuestionForQuiz(qid, payload);
                setQuestions([...questions, saved]);
            } else {
                await questionsClient.updateQuestion(editingId!, payload);
                setQuestions(questions.map(q => q._id === editingId ? payload : q));
            }
            handleCancelEdit();
        } catch (error) {
            // handle error
        }
    };

    // Editable UI for a question
    const renderEditForm = () => {
        if (!editData) return null;
        // Controlled values
        const questionType = editData.questionType;
        return (
            <div className="border rounded p-4 mb-4" style={{ background: '#f9f9f9' }}>
                <div className="d-flex align-items-center mb-3">
                    <Dropdown className="me-3">
                        <Form.Label className="me-2 fw-bold">Question Type:</Form.Label>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-question-type">
                            {questionType}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {["MultipleChoice", "True/False", "FillInBlank"].map(type => (
                                <Dropdown.Item key={type} onClick={() => {
                                    let newData = { ...editData, questionType: type };
                                    if (type === "True/False") {
                                        newData.answers = ["True", "False"];
                                        newData.correctAnswers = ["True"];
                                    } else if (type === "FillInBlank") {
                                        newData.answers = [""];
                                        newData.correctAnswers = [""];
                                    } else if (type === "MultipleChoice") {
                                        newData.answers = ["", ""];
                                        newData.correctAnswers = [""];
                                    }
                                    setEditData(newData);
                                }}>{type}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Label className="me-2 fw-bold">Points:</Form.Label>
                    <Form.Control type="number" style={{ width: 80 }} value={editData.points ?? 1} min={1} onChange={e => setEditData({ ...editData, points: Number(e.target.value) })} />
                </div>
                <hr />
                <div className="mb-2 text-muted">Enter your question and answers, then select the correct answer(s)</div>
                <div className="fw-bold mb-1" style={{ fontSize: '1.2rem' }}>Question Title:</div>
                <Form.Control className="mb-3" type="text" placeholder="Enter question title" value={editData.title ?? ""} onChange={e => setEditData({ ...editData, title: e.target.value })} />
                {/* Answers UI by type */}
                {questionType === "MultipleChoice" && (
                    <>
                        <div className="fw-bold mb-1" style={{ fontSize: '1.2rem' }}>Answers:</div>
                        {editData.answers.map((answer: string, idx: number) => (
                            <div key={idx} className="d-flex align-items-center mb-2">
                                <Form.Check type="radio" name="correctAnswer" checked={editData.correctAnswers[0] === answer} onChange={() => {
                                    setEditData({ ...editData, correctAnswers: [answer] });
                                }} className="me-2" />
                                <Form.Control type="text" value={answer ?? ""} placeholder={`Answer ${idx + 1}`} style={{ width: '300px' }} onChange={e => {
                                    const newAnswers = editData.answers.map((a: string, i: number) => i === idx ? e.target.value : a);
                                    // If answer text changes, update correctAnswers too
                                    let correctAnswers = editData.correctAnswers;
                                    if (editData.correctAnswers[0] === answer) {
                                        correctAnswers = [e.target.value];
                                    }
                                    setEditData({ ...editData, answers: newAnswers, correctAnswers });
                                }} />
                                <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => {
                                    const newAnswers = editData.answers.filter((_: string, i: number) => i !== idx);
                                    let correctAnswers = editData.correctAnswers;
                                    if (editData.correctAnswers[0] === answer) {
                                        correctAnswers = [""];
                                    }
                                    setEditData({ ...editData, answers: newAnswers, correctAnswers });
                                }} disabled={editData.answers.length <= 2}>Remove</Button>
                                {editData.correctAnswers[0] === answer && (
                                    <span className="text-success ms-2 fw-bold">✓ Correct Answer</span>
                                )}
                            </div>
                        ))}
                        <div className="d-flex justify-content-end">
                            <Button variant="outline-success" size="sm" onClick={() => setEditData({
                                ...editData,
                                answers: [...editData.answers, ""]
                            })}>
                                + Add Another Answer
                            </Button>
                        </div>
                    </>
                )}
                {questionType === "True/False" && (
                    <>
                        <div className="fw-bold mb-1" style={{ fontSize: '1.2rem' }}>Correct Answer:</div>
                        <div className="d-flex gap-3 mb-2">
                            {["True", "False"].map((val) => (
                                <Form.Check
                                    key={val}
                                    type="radio"
                                    label={val}
                                    name="correctAnswer"
                                    checked={editData.correctAnswers[0] === val}
                                    onChange={() => setEditData({ ...editData, correctAnswers: [val] })}
                                />
                            ))}
                        </div>
                    </>
                )}
                {questionType === "FillInBlank" && (
                    <>
                        <div className="fw-bold mb-1" style={{ fontSize: '1.2rem' }}>Correct Answers:</div>
                        {editData.correctAnswers.map((answer: string, idx: number) => (
                            <div key={idx} className="d-flex align-items-center mb-2">
                                <Form.Control type="text" value={answer ?? ""} placeholder={`Correct Answer ${idx + 1}`} onChange={e => {
                                    const newCorrectAnswers = editData.correctAnswers.map((a: string, i: number) => i === idx ? e.target.value : a);
                                    setEditData({ ...editData, correctAnswers: newCorrectAnswers });
                                }} />
                                <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => {
                                    const newCorrectAnswers = editData.correctAnswers.filter((_: string, i: number) => i !== idx);
                                    setEditData({ ...editData, correctAnswers: newCorrectAnswers });
                                }} disabled={editData.correctAnswers.length <= 1}>Remove</Button>
                            </div>
                        ))}
                        <div className="d-flex justify-content-end">
                            <Button variant="outline-success" size="sm" onClick={() => setEditData({
                                ...editData,
                                correctAnswers: [...editData.correctAnswers, ""]
                            })}>
                                + Add Another Correct Answer
                            </Button>
                        </div>
                    </>
                )}
                <div className="d-flex justify-content-end mt-4 gap-2">
                    <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveOrUpdate}>{isNew ? "Save" : "Update"}</Button>
                </div>
            </div>
        );
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

            {/* Show all questions in edit form mode */}
            {questions.map((question, index) => (
                <div key={question._id} className="mb-4">
                    {/* <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">Question {index + 1}</h5>
                        <div className="d-flex gap-2">
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleEditQuestion(question._id)}
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
                    </div> */}
                    {editingId === question._id ? (
                        renderEditForm()
                    ) : (
                        <QuestionPreview
                            questions={[question]}
                            onEdit={handleEditQuestion}
                            onDelete={handleDeleteQuestion}
                            isPreviewMode={false}
                        />
                    )}
                </div>
            ))}

            {/* Show new question form if adding */}
            {editingId === "new" && (
                <div className="mb-4">
                    <h5 className="mb-2">New Question</h5>
                    {renderEditForm()}
                </div>
            )}

            {/* Empty state */}
            {questions.length === 0 && editingId !== "new" && (
                <div className="text-center p-5 border border-dashed rounded">
                    <p className="text-muted mb-3">No questions yet.</p>
                    <p className="text-muted">Click "New Question" to add your first question.</p>
                </div>
            )}

            <div ref={questionsEndRef} />
        </div>
    );
}
