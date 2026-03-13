output "alb_dns_name" {
  value = aws_lb.platform.dns_name
}

output "artifacts_bucket" {
  value = aws_s3_bucket.artifacts.bucket
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.platform.name
}
