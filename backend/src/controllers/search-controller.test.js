import { getAllSearchHistories } from './search-controller';
import SearchHistory from '../models/searchHistory';
import request from 'supertest';
import app from '../bootstrap/appBootstrapper';
import { USER_ROLE_TOKENS } from '../__mocks__/userTokens';

jest.mock('../models/searchHistory');

describe('search controllers', () => {
  const mockReq = {
    body: {},
  };
  const mockRes = {
    status: jest.fn(() => mockRes),
    json: jest.fn(() => mockRes),
    send: jest.fn(() => mockRes),
  };

  async function getRequest(url, authHeader = '') {
    return request(app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', authHeader);
  }

  describe('GET /search/history', () => {
    describe('when no authorization header is provided', () => {
      let response;

      beforeAll(async () => {
        response = await getRequest('/api/search/history');
      });

      it('return response 401', async () => {
        expect(response.status).toBe(401);
      });

      it('return error message', async () => {
        expect(response.body.error.message).toBe('Missing authorization header');
      });
    });

    describe('when non-admin authorization header is provided', () => {
      let response;

      beforeAll(async () => {
        response = await getRequest('/api/search/history', USER_ROLE_TOKENS.USER);
      });

      it('return response 401', async () => {
        expect(response.status).toBe(401);
      });

      it('return error message', async () => {
        expect(response.body.error.message).toBe('Only admin can perform this action');
      });
    });

    describe('when admin authorization header is provided', () => {
      xdescribe('when invalid query string is provided', () => {
        //TODO:
      });

      describe('when valid query string is provided', () => {
        describe('when the search history is empty', () => {
          let response;

          beforeAll(async () => {
            SearchHistory.countDocuments.mockResolvedValueOnce(0);
            SearchHistory.find.mockImplementationOnce(() => ({
                limit: () => ({
                  skip: () => ({
                    sort: () => {
                      return new Promise((resolve, reject) => {
                        resolve([]);
                      });
                    }
                  })
                })
              })
            );
  
            response = await getRequest('/api/search/history', USER_ROLE_TOKENS.ADMIN);
          });
    
          it('return response 200', async () => {
            expect(response.status).toBe(200);
          });
    
          it('return empty list', async () => {
            expect(response.body).toMatchObject({ items: [], total: 0 });
          });
        });

      });
      
    });
  });
});
