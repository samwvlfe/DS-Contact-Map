import { createContext, useContext, useEffect, useState } from "react";

const BASE = import.meta.env.VITE_API_URL;

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${BASE}/auth/me`, { credentials: "include" })
            .then(r => {
                if (!r.ok) throw new Error("Not authenticated");
                return r.json();
            })
            .then(setUser)
            .catch(() => setError("Could not load user info."));
    }, []);

    return (
        <UserContext.Provider value={{ user, error }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
