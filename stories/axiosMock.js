/**
 * @author sriram
 *
 * Create and export a mock axios object to be shared by all tests.
 *
 */
import axiosInstance from "../src/common/getAxios";
import MockAdapter from "axios-mock-adapter";
const mockAxios = new MockAdapter(axiosInstance, { delayResponse: 2000 });
export { mockAxios };
