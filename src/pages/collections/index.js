/**
 * @author aramsey
 *
 * A page for the collection listing view
 */

import React from "react";
import CollectionsView from "components/collections";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, RequiredNamespaces } from "i18n";
import NavigationConstants from "../../common/NavigationConstants";

export default function Collections() {
    const router = useRouter();

    const onCollectionSelected = (collection) => {
        const collectionName = collection.name;
        router.push(
            `${NavigationConstants.COLLECTIONS}/${encodeURIComponent(
                collectionName
            )}`
        );
    };

    const onCreateCollectionSelected = () => {
        router.push(`${NavigationConstants.COLLECTIONS}/create`);
    };

    return (
        <CollectionsView
            baseId="collections"
            onCollectionSelected={onCollectionSelected}
            onCreateCollectionSelected={onCreateCollectionSelected}
        />
    );
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("collections:featureName_plural");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "collections",
                ...RequiredNamespaces,
            ])),
        },
    };
}
