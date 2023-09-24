const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");
const pagination = require("./../utility/pagination");

const prisma = new PrismaClient();

const getAllBahanBaku = async (req, res) => {
  try {
    const { searchName } = req.query;

    const options = {
      where: {},
    };

    if (searchName) {
      options.where.nama = {
        contains: searchName,
      };
    }

    const dataBahanBaku = await prisma.bahanBaku.findMany(options);

    // console.log(dataPersediaanBarangBaku)
    res.status(200).json(response.success(200, dataBahanBaku));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getByIdBahanBaku = async (req, res) => {
  try {
    const { id } = req.params;

    const dataBahanBakuById = await prisma.bahanBaku.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        persediaanBahanBaku: true,
      },
    });

    res.status(200).json(response.success(200, dataBahanBakuById));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

module.exports = {
  getAllBahanBaku,
  getByIdBahanBaku,
};
