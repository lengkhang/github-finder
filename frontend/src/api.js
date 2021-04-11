export const searchRepositories = async ({ texts, type }) => {
  const query = `${type}=${texts}`;

  const response = await fetch(`${process.env.REACT_APP_API_URL}/search?${query}&pageSize=100&pageNo=1`);

  if (!response.ok) {
    throw new Error('Something wrong');
  }

  return response.json();
};