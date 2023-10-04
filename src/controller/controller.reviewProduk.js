const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");

const prisma = new PrismaClient();

const createRevieProduk = async (req, res) => {
    try{

        const user = req.user;


        const {user_id, products_id, bintang, komentar} = req.body

        const option = {
            products_id: Number(products_id),
            bintang: Number(bintang),
            komentar: komentar
        }

        if (user_id) {
            option.user_id = Number(user_id)
        }
        else if (user){
            option.user_id = user[0]?.id
        }

        const createRevieProdukByUser = await prisma.reviewevUserProduct.create({
            data: option
        })


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