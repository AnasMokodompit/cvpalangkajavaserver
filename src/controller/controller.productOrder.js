const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");
const pagination = require("./../utility/pagination");
const cloudinary = require("../utility/cloudinary");
const uploadCloudinary = async (path, opts) => await cloudinary.CloudinaryUpload(path, opts);
const fs = require("fs");

const prisma = new PrismaClient();

const getAllProductOrder = async (req, res) => {
  try {
    const { order_id } = req.query;
    const user = req.user[0];

    const options = {
      where: {},
      include: {
        products: {
          include: {
            categories: true,
            product_images: true,
          },
        },
        orders: {
          include: {
            buktiBayar: true,
          },
        },
      },
    };

    if (user.rolesId !== 1) {
      options.where.id_orders = order_id;
    } else {
      options.include.users = true;
    }

    const cekProductUserPesanan = await prisma.product_Orders.findMany(options);

    console.log(cekProductUserPesanan);

    res.status(200).json(response.success(200, cekProductUserPesanan));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getAllProductOrderByIdOrder = async (req, res) => {
  try {
    const { order_id, id_user, statusKategori} = req.query;
    const user = req.user[0];

    // return console.log(user, order_id, id_user)

    const options = {
      where: {},
      include: {
        products: {
          include: {
            categories: true,
            product_images: true,
          },
        },
        orders: {
          include: {
            buktiBayar: true,
          },
        },
      },
    };

    if (user.rolesId !== 1) {
      options.where.id_user = user.id;

      console.log(statusKategori)
      if (statusKategori == "Daftar Pesanan") {
        options.where.pesan_status = null
        options.where.tanggal_pengerjaan = null
      }else if (statusKategori == "Pesanan Diproses") {
        options.where.NOT = { pesan_status: null }
        options.where.NOT = { tanggal_pengerjaan: null }
      }else if (statusKategori == "Pesanan Selesai"){
        options.where.NOT = { pesan_status: null }
        options.where.tanggal_pengerjaan = null
      }
    }

    if (order_id) {
      options.where.id_user = user.id;
      options.where.id_orders = Number(order_id);
      options.where.id_user = Number(id_user);
    }

    const cekProductUserPesanan = await prisma.product_Orders.findMany(options);

    // console.log(cekProductUserPesanan);

    return res.status(200).json(response.success(200, cekProductUserPesanan));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getAllProductOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user[0];

    // return console.log(user, order_id, id_user)

    const options = {
      where: {
        id: Number(id),
      },
      include: {
        products: {
          include: {
            categories: true,
            product_images: true,
          },
        },
        orders: {
          include: {
            buktiBayar: true,
          },
        },
      },
    };

    if (user.rolesId !== 1) {
      options.where.id_user = user.id;
    }

    const cekProductOrderUserPesananById = await prisma.product_Orders.findUnique(options);

    console.log(cekProductOrderUserPesananById);

    res.status(200).json(response.success(200, cekProductOrderUserPesananById));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const updatbyIdProductOrder = async (req, res) => {
  try {
    const product_order_id = req.params.id;

    const CekproductOrder = await prisma.product_Orders.findUnique({
      where: {
        id: Number(product_order_id),
      },
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    // Pengecekan Persediaan Barang Jika produk Diterima
    // console.log(req.body.status);
    let ResultError = [];
    if (req.body.status == 2) {
      const idProductOrder = CekproductOrder.products.id;

      const cekBahanBakuProduk = await prisma.bahanBakuProduk.findMany({
        where: {
          id_produk: idProductOrder,
        },
      });

      await Promise.all(
        cekBahanBakuProduk.map(async (data) => {
          data.jumlah = data.jumlah * CekproductOrder.jumlah;
          // id_bahan_baku.push(data.id_bahan_baku)

          if (CekproductOrder.jumlah_meter) {
            data.jumlah = data.jumlah * CekproductOrder.jumlah_meter
          }
          
          console.log(data.jumlah, "ProdukOrder")

          const cekPersediaanBahanBaku = await prisma.persediaanBahanBaku.findMany({
            where: {
              id_bahan_baku: data.id_bahan_baku,
              satuan: data.satuan,
            },
            include: {
              bahanBaku: {
                select: {
                  nama: true,
                },
              },
            },
          });
          
          cekPersediaanBahanBaku[0].idProductOrder = idProductOrder;

          const resultJumlah = cekPersediaanBahanBaku[0].jumlah - data.jumlah;

          console.log(cekPersediaanBahanBaku[0], resultJumlah);

          console.log(resultJumlah < 0);
          if (resultJumlah < 0) {
            // console.log(cekPersediaanBahanBaku[0])
            return ResultError.push(cekPersediaanBahanBaku[0]);
          }
        }),
      );
    }


    if (ResultError.length !== 0) {
      console.log(ResultError);
      return res.status(404).json(response.error(404, ResultError));
    }

    const productOrder = await prisma.product_Orders.update({
      where: {
        id: Number(product_order_id),
      },
      data: {
        status: req.body.status,
      },
      include: {
        orders: true,
      },
    });

    const dataUpdateOrder = {};

    if (CekproductOrder.status === 1 && req.body.status === 2) {
      dataUpdateOrder.jumlah = productOrder.orders.jumlah + CekproductOrder.jumlah;
      dataUpdateOrder.Price = productOrder.orders.Price + CekproductOrder.Price;
    } else if (CekproductOrder.status === 2 && req.body.status === 1) {
      dataUpdateOrder.jumlah = productOrder.orders.jumlah - CekproductOrder.jumlah;
      dataUpdateOrder.Price = productOrder.orders.Price - CekproductOrder.Price;
    } else if (CekproductOrder.status == 0 && req.body.status === 1) {
      dataUpdateOrder.jumlah = productOrder.orders.jumlah - CekproductOrder.jumlah;
      dataUpdateOrder.Price = productOrder.orders.Price - CekproductOrder.Price;
    }

    await prisma.orders.update({
      where: {
        id: productOrder.id_orders,
      },
      data: dataUpdateOrder,
    });

    return res.status(200).json(response.success(200, productOrder));
    // }
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getAllProdukOrderDiterimaById = async (req, res) => {
  try{
    const {id_orders} = req.query

    const dataProdukOrderByidOrderTerima = await prisma.product_Orders.findMany({
      where: {
        id_orders: Number(id_orders),
        status: 2
      },
      select: {
        id: true,
        products: {
          select: {
            name: true
          },
        }
      }
    })

    // console.log(dataProdukOrderByidOrderTerima)
    return res.status(200).json(response.success(200, dataProdukOrderByidOrderTerima));

  }catch(err){
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
}

const updateProdukOrderDiterimaById = async (req, res) => {
  try{
    const {id} = req.params
    const {pesan_status, tanggal_pengerjaan} = req.body

    console.log(id)

    const upateProdukOrder = await prisma.product_Orders.update({
      where: {
        id: Number(id)
      },
      data: {
        pesan_status: pesan_status,
        tanggal_pengerjaan: tanggal_pengerjaan
      }
    })

    return res.status(200).json(response.success(200, upateProdukOrder));

  }catch(err){
      // menampilkan error di console log
      console.log(err);

      // menampilkan response semua data jika gagal
      return res.status(500).json(response.error(500, "Internal Server Error"));
  }
}

module.exports = {
  getAllProductOrder,
  getAllProductOrderByIdOrder,
  getAllProductOrderById,
  updatbyIdProductOrder,
  getAllProdukOrderDiterimaById,
  updateProdukOrderDiterimaById
};
