'use strict'

const AWS = require('aws-sdk')
const db = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
	const result = await db.get({
		TableName: process.env.ORDERS_TABLE_NAME,
		Key: {
			orderId: event.pathParameters.id,
		}
	}).promise()

	return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
}
