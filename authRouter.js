const Router = require('express');
const router = new Router();
const controller = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')

router.post('/registration',
    check("username", "Username must have at least one symbol.").notEmpty(),
    check("password", "Password must be at least one symbol.").isLength({min:1}),
    controller.registration);
router.post('/login', controller.login);
router.get('/users', authMiddleware, controller.getUsers);

module.exports = router;