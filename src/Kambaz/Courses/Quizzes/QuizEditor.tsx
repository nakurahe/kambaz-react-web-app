import Form from "react-bootstrap/Form";

interface QuizDetailsProps {
    quiz: any;
    onInputChange: (field: string, value: any) => void;
    onSave: (shouldPublish: boolean, shouldNavigate: boolean) => void;
    onCancel: () => void;
    loading: boolean;
    isEditing: boolean;
}

export default function QuizDetails({ 
    quiz, 
    onInputChange, 
    onSave, 
    onCancel, 
    loading
}: QuizDetailsProps) {
    const handleSaveOnly = () => {
        onSave(false, false); // Don't navigate
    };

    const handleSaveAndPublish = () => {
        onSave(true, true); // Navigate back to list
    };

    return (
        <div id="wd-quiz-details">
            <Form.Group controlId="wd-name">
                <Form.Label>Quiz Name</Form.Label>
                <Form.Control 
                    type="text" 
                    value={quiz.title}
                    onChange={(e) => onInputChange("title", e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="wd-description">
                <Form.Label>Quiz Instructions</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={5} 
                    value={quiz.description}
                    onChange={(e) => onInputChange("description", e.target.value)}
                />
            </Form.Group>
            <br />
            
            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end" htmlFor="wd-quiz-type">
                    Quiz Type
                </Form.Label>
                <div className="col-sm-10">
                    <Form.Select 
                        id="wd-quiz-type" 
                        value={quiz.quizType}
                        onChange={(e) => onInputChange("quizType", e.target.value)}
                    >
                        <option value="Graded Quiz">Graded Quiz</option>
                        <option value="Practice Quiz">Practice Quiz</option>
                        <option value="Graded Survey">Graded Survey</option>
                        <option value="Ungraded Survey">Ungraded Survey</option>
                    </Form.Select>
                </div>
            </Form.Group>

            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end" htmlFor="wd-points">
                    Points
                </Form.Label>
                <div className="col-sm-10">
                    <Form.Control 
                        id="wd-points" 
                        type="number" 
                        value={quiz.points}
                        onChange={(e) => onInputChange("points", parseInt(e.target.value) || 0)}
                    />
                </div>
            </Form.Group>

            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end" htmlFor="wd-assignment-group">
                    Assignment Group
                </Form.Label>
                <div className="col-sm-10">
                    <Form.Select 
                        id="wd-assignment-group" 
                        value={quiz.assignmentGroup}
                        onChange={(e) => onInputChange("assignmentGroup", e.target.value)}
                    >
                        <option value="Quizzes">Quizzes</option>
                        <option value="Exams">Exams</option>
                        <option value="Assignments">Assignments</option>
                        <option value="Project">Project</option>
                    </Form.Select>
                </div>
            </Form.Group>

            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end align-top">
                    Options
                </Form.Label>
                <div className="col-sm-10">
                    <div className="border p-3">
                        <Form.Check 
                            type="checkbox" 
                            id="wd-shuffle-answers" 
                            label="Shuffle Answers"
                            checked={quiz.shuffleAnswers}
                            onChange={(e) => onInputChange("shuffleAnswers", e.target.checked)}
                        />
                        
                        <Form.Group className="row mb-3 mt-3">
                            <Form.Label column sm={3} htmlFor="wd-time-limit">
                                Time Limit
                            </Form.Label>
                            <div className="col-sm-9">
                                <div className="d-flex align-items-center">
                                    <Form.Control 
                                        id="wd-time-limit" 
                                        type="number" 
                                        value={quiz.timeLimit}
                                        onChange={(e) => onInputChange("timeLimit", parseInt(e.target.value) || 0)}
                                        style={{ width: "100px" }}
                                    />
                                    <span className="ms-2">Minutes</span>
                                </div>
                            </div>
                        </Form.Group>

                        <Form.Check 
                            type="checkbox" 
                            id="wd-multiple-attempts" 
                            label="Allow Multiple Attempts"
                            checked={quiz.multipleAttempts}
                            onChange={(e) => onInputChange("multipleAttempts", e.target.checked)}
                        />

                        {quiz.multipleAttempts && (
                            <Form.Group className="row mb-3 mt-2">
                                <Form.Label column sm={3} htmlFor="wd-attempts">
                                    How Many Attempts
                                </Form.Label>
                                <div className="col-sm-9">
                                    <Form.Control 
                                        id="wd-attempts" 
                                        type="number" 
                                        value={quiz.howManyAttempts}
                                        onChange={(e) => onInputChange("howManyAttempts", parseInt(e.target.value) || 1)}
                                        style={{ width: "100px" }}
                                    />
                                </div>
                            </Form.Group>
                        )}

                        <Form.Check 
                            type="checkbox" 
                            id="wd-show-correct-answers" 
                            label="Show Correct Answers"
                            checked={quiz.showCorrectAnswers}
                            onChange={(e) => onInputChange("showCorrectAnswers", e.target.checked)}
                        />

                        <Form.Group className="mb-3 mt-3">
                            <Form.Label htmlFor="wd-access-code">Access Code</Form.Label>
                            <Form.Control 
                                id="wd-access-code" 
                                type="text" 
                                value={quiz.accessCode}
                                onChange={(e) => onInputChange("accessCode", e.target.value)}
                                placeholder="Optional access code"
                            />
                        </Form.Group>

                        <Form.Check 
                            type="checkbox" 
                            id="wd-one-question-at-time" 
                            label="One Question at a Time"
                            checked={quiz.oneQuestionAtATime}
                            onChange={(e) => onInputChange("oneQuestionAtATime", e.target.checked)}
                        />

                        <Form.Check 
                            type="checkbox" 
                            id="wd-webcam-required" 
                            label="Webcam Required"
                            checked={quiz.webcamRequired}
                            onChange={(e) => onInputChange("webcamRequired", e.target.checked)}
                        />

                        <Form.Check 
                            type="checkbox" 
                            id="wd-lock-questions" 
                            label="Lock Questions After Answering"
                            checked={quiz.lockQuestionsAfterAnswering}
                            onChange={(e) => onInputChange("lockQuestionsAfterAnswering", e.target.checked)}
                        />
                    </div>
                </div>
            </Form.Group>

            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end align-top" htmlFor="wd-assign">
                    Assign
                </Form.Label>
                <div className="col-sm-10">
                    <div className="border p-3">
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="wd-assign-to">Assign to</Form.Label>
                            <Form.Control id="wd-assign-to" type="text" defaultValue="Everyone" />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="wd-due-date">Due</Form.Label>
                            <Form.Control 
                                id="wd-due-date" 
                                type="date" 
                                value={quiz.dueDate}
                                onChange={(e) => onInputChange("dueDate", e.target.value)}
                            />
                        </Form.Group>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label htmlFor="wd-available-from">Available From</Form.Label>
                                    <Form.Control 
                                        id="wd-available-from" 
                                        type="date" 
                                        value={quiz.availableFrom}
                                        onChange={(e) => onInputChange("availableFrom", e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label htmlFor="wd-available-until">Until</Form.Label>
                                    <Form.Control 
                                        id="wd-available-until" 
                                        type="date" 
                                        value={quiz.availableUntil}
                                        onChange={(e) => onInputChange("availableUntil", e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </Form.Group>
            <hr />
            <div className="text-end">
                <button 
                    onClick={onCancel} 
                    className="btn btn-secondary me-2"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSaveOnly} 
                    className="btn btn-warning me-2"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
                <button 
                    onClick={handleSaveAndPublish} 
                    className="btn btn-danger"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save & Publish"}
                </button>
            </div>
        </div>
    );
}
