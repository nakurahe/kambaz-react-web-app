import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { useLocation } from "react-router";

export default function TOC() {
    const { pathname } = useLocation();
    return (
        <Nav variant="pills" id="wd-toc">
            {/* <Nav.Item>
                <Nav.Link to="/Labs" as={Link} id="wd-labs">
                    Lab 1
                </Nav.Link>
            </Nav.Item> */}
            <Nav.Item>
                <Nav.Link to="/Labs/Lab1" as={Link} id="wd-a1" active={pathname.includes("Lab1")}>
                    Lab 1
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link to="/Labs/Lab2" as={Link} id="wd-a2" active={pathname.includes("Lab2")}>
                    Lab 2
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link to="/Labs/Lab3" as={Link} id="wd-a3" active={pathname.includes("Lab3")}>
                    Lab 3
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link to="/Labs/Lab4" as={Link} id="wd-a4" active={pathname.includes("Lab4")}>
                    Lab 4
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link to="/Labs/Lab5" as={Link} id="wd-a5" active={pathname.includes("Lab5")}>
                    Lab 5
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link to="/Kambaz" as={Link} id="wd-kambaz">
                    Kambaz
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="https://github.com/nakurahe" id="wd-github">My GitHub</Nav.Link>
            </Nav.Item>
        </Nav>
    );
}