import { ListGroup } from "react-bootstrap";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaInbox, FaRegCircle } from "react-icons/fa";
import { IoCalendarOutline, IoSettingsOutline } from "react-icons/io5";
import { LiaBookSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
export default function KambazNavigation() {
    return (
        <ListGroup id="wd-kambaz-navigation" style={{ width: 110 }}
            className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
            <ListGroup.Item id="wd-neu-link" target="_blank" action href="https://www.northeastern.edu/"
                className="bg-black border-0 text-center">
                <img src="/images/NEU.png" width="75px" />
            </ListGroup.Item>
            
            <ListGroup.Item as={Link} to="/Kambaz/Account"
                className="text-center border-0 bg-black text-white">
                <FaRegCircle className="fs-1 text text-white" /><br />
                Account
            </ListGroup.Item>

            <ListGroup.Item as={Link} to="/Kambaz/Dashboard"
                className="text-center border-0 bg-white text-danger">
                <AiOutlineDashboard className="fs-1 text-danger" /><br />
                Dashboard
            </ListGroup.Item>

            <ListGroup.Item as={Link} to="/Kambaz/Courses"
                className="text-white bg-black text-center border-0">
                <LiaBookSolid className="fs-1 text-danger" /><br />
                Courses
            </ListGroup.Item>

            <ListGroup.Item as={Link} to="/Kambaz/Calendar"
                className="text-white bg-black text-center border-0">
                <IoCalendarOutline className="fs-1 text-danger" /><br />
                Calendar
            </ListGroup.Item>

            <ListGroup.Item as={Link} to="/Kambaz/Inbox"
                className="text-white bg-black text-center border-0">
                <FaInbox className="fs-1 text-danger" /><br />
                Inbox
            </ListGroup.Item>

            <ListGroup.Item as={Link} to="/Labs"
                className="text-white bg-black text-center border-0">
                <IoSettingsOutline className="fs-1 text-danger" /><br />
                Labs
            </ListGroup.Item>
        </ListGroup>
    );
}
