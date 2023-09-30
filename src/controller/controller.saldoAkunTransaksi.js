const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");

const prisma = new PrismaClient();

const getNamaAkunByTipe = async (req, res) => {
  try {
    const { tipe, firstDate, lastDate } = req.query;
    const idType = [];

    const cekIdTipe = await prisma.tipeAkunTransaksi.findMany({
      where: {
        nama: {
          contains: tipe,
        },
      },
    });

    idType.push(cekIdTipe.map((data) => data.id));

    const kodeNamaAkun = [];
    const cekNamaAkun = await prisma.namaAkunTransaksi.findMany({
      where: {
        id_tipe_akun_transaksi: {
          in: idType[0],
        },
      },
    });

    kodeNamaAkun.push(cekNamaAkun.map((data) => data.kode));

    const option = {
      where: {
        kode_nama_akun_transaksi: {
          in: kodeNamaAkun[0],
        },
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

    const cekAkunTransaksi = await prisma.saldoAkunTransaksi.findMany(option);
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
          transaction.akunTransaksi.kategori_akun.nama === transactionCategory
        );
      });

      const totalSaldo = filteredTransactions.reduce((total, transaction) => {
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

module.exports = {
  getNamaAkunByTipe,
};
