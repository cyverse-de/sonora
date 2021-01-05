import React from "react";
import { mockAxios } from "../../axiosMock";
import { adminApp, adminDetails } from "../AppMocks";
import AdminAppDetails from "components/apps/admin/details/AdminAppDetails";
export default {
    title: "Apps / Admin Details",
};

export function AdminAppDetailsTest() {
    const restrictedChars = ":@/\\|^#;[]{}<>";
    const restrictedStartingChars = "~.$";
    const createDocWikiUrl =
        "https://wiki.cyverse.org/wiki/display/DEmanual/Sharing+your+App+or+Workflow+and+Editing+the+User+Manual#Publish";
    const documentationTemplateUrl =
        "https:qa.cyverse.org/belphegor/app-doc-template.txt";

    const parentId = "adminAppDetailsDlg";

    mockAxios
        .onGet(
            `/api/admin/apps/de/34f2c392-9a8a-11e8-9c8e-008cfa5ae621/details`
        )
        .reply(200, adminDetails);

    return (
        <AdminAppDetails
            open={true}
            parentId={parentId}
            app={adminApp}
            restrictedChars={restrictedChars}
            restrictedStartingChars={restrictedStartingChars}
            createDocWikiUrl={createDocWikiUrl}
            documentationTemplateUrl={documentationTemplateUrl}
        />
    );
}
