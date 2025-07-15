import { Link } from "react-router-dom";
export default function AccountNavigation() {
    return (
        <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
            <Link to={`/Kambaz/Account/Signin`} id="wd-account-signin-link"
                className="list-group-item active border border-0"> Signin </Link>
            <Link to={`/Kambaz/Account/Signup`} id="wd-account-signup-link"
                className="list-group-item text-danger border border-0"> Signup </Link>
            <Link to={`/Kambaz/Account/Profile`} id="wd-account-profile-link"
                className="list-group-item text-danger border border-0"> Profile </Link>
        </div>
    );
}