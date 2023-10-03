const { PrismaClient } = require("@prisma/client");
const pagination = require("../utility/pagination");

const prisma = new PrismaClient();

const postTransaksi = async (req, res) => {
  try {

    const { id_jenis_transaksi, id_nama_akun_jenis_transaksi, keterangan, jumlah } = req.body;
    
    const dataCreate = await prisma.transaksi.create({
      data: {
        id_jenis_transaksi: Number(id_jenis_transaksi),
        id_nama_akun_jenis_transaksi: Number(id_nama_akun_jenis_transaksi),
        keterangan,
        jumlah,
      },
      select: {
        namaAkunTransaksiDalamJenisTransaksi: {
          select: {
            akunTransaksi: {
              select: {
                id: true,
                kode_nama_akun_transaksi: true,
              },
            },
          },
        },
      },
    });

    if (dataCreate.namaAkunTransaksiDalamJenisTransaksi.akunTransaksi) {
      dataCreate.namaAkunTransaksiDalamJenisTransaksi.akunTransaksi.map(async (data) => {
        await prisma.saldoAkunTransaksi.create({
          data: {
            saldo: jumlah,
            kode_nama_akun_transaksi: data.kode_nama_akun_transaksi,
            id_akun_transaksi: data.id,
          },
        });
      });
    }

    console.log(dataCreate.namaAkunTransaksiDalamJenisTransaksi.akunTransaksi);

    res.status(201).json({
      status: 201,
      message: "Created",
    });
  } catch (error) {
    console.log(error);
  }
};

const listTransaksi = async (req, res) => {
  try {
    const { search, firstDate, lastDate } = req.query;
    const rowKirim = req.query.row;
    const { page, row } = pagination(req.query.page, req.query.row);
    const idNamaAkunDalamJenisTransaksiInSearch = [];

    if (search) {
      const dataSearch = await prisma.namaAkunTransaksiDalamJenisTransaksi.findMany({
        where: {
          nama: {
            contains: search,
          },
        },
        select: {
          id: true,
        },
      });

      idNamaAkunDalamJenisTransaksiInSearch.push(dataSearch.map((data) => data.id));
    }

    const option = {
      where: {},
      orderBy: {
        // id: "asc",
        id: "desc",
      },
      select: {
        id: true,
        keterangan: true,
        jumlah: true,
        jenis_transaksi: {
          select: {
            nama: true,
          },
        },
        namaAkunTransaksiDalamJenisTransaksi: {
          include: {
            akunTransaksi: {
              include: {
                kategori_akun: true,
                namaAkunTransaksi: {
                  include: {
                    tipe_akun_transaksi: true,
                  },
                },
              },
            },
          },
        },
        tanggal: true,
      },
    };

    if (rowKirim) {
      console.log(rowKirim);
      option.skip = page;
      option.take = row;
    }

    if (firstDate && lastDate) {
      option.where.AND = {
        tanggal: {
          gte: new Date(firstDate).toISOString(),
          lte: new Date(lastDate).toISOString(),
        },
      };
    }

    if (search) {
      option.where.id_nama_akun_jenis_transaksi = {
        in: idNamaAkunDalamJenisTransaksiInSearch[0],
      };
    }

    const listTransaksi = await prisma.transaksi.findMany(option);

    res.status(200).json({
      status: 200,
      message: "OK",
      data: listTransaksi,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  postTransaksi,
  listTransaksi,
};
