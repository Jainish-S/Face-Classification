import React from "react";
import Signup from "./authentication/Signup";
import Profile from "./authentication/Profile";
import Login from "./authentication/Login";
import PrivateRoute from "./authentication/PrivateRoute";
import ForgotPassword from "./authentication/ForgotPassword";
import UpdateProfile from "./authentication/UpdateProfile";
import Classify from "./Classify";
import Gallery from "./Gallery";
// import Upload from "./Upload";

import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "../contexts/AuthContext";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Gallery />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/classify"
                        element={
                            <PrivateRoute>
                                <Classify />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/user"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/update-profile"
                        element={
                            <PrivateRoute>
                                <UpdateProfile />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
