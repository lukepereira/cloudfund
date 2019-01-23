# Cloudfound
Cloudfound aims to support open-source and not-for-profit initiatives by crowdfunding and maintaining cloud resources and deployments using Stripe, Kubernetes, and Github.
Ideal candidates would be services or micro-services which can be used by many people and would benefit from decentralized funding and deployment versioning.

Examples of use cases:
- A web app created by a not-for-profit organization
- A read-only database containing scientific or medical information
- A server running any docker image

# Overview
##### When a project is created:
- A `project_id` is created
- A pull request is opened containing a JSON cluster configuration file and a YAML Kubernetes deployment file
- A GitHub "payment" status is set to pending on the PR, preventing it from being merged
- A monthly and hourly cost is predicted based on machine type, node count, and location
- A project entity is created in Google Datastore containing the project's details

##### When a payment is submitted on a project's page:
- A payment entity is created in Google Datastore containing a reference to the `project_id`, a unique `payment_id`, and `status` of `pending_deposit`
- The payment value is added to the project's `revenue` and the `wallet` increases accordingly. (Where `wallet` = `revenue` - `cumulative billed cost`)

##### When funds meet or exceed the predicted monthly cost:
- Payments with status `pending_deposit` are updated to `deposited` and they are no longer eligible to be refunded
- The project's status is set to `pending_merge` and the PR can be merged after review

##### [TODO] If funds are not met after a month of fundraising:
- Payments with status `pending_deposit` are refunded through Stripe and have their status updated to `refunded`
- The project entity is deleted and its PR is closed

##### When a project with a status of `pending_merge` is reviewed and merged:
- A GitHub webhook will trigger the cluster described in the PR to be created
- A `project_id` label is added to every node (VM instance) in the cluster
- The project's status is updated to `pending_deployment`

##### When billing data is exported hourly into Google Big Query:
- A pub sub topic is triggered
- A query is run on the exported billing data table to get all resources with `project_id` labels
- All projects have their `cumulative_cost` updated
- All projects have their `wallet` updated
- If a billed project has a `pending_deployment` status:
    - The project's Kubernetes deployment is run on the cluster 
    - A `project_id` label is added to any services described in the deployment file
    - [TODO] The project entity is updated with any external IPs created from the deployment
    - The project's status is updated to `running`
- If a billed project has a `wallet` less than its predicted hourly cost:
    - The project's cluster is scaled to 0 to prevent further expenses.
    - The project's status is updated to `stopped`


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

