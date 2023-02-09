'use strict'

const AWS = require('aws-sdk')
const db = new AWS.DynamoDB.DocumentClient()
const stepFunctions = new AWS.StepFunctions()

module.exports.handler = async (event) => {
	console.log(event)
	const executionId = event.pathParameters.id
	const runAgain = event.queryStringParameters.runAgain

	const recoveryItem = await db
		.get({
			TableName: process.env.RECOVERIES_TABLE_NAME,
			Key: {
				executionId
			}
		})
		.promise()

	console.log(runAgain, {
		taskToken: recoveryItem.Item.taskToken,
		output: JSON.stringify(recoveryItem.Item.input)
	})
	if (runAgain === 'true') {
		console.log('sendTaskFailure')
		await stepFunctions
			.sendTaskSuccess({
				taskToken: recoveryItem.Item.taskToken,
				output: JSON.stringify(recoveryItem.Item.input)
			})
			.promise()
	} else {
		console.log('sendTaskFailure')
		console.log(
			'======',
			await stepFunctions
				.sendTaskFailure({
					taskToken: recoveryItem.Item.taskToken,
					cause: 'string',
					error: 'string'
				})
				.promise()
		)
	}

	await db
		.delete({
			TableName: process.env.RECOVERIES_TABLE_NAME,
			Key: {
				executionId
			}
		})
		.promise()

	return {
		statusCode: 200
	}
}
