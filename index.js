const express = require('express')
const app = express()
const axios = require('axios')
const { uuid } = require('uuidv4')
const { pool, createTable } = require('./database')

createTable()

app.set('view engine', 'ejs')
app.use(express.static("public"));

const addDataToDB = async ({ name, sell, buy, volume, base_unit, last }) => {
    let id = uuid();
    await pool.query(
        "INSERT INTO wazirx (id, name,last ,sell,buy,volume,base_unit) VALUES ($1 ,$2,$3,$4 ,$5,$6,$7)",
        [id, name, last, sell, buy, volume, base_unit]
    )

}



const getData = async (req, res, next) => {
    const apiData = await axios.get('https://api.wazirx.com/api/v2/tickers')
    for (let i = 0; i < 10; i++) {
        const topTen = apiData.data[Object.keys(apiData.data)[i]]
        await addDataToDB(topTen)
    }
    next()
}


const deleteAll = async (req, res, next) => {
    await pool.query("DELETE FROM WAZIRX")
    next();
}


app.get('/', deleteAll, getData, async (req, res) => {
    try {

        let data = await pool.query("SELECT * FROM wazirx")

        res.render('content', {
            data: data.rows
        })

    } catch (err) {
        res.send({
            status: 'Failed to get the data',
            error: err.message
        })
    }
})


const PORT  = 3000 || 8000


//start
app.listen(PORT, () => {
    console.log(`server is runnig at port ${PORT}`)
})