/**
 * @author psarando sriram
 */
import React from "react";
import { useTranslation } from "i18n";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

import FormTextField from "./FormTextField";

const FormSearchField = ({
    field: { value, onChange, ...field },
    options,
    size = "small",
    id,
    renderCustomOption,
    handleSearch,
    form: { setFieldValue, ...form },
    valueKey,
    labelKey,
    ...props
}) => {
    const [searchValue, setSearchValue] = React.useState(value);
    const filter = createFilterOptions();
    const { t } = useTranslation("common");

    React.useEffect(() => {
        const val = {};
        val[valueKey] = value;
        setSearchValue(val);
    }, [value, setSearchValue, valueKey]);

    const onOptionSelected = (event, newValue) => {
        if (newValue) {
            if (typeof newValue === "string") {
                setFieldValue(field.name, newValue);
            } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setFieldValue(field.name, newValue.inputValue);
            } else {
                setFieldValue(field.name, newValue[valueKey]);
            }
        } else {
            setFieldValue(field.name, "");
        }
    };

    return (
        <Autocomplete
            id={id}
            isOptionEqualToValue={(option, value) =>
                option[labelKey] === value[labelKey]
            }
            getOptionLabel={(option) => (option && option[labelKey]) || ""}
            options={options}
            size={size}
            freeSolo={true}
            selectOnFocus={true}
            value={searchValue}
            handleHomeEndKeys={true}
            onInputChange={handleSearch}
            onChange={onOptionSelected}
            renderOption={(props, option) => (
                <li {...props}>{renderCustomOption(option)}</li>
            )}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                // Suggest the creation of a new value
                if (params.inputValue !== "") {
                    filtered.push({
                        inputValue: params.inputValue,
                        label: t("formatTermFreeTextOption", {
                            inputValue,
                        }),
                    });
                }

                return filtered;
            }}
            renderInput={(params) => (
                <FormTextField
                    form={form}
                    field={field}
                    {...props}
                    {...params}
                />
            )}
        />
    );
};

export default FormSearchField;
