import express from 'express';
import userController from '../controllers/user';
import Helper from '../../helper/helper';
import Auth from '../../middleware/is-Auth';

const router = express.Router();

// user sign up route
router.post('/signup', Helper.trimmer, userController.createUser);

// user can sign up route
router.post('/signin', Helper.trimmer, userController.loginUser);

// get all users route
router.get('/user', Auth.verifyToken, userController.getUsers);

// get a single user route
router.get('/user/:id', Auth.verifyToken, userController.getUser);

// patch user route
router.patch('/user/:id', Helper.trimmer, userController.patchUser);

// delete user route
router.delete('/user/:id', Auth.verifyToken, userController.deleteUser);

module.exports = router;
