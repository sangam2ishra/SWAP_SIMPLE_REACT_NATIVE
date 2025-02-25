import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser, updateExpoToken

} from '../controllers/userController.js';
import { verifyToken } from './../utilis/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);

router.patch('/updateExpoToken/:userId', updateExpoToken);

router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
// router.get('/:userId', getUser);
// router.get('/:userId/getRequest',getRequest);


export default router;