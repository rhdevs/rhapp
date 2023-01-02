# Production Setup Guides

## Dockerized Production Server Setup (Ubuntu)

We're using vercel to deploy the frontend, so we really only need to care about our backend + everything else. These are steps to set up a production server of rhapp, which is mainly the backend and some network infra.

1. Set up DigitialOcean droplet.
	* Select the one-click Docker on Ubuntu 22.04 and scale as necessary. This will setup docker, ssh and a bunch of stuff without hassle.
	* Datacenter region: Singapore-1
	* Open droplet page and get a reserved IP
	* Configure firewall to expose ports 22, 80, 443 ONLY
1. Set up DNS Records (we use vercel)
	* Remember to use the reserved IP
1. Copy the secrets folder over from other instances or ping the heads for them.
1. To start the instance, run `./deploy-up.sh`. To spin down all instances, run `./deploy-down.sh`
1. To update the instances without downtime, run `./deploy-all.sh`.
