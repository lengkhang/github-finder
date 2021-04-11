export const mockOctokit = () => {
  const mockSearchRepos = jest.fn();

  jest.mock('@octokit/rest', () => ({
    Octokit: jest.fn().mockImplementation(() => ({
      rest: {
        search: {
          repos: mockSearchRepos
        }
      }
    }))
  }));

  return { mockSearchRepos };
}

export const mockSearchHistory = () => {
  const mockSave = jest.fn();

  jest.mock('../../models/searchHistory', () => {
    return jest.fn().mockImplementation(() => ({
      save: mockSave
    }));
  });

  return { mockSave };
}