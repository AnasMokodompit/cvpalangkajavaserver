const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");
const pagination = require("./../utility/pagination");
const cloudinary = require("../utility/cloudinary");
const uploadCloudinary = async (path, opts) => await cloudinary.CloudinaryUpload(path, opts);
const fs = require("fs");

const prisma = new PrismaClient();

const createBuktiBayar = async (req, res) => {
  try {
    let productOrder = [];
    const statusTransaksi = JSON.parse(req.body.statusTransaksi);


    // return console.log(statusTransaksi)
    if (req.file) {
      const cekBuktiBayarByIdOrder = await prisma.buktiBayar.findMany({
        where: {
          id_orders: Number(req.body.id_orders),
          statusTransaksi: statusTransaksi,
        },
      });

      // return console.log(cekBuktiBayarByIdOrder)
      const optionsCloudinary = {
        type: "image",
        folder: "cvtalangkajaya/image/buktiBayar",
      };

      const UploadImg = await uploadCloudinary(req.file.path, optionsCloudinary);

      // Mendestructuring publicId sebagai profile_picture_id,dan url hasil optimisasi gambar
      const { public_id, eager } = UploadImg;

      // eager is the result of optimization image
      const secure_url = eager[0].secure_url;

      const picture_bukti_bayar = secure_url;

      const picture_bukti_bayar_id = public_id;

      // if (req.user[0].profile_picture_id) {
      //     await deleteCloudinary(req.user[0].profile_picture_id)
      // }

      // console.log(req.user[0].profile_picture_id)

      fs.unlinkSync(req.file.path);

      if (cekBuktiBayarByIdOrder.length !== 0) {
        productOrder = await prisma.buktiBayar.update({
          where: {
            id: cekBuktiBayarByIdOrder[0].id,
          },
          data: {
            picture_bukti_bayar: picture_bukti_bayar,
            picture_bukti_bayar_id: picture_bukti_bayar_id,
          },
        });
      } else {
        productOrder = await prisma.buktiBayar.create({
          data: {
            statusTransaksi: statusTransaksi,
            id_orders: Number(req.body.id_orders),
            picture_bukti_bayar: picture_bukti_bayar,
            picture_bukti_bayar_id: picture_bukti_bayar_id,
          },
        });
      }

      return res.status(200).json(response.success(200, productOrder));
    } else {
      return res.status(404).json(response.error(404, "Mohon Masukan FIle"));
    }
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

module.exports = {
  createBuktiBayar,
};
