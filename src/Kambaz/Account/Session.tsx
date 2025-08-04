import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
export default function Session({ children }: { children: any }) {
    const [pending, setPending] = useState(true);
    const dispatch = useDispatch();
    const fetchProfile = async () => {
        try {
            const currentUser = await client.profile();
            dispatch(setCurrentUser(currentUser));
        } catch (err: any) {
            // If the request fails with 401 (Unauthorized), it means the user is not logged in
            // Clear the current user from Redux state and redirect to signin
            if (err.response?.status === 401) {
                dispatch(setCurrentUser(null));
            }
        } finally {
            setPending(false);
        }
    };

    // Check session on app start
    useEffect(() => {
        fetchProfile();
    }, []);
    if (!pending) {
        return children;
    }
}