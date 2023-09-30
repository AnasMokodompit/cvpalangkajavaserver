const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createJenisTransaksi = async (req, res) => {
  try {
    const { nama } = req.body;

    const createJenisTransaksi = await prisma.jenisTransaksi.create({
      data: {
        nama: nama,
      },
    });

    res.status(200).json({
      status: 200,
      message: "OK",
      data: createJenisTransaksi,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateJenisTransaksi = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;

    const updateJenisTransaksi = await prisma.jenisTransaksi.update({
      where: {
        id: Number(id),
      },
      data: {
        nama: nama,
      },
    });

    res.status(200).json({
      status: 200,
      message: "OK",
      data: updateJenisTransaksi,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteJenisTransaksi = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.jenisTransaksi.delete({
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

const listJenisTransaksi = async (req, res) => {
  try {
    const listJenisTransaksi = await prisma.jenisTransaksi.findMany();

    res.status(200).json({
      status: 200,
      message: "OK",
      data: listJenisTransaksi,
    });
  } catch (error) {
    console.log(error);
  }
};

const listNamaAkunTransaksiByJenisTransaksi = async (req, res) => {
  try {
    const { id } = req.params;

    // return console.log(id)

    const listNamaAkunTransaksiByJenisTransaksi = await prisma.jenisTransaksi.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        nama: true,
        nama_akun_transaksi_dalam_jenis_transaksi: {
          select: {
            id: true,
            nama: true,
            akunTransaksi: {
              select: {
                id: true,
                namaAkunTransaksi: {
                  include: {
                    tipe_akun_transaksi: true
                  }
                },
                kategori_akun: true
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      status: 200,
      message: "OK",
      data: listNamaAkunTransaksiByJenisTransaksi,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createJenisTransaksi,
  deleteJenisTransaksi,
  listJenisTransaksi,
  listNamaAkunTransaksiByJenisTransaksi,
  updateJenisTransaksi,
};
