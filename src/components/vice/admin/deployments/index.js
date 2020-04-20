import React from "react";

import { build as buildID, withI18N } from "@cyverse-de/ui-lib";

import messages from "./messages";
import ids from "./ids";

const id = (name) => buildID(ids.BASE, name);

const DeploymentTable = () => {
    return <div id={id(ids.ROOT)}></div>;
};

export default withI18N(DeploymentTable, messages);
