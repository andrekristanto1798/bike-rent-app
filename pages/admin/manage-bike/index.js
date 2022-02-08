import React from "react";
import { useRouter } from "next/router";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import withAuthSSR from "@/hoc/withAuthSSR";
import useBike from "@/hooks/useBike";
import AdminLayout from "@/components/AdminLayout";
import BikeCard from "@/components/BikeCard";
import TriggerBikeModal from "@/components/TriggerBikeModal";
import { BikeFilterPopover } from "@/components/BikeFilter";

const ManageBikeHome = () => {
  const router = useRouter();
  const { bikes, addBike } = useBike();
  return (
    <AdminLayout
      title="Bike Management"
      header={
        <>
          <span>{`Bikes (${bikes.length} found)`}</span>
          <TriggerBikeModal onSubmit={addBike}>
            <Button type="text" sx={{ mx: 1, color: "white" }}>
              <AddIcon sx={{ mr: 1 }} /> Add New Bike
            </Button>
          </TriggerBikeModal>
          <BikeFilterPopover />
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

export const getServerSideProps = withAuthSSR(
  true,
  async ({ currentUser, query, fetchWithToken }) => {
    const searchParams = new URLSearchParams(query).toString();
    const { bikes } = await fetchWithToken(`/api/bikes?${searchParams}`);
    return {
      props: { currentUser, bikes },
    };
  }
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ManageBikeHome);
