import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_interior', {
    expiresIn: '30d'
  });
};

export default generateToken;
