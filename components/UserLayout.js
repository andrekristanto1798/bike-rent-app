import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import useCurrentUser from "@/hooks/useCurrentUser";
import UserAvatarMenu from "./UserAvatarMenu";
import Link from "./Link";

function UserLayout({ children }) {
  const user = useCurrentUser();
  const { pathname } = useRouter();
  const Wrapper =
    pathname !== "/"
      ? ({ children, ...restProps }) => (
          <Link href="/" {...restProps}>
            {children}
          </Link>
        )
      : ({ children, ...restProps }) => <Box {...restProps}>{children}</Box>;
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      backgroundColor="whitesmoke"
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        <UserAvatarMenu
          email={user.email}
          onSignOut={user.signOut}
          extraMenus={
            <Link href="/my-reservations">
              <Button sx={{ mt: 2 }} type="button" variant="text" fullWidth>
                My Reservations
              </Button>
            </Link>
          }
        />
      </Box>
      <Wrapper
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <Image
          width="80px"
          height="80px"
          alt="bike-rent-logo"
          src="/bike-rent.png"
        />
        <Typography variant="h4">Renty</Typography>
      </Wrapper>
      {children}
    </Box>
  );
}

export default UserLayout;
