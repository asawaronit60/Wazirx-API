const {Pool} = require('pg')

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"wazirx_database",
    password:"admin",
    port:5432
})

async function createTable(){
    await pool.query
    (
    "CREATE TABLE IF NOT EXISTS wazirx ( id UUID PRIMARY KEY, name VARCHAR(255) ,last decimal ,buy decimal ,sell decimal,volume decimal,base_unit VARCHAR(255));" 
    )
}

module.exports =  {
    pool,
    createTable
}