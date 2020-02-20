import fetch from "node-fetch";
import path from "path";
import querystring from "querystring";

import { terrainURL } from "../configuration";
import logger from "../logging";

export const handler = ({ method, pathname, headers }) => {
    return async (req, res) => {
        call(
            {
                method,
                pathname,
                headers,
                query: req.query,
                userID: req?.user?.profile?.id,
                accessToken: req?.user?.accessToken,
            },
            req
        )
            .then((apiResponse) => {
                res.status(apiResponse.status);
                apiResponse.body.pipe(res);
            })
            .catch((e) => {
                res.status(500).send(e.message);
            });
    };
};

export const call = (
    { method, pathname, headers, query, userID, accessToken },
    inStream
) => {
    const apiURL = new URL(terrainURL);
    apiURL.pathname = path.join(apiURL.pathname, pathname);

    if (query) {
        apiURL.search = querystring.stringify(query);
    }

    logger.info(`TERRAIN ${userID} ${method} ${apiURL.href}`);

    let requestOptions = {
        method,
        credentials: "include",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };

    if (!["GET", "HEAD"].includes(method)) {
        requestOptions.body = inStream;
    }

    if (headers) {
        requestOptions.headers = {
            ...requestOptions.headers,
            ...headers,
        };
    }

    return fetch(apiURL, requestOptions);
};
