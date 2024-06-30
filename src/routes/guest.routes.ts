import { Router } from 'express'
const router = Router()

import *as guest from '../controllers/guest'

router.get('/', guest.test)
router.get('/registro', guest.test)
router.get('/login', guest.test)
router.get('/catalogo', guest.test)

export default router