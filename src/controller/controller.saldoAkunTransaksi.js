const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");



const prisma = new PrismaClient();

const getNamaAkunByTipe = async (req, res) => {
    try{

        const  {tipe, firstDate, lastDate} = req.query
        const idType = []

        const cekIdTipe = await prisma.tipeAkunTransaksi.findMany({
            where: {
                nama: {
                    contains: tipe
                }
            }
        })

        idType.push(cekIdTipe.map(data => data.id))
        
        const kodeNamaAkun = []
        const cekNamaAkun = await prisma.namaAkunTransaksi.findMany({
            where: {
                id_tipe_akun_transaksi: {
                    in: idType[0]
                }
            }
        })
        
        kodeNamaAkun.push(cekNamaAkun.map(data => data.kode))

        
        const option = {
            where: {
                kode_nama_akun_transaksi: {
                    in: kodeNamaAkun[0]
                }
            },
            include: {
                namaAkunTransaksi: {
                    include: {
                        tipe_akun_transaksi: true
                    }
                },
                akunTransaksi: {
                    include: {
                        kategori_akun: true
                    }
                }
            }
        }
        
        if (firstDate && lastDate) {
            option.where.AND = {
              tanggal: {
                gte: new Date(firstDate).toISOString(),
                lte: new Date (lastDate).toISOString()
              }
            }
          }
        
        const cekAkunTransaksi = await prisma.saldoAkunTransaksi.findMany(option)
        
        console.log(cekAkunTransaksi)

        res.status(200).json(response.success(200, cekAkunTransaksi));

    }catch(err){
        // menampilkan error di console log
        console.log(err);

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, "Internal Server Error"));
    }
}


module.exports = {
    getNamaAkunByTipe
}