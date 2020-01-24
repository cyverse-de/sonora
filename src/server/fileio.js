import request from "request";
import { terrainURL } from "./configuration";
import path from "path";

/**
 * Handles proxying file upload requests to terrain.
 * @param {object} - An Express Request object.
 * @param {object} - An Express Response object.
 * @returns null
 */
export const uploadHandler = (req, res) => {
    const token = req?.user?.accessToken;

    if (!token) {
        res.status(401).send("Authorization required.");
        return;
    }

    const { destination } = req.query;

    let uploadURL = new URL(terrainURL);
    uploadURL.pathname = path.join(
        uploadURL.pathname,
        "/secured/fileio/upload"
    );
    uploadURL.search = `dest=${destination}`;

    req.pipe(
        request.post(uploadURL.href, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    ).pipe(res);
};

// Ignore this, it's for testing purposes for now.
export const testUploadForm = (req, res) => {
    res.send(`
        <form action="/api/upload?destination=/iplant/home/ipcdev/" method="post" enctype="multipart/form-data"> 
            Select file to upload:
            <input type="file" name="file" id="file">
            <input type="submit" value="Upload File">
        </form>
    `);
    res.end();
};
