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

    const kasDebit = filterTransactionsAndCalculateTotal(cekAkunTransaksi, "Kas", "Debit");
    const kasKredit = filterTransactionsAndCalculateTotal(cekAkunTransaksi, "Kas", "Kredit");
    const piutangUsaha = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Piutang Usaha",
      "Debit",
    );
    const persediaanBarangJadi = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Persediaan Barang Jadi",
      "Debit",
    );
    const persediaanBahanBaku = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Persediaan Bahan Baku",
      "Debit",
    );
    const persediaanBahanPembantu = filterTransactionsAndCalculateTotal(
      cekAkunTransaksi,
      "Persediaan Bahan Pembantu",
      "Debit",
    );

    const posisiKeuangan = [
      {
        tipeAkunTransaksi: "Aktiva Lancar",
        akun: [
          {
            namaAkunTransaksi: "Kas",
            saldo: kasDebit - kasKredit,
          },
          {
            namaAkunTransaksi: "Piutang Usaha",
            saldo: piutangUsaha,
          },
          {
            namaAkunTransaksi: "Persediaan Barang Jadi",
            saldo: persediaanBarangJadi,
          },
          {
            namaAkunTransaksi: "Persediaan Bahan Baku",
            saldo: persediaanBahanBaku,
          },
          {
            namaAkunTransaksi: "Persediaan Bahan Pembantu",
            saldo: persediaanBahanPembantu,
          },
        ],
      },
    ];

    // res.status(200).json(response.success(200, cekAkunTransaksi));
    res.status(200).json(response.success(200, posisiKeuangan));
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
