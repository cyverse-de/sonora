import Button from "@material-ui/core/Button";
import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TriggerField from "components/triggerField/TriggerField";

export function TriggerFieldTest(props) {

    const handleSearch =
        props.logger ||
        ((selection) => {
            console.log(selection);
        });

    return (
        <div>
            <FormControlLabel
                label="Type at least 3 characters, then wait a second"
                control={
                    <TriggerField handleSearch={handleSearch}>
                        <Button>Test Success!</Button>
                    </TriggerField>
                }
            />
        </div>
    );

}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: "lib/TriggerField",
};
