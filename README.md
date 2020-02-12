# Cloudfund
[Cloudfund](https://cloudfund.netlify.com) aims to support open-source and decentralized initiatives by crowdfunding and maintaining cloud resources and deployments. It does this using Stripe (to process funds), Kubernetes (to manage clusters and deployments), and the Github API (for deployment and configuration versioning).
The app serves as a proof of concept since its cluster, deployment, and fundings are all managed by its own code.

Examples of use cases:
- A web app created by a not-for-profit organization 
- A database and API which can be shared among many researchers
- A micro-service used by the public created by an online community
- A server running any docker image

An ideal scenerio would be one where a large corporation funds an open-source public micro-service which can be used by many people. 

# Detailed Overview
[See here](app/backend/README.md)

# Roadmap
- [ ] Create deployment from templates using UI
- [ ] Support persistent disks
- [ ] Support preemptible machines
- [ ] Support Kubeless functions for serverless functions
- [ ] Add Kubernetes resource limits
- [ ] Set up not-for-profit corporation and USD account

# Challenges
Prevent clusters being misused to mine cryptocurrencies anonymously
