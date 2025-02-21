import React from "react";
import SearchField from "components/searchField/SearchField";
import FormControlLabel from "@mui/material/FormControlLabel";

export function SearchFieldTest(props) {
    const handleSearch =
        props.logger ||
        ((selection) => {
            console.log(selection);
        });

    return (
        <div>
            <FormControlLabel
                label="Type at least 3 characters, then wait a second"
                control={<SearchField handleSearch={handleSearch} />}
            />
        </div>
    );
}

export default {
    title: "base/SearchField",
};
