/**
 * @author sriram
 *
 * A component for displaying public links for selected paths
 *
 */

import React, { useState } from "react";
import { useQuery } from "react-query";
import {
    PUBLIC_LINKS_QUERY_KEY,
    getPublicLinks,
} from "serviceFacades/filesystem";
import GridLoading from "../utils/GridLoading";
import { Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Toolbar } from "@material-ui/core";

import { Paper, TextField } from "@material-ui/core";

export default function PublicLinks(props) {
    const { paths } = props;
    const [links, setLinks] = useState();
    const { isFetching } = useQuery({
        queryKey: [PUBLIC_LINKS_QUERY_KEY, paths],
        queryFn: getPublicLinks,
        config: {
            enabled: paths && paths.length > 0,
            onSuccess: (resp) => {
                console.log("Response=>" + JSON.stringify(resp));
                const pathsWithLink = resp?.paths;
                let parsedLinks = "";
                paths.forEach((path) => {
                    parsedLinks = parsedLinks.concat(
                        `${pathsWithLink[path]}\n`
                    );
                });
                console.log("Links=>" + JSON.stringify(parsedLinks));
                setLinks(parsedLinks);
            },
            onError: (e) => {
                console.log(e);
            },
        },
    });

    if (isFetching) {
        return (
            <Paper>
                <GridLoading rows={paths?.length || 3} />
            </Paper>
        );
    } else {
        return (
            <Paper style={{ padding: 8 }}>
                <TextField
                    multiline
                    rows={paths?.length || 3}
                    value={links}
                    fullWidth
                    variant="outlined"
                />
                <Toolbar>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        style={{ flexGrow: 1, margin: 8 }}
                    >
                        Copy to clipboard
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        style={{ flexGrow: 1, margin: 8 }}
                    >
                        Save to file
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        style={{ flexGrow: 1, margin: 8 }}
                    >
                        Download as a file
                    </Button>
                </Toolbar>
                <Typography variant="caption">
                    Note: Anyone with access to a file's URL can access that
                    file.
                </Typography>
            </Paper>
        );
    }
}
