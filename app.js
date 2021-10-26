const express = require('express')
const axios = require('axios')
const mongoose = require('mongoose')
const ejs = require('ejs')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

//schema of the database
const dataSchema = new mongoose.Schema({
	name: String,
	last: Number,
	buy: Number,
	sell: Number,
	volume: Number,
	base_unit: String
})


const Wazirx = new mongoose.model('Wazirx', dataSchema)


const addDataToDB = async ({ name, sell, buy, volume, base_unit, last }) => {

	const wazir = await new Wazirx({
		name: name,
		last: last,
		buy: buy,
		sell: sell,
		volume: volume,
		base_unit: base_unit
	})
	await wazir.save();
}


const addData = async (req, res, next) => {
	const apiData = await axios.get('https://api.wazirx.com/api/v2/tickers')
	for (let i = 0; i < 10; i++) {
		const topTen = apiData.data[Object.keys(apiData.data)[i]]
		await addDataToDB(topTen)
	}
	next()
}


const deleteAll = async (req, res, next) => {
	await Wazirx.deleteMany({});
	next();
}


//route handler
// app.get('/', deleteAll, addData, (req, res) => {
// 	res.render('home')
// })

app.get('/getData', deleteAll , addData  ,async (req, res) => {
	try {
		const data = await Wazirx.find({});

		res.render('content', {
			data
		})

	} catch (err) {
		res.send({
			status: 'Failed to get the data',
			error: err.message
		})
	}
})





//start
app.listen(3000, () => {
	console.log("server is runnig at port 3000")
})
