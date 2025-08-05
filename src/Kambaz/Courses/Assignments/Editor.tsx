import Form from "react-bootstrap/Form";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment, updateAssignment, setAssignments } from "./reducer";
import { useState, useEffect } from "react";
import * as coursesClient from "../client";
import * as assignmentsClient from "./client";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    
    const existingAssignment = aid ? assignments.find((a: any) => a._id === aid) : null;
    const isEditing = !!aid && !!existingAssignment;

    const [assignment, setAssignment] = useState({
        title: "",
        description: "",
        points: 100,
        dueDate: "",
        availableFrom: "",
        availableUntil: "",
        course: cid
    });

    useEffect(() => {
        const fetchAssignments = async () => {
            if (assignments.length === 0) {
                const fetchedAssignments = await coursesClient.findAssignmentsForCourse(cid as string);
                dispatch(setAssignments(fetchedAssignments));
            }
        };
        
        fetchAssignments();
        
        if (isEditing && existingAssignment) {
            setAssignment({
                title: existingAssignment.title || "",
                description: existingAssignment.description || "",
                points: existingAssignment.points || 100,
                dueDate: existingAssignment.dueDate || "",
                availableFrom: existingAssignment.availableFrom || "",
                availableUntil: existingAssignment.availableUntil || "",
                course: existingAssignment.course || cid
            });
        }
    }, [isEditing, existingAssignment, cid, assignments.length, dispatch]);

    const handleSave = async () => {
        if (isEditing) {
            const updatedAssignment = { ...assignment, _id: aid };
            await assignmentsClient.updateAssignment(updatedAssignment);
            dispatch(updateAssignment(updatedAssignment));
        } else {
            const newAssignment = await assignmentsClient.createAssignment(assignment);
            dispatch(addAssignment(newAssignment));
        }
        navigate(`/Kambaz/Courses/${cid}/Assignments`);
    };

    const handleCancel = () => {
        navigate(`/Kambaz/Courses/${cid}/Assignments`);
    };

    const handleInputChange = (field: string, value: any) => {
        setAssignment({ ...assignment, [field]: value });
    };

    if (aid && !existingAssignment) {
        return (
            <div id="wd-assignments-editor">
                <h3>Assignment not found</h3>
                <button onClick={handleCancel} className="btn btn-secondary">
                    Back to Assignments
                </button>
            </div>
        );
    }

    return (
        <div id="wd-assignments-editor">
            <h3>{isEditing ? "Edit Assignment" : "New Assignment"}</h3>
            <Form.Group controlId="wd-name">
                <Form.Label>Assignment Name</Form.Label>
                <Form.Control 
                    type="text" 
                    value={assignment.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="wd-description">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={5} 
                    value={assignment.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                />
            </Form.Group>
            <br />
            
            <Form.Group as="div" className="row mb-3">
                <Form.Label column sm={2} className="text-end" htmlFor="wd-points">
                    Points
                </Form.Label>
                <div className="col-sm-10">
                    <Form.Control 
                        id="wd-points" 
                        type="number" 
                        value={assignment.points}
                        onChange={(e) => handleInputChange("points", parseInt(e.target.value) || 0)}
                    />
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
                            <Form.Control 
                                id="wd-due-date" 
                                type="date" 
                                value={assignment.dueDate}
                                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                            />
                        </Form.Group>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label htmlFor="wd-available-from">Available From</Form.Label>
                                    <Form.Control 
                                        id="wd-available-from" 
                                        type="date" 
                                        value={assignment.availableFrom}
                                        onChange={(e) => handleInputChange("availableFrom", e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label htmlFor="wd-available-until">Until</Form.Label>
                                    <Form.Control 
                                        id="wd-available-until" 
                                        type="date" 
                                        value={assignment.availableUntil}
                                        onChange={(e) => handleInputChange("availableUntil", e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </Form.Group>
            <hr />
            <div className="text-end">
                <button onClick={handleCancel} className="btn btn-secondary me-2">Cancel</button>
                <button onClick={handleSave} className="btn btn-danger">Save</button>
            </div>
        </div>
    );
}