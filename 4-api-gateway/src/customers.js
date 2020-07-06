'use strict'

module.exports.handler = async (event) => {
	console.log('Načítám klienty z databáze...')
	console.log(JSON.stringify(event, null, 2))

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			customers: [
				{
					id: 1,
					name: 'Karel'
				},
				{
					id: 2,
					name: 'Pepa'
				},
				{
					id: 3,
					name: 'Janek'
				}
			]
		})
	}
}
