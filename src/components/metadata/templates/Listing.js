/**
 * @author psarando
 */
import React from "react";
import { useQuery } from "react-query";

import { useTranslation } from "i18n";

import ids from "../ids";

import SlideUpTransition from "../SlideUpTransition";

import DEDialog from "components/utils/DEDialog";
import { getHost } from "components/utils/getHost";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";

import {
    FILESYSTEM_METADATA_TEMPLATE_LISTING_QUERY_KEY,
    getFilesystemMetadataTemplateListing,
} from "serviceFacades/metadata";

import buildID from "components/utils/DebugIDUtil";

import {
    Button,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
} from "@mui/material";

import { CloudDownload } from "@mui/icons-material";

import Skeleton from "@mui/material/Skeleton";

const TemplateListItem = (props) => {
    const { baseId, template, selected, onClick, onDownload } = props;

    const { t } = useTranslation("metadata");

    return (
        <ListItem
            id={baseId}
            divider
            button
            selected={selected}
            onClick={onClick}
        >
            <ListItemText
                primary={template.name}
                secondary={template.description}
            />
            <ListItemSecondaryAction>
                <IconButton
                    id={buildID(baseId, ids.BUTTONS.DOWNLOAD)}
                    aria-label={t("downloadTemplate")}
                    color="primary"
                    onClick={onDownload}
                    size="large"
                >
                    <CloudDownload />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

const MetadataTemplateListing = (props) => {
    const { baseId, open, onClose, onSelectTemplate } = props;

    const { t } = useTranslation(["metadata", "common"]);

    const [templates, setTemplates] = React.useState(null);
    const [selectedTemplateId, setSelectedTemplateId] = React.useState(null);
    const [downloadTemplateId, setDownloadTemplateId] = React.useState(null);

    React.useEffect(() => {
        if (downloadTemplateId) {
            window.open(
                `${getHost()}/api/filesystem/metadata/template/${downloadTemplateId}/zip-csv`,
                "_blank"
            );

            setDownloadTemplateId(null);
        }
    }, [downloadTemplateId]);

    const { isFetching, error: fetchError } = useQuery({
        queryKey: FILESYSTEM_METADATA_TEMPLATE_LISTING_QUERY_KEY,
        queryFn: getFilesystemMetadataTemplateListing,
        enabled: true,
        onSuccess: ({ metadata_templates }) => setTemplates(metadata_templates),
    });

    const dialogID = buildID(baseId, ids.DIALOG);
    const listingID = buildID(dialogID, ids.METADATA_TEMPLATE_LISTING);

    if (fetchError) {
        return (
            <WrappedErrorHandler errorObject={fetchError} baseId={listingID} />
        );
    }

    return (
        <DEDialog
            baseId={dialogID}
            open={open}
            title={t("selectTemplate")}
            onClose={onClose}
            TransitionComponent={SlideUpTransition}
            actions={[
                <Button
                    key={ids.BUTTONS.DONE}
                    id={buildID(dialogID, ids.BUTTONS.DONE)}
                    onClick={onClose}
                >
                    {t("common:cancel")}
                </Button>,
                <Button
                    key={ids.BUTTONS.CONFIRM}
                    id={buildID(dialogID, ids.BUTTONS.CONFIRM)}
                    variant="contained"
                    onClick={() =>
                        selectedTemplateId &&
                        onSelectTemplate(selectedTemplateId)
                    }
                >
                    {t("common:select")}
                </Button>,
            ]}
        >
            <List>
                {isFetching
                    ? [1, 2, 3, 4, 5].map((rowNum) => (
                          <Skeleton key={rowNum} width="100%" height={100} />
                      ))
                    : templates?.map((template) => (
                          <TemplateListItem
                              key={template.id}
                              baseId={buildID(listingID, template.id)}
                              template={template}
                              selected={selectedTemplateId === template.id}
                              onClick={() => setSelectedTemplateId(template.id)}
                              onDownload={() =>
                                  setDownloadTemplateId(template.id)
                              }
                          />
                      ))}
            </List>
        </DEDialog>
    );
};

export default MetadataTemplateListing;
