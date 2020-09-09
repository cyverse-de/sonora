/**
 * View videos
 *
 * @author sriram
 *
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import { Typography } from "@material-ui/core";
import ReactPlayer from "react-player";

export default function VideoViewer(props) {
    const { path } = props;
    const { t } = useTranslation("data");
    const [url, setUrl] = useState("");
    useEffect(() => {
        const protocol = window.location.protocol;
        const slashes = protocol.concat("//");
        const host = slashes.concat(window.location.host);
        setUrl(`${host}/api/download?path=${path}`);
    }, [path]);

    if (url) {
        return <ReactPlayer url={url} controls={true} />;
    } else {
        return <Typography>{t("loading")}</Typography>;
    }
}
