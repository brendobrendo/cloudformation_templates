#!/bin/bash

echo "Enter the template file name: "
read file_name

full_file_path="file://$file_name"

echo "Enter the stack name: "
read stack_name

aws cloudformation create-stack --stack-name $stack_name --template-body $full_file_path --profile general-iamadmin --capabilities CAPABILITY_IAM --region us-west-1
