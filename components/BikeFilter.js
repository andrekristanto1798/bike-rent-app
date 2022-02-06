import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterAlt";
import useEnumTypes from "@/hooks/useEnumTypes";

function BikeFilter() {
  const { query, replace } = useRouter();
  const {
    model: queryModel,
    location: queryLocation,
    color: queryColor,
  } = query;
  const { models, stores, colors } = useEnumTypes();
  const changeQuery = (params) => {
    replace({ query: { ...query, ...params } });
  };
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography>Model</Typography>
      <ToggleButtonGroup
        exclusive
        orientation="vertical"
        value={queryModel}
        onChange={(_, value) => {
          changeQuery({ model: value });
        }}
        aria-label="model"
      >
        {models.map(({ name: model }) => {
          return (
            <ToggleButton key={model} value={model} aria-label={model}>
              {model}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      <Typography>Location</Typography>
      <ToggleButtonGroup
        exclusive
        orientation="vertical"
        value={queryLocation}
        onChange={(_, value) => {
          changeQuery({ location: value });
        }}
        aria-label="location"
      >
        {stores.map(({ name: store }) => {
          return (
            <ToggleButton key={store} value={store} aria-label={store}>
              {store}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      <Typography>Color</Typography>
      <ToggleButtonGroup
        exclusive
        orientation="vertical"
        value={queryColor}
        onChange={(_, value) => {
          changeQuery({ color: value });
        }}
        aria-label="color"
      >
        {colors.map((color) => {
          return (
            <ToggleButton key={color} value={color} aria-label={color}>
              <Box sx={{ width: 16, height: 16, background: color }} />
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
}

export const BikeFilterPopover = ({ trigger }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {React.cloneElement(trigger, { onClick: handleOpen })}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2 }}>
          <BikeFilter />
        </Box>
      </Popover>
    </>
  );
};

BikeFilterPopover.defaultProps = {
  trigger: (
    <Button type="text" sx={{ color: "white" }}>
      <FilterIcon />
    </Button>
  ),
};

export default BikeFilter;
