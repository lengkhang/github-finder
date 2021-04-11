import express from 'express';
import { getJwt, adminRoleRequired } from '../middleware/auth';
import { getAllSearchHistories } from '../APIs/listSearchHistory';
import { getSearch } from '../APIs/searchRepository';

const router = express.Router();

router.get('/search', getJwt, getSearch);
router.get('/search/history', getJwt, adminRoleRequired, getAllSearchHistories);

export default router;
