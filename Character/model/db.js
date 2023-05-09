const sql = require('mysql')
const crSql = sql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'nodejs'
    }

)
crSql.connect()

module.exports = crSql

// host: '202.92.4.97',
//         user: 'hhlzkewkhosting_cuongnvb2001',
//         password: '+E(,1eIuQa1p',
//         database: 'hhlzkewkhosting_nodejs'