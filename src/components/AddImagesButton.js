import React from "react";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

export default function AddImagesButton() {
    const db = getFirestore(app);
    const storage = getStorage(app);
    const { currentUser } = useAuth();


    const handleUpload = (e) => {
        const files = e?.target.files;

        if (files === null) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = `${currentUser.uid}/${file.name}`;

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
                    await setDoc(
                        doc(db, "users", currentUser.uid, "images", id),
                        {
                            classified: false,
                            image_url: url,
                            face_ids: [],
                        }
                    );
                });
            });
        }
    };

    return (
        <label className="btn btn-outline-success btn-sm m-0 mr-2">
            <FontAwesomeIcon icon={faFileUpload} />
            <input
                type="file"
                multiple="multiple"
                accept=".png, .jpg, .jpeg"
                onChange={handleUpload}
                style={{ opacity: 0, position: "absolute", left: "-9999px" }}
            />
        </label>
    );
}
