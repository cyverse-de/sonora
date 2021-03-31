/**
 * A form component for creating, editing, and deleting App groups.
 *
 * @author psarando
 */
import React from "react";

import { FieldArray, getIn } from "formik";
import { Trans } from "react-i18next";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import GroupPropertyForm from "./GroupPropertyForm";
import Parameters from "./Parameters";
import ParamLayoutActions from "./ParamLayoutActions";
import ParamPropertyForm from "./ParamPropertyForm";

import ConfirmationDialog from "components/utils/ConfirmationDialog";

import { build as buildID } from "@cyverse-de/ui-lib";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
    makeStyles,
} from "@material-ui/core";

import { Add, ExpandMore } from "@material-ui/icons";

const useStyles = makeStyles(styles);

function ParamGroupForm(props) {
    const {
        baseId,
        fieldName,
        group,
        onDelete,
        onEdit,
        onMoveDown,
        onMoveUp,
        onEditParam,
        keyCount,
        setKeyCount,
        scrollToField,
        setScrollToField,
    } = props;

    const groupEl = React.useRef();
    React.useEffect(() => {
        if (groupEl && scrollToField === fieldName) {
            groupEl.current.scrollIntoView();
            setScrollToField(null);
        }
    }, [fieldName, groupEl, scrollToField, setScrollToField]);

    const classes = useStyles();

    const groupBaseId = buildID(baseId, fieldName);

    return (
        <Accordion ref={groupEl} defaultExpanded>
            <AccordionSummary
                className={classes.paramsViewSummary}
                expandIcon={
                    <ExpandMore className={classes.paramsViewsExpandIcon} />
                }
            >
                <Grid container justify="space-between">
                    <Typography variant="subtitle2">{group.label}</Typography>
                    <ParamLayoutActions
                        baseId={groupBaseId}
                        ButtonProps={{
                            color: "primary",
                            variant: "contained",
                            onFocus: (event) => event.stopPropagation(),
                            onClick: (event) => event.stopPropagation(),
                        }}
                        DotMenuButtonProps={{ color: "inherit" }}
                        onMoveUp={onMoveUp}
                        onMoveDown={onMoveDown}
                        onEdit={() => onEdit(fieldName)}
                        onDelete={onDelete}
                    />
                </Grid>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
                <Parameters
                    baseId={baseId}
                    groupFieldName={fieldName}
                    parameters={group.parameters}
                    onEditParam={onEditParam}
                    keyCount={keyCount}
                    setKeyCount={setKeyCount}
                    scrollToField={scrollToField}
                    setScrollToField={setScrollToField}
                />
            </AccordionDetails>
        </Accordion>
    );
}

function ParamGroups(props) {
    const { baseId, values, keyCount, setKeyCount, scrollOnEdit } = props;

    const [confirmDeleteIndex, setConfirmDeleteIndex] = React.useState(-1);
    const onCloseDeleteConfirm = () => setConfirmDeleteIndex(-1);

    const [editGroupField, setEditGroupField] = React.useState();
    const [editParamField, setEditParamField] = React.useState();
    const [scrollToField, setScrollToField] = React.useState();

    const { t } = useTranslation(["app_editor", "app_editor_help", "common"]);

    const groups = getIn(values, "groups");

    return editGroupField ? (
        <GroupPropertyForm
            baseId={baseId}
            fieldName={editGroupField}
            onDone={() => {
                setScrollToField(editGroupField);
                setEditGroupField(null);
            }}
        />
    ) : editParamField ? (
        <ParamPropertyForm
            baseId={buildID(baseId, ids.PROPERTY_EDITOR)}
            onClose={() => {
                setScrollToField(editParamField);
                setEditParamField(null);
            }}
            fieldName={editParamField}
            values={values}
        />
    ) : (
        <FieldArray
            name="groups"
            render={(arrayHelpers) => (
                <>
                    <Card>
                        <CardContent>
                            <Typography component="div">
                                <Trans
                                    t={t}
                                    i18nKey="app_editor_help:Section"
                                    components={{
                                        b: <b />,
                                        p: <p />,
                                    }}
                                />
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                id={buildID(baseId, ids.BUTTONS.ADD_GROUP)}
                                color="primary"
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => {
                                    arrayHelpers.unshift({
                                        key: keyCount,
                                        label: t("newSectionLabel"),
                                        isVisible: true,
                                        parameters: [],
                                    });
                                    setKeyCount(keyCount + 1);
                                }}
                            >
                                {t("addSection")}
                            </Button>
                        </CardActions>
                    </Card>
                    {groups?.map((group, index) => (
                        <ParamGroupForm
                            key={group.key}
                            baseId={baseId}
                            fieldName={`groups.${index}`}
                            group={group}
                            keyCount={keyCount}
                            setKeyCount={setKeyCount}
                            scrollToField={scrollToField}
                            setScrollToField={setScrollToField}
                            onEditParam={(fieldName) => {
                                scrollOnEdit();
                                setEditParamField(fieldName);
                            }}
                            onEdit={(fieldName) => {
                                scrollOnEdit();
                                setEditGroupField(fieldName);
                            }}
                            onDelete={() => setConfirmDeleteIndex(index)}
                            onMoveUp={() => {
                                if (index > 0) {
                                    arrayHelpers.move(index, index - 1);
                                }
                            }}
                            onMoveDown={() => {
                                if (index < groups.length - 1) {
                                    arrayHelpers.move(index, index + 1);
                                }
                            }}
                        />
                    ))}
                    <ConfirmationDialog
                        baseId={ids.DELETE_CONFIRM_DIALOG}
                        open={confirmDeleteIndex >= 0}
                        onClose={onCloseDeleteConfirm}
                        onConfirm={() => {
                            arrayHelpers.remove(confirmDeleteIndex);
                            onCloseDeleteConfirm();
                        }}
                        confirmButtonText={t("common:delete")}
                        title={t("confirmDeleteGroupTitle")}
                        contentText={t("confirmDeleteGroupText")}
                    />
                </>
            )}
        />
    );
}

export default ParamGroups;
