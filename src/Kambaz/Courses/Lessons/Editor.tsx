import { useCallback, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, ProgressBar, Alert, Card, Spinner } from "react-bootstrap";
import { FaCloudUploadAlt, FaVideo, FaArrowLeft } from "react-icons/fa";
import { addLesson, updateLesson as updateLessonAction, setLessons } from "./reducer";
import * as lessonsClient from "./client";

export default function LessonEditor() {
    const { cid, mid, lid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { lessons } = useSelector((state: any) => state.lessonsReducer);
    
    const existingLesson = lid ? lessons.find((l: any) => l._id === lid) : null;
    const isEditing = !!lid && !!existingLesson;

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [generateQuiz, setGenerateQuiz] = useState(false);
    const [numQuestions, setNumQuestions] = useState(10);
    const [difficulty, setDifficulty] = useState("medium");
    
    // UI state
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [lessonNotFound, setLessonNotFound] = useState(false);

    useEffect(() => {
        const fetchLessons = async () => {
            if (!mid) return;
            try {
                setLoading(true);
                const fetchedLessons = await lessonsClient.findLessonsForModule(mid);
                dispatch(setLessons(fetchedLessons));
            } catch (err) {
                console.error("Failed to fetch lessons:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchSpecificLesson = async () => {
            if (lid && !existingLesson) {
                try {
                    setLoading(true);
                    const fetchedLesson = await lessonsClient.findLessonById(lid);
                    if (fetchedLesson) {
                        setName(fetchedLesson.name || "");
                        setDescription(fetchedLesson.description || "");
                        setLessonNotFound(false);
                    } else {
                        setLessonNotFound(true);
                    }
                } catch (err) {
                    console.error("Failed to fetch lesson:", err);
                    setLessonNotFound(true);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (lessons.length === 0) {
            fetchLessons();
        }
        fetchSpecificLesson();

        if (isEditing && existingLesson) {
            setName(existingLesson.name || "");
            setDescription(existingLesson.description || "");
        }
    }, [isEditing, existingLesson, mid, lid, lessons.length, dispatch]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (isVideoFile(file)) {
                setSelectedFile(file);
            } else {
                setError("Please upload a video file (MP4, AVI, MOV, MKV)");
            }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setError(null);
        }
    };

    const isVideoFile = (file: File) => {
        const validTypes = ["video/mp4", "video/avi", "video/quicktime", "video/x-matroska"];
        const validExtensions = [".mp4", ".avi", ".mov", ".mkv"];
        return validTypes.includes(file.type) || 
               validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Lesson name is required");
            return;
        }

        if (!isEditing && !selectedFile) {
            setError("Please upload a video file");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            setUploadProgress(0);

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            if (isEditing) {
                const updatedLesson = await lessonsClient.updateLesson(
                    lid as string,
                    {
                        name,
                        description,
                        generateQuiz,
                        numQuestions,
                        difficulty
                    },
                    selectedFile || undefined
                );
                dispatch(updateLessonAction(updatedLesson));
            } else {
                const newLesson = await lessonsClient.createLesson(
                    mid as string,
                    {
                        name,
                        description,
                        course: cid as string,
                        generateQuiz,
                        numQuestions,
                        difficulty
                    },
                    selectedFile || undefined
                );
                dispatch(addLesson(newLesson));
            }

            clearInterval(progressInterval);
            setUploadProgress(100);
            
            setTimeout(() => {
                navigate(`/Kambaz/Courses/${cid}/Modules`);
            }, 500);
        } catch (err: any) {
            console.error("Failed to save lesson:", err);
            setError(err.response?.data?.error || "Failed to save lesson. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(`/Kambaz/Courses/${cid}/Modules`);
    };

    if (loading) {
        return (
            <div className="p-4 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Loading...</p>
            </div>
        );
    }

    if (lid && lessonNotFound) {
        return (
            <div className="p-4">
                <h3>Lesson not found</h3>
                <Button variant="secondary" onClick={handleCancel}>
                    <FaArrowLeft className="me-2" />
                    Back to Modules
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Button 
                variant="link" 
                className="ps-0 mb-3 text-decoration-none"
                onClick={handleCancel}
            >
                <FaArrowLeft className="me-2" />
                Back to Modules
            </Button>

            <h3>{isEditing ? "Edit Lesson" : "Create New Lesson"}</h3>
            
            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

            <Form>
                {/* Basic Info */}
                <Card className="mb-4">
                    <Card.Header>
                        <h5 className="mb-0">Lesson Information</h5>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Lesson Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter lesson name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter lesson description (optional)"
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Video Upload */}
                <Card className="mb-4">
                    <Card.Header>
                        <h5 className="mb-0">Video Upload {!isEditing && <span className="text-danger">*</span>}</h5>
                    </Card.Header>
                    <Card.Body>
                        {isEditing && existingLesson?.videoFileName && (
                            <Alert variant="info" className="mb-3">
                                Current video: <strong>{existingLesson.videoFileName}</strong>
                                <br />
                                <small className="text-muted">Upload a new file to replace it</small>
                            </Alert>
                        )}

                        <div
                            className={`border border-2 border-dashed rounded-3 p-5 text-center ${
                                dragActive ? "border-primary bg-light" : "border-secondary"
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            style={{ cursor: "pointer" }}
                            onClick={() => document.getElementById("video-upload")?.click()}
                        >
                            <input
                                type="file"
                                id="video-upload"
                                accept="video/mp4,video/avi,video/quicktime,video/x-matroska,.mp4,.avi,.mov,.mkv"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            
                            {selectedFile ? (
                                <div>
                                    <FaVideo className="text-success mb-3" size={48} />
                                    <h5>{selectedFile.name}</h5>
                                    <p className="text-muted">{formatFileSize(selectedFile.size)}</p>
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                        }}
                                    >
                                        Change File
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <FaCloudUploadAlt className="text-muted mb-3" size={48} />
                                    <h5>Drag & drop your video here</h5>
                                    <p className="text-muted">or click to browse</p>
                                    <small className="text-muted">Supported: MP4, AVI, MOV, MKV (max 500MB)</small>
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>

                {/* Quiz Generation Options */}
                <Card className="mb-4">
                    <Card.Header>
                        <h5 className="mb-0">Quiz Generation</h5>
                    </Card.Header>
                    <Card.Body>
                        <Form.Check
                            type="checkbox"
                            id="generate-quiz-checkbox"
                            label="Automatically generate a quiz from this video"
                            checked={generateQuiz}
                            onChange={(e) => setGenerateQuiz(e.target.checked)}
                            className="mb-3"
                        />

                        {generateQuiz && (
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Number of Questions</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min={5}
                                            max={30}
                                            value={numQuestions}
                                            onChange={(e) => setNumQuestions(parseInt(e.target.value) || 10)}
                                        />
                                        <Form.Text className="text-muted">
                                            5-30 questions recommended
                                        </Form.Text>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Difficulty Level</Form.Label>
                                        <Form.Select
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(e.target.value)}
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                            <option value="mixed">Mixed</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>
                        )}

                        {generateQuiz && (
                            <Alert variant="info">
                                <strong>Note:</strong> Quiz generation will start automatically after the lesson is saved.
                                The video will be analyzed to extract content and generate relevant quiz questions.
                                This process may take several minutes depending on the video length.
                            </Alert>
                        )}
                    </Card.Body>
                </Card>

                {/* Upload Progress */}
                {saving && uploadProgress > 0 && (
                    <ProgressBar 
                        now={uploadProgress} 
                        label={`${uploadProgress}%`}
                        animated 
                        className="mb-4"
                    />
                )}

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={handleCancel} disabled={saving}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                {isEditing ? "Saving..." : "Creating..."}
                            </>
                        ) : (
                            isEditing ? "Save Changes" : "Create Lesson"
                        )}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
