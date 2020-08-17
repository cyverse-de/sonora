import React from "react";

import { withKnobs, text } from "@storybook/addon-knobs";

import { useLocalStorage } from "../src/components/utils/localStorage";

export default {
    title: "Local Storage",
    decorators: [withKnobs],
};

export const TestHook = () => {
    const defaultValue = "Default Value";
    const knobValue = text("New Value", defaultValue);
    const [value, setValue] = useLocalStorage("test", defaultValue);
    React.useEffect(() => {
        setValue(knobValue);
    }, [knobValue, setValue]);
    return (
        <div>
            Default Value: "{defaultValue}" Current Value: "{value}"
        </div>
    );
};
