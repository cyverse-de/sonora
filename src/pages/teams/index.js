/**
 * @author aramsey
 *
 * A page for the team listing view
 */

import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";

import NavigationConstants from "common/NavigationConstants";
import TeamsView from "components/teams";
import { getTeamLinkRefs } from "components/teams/util";

export default function Teams() {
    const router = useRouter();

    const onTeamNameSelected = (teamName) => {
        const [href] = getTeamLinkRefs(teamName);
        router.push(href);
    };

    const onCreateTeamSelected = () => {
        router.push(`/${NavigationConstants.TEAMS}/create`);
    };

    return (
        <TeamsView
            baseId="teams"
            onTeamNameSelected={onTeamNameSelected}
            onCreateTeamSelected={onCreateTeamSelected}
        />
    );
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("teams");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "teams",
                ...RequiredNamespaces,
            ])),
        },
    };
}
