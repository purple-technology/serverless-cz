import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

interface StackProps extends cdk.StackProps {
	requesterAccountId: string
	accepterVpcCidrBlock: ec2.IIpAddresses
}

export class AccepterVpcStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const { accepterVpcCidrBlock, requesterAccountId } = props

		new ec2.Vpc(this, 'AccepterVpcStack', {
			ipAddresses: accepterVpcCidrBlock,
			maxAzs: 3,
			subnetConfiguration: [
				{
					name: 'isolated',
					subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
					cidrMask: 20
				}
			],
			enableDnsHostnames: true,
			enableDnsSupport: true
		})

		const peeringRole = new iam.Role(this, "AcceptVpcPeeringFromRequesterAccountRole", {
			roleName: "AcceptVpcPeeringFromRequesterAccountRole",
			assumedBy: new iam.AccountPrincipal(requesterAccountId)
		})
		peeringRole.addToPolicy(new iam.PolicyStatement({
			actions: [
				"ec2:AcceptVpcPeeringConnection",
				"ec2:ModifyVpcPeeringConnectionOptions"
			],
			resources: ["*"]
		}))
	}
}
