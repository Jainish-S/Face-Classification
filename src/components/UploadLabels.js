import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { uuidv4 } from "@firebase/util";
import app from "../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";

export default function UploadLabels() {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);

    const { currentUser } = useAuth();

    const db = getFirestore(app);
    const storage = getStorage(app);

    document.addEventListener("mouseup", (e) => {
        var form = document.getElementById("upload-labels-form");
        if (form && !form.contains(e.target)) {
            setShowForm(false);
        }
    });

    const handleUploadLabel = async (e) => {
        e.preventDefault();
        setShowForm(false);

        const filePath = `${currentUser.uid}/labels/${file.name}`;

        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.log(error);
            },
            () => {
                console.log("Upload Successful");
            }
        );

        uploadTask.then(() => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                const id = uuidv4();
                await setDoc(doc(db, "users", currentUser.uid, "labels", id), {
                    label_url: url,
                    name: name,
                    seen: false,
                });

                await fetch("http://localhost:8080/labels", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userid: currentUser.uid,
                    }),
                });
            });
        });
    };

    return (
        <>
            <Button
                onClick={() => {
                    setShowForm(true);
                }}
            >
                Upload Labels
            </Button>
            {showForm && (
                <Form
                    onSubmit={handleUploadLabel}
                    className="position-absolute bg-white p-3 rounded-2 mt-1 border-2 border"
                    id="upload-labels-form"
                >
                    <Form.Group>
                        <Form.Label>Upload Your Image</Form.Label>
                        <Form.Control
                            onChange={(e) => setFile(e.target.files[0])}
                            type="file"
                            required
                            accept=".png, .jpg, .jpeg"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter name"
                            required
                        />
                    </Form.Group>
                    <Button className="w-100 mt-4" type="submit">
                        Submit
                    </Button>
                </Form>
            )}
        </>
    );
}
