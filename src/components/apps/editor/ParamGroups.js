/**
 * A form component for creating, editing, and deleting App groups.
 *
 * @author psarando
 */
import React from "react";

import { FieldArray, getIn } from "formik";

import { Trans, useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import Parameters from "./Parameters";
import ParamLayoutActions from "./ParamLayoutActions";

import ConfirmationDialog from "components/utils/ConfirmationDialog";

import buildID from "components/utils/DebugIDUtil";

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
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import { Add, ExpandMore } from "@mui/icons-material";

const useStyles = makeStyles(styles);

function ParamGroupForm(props) {
    const {
        baseId,
        cosmeticOnly,
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
                <Grid container justifyContent="space-between">
                    <Typography variant="subtitle2">{group.label}</Typography>
                    <ParamLayoutActions
                        baseId={groupBaseId}
                        cosmeticOnly={cosmeticOnly}
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
                    cosmeticOnly={cosmeticOnly}
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
    const {
        baseId,
        cosmeticOnly,
        values,
        keyCount,
        setKeyCount,
        scrollOnEdit,
        scrollToField,
        setScrollToField,
        setEditGroupField,
        setEditParamField,
    } = props;

    const [confirmDeleteIndex, setConfirmDeleteIndex] = React.useState(-1);
    const onCloseDeleteConfirm = () => setConfirmDeleteIndex(-1);

    const { t } = useTranslation(["app_editor", "app_editor_help", "common"]);

    const groups = getIn(values, "groups");

    return (
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
                        {!cosmeticOnly && (
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
                        )}
                    </Card>
                    {groups?.map((group, index) => (
                        <ParamGroupForm
                            key={group.key}
                            baseId={baseId}
                            cosmeticOnly={cosmeticOnly}
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
