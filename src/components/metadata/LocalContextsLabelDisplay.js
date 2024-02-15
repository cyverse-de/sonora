import React from "react";

import { useQuery } from "react-query";
import {
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";

import DEDialog from "components/utils/DEDialog";

import {
    LOCAL_CONTEXTS_QUERY_KEY,
    getLocalContextsProject,
} from "serviceFacades/metadata";

const sizeToSpacing = (size, theme) =>
    size === "large"
        ? theme.spacing(8)
        : size === "small"
        ? theme.spacing(3)
        : theme.spacing(5);

const LocalContextsLabel = ({ baseId, label, size = "medium" }) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const theme = useTheme();
    const labelURI = label.svg_url || label.img_url;

    return (
        <>
            <Tooltip title={label.name}>
                <IconButton color="primary" onClick={() => setDialogOpen(true)}>
                    <img
                        alt={label.name}
                        src={labelURI}
                        width={sizeToSpacing(size, theme)}
                    />
                </IconButton>
            </Tooltip>
            <DEDialog
                baseId={baseId}
                open={dialogOpen}
                title={label.name}
                onClose={() => setDialogOpen(false)}
            >
                <Card sx={{ display: "flex" }}>
                    <CardMedia
                        component="img"
                        title={label.name}
                        image={labelURI}
                        sx={{
                            width: theme.spacing(16),
                            height: theme.spacing(16),
                        }}
                    />
                    <CardContent>
                        <Typography sx={{ textWrap: "balance" }}>
                            {label.default_text}
                        </Typography>
                    </CardContent>
                </Card>
            </DEDialog>
        </>
    );
};

const LocalContextsLabelDisplay = ({ rightsURI, size = "medium" }) => {
    // Remove any trailing slash from the rightsURI
    // and take the final part of the path as the project ID.
    const projectID = rightsURI?.replace(/\/$/, "").split("/").at(-1);

    const { data: project } = useQuery({
        queryKey: [
            LOCAL_CONTEXTS_QUERY_KEY,
            projectID && {
                projectID,
            },
        ],
        queryFn: () =>
            getLocalContextsProject({
                projectID,
            }),
        enabled: !!projectID,
        onError: (error) => {
            console.log("Error fetching Local Contexts project.", {
                rightsURI,
                error,
            });
        },
    });

    const labels = [
        ...(project?.notice || []),
        ...(project?.bc_labels || []),
        ...(project?.tk_labels || []),
    ].filter((label) => label);

    return (
        <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2 }}
            useFlexGap
            flexWrap="wrap"
        >
            {labels.map((label) => (
                <LocalContextsLabel
                    key={label.unique_id || label.img_url}
                    baseId={label.unique_id || label.img_url}
                    size={size}
                    label={label}
                />
            ))}
        </Stack>
    );
};

export default LocalContextsLabelDisplay;
