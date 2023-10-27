/**
 *
 * @author sriram
 *
 *
 */
import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";
import AnalysisSubmissionLanding from "components/analyses/landing/AnalysisSubmissionLanding";

/**
 *
 * Handle routing an individual analysis by id
 *
 */

export const BATCH_DRILL_DOWN = "batchDrillDown";
export default function Analysis() {
    const router = useRouter();

    return (
        <AnalysisSubmissionLanding
            baseId="analysesLanding"
            id={router.query?.analysisId}
            view={router.query?.view}
        />
    );
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("analyses:analysis");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                // "analyses" already included by RequiredNamespaces
                "dashboard",
                ...RequiredNamespaces,
            ])),
        },
    };
}
