import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  FormGroup,
  Spinner,
  Label,
  Form,
  Button,
  Container
} from "reactstrap";
import { useToken } from "../Auth/hook";
import { audience, apiUrl } from "../env";
import { useErrors } from "../Error/hook";
import { HeaderWithUser } from "../Components/Header/HeaderWithUser";

export function Profile() {
  const [isLoading, updateIsLoading] = useState(false);
  const [isTokenLoading, token] = useToken(audience, "get:profile patch:profile");
  const [profile, updateProfile] = useState(null);
  const [, publishError] = useErrors();
  const { handleSubmit, register } = useForm();

  /**
   * Function to load profile
   */
  const loadProfile = useCallback(async function () {
    if (isTokenLoading) {
      return;
    }

    if (isLoading) {
      return;
    }

    updateIsLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/api/v1/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (!resp.ok) {
        publishError(new Error("Unable to load profile"));
        return;
      }
      const loadedProfile = await resp.json();
      updateProfile(loadedProfile);
    } catch (e) {
      publishError(e);
    } finally {
      updateIsLoading(false);
    }
  }, [isLoading, isTokenLoading, publishError, token]);

  /**
   * Function to store profile
   * @param {any} data
   */
  async function saveProfile(data) {
    data.name = `${data.given_name} ${data.family_name}`;

    if (isTokenLoading) {
      return;
    }

    if (isLoading) {
      return;
    }

    updateIsLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/api/v1/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
        method: "PATCH"
      });

      if (!resp.ok) {
        publishError(new Error("Unable to load profile"));
        return;
      }

      const loadedProfile = await resp.json();
      updateProfile(loadedProfile);
    } catch (e) {
      publishError(e);
    } finally {
      updateIsLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      if (isLoading) {
        return false;
      }

      if (isTokenLoading) {
        return false;
      }

      if (profile) {
        return false;
      }

      await loadProfile();
    })();
  }, [isLoading, isTokenLoading, loadProfile, profile]);

  if (isLoading || isTokenLoading || !profile) {
    return <Spinner />;
  }

  return (
    <div>
      <HeaderWithUser />
      <Container>
        <h3 className="my-4">Profile</h3>
        <Form onSubmit={handleSubmit(saveProfile)} className="profile-editor">
          <FormGroup>
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              name="nickname"
              id="nickname"
              innerRef={register}
              defaultValue={profile.nickname}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="given_name">Given Name</Label>
            <Input
              name="given_name"
              id="given_name"
              innerRef={register}
              defaultValue={profile.given_name}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="family_name">Family Name</Label>
            <Input
              name="family_name"
              id="family_name"
              innerRef={register}
              defaultValue={profile.family_name}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="picture">Picture</Label>
            <Input
              name="picture"
              id="picture"
              innerRef={register}
              defaultValue={profile.picture}
            />
          </FormGroup>
          <FormGroup>
            <Button color="success">Save</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  );
}
