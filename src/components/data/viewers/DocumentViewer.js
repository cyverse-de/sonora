/**
 * view pdf, xml and other docs.
 *
 * @author sriram
 *
 */
import React, { useEffect } from "react";
import { useTranslation } from "i18n";
import ids from "./ids";
import Toolbar from "./Toolbar";

import { build } from "@cyverse-de/ui-lib";
import { Typography } from "@material-ui/core";

export default function DocumentViewer(props) {
    const { baseId, path, resourceId } = props;
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
                baseId={build(baseId, ids.VIEWER_DOC, ids.TOOLBAR)}
                path={path}
                resourceId={resourceId}
                allowLineNumbers={false}
            />
            <Typography>{t("disablePopup")}</Typography>
        </>
    );
}
