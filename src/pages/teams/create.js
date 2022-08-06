/**
 * @author aramsey
 *
 * A page for creating a new team
 */

import React from "react";

import { useRouter } from "next/router";

import { serverSideTranslations, RequiredNamespaces } from "i18n";

import NavigationConstants from "common/NavigationConstants";
import TeamForm from "components/teams/form/";

export default function CreateTeam() {
    const router = useRouter();
    const goBackToTeamView = () => {
        router.push(`/${NavigationConstants.TEAMS}`);
    };

    return (
        <TeamForm parentId="createTeam" goBackToTeamView={goBackToTeamView} />
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "teams",
                "sharing",
                ...RequiredNamespaces,
            ])),
        },
    };
}
