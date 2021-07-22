/**
 * A component that can be used to allow a user to contact support.
 */
import React from "react";
import { useTranslation } from "i18n";

import { intercomShow } from "../../common/intercom";

import buildID from "components/utils/DebugIDUtil";
import { Button } from "@material-ui/core";
import ids from "../utils/ids";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

function ContactSupport(props) {
    const { baseId } = props;
    const { t } = useTranslation("util");
    return (
        <Button
            id={buildID(baseId, ids.CONTACT_SUPPORT_BUTTON)}
            color="primary"
            startIcon={<LiveHelpIcon />}
            onClick={intercomShow}
            style={{ marginLeft: "auto" }}
        >
            {t("contactSupport")}
        </Button>
    );
}

export default ContactSupport;
