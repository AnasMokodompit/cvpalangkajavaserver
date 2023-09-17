const { PrismaClient } = require('@prisma/client')
const response = require('../utility/responModel');
const pagination = require('./../utility/pagination');
const cloudinary = require('../utility/cloudinary')
const uploadCloudinary = async (path, opts) => await cloudinary.CloudinaryUpload(path,opts)
const fs = require('fs')



const prisma = new PrismaClient()

const getAllProductOrder = async (req, res) => {
    try{
        const {order_id} = req.query
        const user = req.user[0]



        const options = {
            where: {},
            include: {
                products: {
                    include: {
                        categories: true,
                        product_images: true
                    }
                },
                orders: {
                    include: {
                        buktiBayar: true
                    }
                }
            }
        }

        if (user.rolesId !== 1) {
            options.where.id_orders = order_id
        }else{
            options.include.users = true
        }

        const cekProductUserPesanan = await prisma.product_Orders.findMany(options)


        console.log(cekProductUserPesanan)

        res.status(200).json(response.success(200, cekProductUserPesanan))


    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}


const getAllProductOrderByIdOrder = async ( req, res) => {
    try{
        const {order_id, id_user} = req.query
        const user = req.user[0]

        // return console.log(user, order_id, id_user)

        const options = {
            where: {},
            include: {
                products: {
                    include: {
                        categories: true,
                        product_images: true
                    }
                },
                orders: {
                    include: {
                        buktiBayar: true
                    }
                }
            }
        }

        if (user.rolesId !== 1) {
            options.where.id_user= user.id
        }
        
        if (order_id) {
            options.where.id_user= user.id
            options.where.id_orders = Number(order_id)
            options.where.id_user = Number(id_user)
        }

        const cekProductUserPesanan = await prisma.product_Orders.findMany(options)


        console.log(cekProductUserPesanan)

        res.status(200).json(response.success(200, cekProductUserPesanan))

    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}


const updatbyIdProductOrder = async (req, res) => {
    try{
        const product_order_id = req.params.id

        // if (req.body.status) {

            const productOrder = await prisma.product_Orders.update({
                where: {
                  id: Number(product_order_id)
                },
                data: {
                    status: req.body.status
                }
            })
              
          
            return res.status(200).json(response.success(200, productOrder))
        // }
        

    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}


module.exports = {
    getAllProductOrder,
    getAllProductOrderByIdOrder,
    updatbyIdProductOrder,
}