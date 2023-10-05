const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");
const pagination = require("../utility/pagination");

const prisma = new PrismaClient();

const getAllContactUs = async (req, res) => {
  try {
    const searchByNameQuery = req.query.search;
    const { page, row } = pagination(req.query.page, req.query.row);

    const option = {
      where: {},
      orderBy: {
        // id: "asc",
        id: "desc",
      },
      skip: page,
      take: row,
    }

    if (searchByNameQuery) {
      option.where.nama_lengkap = {
        contains: searchByNameQuery,
      };
    }

    const dataSemuaPesan = await prisma.komentarKeKontakKami.findMany(option)

    res.status(200).json(response.success(200, dataSemuaPesan));

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

    res.status(201).json(response.success(201, dataCreateContatUs));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const deleteContatUs = async (req, res) => {
  try{
    const {id} = req.params

    const deleteContatcUs = await prisma.komentarKeKontakKami.delete({
      where: {
        id: Number(id)
      }
    })

    res.status(201).json(response.success(201, deleteContatcUs));

  }catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
}

module.exports = {
  getAllContactUs,
  createContatUs,
  deleteContatUs
};
