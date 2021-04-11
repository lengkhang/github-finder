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
            }));

            response = await getRequest('/api/search/history?pageSize=2,pageNo=3', USER_ROLE_TOKENS.ADMIN);
          });

          it('return response 200', async () => {
            expect(response.status).toBe(200);
          });

          it('return empty list', async () => {
            expect(response.body).toMatchObject({ items: [], total: 0 });
          });
        });

        describe('when user is requesting for first page', () => {
          const firstPageData = [
            {
              texts: ["node"],
              _id: "6072a12324728c3dd5776df6",
              type: "topic",
              userId: "433102b0-686c-424e-8540-40360d4d36d4",
              createdAt: "2021-04-11T07:11:31.854Z",
              updatedAt: "2021-04-11T07:11:31.854Z",
              __v: 0,
            },
            {
              texts: ["node"],
              _id: "6072a11f24728c3dd5776df5",
              type: "topic",
              userId: "433102b0-686c-424e-8540-40360d4d36d4",
              createdAt: "2021-04-11T07:11:27.357Z",
              updatedAt: "2021-04-11T07:11:27.357Z",
              __v: 0,
            },
          ];

          let response;

          beforeAll(async () => {
            SearchHistory.countDocuments.mockResolvedValueOnce(3);
            SearchHistory.find.mockImplementationOnce(() => ({
              limit: () => ({
                skip: () => ({
                  sort: () => {
                    return new Promise((resolve, reject) => {
                      resolve(firstPageData);
                    });
                  }
                })
              })
            }));

            response = await getRequest('/api/search/history?pageSize=2,pageNo=1', USER_ROLE_TOKENS.ADMIN);
          });

          it('return response 200', async () => {
            expect(response.status).toBe(200);
          });

          it('return empty list', async () => {
            expect(response.body).toMatchObject({ items: firstPageData, total: 3 });
          });
        });

        describe('when there is an error in retrieving data from database', () => {
          const error = new Error('Unexpected error from database ¯\_(ツ)_/¯');
          let response;

          beforeAll(async () => {
            SearchHistory.countDocuments.mockRejectedValueOnce(error);
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
            }));

            response = await getRequest('/api/search/history?pageSize=2,pageNo=3', USER_ROLE_TOKENS.ADMIN);
          });

          it('return response 500', async () => {
            expect(response.status).toBe(500);
          });

          it('return error message', async () => {
            expect(response.body).toMatchObject({ 
              error: {
                message: error.message
              }
            });
          });
        });
      });
    });

  });
});
