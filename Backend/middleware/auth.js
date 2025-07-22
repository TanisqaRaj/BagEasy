import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const bearerHeader = req.header('Authorization');
  if (!bearerHeader || !bearerHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  const token = bearerHeader.split(' ')[1]; 
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = user; 
    console.log("token verified");
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(400).json({ message: 'Invalid Token' });
  }
};

