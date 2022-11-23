resource "aws_iam_group" "iam_group" {
    for_each = { for group in var.users_groups : group.name => group }

    name = each.value.name
}


data "aws_iam_policy_document" "iam_policy_document" {
  for_each = { for group in var.users_groups : group.name => group }

  policy_id = "policy_${each.value.name}"

  statement {
    sid = "Allow${each.value.name}"
    effect = "Allow"

    actions = each.value.policies.actions
    resources = each.value.policies.resources
  }
}


resource "aws_iam_policy" "iam_policy" {
  for_each = { for group in var.users_groups : group.name => group }

  name        = each.value.policies.name
  description = each.value.policies.description

  policy      = data.aws_iam_policy_document.iam_policy_document[each.value.name].json
}


resource "aws_iam_group_policy_attachment" "group_policy_attachment" {
  for_each = { for group in var.users_groups : group.name => group }

  group      = aws_iam_group.iam_group[each.value.name].name
  policy_arn = aws_iam_policy.iam_policy[each.value.name].arn
}


resource "aws_iam_group_membership" "iam_group_membership" {
  for_each = { for group in var.users_groups : group.name => group }

  name = each.value.name

  users = [for user in var.users : user.name if contains(user.user_groups_ids, each.value.id)]
  group = aws_iam_group.iam_group[each.value.name].name
}
