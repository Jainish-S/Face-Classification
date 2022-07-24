import React from "react";
import { Button } from "react-bootstrap";

export default function Classify({ userid }) {

    const handleClassify = async () => {
        await fetch("http://localhost:8080/classify", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userid: userid,
            }),
        });
    }

    return (
        <>
            <Button onClick={handleClassify}>Classify</Button>
        </>
    );
}
