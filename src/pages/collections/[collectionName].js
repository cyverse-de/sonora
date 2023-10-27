/**
 * @author aramsey
 *
 * A page for modifying an existing collection
 */

import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";

import CollectionForm from "components/collections/form";
import NavigationConstants from "common/NavigationConstants";

export default function EditCollection() {
    const router = useRouter();
    const { collectionName } = router.query;

    const goBackToCollectionList = () => {
        router.push(`/${NavigationConstants.COLLECTIONS}`);
    };

    return (
        <CollectionForm
            parentId="editCollection"
            collectionName={collectionName}
            goBackToCollectionList={goBackToCollectionList}
        />
    );
}

export async function getServerSideProps(context) {
    const {
        locale,
        params: { collectionName },
    } = context;

    const title = i18n.t("collections:pageTitle", {
        name: collectionName,
    });

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
