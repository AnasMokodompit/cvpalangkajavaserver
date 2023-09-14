const { PrismaClient } = require('@prisma/client')
const response = require('../utility/responModel');
const pagination = require('./../utility/pagination');

const prisma = new PrismaClient()

const createOrder = async (req, res) => {
    try{
        

        const {dataOrder} = req.body
        let jumlah = 0
        let jumlahHarga = 0

        dataOrder.map((data) => {
            data.id_product = data.id
            delete data.url_image
            delete data.name
            delete data.tipe
            delete data.harga
            delete data.id
        })

        dataOrder.map((data) => {
            jumlah += data.jumlah
            jumlahHarga += data.jumlahHarga
        })

        const createUser = await prisma.users.create({
            data: {
                name: req.body.namePemesan,
                email: req.body.email,
                rolesId: 2,
                nomor_hp: req.body.noHp,
                alamat: req.body.alamat,
                password: 'customers1234'
            }
        })

        const options = {
            nama_pemesan : req.body.namePemesan,
            no_hp : req.body.noHp,
            alamat : req.body.alamat,
            status: false,
            Price: jumlahHarga,
            jumlah: jumlah,
            id_user: createUser.id
        }


        const createOrder = await prisma.orders.create({
            data: options
        })

        if (createOrder) {
            dataOrder.map((data) => {
                data.id_orders = createOrder.id
                data.Price = data.jumlahHarga
                data.id_user = createUser.id
                data.status = 0
                delete data.jumlahHarga
            })
        }

        await prisma.product_Orders.createMany({
            data: dataOrder,
        })

        const findOrders = await prisma.orders.findUnique({
            where: {
                id: createOrder.id
            },
            include: {
                users: true,
            }
        })

        console.log(dataOrder, jumlah, jumlahHarga)

        res.status(200).json(response.success(200, findOrders))


    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}


const getAllOrder = async (req, res) => {
    try{
        const {page,row} = pagination(req.query.page,req.query.row)
        const searchByNameQuery = req.query.search;
        const {id_user} = req.query

        // return console.log(id_user)

        const options = {
            where: {

            },
            orderBy: {
                id: "asc"
            },
            skip: page,
            take: row,
            include: {
                product_Orders: {
                    include: {
                        products: {
                            include: {
                                product_images: true,
                                categories: true
                            }
                        }
                    }
                }
            }
        }

        if (searchByNameQuery) {
            options.where.nama_pemesan = {
                contains: searchByNameQuery
            }
        }

        if (id_user) {
            options.where.id_user = Number(id_user)
        }

        // memangil semua data di tabel product dan foreign keynya 
        const getDataOrdertAll = await prisma.orders.findMany(options)
    
        // menampilkan response semua data jika berhasil
        res.status(200).json(response.success(200, getDataOrdertAll))

    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}

const deleteOrder = async (req, res) => {
    try{

        const {id} = req.params

        const deleteProductOrder = await prisma.product_Orders.deleteMany({
            where: {
                id_orders: Number(id)
            }
        })
        

        const deleteOrder = await prisma.orders.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).json(response.success(200, deleteOrder))

    }catch(err){
        // menampilkan error di console log
        console.log(err)

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, 'Internal Server Error'))
    }
}


module.exports = {
    createOrder,
    getAllOrder,
    deleteOrder
}