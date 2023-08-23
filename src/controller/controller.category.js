const { PrismaClient } = require('@prisma/client')
const response = require('../utility/responModel');
const pagination = require('./../utility/pagination');

const prisma = new PrismaClient()


const getAllCategories = async (req, res) => {
    try{
        const getDataCategoryAll = await prisma.categories.findMany()

        res.status(200).json(response.success(200, getDataCategoryAll))


    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}

module.exports = {
    getAllCategories
}