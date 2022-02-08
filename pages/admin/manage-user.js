import React from "react";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import withAuthSSR from "@/hoc/withAuthSSR";
import AdminLayout from "@/components/AdminLayout";
import TriggerUserModal from "@/components/TriggerUserModal";
import useUserList from "@/hooks/useUserList";

const ManageUser = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { users, addUser, updateUser, removeUser } = useUserList();
  return (
    <AdminLayout
      title="User Management"
      header={
        <>
          <span>{`Users (${users.length} found)`}</span>
          <TriggerUserModal onSubmit={addUser}>
            <Button type="text" sx={{ mx: 1, color: "white" }}>
              <AddIcon sx={{ mr: 1 }} /> Add New User
            </Button>
          </TriggerUserModal>
        </>
      }
    >
      <TableContainer sx={{ mt: 2 }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="right">Total Reservations</TableCell>
              <TableCell align="right">Manager?</TableCell>
              <TableCell align="right"> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.uid}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>{row.email}</TableCell>
                <TableCell align="right">
                  {row.reservations?.length || 0} Reservation(s)
                </TableCell>
                <TableCell align="right">
                  {row.isManager ? "Yes" : "No"}
                </TableCell>
                <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    type="text"
                    onClick={async () => {
                      const role = row.isManager ? "Manager" : "Basic User";
                      const alertMsg = `Are you sure to delete ${row.email} (${role}) user?`;
                      const gonnaDelete = confirm(alertMsg);
                      if (gonnaDelete) {
                        await removeUser(row.uid);
                        enqueueSnackbar(
                          `${row.email} is removed successfully!`,
                          { variant: "success" }
                        );
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <TriggerUserModal
                    editMode
                    initialValues={row}
                    onSubmit={async ({ password, isManager }) => {
                      await updateUser(row.uid, {
                        // ensures change password to undefined to avoid resetting it
                        password: password || undefined,
                        isManager,
                      });
                      router.replace(router.asPath);
                    }}
                  >
                    <IconButton type="text">
                      <EditIcon />
                    </IconButton>
                  </TriggerUserModal>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminLayout>
  );
};

export const getServerSideProps = withAuthSSR(
  true,
  async ({ currentUser, fetchWithToken }) => {
    const { users } = await fetchWithToken(`/api/users`);
    return {
      props: { currentUser, users },
    };
  }
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ManageUser);
