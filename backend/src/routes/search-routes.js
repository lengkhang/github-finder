import express from 'express';
import {
  getSearch
} from '../controllers/search-controller';

const router = express.Router();

router.get('/search', getSearch);

export default router;
