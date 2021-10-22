'use strict'

const AWS = require('aws-sdk')
const db = new AWS.DynamoDB.DocumentClient()
const stepFunctions = new AWS.StepFunctions()

module.exports.handler = async (event) => {
	const body = JSON.parse(event.body);
	const executionId = body.executionId
	const success = body.success

	const action = await db.get({
		TableName: process.env.ORDER_PROCESSING_ACTIONS_TABLE_NAME,
		Key: {
			executionId
		}
	}).promise()

	if (success) {
		await stepFunctions.sendTaskSuccess({
			taskToken: action.Item.taskToken,
			output: '{}'
		}).promise()
	} else {
		await stepFunctions.sendTaskFailure({
			taskToken: action.Item.taskToken
		}).promise()
	}

	await db.delete({
		TableName: process.env.ORDER_PROCESSING_ACTIONS_TABLE_NAME,
		Key: {
			executionId
		}
	}).promise()

	return {
		statusCode: 200
	}
}
