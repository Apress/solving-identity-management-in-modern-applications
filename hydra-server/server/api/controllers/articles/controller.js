import Articles from "../../services/articles.service";
import {
  getQualifyingGrantToGrant,
  getQualifyingGrantToPerform
} from "../../../common/abac";
import { AccessError } from "../../middlewares/AccessError";
import l from "../../../common/logger";

function prepareResponse(user, sourceArticle, qualifyingGrant) {
  // Do not expose history
  const {parent, ...article} = sourceArticle;

  const owner = article.owner;
  // Only share permissions you have shared
  // or are applicable to you
  if (owner !== user.sub) {
    return {
      ...article,
      owner,
      grants: [
        qualifyingGrant,
        ...article.grants.filter(({ granter }) => granter === user.sub)
      ]
    };
  }

  // Owners can see all
  return {
    ...article,
    owner,
  };
}

export class ArticleController {
  /**
   * Get's Article by id and optionally a version
   * GET /articles/:articleId/:articleVersion
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   */
  byId(req, res, next) {
    const {
      user = {
        sub: "anonymous"
      },
      params
    } = req;
    const { articleId, articleVersion } = params;
    const article = Articles.byIdAndVersion(articleId, articleVersion);

    const grant = getQualifyingGrantToPerform(user, article.grants, "read");

    if (!grant) {
      next(new AccessError(401, "You are not allowed to read this file"));
      return;
    }

    // Owners can see all
    res.json(prepareResponse(user, article, grant));
  }

  /**
   * Create an article, everyone can create their own articles
   *
   * POST /articles
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   */
  create(req, res) {
    l.info(`Create`, req.user);

    const {
      user = {
        sub: "anonymous"
      },
      body
    } = req;

    const { data } = body;
    const { sub } = user;

    const newArticle = Articles.create(sub, data);

    res.json(prepareResponse(user, newArticle));
  }

  /**
   * Update an article
   *
   * Maybe not the best RESTful way to do this.
   *
   * PATCH /articles/:articleId/:articleVersion
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   */
  update(req, res, next) {
    const {
      user = {
        sub: "anonymous"
      },
      params,
      body
    } = req;
    const { articleId, articleVersion } = params;
    const baseArticle = Articles.byIdAndVersion(articleId, articleVersion);
    const { data } = body;

    const grant = getQualifyingGrantToPerform(user, baseArticle.grants, "write");

    if (!grant) {
      next(new AccessError(401, `You are not allowed to update this file`));
      return;
    }

    const { owner } = baseArticle;
    const updatedArticle =
      owner === user.sub
        ? Articles.update(baseArticle, data)
        : Articles.fork(user.userId, baseArticle, data);

    res.json(prepareResponse(user, updatedArticle, grant));
  }

  /**
   * Grant permissions to an article
   * PUT /articles/:articleId/:articleVersion/permissions
   * {
   *    identifier: string
   *    permissions: []
   * }
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   */
  grant(req, res, next) {
    const { user, params, body } = req;
    const { articleId, articleVersion } = params;
    const article = Articles.byIdAndVersion(articleId, articleVersion);
    const { identifier, permissions } = body;
    // Can we perform
    const qualifyingGrant = getQualifyingGrantToGrant(
      user,
      article.grants,
      permissions
    );

    if (!qualifyingGrant) {
      next(
        new AccessError(
          401,
          `You are not allowed to grant ${permissions.join(",")}`
        )
      );
      return;
    }

    article.addGrant(identifier, user.sub, permissions);
    res.json(prepareResponse(user, article, qualifyingGrant));
  }

  /**
   * Remove permissions to an article
   * DELETE /articles/:articleId/:version/permissions/:identifier
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   */
  revoke(req, res, next) {
    const { user, params } = req;
    const { articleId, articleVersion, identifier } = params;
    const article = Articles.byIdAndVersion(articleId, articleVersion);

    if (identifier === user.sub) {
      next(new AccessError(401, `You are not allowed to revoke yourself`));
      return;
    }

    const grantToRevoke = article.grants.find(
      grant => grant.identifier === identifier
    );

    if (!grantToRevoke) {
      next(new AccessError(404, "Grant to revoke not found"));
      return;
    }

    // Can we perform
    const qualifyingGrant = getQualifyingGrantToGrant(
      user,
      article.grants,
      grantToRevoke.permissions
    );

    if (!qualifyingGrant) {
      next(new AccessError(401, `You are not allowed to revoke ${grantToRevoke.permissions.join(',')}`));
    }

    article.removeGrant(identifier);
    res.json(prepareResponse(user, article, qualifyingGrant));
  }
}

export default new ArticleController();
