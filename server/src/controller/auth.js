const authServices = require('../services/authService');

exports.loginController = async (req, res) => {
  console.log(req.body, "controller");
  try {
    (await authServices).loginService(req, res);
  } catch (error) {
    return res.status(500).send({ message: 'Login email or password are incorrect' });
  }
}

exports.registerController = async (req, res) => {
  try {
    (await authServices).registerService(req, res);
  } catch (error) {
    return res.status(500).send({ message: 'Error occured while registering' });
  }
}

exports.logoutController = async (req, res) => {
  // try {
  //   (await authServices).loginService(req, res);
  // } catch (error) {
  //   return res.status(500).send({ message: 'Login email or password are incorrect' });
  // }
  return res.status(200).send({ message: 'Logout successful' });
}