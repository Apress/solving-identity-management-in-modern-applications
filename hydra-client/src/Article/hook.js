import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback
} from "react";
import { useParams, useHistory } from "react-router-dom";
import { ArticleManager } from "./Manager";
import { useErrors } from "../Error/hook";
import { useAuth } from "../Auth/hook";
import { audience } from "../env";

// A client for our service, this is a singleton
let service = new ArticleManager();

const ArticleManagerContext = createContext();

/**
 * Creates a new local article
 */
function newArticle() {
  return {
    id: "new",
    version: 0,
    data: "# New Doc\nStart writing!",
    grants: []
  };
}

/**
 * Document Manager Provider, populates the document
 * across the app
 */
export function ArticleProvider({ children }) {
  const auth = useAuth();
  const history = useHistory();

  const { articleId, articleVersion } = useParams();

  const [article, _updateArticle] = useState(
    articleId === "new" ? newArticle() : null
  );

  const [loading, updateLoading] = useState(false);
  const [errors, publishError] = useErrors();

  const updateArticle = useCallback(
    function(updatedArticle) {
      _updateArticle(updatedArticle);
      if (
        updatedArticle.id !== articleId ||
        updatedArticle.version !== articleVersion
      ) {
        history.push(`/${updatedArticle.id}/${updatedArticle.version}`);
      }
    },
    [articleId, articleVersion, history]
  );

  async function addGrant(grant) {
    updateLoading(true);
    try {
      if (!article) {
        publishError(new Error("Save called before article loaded"));
      }
      const { id, version } = article;
      const token = (await auth.isAuthenticated())
        ? await auth.getToken(audience, "put:grant")
        : null;
      const updatedArticle = await service.addGrant(id, version, grant, token);
      updateArticle(updatedArticle);
    } catch (e) {
      publishError(e);
    } finally {
      updateLoading(false);
    }
  }

  async function revokeGrant(identifier) {
    updateLoading(true);
    try {
      if (!article) {
        publishError(new Error("Save called before article loaded"));
      }
      const { id, version } = article;
      const token = (await auth.isAuthenticated())
        ? await auth.getToken(audience, "delete:grant")
        : null;
      const updatedArticle = await service.revokeGrant(
        id,
        version,
        identifier,
        token
      );
      updateArticle(updatedArticle);
    } catch (e) {
      publishError(e);
    } finally {
      updateLoading(false);
    }
  }

  async function save(data) {
    updateLoading(true);
    try {
      if (!article) {
        publishError(new Error("Save called before article loaded"));
      }
      const { id, version } = article;
      const token = (await auth.isAuthenticated())
        ? await auth.getToken(audience, "patch:article post:article")
        : null;
      const updatedArticle =
        id === "new"
          ? await service.create(data, token)
          : await service.update(id, version, data, token);

      updateArticle(updatedArticle);
    } catch (e) {
      publishError(e);
    } finally {
      updateLoading(false);
    }
  }

  const load = useCallback(
    async function() {
      updateLoading(true);
      try {
        const token = (await auth.isAuthenticated())
          ? await auth.getToken(audience, "get:article")
          : null;
        const loadedArticle = await service.getById(
          articleId,
          articleVersion,
          token
        );
        updateArticle(loadedArticle);
      } catch (e) {
        publishError(e);
      } finally {
        updateLoading(false);
      }
    },
    [auth, articleId, articleVersion, updateArticle, publishError]
  );

  useEffect(() => {
    (async () => {
      if (loading) {
        return;
      }
      // Retry must be used to clear errors
      if (errors.length) {
        return;
      }

      if (articleId === "new") {
        return;
      }

      if (article) {
        if (articleId === article.id && +articleVersion === article.version) {
          return;
        }
      }
      await load();
    })();
  }, [loading, article, articleId, articleVersion, errors, load]);

  return (
    <ArticleManagerContext.Provider
      value={{ loading, article, save, addGrant, revokeGrant, load }}
    >
      {children}
    </ArticleManagerContext.Provider>
  );
}

/**
 * Gives the shared instance of a managed article
 * @returns {{
 *   loading: boolean,
 *   article: any,
 *   save: (data: string) => Promise<void>,
 *   addGrant: (grant: {
 *     identifier: string,
 *     permissions: "read"|"share"|"write"[]
 *   }),
 *   revokeGrant: (identifier: string),
 *   load: () => Promise<void>
 * }}
 */
export function useArticle() {
  return useContext(ArticleManagerContext);
}
