import { Routes, Route, Navigate } from "react-router";
import Signin from "./Signin";
import AccountNavigation from "./Navigation";
import Profile from "./Profile";
import Signup from "./Signup";
import { FaAlignJustify } from "react-icons/fa";
export default function Account() {
    return (
        <div id="wd-account-screen">
            <h2 className="text-danger">
                <FaAlignJustify className="me-4 fs-4 mb-1" />
                Account
            </h2>
            <hr />
            <div className="d-flex">
                <div className="d-none d-md-block">
                    <AccountNavigation />
                </div>
                <div className="flex-fill">
                    <Routes>
                        <Route path="/" element={<Navigate to="/Kambaz/Account/Signin" />} />
                        <Route path="/Signin" element={<Signin />} />
                        <Route path="/Profile" element={<Profile />} />
                        <Route path="/Signup" element={<Signup />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
