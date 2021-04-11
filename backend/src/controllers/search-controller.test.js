import { getAllSearchHistories } from './search-controller';
import SearchHistory from '../models/searchHistory';
import request from 'supertest';
import appBootstrapper from '../bootstrap/appBootstrapper';
import { USER_ROLE_TOKENS } from '../__mocks__/userTokens';

jest.mock('../models/searchHistory');

describe('GET /search/history', () => {
  async function getRequest(url, authHeader = '') {
    const app = await appBootstrapper();

    return request(app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', authHeader);
  }

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
    describe.skip('when invalid query string is provided', () => {
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

      describe('when the search history contains multiple pages', () => {
        describe('when user is requesting for an invalid page', () => {
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

            response = await getRequest('/api/search/history?pageSize=2,pageNo=3', USER_ROLE_TOKENS.ADMIN);
          });

          it('return response 404', () => {

          });
        });

        describe('when user is requesting for first page', () => {

        });

        describe('when user is requesting for last page', () => {

        });
      });
    });

  });
});
