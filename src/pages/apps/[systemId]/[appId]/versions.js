/**
 * A page for displaying the App Versions Ordering Form.
 *
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useQuery } from "react-query";

import { i18n, RequiredNamespaces } from "i18n";

import ids from "components/apps/editor/ids";
import VersionsOrderingForm from "components/apps/editor/VersionsOrderingForm";

import {
    getAppDescription,
    APP_DESCRIPTION_QUERY_KEY,
} from "serviceFacades/apps";

export default function VersionsOrderEdit() {
    const [app, setApp] = React.useState(null);

    const router = useRouter();
    const { systemId, appId } = router.query;

    const { isFetching, error } = useQuery({
        queryKey: [APP_DESCRIPTION_QUERY_KEY, { systemId, appId }],
        queryFn: () => getAppDescription({ systemId, appId }),
        enabled: !!(systemId && appId),
        onSuccess: setApp,
    });

    return (
        <VersionsOrderingForm
            baseId={ids.APP_VERSION}
            app={app}
            error={error}
            isLoading={isFetching}
        />
    );
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("app_editor:orderAppVersions");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "app_editor",
                ...RequiredNamespaces,
            ])),
        },
    };
}
