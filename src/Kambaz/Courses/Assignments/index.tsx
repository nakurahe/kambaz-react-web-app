import { IoIosSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { BsGripVertical } from "react-icons/bs";
import { ListGroup } from "react-bootstrap";
import GreenCheckmark from "../Modules/GreenCheckmark";

export default function Assignments() {
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
                    <button id="wd-add-assignment-group" className="btn btn-secondary btn-lg me-2">+ Group</button>
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
                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <BsGripVertical className="me-2" />
                                    <a href="#/Kambaz/Courses/1234/Assignments/123" className="wd-assignment-link text-decoration-none">
                                        A1 - ENV + HTML
                                    </a>
                                </div>
                                <GreenCheckmark />
                            </div>
                            <div className="wd-assignment-list-item-description text-muted small ms-4">
                                Multiple Modules | <b>Not available until</b> May 6 at 12:00am | <b>Due</b> May 13 at 11:59pm | <b>100 pts</b>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <BsGripVertical className="me-2" />
                                    <a href="#/Kambaz/Courses/1234/Assignments/124" className="wd-assignment-link text-decoration-none">
                                        A2 - CSS + BOOTSTRAP
                                    </a>
                                </div>
                                <GreenCheckmark />
                            </div>
                            <div className="wd-assignment-list-item-description text-muted small ms-4">
                                Multiple Modules | <b>Not available until</b> May 13 at 12:00am | <b>Due</b> May 20 at 11:59pm | <b>100 pts</b>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <BsGripVertical className="me-2" />
                                    <a href="#/Kambaz/Courses/1234/Assignments/125" className="wd-assignment-link text-decoration-none">
                                        A3 - JAVASCRIPT + REACT
                                    </a>
                                </div>
                                <GreenCheckmark />
                            </div>
                            <div className="wd-assignment-list-item-description text-muted small ms-4">
                                Multiple Modules | <b>Not available until</b> May 20 at 12:00am | <b>Due</b> May 27 at 11:59pm | <b>100 pts</b>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}