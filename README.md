# Template repository for Backend deployment to AWS EC2

This repo has a pipeline that:
- Deploys AWS EC2 Instance with own VPC and static Elastic IP
- Installs docker, setups git connection
- Pulls project repo and runs the docker-compose file.
- Deploys changes to the project on push

Resources are named by the GitHub repository name. Information about the current infrastructure state is stored in the terraform-tfstate bucket, so you can adjust some resources on the fly and deploy changes by running `deploy project` action again. If you want to deploy code changes manually run `deploy changes to Dev` action.

> Note: Please do not remove any resources without DevOps.

## Usage

### Step 1: On the repo main page choose "Use this template" - "Create a new repository".

![!\[alt text\](image-1.png)](pictures/image-1.png)

_For additional details look through_ https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template

> Note: Please use only lowercase letters, numbers or dash (-) for repository name.


### Step 2: Put your code into a new repository.

### Step 3. Generate the ssh key for ssh access and deployment purposes (or use your own if already have one).

For Linux:

```sh
ssh-keygen -t rsa -b 4096 -C "id_rsa" -f id_rsa2 -N ""
```

For Windows:

```sh
cmd /c 'ssh-keygen -t rsa -b 4096 -C "id_rsa" -f id_rsa2 -N ""'
```

### Step 4. Add the `Deploy key` to your repository and paste the content of ssh public key *.pub there.

![!\[alt text\](image.png)](pictures/image.png)

### Step 5. Add repository secrets.

![!\[alt text\](image-3.png)](pictures/image-3.png)

```sh
SSH_KEY: The content of the private ssh key for ssh access to the server.
SSH_KEY_PUB: The content of public ssh key *.pub.
ENV: The content of .env file for a project.
AWS_ACCESS_KEY_ID: IAM access key for AWS API operations.
AWS_SECRET_ACCESS_KEY: The secret key paired with the access key.
AWS_REGION: The AWS region where resources will be created (e.g., us-east-1).
```

### Step 6: And run the `deploy project` Action.

![!\[alt text\](image-2.png)](pictures/image-2.png)

### Step 7: Finally, open your browser and check your project is alive using `http://your-instance-ip` or domain (if present).

## Additional setup

You can edit variables in [terraform.tfvars](https://github.com/osyshyn/deploy-backend-to-ec2-template/blob/main/terraform/terraform.tfvars) to adjust inbound ports or instance type.

```sh
# EC2 Instance
ports   = ["22", "80", "443"] - Inbound ports for your instance (leave if suitable)
type    = "t2.micro" - Type of your instance (leave if suitable)
```

***For any questions ping DevOps.
Happy coding)***
