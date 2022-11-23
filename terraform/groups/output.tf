output "users_groups" {
  value = {
    for group in aws_iam_group.iam_group : group.name => {
      id = group.id
      name = group.name
      arn = group.arn
      path = group.path
      unique_id = group.unique_id
    }
  }
}