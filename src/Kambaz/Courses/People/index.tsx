import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setPeople, addPerson, deletePerson, updatePerson } from "./reducer";
import { enrollInCourse } from "../../Enrollments/reducer";
import * as peopleClient from "./client";
import * as enrollmentsClient from "../../Enrollments/client";
import PeopleTable from "./Table";

export default function People() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { people } = useSelector((state: any) => state.peopleReducer);
    
    const [showModal, setShowModal] = useState(false);
    const [editingPerson, setEditingPerson] = useState<any>(null);
    const [personForm, setPersonForm] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "STUDENT",
        loginId: "",
        section: "S101"
    });

    useEffect(() => {
        fetchPeople();
    }, [cid]);

    const fetchPeople = async () => {
        if (!cid) return;
        try {
            const peopleData = await peopleClient.findPeopleForCourse(cid);
            dispatch(setPeople(peopleData));
        } catch (error) {
            console.error("Failed to fetch people:", error);
        }
    };

    const handleAddPerson = () => {
        setEditingPerson(null);
        setPersonForm({
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            role: "STUDENT",
            loginId: "",
            section: "S101"
        });
        setShowModal(true);
    };

    const handleEditPerson = (person: any) => {
        setEditingPerson(person);
        setPersonForm({
            username: person.username || "",
            firstName: person.firstName || "",
            lastName: person.lastName || "",
            email: person.email || "",
            role: person.role || "STUDENT",
            loginId: person.loginId || "",
            section: person.section || "S101"
        });
        setShowModal(true);
    };

    const handleDeletePerson = async (personId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this person?");
        if (confirmDelete) {
            try {
                await peopleClient.deletePerson(personId);
                dispatch(deletePerson(personId));
            } catch (error) {
                console.error("Failed to delete person:", error);
                alert("Failed to delete person. Please try again.");
            }
        }
    };

    const handleSavePerson = async () => {
        try {
            if (editingPerson) {
                // Update existing person
                const updatedPerson = await peopleClient.updatePerson(editingPerson._id, personForm);
                dispatch(updatePerson(updatedPerson));
            } else {
                // Create new person
                const newPerson = await peopleClient.createPerson(personForm);
                dispatch(addPerson(newPerson));
                
                // Automatically enroll the new person in the current course
                if (cid && newPerson._id) {
                    try {
                        await enrollmentsClient.enrollInCourse(newPerson._id, cid);
                        dispatch(enrollInCourse({ userId: newPerson._id, courseId: cid }));
                    } catch (enrollError) {
                        console.error("Failed to enroll new person in course:", enrollError);
                        // Don't fail the entire operation if enrollment fails
                    }
                }
            }
            setShowModal(false);
            setEditingPerson(null);
            // Refresh the people list to ensure it's up to date
            fetchPeople();
        } catch (error) {
            console.error("Failed to save person:", error);
            alert("Failed to save person. Please try again.");
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setPersonForm({ ...personForm, [field]: value });
    };

    return (
        <div>
            {currentUser && currentUser.role === "FACULTY" && (
                <div className="mb-3">
                    <Button variant="primary" onClick={handleAddPerson}>
                        Add Person
                    </Button>
                </div>
            )}
            
            <PeopleTable 
                people={people} 
                onEdit={currentUser?.role === "FACULTY" ? handleEditPerson : undefined}
                onDelete={currentUser?.role === "FACULTY" ? handleDeletePerson : undefined}
            />

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingPerson ? "Edit Person" : "Add Person"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={personForm.username}
                                onChange={(e) => handleInputChange("username", e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={personForm.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={personForm.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={personForm.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={personForm.role}
                                onChange={(e) => handleInputChange("role", e.target.value)}
                            >
                                <option value="STUDENT">Student</option>
                                <option value="FACULTY">Faculty</option>
                                <option value="TA">Teaching Assistant</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Login ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={personForm.loginId}
                                onChange={(e) => handleInputChange("loginId", e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Section</Form.Label>
                            <Form.Control
                                type="text"
                                value={personForm.section}
                                onChange={(e) => handleInputChange("section", e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSavePerson}>
                        {editingPerson ? "Update" : "Create"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
