const authServices = import('../services/authService');

exports.loginController = async (req, res) => {
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