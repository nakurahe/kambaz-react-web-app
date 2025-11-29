import { useEffect } from "react";
import { ProgressBar, Card, Badge, Button } from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaClock, FaRedo, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import type { VideoQuizJob } from "./reducer";

interface ProcessingStatusProps {
    job: VideoQuizJob;
    onRetry?: (jobId: string) => void;
    onRefresh?: () => void;
}

export default function ProcessingStatus({ job, onRetry, onRefresh }: ProcessingStatusProps) {
    const navigate = useNavigate();
    const { cid } = useParams();

    // Auto-refresh while processing
    useEffect(() => {
        if (job.status === "pending" || job.status === "processing") {
            const interval = setInterval(() => {
                onRefresh?.();
            }, 2000); // Poll every 2 seconds for more responsive updates
            
            return () => clearInterval(interval);
        }
    }, [job.status, onRefresh]);

    const getStatusBadge = () => {
        switch (job.status) {
            case "pending":
                return <Badge bg="secondary"><FaClock className="me-1" />Pending</Badge>;
            case "processing":
                return <Badge bg="primary"><FaSpinner className="me-1 spin" />Processing</Badge>;
            case "completed":
                return <Badge bg="success"><FaCheckCircle className="me-1" />Completed</Badge>;
            case "error":
                return <Badge bg="danger"><FaExclamationCircle className="me-1" />Error</Badge>;
            default:
                return <Badge bg="secondary">Unknown</Badge>;
        }
    };

    const getProgressVariant = () => {
        switch (job.status) {
            case "error": return "danger";
            case "completed": return "success";
            case "processing": return "primary";
            default: return "secondary";
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    return (
        <Card className="mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <strong>{job.videoFileName}</strong>
                    <span className="ms-2">{getStatusBadge()}</span>
                </div>
                <small className="text-muted">
                    Created: {formatDate(job.createdAt)}
                </small>
            </Card.Header>
            <Card.Body>
                {/* Progress Bar */}
                <ProgressBar 
                    now={job.progress} 
                    variant={getProgressVariant()}
                    animated={job.status === "processing"}
                    label={`${job.progress}%`}
                    className="mb-3"
                />
                
                {/* Status Message */}
                <p className="mb-3">
                    <strong>Status:</strong> {job.progressMessage}
                </p>
                
                {/* Error Message */}
                {job.status === "error" && job.errorMessage && (
                    <div className="alert alert-danger mb-3">
                        <strong>Error:</strong> {job.errorMessage}
                    </div>
                )}
                
                {/* Job Details */}
                <div className="row text-muted small mb-3">
                    <div className="col-md-4">
                        <strong>Questions:</strong> {job.numQuestions}
                    </div>
                    <div className="col-md-4">
                        <strong>Difficulty:</strong> {job.difficulty}
                    </div>
                    <div className="col-md-4">
                        {job.completedAt && (
                            <>
                                <strong>Completed:</strong> {formatDate(job.completedAt)}
                            </>
                        )}
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="d-flex gap-2">
                    {job.status === "completed" && job.generatedQuizId && (
                        <Button
                            variant="success"
                            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${job.generatedQuizId}`)}
                        >
                            <FaExternalLinkAlt className="me-2" />
                            View Generated Quiz
                        </Button>
                    )}
                    
                    {job.status === "error" && onRetry && (
                        <Button
                            variant="warning"
                            onClick={() => onRetry(job._id)}
                        >
                            <FaRedo className="me-2" />
                            Retry
                        </Button>
                    )}
                </div>
            </Card.Body>
            
            <style>{`
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Card>
    );
}
