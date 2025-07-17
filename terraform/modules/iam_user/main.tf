resource "aws_iam_user" "this" {
  name = var.user_name
  tags = var.tags
}

resource "aws_iam_user_policy" "s3_rw" {
  name   = "${var.user_name}-s3-rw"
  user   = aws_iam_user.this.name
  policy = data.aws_iam_policy_document.s3_rw.json
}

data "aws_iam_policy_document" "s3_rw" {
  statement {
    actions   = ["s3:PutObject", "s3:GetObject", "s3:ListBucket"]
    resources = [
      var.bucket_arn,
      "${var.bucket_arn}/*"
    ]
  }
}

resource "aws_iam_access_key" "this" {
  user = aws_iam_user.this.name
}