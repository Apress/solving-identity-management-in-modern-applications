import env from "../../common/env";

const namespace = env('TOKEN_NAMESPACE');

export default function denamespace(req, _res, next) {
    if (req.user) {
        for (const key of Object.keys(req.user)) {
            console.log(key, namespace);
            if (key.startsWith(namespace)) {
                const updatedKey = key.replace(namespace, '');
                req.user[updatedKey] = req.user[updatedKey] || req.user[key];
            }
        }
    }

    next();
}