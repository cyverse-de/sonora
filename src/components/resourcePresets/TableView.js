import React, { useState } from "react";
import { useTranslation } from "i18n";
import numeral from "numeral";

import ids from "./ids";

import buildID from "components/utils/DebugIDUtil";
import TableLoading from "components/table/TableLoading";
import EmptyTable from "components/table/EmptyTable";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import PageWrapper from "components/layout/PageWrapper";

import {
    Button,
    Chip,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
} from "@mui/material";

import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    MoreVert as MoreVertIcon,
    Star as StarIcon,
} from "@mui/icons-material";

const formatMemory = (bytes) => {
    if (bytes == null) return "—";
    return numeral(bytes).format("0.0 ib");
};

const formatTimeLimit = (seconds) => {
    if (seconds == null) return "—";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
};

function PresetDotMenu({ baseId, preset, onEdit, onDelete, onSetDefault }) {
    const { t } = useTranslation("resourcePresets");
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                id={buildID(baseId, ids.DOT_MENU)}
                size="small"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() => {
                        handleClose();
                        onEdit(preset);
                    }}
                >
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t("editPreset")}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        onSetDefault(preset);
                    }}
                >
                    <ListItemIcon>
                        <StarIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t("setAsDefault")}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        onDelete(preset);
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t("deletePreset")}</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}

function TableView({
    baseId,
    presets,
    loading,
    error,
    onAddPreset,
    onEdit,
    onDelete,
    onSetDefault,
}) {
    const { t } = useTranslation("resourcePresets");
    const tableId = buildID(baseId, ids.TABLE);

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={tableId} />;
    }

    return (
        <PageWrapper appBarHeight={280}>
            <Toolbar>
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={onAddPreset}
                >
                    {t("addPreset")}
                </Button>
            </Toolbar>
            <TableContainer component={Paper} sx={{ overflow: "auto" }}>
                <Table
                    id={tableId}
                    stickyHeader
                    size="small"
                    aria-label={t("resourcePresets")}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("label")}</TableCell>
                            <TableCell>{t("cpuCores")}</TableCell>
                            <TableCell>{t("memory")}</TableCell>
                            <TableCell>{t("gpus")}</TableCell>
                            <TableCell>{t("timeLimit")}</TableCell>
                            <TableCell>{t("enabled")}</TableCell>
                            <TableCell>{t("default")}</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    {loading ? (
                        <TableLoading
                            numColumns={8}
                            numRows={5}
                            baseId={tableId}
                        />
                    ) : (
                        <TableBody>
                            {presets.length === 0 ? (
                                <EmptyTable
                                    message={t("noPresets")}
                                    numColumns={8}
                                />
                            ) : (
                                presets.map((preset) => (
                                    <TableRow key={preset.id}>
                                        <TableCell>
                                            <Typography>
                                                {preset.label}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {preset.max_cpu_cores}
                                        </TableCell>
                                        <TableCell>
                                            {formatMemory(
                                                preset.min_memory_limit
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {preset.max_gpus || 0}
                                        </TableCell>
                                        <TableCell>
                                            {formatTimeLimit(
                                                preset.time_limit_seconds
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={
                                                    preset.is_enabled
                                                        ? t("enabled")
                                                        : t("disabled")
                                                }
                                                color={
                                                    preset.is_enabled
                                                        ? "success"
                                                        : "default"
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {preset.is_default && (
                                                <StarIcon
                                                    color="primary"
                                                    fontSize="small"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <PresetDotMenu
                                                baseId={buildID(
                                                    tableId,
                                                    preset.id
                                                )}
                                                preset={preset}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                onSetDefault={onSetDefault}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
        </PageWrapper>
    );
}

export default TableView;
