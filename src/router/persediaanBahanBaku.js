const express = require('express')
const router = express()
const {getAllPersediaanBahanBaku, getByIdPersediaanBahanBaku, createPersediaanBahanBakuAndBahanBaku, updatePersediaanBahanBakuAndBahanBaku, deletePersediaanBahanBakuAndBahanBaku} = require('../controller/controller.persediaanBahanBaku')
const authJWT = require('../middleware/passport-jwt')

router.get(`/`, authJWT, getAllPersediaanBahanBaku)
router.get('/:id', authJWT, getByIdPersediaanBahanBaku)
router.post('/', authJWT, createPersediaanBahanBakuAndBahanBaku)
router.patch('/:id', authJWT, updatePersediaanBahanBakuAndBahanBaku)
router.delete('/:id', authJWT, deletePersediaanBahanBakuAndBahanBaku)


module.exports = router