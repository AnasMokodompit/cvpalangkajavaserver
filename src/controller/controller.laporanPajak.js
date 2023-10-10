const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");
const pagination = require("./../utility/pagination");

const prisma = new PrismaClient();

const getPenjualanWeb = async (req, res) => {
  try {
    const { search, firstDate, lastDate } = req.query;
    const { page, row } = pagination(req.query.page, req.query.row);

    const options = {
      where: {
        status: 0,
        OR: [
            {
                IsPembayaranDP: true
            },
            {
                IsPembayaranLunas: true
            }
        ]
      },
      orderBy: {
        // id: "asc",
        id: "desc",
      },
      skip: page,
      take: row,
      include: {
        users: true,
        product_Orders: {
          include: {
            products: {
              include: {
                // product_images: true,
                categories: true,
              },
            },
          },
        },
      },
    };

    if (search) {
      options.where.nama_pemesan = {
        contains: search,
      };
    }

    if (firstDate && lastDate) {
      options.where.AND = {
        created_at: {
          gte: new Date(firstDate).toISOString(),
          lte: new Date(lastDate).toISOString(),
        },
      };
    }

    const getDataOrdertAll = await prisma.orders.findMany(options);

    let tanggalArray = [];

    for (const transaction of getDataOrdertAll) {
      if (transaction.hasOwnProperty("created_at")) {
        tanggalArray.push(transaction.created_at);
      }
    }

    const parsedDates = tanggalArray.map((dateString) => new Date(dateString));
    const oldestDate = new Date(Math.min.apply(null, parsedDates));
    oldestDate.setHours(0, 0, 0, 0);

    res.status(200).json(response.success(200, {getDataOrdertAll,  oldestDate}));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getLangsungOrCustom = async (req, res) => {
  try {
    const { search, firstDate, lastDate } = req.query;
    const { page, row } = pagination(req.query.page, req.query.row);

    const options = {
      where: {
        status: 1,
        OR: [
            {
                IsPembayaranDP: true
            },
            {
                IsPembayaranLunas: true
            }
        ]
      },
      orderBy: {
        // id: "asc",
        id: "desc",
      },
      skip: page,
      take: row,
      include: {
        users: true,
        product_Orders: {
          include: {
            products: {
              include: {
                // product_images: true,
                categories: true,
              },
            },
          },
        },
      },
    };

    if (search) {
      options.where.nama_pemesan = {
        contains: search,
      };
    }

    if (firstDate && lastDate) {
      options.where.AND = {
        created_at: {
          gte: new Date(firstDate).toISOString(),
          lte: new Date(lastDate).toISOString(),
        },
      };
    }

    const getDataOrdertAll = await prisma.orders.findMany(options);

    let tanggalArray = [];

    for (const transaction of getDataOrdertAll) {
      if (transaction.hasOwnProperty("created_at")) {
        tanggalArray.push(transaction.created_at);
      }
    }

    const parsedDates = tanggalArray.map((dateString) => new Date(dateString));
    const oldestDate = new Date(Math.min.apply(null, parsedDates));
    oldestDate.setHours(0, 0, 0, 0);


    res.status(200).json(response.success(200, {getDataOrdertAll, oldestDate}));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

const getPengadaanMeubel = async (req, res) => {
  try {
    const { search, firstDate, lastDate } = req.query;
    const { page, row } = pagination(req.query.page, req.query.row);

    const options = {
      where: {
        status: 2,
        OR: [
            {
                IsPembayaranDP: true
            },
            {
                IsPembayaranLunas: true
            }
        ]
      },
      orderBy: {
        // id: "asc",
        id: "desc",
      },
      skip: page,
      take: row,
      include: {
        users: true,
        product_Orders: {
          include: {
            products: {
              include: {
                // product_images: true,
                categories: true,
              },
            },
          },
        },
        pajakOrder: true
      },
    };

    if (search) {
      options.where.nama_pemesan = {
        contains: search,
      };
    }

    if (firstDate && lastDate) {
      options.where.AND = {
        created_at: {
          gte: new Date(firstDate).toISOString(),
          lte: new Date(lastDate).toISOString(),
        },
      };
    }

    const getDataOrdertAll = await prisma.orders.findMany(options);

    
    let tanggalArray = [];

    for (const transaction of getDataOrdertAll) {
      if (transaction.hasOwnProperty("created_at")) {
        tanggalArray.push(transaction.created_at);
      }
    }

    const parsedDates = tanggalArray.map((dateString) => new Date(dateString));
    const oldestDate = new Date(Math.min.apply(null, parsedDates));
    oldestDate.setHours(0, 0, 0, 0);

    res.status(200).json(response.success(200, {getDataOrdertAll, oldestDate}));
  } catch (err) {
    // menampilkan error di console log
    console.log(err);

    // menampilkan response semua data jika gagal
    return res.status(500).json(response.error(500, "Internal Server Error"));
  }
};

module.exports = {
  getPenjualanWeb,
  getLangsungOrCustom,
  getPengadaanMeubel,
};
