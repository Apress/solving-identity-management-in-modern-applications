import l from '../../common/logger';
import Article from '../../models/Article';
import { ArticleServiceError } from './ArticleServiceError';

/**
 *
 *  The articles are stored in memory in the following format
 *  this is purely to keep things simple in the resulting app
 *  and not have to rely on a database, or require a DB to be able to
 *  run / test an app.
 *
 *  The caveats are when deploying this, you'd need to be able to
 *  store this in some format, somewhere.
 *
 *  {
 *      "ids": {
 *          "<id>": [
 *            Article
 *            ...Versions...
 *          ]
 *      }
 *  }
 *
 * @property {{[id: string]: Array<Article>>}} store Mem storage for all articles
 */
class ArticleService {
  store = {};

  /**
   *
   * @param {string} articleId
   * @param {string} version
   *
   * @returns {Article|null} article matching the criteria, null if not found
   */
  byIdAndVersion(articleId, version = 'latest') {
    const articles = this.store[articleId];

    if (!articles) {
      throw new ArticleServiceError(404, 'Article Not Found');
    }

    const article =
      version === 'latest'
        ? articles[articles.length - 1]
        : articles[parseInt(version)];

    if (!article) {
      throw new ArticleServiceError(404, 'Article not found');
    }

    return article;
  }

  /**
   *
   * @param {Article} baseArticle
   * @param {string} updatedData
   */
  update(baseArticle, updatedData) {
    const ref = this.store[baseArticle.id];
    const updatedArticle = Article.update(baseArticle, updatedData, ref.length);
    ref.push(updatedArticle);
    return updatedArticle;
  }

  /**
   *
   * @param {string} creatorId
   * @param {Article} baseArticle
   * @param {string} updatedData
   */
  fork(creatorId, baseArticle, updatedData) {
    l.info(
      `${
        this.constructor.name
      }.fork(${creatorId}, ${creatorId}, ${baseArticle}, ${updatedData.substr(
        0,
        15
      )}...)`
    );

    const newArticle = Article.fork(creatorId, baseArticle, updatedData);

    if (this.store[newArticle.id]) {
      throw new ArticleServiceError(500, 'Unable to fork due to clash of ids');
    }
    this.store[newArticle.id] = [newArticle];
    return newArticle;
  }

  /**
   * Create a new article
   *
   * @param {string} creatorId Id for the creator
   * @param {string} data Markdown data
   */
  create(creatorId, data) {
    l.info(
      `${this.constructor.name}.create(${creatorId}, ${data.substr(0, 15)}...)`
    );
    const article = Article.new(creatorId, data);

    if (this.store[article.id]) {
      throw new ArticleServiceError(
        500,
        'Unable to create due to clash of ids'
      );
    }

    this.store[article.id] = [article];
    return article;
  }
}

export default new ArticleService();
