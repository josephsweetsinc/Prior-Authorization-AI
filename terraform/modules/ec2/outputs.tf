output "instance_id" {
  description = "ID of the EC2 instance"
  value       = module.ec2_instance[0].id
}

output "instances_public_ips" {
  description = "Public elastic ip"
  value = [for instance in module.ec2_instance : instance.public_ip]
}