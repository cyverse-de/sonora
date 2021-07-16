/**
 * @author psarando
 */

import React, { Component } from "react";
import CopyTextArea from "components/copy/CopyTextArea";

export class CopyTextAreaTest extends Component {
    render() {
        let textToCopy = `The Dark Arts better be worried,
oh boy!`;

        return (
            <CopyTextArea
                debugIdPrefix="test.id.prefix"
                btnText="Copy"
                copiedBtnText="Copied!"
                multiline={true}
                text={textToCopy}
            />
        );
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: "CopyTextArea",
};
