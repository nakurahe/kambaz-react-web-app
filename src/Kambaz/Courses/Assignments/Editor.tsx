import Form from "react-bootstrap/Form";
import { useParams, Link } from "react-router";
import * as db from "../../Database";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const assignment = db.assignments.find((a: any) => a._id === aid);

    if (!assignment) {
        return (
            <div id="wd-assignments-editor">
                <h3>Assignment not found</h3>
                <Link to={`/Kambaz/Courses/${cid}/Assignments`} className="btn btn-secondary">
                    Back to Assignments
                </Link>
            </div>
        );
    }

    return (
        <div id="wd-assignments-editor">
            <Form.Group controlId="wd-name">
                <Form.Label>Assignment Name</Form.Label>
                <Form.Control type="text" defaultValue={assignment.title} />
            </Form.Group>
            <Form.Group controlId="wd-description">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={5} defaultValue={assignment.description || "No description available"} />
            </Form.Group>
            <br />
            
            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end" htmlFor="wd-points">
                    Points
                </Form.Label>
                <div className="col-sm-10">
                    <Form.Control id="wd-points" type="number" defaultValue={assignment.points || 100} />
                </div>
            </Form.Group>

            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end" htmlFor="wd-group">
                    Assignment Group
                </Form.Label>
                <div className="col-sm-10">
                    <Form.Select id="wd-group" defaultValue="assignments">
                        <option value="assignments">ASSIGNMENTS</option>
                    </Form.Select>
                </div>
            </Form.Group>

            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end" htmlFor="wd-display-grade-as">
                    Display Grade as
                </Form.Label>
                <div className="col-sm-10">
                    <Form.Select id="wd-display-grade-as" defaultValue="percentage">
                        <option value="percentage">Percentage</option>
                        <option value="points">Points</option>
                        <option value="letter">Letter Grade</option>
                    </Form.Select>
                </div>
            </Form.Group>

            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end align-top" htmlFor="wd-submission-type">
                    Submission Type
                </Form.Label>
                <div className="col-sm-10">
                    <div className="border p-3">
                        <Form.Group className="mb-3">
                            <Form.Select id="wd-submission-type" defaultValue="online">
                                <option value="online">Online</option>
                                <option value="in-person">In-Person</option>
                                <option value="file-upload">File Upload</option>
                            </Form.Select>
                        </Form.Group>
                        
                        <Form.Label className="fw-bold mb-2">Online Entry Options</Form.Label>
                        <Form.Check type="checkbox" id="wd-text-entry" label="Text Entry" />
                        <Form.Check type="checkbox" id="wd-website-url" label="Website URL" />
                        <Form.Check type="checkbox" id="wd-media-recordings" label="Media Recordings" />
                        <Form.Check type="checkbox" id="wd-student-annotation" label="Student Annotation" />
                        <Form.Check type="checkbox" id="wd-file-uploads" label="File Uploads" />
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
                            <Form.Control id="wd-due-date" type="date" defaultValue={assignment.dueDate || "2024-05-13"} />
                        </Form.Group>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label htmlFor="wd-available-from">Available From</Form.Label>
                                    <Form.Control id="wd-available-from" type="date" defaultValue={assignment.availableFrom || "2024-05-06"} />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label htmlFor="wd-available-until">Until</Form.Label>
                                    <Form.Control id="wd-available-until" type="date" defaultValue={assignment.availableUntil || "2024-05-20"} />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </Form.Group>
            <hr />
            <div className="text-end">
                <Link to={`/Kambaz/Courses/${cid}/Assignments`} className="btn btn-secondary me-2">Cancel</Link>
                <Link to={`/Kambaz/Courses/${cid}/Assignments`} className="btn btn-danger">Save</Link>
            </div>
        </div>
    );
}