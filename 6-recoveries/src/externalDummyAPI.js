'use strict'

module.exports.handler = async (event) => {
	console.log(JSON.stringify(event))

	if (Math.random() < 0.5) {
		return {
			statusCode: 500
		}
	}
	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Product is OK' })
	}
}
