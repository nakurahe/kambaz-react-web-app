import { Link } from "react-router-dom";
export default function Signup() {
    return (
        <div id="wd-signup-screen">
            <h3>Sign up</h3>
            <div style={{ width: '300px' }}>
                <div className="mb-2">
                    <input placeholder="username" className="wd-username form-control" />
                </div>
                <div className="mb-2">
                    <input placeholder="password" type="password" className="wd-password form-control" />
                </div>
                <div className="mb-2">
                    <input placeholder="verify password" type="password" className="wd-password-verify form-control" />
                </div>
                <div className="mb-2">
                    <Link to="/Kambaz/Account/Profile" className="btn btn-primary w-100"> Sign up </Link>
                </div>
                <Link to="/Kambaz/Account/Signin" id="wd-signin-link">Sign in</Link>
            </div>
        </div>
    );
}