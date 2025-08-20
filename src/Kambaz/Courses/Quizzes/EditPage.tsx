import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addQuiz, updateQuiz, setQuizzes } from "./reducer";
import { useState, useEffect } from "react";
import { Nav, Tab } from "react-bootstrap";
import * as quizzesClient from "./client";
import QuestionEditor from "./QuestionEditor";
import QuizDetails from "./QuizEditor";

export default function QuizEditor() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    
    const existingQuiz = qid ? quizzes.find((q: any) => q._id === qid) : null;
    const isEditing = !!qid && !!existingQuiz;

    const [quiz, setQuiz] = useState({
        title: "New Quiz",
        description: "",
        points: 100,
        dueDate: "",
        availableFrom: "",
        availableUntil: "",
        course: cid,
        quizType: "Graded Quiz",
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        howManyAttempts: 1,
        showCorrectAnswers: false,
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        published: false,
        questions: []
    });
    
    const [loading, setLoading] = useState(false);
    const [quizNotFound, setQuizNotFound] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                if (quizzes.length === 0) {
                    const fetchedQuizzes = await quizzesClient.findQuizzesForCourse(cid as string);
                    dispatch(setQuizzes(fetchedQuizzes));
                }
            } catch (error) {
                console.error("Failed to fetch quizzes:", error);
            } finally {
                setLoading(false);
            }
        };
        
        const fetchSpecificQuiz = async () => {
            if (qid && !existingQuiz) {
                try {
                    setLoading(true);
                    const fetchedQuiz = await quizzesClient.findQuizById(qid);
                    if (fetchedQuiz) {
                        const formatDate = (dateString: string) => {
                            if (!dateString) return "";
                            const date = new Date(dateString);
                            return date.toISOString().split('T')[0];
                        };
                        
                        setQuiz({
                            ...fetchedQuiz,
                            dueDate: formatDate(fetchedQuiz.dueDate),
                            availableFrom: formatDate(fetchedQuiz.availableFrom),
                            availableUntil: formatDate(fetchedQuiz.availableUntil),
                            shuffleAnswers: fetchedQuiz.shuffleAnswers ?? true,
                            timeLimit: fetchedQuiz.timeLimit ?? 20,
                            multipleAttempts: fetchedQuiz.multipleAttempts ?? false,
                            howManyAttempts: fetchedQuiz.howManyAttempts ?? 1,
                            showCorrectAnswers: fetchedQuiz.showCorrectAnswers ?? false,
                            accessCode: fetchedQuiz.accessCode ?? "",
                            oneQuestionAtATime: fetchedQuiz.oneQuestionAtATime ?? true,
                            webcamRequired: fetchedQuiz.webcamRequired ?? false,
                            lockQuestionsAfterAnswering: fetchedQuiz.lockQuestionsAfterAnswering ?? false,
                            quizType: fetchedQuiz.quizType ?? "Graded Quiz",
                            assignmentGroup: fetchedQuiz.assignmentGroup ?? "Quizzes",
                            published: fetchedQuiz.published ?? false,
                            questions: fetchedQuiz.questions ?? []
                        });
                    } else {
                        setQuizNotFound(true);
                    }
                } catch (error) {
                    console.error("Failed to fetch quiz:", error);
                    setQuizNotFound(true);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (isEditing && existingQuiz) {
            const formatDate = (dateString: string) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };
            
            setQuiz({
                ...existingQuiz,
                dueDate: formatDate(existingQuiz.dueDate),
                availableFrom: formatDate(existingQuiz.availableFrom),
                availableUntil: formatDate(existingQuiz.availableUntil)
            });
        } else if (qid && !existingQuiz) {
            fetchSpecificQuiz();
        } else {
            fetchQuizzes();
        }
    }, [cid, qid, isEditing, existingQuiz, dispatch, quizzes.length]);

    const handleInputChange = (field: string, value: any) => {
        setQuiz(prev => ({ ...prev, [field]: value }));
    };

    const handleCancel = () => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    };

    const handleSave = async (shouldPublish: boolean = false, shouldNavigate: boolean = true) => {
        try {
            setLoading(true);
            
            const quizData = {
                ...quiz,
                dueDate: quiz.dueDate ? new Date(quiz.dueDate).toISOString() : "",
                availableFrom: quiz.availableFrom ? new Date(quiz.availableFrom).toISOString() : "",
                availableUntil: quiz.availableUntil ? new Date(quiz.availableUntil).toISOString() : "",
                published: shouldPublish ? true : quiz.published
            };

            let savedQuizId = qid;
            
            if (isEditing) {
                const updatedQuiz = await quizzesClient.updateQuiz(quizData);
                dispatch(updateQuiz(updatedQuiz));
            } else {
                const newQuiz = await quizzesClient.createQuizForCourse(cid as string, quizData);
                dispatch(addQuiz(newQuiz));
                savedQuizId = newQuiz._id; // Use the new quiz's ID for navigation
            }

            if (!shouldNavigate) {
                navigate(`/Kambaz/Courses/${cid}/Quizzes/${savedQuizId}`);
            } else {
                navigate(`/Kambaz/Courses/${cid}/Quizzes`);
            }
        } catch (error) {
            console.error("Failed to save quiz:", error);
            alert("Failed to save quiz. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div id="wd-quiz-editor">
                <h3>Loading...</h3>
            </div>
        );
    }

    if (quizNotFound) {
        return (
            <div id="wd-quiz-editor">
                <h3>Quiz not found</h3>
                <button onClick={handleCancel} className="btn btn-secondary">
                    Back to Quizzes
                </button>
            </div>
        );
    }

    return (
        <div id="wd-quiz-editor">
            <h3>{isEditing ? "Edit Quiz" : "Create New Quiz"}</h3>
            
            <Tab.Container id="quiz-editor-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")}>
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link eventKey="details">Details</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="questions">Questions</Nav.Link>
                    </Nav.Item>
                </Nav>
                
                <Tab.Content>
                    <Tab.Pane eventKey="details">
                        <QuizDetails
                            quiz={quiz}
                            onInputChange={handleInputChange}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            loading={loading}
                            isEditing={isEditing}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="questions">
                        <QuestionEditor />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    );
}
