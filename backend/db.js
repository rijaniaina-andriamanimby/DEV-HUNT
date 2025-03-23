const Pool = require('pg').Pool;

const pool = new Pool(
    {
        host: 'localhost',
        user: 'postgres',
        password: 'rijaniaina',
        port: 5432,
        database: 'devhunt'
    }
);

module.exports = pool;