import React from "react";
import { useAuth } from "../../Auth/hook";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link } from "react-router-dom";

export function UserDropDown({ user }) {
  const auth = useAuth();

  return (
    <UncontrolledDropdown>
      <DropdownToggle nav caret>
        {user.name}
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to="/profile">
          Profile
        </DropdownItem>
        <DropdownItem color="danger" onClick={() => auth.logout()}>
          Logout
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}
