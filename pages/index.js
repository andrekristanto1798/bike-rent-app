import React from "react";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import Header from "@/components/Header";
import withAuthSSR from "@/hoc/withAuthSSR";
import { formatYYYYMMDD } from "@/utils/date";
import useBike from "@/hooks/useBike";

const Home = ({ startDate, endDate }) => {
  const { bikes } = useBike();
  return (
    <div>
      <Header />
      <pre>{JSON.stringify({ startDate, endDate, bikes }, null, 2)}</pre>
    </div>
  );
};

export const getServerSideProps = withAuthSSR(
  false,
  async ({ currentUser, query, fetchWithToken }) => {
    if (currentUser.isManager) {
      return { redirect: { destination: "/admin", permanent: false } };
    }
    const userQuery = {
      startDate: formatYYYYMMDD(new Date()) || query.startDate,
      endDate: formatYYYYMMDD(new Date()) || query.endDate,
    };
    const searchParams = new URLSearchParams(userQuery).toString();
    const { bikes } = await fetchWithToken(`/api/bikes?${searchParams}`);
    return {
      props: { currentUser, bikes, ...userQuery },
    };
  }
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
