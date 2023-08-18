import jwt from 'jsonwebtoken'; //library used for authentication when requesting and sending data

export const generateToken = (user) => {
  //creates a json web token for a user
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d', //after 30 days the user will be assigned a new token
    }
  );
};

export const isAuth = (req, res, next) => {
  //isAuth is a middleware that verifies a request is authenticated with a json web token
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX (gets rid of Bearer to leave just the token)
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      //built in verification function from JWT
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode; //payload of the token
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};
