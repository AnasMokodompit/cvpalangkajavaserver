const { PrismaClient } = require('@prisma/client')
const response = require('../utility/responModel');
const pagination = require('../utility/pagination');

const prisma = new PrismaClient()

const createTransaksiPengeluaran = async (req, res) => {
    try{

    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}

const getAllTansaksiPengeluaran = async (req, res) => {
    try{

    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}

module.exports = {
    createTransaksiPengeluaran,
    getAllTansaksiPengeluaran
}