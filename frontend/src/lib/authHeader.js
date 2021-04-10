import jwt from 'jsonwebtoken';

export const getAuthHeader = async (user) => {
  const privateKey = 'my-private-key';

  const token = await jwt.sign(user, privateKey);

  return `Bearer ${token}`;
};