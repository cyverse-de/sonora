/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

const Uploadform = () => {
    const [destination, setDestination] = useState("");
    const [files, setFiles] = useState(null);
    const [uploadData, setUploadData] = useState({});

    const handleSubmit = async (event) => {
        const formData = new FormData();
        formData.append("file", files[0]);

        const uploadData = await fetch(`/api/upload?dest=${destination}`, {
            method: "POST",
            credentials: "include",
            body: formData,
        })
            .then((resp) => resp.json())
            .catch((e) => console.log(`error ${e.message}`));

        setUploadData(uploadData);
    };

    return (
        <div>
            <br />

            <label>
                Destination: &nbsp;
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
            </label>

            <br />
            <br />

            <label>
                File: &nbsp;
                <input
                    type="file"
                    name="file"
                    id="file"
                    onChange={(e) => setFiles(e.target.files)}
                />
            </label>

            <br />
            <br />

            <input type="submit" value="Upload File" onClick={handleSubmit} />

            <pre>{JSON.stringify(uploadData, null, 2)}</pre>
        </div>
    );
};

export default Uploadform;
