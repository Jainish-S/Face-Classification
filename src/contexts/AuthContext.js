import React, { useContext, useEffect, useState } from "react";
import app from "../firebase";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    const auth = getAuth(app);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function logout() {
        try {
            await signOut(auth);
            console.log("Sign Out Successful!!");
        } catch (error) {
            console.log(error);
        }
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    async function updateUserEmail(email) {
        try {
            await updateEmail(currentUser, email);
            console.log("Update Email Successful!!");
        } catch (e) {
            console.log(e);
        }
    }

    async function updateUserPassword(password) {
        try {
            await updatePassword(currentUser, password);
            console.log("Update Password Successful!!");
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const AuthCheck = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return AuthCheck;
    }, [auth]);

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateUserEmail,
        updateUserPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
