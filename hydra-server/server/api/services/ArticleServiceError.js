export class ArticleServiceError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
  toJSON() {
    return {
      code: this.code,
      name: this.name,
      message: this.message,
    };
  }
}
