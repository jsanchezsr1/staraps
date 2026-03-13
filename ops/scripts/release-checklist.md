# Release Checklist

- Confirm all required AWS secrets exist.
- Confirm Aurora and Redis endpoints are correct.
- Confirm ACM certificate is issued and valid.
- Confirm Route 53 DNS is ready to point at the ALB.
- Confirm Prisma migrations are reviewed.
- Confirm ECS desired counts and autoscaling policies are correct.
- Confirm S3 artifact bucket policies are reviewed.
- Confirm CloudWatch alarms are configured.
- Confirm rollback plan is documented.
