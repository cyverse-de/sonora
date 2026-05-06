/**
 * VICE Admin — Operators tab.
 *
 * Lists registered VICE operators sorted by priority (ascending — lower value
 * means higher position in the list), and allows the admin to register new
 * operators or edit existing ones. Backed by terrain's
 * `/api/admin/vice/operators` endpoints (terrain PR #323).
 *
 * @author your-name
 */
import React, { useMemo, useState } from "react";

import { useTranslation } from "i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    IconButton,
    InputAdornment,
    Link,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";

import {
    VICE_OPERATORS_QUERY_KEY,
    getOperators,
    createOperator,
    updateOperator,
} from "serviceFacades/vice/admin";

import { BASE_ID } from "../constants";

import OperatorEditor from "./OperatorEditor";
import { id } from "./functions";
import ids from "./ids";

const useStyles = makeStyles()((theme) => ({
    root: {
        marginBottom: theme.spacing(4),
        width: "100%",
    },
    toolbar: {
        display: "flex",
        flexWrap: "wrap",
        gap: theme.spacing(1.5),
        alignItems: "center",
        marginBottom: theme.spacing(2),
    },
    search: {
        flex: 1,
        minWidth: 280,
        maxWidth: 480,
    },
    toolbarSpacer: { flex: 1 },
    priorityPill: {
        fontFamily: "Roboto Mono, monospace",
        fontWeight: 600,
        minWidth: 44,
        justifyContent: "center",
    },
    urlCell: {
        fontFamily: "Roboto Mono, monospace",
        fontSize: "0.8125rem",
        wordBreak: "break-all",
    },
    urlLink: {
        display: "inline-flex",
        alignItems: "center",
        gap: theme.spacing(0.5),
        color: theme.palette.text.primary,
        "&:hover": { color: theme.palette.primary.main },
    },
    urlIcon: { fontSize: 14, opacity: 0.6 },
    rowActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(0.5),
    },
    empty: {
        padding: theme.spacing(6, 2),
        textAlign: "center",
    },
    emptyIcon: {
        color: theme.palette.action.disabled,
        fontSize: 56,
        marginBottom: theme.spacing(1),
    },
    tableFoot: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(1, 2),
        backgroundColor: theme.palette.background.default,
        borderTop: `1px solid ${theme.palette.divider}`,
        fontSize: 12,
        color: theme.palette.text.secondary,
    },
}));

const Operators = ({ showErrorAnnouncer }) => {
    const { classes } = useStyles();
    const { t } = useTranslation("vice-admin");
    const queryClient = useQueryClient();

    const [query, setQuery] = useState("");
    const [editor, setEditor] = useState({
        open: false,
        mode: "add",
        initial: null,
    });

    const {
        data: operators = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery([VICE_OPERATORS_QUERY_KEY], getOperators);

    const invalidate = () =>
        queryClient.invalidateQueries([VICE_OPERATORS_QUERY_KEY]);

    const { mutate: addOperator, isLoading: adding } = useMutation(
        createOperator,
        {
            onSuccess: () => {
                invalidate();
                setEditor({ open: false, mode: "add", initial: null });
            },
            onError: (e) => {
                showErrorAnnouncer(t("operatorCreateError", { error: e }), e);
            },
        }
    );

    const { mutate: editOperator, isLoading: editing } = useMutation(
        updateOperator,
        {
            onSuccess: () => {
                invalidate();
                setEditor({ open: false, mode: "add", initial: null });
            },
            onError: (e) => {
                showErrorAnnouncer(t("operatorUpdateError", { error: e }), e);
            },
        }
    );

    const sorted = useMemo(
        () => [...operators].sort((a, b) => a.priority - b.priority),
        [operators]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return sorted;
        return sorted.filter(
            (o) =>
                o.name.toLowerCase().includes(q) ||
                (o.url || "").toLowerCase().includes(q)
        );
    }, [sorted, query]);

    const openNew = () => setEditor({ open: true, mode: "add", initial: null });
    const openEdit = (op) =>
        setEditor({ open: true, mode: "edit", initial: op });
    const closeEditor = () =>
        setEditor({ open: false, mode: "add", initial: null });

    const handleSave = (draft) => {
        if (editor.mode === "edit") {
            editOperator({ id: editor.initial.id, ...draft });
        } else {
            addOperator(draft);
        }
    };

    return (
        <Card id={id(ids.LISTING)} className={classes.root}>
            <CardHeader
                title={t("operators")}
                titleTypographyProps={{ variant: "h6" }}
                action={
                    <Stack direction="row" spacing={1} sx={{ pr: 1, pt: 1 }}>
                        <Tooltip title={t("refresh")}>
                            <IconButton
                                id={id(ids.REFRESH_BUTTON)}
                                onClick={() => refetch()}
                                size="small"
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Button
                            id={id(ids.NEW_BUTTON)}
                            onClick={openNew}
                            startIcon={<AddIcon />}
                            variant="contained"
                            color="primary"
                            size="small"
                        >
                            {t("new")}
                        </Button>
                    </Stack>
                }
            />
            <CardContent>
                <Box id={id(ids.TOOLBAR)} className={classes.toolbar}>
                    <TextField
                        id={id(ids.SEARCH)}
                        variant="outlined"
                        size="small"
                        placeholder={t("operatorsSearchPlaceholder")}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={classes.search}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: query ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setQuery("")}
                                        aria-label={t("clear")}
                                    >
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        }}
                    />
                </Box>

                {isError ? (
                    <WrappedErrorHandler errorObject={error} baseId={BASE_ID} />
                ) : isLoading ? (
                    <Stack spacing={1}>
                        <Skeleton variant="rectangular" height={48} />
                        <Skeleton variant="rectangular" height={48} />
                        <Skeleton variant="rectangular" height={48} />
                    </Stack>
                ) : (
                    <TableContainer>
                        <Table id={id(ids.TABLE)} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "10%" }}>
                                        {t("operatorPriority")}
                                    </TableCell>
                                    <TableCell sx={{ width: "26%" }}>
                                        {t("operatorName")}
                                    </TableCell>
                                    <TableCell sx={{ width: "40%" }}>
                                        {t("operatorUrl")}
                                    </TableCell>
                                    <TableCell sx={{ width: "16%" }}>
                                        {t("operatorTls")}
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: "8%" }}
                                        align="right"
                                    >
                                        {t("actions")}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className={classes.empty}
                                        >
                                            <Typography variant="subtitle1">
                                                {operators.length === 0
                                                    ? t("operatorsEmptyTitle")
                                                    : t("operatorsNoMatch")}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {operators.length === 0
                                                    ? t("operatorsEmptyHint")
                                                    : t("operatorsNoMatchHint")}
                                            </Typography>
                                            {operators.length === 0 && (
                                                <Button
                                                    sx={{ mt: 2 }}
                                                    onClick={openNew}
                                                    startIcon={<AddIcon />}
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    {t("new")}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {filtered.map((op) => (
                                    <TableRow
                                        hover
                                        key={op.id}
                                        id={id(ids.ROW, op.id)}
                                    >
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={op.priority}
                                                className={classes.priorityPill}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                            >
                                                {op.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell className={classes.urlCell}>
                                            <Link
                                                href={op.url}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                underline="hover"
                                                className={classes.urlLink}
                                            >
                                                <span>{op.url}</span>
                                                <OpenInNewIcon
                                                    className={classes.urlIcon}
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {op.skipTlsVerify ? (
                                                <Chip
                                                    size="small"
                                                    icon={<GppMaybeIcon />}
                                                    label={t("operatorTlsSkip")}
                                                    color="warning"
                                                    variant="outlined"
                                                />
                                            ) : (
                                                <Chip
                                                    size="small"
                                                    icon={<VerifiedUserIcon />}
                                                    label={t(
                                                        "operatorTlsVerified"
                                                    )}
                                                    color="success"
                                                    variant="outlined"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Box className={classes.rowActions}>
                                                <Tooltip title={t("edit")}>
                                                    <IconButton
                                                        id={id(
                                                            ids.EDIT_BUTTON,
                                                            op.id
                                                        )}
                                                        size="small"
                                                        onClick={() =>
                                                            openEdit(op)
                                                        }
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filtered.length > 0 && (
                            <Box className={classes.tableFoot}>
                                <span>
                                    {t("operatorsCount", {
                                        shown: filtered.length,
                                        total: operators.length,
                                    })}
                                </span>
                                <span>{t("operatorsPriorityHint")}</span>
                            </Box>
                        )}
                    </TableContainer>
                )}
            </CardContent>

            <OperatorEditor
                open={editor.open}
                mode={editor.mode}
                initial={editor.initial}
                allOperators={operators}
                saving={adding || editing}
                onCancel={closeEditor}
                onSave={handleSave}
            />
        </Card>
    );
};

export default withErrorAnnouncer(Operators);
