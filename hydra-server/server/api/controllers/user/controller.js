import Users from '../../services/user.service';
import l from '../../../common/logger';

export class UserController {
    async self(req, res, next) {
        try {
            const user = await Users.get(req.user.sub);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const patchedProfile = req.body;
            const updatedProfile = await Users.update(req.user.sub, patchedProfile);
            res.json(updatedProfile);    
        } catch (e) {
            next(e);
        }
    }
    
}

export default new UserController();
