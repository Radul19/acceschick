import { Router } from 'express'
const router = Router()

import *as guest from '../controllers/guest'

router.get('/', guest.file)
router.get('/registro', guest.file)
router.get('/login', guest.file)
router.get('/catalogo', guest.file)

router.post('/test', guest.test)
router.post('/register', guest.register)
router.post('/login', guest.login)
router.post('/createItem', guest.createItem)
router.post('/editItem', guest.editItem)
router.post('/deleteItem', guest.deleteItem)
router.post('/toggleHeart', guest.toggleHeart)
router.post('/toggleCart', guest.toggleCart)
router.post('/addColor', guest.addColor)
router.post('/editUser', guest.editUser)

router.post('/removePic', guest.removePic)
router.get('/getItems', guest.getItems)
// router.get('/catalogo', guest.test)
// router.get('/catalogo', guest.test)
// router.get('/catalogo', guest.test)
// router.get('/catalogo', guest.test)

export default router