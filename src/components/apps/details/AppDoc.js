/**
 *  @author sriram
 *
 **/

import React, { useState } from "react";
import { useQuery } from "react-query";
import sanitizeHtml from "sanitize-html";
import showdown from "showdown";
import { useTranslation } from "i18n";

import { APP_DOC_QUERY_KEY, getAppDoc } from "serviceFacades/apps";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

import {
    Dialog,
    Divider,
    DialogTitle,
    DialogContent,
    IconButton,
    Link,
    CircularProgress,
    Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

function References(props) {
    const { references } = props;
    const { t } = useTranslation("apps");
    if (references) {
        return (
            <React.Fragment>
                <Typography variant="subtitle2">{t("references")}</Typography>
                {references.map((ref) => {
                    return <div key={ref}>{ref}</div>;
                })}
            </React.Fragment>
        );
    }

    return null;
}

function WikiUrl(props) {
    const { wiki_url, name } = props;
    const { t } = useTranslation("apps");
    return (
        <>
            <Typography variant="subtitle2">{t("documentation")}</Typography>
            <Link onClick={() => window.open(wiki_url, "_blank")}>{name}</Link>
        </>
    );
}

function AppDoc(props) {
    const { open, wiki_url, appId, systemId, name, onClose } = props;

    const [documentation, setDocumentation] = useState(null);
    const [references, setReferences] = useState(null);
    const [error, setError] = useState(false);

    const { t } = useTranslation("apps");

    const markDownToHtml = () => {
        const converter = new showdown.Converter();
        converter.setFlavor("github");
        if (documentation) {
            return sanitizeHtml(converter.makeHtml(documentation));
        } else {
            return "";
        }
    };

    const { isFetching } = useQuery({
        queryKey: [
            APP_DOC_QUERY_KEY,
            {
                systemId,
                appId,
            },
        ],
        queryFn: getAppDoc,
        config: {
            enabled:
                appId != null &&
                systemId !== null &&
                (wiki_url === undefined || wiki_url === null),
            onSuccess: (doc) => {
                setDocumentation(doc.documentation);
                setReferences(doc.references);
            },
            onError: (e) => {
                setError(e);
            },
        },
    });

    if (wiki_url) {
        return <WikiUrl wiki_url={wiki_url} name={name} />;
    }

    if (error) {
        return (
            <ErrorTypographyWithDialog
                errorMessage={t("docFetchError")}
                errorObject={error}
            />
        );
    }

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>
                    {t("documentation")}
                    <IconButton
                        aria-label={t("close")}
                        onClick={onClose}
                        style={{ float: "right" }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Divider />
                </DialogTitle>
                <DialogContent>
                    {isFetching && <CircularProgress size={30} thickness={5} />}
                    {documentation && (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: markDownToHtml(),
                            }}
                        />
                    )}
                    {references && references.length > 0 && (
                        <>
                            <Divider />
                            <References references={references} />
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AppDoc;
