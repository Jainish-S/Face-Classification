import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";

export default function UpdateProfile() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, updateUserEmail, updateUserPassword } = useAuth();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }

        const promises = [];
        setLoading(true);
        setError("");

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateUserEmail(emailRef.current.value));
        }

        if (passwordRef.current.value !== currentUser.password) {
            promises.push(updateUserPassword(passwordRef.current.value));
        }

        Promise.all(promises)
            .then(() => {
                navigate("/user");
            })
            .catch((e) => {
                console.log(e);
                setError("Failed to update account");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email" className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                ref={emailRef}
                                defaultValue={currentUser.email}
                            />
                        </Form.Group>
                        <Form.Group id="password" className="mb-2">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Leave blank to keep current password"
                                ref={passwordRef}
                            />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Leave blank to keep current password"
                                ref={passwordConfirmRef}
                            />
                        </Form.Group>
                        <Button
                            disabled={loading}
                            className="w-100 mt-4"
                            type="submit"
                        >
                            Update
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/user">Cancel</Link>
            </div>
        </CenteredContainer>
    );
}
