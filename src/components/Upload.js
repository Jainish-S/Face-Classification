import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import CenteredContainer from "./authentication/CenteredContainer";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import app from "../firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";
import { Button } from "react-bootstrap";

export default function Upload() {
    const db = getFirestore(app);
    const storage = getStorage(app);
    const { currentUser } = useAuth();

    const [uploadSuccessfull, setUploadSuccessfull] = useState(false);
    const [uploadLabels, setUploadLabels] = useState(false);

    const navigator = useNavigate();

    const handleClassify = async () => {
        await fetch("http://localhost:8080/classify", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userid: currentUser.uid,
            }),
        });

        navigator("/classify");
    };

    const onDrop = useCallback(
        async (acceptedFiles) => {
            await acceptedFiles.forEach((file) => {
                var filePath;

                if (uploadLabels === true) {
                    filePath = `${currentUser.uid}/labels/${file.name}`;
                } else {
                    filePath = `${currentUser.uid}/${Date.now()}_${file.name}`;
                }

                const storageRef = ref(storage, filePath);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
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
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (url) => {
                            await addDoc(collection(db, "images"), {
                                userid: currentUser.uid,
                                url: url,
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                createdAt: new Date(),
                            });
                        }
                    );
                });
            });

            setUploadSuccessfull(true);
        },
        [uploadLabels, storage, currentUser.uid, db]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <CenteredContainer>
            <div>
                {uploadLabels ? (
                    <Button onClick={handleClassify}>Classify</Button>
                ) : (
                    uploadSuccessfull && <Button
                        onClick={() => {
                            setUploadLabels(true);
                        }}
                    >
                        Upload Label
                    </Button>
                )}
            </div>

            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : uploadLabels ? (
                    <p>Drop the labels here ...</p>
                ) : (
                    <p>Drop the images here ...</p>
                )}
            </div>
        </CenteredContainer>
    );
}
