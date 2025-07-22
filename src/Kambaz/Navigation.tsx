import { ListGroup } from "react-bootstrap";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaInbox, FaRegCircle } from "react-icons/fa";
import { IoCalendarOutline, IoSettingsOutline } from "react-icons/io5";
import { LiaBookSolid } from "react-icons/lia";
import { Link, useLocation } from "react-router-dom";
export default function KambazNavigation() {
    const { pathname } = useLocation();
    const links = [
        { label: "Dashboard", path: "/Kambaz/Dashboard", icon: AiOutlineDashboard },
        { label: "Courses", path: "/Kambaz/Courses", icon: LiaBookSolid },
        { label: "Calendar", path: "/Kambaz/Calendar", icon: IoCalendarOutline },
        { label: "Inbox", path: "/Kambaz/Inbox", icon: FaInbox },
        { label: "Labs", path: "/Labs", icon: IoSettingsOutline },
    ];
    return (
        <ListGroup id="wd-kambaz-navigation" style={{ width: 110 }}
            className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
            <ListGroup.Item id="wd-neu-link" target="_blank" action href="https://www.northeastern.edu/"
                className="bg-black border-0 text-center">
                <img src="/images/NEU.png" width="75px" />
            </ListGroup.Item>
            
            <ListGroup.Item as={Link} to="/Kambaz/Account"
                className={`text-center border-0 bg-black
                    ${pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"}`}>
                <FaRegCircle className={`fs-1 ${pathname.includes("Account") ? "text-danger" : "text-white"}`} /><br />
                Account
            </ListGroup.Item>
            {links.map((link) => (
                <ListGroup.Item key={link.path} as={Link} to={link.path}
                    className={`bg-black text-center border-0
                        ${pathname.includes(link.label) ? "bg-white text-danger" : "bg-black text-white"}`}>
                    {link.icon({ className: "fs-1 text-danger"})}
                    <br />
                    {link.label}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}
