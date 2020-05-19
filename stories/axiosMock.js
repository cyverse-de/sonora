/**
 * @author sriram
 *
 * Create and export a mock axios object to be shared by all tests.
 *
 */
import axiosInstance from "../src/common/getAxios";
import MockAdapter from "axios-mock-adapter";
const AXIOS_DELAY = 2000;
const mockAxios = new MockAdapter(axiosInstance, {
    delayResponse: AXIOS_DELAY,
});
export { AXIOS_DELAY, mockAxios };
