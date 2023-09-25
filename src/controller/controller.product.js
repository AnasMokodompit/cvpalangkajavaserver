const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");
const pagination = require("./../utility/pagination");
const fs = require("fs");
const cloudinary = require("../utility/cloudinary");

const prisma = new PrismaClient();

const getAllProduct = async (req, res) => {
  try {
    const { page, row } = pagination(req.query.page, req.query.row);
    const categoryIdByQuery = +req.query.category;
    const searchByNameQuery = req.query.search;

    console.log(page, row);

    const options = {
      where: {},
      orderBy: {
        id: "asc",
      },
      // skip: page,
      // take: row,
      include: {
        product_images: true,
        categories: true,
      },
    };

    if (categoryIdByQuery) {
      options.where.categoriesId = categoryIdByQuery;
    }

    if (searchByNameQuery) {
      options.where.name = {
        contains: searchByNameQuery,
      };
    }

    // memangil semua data di tabel product dan foreign keynya
    const getDataProductAll = await prisma.products.findMany(options);

    // menampilkan response semua data jika berhasil
    res.status(200).json(response.success(200, getDataProductAll));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getByIdProduct = async (req, res) => {
  try {
    // mengambil id yang dimasukan user lalu ditaru ke variabels
    const id_product = +req.params.id;

    const options = {
      where: {
        id: id_product,
      },
      include: {
        product_images: true,
        categories: true,
        reviewevUserProduct: {
          include: {
            users: true,
          },
        },
        bahanBakuProduk: true
      },
    };

    // memangil semua data di tabel product dan foreign keynya
    const getDataProductById = await prisma.products.findUnique(options);

    // menampilkan response semua data jika berhasil
    res.status(200).json(response.success(200, getDataProductById));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const createProduct = async (req, res) => {
  try {
    const { nama, ukuran, harga, Deskripsi_produk, categoriesId } = req.body;

    const files = req.files;

    if (files?.length === 0 || !files) {
      return res.status(401).json(response.error(401, "Gambar yang di masukan tidak boleh kosong"));
    }

    const dataProductCreate = {
      name: nama,
      ukuran: ukuran,
      harga: Number(harga),
      Deskripsi_produk: Deskripsi_produk,
      categoriesId: Number(categoriesId),
    };

    const createProduct = await prisma.products.create({
      data: dataProductCreate,
    });

    const optionsCloudinary = {
      type: "image",
      folder: "cvtalangkajaya/image/profile_picture",
    };

    const UploadImgProduct = async (path, opt) => cloudinary.CloudinaryUpload(path, opt);

    const dataMyProductImagesInsertDatabase = [];

    for (const file of files) {
      // Mengambil lokasi file lalu mendeklarasikan ke variabel
      const { path } = file;
      // Mengambil name file lalu mendeklarasikan ke variabel
      const { originalname } = file;
      // memisahkan nama dan format gambar
      const nameImg = originalname.split(".")[0];
      // memanggil fungsi uploader untuk mengupload gambar ke cloudinary
      const newpath = await UploadImgProduct(path, optionsCloudinary);

      // Mengambil url_gambar public_id product lalu mendeklarasikan ke variabel
      // const {secure_url, public_id} = newpath

      // Mendestructuring publicId sebagai profile_picture_id,dan url hasil optimisasi gambar
      const { public_id, eager } = newpath;
      // eager is the result of optimization image
      const secure_url = eager[0].secure_url;

      // menghapus file gambar setelah data gambar yang diperlukan telah disimpan di server agar tidak menyimpan banyak penyimpanan
      fs.unlinkSync(path);

      // menambahkan data yang igin dimasukan di tabel image product
      dataMyProductImagesInsertDatabase.push({
        name: nameImg,
        url_image: secure_url,
        product_image_id: public_id,
        product_id: createProduct.id,
      });
    }

    await prisma.product_images.createMany({
      data: dataMyProductImagesInsertDatabase,
    });

    const dataProduct = await prisma.products.findUnique({
      where: {
        id: createProduct.id,
      },
      include: {
        categories: true,
        product_images: true,
      },
    });

    res.status(201).json(response.success(201, dataProduct));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const updateProductById = async (req, res) => {
  try {
    const product_id = req.params.id;

    const { nama, ukuran, harga, Deskripsi_produk, categoriesId } = req.body;

    const files = req.files;

    const dataProductUpdate = {
      name: nama,
      ukuran: ukuran,
      harga: Number(harga),
      Deskripsi_produk: Deskripsi_produk,
      categoriesId: Number(categoriesId),
    };

    if (files?.length === 0) {
      const updateByProduct = await prisma.products.update({
        where: {
          id: Number(product_id),
        },
        data: dataProductUpdate,
      });

      return res.status(200).json(response.success(200, updateByProduct));
    }

    console.log(dataProductUpdate, product_id);

    await prisma.products.update({
      where: {
        id: Number(product_id),
      },
      data: dataProductUpdate,
    });

    // const dataProductImage = await prisma.product_images.findMany({
    //     where: {
    //         product_id: Number(product_id)
    //     }
    // })

    const UploadImgProduct = async (path, opts) => await cloudinary.CloudinaryUpload(path, opts);

    const dataMyProductImagesUpdateDatabase = [];

    const optionsCloudinary = {
      type: "image",
      folder: "cvtalangkajaya/image/profile_picture",
    };

    for (const file of files) {
      // Mengambil lokasi file lalu mendeklarasikan ke variabel
      const { path } = file;
      // Mengambil name file lalu mendeklarasikan ke variabel
      const { originalname } = file;
      // memisahkan nama dan format gambar
      const nameImg = originalname.split(".")[0];
      // memanggil fungsi uploader untuk mengupload gambar ke cloudinary
      const newpath = await UploadImgProduct(path, optionsCloudinary);

      // Mengambil url_gambar public_id product lalu mendeklarasikan ke variabel
      // const {secure_url, public_id} = newpath

      // Mendestructuring publicId sebagai profile_picture_id,dan url hasil optimisasi gambar
      const { public_id, eager } = newpath;
      // eager is the result of optimization image
      const secure_url = eager[0].secure_url;

      // menghapus file gambar setelah data gambar yang diperlukan telah disimpan di server agar tidak menyimpan banyak penyimpanan
      fs.unlinkSync(path);

      // menambahkan data yang igin dimasukan di tabel image product
      dataMyProductImagesUpdateDatabase.push({
        name: nameImg,
        url_image: secure_url,
        product_image_id: public_id,
        product_id: Number(product_id),
      });
    }

    await prisma.product_images.deleteMany({
      where: {
        product_id: Number(product_id),
      },
    });
    // console.log(dataMyProductImagesUpdateDatabase)

    const updataImagesProduct = await prisma.product_images.createMany({
      data: dataMyProductImagesUpdateDatabase,
    });

    return res.status(200).json(response.success(200, updataImagesProduct));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const deleteProductById = async (req, res) => {
  try {
    const product_id = req.params.id;

    const deleteProductImage = await prisma.product_images.deleteMany({
      where: {
        product_id: Number(product_id),
      },
    });

    if (deleteProductImage) {
      const deleteProduct = await prisma.products.delete({
        where: {
          id: Number(product_id),
        },
        include: {
          categories: true,
          product_images: true,
        },
      });

      res.status(200).json(response.success(200, deleteProduct));
    }
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

module.exports = {
  getAllProduct,
  getByIdProduct,
  createProduct,
  updateProductById,
  deleteProductById,
};
