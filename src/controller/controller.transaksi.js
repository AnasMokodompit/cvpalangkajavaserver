const { PrismaClient } = require("@prisma/client");
const pagination = require('../utility/pagination')


const prisma = new PrismaClient();

const postTransaksi = async (req, res) => {
  const { id_jenis_transaksi, id_nama_akun_jenis_transaksi, keterangan, jumlah } = req.body;

  try {
    await prisma.transaksi.create({
      data: {
        id_jenis_transaksi: Number(id_jenis_transaksi),
        id_nama_akun_jenis_transaksi: Number(id_nama_akun_jenis_transaksi),
        keterangan,
        jumlah,
      },
    });

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

    const  {search, firstDate, lastDate} = req.query
    const {page, row} = pagination(req.query.page, req.query.row)
    const idNamaAkunDalamJenisTransaksiInSearch = []

    
    if (search) {
      const dataSearch = await prisma.namaAkunTransaksiDalamJenisTransaksi.findMany({
        where: {
          nama: {
            contains: search
          },
        },
        select: {
          id: true
        }
      })


      
      idNamaAkunDalamJenisTransaksiInSearch.push(dataSearch.map(data => data.id))
      
    }

    const option = {
      where: {},
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
                    tipe_akun_transaksi: true
                  }
                }
              }
            }
          }
        },
        tanggal: true,
      },
      skip: page,
      take: row,
    }


    if (firstDate && lastDate) {
      option.where.AND = {
        tanggal: {
          gte: new Date(firstDate).toISOString(),
          lte: new Date (lastDate).toISOString()
        }
      }
    }

    if (search) {
      option.where.id_nama_akun_jenis_transaksi = {
          in: idNamaAkunDalamJenisTransaksiInSearch[0]
      }
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
