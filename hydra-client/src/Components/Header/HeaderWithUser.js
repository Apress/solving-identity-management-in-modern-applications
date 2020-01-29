import React from "react";
import { Header } from "./Header";
import { useUser, useAuth } from "../../Auth/hook";
import { Button } from "reactstrap";
import { UserDropDown } from "./UserDropDown";
import { audience, scope } from "../../env";

export function HeaderWithUser({ children }) {
	const auth = useAuth(); 
  const [isUserLoading, user] = useUser(
		audience,
		scope
  );
  let userPart = null;

  if (isUserLoading) {
    userPart = <Button disabled>Loading...</Button>;
  } else if (user) {
    userPart = <UserDropDown user={user} />;
  } else {
    userPart = <Button color="primary" onClick={() => auth.authenticate(audience, scope)}>Login</Button>;
  }

  return <Header>{children}{userPart}</Header>;
}
