const { Client } = require('pg');
const { db_password } = require('../config.json');

const db_client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'dvdrental',
        user: 'postgres',
        password: db_password
    })

module.exports = { db_client };