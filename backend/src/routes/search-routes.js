import express from 'express';
import {
  getSearch,
  getAllSearchHistories
} from '../controllers/search-controller';

const router = express.Router();

router.get('/search', getSearch);
router.get('/search/history/user/:id', getAllSearchHistories);

export default router;
