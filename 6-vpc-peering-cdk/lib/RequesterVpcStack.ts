import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
// import { AllowVPCPeeringDNSResolution } from './constructs/AllowVPCPeeringDNSResolution'

interface StackProps extends cdk.StackProps {
	accepterCidr: string
	accepterVpcId: string
	accepterAccountId: string
	accepterRegion: string
	accepterRoleArn: string
}

export class RequesterVpcStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const { accepterCidr, accepterVpcId, accepterAccountId, accepterRegion, accepterRoleArn } = props

		const vpc = new ec2.Vpc(this, 'RequesterVpc', {
			ipAddresses: ec2.IpAddresses.cidr('172.51.0.0/16'),
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

		const peeringConnection = new ec2.CfnVPCPeeringConnection(
			this,
			'RequesterToAccepterPeering',
			{
				vpcId: vpc.vpcId,
				peerVpcId: accepterVpcId,
				peerOwnerId: accepterAccountId,
				peerRegion: accepterRegion,
				peerRoleArn: accepterRoleArn,
				tags: [
					{
						key: 'Name',
						value: 'requester->accepter'
					}
				]
			}
		)

		vpc.privateSubnets.forEach(({ routeTable: { routeTableId } }, index) => {
			const route = new ec2.CfnRoute(
				this,
				'IsolatedSubnetPeeringConnectionRoute' + index,
				{
					destinationCidrBlock: accepterCidr,
					routeTableId,
					vpcPeeringConnectionId: peeringConnection.ref
				}
			)
			route.addDependency(peeringConnection)
		})

		// new AllowVPCPeeringDNSResolution(this, "PeerConnectionDnsResolution", {
		// 	vpcPeering: peeringConnection,
		// 	accepterRoleArn
		// })
	}
}
