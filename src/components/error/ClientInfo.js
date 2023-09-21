/**
 * A component used to display details about the user and user agent that may
 * be helpful when troubleshooting errors.
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";

import GridLabelValue from "../utils/GridLabelValue";
import constants from "../../constants";
import GridLoading from "../utils/GridLoading";
import { useUserProfile } from "../../contexts/userProfile";

import buildID from "components/utils/DebugIDUtil";
import ids from "../utils/ids";
import { Typography } from "@mui/material";

function ClientInfo(props) {
    const [browser, setBrowser] = useState();
    const { t } = useTranslation("util");
    useEffect(() => {
        const doSetBrowser = async () => {
            const Bowser = (await import("bowser")).default;
            setBrowser(Bowser.getParser(window.navigator.userAgent));
        };
        doSetBrowser();
    }, []);
    const { baseId } = props;
    const [userProfile] = useUserProfile();
    if (!browser) {
        return <GridLoading rows={5} />;
    }
    return (
        <>
            <GridLabelValue label={t("user")}>
                <Typography id={buildID(baseId, ids.USER)}>
                    {userProfile?.id}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("browser")}>
                <Typography id={buildID(baseId, ids.BROWSER)}>
                    {browser.getBrowser().name} - {browser.getBrowser().version}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("os")}>
                <Typography id={buildID(baseId, ids.OS)}>
                    {browser.getOS().name} - {browser.getOS().versionName} -
                    {browser.getOS().version}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("host")}>
                <Typography
                    id={buildID(baseId, ids.host)}
                    className={constants.CHROMATIC_IGNORE}
                >
                    {window.location.origin}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("timestamp")}>
                <Typography
                    id={buildID(baseId, ids.host)}
                    className={constants.CHROMATIC_IGNORE}
                >
                    {new Date().toString()}
                </Typography>
            </GridLabelValue>
        </>
    );
}

export default ClientInfo;
