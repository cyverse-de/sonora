/**
 * A form component for setting App parameter command line order.
 *
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import AppParamTypes from "components/models/AppParamTypes";

import { build as buildID, stableSort } from "@cyverse-de/ui-lib";

import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    makeStyles,
} from "@material-ui/core";

import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

const useStyles = makeStyles(styles);

const hasCmdLineOrder = (param) => {
    switch (param.type) {
        case AppParamTypes.INFO:
        case AppParamTypes.ENV_VAR:
            return false;

        case AppParamTypes.FILE_INPUT:
        case AppParamTypes.FOLDER_INPUT:
        case AppParamTypes.FOLDER_OUTPUT:
        case AppParamTypes.MULTIFILE_OUTPUT:
        case AppParamTypes.MULTIFILE_SELECTOR:
        case AppParamTypes.FILE_OUTPUT:
            return !param.file_parameters.is_implicit;

        default:
            return true;
    }
};

function formatCmdLinePreview(param) {
    let paramOption = param.name || `[${param.label}]`;
    let paramValue = param.defaultValue;

    switch (param.type) {
        case AppParamTypes.FLAG:
            if (param.defaultValue) {
                paramOption = param.name.checked.option;
                paramValue = param.name.checked.value;
            } else {
                paramOption = param.name.unchecked.option;
                paramValue = param.name.unchecked.value;
            }
            break;

        case AppParamTypes.TEXT_SELECTION:
        case AppParamTypes.INTEGER_SELECTION:
        case AppParamTypes.DOUBLE_SELECTION:
            if (param.defaultValue) {
                paramOption = param.defaultValue.name;
                paramValue = param.defaultValue.value;
            }
            break;

        case AppParamTypes.REFERENCE_GENOME:
        case AppParamTypes.REFERENCE_ANNOTATION:
        case AppParamTypes.REFERENCE_SEQUENCE:
            if (param.defaultValue) {
                paramValue = param.defaultValue.name;
            }
            break;

        default:
            break;
    }

    return [paramOption, paramValue].join(" ");
}

function ParamCmdLineOrderForm(props) {
    const { baseId, fieldName, cmdLinePreview, onMoveUp, onMoveDown } = props;

    const { t } = useTranslation("app_editor");
    const classes = useStyles();

    const paramBaseId = buildID(baseId, fieldName);

    return (
        <Card className={classes.paramCard}>
            <CardHeader
                title={cmdLinePreview}
                titleTypographyProps={{ variant: "body1" }}
                action={
                    <ButtonGroup color="primary" variant="text">
                        <Button
                            id={buildID(paramBaseId, ids.BUTTONS.MOVE_UP_BTN)}
                            aria-label={t("moveParameterUp")}
                            onClick={onMoveUp}
                        >
                            <ArrowUpward />
                        </Button>
                        <Button
                            id={buildID(paramBaseId, ids.BUTTONS.MOVE_DOWN_BTN)}
                            aria-label={t("moveParameterDown")}
                            onClick={onMoveDown}
                        >
                            <ArrowDownward />
                        </Button>
                    </ButtonGroup>
                }
            />
        </Card>
    );
}

function CmdLineOrderingGrid(props) {
    const { baseId, params, setFieldValue } = props;

    const onMoveUp = (index) => () => {
        if (index > 0) {
            params.forEach(({ param, fieldName }, paramIndex) => {
                if (paramIndex === index - 1) {
                    setFieldValue(fieldName, index);
                } else if (paramIndex === index) {
                    setFieldValue(fieldName, index - 1);
                } else if (param.order !== paramIndex) {
                    setFieldValue(fieldName, paramIndex);
                }
            });
        }
    };
    const onMoveDown = (index) => () => {
        if (index < params.length - 1) {
            params.forEach(({ param, fieldName }, paramIndex) => {
                if (paramIndex === index) {
                    setFieldValue(fieldName, index + 1);
                } else if (paramIndex === index + 1) {
                    setFieldValue(fieldName, index);
                } else if (param.order !== paramIndex) {
                    setFieldValue(fieldName, paramIndex);
                }
            });
        }
    };

    return params.map(({ param, fieldName }, index) => (
        <ParamCmdLineOrderForm
            key={fieldName}
            fieldName={fieldName}
            baseId={baseId}
            cmdLinePreview={formatCmdLinePreview(param)}
            onMoveUp={onMoveUp(index)}
            onMoveDown={onMoveDown(index)}
        />
    ));
}

function CmdLineOrderForm(props) {
    const { baseId, groups, setFieldValue } = props;

    const [sortedParams, setSortedParams] = React.useState([]);

    React.useEffect(() => {
        const unsortedParams = groups?.reduce((params, group, groupIndex) => {
            const parametersFieldName = `groups.${groupIndex}.parameters`;

            return [
                ...params,
                ...group.parameters
                    ?.map((param, index) => ({
                        param,
                        fieldName: `${parametersFieldName}.${index}.order`,
                    }))
                    .filter((paramMap) => hasCmdLineOrder(paramMap.param)),
            ];
        }, []);

        setSortedParams(
            stableSort(unsortedParams, (a, b) => a.param.order - b.param.order)
        );
    }, [groups]);

    return (
        <CmdLineOrderingGrid
            baseId={baseId}
            setFieldValue={setFieldValue}
            params={sortedParams}
        />
    );
}

export default CmdLineOrderForm;
