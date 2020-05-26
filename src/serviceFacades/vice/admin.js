import callApi from "../../common/callApi";

export default () =>
    callApi({
        endpoint: "/api/admin/vice/resources",
        method: "GET",
    });
