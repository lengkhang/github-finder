import jwt from 'jsonwebtoken';

export const getJwt = (req, res, next) => {
  const { authorization = '' } = req.headers;
  const bearerString = "Bearer ";
  let token;

  if (authorization.startsWith(bearerString)){
    token = authorization.substring(bearerString.length, authorization.length);

    const { id, role } = jwt.decode(token);
    req.currentUser = { id, role };

    return next();
  }

  return res.status(401).json({ error: { message: 'Missing authorization header' } });
};

export const adminRoleRequired = (req, res, next) => {
  const { role } = req.currentUser || {};

  if (role === 'admin') {
    return next();
  }

  return res.status(401).json({ error: { message: 'Only admin can perform this action' } });
}