import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CreateableAutocomplete from "./CreatableAutocomplete";
import { Checkbox, FormControlLabel } from "@mui/material";
import useEnumTypes from "@/hooks/useEnumTypes";

const baseProps = {
  margin: "dense",
  variant: "standard",
};

const defaultBikeForm = {
  model: null,
  location: null,
  color: "#000000",
  isAvailable: true,
};

const toOption = ({ name }) => ({ label: name, value: name });

function TriggerBikeModal({ onSubmit, initialValues, editMode, children }) {
  const [bikeForm, setBikeForm] = useState(defaultBikeForm);
  const [open, setOpen] = useState(false);
  const { models, stores } = useEnumTypes();
  const { model, location, color, isAvailable } = bikeForm;

  const handleChange = (nextProp) => {
    setBikeForm((d) => ({ ...d, ...nextProp }));
  };

  const handleClickOpen = () => {
    const form = initialValues || defaultBikeForm;
    setBikeForm({
      model: form.model ? { value: form.model, label: form.model } : null,
      location: form.location
        ? { value: form.location, label: form.location }
        : null,
      color: form.color,
      isAvailable: form.isAvailable,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isValid = model && model.value && location && location.value && color;

  return (
    <>
      <span role="presentation" onClick={handleClickOpen}>
        {children}
      </span>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? "Edit bike" : "Add new bike"}</DialogTitle>
        <DialogContent sx={{ "> *": { my: 2 } }}>
          <CreateableAutocomplete
            autoFocus
            id="bike-model"
            label="Bike Model"
            options={models.map(toOption)}
            value={model}
            onChange={(nextValue) => handleChange({ model: nextValue })}
            {...baseProps}
          />
          <CreateableAutocomplete
            autoFocus
            id="bike-location"
            label="Bike Location"
            options={stores.map(toOption)}
            value={location}
            onChange={(nextValue) => handleChange({ location: nextValue })}
            {...baseProps}
          />
          <TextField
            id="bike-color"
            label="Color"
            type="color"
            value={color}
            onChange={(e) => handleChange({ color: e.target.value })}
            fullWidth
            {...baseProps}
          />
          <FormControlLabel
            control={
              <Checkbox
                id="bike-availability"
                checked={isAvailable}
                onChange={(e) =>
                  handleChange({ isAvailable: e.target.checked })
                }
                {...baseProps}
              />
            }
            label="Is Available"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={!isValid}
            onClick={async () => {
              await onSubmit?.({
                ...bikeForm,
                model: bikeForm.model.value,
                location: bikeForm.location.value,
              });
              handleClose();
            }}
          >
            {editMode ? "Submit" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TriggerBikeModal;
