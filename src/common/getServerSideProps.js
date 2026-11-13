import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { RequiredNamespaces } from "i18n";
import publicConfig from "server/publicConfig";

export async function commonServerSideProps(locale, namespaces = []) {
    return {
        ...(await serverSideTranslations(locale, [
            ...namespaces,
            ...RequiredNamespaces,
        ])),
        publicConfig,
    };
}
