import os
import json

class TerraformClass:
    def __init__(self, user_id, region, aws_access_key_id, aws_secret_key, json_list_variables):
        self.user_id = user_id
        self.region = region
        self.workspace = str(user_id) + '-' + region
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_key = aws_secret_key
        self.terraform_path = "../terraform"
        self.json_list_variables = json.loads(json_list_variables) if type(json_list_variables) == str else json_list_variables
    

    def init(self):
        print('[Terraform] Initializing terraform')
        os.system('terraform init -input=false -backend')
        os.system('terraform workspace new ' + self.workspace)
        os.system('terraform workspace select ' + self.workspace)
        print('[Terraform] Terraform initialized')

    def plan(self):
        print('[Terraform] Planning terraform')

        with open('variables.json', 'w') as outfile:
            json.dump(self.json_list_variables, outfile)

        os.system('terraform plan -var-file=variables.json -var aws_access_key=' + self.aws_access_key_id + ' -var aws_secret_key=' + self.aws_secret_key)
        os.remove('variables.json')

        print('[Terraform] Terraform planned')     


    def apply(self):
        print('[Terraform] Applying terraform')

        with open('variables.json', 'w') as outfile:
            json.dump(self.json_list_variables, outfile)

        os.system('terraform apply -var-file=variables.json -var aws_access_key=' + self.aws_access_key_id + ' -var aws_secret_key=' + self.aws_secret_key + ' -auto-approve')
        os.remove('variables.json')

        print('[Terraform] Terraform applied')


    def destroy(self):
        print('[Terraform] Destroying terraform')
        self.set_terraform_path()
        os.system('terraform workspace select ' + self.workspace)
        os.system('terraform destroy -var aws_access_key=' + self.aws_access_key_id + ' -var aws_secret_key=' + self.aws_secret_key + '-auto-approve')
        print('[Terraform] Terraform destroyed')


    def set_terraform_path(self):
        print('[Terraform] Setting terraform path')
        os.chdir(self.terraform_path)
        print('[Terraform] Terraform path set')


    def get_terraform_output(self):
        self.set_terraform_path()
        self.init()

        output = os.popen('terraform output -json').read()
        output = json.loads(output)

        return output


    def execute_apply(self):
        self.set_terraform_path()
        self.init()
        self.apply()


