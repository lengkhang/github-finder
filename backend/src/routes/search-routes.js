import express from 'express';
import { getJwt, adminRoleRequired } from '../middleware/auth';
import {
  getSearch,
  getAllSearchHistories
} from '../controllers/search-controller';

const router = express.Router();

router.get('/search', getJwt, getSearch);
router.get('/search/history', getJwt, adminRoleRequired, getAllSearchHistories);

export default router;
