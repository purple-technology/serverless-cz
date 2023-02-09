'use strict'

const AWS = require('aws-sdk')
const db = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
	const input = event.Input
	const error = input.lambdaFunctionError
	delete input.lambdaFunctionError
	await db
		.put({
			TableName: process.env.RECOVERIES_TABLE_NAME,
			Item: {
				executionId: event.Context.Execution.Id,
				step: event.Context.State.Name,
				taskToken: event.Context.Task.Token,
				input,
				error
			}
		})
		.promise()
	console.log(
		`New error handled. To run again go to ${process.env.FINISH_RECOVERY_API}/${event.Context.Execution.Id}?runAgain=true`
	)
	return input
}
