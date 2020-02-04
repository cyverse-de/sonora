import React, { useState } from "react";

const Uploadform = () => {
    const [destination, setDestination] = useState("");

    const handleDestinationChange = (event) => {
        setDestination(event.target.value);
    };

    const actionPath = `/api/upload?dest=${destination}`;

    return (
        <form action={actionPath} method="post" encType="multipart/form-data">
            <br />

            <label>
                Destination: &nbsp;
                <input
                    type="text"
                    value={destination}
                    onChange={handleDestinationChange}
                />
            </label>

            <br />
            <br />

            <label>
                File: &nbsp;
                <input type="file" name="file" id="file" />
            </label>

            <br />
            <br />

            <input type="submit" value="Upload File" />
        </form>
    );
};

export default Uploadform;
