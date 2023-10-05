const { PrismaClient } = require("@prisma/client");
const pagination = require("./../utility/pagination");


const prisma = new PrismaClient();

const createNamaAkunTransaksi = async (req, res) => {
  try {
    const { kode, nama, id_keterangan, id_tipe_akun_transaksi } = req.body;

    const createNamaAkunTransaksi = await prisma.namaAkunTransaksi.create({
      data: {
        kode: kode,
        nama: nama,
        id_keterangan: id_keterangan,
        id_tipe_akun_transaksi: id_tipe_akun_transaksi
      },
    });

    res.status(200).json({
      status: 200,
      message: "OK",
      data: createNamaAkunTransaksi,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateNamaAkunTransaksi = async (req, res) => {
  try {
    const { id } = req.params;
    const { kode, nama, id_keterangan, id_tipe_akun_transaksi } = req.body;

    const updateNamaAkunTransaksi = await prisma.namaAkunTransaksi.update({
      where: {
        id: Number(id),
      },
      data: {
        kode: kode,
        nama: nama,
        id_keterangan: id_keterangan,
        id_tipe_akun_transaksi: id_tipe_akun_transaksi
      },
    });

    res.status(200).json({
      status: 200,
      message: "OK",
      data: updateNamaAkunTransaksi,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteNamaAkunTransaksi = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.namaAkunTransaksi.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      status: 200,
      message: "OK",
    });
  } catch (error) {
    console.log(error);
  }
};

const listNamaAkunTransaksi = async (req, res) => {
  try {
    const { page, row } = pagination(req.query.page, req.query.row);
    const searchByNameQuery = req.query.search;

    const options = {
      where: {},
      include: {
        tipe_akun_transaksi: true,
        keteranganNamaAkunTransaksi: true
      },
      skip: page,
      take: row,
    }


    if (searchByNameQuery) {
      options.where.nama = {
        contains: searchByNameQuery,
      };
    }


    const listNamaAkunTransaksi = await prisma.namaAkunTransaksi.findMany(options);

    res.status(200).json({
      status: 200,
      message: "OK",
      data: listNamaAkunTransaksi,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createNamaAkunTransaksi,
  updateNamaAkunTransaksi,
  deleteNamaAkunTransaksi,
  listNamaAkunTransaksi,
};
