/**
 * @author aramsey
 *
 * A page for the team listing view
 */

import React from "react";
import TeamsView from "components/teams";

export default function Teams() {
    return <TeamsView baseId="teams" />;
}

Teams.getInitialProps = async () => ({
    namespacesRequired: ["teams"],
});
