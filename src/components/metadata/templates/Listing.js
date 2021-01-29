/**
 * @author psarando
 */
import React from "react";
import { useQuery } from "react-query";

import { useTranslation } from "i18n";
import constants from "../../../constants";

import ids from "../ids";

import SlideUpTransition from "../SlideUpTransition";

import DEDialog from "components/utils/DEDialog";
import { getHost } from "components/utils/getHost";
import TableLoading from "components/utils/TableLoading";
import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";

import {
    FILESYSTEM_METADATA_TEMPLATE_LISTING_QUERY_KEY,
    getFilesystemMetadataTemplateListing,
} from "serviceFacades/metadata";

import {
    build,
    EnhancedTableHead,
    getSorting,
    stableSort,
} from "@cyverse-de/ui-lib";

import {
    ButtonGroup,
    Button,
    Paper,
    Popover,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
    makeStyles,
} from "@material-ui/core";

import { CloudDownload, Info } from "@material-ui/icons";

const getColumnData = (t) => [
    {
        id: build(ids.COL_HEADER, ids.METADATA_TEMPLATE_VIEW),
        key: "name",
        name: t("templateNameLabel"),
        enableSorting: true,
    },
    {
        id: build(ids.COL_HEADER, ids.COL_ACTIONS),
        key: "actions",
        enableSorting: false,
        padding: "none",
    },
];

const useStyles = makeStyles((theme) => ({
    templateInfo: {
        padding: theme.spacing(2),
    },
}));

const TemplateInfoDisplay = (props) => {
    const { templateInfo, anchorEl, onClose } = props;

    const classes = useStyles();

    return (
        <Popover
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "center",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "right",
            }}
        >
            <Typography className={classes.templateInfo}>
                {templateInfo}
            </Typography>
        </Popover>
    );
};

const TemplateTableRow = (props) => {
    const { baseId, template, selected, onClick, onInfo, onDownload } = props;

    const { t } = useTranslation("metadata");

    return (
        <TableRow hover selected={selected} onClick={onClick}>
            <TableCell component="th" scope="row">
                {template.name}
            </TableCell>
            <TableCell align="right">
                <ButtonGroup variant="text">
                    {template.description && (
                        <Button
                            id={build(baseId, ids.BUTTONS.INFO)}
                            aria-label={t("templateDescription")}
                            onClick={onInfo}
                        >
                            <Info />
                        </Button>
                    )}
                    <Button
                        id={build(baseId, ids.BUTTONS.DOWNLOAD)}
                        aria-label={t("downloadTemplate")}
                        onClick={onDownload}
                    >
                        <CloudDownload />
                    </Button>
                </ButtonGroup>
            </TableCell>
        </TableRow>
    );
};

const MetadataTemplateListing = (props) => {
    const { baseId, open, onClose, onSelectTemplate } = props;

    const { t } = useTranslation(["metadata", "common"]);

    const [templates, setTemplates] = React.useState(null);
    const [selectedTemplateId, setSelectedTemplateId] = React.useState(null);
    const [orderBy, setOrderBy] = React.useState(null);
    const [order, setOrder] = React.useState(constants.SORT_ASCENDING);
    const [templateInfoAnchor, setTemplateInfoAnchor] = React.useState(null);
    const [templateInfo, setTemplateInfo] = React.useState(null);
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
        config: {
            enabled: true,
            onSuccess: ({ metadata_templates }) =>
                setTemplates(metadata_templates),
        },
    });

    const handleRequestSort = (event, property) => {
        let newOrder = constants.SORT_ASCENDING;

        if (orderBy === property && order === newOrder) {
            newOrder = constants.SORT_DESCENDING;
        }

        setOrder(newOrder);
        setOrderBy(property);
    };

    const dialogID = build(baseId, ids.DIALOG, ids.METADATA_TEMPLATE_LISTING);
    const tableID = build(dialogID, ids.METADATA_TEMPLATE_LISTING);

    if (fetchError) {
        return (
            <WrappedErrorHandler errorObject={fetchError} baseId={tableID} />
        );
    }

    // Only sort the Templates if sorting has been requested.
    const sortedTemplates = orderBy
        ? stableSort(templates, getSorting(order, orderBy))
        : templates;

    const columnData = getColumnData(t);

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
                    id={build(dialogID, ids.BUTTONS.DONE)}
                    variant="outlined"
                    onClick={onClose}
                >
                    {t("common:cancel")}
                </Button>,
                <Button
                    key={ids.BUTTONS.CONFIRM}
                    id={build(dialogID, ids.BUTTONS.CONFIRM)}
                    color="primary"
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
            <TableContainer component={Paper}>
                <Table>
                    {isFetching ? (
                        <TableLoading
                            baseId={tableID}
                            numColumns={columnData?.length}
                            numRows={5}
                        />
                    ) : (
                        <TableBody>
                            {sortedTemplates?.map((template) => (
                                <TemplateTableRow
                                    key={template.id}
                                    baseId={build(tableID, template.id)}
                                    template={template}
                                    selected={
                                        selectedTemplateId === template.id
                                    }
                                    onClick={() =>
                                        setSelectedTemplateId(template.id)
                                    }
                                    onInfo={(event) => {
                                        if (template.description) {
                                            setTemplateInfo(
                                                template.description
                                            );
                                            setTemplateInfoAnchor(
                                                event.currentTarget
                                            );
                                        }
                                    }}
                                    onDownload={() =>
                                        setDownloadTemplateId(template.id)
                                    }
                                />
                            ))}
                        </TableBody>
                    )}
                    <EnhancedTableHead
                        baseId={tableID}
                        columnData={columnData}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                </Table>
            </TableContainer>
            <TemplateInfoDisplay
                templateInfo={templateInfo}
                anchorEl={templateInfoAnchor}
                onClose={() => setTemplateInfoAnchor(null)}
            />
        </DEDialog>
    );
};

export default MetadataTemplateListing;
