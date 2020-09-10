/**
 * view pdf, xml and other docs.
 *
 * @author sriram
 *
 */
import React, { useEffect } from "react";
import { useTranslation } from "i18n";

import Toolbar from "./Toolbar";

import { Typography } from "@material-ui/core";

export default function DocumentViewer(props) {
    const { path, resourceId } = props;
    const { t } = useTranslation("data");
    useEffect(() => {
        const protocol = window.location.protocol.concat("//");
        const host = protocol.concat(window.location.host);
        window.open(
            `${host}/api/download?path=${path}&attachment=0&url=display-download`,
            "_blank"
        );
    }, [path]);

    return (
        <>
            <Toolbar
                path={path}
                resourceId={resourceId}
                allowLineNumbers={false}
            />
            <Typography>{t("disablePopup")}</Typography>
        </>
    );
}
