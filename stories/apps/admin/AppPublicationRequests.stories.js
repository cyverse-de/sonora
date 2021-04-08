import React from "react";
import { mockAxios } from "../../axiosMock";
import { appPublicationRequests } from "../AppMocks";
import RequestListing from "components/apps/admin/publicationRequests/RequestListing";

export default {
    title: "Apps / Publication Requests",
};

export function AppPublicationRequestsTest() {
    const parentId = "publicationRequests";

    mockAxios
        .onGet(`/api/admin/apps/publication-requests`)
        .reply(200, appPublicationRequests);

    return <RequestListing parentId={parentId} />;
}
