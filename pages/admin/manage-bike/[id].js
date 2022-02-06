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
import withManagerSSR from "@/hoc/withManagerSSR";
import AdminLayout from "@/components/AdminLayout";
import GridDescription from "@/components/GridDescription";
import Link from "@/components/Link";
import TriggerBikeModal from "@/components/TriggerBikeModal";
import useBike from "@/hooks/useBike";

const ManageBikeById = ({ bikeId, bike }) => {
  const router = useRouter();
  const { updateBike } = useBike();
  return (
    <AdminLayout
      title={
        <Box display="flex" alignItems="center">
          {`Bike #${bikeId}`}
          {bike && (
            <TriggerBikeModal
              editMode
              initialValues={bike}
              onSubmit={(bike) => {
                updateBike(bikeId, bike);
                router.replace(router.asPath);
              }}
            >
              <IconButton type="text" sx={{ ml: 1, color: "white" }}>
                <EditIcon />
              </IconButton>
            </TriggerBikeModal>
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
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Duration</TableCell>
                    <TableCell align="right">Created At</TableCell>
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
                        <Link href={`/admin/manage-user/${row.user.id}`}>
                          {row.user.name}
                        </Link>
                      </TableCell>
                      <TableCell align="right">{row.date}</TableCell>
                      <TableCell align="right">{row.duration} Day(s)</TableCell>
                      <TableCell align="right">
                        {new Date(row.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {row.cancelled ? "Yes" : "No"}
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

export const getServerSideProps = withManagerSSR(
  async ({ req, user, query, fetchWithToken }) => {
    const { bike } = await fetchWithToken(`/api/bikes/${query.id}`);
    return {
      props: { user, bikeId: query.id, bike },
    };
  }
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ManageBikeById);
