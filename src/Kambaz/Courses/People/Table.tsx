import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
export default function PeopleTable() {
    return (
        <div id="wd-people-table">
            <Table striped>
                <thead>
                    <tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
                </thead>
                <tbody>
                    <TableRow firstName="Clark" lastName="Kent" loginId="123456789S" section="S101" role="STUDENT" lastActivity="2023-10-01" totalActivity="10:21:32" />
                    <TableRow firstName="Diana" lastName="Prince" loginId="234567890S" section="S101" role="TA" lastActivity="2023-10-02" totalActivity="4:00:00" />
                    <TableRow firstName="Bruce" lastName="Wayne" loginId="111222333S" section="S101" role="STUDENT" lastActivity="2023-10-03" totalActivity="6:00:00" />
                </tbody>
            </Table>
        </div>);
}

interface TableRowProps {
    firstName: string;
    lastName: string;
    loginId: string;
    section: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'TA';
    lastActivity: string;
    totalActivity: string;
}

const TableRow = ({ firstName, lastName, loginId, section, role, lastActivity, totalActivity }: TableRowProps) => (
    <tr>
        <td className="wd-full-name text-nowrap">
            <FaUserCircle className="me-2 fs-1 text-secondary" />
            <span className="wd-first-name">{firstName}</span>{" "}
            <span className="wd-last-name">{lastName}</span>
        </td>
        <td className="wd-login-id">{loginId}</td>
        <td className="wd-section">{section}</td>
        <td className="wd-role">{role}</td>
        <td className="wd-last-activity">{lastActivity}</td>
        <td className="wd-total-activity">{totalActivity}</td>
    </tr>
)