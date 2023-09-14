const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const jwtWebToken = require("../utility/jwtWebtoken")
const pagination = require('../utility/pagination')


const prisma = new PrismaClient()

const login = async (req, res) => {
    try{
      const {email, password} = req.body
      let jwt = ''
      // console.log(email)
      
      const loginEmail = await prisma.users.findUnique({
        where: {
          email: email
        }
      
      })

  
      if (loginEmail === null) {
          return res.status(404).json(responseModel.error(404, `Email Tidak Terdaftar`))
      }
      
      // if (loginEmail) {
          
        if (loginEmail.password !== password) {
          return res.status(404).json(responseModel.error(404, `Password Tidak Cocok, Masukan kembali password yang sesuai`))
        }

        jwt = jwtWebToken(loginEmail)

        console.log(jwt.token)
        await prisma.users.update({
          where: {
            id: loginEmail.id
          },
          data: {
            token: jwt.token
          }
        })

        res.cookie('REFRESH_TOKEN', jwt.token, {
          httpOnly: true,
          // secure: true,
          sameSite: "none",
          maxAge: 1000 * 60 * 60 * 24 * 30,
        });
    
  
      console.log(res.cookie())
  
      return res.status(200).json(responseModel.success(200, jwt))
  
    }catch(error){
      console.log(error)
      return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
  }


  const getUserById = async (req, res) => {
    try{
      const {id} = req.params

      const getUser = await prisma.users.findUnique({
        where: {
          id: Number(id)
        }
      })

      return res.status(200).json(responseModel.success(200, getUser))


    }catch(err){
      console.log(err)
      return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
  }


  module.exports = {
    login,
    getUserById
  }