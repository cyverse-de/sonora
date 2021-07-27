/**
 * @author psarando sriram
 */
import React from "react";
import { useTranslation } from "i18n";

import Autocomplete, {
    createFilterOptions,
} from "@material-ui/lab/Autocomplete";

import FormTextField from "./FormTextField";

const FormSearchField = ({
    field: { value, onChange, ...field },
    label,
    helperText,
    required,
    options,
    size = "small",
    renderCustomOption,
    handleSearch,
    form: { setFieldValue, ...form },
    ...props
}) => {
    const [searchValue, setSearchValue] = React.useState(value);
    const filter = createFilterOptions();
    const { t } = useTranslation("common");

    React.useEffect(() => {
        const val = {};
        val[props.labelKey] = value;
        setSearchValue(val);
    }, [value, setSearchValue, props.labelKey]);

    const onOptionSelected = (event, newValue) => {
        if (newValue) {
            if (typeof newValue === "string") {
                setFieldValue(field.name, newValue);
            } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setFieldValue(field.name, newValue.inputValue);
            } else {
                setFieldValue(field.name, newValue[props.valueKey]);
            }
        } else {
            setFieldValue(field.name, "");
        }
    };

    return (
        <Autocomplete
            id="searchField"
            getOptionSelected={(option, value) =>
                option[props.labelKey] === value[props.labelKey]
            }
            getOptionLabel={(option) => (option ? option[props.labelKey] : "")}
            options={options}
            size={size}
            freeSolo={true}
            selectOnFocus={true}
            value={searchValue}
            blurOnSelect={true}
            handleHomeEndKeys={true}
            onInputChange={handleSearch}
            onChange={onOptionSelected}
            renderOption={(option, state) => renderCustomOption(option)}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                // Suggest the creation of a new value
                if (params.inputValue !== "") {
                    filtered.push({
                        inputValue: params.inputValue,
                        label: t("formatTermFreeTextOption", {
                            inputValue: params.inputValue,
                        }),
                    });
                }

                return filtered;
            }}
            renderInput={(params) => (
                <FormTextField
                    label={label}
                    variant="outlined"
                    form={form}
                    field={field}
                    helperText={helperText}
                    required={required}
                    {...props}
                    {...params}
                />
            )}
        />
    );
};

export default FormSearchField;
