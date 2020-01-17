import React from "react";
import {
  Form,
  Input,
  FormGroup,
  Label,
  Button,
  FormText,
  Spinner,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { useArticle } from "../../Article/hook";
import { useUser } from "../../Auth/hook";
import { audience, scope } from "../../env";


export function AddGrant() {
  const { handleSubmit, register } = useForm();
  const { loading, article, addGrant } = useArticle();
  const [ isUserLoading, user ] = useUser(audience, scope);

  if(loading|| isUserLoading) {
    return <Spinner />
  }

  const yourGrant = article.grants[0];

  const allGrants = yourGrant.permissions.includes("owner") 
    ? ["read", "write", "share"]
    : ["read", "write"];

  async function onSubmit(grant) {
    await addGrant(grant);
  }

  return (
    <div className="add-grant">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label for="identifier" className="text-uppercase">
            <small>
              <small>Identifier</small>
            </small>
          </Label>
          <Input
            name="identifier"
            id="identifier"
            placeholder="Email or Domain"
            innerRef={register({ required: true })}
          />
          <FormText>Email or Domain of the recipient</FormText>
        </FormGroup>
        <FormGroup>
          <div>
            <Label for="identifier" className="text-uppercase">
              <small>
                <small>Permissions</small>
              </small>
            </Label>
          </div>
          {allGrants.map(grant => (
            <FormGroup inline check>
              <Label check for={grant}>
                <Input
                  id="permissions"
                  name="permissions"
                  value={grant}
                  innerRef={register}
                  type="checkbox"
                />
                {grant}
              </Label>
            </FormGroup>
          ))}
        </FormGroup>
        <FormGroup>
          <Button color="success" className="w-100">
            Add
          </Button>
        </FormGroup>
      </Form>
    </div>
  );
}
