import React from "react";

import { useRouter } from "next/router";

import { getAnalysisRelaunchPage } from "components/analyses/utils";
import { getFolderPage } from "components/data/utils";
import Listing from "components/analyses/listing/Listing";

export default function Analyses() {
    const router = useRouter();

    return (
        <Listing
            baseId="analyses"
            handleGoToOutputFolder={(analysis) => {
                if (analysis?.resultfolderid) {
                    router.push(getFolderPage(analysis.resultfolderid));
                }
            }}
            handleSingleRelaunch={(analysis) => {
                if (analysis?.id) {
                    router.push(getAnalysisRelaunchPage(analysis.id));
                }
            }}
        />
    );
}

Analyses.getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, namespacesRequired: ["analyses"] };
};
