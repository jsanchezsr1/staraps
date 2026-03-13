# Platform Production Release Package

This package provides a production deployment scaffold for the full Milestones 1–10 platform.

Included:
- Dockerfiles for `web-platform`, `api-platform`, and `worker`
- `docker-compose.production.yml`
- `.env` templates
- Terraform scaffold for AWS production infrastructure
- GitHub Actions CI/CD workflows
- deployment scripts

Important:
- This is a deployment-ready scaffold, not a fully verified release artifact.
- You must still wire exact runtime commands, secrets, image names, domain names, and account-specific AWS identifiers.
- Review all environment variables, IAM policies, networking, and scaling settings before production use.
