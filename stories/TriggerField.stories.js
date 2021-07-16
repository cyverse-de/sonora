import Button from "@material-ui/core/Button";
import React, { Component } from "react";

import TriggerField from "components/triggerField/TriggerField";

export class TriggerFieldTest extends Component {
    render() {
        const handleSearch =
            this.props.logger ||
            ((selection) => {
                console.log(selection);
            });

        return (
            <div>
                <label>Type at least 3 characters, then wait a second</label>
                <TriggerField handleSearch={handleSearch}>
                    <Button>Test Success!</Button>
                </TriggerField>
            </div>
        );
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: "TriggerField",
};
