/**
 * View videos
 *
 * @author sriram
 *
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import ReactPlayer from "react-player";

import Toolbar from "./Toolbar";

import { Typography } from "@material-ui/core";

export default function VideoViewer(props) {
    const { baseId, path, resourceId } = props;
    const { t } = useTranslation("data");
    const [url, setUrl] = useState("");
    useEffect(() => {
        const protocol = window.location.protocol.concat("//");
        const host = protocol.concat(window.location.host);
        setUrl(`${host}/api/download?path=${path}`);
    }, [path]);

    if (url) {
        return (
            <>
                <Toolbar
                    path={path}
                    resourceId={resourceId}
                    allowLineNumbers={false}
                />
                <ReactPlayer url={url} controls={true} />
            </>
        );
    } else {
        return <Typography>{t("loading")}</Typography>;
    }
}
