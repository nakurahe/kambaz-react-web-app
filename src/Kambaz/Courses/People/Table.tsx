import { Table, Button } from "react-bootstrap";
import { FaUserCircle, FaEdit, FaTrash } from "react-icons/fa";

interface PeopleTableProps {
    people?: any[];
    onEdit?: (person: any) => void;
    onDelete?: (personId: string) => void;
}

export default function PeopleTable({ people = [], onEdit, onDelete }: PeopleTableProps) {
    return (
        <div id="wd-people-table">
            <Table striped>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Login ID</th>
                        <th>Section</th>
                        <th>Role</th>
                        <th>Last Activity</th>
                        <th>Total Activity</th>
                        {(onEdit || onDelete) && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {people.map((user: any) => (
                        <tr key={user._id}>
                            <td className="wd-full-name text-nowrap">
                                <FaUserCircle className="me-2 fs-1 text-secondary" />
                                <span className="wd-first-name">{user.firstName} </span>
                                <span className="wd-last-name">{user.lastName}</span>
                            </td>
                            <td className="wd-login-id">{user.loginId}</td>
                            <td className="wd-section">{user.section}</td>
                            <td className="wd-role">{user.role}</td>
                            <td className="wd-last-activity">{user.lastActivity}</td>
                            <td className="wd-total-activity">{user.totalActivity}</td>
                            {(onEdit || onDelete) && (
                                <td>
                                    <div className="d-flex gap-2">
                                        {onEdit && (
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => onEdit(user)}
                                                title="Edit Person"
                                            >
                                                <FaEdit />
                                            </Button>
                                        )}
                                        {onDelete && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => onDelete(user._id)}
                                                title="Delete Person"
                                            >
                                                <FaTrash />
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}