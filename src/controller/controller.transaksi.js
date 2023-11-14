const { PrismaClient } = require("@prisma/client");
const pagination = require("../utility/pagination");
const response = require("../utility/responModel");


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
        id: true,
        namaAkunTransaksiDalamJenisTransaksi: {
          select: {
            akunTransaksi: {
              select: {
                id: true,
                nama_akun_jenis_transaksi: true,
                kode_nama_akun_transaksi: true,
              },
            },
          },
        },
      },
    });

    // console.log(dataCreate)


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
    // console.log(dataCreate.namaAkunTransaksiDalamJenisTransaksi)
    // return console.log(dataCreate.namaAkunTransaksiDalamJenisTransaksi.akunTransaksi[0].nama_akun_jenis_transaksi.nama)

    if (dataCreate.namaAkunTransaksiDalamJenisTransaksi.akunTransaksi) {
      dataCreate.namaAkunTransaksiDalamJenisTransaksi.akunTransaksi.map(async (data) => {

        const options = {
          saldo: 0,
          kode_nama_akun_transaksi: data.kode_nama_akun_transaksi,
          id_akun_transaksi: data.id,
          id_transaksi: dataCreate.id
        }
        
        if (data.nama_akun_jenis_transaksi.id == 31) {
          if (data.id == 63) {
            options.saldo = Number(jumlah) / 0.3
          }else if (data.id == 64) {
            options.saldo = (Number(jumlah) / 0.3) / 1.125
          }else if (data.id == 65) {
            options.saldo = (Number(jumlah) / 0.3) / 1.125
          }else if (data.id == 66) {
            options.saldo = ((Number(jumlah) / 0.3) / 1.125) * 0.11
          }else if (data.id == 67) {
            options.saldo = ((Number(jumlah) / 0.3) / 1.125) * 0.015
          }

          else if (data.id == 70) {
            options.saldo = (((Number(jumlah) / 0.3) / 1.125) * 0.11) * 0.30
          }else if (data.id == 71) {
            options.saldo = (((Number(jumlah) / 0.3) / 1.125) * 0.015) * 0.30
          }else if (data.id == 72) {
            options.saldo = ((((Number(jumlah) / 0.3) / 1.125) * 0.11) * 0.30) + ((((Number(jumlah) / 0.3) / 1.125) * 0.015) * 0.30)
          }
        }else if (data.nama_akun_jenis_transaksi.id == 32) {
          if (data.id == 75) {
            options.saldo = (Number(jumlah) / 1.125) * 0.11
          }else if (data.id == 76) {
            options.saldo = (Number(jumlah) / 1.125) * 0.015
          }else if (data.id == 75) {
            options.saldo = ((Number(jumlah) / 1.125) * 0.11) + ((Number(jumlah) / 1.125) * 0.015)
          }
        }else{
          options.saldo = Number(jumlah)
        }

        await prisma.saldoAkunTransaksi.create({
          data: options
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


const updateTransaksi = async (req, res) => {
  try{
    const { keterangan, jumlah, tanggal } = req.body;
    const idTransaksi = req.params.id;

    const option = {
      keterangan,
      jumlah: Number(jumlah),
      tanggal: new Date(tanggal).toISOString()
    }

    const dataTransaksiUpdate = await prisma.transaksi.update({
      where: {
        id: Number(idTransaksi)
      },
      data: option
    })

    await prisma.saldoAkunTransaksi.updateMany({
      where: {
        id_transaksi: Number(idTransaksi)
      },
      data: {
        saldo: Number(jumlah)
      }
    })

    return res.status(200).json(response.success(200, dataTransaksiUpdate)); 

  }catch(error){
    console.log(error);
  }
}

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
          NOT: {
            OR: [
              {
                id: 23
              },
              {
                id: 24
              },
              {
                id: 25
              }
            ]
          }
        },
        select: {
          id: true,
        },
      });

      idNamaAkunDalamJenisTransaksiInSearch.push(dataSearch.map((data) => data.id));
    }

    const option = {
      where: {
        id_tutup_buku: null,
        NOT: {
          OR: [
            {
              id_nama_akun_jenis_transaksi: 23,
            },
            {
              id_nama_akun_jenis_transaksi: 24
            },
            {
              id_nama_akun_jenis_transaksi: 25
            }
          ]
        }
      },
      orderBy: {
        // id: "asc",
        id: "desc",
      },
      select: {
        id: true,
        keterangan: true,
        jumlah: true,
        id_tutup_buku: true,
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

    let listTransaksi = await prisma.transaksi.findMany(option);

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

const deleteTransaksi = async (req, res) => {
  try{
    const idTransaksi = req.params.id;

    await prisma.saldoAkunTransaksi.deleteMany({
      where: {
        id_transaksi: Number(idTransaksi)
      }
    })

    
    const dataDeleteTransaksi = await prisma.transaksi.delete({
      where: {
        id: Number(idTransaksi)
      }
    }) 

    
    return res.status(200).json(response.success(200, dataDeleteTransaksi)); 

  }catch(error){
    console.log(error);
  }
}

module.exports = {
  postTransaksi,
  listTransaksi,
  updateTransaksi,
  deleteTransaksi
};
