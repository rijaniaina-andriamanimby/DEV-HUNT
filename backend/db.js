const Pool = require('pg').Pool;

const pool = new Pool(
    {
        host: 'localhost',
        user: 'postgres',
        password: 'BLANDIN4',
        port: 5432,
        database: 'devhunt'
    }
);

module.exports = pool;