output "users_info" {
  value = {
    for user in aws_iam_user.user :
    user.name => {
      name = user.name
      password = aws_iam_user_login_profile.user_login_profile[user.name].password
    }
  }
}


