/**
 *
 * @author sriram, aramsey
 */
import React, { Fragment, useEffect } from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";

import constants from "../../constants";
import {
    getEncodedPath,
    getPageQueryParams,
} from "../../components/data/utils";
import { useUserProfile } from "../../contexts/userProfile";
import { useConfig } from "../../contexts/config";

/**
 *
 * Handle default routing to /data
 *
 * By default, redirect to the base path for the data store
 */
export default function Data() {
    const router = useRouter();
    const [userProfile] = useUserProfile();
    const [config] = useConfig();

    useEffect(() => {
        const username = userProfile?.id;
        const irodsHomePath = config?.irods?.home_path;

        if (irodsHomePath) {
            const defaultParams = getPageQueryParams();
            const defaultPath = getEncodedPath(
                username
                    ? `${irodsHomePath}/${username}`
                    : `${irodsHomePath}/shared`
            );

            router.push({
                pathname: `${router.pathname}${constants.PATH_SEPARATOR}${constants.DATA_STORE_STORAGE_ID}${defaultPath}`,
                query: defaultParams,
            });
        }
    }, [router, config, userProfile]);

    return <Fragment />;
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("data");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "data",
                ...RequiredNamespaces,
            ])),
        },
    };
}
