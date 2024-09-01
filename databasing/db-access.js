const { Pool } = require('pg');
const { db_password } = require('../config.json');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'dvdrental',
    user: 'postgres',
    password: db_password,
    max: 20,
    idleTimeoutMillis: 30000, // Amount of time to keep the database open for connections
    connectionTimeoutMillis: 20000 // Amount of time to wait for a connection before timing out.
});

const query = async (text, params) => {
        const startTime = Date.now();
        let result;
        try {
            result = await pool.query(text, params);
        } catch (err) {
            console.log(err);
        }
        const duration = Date.now() - startTime;
        console.log(`Query \"${text}\" executed in ${duration}ms; rows: ${result.rowCount}`);
        return result;
};

module.exports = { pool: pool, query: query };