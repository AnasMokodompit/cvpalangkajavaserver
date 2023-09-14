const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const Categories = require('./Data/categories.json')
const Producs = require('./Data/products.json')
const Product_images = require('./Data/product_image.json')
const Roles = require('./Data/role.json')
const Users = require('./Data/user.json')
const review_product = require('./Data/review_product.json')

async function main() {

    // Categories
    await prisma.Categories.createMany({
        data: Categories
    })

    await prisma.Products.createMany({
        data: Producs
    })

    await prisma.Product_images.createMany({
        data: Product_images
    })

    await prisma.roles.createMany({
        data: Roles
    })

    await prisma.users.createMany({
        data: Users
    })

    await prisma.reviewevUserProduct.createMany({
        data: review_product
    })
}


main()
    .catch((e) => {
        console.error(`Error : ${e}`);
        process.exit(1)
    })
    .finally(async () => {
        console.log(`Berhasil Sedding Database`);
        prisma.$disconnect();
    })