#!/bin/sh
yum install -y httpd
service httpd start
chkconfig httpd on

echo "Hello Cloud!" > /var/www/html/index.html