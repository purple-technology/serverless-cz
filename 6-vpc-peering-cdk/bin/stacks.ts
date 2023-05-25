#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { RequesterVpcStack } from '../lib/RequesterVpcStack'
import { AccepterVpcStack } from '../lib/AccepterVpcStack'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

const accepterAccountId = process.env.ACCEPTER_ACCOUNT_ID
if (!accepterAccountId) {
	throw new Error('ACCEPTER_ACCOUNT_ID is not set')
}

const accepterCidr = process.env.ACCEPTER_CIDR
if (!accepterCidr) {
	throw new Error('ACCEPTER_CIDR is not set')
}

const requesterAccountId = process.env.REQUEST_ACCOUNT_ID
if (!requesterAccountId) {
	throw new Error('REQUEST_ACCOUNT_ID is not set')
}

const cdkDefaultAccount = process.env.CDK_DEFAULT_ACCOUNT

const app = new cdk.App()

if (cdkDefaultAccount === accepterAccountId) {
	new AccepterVpcStack(app, 'AccepterVpcStack', {
		requesterAccountId,
		accepterVpcCidrBlock: ec2.IpAddresses.cidr(accepterCidr),
		env: {
			region: 'eu-central-1',
			account: accepterAccountId
		}
	})
}

if (cdkDefaultAccount === requesterAccountId) {
	const accepterVpcId = process.env.ACCEPTER_VPC_ID
	if (!accepterVpcId) {
		throw new Error('ACCEPTER_VPC_ID is not set')
	}
	const accepterRoleArn = process.env.ACCEPTER_ROLE_ARN
	if (!accepterRoleArn) {
		throw new Error('ACCEPTER_ROLE_ARN is not set')
	}
	new RequesterVpcStack(app, 'RequesterVpcStack', {
		accepterAccountId: accepterAccountId,
		accepterRegion: 'eu-central-1',
		accepterRoleArn,
		accepterVpcId,
		accepterCidr,
		env: {
			region: 'eu-central-1',
			account: requesterAccountId
		}
	})
}
