import request from "request";
import path from "path";
import querystring from "querystring";

export const terrainHandler = (method, terrainURL, terrainPath, headers) => {
    return (req, res) => {
        const apiURL = new URL(terrainURL);
        apiURL.pathname = path.join(apiURL.pathname, terrainPath);
        apiURL.search = querystring.stringify(req.query);

        const requestOptions = {
            method: method,
            url: apiURL.href,
        };

        if (headers) {
            requestOptions.headers = headers;
        }

        console.log(
            `${method} ${JSON.stringify(requestOptions.headers || {})} ${
                apiURL.href
            }`
        );

        req.pipe(request(requestOptions)).pipe(res);
    };
};
