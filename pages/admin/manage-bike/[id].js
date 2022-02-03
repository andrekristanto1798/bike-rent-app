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

const storeB = {
  name: "Store B",
  address: "120 Ukansfr St\nUstania, TX, 12399",
};
const mockBikeData = {
  id: 8,
  model: "Royal Enfield Meteor 350",
  rating: 4,
  location: storeB,
  color: "red",
  reservations: [
    {
      id: 1,
      user: { id: 1, name: "ABC" },
      date: "2021-01-01",
      createdAt: "2021-01-01T00:12:00Z",
      duration: 2,
      cancelled: false,
    },
    {
      id: 2,
      user: { id: 1, name: "DEF" },
      date: "2021-01-03",
      createdAt: "2021-01-03T00:12:00Z",
      duration: 1,
      cancelled: true,
    },
    {
      id: 3,
      user: { id: 1, name: "HIJ" },
      date: "2021-01-03",
      createdAt: "2021-01-03T00:12:00Z",
      duration: 1,
      cancelled: false,
    },
    {
      id: 4,
      user: { id: 1, name: "KLM" },
      date: "2021-01-10",
      createdAt: "2021-01-10T00:12:00Z",
      duration: 1,
      cancelled: false,
    },
    {
      id: 5,
      user: { id: 1, name: "NOP" },
      date: "2021-01-12",
      createdAt: "2021-01-12T00:12:00Z",
      duration: 1,
      cancelled: false,
    },
  ],
};

const ManageBikeById = ({ bikeId, bike }) => {
  const router = useRouter();
  return (
    <AdminLayout
      title={
        <Box display="flex" alignItems="center">
          {`Bike #${bikeId}`}
          <IconButton type="text" sx={{ ml: 1, color: "white" }}>
            <EditIcon />
          </IconButton>
        </Box>
      }
    >
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h4">{bike.bikeId}</Typography>
        <GridDescription
          equals
          left={<GridDescription left="Model" right={bike.model} />}
          right={
            <GridDescription
              left="Available"
              right={bike.available ? "Yes" : "No"}
            />
          }
        />
        <GridDescription
          equals
          left={<GridDescription left="Color" right={bike.color} />}
          right={
            <GridDescription
              left="Store"
              right={bike.location?.name + "\n" + bike.location?.address}
            />
          }
        />
      </Box>
      <Box>
        <Typography variant="h4">
          {bike.reservations.length} Reservations
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
                    textDecoration: row.cancelled ? "line-through" : undefined,
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
    </AdminLayout>
  );
};

export const getServerSideProps = withManagerSSR(
  async ({ req, user, query }) => {
    return {
      props: { user, bikeId: query.id, bike: mockBikeData },
    };
  }
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ManageBikeById);
