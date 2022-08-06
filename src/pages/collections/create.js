/**
 * @author aramsey
 *
 * A page for creating a new collection
 */

import React from "react";

import { useRouter } from "next/router";

import { serverSideTranslations, RequiredNamespaces } from "i18n";
import CollectionForm from "components/collections/form";
import NavigationConstants from "common/NavigationConstants";

export default function CreateCollection() {
    const router = useRouter();

    const goBackToCollectionList = () => {
        router.push(`/${NavigationConstants.COLLECTIONS}`);
    };

    return (
        <CollectionForm
            parentId="createCollection"
            goBackToCollectionList={goBackToCollectionList}
        />
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "collections",
                ...RequiredNamespaces,
            ])),
        },
    };
}
