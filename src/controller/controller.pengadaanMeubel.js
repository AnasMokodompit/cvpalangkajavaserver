const { PrismaClient } = require("@prisma/client");
const response = require("../utility/responModel");

const prisma = new PrismaClient();

const createPengadaanMeubel = async (req, res) => {
    try{
        const {user, order} = req.body

        // return console.log( user, order)

        // return console.log(user, order[1].bahanBakuProduk)

        const optionsCreateOrder = {
            nama_pemesan: user.nama,
            no_hp: user.nomor,
            alamat: user.alamat,
            Price: 0,
            jumlah: 0,
        }

        if (user.status) {
            optionsCreateOrder.status = user.status
        }

        const cekUser = await prisma.users.findMany({
            where: {
              email: {
                contains: user.nama
              }
            }
        })
    
        console.log(cekUser)
    
        let createUser = []
        if (cekUser.length == 0) {
        
            createUser = await prisma.users.create({
                data: {
                name: user.nama,
                email: user.email,
                rolesId: 2,
                nomor_hp: user.nomor,
                alamat: user.alamat,
                password: "customers1234",
                },
            });
    
            optionsCreateOrder.id_user = createUser.id
        }else{      
            optionsCreateOrder.id_user = cekUser[0].id
        }

        order.map((data) => {
            optionsCreateOrder.jumlah += data.jumlah
            optionsCreateOrder.Price += Number(data.jumlahHarga)
        })

        const optionPajakOrder = {
            DPP: optionsCreateOrder.Price / 1.125,
            PPN: 0,
            PPh_22: 0
        }

        optionPajakOrder.PPN = 0.11 * optionPajakOrder.DPP 
        optionPajakOrder.PPh_22 = 0.015 * optionPajakOrder.DPP


        const createPajakOrder = await prisma.pajak_Order.create({
            data: optionPajakOrder
        })

        if (createPajakOrder) {
            optionsCreateOrder.id_pajak_order = createPajakOrder.id
        }

        const createOrder = await prisma.orders.create({
            data: optionsCreateOrder
        });


        order.map(async (data, key) => {

            const dataProductCreate = {
                name: data.name,
                ukuran: data.ukuran,
                harga: Number(data.harga),
                Deskripsi_produk: data.Deskripsi_produk,
                categoriesId: data.kategoryId,
                IsProductCustom: true 
            };
            
            if (data?.jumlah_meter) {
                dataProductCreate.IsPermeter = true
            }

            const createProduct = await prisma.products.create({
                data: dataProductCreate
            })

            data.bahanBakuProduk.map(async (dataBahanBaku) => {
                await prisma.bahanBakuProduk.create({
                    data: {
                        id_produk: createProduct.id,
                        id_bahan_baku: Number(dataBahanBaku.id_bahan_baku),
                        jumlah: Number(dataBahanBaku.jumlah) * Number(data.jumlah),
                        satuan: dataBahanBaku.satuan
                    }
                })
            })

            data.product_images.map(async (dataImageProduk) => {
                await prisma.product_images.create({
                    data: {
                        name: dataImageProduk.name,
                        url_image: dataImageProduk.url_image,
                        product_image_id: dataImageProduk.product_image_id,
                        product_id: createProduct.id
                    }
                })
            })

            await prisma.product_Orders.create({
                data: {
                    id_orders: createOrder.id,
                    id_product: createProduct.id,
                    id_user: optionsCreateOrder.id_user,
                    status: 0,
                    Price: Number(data.jumlahHarga),
                    jumlah: data.jumlah,
                    jumlah_meter: data.jumlah_meter
                }
            });

        })


        const cekDataDibuat = await prisma.orders.findUnique({
            where: {
                id: createOrder.id
            },
            include: {
                product_Orders: true
            }
        })

        res.status(201).json(response.success(201, cekDataDibuat));


    }catch(err){
        // menampilkan error di console log
        console.log(err);

        // menampilkan response semua data jika gagal
        return res.status(500).json(response.error(500, "Internal Server Error"));
        }
}


module.exports = {
    createPengadaanMeubel
}