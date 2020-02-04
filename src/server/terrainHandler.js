import request from "request";
import path from "path";
import querystring from "querystring";
import { terrainURL } from "./configuration";

export const terrain = ({ method, url, pathname, headers }) => {
    const baseURL = url || terrainURL;

    return (req, res) => {
        const apiURL = new URL(baseURL);
        apiURL.pathname = path.join(apiURL.pathname, pathname);
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
