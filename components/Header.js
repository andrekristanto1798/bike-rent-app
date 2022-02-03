import React from "react";
import { Button, Typography } from "@mui/material";
import Link from "./Link";

const styles = {
  container: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 16,
  },
  versionsContainer: {
    marginLeft: 0,
    marginRight: "auto",
  },
  button: {
    marginLeft: 16,
    cursor: "pointer",
  },
};

const Header = ({ email, signOut }) => (
  <div style={styles.container}>
    <div style={styles.versionsContainer}>
      <h1 className="text-3xl font-bold">Bike Rent App</h1>
    </div>
  </div>
);

export default Header;
