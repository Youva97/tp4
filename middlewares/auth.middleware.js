const { User } = require('../models/index');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'token_invalid' });
  }
  const user = await User.findOne({ where: { token } });
  if (!user) {
    return res.status(401).json({ error: 'token_invalid' });
  }
  // on stocke l'utilisateur dans la requête pour le récupérer dans le controller si besoin
  req.user = user;
  // on appel next() pour continuer le traitement de la requête dans le controller
  next();
};