/**
 *
 * @author sriram
 *
 *
 */
import React from "react";
import { useRouter } from "next/router";
import AnalysisSubmissionLanding from "components/analyses/details/AnalysisSubmissionLanding";

/**
 *
 * Handle routing an individual analysis by id
 *
 */

export default function Analysis() {
    const router = useRouter();

    return (
        <AnalysisSubmissionLanding
            baseId="analysesLanding"
            id={router.query?.analysisId}
        />
    );
}

Analysis.getInitialProps = async () => ({
    namespacesRequired: ["analyses"],
});
