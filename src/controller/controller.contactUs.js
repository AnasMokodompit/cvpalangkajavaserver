const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");
const pagination = require("../utility/pagination");

const prisma = new PrismaClient();

const getAllContactUs = async (req, res) => {
  try {
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const createContatUs = async (req, res) => {
  try {
    const { namaLengkap, email, pesan } = req.body;

    const options = {
      nama_lengkap: namaLengkap,
      email: email,
      pesan: pesan,
    };

    // return console.log(options)
    const dataCreateContatUs = await prisma.komentarKeKontakKami.create({
      data: options,
    });

    res.status(200).json(response.success(200, dataCreateContatUs));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

module.exports = {
  getAllContactUs,
  createContatUs,
};
