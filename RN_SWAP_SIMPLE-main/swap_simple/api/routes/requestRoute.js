import express from 'express';

import { verifyToken } from './../utilis/verifyUser.js';
import { addRequest, deleteReq, getAll_Req } from '../controllers/requestController.js';

const router = express.Router();


router.get('/:userId/allReq', getAll_Req);
router.post('/:userId/:travelId/add_request',addRequest);

router.delete('/delete/:userId/:travelID', verifyToken, deleteReq);



export default router;