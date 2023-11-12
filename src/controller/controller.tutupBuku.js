const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");

const prisma = new PrismaClient();

const getAllTutupBuku = async (req, res) => {
    try{
        const dataAllTanggalTutupBuku = await prisma.tutupBuku.findMany()

        res.status(200).json(response.success(200, dataAllTanggalTutupBuku)); 

    }catch(err){
        // menampilkan error di console log
        console.log(err);

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, "Internal Server Error"));
    }
}


module.exports ={
    getAllTutupBuku
}