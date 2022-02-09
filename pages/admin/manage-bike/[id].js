import React from "react";
import { useRouter } from "next/router";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import withAuthSSR from "@/hoc/withAuthSSR";
import AdminLayout from "@/components/AdminLayout";
import GridDescription from "@/components/GridDescription";
import Link from "@/components/Link";
import TriggerBikeModal from "@/components/TriggerBikeModal";
import useBike from "@/hooks/useBike";

const ManageBikeById = ({ bikeId, bike }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { updateBike, removeBike } = useBike();
  const title = bike.model ? `Bike ${bike.model}` : `Bike ${bikeId}`;
  return (
    <AdminLayout
      title={title}
      header={
        <Box display="flex" alignItems="center" gap={1}>
          {`Bike #${bikeId}`}
          {bike && (
            <TriggerBikeModal
              editMode
              initialValues={bike}
              onSubmit={async (bike) => {
                await updateBike(bikeId, bike);
                router.replace(router.asPath);
              }}
            >
              <IconButton type="text" sx={{ color: "white" }}>
                <EditIcon />
              </IconButton>
            </TriggerBikeModal>
          )}
          {bike && (
            <IconButton
              sx={{ color: "white" }}
              type="text"
              onClick={async () => {
                const alertMsg = `Are you sure to delete Bike ${bike.model} (ID: ${bikeId})?`;
                const gonnaDelete = confirm(alertMsg);
                if (gonnaDelete) {
                  await removeBike(bikeId);
                  enqueueSnackbar(
                    `Bike ${bike.model} is removed successfully!`,
                    { variant: "success" }
                  );
                  router.push("/admin/manage-bike");
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      }
    >
      {!bike && (
        <Typography variant="h6">Unable to find your bike #{bikeId}</Typography>
      )}
      {bike && (
        <>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h4">{bike.bikeId}</Typography>
            <GridDescription
              equals
              left={<GridDescription left="Model" right={bike.model} />}
              right={
                <GridDescription
                  left="Available"
                  right={bike.isAvailable ? "Yes" : "No"}
                />
              }
            />
            <GridDescription
              equals
              left={<GridDescription left="Color" right={bike.color} />}
              right={<GridDescription left="Store" right={bike.location} />}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h4">
              {bike.reservations?.length} Reservations
            </Typography>
            <TableContainer sx={{ mt: 2 }} component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell align="right">Start Date</TableCell>
                    <TableCell align="right">End Date</TableCell>
                    <TableCell align="right">Cancelled</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bike.reservations.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        backgroundColor: row.cancelled ? "#CAC9CD" : undefined,
                        textDecoration: row.cancelled
                          ? "line-through"
                          : undefined,
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Link
                          href={`/admin/manage-user?viewDetail=${row.user?.id}`}
                        >
                          {row.user?.email}
                        </Link>
                      </TableCell>
                      <TableCell align="right">{row.startDate}</TableCell>
                      <TableCell align="right">{row.endDate}</TableCell>
                      <TableCell align="right">
                        {row.status === "CANCELLED" ? "Yes" : "No"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </AdminLayout>
  );
};

export const getServerSideProps = withAuthSSR(
  true,
  async ({ currentUser, query, fetchWithToken }) => {
    const { bike } = await fetchWithToken(`/api/bikes/${query.id}`);
    return {
      props: { currentUser, bikeId: query.id, bike },
    };
  }
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ManageBikeById);
