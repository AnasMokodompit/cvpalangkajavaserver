const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");
const pagination = require("../utility/pagination");

const prisma = new PrismaClient();

const createTransaksiPemasukan = async (req, res) => {
  try {
    const { product_orders_id, user_id, uang, statusTransaksi } = req.body;

    // return console.log(uang)

    const optionsPemasukan = {
      product_orders_id: product_orders_id,
      user_id: user_id,
      uang: uang,
    };

    const dataCreatePemasukan = await prisma.pemasukan.create({
      data: optionsPemasukan,
    });

    if (!dataCreatePemasukan) {
      return res.status(400).json(response.error(400, "Pemasukan Gagal Ditambahkan"));
    }

    const saldo = await prisma.saldo.findUnique({
      where: {
        id: 1,
      },
    });

    if (!saldo) {
      await prisma.saldo.create({
        data: {
          total_uang: uang,
        },
      });
    } else {
      const jumlahSaldo = saldo.total_uang + uang;

      await prisma.saldo.update({
        where: {
          id: 1,
        },
        data: {
          total_uang: jumlahSaldo,
        },
      });
    }

    // await prisma.product_Orders.update({
    //     where: {
    //         id: product_orders_id
    //     },
    //     data: {
    //         statusTransaksi: statusTransaksi
    //     }
    // })

    const createTransaksi = await prisma.transaksi.create({
      data: {
        pemasukan_id: dataCreatePemasukan.id,
        total_uang: uang,
      },
    });

    return res.status(201).json(response.success(201, createTransaksi));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getTransaksiPemasukan = async (req, res) => {
  try {
    const options = {
      where: {},
      include: {
        pemasukan: {
          include: {
            product_Orders: true,
            users: true,
          },
        },
      },
    };

    const getAllTransaksi = await prisma.transaksi.findMany(options);

    return res.status(200).json(response.success(200, getAllTransaksi));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getTransaksiPemasukanById = async (req, res) => {
  try {
    const { transaksi_id } = req.params;

    const options = {
      where: {
        id: transaksi_id,
      },
      include: {
        pemasukan: {
          include: {
            product_Orders: true,
            users: true,
          },
        },
      },
    };

    const getAllTransaksi = await prisma.transaksi.findUnique(options);

    return res.status(200).json(response.success(200, getAllTransaksi));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

module.exports = {
  createTransaksiPemasukan,
  getTransaksiPemasukan,
  getTransaksiPemasukanById,
};
