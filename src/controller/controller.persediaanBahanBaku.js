const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");
const pagination = require("./../utility/pagination");

const prisma = new PrismaClient();

const getAllPersediaanBahanBaku = async (req, res) => {
  try {
    const { id_bahan_baku, search } = req.query;

    // return console.log(id_bahan_baku)

    const options = {
      where: {},
      include: {
        bahanBaku: true,
      },
    };

    if (search) {
      options.where.satuan = {
        contains: search,
      };
    }

    if (id_bahan_baku) {
      options.where.id_bahan_baku = Number(id_bahan_baku);
    }

    const dataPersediaanBarangBaku = await prisma.persediaanBahanBaku.findMany(options);

    // console.log(dataPersediaanBarangBaku)
    res.status(200).json(response.success(200, dataPersediaanBarangBaku));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getByIdPersediaanBahanBaku = async (req, res) => {
  try {
    const { id } = req.params;

    const dataPersediaanBahanBakuById = await prisma.persediaanBahanBaku.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        bahanBaku: true,
      },
    });

    res.status(200).json(response.success(200, dataPersediaanBahanBakuById));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const createPersediaanBahanBakuAndBahanBaku = async (req, res) => {
  try {
    const { nama, jumlah, satuan } = req.body;

    const cekBahanBaku = await prisma.bahanBaku.findMany({
      where: {
        nama: nama,
      },
    });

    if (cekBahanBaku.length !== 0) {
      const cekPersediaanBahanBaku = await prisma.persediaanBahanBaku.findMany({
        where: {
          id_bahan_baku: cekBahanBaku[0].id,
          satuan: satuan,
        },
      });

      if (cekPersediaanBahanBaku.length !== 0) {
        return res.status(404).json(response.error(404, "Bahan Baku Telah Tersedia"));
      }

      const dataCreatePersedianBahanBaku = await prisma.persediaanBahanBaku.create({
        data: {
          jumlah: Number(jumlah),
          satuan: satuan,
          id_bahan_baku: cekBahanBaku[0].id,
        },
      });

      return res.status(201).json(response.success(201, dataCreatePersedianBahanBaku));
    }

    const createBahanBaku = await prisma.bahanBaku.create({
      data: {
        nama: nama,
      },
    });

    if (createBahanBaku) {
      await prisma.persediaanBahanBaku.create({
        data: {
          id_bahan_baku: createBahanBaku.id,
          jumlah: Number(jumlah),
          satuan: satuan,
        },
      });
    }

    return res
      .status(201)
      .json(response.success(201, "Data Persediaan Bahan Baku Berhasil Di Buat"));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const updatePersediaanBahanBakuAndBahanBaku = async (req, res) => {
  try {
    const { nama, jumlah, satuan } = req.body;
    const { id } = req.params;

    const options = {
      jumlah: Number(jumlah),
      satuan: satuan,
    };

    const cekBahanBaku = await prisma.bahanBaku.findMany({
      where: {
        nama: nama,
      },
    });

    if (cekBahanBaku.length !== 0) {
      options.id_bahan_baku = cekBahanBaku[0].id;

      const cekSatuanId_bahan_baku = await prisma.persediaanBahanBaku.findMany({
        where: {
          id_bahan_baku: cekBahanBaku[0].id,
          satuan: satuan,
        },
      });

      // if (cekSatuanId_bahan_baku.length !== 0) {
      //   return res.status(404).json(response.error(404, "Satuan Telah Ada"));
      // }
    } else {
      const createBahanBaku = await prisma.bahanBaku.create({
        data: {
          nama: nama,
        },
      });

      options.id_bahan_baku = createBahanBaku.id;
    }

    const updatePersediaanBahanBaku = await prisma.persediaanBahanBaku.update({
      where: {
        id: Number(id),
      },
      data: options,
    });

    return res.status(200).json(response.success(200, updatePersediaanBahanBaku));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const deletePersediaanBahanBakuAndBahanBaku = async (req, res) => {
  try {
    const { id } = req.params;

    // // Cek Id Bahan Baku Menghapus Bahan Baku Jika Tidak Memiliki Kaitan
    // const cekPersediaanBahanBaku = await prisma.persediaanBahanBaku.findUnique({
    //     where: {
    //         id: Number(id)
    //     }
    // })

    const deletePersediaanBahanBaku = await prisma.persediaanBahanBaku.delete({
      where: {
        id: Number(id),
      },
    });

    // const cekIdBahanBaku = await prisma.persediaanBahanBaku.findMany({
    //     where: {
    //         id_bahan_baku: cekPersediaanBahanBaku?.id_bahan_baku
    //     }
    // })

    // console.log(cekIdBahanBaku, cekPersediaanBahanBaku)

    // if (cekIdBahanBaku.length == 0) {
    //     await prisma.bahanBaku.delete({
    //         where: {
    //             id: cekPersediaanBahanBaku?.id_bahan_baku
    //         }
    //     })
    // }

    return res.status(200).json(response.success(200, deletePersediaanBahanBaku));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

module.exports = {
  getAllPersediaanBahanBaku,
  getByIdPersediaanBahanBaku,
  createPersediaanBahanBakuAndBahanBaku,
  updatePersediaanBahanBakuAndBahanBaku,
  deletePersediaanBahanBakuAndBahanBaku,
};
