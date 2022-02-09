import React, { useEffect, useState } from "react";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import { Box, Button, TextField, Typography } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateRangePicker from "@mui/lab/DateRangePicker";
import FilterIcon from "@mui/icons-material/FilterAlt";
import withAuthSSR from "@/hoc/withAuthSSR";
import { formatYYYYMMDD } from "@/utils/date";
import useBike from "@/hooks/useBike";
import UserLayout from "@/components/UserLayout";
import BikeCard from "@/components/BikeCard";
import { BikeFilterPopover } from "@/components/BikeFilter";

const Home = ({ startDate, endDate }) => {
  const { bikes } = useBike();
  const [dateRangeValue, setDateRangeValue] = useState([startDate, endDate]);
  const router = useRouter();
  useEffect(() => {
    if (
      router.query.startDate !== startDate ||
      router.query.endDate !== endDate
    ) {
      router.replace({ query: { startDate, endDate } });
    }
  }, [router, startDate, endDate]);
  return (
    <UserLayout>
      <Box display="flex" flexDirection="row" gap={2} sx={{ my: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            startText="From"
            endText="To"
            value={dateRangeValue}
            allowSameDateSelection
            onChange={([newStartDate, newEndDate]) => {
              setDateRangeValue([newStartDate, newEndDate]);
              if (!newStartDate || !newEndDate) return;
              router.replace({
                query: {
                  ...router.query,
                  startDate: formatYYYYMMDD(newStartDate),
                  endDate: formatYYYYMMDD(newEndDate),
                },
              });
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField sx={{ width: "120px" }} {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField sx={{ width: "120px" }} {...endProps} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>
        <BikeFilterPopover
          trigger={
            <Button sx={{ padding: 0, minWidth: "32px" }}>
              <FilterIcon />
            </Button>
          }
        />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        gap={2}
        rowGap={2}
        p={2}
      >
        {bikes.length === 0 && (
          <Typography>
            We are sorry. Currently there are no bikes available for
            reservations! Please try update your search.
          </Typography>
        )}
        {bikes.map((bike) => {
          return (
            <BikeCard
              hideTotalBookings
              key={bike.id}
              bike={bike}
              onClick={() => {
                router.push(
                  `/rent-bike/${bike.id}?startDate=${startDate}&endDate=${endDate}`
                );
              }}
            />
          );
        })}
      </Box>
    </UserLayout>
  );
};

export const getServerSideProps = withAuthSSR(
  false,
  async ({ currentUser, query, fetchWithToken }) => {
    if (currentUser.isManager) {
      return { redirect: { destination: "/admin", permanent: false } };
    }
    const userQuery = {
      ...query,
      startDate: formatYYYYMMDD(query.startDate) || formatYYYYMMDD(new Date()),
      endDate: formatYYYYMMDD(query.endDate) || formatYYYYMMDD(new Date()),
    };
    const searchParams = new URLSearchParams(userQuery).toString();
    const { bikes } = await fetchWithToken(`/api/bikes?${searchParams}`);
    return {
      props: { currentUser, bikes: bikes || [], ...userQuery },
    };
  }
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
