/**
 * A component for listing and selecting new App parameters.
 *
 * @author psarando
 */
import React from "react";

import { Trans } from "react-i18next";

import { useTranslation } from "i18n";

import constants from "components/apps/launch/constants";

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
                        constants.PARAM_TYPE.MULTIFILE_SELECTOR,
                        constants.PARAM_TYPE.FILE_INPUT,
                        constants.PARAM_TYPE.FOLDER_INPUT,
                    ]}
                />

                <ListSubheader disableSticky>
                    {t("textNumericalInputCategoryTitle")}
                </ListSubheader>
                <ParamTypeSubList
                    baseId={baseId}
                    handleAddParam={handleAddParam}
                    paramTypes={[
                        constants.PARAM_TYPE.INFO,
                        constants.PARAM_TYPE.TEXT,
                        constants.PARAM_TYPE.MULTILINE_TEXT,
                        constants.PARAM_TYPE.FLAG,
                        constants.PARAM_TYPE.INTEGER,
                        constants.PARAM_TYPE.DOUBLE,
                        constants.PARAM_TYPE.TEXT_SELECTION,
                        constants.PARAM_TYPE.ENV_VAR,
                    ]}
                />

                <ListSubheader disableSticky>
                    {t("outputCategoryTitle")}
                </ListSubheader>
                <ParamTypeSubList
                    baseId={baseId}
                    handleAddParam={handleAddParam}
                    paramTypes={[
                        constants.PARAM_TYPE.FILE_OUTPUT,
                        constants.PARAM_TYPE.FOLDER_OUTPUT,
                        constants.PARAM_TYPE.MULTIFILE_OUTPUT,
                    ]}
                />

                <ListSubheader disableSticky>
                    {t("referenceGenomeCategoryTitle")}
                </ListSubheader>
                <ParamTypeSubList
                    baseId={baseId}
                    handleAddParam={handleAddParam}
                    paramTypes={[
                        constants.PARAM_TYPE.REFERENCE_GENOME,
                        constants.PARAM_TYPE.REFERENCE_SEQUENCE,
                        constants.PARAM_TYPE.REFERENCE_ANNOTATION,
                    ]}
                />
            </List>
        </DEDialog>
    );
}

export default ParamSelectionPalette;
