'use strict'

module.exports.handler = async (input) => {
	// This funtion would send a notification email (or would send a message to SQS to be processed in a different service). For sake of simplicity the message is just logged to console.
	switch (input.status) {
		case 'PENDING':
			console.log('Thank you for using our services. Your order has been set.')
			break
		case 'PROCESSING':
			console.log('Your order is being processed.')
			break
		case 'SENT':
			console.log('Yay your order has been sent.')
			break
		case 'ERROR':
				console.log('Ooops, something is wrong with your order.')
				break
	}
	return input
}
