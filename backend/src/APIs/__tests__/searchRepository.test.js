import { USER_ROLE_TOKENS } from '../__mocks__/userTokens';
import { mockOctokit, mockSearchHistory } from '../__mocks__/mocks';
import SearchHistory from '../../models/searchHistory';
import request from 'supertest';

describe('GET /search', () => {
  async function getRequest(url, authHeader = '') {
    const app = await (require('../../bootstrap/appBootstrapper').default)();

    return request(app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', authHeader);
  }

  describe('when no authorization header is provided', () => {
    let response;

    beforeAll(async () => {
      response = await getRequest('/api/search');
    });

    it('return response 401', async () => {
      expect(response.status).toBe(401);
    });

    it('return error message', async () => {
      expect(response.body.error.message).toBe('Missing authorization header');
    });
  });

  describe('when admin authorization header is provided', () => {
    describe.each([
      ['topic=', null, null, 'ValidationError: \"topic\" is not allowed to be empty'],
      ['language=', null, null, 'ValidationError: \"language\" is not allowed to be empty'],
      ['topic=car', null, 1, 'ValidationError: "pageSize" contains an invalid value'],
      ['topic=car', null, 1, 'ValidationError: "pageSize" contains an invalid value'],
      ['topic=car', 'abc', 1, 'ValidationError: "pageSize" contains an invalid value'],
      ['language=go', 0, 1, 'ValidationError: "pageSize" contains an invalid value'],
      ['language=go', 1, null, 'ValidationError: "pageNo" contains an invalid value'],
      ['language=go', 1, 'abc', 'ValidationError: "pageNo" contains an invalid value'],
      ['language=go', 1, 0, 'ValidationError: "pageNo" contains an invalid value'],
      ['', 1, 1, 'ValidationError: Either "language" and "topic" must contain value']
    ])('when invalid query string is provided (pageSize: %s, pageNo: %s)', (searchQuery, pageSize, pageNo, errorMessage) => {
      let response;

      beforeAll(async () => {
        response = await getRequest(`/api/search?${searchQuery}&pageSize=${pageSize}&pageNo=${pageNo}`, USER_ROLE_TOKENS.USER);
      });

      it('return response 422', async () => {
        expect(response.status).toBe(422);
      });

      it('return error message', async () => {
        expect(response.body).toMatchObject({
          error: {
            message: errorMessage
          }
        });
      });
    });

    describe('when valid query string is provided', () => {
      describe('when user search for language', () => {
        describe('when no result found', () => {
          let response;
          let mockSearchRepos;
          let mockSave;
  
          beforeAll(async () => {
            ({ mockSearchRepos } = mockOctokit());
            ({ mockSave } = mockSearchHistory());
  
            mockSearchRepos.mockResolvedValueOnce({ 
              data: {
                total_count: 0,
                items: []
              }
            });
            mockSave.mockResolvedValueOnce();
  
  
            response = await getRequest('/api/search?language=car&pageSize=2&pageNo=1', USER_ROLE_TOKENS.ADMIN);
          });
  
          it('return response 200', async () => {
            expect(response.status).toBe(200);
          });
  
          it('return empty list', async () => {
            expect(response.body).toMatchObject({ items: [], total: 0 });
          });
        });

        describe('when results found', () => {
          const expectedRepos = [{
            'full_name': 'dart/dart',
            description: 'something',
            language: 'dart',
            topics: ['dart', 'flutter']
          }];

          let response;
          let mockSearchRepos;
          let mockSave;
  
          beforeAll(async () => {
            ({ mockSearchRepos } = mockOctokit());
            ({ mockSave } = mockSearchHistory());
  
            mockSearchRepos.mockResolvedValueOnce({ 
              data: {
                total_count: 1,
                items: expectedRepos
              }
            });
            mockSave.mockResolvedValueOnce();
  
  
            response = await getRequest('/api/search?language=dart,go&pageSize=2&pageNo=1', USER_ROLE_TOKENS.ADMIN);
          });
  
          it('return response 200', async () => {
            expect(response.status).toBe(200);
          });
  
          it('return empty list', async () => {
            expect(response.body).toMatchObject({ items: expectedRepos, total: 1 });
          });
        });

        describe('when received error from github api', () => {
          const error = new Error('Rate limit!');
          let response;
          let mockSearchRepos;
          let mockSave;
  
          beforeAll(async () => {
            ({ mockSearchRepos } = mockOctokit());
            ({ mockSave } = mockSearchHistory());
  
            mockSearchRepos.mockRejectedValueOnce(error);
            mockSave.mockResolvedValueOnce();
  
  
            response = await getRequest('/api/search?language=car&pageSize=2&pageNo=1', USER_ROLE_TOKENS.ADMIN);
          });
  
          it('return response 500', async () => {
            expect(response.status).toBe(500);
          });
  
          it('return empty list', async () => {
            expect(response.body).toMatchObject({
              error: {
                message: error.message
              }
             });
          });
        });

        describe('when received error from saving into database', () => {
          const error = new Error('Unable to save into database for whatever reason (??????????)?????? ?????????');
          let response;
          let mockSearchRepos;
          let mockSave;
  
          beforeAll(async () => {
            ({ mockSearchRepos } = mockOctokit());
            ({ mockSave } = mockSearchHistory());
  
            mockSearchRepos.mockResolvedValueOnce({ 
              data: {
                total_count: 0,
                items: []
              }
            });
            mockSave.mockRejectedValueOnce(error);
  
  
            response = await getRequest('/api/search?language=car&pageSize=2&pageNo=1', USER_ROLE_TOKENS.ADMIN);
          });
  
          it('return response 500', async () => {
            expect(response.status).toBe(500);
          });
  
          it('return empty list', async () => {
            expect(response.body).toMatchObject({
              error: {
                message: error.message
              }
             });
          });
        });
      });

      describe('when user search for topic', () => {
        describe('when no result found', () => {
          let response;
          let mockSearchRepos;
          let mockSave;
  
          beforeAll(async () => {
            ({ mockSearchRepos } = mockOctokit());
            ({ mockSave } = mockSearchHistory());
  
            mockSearchRepos.mockResolvedValueOnce({ 
              data: {
                total_count: 0,
                items: []
              }
            });
            mockSave.mockResolvedValueOnce();
  
  
            response = await getRequest('/api/search?topic=nothing&pageSize=2&pageNo=1', USER_ROLE_TOKENS.ADMIN);
          });
  
          it('return response 200', async () => {
            expect(response.status).toBe(200);
          });
  
          it('return empty list', async () => {
            expect(response.body).toMatchObject({ items: [], total: 0 });
          });
        });

        describe('when results found', () => {
          const expectedRepos = [{
            'full_name': 'dart/dart',
            description: 'something',
            language: 'dart',
            topics: ['dart', 'react-native']
          }];

          let response;
          let mockSearchRepos;
          let mockSave;
  
          beforeAll(async () => {
            ({ mockSearchRepos } = mockOctokit());
            ({ mockSave } = mockSearchHistory());
  
            mockSearchRepos.mockResolvedValueOnce({ 
              data: {
                total_count: 1,
                items: expectedRepos
              }
            });
            mockSave.mockResolvedValueOnce();
  
  
            response = await getRequest('/api/search?topic=flutter,native&pageSize=2&pageNo=1', USER_ROLE_TOKENS.ADMIN);
          });
  
          it('return response 200', async () => {
            expect(response.status).toBe(200);
          });
  
          it('return empty list', async () => {
            expect(response.body).toMatchObject({ items: expectedRepos, total: 1 });
          });
        });

        describe('when received error from github api', () => {
          const error = new Error('Rate limit!');
          let response;
          let mockSearchRepos;
          let mockSave;
  
          beforeAll(async () => {
            ({ mockSearchRepos } = mockOctokit());
            ({ mockSave } = mockSearchHistory());
  
            mockSearchRepos.mockRejectedValueOnce(error);
            mockSave.mockResolvedValueOnce();
  
  
            response = await getRequest('/api/search?topic=nothing&pageSize=2&pageNo=1', USER_ROLE_TOKENS.ADMIN);
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

        describe('when received error from saving into database', () => {
          const error = new Error('Unable to save into database for whatever reason (??????????)?????? ?????????');
          let response;
          let mockSearchRepos;
          let mockSave;
  
          beforeAll(async () => {
            ({ mockSearchRepos } = mockOctokit());
            ({ mockSave } = mockSearchHistory());
  
            mockSearchRepos.mockResolvedValueOnce({ 
              data: {
                total_count: 0,
                items: []
              }
            });
            mockSave.mockRejectedValueOnce(error);
  
  
            response = await getRequest('/api/search?topic=nothing&pageSize=2&pageNo=1', USER_ROLE_TOKENS.ADMIN);
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
