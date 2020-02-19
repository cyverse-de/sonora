/**
 * @author aramsey
 *
 * A function which should help standardize how fetch calls are handled.
 * The promise returned from fetch is returned to the caller so more
 * can be chained to it.
 *
 * Sample usages:
 * callApi({
 *     endpoint: "/api/apps"
 * }).then(resp => {
 *     setAppListing(resp.apps)
 * }
 *
 * callApi({
 *     endpoint `/api/apps/${appId}/publish`,
 *     method: "POST",
 *     body: appInfo,
 *     setLoading,
 *     setError,
 * }).then(resp => {
 *     showPublishMessage()
 * }
 *
 * @param props
 * @returns {Promise<any>}
 */

const callApi = (props) => {
    const {
        method = "GET",
        endpoint,
        body = false,
        headers,
        setLoading,
        setError,
    } = props;

    setLoading && setLoading(true);

    return fetch(endpoint, {
        method: method,
        body: body ? JSON.stringify(body) : null,
        headers: headers
            ? headers
            : {
                  "Content-Type": "application/json",
              },
        credentials: "include",
    })
        .then((resp) => {
            if (resp.status < 200 || resp.status > 299) {
                throw Error(resp.status + " " + resp.statusText);
            } else {
                setError && setError(null);
            }
            return resp;
        })
        .then((resp) => {
            return resp.json();
        })
        .catch((error) => {
            setError && setError(error.toString());
            console.error(error);
        })
        .finally(() => {
            setLoading && setLoading(false);
        });
};

export default callApi;
