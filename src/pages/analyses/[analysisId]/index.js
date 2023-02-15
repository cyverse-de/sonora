/**
 *
 * @author sriram
 *
 *
 */
import React from "react";
import { useRouter } from "next/router";
import { serverSideTranslations, RequiredNamespaces } from "i18n";
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
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "analyses",
                ...RequiredNamespaces,
            ])),
        },
    };
}
