const { PrismaClient } = require('@prisma/client')
const response = require('../utility/responModel');
const pagination = require('./../utility/pagination');

const prisma = new PrismaClient()

const getAllProduct = async (req, res) => {
    try{
        const {page,row} = pagination(req.query.page,req.query.row)
        const categoryIdByQuery = +req.query.category;
        const searchByNameQuery = req.query.search;
        

        const options = {
            where: {

            },
            orderBy: {
                id: "asc"
            },
            skip: page,
            take: row,
            include: {
                product_images: true,
                categories: true
            }
        }

        if (categoryIdByQuery) {
            options.where.categoriesId = categoryIdByQuery
        }

        if (searchByNameQuery) {
            options.where.name = {
                contains: searchByNameQuery
            }
        }

        // memangil semua data di tabel product dan foreign keynya 
        const getDataProductAll = await prisma.products.findMany(options)
    
        // menampilkan response semua data jika berhasil
        res.status(200).json(response.success(200, getDataProductAll))


    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}

const getByIdProduct = async (req, res) => {
    try{
        // mengambil id yang dimasukan user lalu ditaru ke variabels
        const id_product = +req.params.id

        const options= {
            where: {
                id: id_product
            },
            include: {
                product_images: true,
                categories: true
            }
        }

        // memangil semua data di tabel product dan foreign keynya 
        const getDataProductById = await prisma.products.findUnique(options)
    
        // menampilkan response semua data jika berhasil
        res.status(200).json(response.success(200, getDataProductById))

    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}

const createProduct = async (req, res) => {
    try{

    }catch(err){
         // menampilkan error di console log
         console.log(err)

         // menampilkan response semua data jika gagal
         return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}


module.exports = {
    getAllProduct,
    getByIdProduct,
    createProduct
}