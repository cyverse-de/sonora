/**
 * A component for listing and selecting new App parameters.
 *
 * @author psarando
 */
import React from "react";

import ids from "./ids";

import { Trans, useTranslation } from "i18n";

import ResourceIcon from "components/data/listing/ResourceIcon";

import AppParamTypes from "components/models/AppParamTypes";
import ResourceTypes from "components/models/ResourceTypes";
import DEDialog from "components/utils/DEDialog";

import buildID from "components/utils/DebugIDUtil";

import {
    Avatar,
    Collapse,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    ListSubheader,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import {
    CheckBox,
    Code,
    FileCopy as MultiFileIcon,
    Info as HelpIcon,
    Info as InfoIcon,
    List as ListIcon,
    Subject as MultiLineTextIcon,
    TextFields as TextIcon,
} from "@mui/icons-material";

function ParamTypeIcon(props) {
    const { paramType } = props;

    let icon;

    switch (paramType) {
        case AppParamTypes.FILE_INPUT:
        case AppParamTypes.FILE_OUTPUT:
            icon = <ResourceIcon color="action" type={ResourceTypes.FILE} />;
            break;

        case AppParamTypes.FOLDER_INPUT:
        case AppParamTypes.FOLDER_OUTPUT:
            icon = <ResourceIcon color="action" type={ResourceTypes.FOLDER} />;
            break;

        case AppParamTypes.MULTIFILE_SELECTOR:
        case AppParamTypes.MULTIFILE_OUTPUT:
            icon = <MultiFileIcon color="action" />;
            break;

        case AppParamTypes.INFO:
            icon = <InfoIcon color="action" />;
            break;

        case AppParamTypes.TEXT:
            icon = <TextIcon color="action" />;
            break;

        case AppParamTypes.MULTILINE_TEXT:
            icon = <MultiLineTextIcon color="action" />;
            break;

        case AppParamTypes.FLAG:
            icon = <CheckBox color="action" />;
            break;

        case AppParamTypes.INTEGER:
            icon = (
                <Typography variant="button" color="textSecondary">
                    123
                </Typography>
            );
            break;

        case AppParamTypes.DOUBLE:
            icon = (
                <Typography variant="button" color="textSecondary">
                    2.3
                </Typography>
            );
            break;

        case AppParamTypes.TEXT_SELECTION:
        case AppParamTypes.INTEGER_SELECTION:
        case AppParamTypes.DOUBLE_SELECTION:
        case AppParamTypes.REFERENCE_GENOME:
        case AppParamTypes.REFERENCE_SEQUENCE:
        case AppParamTypes.REFERENCE_ANNOTATION:
            icon = <ListIcon color="action" />;
            break;

        default:
            icon = <Code color="action" />;
            break;
    }

    return (
        <ListItemAvatar>
            <Avatar>{icon}</Avatar>
        </ListItemAvatar>
    );
}

function ParamTypeListItemHelpText(props) {
    const { paramType, primaryText } = props;

    const { t } = useTranslation("app_editor_help");

    return (
        <ListItemText
            primary={primaryText}
            secondary={
                <Trans
                    t={t}
                    i18nKey={paramType}
                    components={{
                        b: <b />,
                        i: <i />,
                        p: <p />,
                    }}
                />
            }
            secondaryTypographyProps={{ component: "div" }}
        />
    );
}

function ParamTypeListItem(props) {
    const { id, paramType, onClick } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [helpOpen, setHelpOpen] = React.useState(false);

    const { t } = useTranslation([
        "app_param_types",
        "app_editor",
        "app_editor_help",
    ]);

    return isMobile ? (
        <>
            <ListItem id={id} divider={!helpOpen} button onClick={onClick}>
                <ParamTypeIcon paramType={paramType} />
                <ListItemText primary={t(paramType)} />
                <ListItemSecondaryAction>
                    <IconButton
                        id={buildID(id, t("app_editor:helpText"))}
                        edge="end"
                        aria-label={t("app_editor:helpText")}
                        onClick={() => setHelpOpen(!helpOpen)}
                        size="large"
                    >
                        <HelpIcon color="primary" />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={helpOpen} timeout="auto" unmountOnExit>
                <ListItem divider>
                    <ParamTypeListItemHelpText paramType={paramType} />
                </ListItem>
            </Collapse>
        </>
    ) : (
        <ListItem id={id} divider button onClick={onClick}>
            <ParamTypeIcon paramType={paramType} />
            <ParamTypeListItemHelpText
                paramType={paramType}
                primaryText={t(paramType)}
            />
        </ListItem>
    );
}

function ParamTypeSubList(props) {
    const { baseId, handleAddParam, paramTypes } = props;

    return paramTypes.map((paramType) => (
        <ParamTypeListItem
            key={paramType}
            id={buildID(baseId, paramType)}
            paramType={paramType}
            onClick={() => handleAddParam(paramType)}
        />
    ));
}

function ParamSelectionPalette(props) {
    const { baseId, open, onClose, handleAddParam } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { t } = useTranslation("app_editor");

    return (
        <DEDialog
            baseId={ids.PARAM_SELECTION_PALETTE}
            open={open}
            title={
                <>
                    {t("selectParameter")}
                    {isMobile && (
                        <Typography component="div" variant="subtitle2">
                            {t("selectParameterDialogSubtitle")}
                        </Typography>
                    )}
                </>
            }
            onClose={onClose}
            maxWidth="md"
        >
            <List>
                <ListSubheader disableSticky>
                    {t("fileFolderCategoryTitle")}
                </ListSubheader>
                <ParamTypeSubList
                    baseId={baseId}
                    handleAddParam={handleAddParam}
                    paramTypes={[
                        AppParamTypes.FILE_INPUT,
                        AppParamTypes.FOLDER_INPUT,
                        AppParamTypes.MULTIFILE_SELECTOR,
                    ]}
                />

                <ListSubheader disableSticky>
                    {t("textNumericalInputCategoryTitle")}
                </ListSubheader>
                <ParamTypeSubList
                    baseId={baseId}
                    handleAddParam={handleAddParam}
                    paramTypes={[
                        AppParamTypes.FLAG,
                        AppParamTypes.DOUBLE,
                        AppParamTypes.ENV_VAR,
                        AppParamTypes.INFO,
                        AppParamTypes.INTEGER,
                        AppParamTypes.TEXT_SELECTION,
                        AppParamTypes.MULTILINE_TEXT,
                        AppParamTypes.TEXT,
                    ]}
                />

                <ListSubheader disableSticky>
                    {t("outputCategoryTitle")}
                </ListSubheader>
                <ParamTypeSubList
                    baseId={baseId}
                    handleAddParam={handleAddParam}
                    paramTypes={[
                        AppParamTypes.FILE_OUTPUT,
                        AppParamTypes.FOLDER_OUTPUT,
                        AppParamTypes.MULTIFILE_OUTPUT,
                    ]}
                />

                <ListSubheader disableSticky>
                    {t("referenceGenomeCategoryTitle")}
                </ListSubheader>
                <ParamTypeSubList
                    baseId={baseId}
                    handleAddParam={handleAddParam}
                    paramTypes={[
                        AppParamTypes.REFERENCE_ANNOTATION,
                        AppParamTypes.REFERENCE_GENOME,
                        AppParamTypes.REFERENCE_SEQUENCE,
                    ]}
                />
            </List>
        </DEDialog>
    );
}

export default ParamSelectionPalette;
