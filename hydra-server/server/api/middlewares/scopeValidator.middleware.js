import jwtAuthz from 'express-jwt-authz';

export default function scopeValidator(scopes, {mustHaveScopes = false, ...options} = {}) {
    const mw = jwtAuthz(scopes, options);
    return (req, res, next) => {
        if (req.user) {
            mw(req, res, next);
        }
        next();
    }
}