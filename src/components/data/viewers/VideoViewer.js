/**
 * View videos
 *
 * @author sriram
 *
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import ReactPlayer from "react-player/file";

import ids from "./ids";
import { getHost } from "../../utils/getHost";
import Toolbar from "./Toolbar";
import { parseNameFromPath } from "../utils";

import { build } from "@cyverse-de/ui-lib";

import { Typography } from "@material-ui/core";

export default function VideoViewer(props) {
    const { baseId, path, resourceId } = props;
    const { t } = useTranslation("data");
    const [url, setUrl] = useState("");
    const fileName = parseNameFromPath(path);

    useEffect(() => {
        setUrl(`${getHost()}/api/download?path=${path}`);
    }, [path]);

    if (url) {
        return (
            <div id={build(baseId, ids.VIEWER_VIDEO, fileName)}>
                <Toolbar
                    baseId={build(baseId, ids.VIEWER_VIDEO, ids.TOOLBAR)}
                    path={path}
                    resourceId={resourceId}
                    allowLineNumbers={false}
                />
                <ReactPlayer url={url} controls={true} />
            </div>
        );
    } else {
        return <Typography>{t("loading")}</Typography>;
    }
}
