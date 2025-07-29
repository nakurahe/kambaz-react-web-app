import { IoIosSearch } from "react-icons/io";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { BsGripVertical } from "react-icons/bs";
import { ListGroup } from "react-bootstrap";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";

export default function Assignments() {
    const { cid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const courseAssignments = assignments.filter((assignment: any) => assignment.course === cid);

    const handleDeleteAssignment = (assignmentId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this assignment?");
        if (confirmDelete) {
            dispatch(deleteAssignment(assignmentId));
        }
    };

    return (
        <div id="wd-assignments">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="input-group" style={{maxWidth: "300px"}}>
                    <span className="input-group-text bg-white border-end-0">
                        <IoIosSearch />
                    </span>
                    <input 
                        placeholder="Search for Assignments"
                        id="wd-search-assignment" 
                        className="form-control border-start-0"
                    />
                </div>
                <div>
                    {currentUser.role === "FACULTY" && (
                        <>
                            <button id="wd-add-assignment-group" className="btn btn-secondary btn-lg me-2">
                                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                                Group
                            </button>
                            <button id="wd-add-assignment" className="btn btn-danger btn-lg"
                                    onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments/Editor`)}>
                                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                                Assignment
                            </button>
                        </>
                    )}
                </div>
            </div>
            <br /><br /><br /><br />
            <ListGroup className="rounded-0" id="wd-assignment-list">
                <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> ASSIGNMENTS 
                        {currentUser.role === "FACULTY" && (
                            <button className="btn btn-outline-dark btn-sm float-end"
                                    onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments/Editor`)}>
                                <FaPlus />
                            </button>
                        )}
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        {courseAssignments.map((assignment: any) => (
                            <ListGroup.Item key={assignment._id} className="wd-lesson p-3 ps-1">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <BsGripVertical className="me-2" />
                                        <button 
                                            className="btn btn-link text-decoration-none p-0 wd-assignment-link"
                                            onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`)}
                                            style={{ textAlign: 'left' }}
                                        >
                                            {assignment.title}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <GreenCheckmark />
                                        {currentUser.role === "FACULTY" && (
                                            <button 
                                                className="btn btn-danger btn-sm ms-2"
                                                onClick={() => handleDeleteAssignment(assignment._id)}
                                                title="Delete Assignment"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="wd-assignment-list-item-description text-muted small ms-4">
                                    Multiple Modules | <b>Not available until</b> {new Date(assignment.availableFrom).toLocaleDateString()} | <b>Due</b> {new Date(assignment.dueDate).toLocaleDateString()} | <b>{assignment.points} pts</b>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}