import { useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Card, Alert, ListGroup } from "react-bootstrap";
import { FaVideo, FaRobot } from "react-icons/fa";
import UploadForm from "./UploadForm";
import ProcessingStatus from "./ProcessingStatus";
import * as videoQuizClient from "./client";
import {
    setJobs,
    addJob,
    updateJob,
    setPipelineAvailable,
    setUploading,
    setUploadError,
    type VideoQuizJob
} from "./reducer";

export default function VideoQuiz() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    
    const { jobs, pipelineAvailable, isUploading, uploadError } = useSelector(
        (state: any) => state.videoQuizReducer
    );
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    // Filter jobs for current course
    const courseJobs = jobs.filter((job: VideoQuizJob) => job.course === cid);

    // Check pipeline status on mount
    useEffect(() => {
        const checkPipeline = async () => {
            try {
                const status = await videoQuizClient.getPipelineStatus();
                dispatch(setPipelineAvailable(status.available));
            } catch (error) {
                console.error("Failed to check pipeline status:", error);
                dispatch(setPipelineAvailable(false));
            }
        };
        checkPipeline();
    }, [dispatch]);

    // Fetch jobs for course
    const fetchJobs = useCallback(async () => {
        if (!cid) return;
        try {
            const jobsData = await videoQuizClient.findJobsForCourse(cid);
            dispatch(setJobs(jobsData));
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        }
    }, [cid, dispatch]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    // Handle video upload
    const handleUpload = async (
        file: File, 
        options: { numQuestions: number; difficulty: string }
    ) => {
        if (!cid) return;
        
        dispatch(setUploading(true));
        dispatch(setUploadError(null));
        
        try {
            const result = await videoQuizClient.uploadVideo(cid, file, options);
            dispatch(addJob(result.job));
        } catch (error: any) {
            console.error("Upload failed:", error);
            dispatch(setUploadError(error.response?.data?.error || "Upload failed"));
            throw error;
        } finally {
            dispatch(setUploading(false));
        }
    };

    // Refresh a specific job
    const refreshJob = useCallback(async (jobId: string) => {
        try {
            const jobData = await videoQuizClient.findJobById(jobId);
            dispatch(updateJob(jobData));
        } catch (error) {
            console.error("Failed to refresh job:", error);
        }
    }, [dispatch]);

    // Retry a failed job
    const handleRetry = async (jobId: string) => {
        try {
            await videoQuizClient.retryJob(jobId);
            refreshJob(jobId);
        } catch (error) {
            console.error("Failed to retry job:", error);
        }
    };

    // Only faculty can upload videos
    const isFaculty = currentUser?.role === "FACULTY";

    return (
        <div id="wd-video-quiz">
            <h2 className="mb-4">
                <FaVideo className="me-2" />
                Video Quiz Generator
            </h2>
            
            <p className="text-muted mb-4">
                Upload a lecture video to automatically generate a quiz using AI. 
                The system will extract slides, transcribe audio, and create questions based on the content.
            </p>

            {/* Pipeline Status Warning */}
            {!pipelineAvailable && (
                <Alert variant="warning">
                    <FaRobot className="me-2" />
                    Video processing pipeline is not available. Please contact your administrator.
                </Alert>
            )}

            {/* Upload Section - Faculty Only */}
            {isFaculty && pipelineAvailable && (
                <Card className="mb-4">
                    <Card.Header>
                        <h5 className="mb-0">Upload New Video</h5>
                    </Card.Header>
                    <Card.Body>
                        <UploadForm
                            onUpload={handleUpload}
                            isUploading={isUploading}
                            error={uploadError}
                        />
                    </Card.Body>
                </Card>
            )}

            {/* Processing Jobs */}
            {courseJobs.length > 0 && (
                <div>
                    <h4 className="mb-3">Processing Jobs</h4>
                    <ListGroup>
                        {courseJobs.map((job: VideoQuizJob) => (
                            <ProcessingStatus
                                key={job._id}
                                job={job}
                                onRetry={handleRetry}
                                onRefresh={() => refreshJob(job._id)}
                            />
                        ))}
                    </ListGroup>
                </div>
            )}

            {/* Empty State */}
            {courseJobs.length === 0 && (
                <Card className="text-center p-5 text-muted">
                    <FaVideo size={48} className="mb-3 mx-auto" />
                    <h5>No video quizzes yet</h5>
                    <p>
                        {isFaculty 
                            ? "Upload a video above to generate your first quiz!"
                            : "Your instructor hasn't generated any video quizzes yet."
                        }
                    </p>
                </Card>
            )}
        </div>
    );
}
