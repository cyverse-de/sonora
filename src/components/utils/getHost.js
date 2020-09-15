/**
 *
 * Get the host in which the application running.
 * Must be called only from useEffect() otherwise window will be undefined.
 *
 * @return {string} host in which this application is running including protocol, domain and port numbers. e.g: http://localhost:3000
 */
export const getHost = () => {
    if (window) {
        const protocol = window.location.protocol.concat("//");
        const host = protocol.concat(window.location.host);
        return host;
    }
    return null;
};
