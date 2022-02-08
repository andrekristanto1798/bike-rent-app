import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Popover,
  Rating,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterAlt";
import { useSnackbar } from "notistack";
import useEnumTypes from "@/hooks/useEnumTypes";
import useIsMobile from "@/hooks/useIsMobile";

function BikeFilter() {
  const { enqueueSnackbar } = useSnackbar();
  const { query, replace } = useRouter();
  const {
    model: queryModel,
    location: queryLocation,
    color: queryColor,
    minRating: queryMinRating,
    maxRating: queryMaxRating,
  } = query;
  const { models, stores, colors } = useEnumTypes();
  const changeQuery = (params) => {
    // remove undefined value
    const nextQuery = JSON.parse(JSON.stringify({ ...query, ...params }));
    replace({ query: nextQuery });
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
      <Typography>
        Ratings
        <Button
          sx={{ ml: 1 }}
          type="text"
          onClick={() => {
            changeQuery({ minRating: undefined, maxRating: undefined });
          }}
        >
          Clear Ratings
        </Button>
      </Typography>
      <Box display="flex" flexDirection="row" gap={2}>
        <Rating
          name="min-bike-rating"
          value={queryMinRating || 0}
          onChange={(_, value) => {
            if (queryMaxRating && value > queryMaxRating) {
              enqueueSnackbar("Please select value lower than the max rating", {
                key: "min-rating-error",
                variant: "warning",
              });
              return;
            }
            changeQuery({ minRating: value });
          }}
        />
        -
        <Rating
          name="max-bike-rating"
          value={queryMaxRating || 0}
          onChange={(_, value) => {
            if (queryMinRating && value < queryMinRating) {
              enqueueSnackbar(
                "Please select value bigger than the min rating",
                { key: "max-rating-error", variant: "warning" }
              );
              return;
            }
            changeQuery({ maxRating: value });
          }}
        />
      </Box>
    </Box>
  );
}

const mobileStyle = {
  position: "fixed",
  background: "white",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: "auto",
};

export const BikeFilterPopover = ({ trigger }) => {
  const isMobile = useIsMobile();
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
        <Box sx={{ p: 2, ...(isMobile && mobileStyle) }}>
          <BikeFilter />
          {isMobile && (
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              fullWidth
              onClick={handleClose}
            >
              Close
            </Button>
          )}
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
