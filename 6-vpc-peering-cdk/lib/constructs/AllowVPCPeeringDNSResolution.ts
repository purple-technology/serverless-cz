/* Based on https://gist.githubusercontent.com/lfittl/78aef8a950bd1210fa67275994cb394d/raw/bf9962498cbd43116f5bd583cf8591b68cc4fec5/custom-vpc-peering-dns.ts */
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as logs from 'aws-cdk-lib/aws-logs'
import { AwsCustomResource, AwsCustomResourcePolicy, AwsSdkCall, PhysicalResourceId } from 'aws-cdk-lib/custom-resources'
import { Construct } from 'constructs'

export interface AllowVPCPeeringDNSResolutionProps {
  vpcPeering: ec2.CfnVPCPeeringConnection,
	accepterRoleArn: string
}

export class AllowVPCPeeringDNSResolution extends Construct {
  constructor(scope: Construct, id: string, props: AllowVPCPeeringDNSResolutionProps) {
    super(scope, id)

		const { vpcPeering, accepterRoleArn } = props

		const assumedRoleArn = accepterRoleArn

    const onCreate: AwsSdkCall = {
        service: "EC2",
        action: "modifyVpcPeeringConnectionOptions",
				// assumedRoleArn, // Probably still buggy https://github.com/aws/aws-cdk/issues/13601
        parameters: {
            VpcPeeringConnectionId: vpcPeering.ref,
            AccepterPeeringConnectionOptions: {
                AllowDnsResolutionFromRemoteVpc: true,
            },
            RequesterPeeringConnectionOptions: {
                AllowDnsResolutionFromRemoteVpc: true
            }
        },
        physicalResourceId: PhysicalResourceId.of(`allowVPCPeeringDNSResolution:${vpcPeering.ref}`)
    }
    const onUpdate = onCreate
    const onDelete: AwsSdkCall = {
        service: "EC2",
        action: "modifyVpcPeeringConnectionOptions",
				// assumedRoleArn,
        parameters: {
            VpcPeeringConnectionId: vpcPeering.ref,
            AccepterPeeringConnectionOptions: {
                AllowDnsResolutionFromRemoteVpc: false,
            },
            RequesterPeeringConnectionOptions: {
                AllowDnsResolutionFromRemoteVpc: false
            }
        },
    }

    const customResource = new AwsCustomResource(this, "allow-peering-dns-resolution-t", {
        policy: AwsCustomResourcePolicy.fromStatements([
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                resources: ["*"],
                actions: [
                    "ec2:ModifyVpcPeeringConnectionOptions",
                ]
            }),
        ]),
        logRetention: logs.RetentionDays.ONE_DAY,
        onCreate,
        onUpdate,
        onDelete,
    })

    customResource.node.addDependency(vpcPeering)
  }
}
