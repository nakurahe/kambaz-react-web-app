import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useDispatch } from "react-redux";
import { Card, Button, Alert, Spinner, Badge, ProgressBar } from "react-bootstrap";
import { FaArrowLeft, FaQuestionCircle, FaEdit, FaTrash, FaSync } from "react-icons/fa";
import { setCurrentLesson, deleteLesson as deleteLessonAction } from "./reducer";
import * as lessonsClient from "./client";

export default function LessonDetail() {
    const { cid, lid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [lesson, setLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pollingStatus, setPollingStatus] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchLesson = async () => {
            if (!lid) return;
            try {
                setLoading(true);
                const fetchedLesson = await lessonsClient.findLessonById(lid);
                setLesson(fetchedLesson);
                dispatch(setCurrentLesson(fetchedLesson));
                
                // If quiz generation is in progress, start polling
                if (fetchedLesson.quizGenerationStatus === "pending" || 
                    fetchedLesson.quizGenerationStatus === "processing") {
                    startPolling();
                }
            } catch (err) {
                console.error("Failed to fetch lesson:", err);
                setError("Failed to load lesson");
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
        
        return () => {
            // Cleanup polling on unmount
            setPollingStatus(false);
        };
    }, [lid, dispatch]);

    const startPolling = () => {
        if (pollingStatus) return;
        setPollingStatus(true);
        
        const pollInterval = setInterval(async () => {
            try {
                const updatedLesson = await lessonsClient.findLessonById(lid as string);
                setLesson(updatedLesson);
                
                if (updatedLesson.quizGenerationStatus === "completed" || 
                    updatedLesson.quizGenerationStatus === "error" ||
                    updatedLesson.quizGenerationStatus === "none") {
                    clearInterval(pollInterval);
                    setPollingStatus(false);
                }
            } catch (err) {
                console.error("Polling failed:", err);
                clearInterval(pollInterval);
                setPollingStatus(false);
            }
        }, 3000);
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this lesson?")) {
            return;
        }

        try {
            setDeleting(true);
            await lessonsClient.deleteLesson(lid as string);
            dispatch(deleteLessonAction(lid));
            navigate(`/Kambaz/Courses/${cid}/Modules`);
        } catch (err) {
            console.error("Failed to delete lesson:", err);
            setError("Failed to delete lesson");
        } finally {
            setDeleting(false);
        }
    };

    const handleGenerateQuiz = async () => {
        try {
            await lessonsClient.generateQuizForLesson(lid as string, {
                numQuestions: 10,
                difficulty: "medium"
            });
            // Refresh lesson and start polling
            const updatedLesson = await lessonsClient.findLessonById(lid as string);
            setLesson(updatedLesson);
            startPolling();
        } catch (err: any) {
            console.error("Failed to start quiz generation:", err);
            setError(err.response?.data?.error || "Failed to start quiz generation");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge bg="warning">Pending</Badge>;
            case "processing":
                return <Badge bg="info">Processing</Badge>;
            case "completed":
                return <Badge bg="success">Completed</Badge>;
            case "error":
                return <Badge bg="danger">Error</Badge>;
            default:
                return <Badge bg="secondary">Not Started</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="p-4 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Loading lesson...</p>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="p-4">
                <Alert variant="danger">{error || "Lesson not found"}</Alert>
                <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Modules`)}>
                    <FaArrowLeft className="me-2" />
                    Back to Modules
                </Button>
            </div>
        );
    }

    const videoUrl = lessonsClient.getLessonVideoUrl(lid as string);

    return (
        <div className="p-4">
            <Button 
                variant="link" 
                className="ps-0 mb-3 text-decoration-none"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Modules`)}
            >
                <FaArrowLeft className="me-2" />
                Back to Modules
            </Button>

            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h2>{lesson.name}</h2>
                    {lesson.description && (
                        <p className="text-muted">{lesson.description}</p>
                    )}
                </div>
                <div className="d-flex gap-2">
                    <Button 
                        variant="outline-primary"
                        onClick={() => navigate(`/Kambaz/Courses/${cid}/Modules/${lesson.module}/Lessons/${lid}/edit`)}
                    >
                        <FaEdit className="me-2" />
                        Edit
                    </Button>
                    <Button 
                        variant="outline-danger"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            <>
                                <FaTrash className="me-2" />
                                Delete
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Video Player */}
            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0">Lesson Video</h5>
                </Card.Header>
                <Card.Body className="p-0">
                    {lesson.videoPath ? (
                        <div className="position-relative bg-dark">
                            <video
                                className="w-100"
                                style={{ maxHeight: "500px" }}
                                controls
                            >
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <div className="p-5 text-center text-muted">
                            <p>No video uploaded for this lesson</p>
                        </div>
                    )}
                </Card.Body>
                {lesson.videoFileName && (
                    <Card.Footer className="text-muted">
                        <small>File: {lesson.videoFileName}</small>
                    </Card.Footer>
                )}
            </Card>

            {/* Quiz Status */}
            <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <FaQuestionCircle className="me-2" />
                        Quiz Status
                    </h5>
                    {getStatusBadge(lesson.quizGenerationStatus)}
                </Card.Header>
                <Card.Body>
                    {lesson.quizGenerationStatus === "none" && (
                        <div className="text-center py-3">
                            <p className="text-muted mb-3">No quiz has been generated for this lesson yet.</p>
                            <Button variant="danger" onClick={handleGenerateQuiz}>
                                <FaSync className="me-2" />
                                Generate Quiz from Video
                            </Button>
                        </div>
                    )}

                    {(lesson.quizGenerationStatus === "pending" || lesson.quizGenerationStatus === "processing") && (
                        <div className="text-center py-3">
                            <Spinner animation="border" variant="primary" className="mb-3" />
                            <p className="mb-2">
                                {lesson.quizGenerationStatus === "pending" 
                                    ? "Quiz generation is queued..."
                                    : "Generating quiz from video content..."}
                            </p>
                            <ProgressBar animated now={100} className="mb-2" />
                            <small className="text-muted">
                                This may take several minutes depending on video length.
                            </small>
                        </div>
                    )}

                    {lesson.quizGenerationStatus === "completed" && lesson.quizId && (
                        <div className="text-center py-3">
                            <Alert variant="success" className="mb-3">
                                Quiz has been successfully generated!
                            </Alert>
                            <div className="d-flex justify-content-center gap-2">
                                <Link to={`/Kambaz/Courses/${cid}/Quizzes/${lesson.quizId}`}>
                                    <Button variant="primary">
                                        View Quiz
                                    </Button>
                                </Link>
                                <Link to={`/Kambaz/Courses/${cid}/Quizzes/${lesson.quizId}/edit`}>
                                    <Button variant="outline-primary">
                                        Edit Quiz
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {lesson.quizGenerationStatus === "error" && (
                        <div className="text-center py-3">
                            <Alert variant="danger" className="mb-3">
                                {lesson.quizGenerationError || "Quiz generation failed. Please try again."}
                            </Alert>
                            <Button variant="danger" onClick={handleGenerateQuiz}>
                                <FaSync className="me-2" />
                                Retry Quiz Generation
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Lesson Info */}
            <Card>
                <Card.Header>
                    <h5 className="mb-0">Lesson Information</h5>
                </Card.Header>
                <Card.Body>
                    <table className="table table-borderless mb-0">
                        <tbody>
                            <tr>
                                <th scope="row" style={{ width: "150px" }}>Created:</th>
                                <td>{lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : "N/A"}</td>
                            </tr>
                            <tr>
                                <th scope="row">Updated:</th>
                                <td>{lesson.updatedAt ? new Date(lesson.updatedAt).toLocaleDateString() : "N/A"}</td>
                            </tr>
                            <tr>
                                <th scope="row">Video:</th>
                                <td>{lesson.videoFileName || "No video"}</td>
                            </tr>
                            <tr>
                                <th scope="row">Quiz:</th>
                                <td>
                                    {lesson.quizId ? (
                                        <Link to={`/Kambaz/Courses/${cid}/Quizzes/${lesson.quizId}`}>
                                            View Generated Quiz
                                        </Link>
                                    ) : (
                                        "Not generated"
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Card.Body>
            </Card>
        </div>
    );
}
