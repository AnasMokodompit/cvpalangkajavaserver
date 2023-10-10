const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");
const pagination = require("./../utility/pagination");

const prisma = new PrismaClient();

const createOrder = async (req, res) => {
  try {
    const { dataOrder } = req.body;
    let jumlah = 0;
    let jumlahHarga = 0;

    dataOrder.map((data) => {
      data.id_product = data.id;
      delete data.url_image;
      delete data.name;
      delete data.tipe;
      delete data.harga;
      delete data.id;
      delete data.IsPermeter
    });

    dataOrder.map((data) => {
      jumlah += data.jumlah;
      jumlahHarga += data.jumlahHarga;
    });

    const options = {
      nama_pemesan: req.body.namePemesan,
      no_hp: req.body.noHp,
      alamat: req.body.alamat,
      status: req.body.status,
      Price: jumlahHarga,
      jumlah: jumlah,
    };

    const cekUser = await prisma.users.findMany({
      where: {
        email: {
          contains: req.body.email
        }
      }
    })

    console.log(cekUser)

    let createUser = []
    if (cekUser.length == 0) {
      
      createUser = await prisma.users.create({
        data: {
          name: req.body.namePemesan,
          email: req.body.email,
          rolesId: 2,
          nomor_hp: req.body.noHp,
          alamat: req.body.alamat,
          password: "customers1234",
        },
      });

      options.id_user = createUser.id
    }else{      
      options.id_user = cekUser[0].id
    }

    const createOrder = await prisma.orders.create({
      data: options,
    });

    if (createOrder) {
      dataOrder.map((data) => {
        if (cekUser.length == 0) {
          data.id_user = createUser.id;
        }else{
          data.id_user = cekUser[0].id
        }
        data.id_orders = createOrder.id;
        data.Price = data.jumlahHarga;
        data.status = 0;
        delete data.jumlahHarga;
      });
    }

    await prisma.product_Orders.createMany({
      data: dataOrder,
    });

    const findOrders = await prisma.orders.findUnique({
      where: {
        id: createOrder.id,
      },
      include: {
        users: true,
        product_Orders: true,
      },
    });

    console.log(dataOrder, jumlah, jumlahHarga);

    res.status(200).json(response.success(200, findOrders));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getAllOrder = async (req, res) => {
  try {
    const { page, row } = pagination(req.query.page, req.query.row);
    const searchByNameQuery = req.query.search;
    const { id_user } = req.query;

    // return console.log(id_user)

    const options = {
      where: {},
      orderBy: {
        id: "asc",
      },
      skip: page,
      take: row,
      include: {
        users: true,
        product_Orders: {
          include: {
            products: {
              include: {
                product_images: true,
                categories: true,
              },
            },
          },
        },
      },
    };

    if (searchByNameQuery) {
      options.where.nama_pemesan = {
        contains: searchByNameQuery,
      };
    }

    if (id_user) {
      options.where.id_user = Number(id_user);
    }

    // memangil semua data di tabel product dan foreign keynya
    const getDataOrdertAll = await prisma.orders.findMany(options);

    // menampilkan response semua data jika berhasil
    res.status(200).json(response.success(200, getDataOrdertAll));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusTransaksi } = req.body;

    console.log(id, statusTransaksi);

    const options = {
      where: {
        id: Number(id),
      },
      data: {},
    };

    // Cek Produk Order dengan Id Oder yang sama
    const produk_order = await prisma.product_Orders.findMany({
      where: {
        id_orders: Number(id),
      },
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    produk_order.map(async (data, key) => {
      const cekBahanBakuProduk = await prisma.bahanBakuProduk.findMany({
        where: {
          id_produk: data.id_product,
        },
      });

      cekBahanBakuProduk.map(async (dataa, key) => {
        dataa.jumlah = data.jumlah * dataa.jumlah;

        const cekPersediaanBahanBaku = await prisma.persediaanBahanBaku.findMany({
          where: {
            id_bahan_baku: dataa.id_bahan_baku,
            satuan: dataa.satuan,
          },
          include: {
            bahanBaku: {
              select: {
                nama: true,
              },
            },
          },
        });

        const resultJumlah = cekPersediaanBahanBaku[0].jumlah - dataa.jumlah;

        // console.log(cekPersediaanBahanBaku, cekPersediaanBahanBaku[0].id, resultJumlah, dataa.jumlah)

        await prisma.persediaanBahanBaku.update({
          where: {
            id: cekPersediaanBahanBaku[0].id,
          },
          data: {
            jumlah: resultJumlah,
          },
        });
      });
    });

    // return

    if (statusTransaksi == true) {
      options.data.IsPembayaranLunas = true;
    } else {
      options.data.IsPembayaranDP = true;
    }

    const updateIsPemabayaran = await prisma.orders.update(options);

    res.status(200).json(response.success(200, updateIsPemabayaran));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteProductOrder = await prisma.product_Orders.deleteMany({
      where: {
        id_orders: Number(id),
      },
    });

    const deleteOrder = await prisma.orders.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json(response.success(200, deleteOrder));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

module.exports = {
  createOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
};
