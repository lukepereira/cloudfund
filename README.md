Disclaimer: I recently removed the cluster hosting this app ~~because my gcp credits ran out~~. Please contact me if you are interested in contributing to or maintaining this project.

# Cloudfound
[Cloudfound](https://cloudfound.io) aims to support open-source and decentralized initiatives by crowdfunding and maintaining cloud resources and deployments. It does this using Stripe (to process funds), Kubernetes (to manage clusters and deployments), and the Github API (for deployment and configuration versioning).
The app is essentially a management system and serves as a proof of concept since its cluster, deployment, and fundings are all managed by its own code.

Examples of use cases:
- A web app created by a not-for-profit organization 
- A database containing scientific or medical information which can be shared among many researchers
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
