# Cross-account VPC Peering with CDK

## Setup

You need to have [pnpm](https://pnpm.io/installation) installed and configured AWS profile. You can also use sso commands from [package.json](./package.json) if you use  [AWS Identity Center](https://aws.amazon.com/iam/identity-center).

1. See [.env.example](.env.example) variables and create new ```.env``` file with filled values.
2. Install dependencies with:

    ```bash
    pnpm i
    ```

3. Deploy accepter stack first with ```pnpm run deploy:accepter``` or ```pnpm run ssod:deploy:accepter``` for SSO.
4. Deploy requester stack as the second with ```pnpm run deploy:requester``` or ```pnpm run ssod:deploy:requester``` for SSO.
