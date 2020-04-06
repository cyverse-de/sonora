/**
 * @author sriram
 * Create and export an instance of axios
 */
import axios from "axios";

const axiosInstance = axios.create({
    timeout: 20000, //service call timeout

});
export default axiosInstance;