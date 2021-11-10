### How to deploy the stack
Run `npm run deploy` in this folder.

These endpoints will be available after deploy:
- `POST /order`
- `POST /order/update`
- `GET /order/{orderId}`

### How to remove the stack
Run `npm run remove`

### How to operate the stack

#### Make an order
Call `POST /order` with payload:
```
{
  "items": ["really nice t-shirt", "pants"]
}
```
The response should look like:
```
{
  "executionArn": "arn:aws:states:eu-central-1:...",
  "startDate": ...
}
```
Save the executionArn somewhere, it is used as a order ID in the state machine.

#### Get the order status
After the order is created, use the orderId from the previous operation to call `GET /order/arn:aws:states:eu-central-1:...` to get the order status. The respose should be:
```
{
  "items": [
    "pants",
    "really nice t-shirt"
  ],
  "orderId": "arn:aws:states:eu-central-1:...",
  "status": "PENDING"
}
```

#### Update the order status
Call `POST /order/update` with payload:
```
{
  "executionId": "arn:aws:states:eu-central-1:...",
  "success": true
}
```
`success` property indicates if the update operation is successfull from the online store side.
