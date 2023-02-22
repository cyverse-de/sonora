/**
 * @author aramsey
 *
 * A page for creating a new team
 */

import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { RequiredNamespaces } from "i18n";

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

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "teams",
                ...RequiredNamespaces,
            ])),
        },
    };
}
