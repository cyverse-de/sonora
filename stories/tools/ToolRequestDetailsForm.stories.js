import React from "react";
import { mockAxios } from "../axiosMock";
import { request_details } from "./ToolRequestMocks";
import DetailsDialog from "components/tools/requests/Details";

export default {
    title: "Tools / Requests Details",
};

export const ToolRequestsDetailsTest = () => {
    mockAxios
        .onGet(`/api/admin/tool-requests/db867f3c-f97a-4b00-a849-c912af61a655`)
        .reply(200, request_details);
    return (
        <DetailsDialog
            open={true}
            parentId="testId"
            requestId="db867f3c-f97a-4b00-a849-c912af61a655"
            onClose={() => console.log("onClose")}
        />
    );
};
