'use strict'

const axios = require('axios').default

module.exports.handler = async (input) => {
	const response = await axios.get(`${process.env.EXTERNAL_API}/${input.item}`)
	console.log(response)
	return input
}
