const router = require('express').Router();
const {login, getUserById} = require('../controller/controller.user')
const authJWT = require('../middleware/passport-jwt')


router.post('/login', login)
router.get(`/:id`, getUserById)




module.exports = router;
