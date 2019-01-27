import Express from 'express';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';

// We already verified for the `JWT_SECRET` env. variable to be present in the
// `index.ts` file.
const JWT_SECRET = process.env['JWT_SECRET'] as string;

const routes = Express.Router();
const jwtSignOptions: jwt.SignOptions = {
  expiresIn: 86400,
};

/**
 * This endpoint is meant to be used by other tools, not by the user from the
 * web-interface.
 */
routes.get('/', async (req, res) => {
  const secret = req.query['secret'];

  if (!secret || secret !== JWT_SECRET) {
    return res.status(400).send({
      auth: false,
      token: null,
    });
  }

  const tokenUUID = uuid.v4();
  const token = jwt.sign({ id: tokenUUID }, JWT_SECRET, jwtSignOptions);

  res.status(200).send({
    auth: true,
    token,
  });
});

export default routes;
