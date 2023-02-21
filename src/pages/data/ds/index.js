/**
 *
 * @author sriram, aramsey
 */
import React, { Fragment, useEffect } from "react";
import { useUserProfile } from "contexts/userProfile";
import { useConfig } from "contexts/config";
import { getEncodedPath, getPageQueryParams } from "components/data/utils";
import { RequiredNamespaces } from "i18n";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

/**
 *
 * Handle default routing to /data/ds
 *
 * Go directly to the dynamic path
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
                pathname: `${router.pathname}${defaultPath}`,
                query: defaultParams,
            });
        }
    }, [router, config, userProfile]);

    return <Fragment />;
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "data",
                ...RequiredNamespaces,
            ])),
        },
    };
}
