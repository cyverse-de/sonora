/**
 * view pdf, xml and other docs.
 *
 * @author sriram
 *
 */
import React, { useEffect } from "react";

import { useTranslation } from "i18n";

import { getHost } from "../../utils/getHost";
import ids from "./ids";
import Toolbar from "./Toolbar";
import buildID from "components/utils/DebugIDUtil";

import { Typography } from "@mui/material";

export default function DocumentViewer(props) {
    const { baseId, path, resourceId, handlePathChange, onRefresh, fileName } =
        props;
    const { t } = useTranslation("data");
    useEffect(() => {
        window.open(
            `${getHost()}/api/download?path=${encodeURIComponent(
                path
            )}&attachment=0&url=display-download`,
            "_blank"
        );
    }, [path]);

    return (
        <>
            <Toolbar
                baseId={buildID(baseId, ids.VIEWER_DOC, ids.TOOLBAR)}
                path={path}
                resourceId={resourceId}
                allowLineNumbers={false}
                handlePathChange={handlePathChange}
                onRefresh={onRefresh}
                fileName={fileName}
            />
            <Typography>{t("disablePopup")}</Typography>
        </>
    );
}
