import React from "react";
import { mockAxios } from "../axiosMock";
import { requestDetails } from "./doiRequestMocks";
import UpdateRequestDialog from "components/doi/UpdateRequestDialog";
export default {
    title: "DOI / Update Request",
};

export const DOIRequestsUpdateTest = () => {
    mockAxios
        .onGet(
            "/api/admin/permanent-id-requests/47c72eda-6653-11eb-bbb5-62d47aced14b"
        )
        .reply(200, requestDetails);
    mockAxios
        .onPost(
            "/api/admin/permanent-id-requests/47c72eda-6653-11eb-bbb5-62d47aced14b/status"
        )
        .reply(200, {
            type: "DOI",
            original_path:
                "/iplant/home/sriram/analyses/2.6TopHat2SE-Test-2016-05-18-16-18-43.2",
            id: "47c72eda-6653-11eb-bbb5-62d47aced14b",
            requested_by: {
                username: "sriram",
                firstname: "Sriram",
                lastname: "Srinivasan",
                name: "Sriram Srinivasan",
                email: "sriram@iplantcollaborative.org",
                institution: "University of Arizona",
            },
            history: [
                {
                    status: "Submitted",
                    status_date: 1612379343747,
                    updated_by: "sriram",
                },
                {
                    status: "Test",
                    comments: "testing comments.",
                    status_date: 1612381540451,
                    updated_by: "sriram",
                },
            ],
            folder: {
                path: "/iplant/home/shared/commons_repo/staging/2.6TopHat2SE-Test-2016-05-18-16-18-43.2",
                "share-count": 0,
                "date-created": 1606779063000,
                permission: "own",
                "date-modified": 1612379347000,
                type: "dir",
                "dir-count": 3,
                label: "2.6TopHat2SE-Test-2016-05-18-16-18-43.2",
                id: "1cd769aa-3364-11eb-878f-fa163ef45956",
                "file-count": 0,
            },
        });
    return (
        <UpdateRequestDialog
            open={true}
            onClose={() => console.log("Close this dialog")}
            requestId="47c72eda-6653-11eb-bbb5-62d47aced14b"
        />
    );
};
