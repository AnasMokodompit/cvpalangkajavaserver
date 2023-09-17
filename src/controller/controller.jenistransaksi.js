const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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

    const listNamaAkunTransaksiByJenisTransaksi =
      await prisma.jenisTransaksi.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          nama: true,
          nama_akun_transaksi_dalam_jenis_transaksi: {
            select: {
              nama_akun_transaksi: {
                select: {
                  id: true,
                  kode: true,
                  nama: true,
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
  listJenisTransaksi,
  listNamaAkunTransaksiByJenisTransaksi,
};
