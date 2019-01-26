# Cloudfound
Cloudfound aims to support open-source and not-for-profit initiatives by crowdfunding and maintaining cloud resources and deployments using Stripe, Kubernetes, and Github.
Ideal candidates would be services or micro-services which can be used by many people and would benefit from decentralized funding and deployment versioning.

Examples of use cases:
- A web app created by a not-for-profit organization
- A database containing scientific or medical information
- A micro-service used by the public created by an online community
- A server running any docker image

# Overview
[See here](app/backend/README.md)

# Wallet and Costs
```js
revenue = deposited + pending_deposit
wallet = revenue - cumulative_cost
```

# Statuses
| Project Status     |                                                                                                          |
|--------------------|----------------------------------------------------------------------------------------------------------|
| pending_payment    | The project's funds need to reach the predicted monthly cost                                             |
| pending_merge      | The project's PR needs to be reviewed and merged                                                         |
| pending_deployment | The project's cluster has been created. Its deployment will be run when it receives its first usage data |
| running            | The project's deployment has run                                                                         |
| stopped            | The project's wallet ran below the predicted hourly cost and was stopped to prevent further expenses     |


| Payment Status  |                                                                                                                                                                                                                                                     |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pending_deposit | The payment is contributing to revenue but hasn't been used by the project's billed expenses                                                                                                                                                        |
| deposited       | The project's minimum funds have been reached                                                                                                                                                                                                       |
| refunded        | If a project's cluster is not created, payments with a `pending_deposit` status will be refunded.  Or if a project is stopped because its wallet dropped below its predicted hourly cost, payments with a `pending_deposit` status will be refunded |

| Github Payment Status |                                                              |
|---------------------|--------------------------------------------------------------|
| pending             | The project's funds need to reach the predicted monthly cost |
| success             | The project's minimum funds have been reached                |

# Roadmap
- [ ] Create deployment from template UI
- [ ] Support persistent disks
- [ ] Support preemptible machines
- [ ] Support Kubeless functions for serverless functions
- [ ] Add Kubernetes resource limits
- [ ] Set up not-for-profit corporation and USD account

# Challenges
Prevent clusters being misused to mine cryptocurrencies anonymously
