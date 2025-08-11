import { useEffect, useState } from "react";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import * as client from "../../Account/client";
import { FormControl, Form } from "react-bootstrap";

export default function PeopleDetails() {
    const { uid } = useParams();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [editing, setEditing] = useState(false);
    const saveUser = async () => {
        try {
            // Handle name splitting more safely
            const nameParts = name.trim().split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            const updatedUser = {
                ...user,
                firstName,
                lastName,
                email: email || user.email,
                role: role || user.role
            };

            await client.updateUser(updatedUser);
            setUser(updatedUser);
            setEditing(false);
            navigate(-1);
        } catch (error: any) {
            alert(`Failed to save user: ${error.message}. Please try again.`);
        }
    };
    const [user, setUser] = useState<any>({});
    const navigate = useNavigate();
    const deleteUser = async (uid: string) => {
        await client.deleteUser(uid);
        navigate(-1);
    };
    const fetchUser = async () => {
        if (!uid) return;
        try {
            const user = await client.findUserById(uid);
            setUser(user);
            setName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
            setEmail(user.email || "");
            setRole(user.role || "STUDENT");
        } catch (error: any) {
            alert(`Failed to fetch user: ${error.message}. Please try again.`);
        }
    };
    useEffect(() => {
        if (uid) fetchUser();
    }, [uid]);
    if (!uid) return null;

    return (
        <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
            <button onClick={() => navigate(-1)}
                className="btn position-fixed end-0 top-0 wd-close-details">
                <IoCloseSharp className="fs-1" />
            </button>
            <div className="text-center mt-2">
                <FaUserCircle className="text-secondary me-2 fs-1" />
                {currentUser && (
                    <div className="small text-muted">
                        Signed in as: {currentUser.firstName} {currentUser.lastName}
                    </div>
                )}
            </div>
            <hr />
            <div className="text-danger fs-4 wd-name">
                {!editing && (
                    <FaPencil onClick={() => setEditing(true)}
                        className="float-end fs-5 mt-2 wd-edit" />
                )}
                {editing && (
                    <FaCheck onClick={() => saveUser()}
                        className="float-end fs-5 mt-2 me-2 wd-save" />
                )}
                {!editing && (
                    <div className="wd-name"
                        onClick={() => setEditing(true)}
                    >
                        {user.firstName} {user.lastName}
                    </div>
                )}

                {user && editing && (
                    <FormControl
                        className="w-50 wd-edit-name"
                        defaultValue={`${user.firstName} ${user.lastName}`}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") { saveUser(); }
                        }} />
                )}
            </div>

            <div className="mb-2">
                <b>Email:</b>
                {!editing ? (
                    <span className="wd-email"> {user.email} </span>
                ) : (
                    <FormControl
                        type="email"
                        className="mt-1 wd-edit-email"
                        value={email}
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") { saveUser(); }
                        }} />
                )}
            </div>

            <div className="mb-2">
                <b>Roles:</b>
                {!editing ? (
                    <span className="wd-roles"> {user.role} </span>
                ) : (
                    <Form.Select
                        className="mt-1 wd-edit-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="STUDENT">Student</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="TA">Teaching Assistant</option>
                    </Form.Select>
                )}
            </div>

            <b>Login ID:</b> <span className="wd-login-id"> {user.loginId} </span> <br />
            <b>Section:</b> <span className="wd-section"> {user.section} </span> <br />
            <b>Total Activity:</b> <span className="wd-total-activity">{user.totalActivity}</span>

            <hr />
            <button onClick={() => deleteUser(uid)}
                className="btn btn-danger float-end wd-delete" > Delete </button>
            <button onClick={() => navigate(-1)}
                className="btn btn-secondary float-start float-end me-2 wd-cancel" > Cancel </button>
        </div>);
}
