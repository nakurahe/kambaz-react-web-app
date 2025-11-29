import { useCallback, useState } from "react";
import { FaCloudUploadAlt, FaVideo } from "react-icons/fa";
import { Form, Button, ProgressBar, Alert } from "react-bootstrap";

interface UploadFormProps {
    onUpload: (file: File, options: { numQuestions: number; difficulty: string }) => Promise<void>;
    isUploading: boolean;
    error: string | null;
}

export default function UploadForm({ onUpload, isUploading, error }: UploadFormProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [numQuestions, setNumQuestions] = useState(10);
    const [difficulty, setDifficulty] = useState("medium");
    const [uploadProgress, setUploadProgress] = useState(0);

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
                alert("Please upload a video file (MP4, AVI, MOV, MKV)");
            }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const isVideoFile = (file: File) => {
        const validTypes = ["video/mp4", "video/avi", "video/quicktime", "video/x-matroska"];
        const validExtensions = [".mp4", ".avi", ".mov", ".mkv"];
        return validTypes.includes(file.type) || 
               validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;
        
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
        
        try {
            await onUpload(selectedFile, { numQuestions, difficulty });
            setUploadProgress(100);
            setSelectedFile(null);
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            clearInterval(progressInterval);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            
            {/* Drop Zone */}
            <div
                className={`border border-2 border-dashed rounded-3 p-5 text-center mb-4 ${
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

            {/* Options */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <Form.Group>
                        <Form.Label>Number of Questions</Form.Label>
                        <Form.Control
                            type="number"
                            min={5}
                            max={30}
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                        />
                        <Form.Text className="text-muted">
                            5-30 questions recommended
                        </Form.Text>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group>
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

            {/* Upload Progress */}
            {uploadProgress > 0 && (
                <ProgressBar 
                    now={uploadProgress} 
                    label={`${uploadProgress}%`}
                    animated 
                    className="mb-3"
                />
            )}

            {/* Submit Button */}
            <div className="d-grid">
                <Button
                    type="submit"
                    variant="danger"
                    size="lg"
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <FaCloudUploadAlt className="me-2" />
                            Generate Quiz from Video
                        </>
                    )}
                </Button>
            </div>
        </Form>
    );
}
