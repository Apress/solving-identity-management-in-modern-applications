import shortid from 'shortid';
import { ArticleServiceError } from '../api/services/ArticleServiceError';

/**
 *
 *
 * @class Article used to store articles
 *
 * @property {{identifier: String, permissions: "read"|"write"|"share"|"owner"[]}} grant Grants on the article
 * @property {number} version Version of the article
 * @property {string} id Shortid
 * @property {Article} parent Parent article to the current article, null if this is the original article
 * @property {string} data Markdown data
 */
export default class Article {
  grants = [];
  data = '';

  version = 0;
  id = '';
  parent = null;

  /**
   * Creates a new article
   *
   * @param {string} creatorIdentifier Owner
   * @param {string} data Markdown data for the article
   *
   * @returns {Article} created article
   */
  static new(creatorIdentifier, data) {
    const uuid = shortid();
    const article = new Article(data, null, 0, uuid);
    article.addGrant(creatorIdentifier, creatorIdentifier, ['read', 'write', 'share', 'owner']);
    return article;
  }

  /**
   * Creates a fork of an article, for sake of consistency
   * we create a new uuid here, and start with version 0
   *
   * However, parent data is retained
   *
   * @param {string} newCreatorIdentifier User's identifier
   * @param {Article} parent Parent article we are forking
   * @param {string} updatedData Updated / Changed data
   */
  static fork(newCreatorIdentifier, parent, updatedData) {
    const newUuid = shortid();
    const article = new Article(updatedData, parent, 0, newUuid);
    article.addGrant(newCreatorIdentifier, granter, ['read', 'write', 'share', 'owner']);
    return article;
  }

  /**
   * Create an updated version
   *
   * @param {Article} current Current article
   * @param {string} updatedData updated version
   * @param {number} updatedVersion number refering the latest version
   */
  static update(current, updatedData, updatedVersion) {
    const article = new Article(
      updatedData,
      current,
      updatedVersion,
      current.id
    );

    // New versions will inherit all the grants from the existing
    // ones, how-ever these will be forked from this point on
    article.grants = [...current.grants];

    return article;
  }

  /**
   * @constructor
   * @param {string} data Markdown data
   * @param {Article} parent Parent
   * @param {number} version Version identifier
   * @param {string} id Identifier / ShortID for the user
   */
  constructor(data, parent, version, id) {
    this.id = id;
    this.version = version;
    this.data = data;
    this.parent = parent;
  }

  /**
   * Identifier for the owner
   *
   * @returns {string} id of the owner or null if no owner
   */
  get owner() {
    const grantWithOwner = this.grants.find(({ permissions }) =>
      permissions.includes('owner')
    );

    if (grantWithOwner) {
      return grantWithOwner.identifier;
    }

    return null;
  }

  /**
   * Add a new permission to a given article
   *
   * @param {string} identifier user identifier
   * @param {string} granter user id of granter
   * @param {"read"|"write"|"share"|"owner"} permissions User permissions
   */
  addGrant(identifierToAdd, granter, permissions = ['read']) {
    if (this.grants.find(({identifier}) => identifierToAdd === identifier)) {
      throw new ArticleServiceError(409, 'Conflict, identifier already has a grant');
    }

    this.grants.push({
      identifier: identifierToAdd,
      permissions,
      granter
    });
  }

  /**
   * Removes a grant
   *
   * @param {string} identifierToRemove Identifier for the user to remove grant of
   */
  removeGrant(identifierToRemove) {
    this.grants = this.grants.filter(({ identifier }) => {
      return identifierToRemove !== identifier;
    });
  }
}
