/**
 * Express handler for proxying requests to 3rd party APIs.
 *
 * @author psarando
 */
import logger from "../logging";
import axiosInstance from "../../common/getAxios";

/**
 * Returns an Express handler that can proxy requests to a 3rd party API.
 *
 * @param {Object} config - The configuration for the handler.
 * @param {string} config.method - The HTTP method to use for the 3rd party requests.
 * @param {string} config.url - The 3rd party API URL.
 * @return {Function}
 */
export const handler = ({ method, url }) => {
    return async (req, res) => {
        const accessToken = req?.kauth?.grant?.access_token,
            userID = accessToken?.content?.preferred_username;

        logger.info(
            `EXTERNAL ${userID} ${method} ${url} ${JSON.stringify(req?.query)}`
        );

        axiosInstance
            .request({ method, url, params: req?.query })
            .then((apiResponse) => {
                res.set(apiResponse.headers);
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
