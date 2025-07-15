import { Link } from "react-router-dom";
export default function Signin() {
    return (
        <div id="wd-signin-screen">
            <h3>Sign in</h3>
            <div style={{ width: '300px' }}>
                <div className="mb-2">
                    <input placeholder="username" className="wd-username form-control" />
                </div>
                <div className="mb-2">
                    <input placeholder="password" type="password" className="wd-password form-control" />
                </div>
                <div className="mb-2">
                    <Link id="wd-signin-btn" to="/Kambaz/Account/Profile"
                        className="btn btn-primary w-100"> Sign in </Link>
                </div>
                <Link to="/Kambaz/Account/Signup" id="wd-signup-link">Signup</Link>
            </div>
        </div>
    );
}