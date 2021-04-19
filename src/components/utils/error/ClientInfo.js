/**
 * A component used to display details about the user and user agent that may
 * be helpful when troubleshooting errors.
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";

import GridLabelValue from "../GridLabelValue";
import constants from "../../../constants";
import GridLoading from "../GridLoading";
import { useUserProfile } from "../../../contexts/userProfile";

import { build } from "@cyverse-de/ui-lib";
import ids from "../ids";
import { Typography } from "@material-ui/core";

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
                <Typography id={build(baseId, ids.USER)}>
                    {userProfile?.id}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("browser")}>
                <Typography id={build(baseId, ids.BROWSER)}>
                    {browser.getBrowser().name} - {browser.getBrowser().version}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("os")}>
                <Typography id={build(baseId, ids.OS)}>
                    {browser.getOS().name} - {browser.getOS().versionName} -
                    {browser.getOS().version}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("host")}>
                <Typography
                    id={build(baseId, ids.host)}
                    className={constants.CHROMATIC_IGNORE}
                >
                    {window.location.origin}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("timestamp")}>
                <Typography
                    id={build(baseId, ids.host)}
                    className={constants.CHROMATIC_IGNORE}
                >
                    {new Date().toString()}
                </Typography>
            </GridLabelValue>
        </>
    );
}

export default ClientInfo;
