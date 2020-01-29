import { apiUrl } from "../env";

export class ArticleManager {
  /**
   * get Document by Id
   * @param {string} articleId 
   * @param {number} articleVersion 
   */
  async getById(articleId, articleVersion, token=null) {
    const options = {};

    if (token) {
      options.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    const response = await fetch(
      `${apiUrl}/api/v1/articles/${articleId}/${articleVersion || "latest"}`, 
      options
    );

    await this.handleResponseOrFail(response);

    return response.json();
  }

  /**
   * Creates a new article
   * 
   * @param {string} data Response
   */
  async create(data, token=null) {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const body = JSON.stringify({
      data
    });

    const response = await fetch(
      `${apiUrl}/api/v1/articles`, {
        method: "POST",
        ...options, 
        body
      }
    );
    
    await this.handleResponseOrFail(response);
    
    return response.json();
  }

  /**
   * Update/fork an article
   * 
   * @param {string} articleId Article ID for the article being updated
   * @param {number} articleVersion Version of article we are updating
   * @param {string} data Updated data
   * @param {string?} token access token
   */
  async update(articleId, articleVersion, data, token=null) {
    const options = this.prepRequestOptions(token);
    
    const response = await fetch(
      `${apiUrl}/api/v1/articles/${articleId}/${articleVersion}`, {
        method: "PATCH",
        body: JSON.stringify({
          data
        }),
        ...options, 
      }
    );
    
    await this.handleResponseOrFail(response);
    
    return response.json();
  }

  /**
   * 
   * @param {string} articleId
   * @param {string} articleVersion
   * @param {{identifier: "string", grant: "read"|"write"|"share"[]}} grant
   * @param {string} token
   */
  async addGrant(articleId, articleVersion, grant, token) {
    const options = this.prepRequestOptions(token);
    const response = await fetch(
      `${apiUrl}/api/v1/articles/${articleId}/${articleVersion}/grants`, {
        method: "PUT",
        body: JSON.stringify(grant),
        ...options
      }
    );

    await this.handleResponseOrFail(response);

    return response.json();
  }


  /**
   * 
   * @param {string} articleId
   * @param {string} articleVersion
   * @param {string} identifier
   * @param {string} token
   */
  async revokeGrant(articleId, articleVersion, identifier, token) {
    const options = this.prepRequestOptions(token);
    const response = await fetch(
      `${apiUrl}/api/v1/articles/${articleId}/${articleVersion}/grants/${identifier}`, {
        method: "DELETE",
        ...options
      }
    );

    await this.handleResponseOrFail(response);

    return response.json();
  }

  /**
   * 
   * @param {string} token 
   */
  prepRequestOptions(token = null) {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token != null) {
      options.headers.Authorization = `Bearer ${token}`
    }
    return options;
  }
  
  /**
   * 
   * @param {Response} response 
   */
  async handleResponseOrFail(response) {
    if (response.status !== 200) {
      try {
        const { message, code } = await response.json();
        const error = new Error(message);
        error.code = code;
  
        throw error;
      } catch (e) {
        if (e.code) {
          throw e;
        }
  
        const error = new Error(response.statusText || e.message);
        error.code = response.status;
        throw error;
      }
    }
  }
}