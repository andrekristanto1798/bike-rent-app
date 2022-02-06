import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Checkbox, FormControlLabel } from "@mui/material";

const baseProps = {
  fullWidth: true,
  margin: "dense",
  variant: "standard",
};

const defaultUserForm = {
  email: "",
  password: "",
  isManager: false,
};

function TriggerUserModal({ onSubmit, initialValues, editMode, children }) {
  const [userForm, setUserForm] = useState(defaultUserForm);
  const [open, setOpen] = useState(false);
  const { email, password, isManager } = userForm;

  const handleChange = (nextProp) => {
    setUserForm((d) => ({ ...d, ...nextProp }));
  };

  const handleClickOpen = () => {
    const form = initialValues || defaultUserForm;
    setUserForm({
      email: form.email,
      password: "",
      isManager: form.isManager,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // edit mode is always valid, because password is not required to be updated
  const isValid = editMode ? true : email && password;

  return (
    <>
      <span role="presentation" onClick={handleClickOpen}>
        {children}
      </span>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? "Edit user" : "Add new user"}</DialogTitle>
        <DialogContent sx={{ "> *": { my: 2 } }}>
          <TextField
            id="email"
            label="Email"
            type="email"
            placeholder="example@email.com"
            disabled={editMode}
            value={email}
            onChange={(e) => handleChange({ email: e.target.value })}
            {...baseProps}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => handleChange({ password: e.target.value })}
            {...baseProps}
          />
          <FormControlLabel
            control={
              <Checkbox
                id="is-manager"
                checked={isManager}
                onChange={(e) => handleChange({ isManager: e.target.checked })}
                {...baseProps}
              />
            }
            label="Is Manager"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={!isValid}
            onClick={async () => {
              await onSubmit?.(userForm);
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

export default TriggerUserModal;
