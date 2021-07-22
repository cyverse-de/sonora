import React from "react";
import Autocomplete from "components/autocomplete/Autocomplete";

/**
 * @author aramsey
 */
export function AutocompleteTest(props) {
    const selectOptionLogger =
        props.selectOptionLogger ||
        ((selection) => {
            console.log(selection);
        });

    let placeholder = "Search for Fruit";

    let options = [
        {
            id: "1",
            value: "apples",
            display: "Apples - The Staple",
            description: "old apples",
        },
        {
            id: "2",
            value: "oranges",
            display: "Oranges - Meh",
            description: "old oranges",
        },
        {
            id: "3",
            value: "tangerines",
            display: "Tangerines - The Best",
            description: "old tangerines",
        },
        {
            id: "4",
            value: "kiwis",
            display: "Kiwis - The Fuzzy",
            description: "old kiwis",
        },
    ];

    return (
        <Autocomplete
            variant="creatable"
            placeholder={placeholder}
            labelKey="display"
            valueKey="value"
            onChange={selectOptionLogger}
            options={options}
        />
    );
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: "base/AutoComplete",
};
