/**
 * A component for listing and selecting new App parameters.
 *
 * @author psarando
 */
import React from "react";

import { Trans } from "react-i18next";

import { useTranslation } from "i18n";

import AppParamTypes from "components/models/AppParamTypes";
import DEDialog from "components/utils/DEDialog";

import { build as buildID } from "@cyverse-de/ui-lib";

import { List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";

function ParamTypeListItem(props) {
    const { id, paramType, onClick } = props;

    const { t } = useTranslation(["app_param_types", "app_editor_help"]);

    return (
        <ListItem id={id} divider button onClick={onClick}>
            <ListItemText
                primary={t(paramType)}
                secondary={
                    <Trans
                        t={t}
                        i18nKey={`app_editor_help:${paramType}`}
                        components={{
                            b: <b />,
                            i: <i />,
                            p: <p />,
                        }}
                    />
                }
                secondaryTypographyProps={{ component: "div" }}
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

    const { t } = useTranslation("app_editor");

    return (
        <DEDialog
            baseId={baseId}
            open={open}
            title={t("selectParameter")}
            onClose={onClose}
        >
            <List>
                <ListSubheader disableSticky>
                    {t("fileFolderCategoryTitle")}
                </ListSubheader>
                <ParamTypeSubList
                    baseId={baseId}
                    handleAddParam={handleAddParam}
                    paramTypes={[
                        AppParamTypes.MULTIFILE_SELECTOR,
                        AppParamTypes.FILE_INPUT,
                        AppParamTypes.FOLDER_INPUT,
                    ]}
                />

                <ListSubheader disableSticky>
                    {t("textNumericalInputCategoryTitle")}
                </ListSubheader>
                <ParamTypeSubList
                    baseId={baseId}
                    handleAddParam={handleAddParam}
                    paramTypes={[
                        AppParamTypes.INFO,
                        AppParamTypes.TEXT,
                        AppParamTypes.MULTILINE_TEXT,
                        AppParamTypes.FLAG,
                        AppParamTypes.INTEGER,
                        AppParamTypes.DOUBLE,
                        AppParamTypes.TEXT_SELECTION,
                        AppParamTypes.ENV_VAR,
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
                        AppParamTypes.REFERENCE_GENOME,
                        AppParamTypes.REFERENCE_SEQUENCE,
                        AppParamTypes.REFERENCE_ANNOTATION,
                    ]}
                />
            </List>
        </DEDialog>
    );
}

export default ParamSelectionPalette;
