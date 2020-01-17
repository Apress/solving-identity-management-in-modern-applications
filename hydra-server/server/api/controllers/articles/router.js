import { Router } from "express";
import controller from "./controller";
import { allowAnonymous, ensureUser } from "../../middlewares/auth.middleware";
import denamespace from "../../middlewares/denamespace.middleware";
import scopeValidator from "../../middlewares/scopeValidator.middleware";

export default Router()
  .post("/", allowAnonymous, denamespace, controller.create)
  .get(
    "/:articleId/:articleVersion",
    allowAnonymous,
    denamespace,
    scopeValidator(["get:article"]),
    controller.byId
  )
  .patch(
    "/:articleId/:articleVersion",
    allowAnonymous,
    denamespace,
    scopeValidator(["patch:article", "post:article"]),
    controller.update
  )
  .put(
    "/:articleId/:articleVersion/grants",
    ensureUser,
    denamespace,
    scopeValidator(["put:grant"], { mustHaveScopes: true }),
    controller.grant
  )
  .delete(
    "/:articleId/:articleVersion/grants/:identifier",
    ensureUser,
    denamespace,
    scopeValidator(["delete:grant"], {mustHaveScopes: true}),
    controller.revoke
  );
