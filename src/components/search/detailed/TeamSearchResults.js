/**
 * Display search results for teams
 *
 * @author aramsey
 */

import React from "react";

import Listing from "components/teams/Listing";
import { Paper, TableContainer } from "@material-ui/core";

export default function TeamSearchResults(props) {
    const { searchTerm, updateResultCount } = props;

    return (
        <TableContainer component={Paper} style={{ overflow: "auto" }}>
            <Listing
                searchTerm={searchTerm}
                updateResultCount={updateResultCount}
            />
        </TableContainer>
    );
}
