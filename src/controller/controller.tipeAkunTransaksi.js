const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");


const prisma = new PrismaClient();

const getAlltipeAkunTransaksi = async (re1, res) => {
    try{
    
        const datatipeAkunTransaksi = await prisma.tipeAkunTransaksi.findMany()

        res.status(200).json(response.success(200, datatipeAkunTransaksi));

    }catch(err){
        // menampilkan error di console log
        console.log(err);

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, "Internal Server Error"));
    }
}

module.exports = {
    getAlltipeAkunTransaksi
}