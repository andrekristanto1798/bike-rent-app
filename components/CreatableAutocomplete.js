import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

export default function CreateableAutocomplete({
  value,
  onChange,
  options,
  label,
  ...restProps
}) {
  return (
    <Autocomplete
      {...restProps}
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          onChange({ value: newValue });
        } else if (newValue._add) {
          onChange({
            label: newValue.value,
            value: newValue.value,
          });
        } else {
          onChange(newValue);
        }
      }}
      filterOptions={(list, params) => {
        const filtered = filter(list, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = list.some((option) => inputValue === option.label);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            _add: true,
            label: `Add "${inputValue}"`,
            value: inputValue,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        if (option._add) {
          return option.value;
        }
        // Regular option
        return option.label;
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
