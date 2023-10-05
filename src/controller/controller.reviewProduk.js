const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");

const prisma = new PrismaClient();

const createRevieProduk = async (req, res) => {
    try{

        const user = req.user[0];


        const {user_id, products_id, bintang, komentar, id_produk_order} = req.body

        const option = {
            products_id: Number(products_id),
            bintang: Number(bintang),
            komentar: komentar
        }

        if (user){
            option.user_id = user.id
        }

        const createRevieProdukByUser = await prisma.reviewevUserProduct.create({
            data: option
        })

        if (createRevieProdukByUser) {
            await prisma.product_Orders.update({
                where: {
                    id: Number(id_produk_order)
                },
                data: {
                    statusReview: true
                }
            })
        }

        return res.status(201).json(response.success(201, createRevieProdukByUser));

    }catch(err){
        // menampilkan error di console log
        console.log(err);

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, "Internal Server Error"));
    }
}


module.exports = {
    createRevieProduk
}