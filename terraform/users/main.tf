resource "aws_iam_user" "user" {
  for_each = { for user in var.users : user.name => user }

  name     = each.value.name
}


resource "aws_iam_user_login_profile" "user_login_profile" {
  for_each                = { for user in var.users : user.name => user }

  user                    = aws_iam_user.user[each.value.name].name
  password_reset_required = true
  password_length         = 24
}


resource "aws_iam_access_key" "iam_access_key" {
  for_each = { for user in var.users : user.name => user }

  user     = aws_iam_user.user[each.value.name].name
}


data "aws_iam_policy_document" "iam_policy_document" {
  for_each = { for user in var.users : user.name => user }

  policy_id = "policy_${each.value.name}"

  statement {
    sid = "Allow${each.value.name}"
    effect = "Allow"

    actions = each.value.policies.actions
    resources = each.value.policies.resources
  }
}


resource "aws_iam_policy" "iam_policy" {
  for_each = { for user in var.users : user.name => user }

  name        = each.value.policies.name
  description = each.value.policies.description

  policy      = data.aws_iam_policy_document.iam_policy_document[each.value.name].json
}


resource "aws_iam_user_policy_attachment" "user_policy_attachment" {
  for_each = { for user in var.users : user.name => user }

  user      = aws_iam_user.user[each.value.name].name
  policy_arn = aws_iam_policy.iam_policy[each.value.name].arn
}

