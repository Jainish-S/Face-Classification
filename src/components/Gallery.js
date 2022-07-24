import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import NavbarComponent from "./Navbar";
import AddImagesButton from "./AddImagesButton";
import { useAuth } from "../contexts/AuthContext";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    getFirestore,
    query,
    where,
} from "firebase/firestore";
import app from "../firebase";
import UploadLabels from "./UploadLabels";
import Classify from "./Classify";

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [labelledImages, setLabelledImages] = useState([]);

    const { currentUser } = useAuth();

    const db = getFirestore(app);

    useEffect(() => {
        const getImages = async () => {
            const imagesRef = await getDocs(
                collection(db, "users", currentUser.uid, "images")
            );

            const images = [];
            for (const idoc of imagesRef.docs) {
                const url = await idoc.data()["image_url"];
                images.push(url);
            }
            setImages(images);
        };

        getImages();

        const getLabelledImages = async () => {
            const q = query(collection(db, "faces"), where("name", "!=", ""));
            const data = await getDocs(q);

            const images = [];

            for (const idoc of data.docs) {
                const image_ids = idoc.data()["image_id"];
                const image_name = idoc.data()["name"];

                const image_urls = [];

                for (const image_id of image_ids) {
                    const imageRef = await getDoc(
                        doc(db, "users", currentUser.uid, "images", image_id)
                    );

                    const image_url = imageRef.data()["image_url"];
                    image_urls.push(image_url);
                }

                images.push({
                    name: image_name,
                    urls: image_urls,
                });
            }
            setLabelledImages(images);
        };

        getLabelledImages();
    }, [currentUser.uid, db]);

    return (
        <>
            <NavbarComponent />
            <Container fluid>
                <div className="d-flex flex-row">
                    <div className="m-2">
                        <AddImagesButton />
                    </div>
                    <div className="m-2">
                        <UploadLabels />
                    </div>
                    <div className="m-2">
                        <Classify userid={currentUser.uid} />
                    </div>
                </div>
                <div className="d-flex flex-wrap mt-3">
                    {labelledImages &&
                        labelledImages.map(({ name, urls }) => {
                            return (
                                <div className="m-2" key={name}>
                                    <h3>{name}</h3>
                                    {urls.map((url, index) => {
                                        return (
                                            <img
                                                src={url}
                                                alt="Crashed"
                                                className="img-thumbnail"
                                                key={index}
                                                width={300}
                                                height={300}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                </div>
                <hr className="p-1 rounded-2" />
                <div className="d-flex flex-wrap mt-3">
                    {images &&
                        images.map((url, index) => (
                            <div key={index}>
                                <img
                                    src={url}
                                    className="img-thumbnail"
                                    alt="NONE"
                                    width={300}
                                    height={300}
                                />
                            </div>
                        ))}
                </div>
            </Container>
        </>
    );
}
