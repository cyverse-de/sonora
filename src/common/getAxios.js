/**
 * @author sriram
 * Create and export an instance of axios
 */
import axios from "axios";

import { isMaintenanceResponse, triggerMaintenanceReload } from "./maintenance";

const axiosInstance = axios.create({
    timeout: 20000, //service call timeout
});

// Detect gateway maintenance mode on API/XHR responses and force a hard navigation
// so the browser re-requests the page as a document and lands on the maintenance
// page served by the gateway. Browser-only: this same instance is reused server-side
// to proxy to Terrain, where `window` is undefined and a 503 must propagate normally.
if (typeof window !== "undefined") {
    axiosInstance.interceptors.response.use(
        (resp) => resp,
        (error) => {
            if (error?.response && isMaintenanceResponse(error.response)) {
                triggerMaintenanceReload();
                // Never resolve so no error UI flashes before the page reloads,
                // even for concurrent calls that arrive after the reload starts.
                return new Promise(() => {});
            }
            return Promise.reject(error);
        }
    );
}

export default axiosInstance;
