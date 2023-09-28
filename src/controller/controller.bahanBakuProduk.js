const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");
const pagination = require("./../utility/pagination");

const prisma = new PrismaClient();

const createBahanBakuProduk = async (req, res) => {
    try{
        const createBahanBakuProduk = await prisma.bahanBakuProduk.create({
            data: {
                id_produk: Number(req.body.idProduk),
                id_bahan_baku: Number(req.body.idBahanBaku),
                jumlah: Number(req.body.jumlah),
                satuan: req.body.satuan
            }
        })

        return res.status(200).json(response.success(200, createBahanBakuProduk));


    }catch(err){
        // menampilkan error di console log
        console.log(err);

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, "Internal Server Error"));
    }
}

const updateBahanBakuProdukById = async (req, res) => {
    try{

        const {id} = req.params

        console.log(req.body)
        const updateBahanBakuProduk = await prisma.bahanBakuProduk.update({
            where: {
                id: Number(id)
            },
            data: {
                id_produk: Number(req.body.idProduk),
                id_bahan_baku: Number(req.body.idBahanBaku),
                jumlah: Number(req.body.jumlah),
                satuan: req.body.satuan
            }
        })

        return res.status(200).json(response.success(200, updateBahanBakuProduk));

    }catch(err){
        // menampilkan error di console log
        console.log(err);

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, "Internal Server Error"));
    }
}

const deleteBahanBakuProdukById = async (req, res) => {
    try{
        const {id} = req.params

        const deleteBahanBakuProduk = await prisma.bahanBakuProduk.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(response.success(200, deleteBahanBakuProduk));

    }catch(err){
        // menampilkan error di console log
        console.log(err);

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, "Internal Server Error"));
    }
}


module.exports = {
    createBahanBakuProduk,
    updateBahanBakuProdukById,
    deleteBahanBakuProdukById
}