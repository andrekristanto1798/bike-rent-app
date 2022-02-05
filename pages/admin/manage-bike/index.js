import React from "react";
import { useRouter } from "next/router";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import withManagerSSR from "@/hoc/withManagerSSR";
import AdminLayout from "@/components/AdminLayout";
import BikeCard from "@/components/BikeCard";
import TriggerBikeModal from "@/components/TriggerBikeModal";
import useBike from "@/hooks/useBike";

const ManageBikeHome = () => {
  const router = useRouter();
  const { bikes, addBike } = useBike();
  return (
    <AdminLayout
      title={
        <>
          <span>{`Bikes (${bikes.length} found)`}</span>
          <TriggerBikeModal onSubmit={addBike}>
            <Button type="text" sx={{ ml: 1, color: "white" }}>
              <AddIcon sx={{ mr: 1 }} /> Add New Bike
            </Button>
          </TriggerBikeModal>
        </>
      }
    >
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        gap={2}
        rowGap={2}
      >
        {bikes.map((bike) => {
          return (
            <BikeCard
              key={bike.id}
              bike={bike}
              onClick={() => {
                router.push(`/admin/manage-bike/${bike.id}`);
              }}
            />
          );
        })}
      </Box>
    </AdminLayout>
  );
};

export const getServerSideProps = withManagerSSR(
  async ({ user, fetchWithToken }) => {
    const bikes = await fetchWithToken(`/api/bikes`);
    return {
      props: { user, bikes },
    };
  }
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ManageBikeHome);
