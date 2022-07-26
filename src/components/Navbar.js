import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavbarComponent() {
    return (
        <Navbar bg="light" expand="sm" className="d-flex flex-wrap">
            <Navbar.Brand as={Link} to="/">
                Photo Gallery
            </Navbar.Brand>
            <Nav>
                <Nav.Link as={Link} to="/user">
                    Profile
                </Nav.Link>
            </Nav>
        </Navbar>
    );
}
