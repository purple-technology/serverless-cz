'use strict'

const AWS = require('aws-sdk')
const db = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
	await db.put({
		TableName: process.env.ORDER_PROCESSING_ACTIONS_TABLE_NAME,
		Item: {
			executionId: event.executionId,
			status: event.status,
			taskToken: event.taskToken
		}
	}).promise()
}
