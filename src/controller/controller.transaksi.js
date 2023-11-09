const { PrismaClient } = require("@prisma/client");
const pagination = require("../utility/pagination");

const prisma = new PrismaClient();

const postTransaksi = async (req, res) => {
  try {

    const { id_jenis_transaksi, id_nama_akun_jenis_transaksi, keterangan, jumlah, bahanBaku, tanggal } = req.body;

    const option = {
        id_jenis_transaksi: Number(id_jenis_transaksi),
        id_nama_akun_jenis_transaksi: Number(id_nama_akun_jenis_transaksi),
        keterangan,
        jumlah,
    }

    if (tanggal) {
      option.tanggal = new Date(tanggal).toISOString()
    }

    const dataCreate = await prisma.transaksi.create({
      data: option,
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


    if (bahanBaku?.length !== 0 && bahanBaku !== undefined && Number(id_nama_akun_jenis_transaksi) == 3) {
      bahanBaku.map(async (data) => {

        const cekIdBahanBaku = await prisma.persediaanBahanBaku.findMany({
          where: {
            id_bahan_baku: data.id_bahan_baku,
            satuan: data.satuan
          }
        })



        await prisma.persediaanBahanBaku.update({
          where: {
            id: cekIdBahanBaku[0].id
          },
          data: {
            jumlah: cekIdBahanBaku[0].jumlah + Number(data.jumlah)
          }
        })
        
      })
    }

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
    let jumlah = 0

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

    listTransaksi.map(data => {
      if (data.namaAkunTransaksiDalamJenisTransaksi.nama === "Pendapatan DP") {
        jumlah += data.jumlah
        jumlah += data.jumlah / 0.3
      }else{
        jumlah += data.jumlah
      }
    })
    const listTanggalTransaksi = await prisma.transaksi.findMany({ select: { tanggal: true } });

    let tanggalArray = [];

    for (const transaction of listTanggalTransaksi) {
      if (transaction.hasOwnProperty("tanggal")) {
        tanggalArray.push(transaction.tanggal);
      }
    }

    const parsedDates = tanggalArray.map((dateString) => new Date(dateString));
    const oldestDate = new Date(Math.min.apply(null, parsedDates));
    oldestDate.setHours(0, 0, 0, 0);

    res.status(200).json({
      status: 200,
      message: "OK",
      data: {
        listTransaksi,
        oldestDate,
        jumlah
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  postTransaksi,
  listTransaksi,
};
