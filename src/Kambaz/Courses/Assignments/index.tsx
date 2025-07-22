import { IoIosSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { BsGripVertical } from "react-icons/bs";
import { ListGroup } from "react-bootstrap";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { useParams } from "react-router";
import * as db from "../../Database";

export default function Assignments() {
    const { cid } = useParams();
    const assignments = db.assignments.filter((assignment: any) => assignment.course === cid);

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
                    <button id="wd-add-assignment-group" className="btn btn-secondary btn-lg me-2">
                        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                        Group
                    </button>
                    <button id="wd-add-assignment" className="btn btn-danger btn-lg">
                        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                        Assignment
                    </button>
                </div>
            </div>
            <br /><br /><br /><br />
            <ListGroup className="rounded-0" id="wd-assignment-list">
                <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> ASSIGNMENTS <button className="btn btn-outline-dark btn-sm float-end">
                            <FaPlus />
                        </button>
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        {assignments.map((assignment: any) => (
                            <ListGroup.Item key={assignment._id} className="wd-lesson p-3 ps-1">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <BsGripVertical className="me-2" />
                                        <a href={`#/Kambaz/Courses/${cid}/Assignments/${assignment._id}`} 
                                           className="wd-assignment-link text-decoration-none">
                                            {assignment.title}
                                        </a>
                                    </div>
                                    <GreenCheckmark />
                                </div>
                                <div className="wd-assignment-list-item-description text-muted small ms-4">
                                    Multiple Modules | <b>Not available until</b> May 6 at 12:00am | <b>Due</b> May 13 at 11:59pm | <b>100 pts</b>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}