/**
 *
 * @author sriram
 *
 *
 */
import React from "react";
import { useRouter } from "next/router";
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

Analysis.getInitialProps = async () => ({
    namespacesRequired: ["analyses"],
});
