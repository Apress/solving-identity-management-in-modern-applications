import { Router } from "express";
import controller from "./controller";
import { ensureUser } from "../../middlewares/auth.middleware";
import scopeValidator from "../../middlewares/scopeValidator.middleware";

export default Router()
  .get(
    "/",
    ensureUser,
    scopeValidator(["get:profile"], { mustHaveScopes: true }),
    controller.self
  )
  .patch(
    "/",
    ensureUser,
    scopeValidator(["patch:profile"], { mustHaveScopes: true }),
    controller.update
  );
