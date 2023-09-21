/**
 * Display search results for teams
 *
 * @author aramsey
 */

import React, { useEffect } from "react";

import Listing from "components/teams/Listing";
import { Paper, TableContainer } from "@mui/material";

export default function TeamSearchResults(props) {
    const { searchTerm, updateResultCount } = props;

    useEffect(() => {
        if (!searchTerm) {
            updateResultCount(0);
        }
    }, [searchTerm, updateResultCount]);

    return (
        <TableContainer component={Paper} style={{ overflow: "auto" }}>
            <Listing
                searchTerm={searchTerm}
                updateResultCount={updateResultCount}
            />
        </TableContainer>
    );
}
