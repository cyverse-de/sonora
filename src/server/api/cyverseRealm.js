/**
 * @author aramsey
 *
 * An express handler for making calls to APIs authenticated within the
 * CyVerse realm (e.g. User Portal)
 */

import logger from "../logging";
import axiosInstance from "../../common/getAxios";
import path from "path";
import querystring from "querystring";
import { replaceNamedPathSegments } from "../../common/functions";

export const handler = ({ method, url, pathname }) => {
    return async (req, res) => {
        const accessToken = req?.kauth?.grant?.access_token?.token;
        const { params, query } = req;

        const apiURL = new URL(url);
        let updatedPathName = replaceNamedPathSegments(params, pathname);
        apiURL.pathname = path.join(apiURL.pathname, updatedPathName);

        if (query) {
            apiURL.search = querystring.stringify(query);
        }

        logger.info(`CYREALM ${method} ${apiURL.toString()}`);

        axiosInstance
            .request({
                method,
                url: apiURL.toString(),
                headers: accessToken
                    ? { Authorization: `Bearer ${accessToken}` }
                    : {},
            })
            .then((apiResponse) => {
                // Do not set apiResponse.headers
                // Setting them wipes out the auth for subsequent calls
                res.status(apiResponse.status);
                res.send(apiResponse.data);
            })
            .catch(async (err) => {
                logger.error(err);
                const e = await err;

                res.status(e.response?.status || 500);
                res.send(e.response?.data);
            });
    };
};
