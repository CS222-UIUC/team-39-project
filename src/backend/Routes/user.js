import express from 'express'
import {signupUser, loginUser} from '../Controller/userController'

const router = express.Router()

router.post('/login',loginUser)
router.post('/signup',signupUser)

module.exports = router