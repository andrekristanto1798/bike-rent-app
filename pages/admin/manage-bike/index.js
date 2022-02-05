import React from "react";
import { useRouter } from "next/router";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { Box } from "@mui/material";
import withManagerSSR from "@/hoc/withManagerSSR";
import AdminLayout from "@/components/AdminLayout";
import BikeCard from "@/components/BikeCard";
import useEnumTypes from "@/hooks/useEnumTypes";

const ManageBikeHome = ({ bikes }) => {
  const router = useRouter();
  const enums = useEnumTypes();
  return (
    <AdminLayout title={`Bikes (${bikes.length} found)`}>
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
