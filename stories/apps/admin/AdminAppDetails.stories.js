import React from "react";
import { mockAxios } from "../../axiosMock";
import { adminApp, adminDetails } from "../AppMocks";

import appsConstants from "components/apps/constants";
import AdminAppDetails from "components/apps/admin/details/AdminAppDetails";

export default {
    title: "Apps / Admin Details",
};

export function AdminAppDetailsTest() {
    mockAxios
        .onGet(new RegExp(`/api/admin/apps/de/${adminApp.id}/.*details`))
        .reply((config) => {
            console.log("Get Admin App Details", config.url);
            const url = config.url.split("/");
            const version_id = url[7] || adminDetails.version_id;

            const details = {
                ...adminDetails,
                version_id,
            };

            return [200, details];
        });

    mockAxios.onGet(`/api/admin/apps/${adminApp.id}/metadata`).reply(200, {
        avus: [{ attr: "existing", value: "metadata", unit: "" }],
    });

    mockAxios
        .onPost(new RegExp(`/api/admin/apps/de/${adminApp.id}/.*documentation`))
        .reply((config) => {
            const docs = JSON.parse(config.data);
            console.log("Save New Docs", config.url, docs);

            return [200, docs];
        });

    mockAxios
        .onPatch(
            new RegExp(`/api/admin/apps/de/${adminApp.id}/.*documentation`)
        )
        .reply((config) => {
            const docs = JSON.parse(config.data);
            console.log("Update Docs", config.url, docs);

            return [200, docs];
        });

    mockAxios
        .onPatch(new RegExp(`/api/admin/apps/de/${adminApp.id}.*`))
        .reply((config) => {
            const url = config.url.split("/");
            const version_id = url[6] || adminApp.version_id;
            const app = JSON.parse(config.data);
            console.log("Save App", config.url, app);

            return [200, { ...app, version_id }];
        });

    mockAxios
        .onPut(`/api/admin/apps/${adminApp.id}/metadata`)
        .reply((config) => {
            const avus = JSON.parse(config.data);
            console.log("Set Metadata", config.url, avus);

            return [200, avus];
        });

    return (
        <AdminAppDetails
            open={true}
            parentId={"adminAppDetailsDlg"}
            app={adminApp}
            handleClose={() => console.log("Dialog closed.")}
            restrictedChars={appsConstants.APP_NAME_RESTRICTED_CHARS}
            restrictedStartingChars={
                appsConstants.APP_NAME_RESTRICTED_STARTING_CHARS
            }
            documentationTemplateUrl={appsConstants.DOCUMENTATION_TEMPLATE_URL}
        />
    );
}
