const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");

const prisma = new PrismaClient();

const tutupBuku = async (req, res) => {
  try{

    const option = {
      where: {
        statusTutupBuku : 0
      },
      include: {
        namaAkunTransaksi: {
          include: {
            keteranganNamaAkunTransaksi: true,
          },
        },
        akunTransaksi: {
          include: {
            kategori_akun: true,
            nama_akun_jenis_transaksi: true,
          },
        },
      },
    };

    const dataSaldoAkunTransaksi = await prisma.saldoAkunTransaksi.findMany(option)

    const dataResponse = []
    // return console.log(dataSaldoAkunTransaksi)
    dataSaldoAkunTransaksi.forEach((data) => {
      dataSaldoAkunTransaksi.filter((value) => {
            if (data.namaAkunTransaksi.nama === value.namaAkunTransaksi.nama) {
              const cekIndexData = dataResponse.findIndex((dataa) => dataa.namaAkunTransaksi == data.namaAkunTransaksi.nama)
              
              if (cekIndexData < 0) {
                dataResponse.push({
                  namaAkunTransaksi: data.namaAkunTransaksi.nama,
                  kode_nama_akun_transaksi: data.namaAkunTransaksi.kode,
                  saldo: 0,
                  keteranganAkun: data.namaAkunTransaksi.keteranganNamaAkunTransaksi,
                  id_akun_transaksi: data.akunTransaksi.id,
                  statusSaldoAwal: true

                })
              }
              
            }
          })
    })

    // return console.log(dataResponse)

    dataResponse.map((data, index) => {
      dataSaldoAkunTransaksi.filter(value => {
        if (data.namaAkunTransaksi === value.namaAkunTransaksi.nama && value.namaAkunTransaksi.kode === "1-1100" && value.akunTransaksi?.kategori_akun?.id == 1) {
          // console.log(data.namaAkunTransaksi, value.namaAkunTransaksi.nama, value.namaAkunTransaksi.id ,value.akunTransaksi?.kategori_akun?.id, "Tambah Debit Semua Hanya Untuk Kas" )
          dataResponse[index].saldo += value.saldo
        }
        else if (data.namaAkunTransaksi === value.namaAkunTransaksi.nama && value.namaAkunTransaksi.kode === "1-1100" && value.akunTransaksi?.kategori_akun?.id === 2) {
          // console.log(data.namaAkunTransaksi, value.namaAkunTransaksi.nama, value.namaAkunTransaksi.id, value.akunTransaksi?.kategori_akun?.id, "Kurang Debit dengan Kredit Semua Kas" )
          dataResponse[index].saldo -= value.saldo
        }
        else if ((data.namaAkunTransaksi === value.namaAkunTransaksi.nama) && value.namaAkunTransaksi.id !== 1 && (value.akunTransaksi?.kategori_akun?.nama === data.keteranganAkun.saldoNormal) && (value.akunTransaksi?.nama_akun_jenis_transaksi.nama === "Pendapatan DP")) {
          // console.log(data.namaAkunTransaksi, value.namaAkunTransaksi.nama, value.namaAkunTransaksi.id, value.akunTransaksi?.kategori_akun?.nama, "Kurang Debit dengan Kredit Semua Kas" )
          if (value.statusSaldoAwal !== true) {
            dataResponse[index].saldo = dataResponse[index].saldo += value.saldo / 0.3
          }else{
            dataResponse[index].saldo = dataResponse[index].saldo += value.saldo
          }
        }
        else if ((data.namaAkunTransaksi === value.namaAkunTransaksi.nama) && value.namaAkunTransaksi.id !== 1 && (value.akunTransaksi?.kategori_akun?.nama === data.keteranganAkun.saldoNormal)) {
          console.log(data.namaAkunTransaksi, value.namaAkunTransaksi.nama, value.namaAkunTransaksi.id, value.akunTransaksi?.kategori_akun?.nama, data.keteranganAkun.saldoNormal)
          dataResponse[index].saldo = dataResponse[index].saldo += value.saldo
        }
        else if ((data.namaAkunTransaksi === value.namaAkunTransaksi.nama) && value.namaAkunTransaksi.id !== 1 && (value.akunTransaksi?.kategori_akun?.nama !== data.keteranganAkun.saldoNormal)) {
          console.log(data.namaAkunTransaksi, value.namaAkunTransaksi.nama, value.namaAkunTransaksi.id, value.akunTransaksi?.kategori_akun?.nama, data.keteranganAkun.saldoNormal)
          dataResponse[index].saldo = dataResponse[index].saldo -= value.saldo
        }
      })
    })

    // console.log(dataResponse)

    dataResponse.map(data => {
      delete data.namaAkunTransaksi
      delete data.keteranganAkun
    })

    await prisma.saldoAkunTransaksi.deleteMany({
      where: {
        statusSaldoAwal: true
      }
    })

    const dataTutupBuku = await prisma.tutupBuku.create({
      data: {
        tanggal: new Date()
      }
    })

    const cekTransaksiBelumTutupBuku = await prisma.transaksi.findMany({
      where: {
        id_tutup_buku: null
      }
    })

    if (dataTutupBuku && cekTransaksiBelumTutupBuku) {
      const idTransaksiBelumTutupBuku = []

      cekTransaksiBelumTutupBuku.map(data => idTransaksiBelumTutupBuku.push(data.id))
  
      await prisma.transaksi.updateMany({
        where: {
          id: {
            in: idTransaksiBelumTutupBuku
          }
        },
        data: {
          id_tutup_buku: dataTutupBuku.id
        }
      })
    }


    await prisma.saldoAkunTransaksi.updateMany({
      where: {
        statusSaldoAwal: false,
        id_tutup_buku: null
      },
      data: {
        statusTutupBuku: 1,
        id_tutup_buku: dataTutupBuku.id
      } 
    })

    await prisma.saldoAkunTransaksi.createMany({
      data: dataResponse
    })

    res.status(200).json(response.success(200, "Data Saldo Awal Berhasil Diberbarui")); 

  }catch(err){
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
}

const getNamaAkunByTipe = async (req, res) => {
  try {
    let {firstDate, lastDate, idPeriode } = req.query;
    // return console.log(firstDate)


    const option = {
      where: {
        NOT: {
          // kode_nama_akun_transaksi: {
          //   in: ["1-1300", "1-1400", "1-1500"]
          // },
          // AND: [
          //   {statusSaldoAwal: true},
          // ],
          id_akun_transaksi: {
            in: [50, 46, 48]
          },
          // AND: [
          //   {statusSaldoAwal: false}
          // ]
        }
      },
      include: {
        namaAkunTransaksi: {
          include: {
            tipe_akun_transaksi: true,
          },
        },
        akunTransaksi: {
          include: {
            kategori_akun: true,
            nama_akun_jenis_transaksi: true,
          },
        },
      },
    };

    if (firstDate && lastDate) {
      option.where.AND = {
        tanggal: {
          gte: new Date(firstDate).toISOString(),
          lte: new Date(lastDate).toISOString(),
        },
      };
    }

    if (((!firstDate || !lastDate) || (!firstDate && !lastDate)) && !idPeriode) {
      console.log("Not Masuk", !firstDate, !lastDate, !idPeriode, ((!firstDate || !lastDate) || (!firstDate && !lastDate)&& !idPeriode)) 
      option.where.statusTutupBuku = 0
    }

    
    if (idPeriode) {
      console.log(idPeriode)
      option.where.id_tutup_buku = Number(idPeriode)
    }

    console.log(option)


    let cekAkunTransaksi = await prisma.saldoAkunTransaksi.findMany(option);

    // return console.log(cekAkunTransaksi)


    // return console.log(cekAkunTransaksi)

    const cekTanggal = await prisma.saldoAkunTransaksi.findMany({
      select: {
        tanggal: true,
      },
    });

    // console.log(cekAkunTransaksi);

    function filterTransactionsAndCalculateTotal(data, accountName, transactionCategory) {
      const filteredTransactions = data.filter((transaction) => {
        return (
          transaction.namaAkunTransaksi.nama === accountName &&
          transaction.akunTransaksi?.kategori_akun.nama === transactionCategory
        );
      });


      const totalSaldo = filteredTransactions.reduce((total, transaction) => {
        console.log(transaction)
        if (transaction.akunTransaksi?.nama_akun_jenis_transaksi?.nama === "Pendapatan DP" && transaction.akunTransaksi?.kategori_akun.nama == "Debit" && transaction.namaAkunTransaksi.kode == "9-3000") {
          return total + (transaction.saldo / 0.3);
        }else{
          return total + transaction.saldo;
        }
        return total + transaction.saldo;
      }, 0);

      return totalSaldo;
    }

    const saldoKasDebit = filterTransactionsAndCalculateTotal(cekAkunTransaksi, "Kas", "Debit");
    const saldoKasKredit = filterTransactionsAndCalculateTotal(cekAkunTransaksi, "Kas", "Kredit");
    const saldoPiutangUsaha = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Piutang Usaha",
      "Debit",
    );
    const saldoPiutangDebit = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Piutang",
      "Debit",
    );
    const saldoPiutangKredit = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Piutang",
      "Kredit",
    );

    // return console.log(saldoPiutangDebit, saldoPiutangKredit)
    const saldoPersediaanBarangJadi = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Persediaan Barang Jadi",
      "Debit",
    );
    const saldoPersediaanBahanBaku = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Persediaan Bahan Baku",
      "Debit",
    );
    const saldoPersediaanBahanPembantu = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Persediaan Bahan Pembantu",
      "Debit",
    );
    const saldoTanah = filterTransactionsAndCalculateTotal(cekAkunTransaksi, "Tanah", "Debit");
    const saldoGedung = filterTransactionsAndCalculateTotal(cekAkunTransaksi, "Gedung", "Debit");
    const saldoAkumulasiPenyusutanGedung = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Akumulasi Penyusutan Gedung",
      "Kredit",
    );
    const saldoMesin = filterTransactionsAndCalculateTotal(cekAkunTransaksi, "Mesin", "Debit");
    const saldoAkumulasiPenyusutanMesin = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Akumulasi Penyusutan Mesin",
      "Kredit",
    );
    const saldoPeralatan = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Peralatan",
      "Debit",
    );
    const saldoAkumulasiPenyusutanPeralatan = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Akumulasi Penyusutan Peralatan",
      "Kredit",
    );
    const saldoKendaraan = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Kendaraan",
      "Debit",
    );
    const saldoAkumulasiPenyusutanKendaraan = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Akumulasi Penyusutan Kendaraan",
      "Kredit",
    );
    const saldoUtangUsaha = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Utang Usaha",
      "Kredit",
    );
    const saldoUtangBank = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Utang Bank",
      "Kredit",
    );
    const saldoModalPemilikKredit = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Modal Pemilik",
      "Kredit",
    );
    const saldoModalPemilikDebit = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Modal Pemilik",
      "Debit",
    );

    let tanggalArray = [];

    for (const transaction of cekTanggal) {
      if (transaction.hasOwnProperty("tanggal")) {
        tanggalArray.push(transaction.tanggal);
      }
    }

    const parsedDates = tanggalArray.map((dateString) => new Date(dateString));
    const oldestDate = new Date(Math.min.apply(null, parsedDates));
    oldestDate.setHours(0, 0, 0, 0);

    const posisiKeuangan = [
      {
        tipeAkunTransaksi: "Aktiva Lancar",
        akun: [
          {
            namaAkunTransaksi: "Kas",
            saldo: saldoKasDebit - saldoKasKredit,
          },
          {
            namaAkunTransaksi: "Piutang Usaha",
            saldo: saldoPiutangUsaha,
          },
          {
            namaAkunTransaksi: "Piutang",
            saldo: saldoPiutangKredit - saldoPiutangDebit,
          },
          {
            namaAkunTransaksi: "Persediaan Barang Jadi",
            saldo: saldoPersediaanBarangJadi,
          },
          {
            namaAkunTransaksi: "Persediaan Bahan Baku",
            saldo: saldoPersediaanBahanBaku,
          },
          {
            namaAkunTransaksi: "Persediaan Bahan Pembantu",
            saldo: saldoPersediaanBahanPembantu,
          },
        ],
      },
      {
        tipeAkunTransaksi: "Aktiva Tetap",
        akun: [
          {
            namaAkunTransaksi: "Tanah",
            saldo: saldoTanah,
          },
          {
            namaAkunTransaksi: "Gedung",
            saldo: saldoGedung,
          },
          {
            namaAkunTransaksi: "Akumulasi Penyusutan Gedung",
            saldo: saldoAkumulasiPenyusutanGedung,
          },
          {
            namaAkunTransaksi: "Mesin",
            saldo: saldoMesin,
          },
          {
            namaAkunTransaksi: "Akumulasi Penyusutan Mesin",
            saldo: saldoAkumulasiPenyusutanMesin,
          },
          {
            namaAkunTransaksi: "Peralatan",
            saldo: saldoPeralatan,
          },
          {
            namaAkunTransaksi: "Akumulasi Penyusutan Peralatan",
            saldo: saldoAkumulasiPenyusutanPeralatan,
          },
          {
            namaAkunTransaksi: "Kendaraan",
            saldo: saldoKendaraan,
          },
          {
            namaAkunTransaksi: "Akumulasi Penyusutan Kendaraan",
            saldo: saldoAkumulasiPenyusutanKendaraan,
          },
        ],
      },
      {
        tipeAkunTransaksi: "Kewajiban Lancar",
        akun: [
          {
            namaAkunTransaksi: "Utang Usaha",
            saldo: saldoUtangUsaha,
          },
        ],
      },
      {
        tipeAkunTransaksi: "Kewajiban Jangka Panjang",
        akun: [
          {
            namaAkunTransaksi: "Utang Bank",
            saldo: saldoUtangBank,
          },
        ],
      },
      {
        tipeAkunTransaksi: "Modal",
        akun: [
          {
            namaAkunTransaksi: "Modal Pemilik",
            saldo: saldoModalPemilikKredit - saldoModalPemilikDebit,
          },
        ],
      },
      {
        oldestDate: firstDate,
      },
    ];

    // res.status(200).json(response.success(200, cekAkunTransaksi));
    res.status(200).json(
      response.success(200, {
        posisiKeuangan,
        oldestDate: oldestDate,
      }),
    );
    // res.status(200).json(response.success(200, minDate));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const GetLaporanLabaRugi = async (req, res) => {
  try{
    const {firstDate, lastDate, idPeriode} = req.query

    const option = {
      where: {
        // NOT: {
        //   kode_nama_akun_transaksi: {in: ["1-1400", "1-1300"]}
        // }
      },
      include: {
        namaAkunTransaksi: {
          include: {
            tipe_akun_transaksi: true,
          },
        },
        akunTransaksi: {
          include: {
            kategori_akun: true,
            nama_akun_jenis_transaksi: true,
          },
        },
      },
    };

    if (firstDate && lastDate) {
      option.where.AND = {
        tanggal: {
          gte: new Date(firstDate).toISOString(),
          lte: new Date(lastDate).toISOString(),
        },
      };
    }

    // return console.log(year?.length)
    if ((firstDate !== undefined || lastDate !== undefined) || (firstDate !== undefined && lastDate !== undefined) || idPeriode !== undefined ) {
      console.log(firstDate, lastDate, idPeriode)
      option.where.statusSaldoAwal = false
    }else{
      // option.where.statusTutupBuku = 0
       option.where.statusSaldoAwal = false
    }

    if (idPeriode) {
      option.where.id_tutup_buku = Number(idPeriode)
      // delete 
    }
    console.log(option)


    let cekAkunTransaksi = await prisma.saldoAkunTransaksi.findMany(option)
    // return

    // return console.log(cekAkunTransaksi)





    const cekTanggal = await prisma.saldoAkunTransaksi.findMany({
      select: {
        tanggal: true,
      },
    });

    // console.log(cekAkunTransaksi);

    function filterTransactionsAndCalculateTotal(data, accountName, transactionCategory) {
      // return console.log(data)
      const filteredTransactions = data.filter((transaction) => {
        return (
          transaction.namaAkunTransaksi.nama === accountName &&
          transaction.akunTransaksi?.kategori_akun.nama === transactionCategory
          );
      });
        

        // return console.log(filteredTransactions)
        
        
      const totalSaldo = filteredTransactions.reduce((total, transaction) => {
        if (transaction.akunTransaksi?.nama_akun_jenis_transaksi?.nama === "Pendapatan DP") {
          return total + (transaction.saldo / 0.3);
          
        }else{
          return total + transaction.saldo;

        }
        // return console.log(transaction.akunTransaksi.nama_akun_jenis_transaksi.nama === "Pendapatan DP")
        
      }, 0);

      return totalSaldo;
    }

    const getPersediaanBahanBakuSaldoAwal = await prisma.saldoAkunTransaksi.findMany({
      where: {
        kode_nama_akun_transaksi: "1-1400",
        statusSaldoAwal: true
      },
      select: {
        saldo: true
      }
    })
    
    
    const getPersediaanBahanJadiSaldoAwal = await prisma.saldoAkunTransaksi.findMany({
      where: {
        kode_nama_akun_transaksi: "1-1300",
        statusSaldoAwal: true
      },
      select: {
        saldo: true
      }
    })


    // console.log(getPersediaanBahanJadiSaldoAwal[0].saldo)

    // return
    // const getPersediaanBahanBakuBiayaProduksi = await prisma.saldoAkunTransaksi.findUnique(option.where.NOT = {id:3})

    // const getPersediaanBahanJadiBiayaProduksi = await prisma.saldoAkunTransaksi.findUnique(option.where.NOT = {id:4})

    const saldoPendapatan = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Pendapatan",
      "Kredit",
    );

    // return saldoPendapatan

    
    const saldoPersediaanBahanBaku = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Persediaan Bahan Baku",
      "Debit",
      );
      
      // return console.log(saldoPersediaanBahanBaku)
    const saldoPersediaanBahanJadi = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Persediaan Barang Jadi",
      "Debit",
    );

    const saldoBiayaBahanBaku = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Bahan Baku",
      "Debit",
    );

    const saldoUpahPekerja = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Upah Pekerja",
      "Debit",
    );

    const saldoBiayaBahanPembantu = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Bahan Pembantu",
      "Debit",
    );

    const saldoBiayaTransportasi = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Transportasi",
      "Debit",
    );

    const saldoBiayaGajiPegawai = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Gaji Pegawai",
      "Debit",
    );

    const saldoBiayaPerlengkapan = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Perlengkapan",
      "Debit",
    );

    const saldoBiayaSewa = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Sewa",
      "Debit",
    );

    const saldoBiayaTelepon = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Telepon",
      "Debit",
    );

    const saldoBiayaListrik = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Listrik",
      "Debit",
    );

    const saldoBiayaATMATK = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya ATM/ATK",
      "Debit",
    );

    const saldoBiayaLainLain = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Lain-Lain",
      "Debit",
    );

    const saldoBiayaPenyusutanPeralatan = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Penyusutan Peralatan",
      "Debit",
    );

    const saldoBiayaPenyusutanMesin = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Penyusutan Mesin",
      "Debit",
    );

    const saldoBiayaPenyusutanKendaraan = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Penyusutan Kendaraan",
      "Debit",
    );

    const saldoBiayaPenyusutanGedung = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Biaya Penyusutan Gedung",
      "Debit",
    );

    const saldoPendapatanBunga = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Pendapatan Bunga",
      "Debit",
    );

    const saldoBebanBunga = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Beban Bunga",
      "Debit",
    );

    let tanggalArray = [];

    for (const transaction of cekTanggal) {
      if (transaction.hasOwnProperty("tanggal")) {
        tanggalArray.push(transaction.tanggal);
      }
    }

    const parsedDates = tanggalArray.map((dateString) => new Date(dateString));
    const oldestDate = new Date(Math.min.apply(null, parsedDates));
    oldestDate.setHours(0, 0, 0, 0);


    const labaRugi = [
      {
        judulAkunTransaksi: "Pendapatan",
        akun: [
          {
            namaAkunTransaksi: "Pendapatan",
            saldo: saldoPendapatan,
          }
        ],
      },
      {
        judulAkunTransaksi: "Harga Pokok Penjualan",
        akun: [
          {
            namaAkunTransaksi: "Persediaan Bahan Baku",
            saldo: getPersediaanBahanBakuSaldoAwal[0].saldo,
          },
          {
            namaAkunTransaksi: "Persediaan Barang Jadi",
            saldo: getPersediaanBahanJadiSaldoAwal[0].saldo,
          },
        ]
      },
      {
        judulAkunTransaksi: "Biaya Produksi",
        akun: [
          {
            namaAkunTransaksi: "Biaya Bahan Baku",
            saldo: saldoBiayaBahanBaku,
          },
          {
            namaAkunTransaksi: "Upah Pekerja",
            saldo: saldoUpahPekerja,
          },
          {
            namaAkunTransaksi: "Biaya Bahan Pembantu",
            saldo: saldoBiayaBahanPembantu,
          }
          ,{
            namaAkunTransaksi: "Persediaan Bahan Baku",
            saldo: saldoPersediaanBahanBaku
          }
          ,{
            namaAkunTransaksi: "Persediaan Barang Jadi",
            saldo: saldoPersediaanBahanJadi
          }
        ],
      },
      {
        judulAkunTransaksi: "Biaya Operasi",
        akun: [
          {
            namaAkunTransaksi: "Biaya Transportasi",
            saldo: saldoBiayaTransportasi,
          }
          ,{
            namaAkunTransaksi: "Biaya Gaji Pegawai",
            saldo: saldoBiayaGajiPegawai,
          }
          ,{
            namaAkunTransaksi: "Biaya Perlengkapan",
            saldo: saldoBiayaPerlengkapan,
          }
          ,{
            namaAkunTransaksi: "Biaya Sewa",
            saldo: saldoBiayaSewa,
          }
          ,{
            namaAkunTransaksi: "Biaya Telepon",
            saldo: saldoBiayaTelepon,
          }
          ,{
            namaAkunTransaksi: "Biaya Listrik",
            saldo: saldoBiayaListrik,
          }
          ,{
            namaAkunTransaksi: "Biaya ATM/ATK",
            saldo: saldoBiayaATMATK,
          }
          ,{
            namaAkunTransaksi: "Biaya Lain-Lain",
            saldo: saldoBiayaLainLain,
          }
          ,{
            namaAkunTransaksi: "Biaya Penyusutan Peralatan",
            saldo: saldoBiayaPenyusutanPeralatan,
          }
          ,{
            namaAkunTransaksi: "Biaya Penyusutan Mesin",
            saldo: saldoBiayaPenyusutanMesin,
          }
          ,{
            namaAkunTransaksi: "Biaya Penyusutan Kendaraan",
            saldo: saldoBiayaPenyusutanKendaraan,
          }
          ,{
            namaAkunTransaksi: "Biaya Penyusutan Gedung",
            saldo: saldoBiayaPenyusutanGedung,
          }
        ],
      },
      {
        judulAkunTransaksi: "Pendapatan dan Beban Lain-Lain",
        akun: [
          {
            namaAkunTransaksi: "Pendapatan Bunga",
            saldo: saldoPendapatanBunga,
          },
          {
            namaAkunTransaksi: "Beban Bunga",
            saldo: saldoBebanBunga,
          },
        ],
      },
      {
        oldestDate: firstDate,
      },
    ];

    // res.status(200).json(response.success(200, cekAkunTransaksi));
    res.status(200).json(
      response.success(200, {
        labaRugi,
        oldestDate: oldestDate,
      }),
    );

  }catch(err){
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
}

const GetAllRekapJurnal = async (req, res) => {
  try {
    const { firstDate, lastDate } = req.query;
    let jumlahDebit = 0
    let jumlahKredit = 0


    const option = {
      where: {
        NOT: {
          id_akun_transaksi: {
            in: [49, 50, 45, 46, 47, 48]
          },
          AND: [
            {statusSaldoAwal: false}
          ]
        }
      },
      include: {
        namaAkunTransaksi: {
          include: {
            keteranganNamaAkunTransaksi: true,
          },
        },
        akunTransaksi: {
          include: {
            kategori_akun: true,
            nama_akun_jenis_transaksi: true,
          },
        },
      },
    };

    if (firstDate && lastDate) {
      option.where.AND = {
        tanggal: {
          gte: new Date(firstDate).toISOString(),
          lte: new Date(lastDate).toISOString(),
        },
      };
    }

    if ((!firstDate || !lastDate ) || (!firstDate && !lastDate )) {
     option.where.statusTutupBuku = 0
    }

    const saldoAwalTransaksi = await prisma.saldoAkunTransaksi.findMany(option);

    // return res.status(200).json(response.success(200, saldoAwalTransaksi));

    // return console.log(saldoAwalTransaksi) 

    console.log(saldoAwalTransaksi)
 
    const cekTanggal = await prisma.saldoAkunTransaksi.findMany({
      select: {
        tanggal: true,
      },
    });

    let tanggalArray = [];

    for (const transaction of cekTanggal) {
      if (transaction.hasOwnProperty("tanggal")) {
        tanggalArray.push(transaction.tanggal);
      }
    }

    const parsedDates = tanggalArray.map((dateString) => new Date(dateString));
    const oldestDate = new Date(Math.min.apply(null, parsedDates));
    oldestDate.setHours(0, 0, 0, 0);


    const dataResponse = []
    // console.log(saldoAwalTransaksi)
    saldoAwalTransaksi.forEach((data) => {
      saldoAwalTransaksi.filter((value) => {
            if (data.namaAkunTransaksi.nama === value.namaAkunTransaksi.nama) {
              const cekIndexData = dataResponse.findIndex((dataa) => dataa.namaAkunTransaksi == data.namaAkunTransaksi.nama)
              
              if (cekIndexData < 0) {
                dataResponse.push({
                  namaAkunTransaksi: data.namaAkunTransaksi.nama,
                  saldo: 0,
                  keteranganAkun: data.namaAkunTransaksi.keteranganNamaAkunTransaksi
                })
              }
              
            }
          })
    })

    console.log(saldoAwalTransaksi[0].namaAkunTransaksi.keteranganNamaAkunTransaksi.saldoNormal)
    // return console.log(dataResponse)

    dataResponse.map((data, index) => {
      saldoAwalTransaksi.filter(value => {
        console.log(data.namaAkunTransaksi, value.namaAkunTransaksi.nama, value.akunTransaksi?.kategori_akun?.nama, value.akunTransaksi?.kategori_akun?.nama)
        if (data.namaAkunTransaksi === value.namaAkunTransaksi.nama && value.namaAkunTransaksi.kode === "1-1100" && value.akunTransaksi?.kategori_akun?.id == 1 && (value.statusTutupBuku === 0) ) {
          // console.log(data.namaAkunTransaksi, value.namaAkunTransaksi.nama, value.namaAkunTransaksi.kode ,value.akunTransaksi?.kategori_akun?.id, "Tambah Debit Semua Hanya Untuk Kas" )
          dataResponse[index].saldo += value.saldo
        }
        else if (data.namaAkunTransaksi === value.namaAkunTransaksi.nama && value.namaAkunTransaksi.kode === "1-1100" && value.akunTransaksi?.kategori_akun?.id === 2 && (value.statusTutupBuku === 0) ) {
          // console.log(data.namaAkunTransaksi, value.namaAkunTransaksi.nama, value.namaAkunTransaksi.kode, value.akunTransaksi?.kategori_akun?.id, "Kurang Debit dengan Kredit Semua Kas" )
          dataResponse[index].saldo -= value.saldo
        }
        else if ((data.namaAkunTransaksi === value.namaAkunTransaksi.nama) && value.namaAkunTransaksi.kode !== "1-1100" && (value.akunTransaksi?.kategori_akun?.nama === data.keteranganAkun.saldoNormal) && (value.akunTransaksi?.nama_akun_jenis_transaksi.nama === "Pendapatan DP")) {
          console.log(data.namaAkunTransaksi, value.namaAkunTransaksi.nama, value.namaAkunTransaksi.kode, value.akunTransaksi?.kategori_akun?.nama, value.statusTutupBuku === 0, "Kurang Debit dengan Kredit Semua Kas" )
          if (value.statusSaldoAwal !== true) {
            dataResponse[index].saldo = dataResponse[index].saldo += value.saldo / 0.3
          }else{
            dataResponse[index].saldo = dataResponse[index].saldo += value.saldo
          }
        }
        else if ((data.namaAkunTransaksi === value.namaAkunTransaksi.nama) && value.namaAkunTransaksi.kode !== "1-1100" && (value.akunTransaksi?.kategori_akun?.nama === data.keteranganAkun.saldoNormal) && (value.statusTutupBuku === 0)) {
          // console.log(data.namaAkunTransaksi, value.namaAkunTransaksi.nama, value.namaAkunTransaksi.kode, value.akunTransaksi?.kategori_akun?.nama, data.keteranganAkun.saldoNormal)
          dataResponse[index].saldo = dataResponse[index].saldo += value.saldo
        }
        else if ((data.namaAkunTransaksi === value.namaAkunTransaksi.nama) && value.namaAkunTransaksi.kode !== "1-1100" && (value.akunTransaksi?.kategori_akun?.nama !== data.keteranganAkun.saldoNormal) && (value.statusTutupBuku === 0)) {
          // console.log(data.namaAkunTransaksi, value.namaAkunTransaksi.nama, value.namaAkunTransaksi.kode, value.akunTransaksi?.kategori_akun?.nama, data.keteranganAkun.saldoNormal)
          dataResponse[index].saldo = value.saldo -= dataResponse[index].saldo
        }
      })
    })
        
    // console.log(dataResponse)
    dataResponse.map(data => {
      if (data.keteranganAkun.saldoNormal === "Debit") {
        jumlahDebit += data.saldo
      }else{
        jumlahKredit += data.saldo
      }
    })
    dataResponse.push({
      oldestDate: oldestDate,
      jumlahDebit,
      jumlahKredit
    },)

    res.status(200).json(response.success(200, dataResponse));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getAllSaldoAwal = async (req, res) => {
  try {
    let jumlahDebit = 0
    let jumlahKredit = 0

    let dataAllSaldoAwal = await prisma.saldoAkunTransaksi.findMany({
      where: {
        statusSaldoAwal: true,
      },
      
      include: {
        namaAkunTransaksi: {
          include: {
            tipe_akun_transaksi: true,
            keteranganNamaAkunTransaksi: true
          }
        }
      }
    })

    dataAllSaldoAwal.sort((dataAwal, dataAkhir) => dataAwal.namaAkunTransaksi.id - dataAkhir.namaAkunTransaksi.id)
    dataAllSaldoAwal.map(data => {
      if (data.namaAkunTransaksi.keteranganNamaAkunTransaksi.saldoNormal === "Debit") {
        jumlahDebit += data.saldo
      }else{
        jumlahKredit += data.saldo
      }
    })

    
    // dataAllSaldoAwal.push({"Debit": jumlahDebit, "Kredit": jumlahKredit})
    const data = {
      "SaldoAwal": dataAllSaldoAwal,
      "Total": {
        "Debit": jumlahDebit, 
        "Kredit": jumlahKredit
      }
    }

    res.status(200).json(response.success(200, data));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getByIdSaldowAwal = async (req, res) => {
  try {
    const { id } = req.params;

    const dataAllSaldoAwal = await prisma.saldoAkunTransaksi.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        namaAkunTransaksi: {
          include: {
            tipe_akun_transaksi: true,
            keteranganNamaAkunTransaksi: true
          }
        }
      }
    })

    res.status(200).json(response.success(200, dataAllSaldoAwal));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const updateSaldoAwal = async (req, res) => {
  try {
    const { saldo } = req.body;
    const { id } = req.params;

    const updateSaldoAwal = await prisma.saldoAkunTransaksi.update({
      where: {
        id: Number(id),
      },
      data: {
        saldo: saldo,
      },
    });

    res.status(200).json(response.success(200, updateSaldoAwal));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

module.exports = {
  tutupBuku,
  getNamaAkunByTipe,
  GetLaporanLabaRugi,
  GetAllRekapJurnal,
  getAllSaldoAwal,
  getByIdSaldowAwal,
  updateSaldoAwal,
};
