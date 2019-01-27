# Cloudfound
[Cloudfound](https://cloudfound.io) aims to support open-source and decentralized initiatives by crowdfunding and maintaining cloud resources and deployments using Stripe, Kubernetes, and Github.
The app itself functions as a (self-referential) proof of concept since its cluster, deployment, and fundings are all managed by its own code.
Ideal candidates would be services or micro-services which can be used by many people and would benefit from decentralized funding and deployment versioning.

Examples of use cases:
- A web app created by a not-for-profit organization
- A database containing scientific or medical information
- A micro-service used by the public created by an online community
- A server running any docker image

# Overview
[See here](app/backend/README.md)

# Roadmap
- [ ] Create deployment from template UI
- [ ] Support persistent disks
- [ ] Support preemptible machines
- [ ] Support Kubeless functions for serverless functions
- [ ] Add Kubernetes resource limits
- [ ] Set up not-for-profit corporation and USD account

# Challenges
Prevent clusters being misused to mine cryptocurrencies anonymously
