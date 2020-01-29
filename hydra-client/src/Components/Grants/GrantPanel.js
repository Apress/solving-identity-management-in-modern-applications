import React from "react";
import {
  Card,
  ListGroup,
  ListGroupItem,
  CardHeader
} from "reactstrap";
import { Grant } from "./Grant";
import { AddGrant } from "./AddGrant";

export function GrantPanel({ grants }) {
  return (
    <Card>
      <CardHeader className="text-muted text-uppercase" tag="small">
        Shared
      </CardHeader>
      <ListGroup flush>
        {grants.length > 0 && 
            grants.map((grant, idx) => 
                <ListGroupItem key={idx}>
                    <Grant {...grant} />
                </ListGroupItem>
            )
        }
        <ListGroupItem>
          <AddGrant />
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
}
