import dotenv from 'dotenv'
dotenv.config()
export default {
    persistence: process.env.PERSISTENCE,
    port: process.env.PORT || 8080,
    dbUrl: 'mongodb+srv://pae:crud1234@cluster0.qu1kfps.mongodb.net/',
    dbName: 'ecommerce-clase8',
    mailUser: 'pablo.echegaray97@gmail.com',
    mailPass: 'zgvkrunkubrfbykc'
}