import os
import json

import flask
import flask_cors
import flask_sqlalchemy
import flask_praetorian

from TerraformClass import TerraformClass

db = flask_sqlalchemy.SQLAlchemy()
guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)
    roles = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True, server_default='true')
    aws_access_key_id = db.Column(db.Text)
    aws_secret_key = db.Column(db.Text)

    @property
    def rolenames(self):
        try:
            return self.roles.split(',')
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active


class TerraformConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    region = db.Column(db.Text)
    json_config = db.Column(db.JSON)

    @classmethod
    def lookup(cls, id):
        return cls.query.filter_by(id=id).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active



# Initialize flask app for the example
app = flask.Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'top_secret'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 7}

# Initialize the flask-praetorian instance for the app
guard.init_app(app, User)

# Initialize a local database for the example
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.getcwd(), 'database.db')}"
db.init_app(app)

# Initializes CORS so that the api_tool can talk to the example app
cors.init_app(app)

# Add users for the example
with app.app_context():
    db.create_all()
    if db.session.query(User).filter_by(username='davirvs').count() < 1:
        db.session.add(User(
          username='davirvs',
          password=guard.hash_password('davirvs'),
          roles='admin'
            ))
    db.session.commit()


# Set up some routes for the example
@app.route('/api/')
def home():
    return {"status": "OK"}, 200

  
@app.route('/api/login', methods=['POST'])
def login():
    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/api/login -X POST \
         -d '{"username":"davirvs","password":"davirvs"}'
    """
    req = flask.request.get_json(force=True)
    username = req.get('username', None)
    password = req.get('password', None)
    user = guard.authenticate(username, password)
    ret = {'access_token': guard.encode_jwt_token(user)}
    return ret, 200


# REGISTER
@app.route('/api/register', methods=['POST'])
def register():
    """
    Registers a new user by parsing a POST request containing user credentials
    and issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/api/register -X POST \
         -d '{"username":"davirvs","password":"davirvs"}'
    """
    req = flask.request.get_json(force=True)
    username = req.get('username', None)
    password = req.get('password', None)
    user = User.query.filter_by(username=username).first()
    if user:
        return {'message': 'User {} already exists'.format(username)}, 409
    db.session.add(User(
        username=username,
        password=guard.hash_password(password),
        roles='user'
    ))
    db.session.commit()
    return {'message': 'User {} was created'.format(username)}, 201


# update aws credentials
@app.route('/api/update-aws-credentials', methods=['POST'])
@flask_praetorian.auth_required
def update_aws_credentials():
    """
    Updates the user's AWS credentials.
    .. example::
       $ curl http://localhost:5000/api/update-aws-credentials -X POST \
         -d '{"aws_access_key_id":"davirvs","aws_secret_key":"davirvs"}'
    """
    req = flask.request.get_json(force=True)
    aws_access_key_id = req.get('aws_access_key_id', None)
    aws_secret_key = req.get('aws_secret_key', None)
    user = flask_praetorian.current_user()
    user.aws_access_key_id = aws_access_key_id
    user.aws_secret_key = aws_secret_key
    db.session.commit()
    return {'message': 'AWS credentials updated'}, 200


# GET AWS CREDENTIALS
@app.route('/api/get-aws-credentials', methods=['GET'])
@flask_praetorian.auth_required
def get_aws_credentials():
    """
    Gets the user's AWS credentials.
    .. example::
       $ curl http://localhost:5000/api/get-aws-credentials -X GET
    """
    user = flask_praetorian.current_user()
    return {'aws_access_key_id': user.aws_access_key_id, 'aws_secret_key': user.aws_secret_key}, 200

  
@app.route('/api/refresh', methods=['POST'])
def refresh():
    """
    Refreshes an existing JWT by creating a new one that is a copy of the old
    except that it has a refrehsed access expiration.
    .. example::
       $ curl http://localhost:5000/api/refresh -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    print("refresh request")
    old_token = flask.request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200

# create new TerraformConfig
@app.route('/api/create-terraform-config', methods=['POST'])
@flask_praetorian.auth_required
def create_terraform_config():
    """
    Creates a new TerraformConfig.
    .. example::
       $ curl http://localhost:5000/api/create-terraform-config -X POST \
         -d '{"name":"davirvs","aws_access_key_id":"davirvs","aws_secret_key":"davirvs","aws_region":"davirvs","aws_availability_zone":"davirvs","aws_vpc_cidr":"davirvs","aws_subnet_cidr":"davirvs","aws_instance_type":"davirvs","aws_instance_key_name":"davirvs","aws_instance_image_id":"davirvs","aws_instance_user_data":"davirvs","aws_instance_security_group_id":"davirvs","aws_instance_count":"davirvs"}'
    """
    req = flask.request.get_json(force=True)
    
    user_id = flask_praetorian.current_user().id
    aws_access_key_id = flask_praetorian.current_user().aws_access_key_id
    aws_secret_key = flask_praetorian.current_user().aws_secret_key

    region = req.get('region', None)
    json_config = req.get('json_config', None)
    json_config = json.dumps(json_config)

    # check if config already exists with same region
    config = TerraformConfig.query.filter_by(user_id=user_id, region=region).first()
    if config:
        return {'message': 'Config already exists for region {}'.format(region)}, 409

    db.session.add(TerraformConfig(
        user_id=user_id,
        region=region,
        json_config=json_config
    ))
    db.session.commit()

    terraform_config = TerraformConfig.query.filter_by(user_id=user_id, region=region).first()
    json_response =  {'id': terraform_config.id, 'user_id': terraform_config.user_id, 'region': terraform_config.region, 'json_config': terraform_config.json_config}

    terraform_class = TerraformClass(
        user_id=user_id,
        region=json_response['region'],
        aws_access_key_id=aws_access_key_id,
        aws_secret_key=aws_secret_key,
        json_list_variables=json_response['json_config']
    )
    terraform_class.execute_apply()

    return json_response, 201

# update TerraformConfig
@app.route('/api/update-terraform-config', methods=['POST'])
@flask_praetorian.auth_required
def update_terraform_config():
    """
    Updates a TerraformConfig.
    .. example::
       $ curl http://localhost:5000/api/update-terraform-config -X POST \
         -d '{"id":"davirvs","name":"davirvs","aws_access_key_id":"davirvs","aws_secret_key":"davirvs","aws_region":"davirvs","aws_availability_zone":"davirvs","aws_vpc_cidr":"davirvs","aws_subnet_cidr":"davirvs","aws_instance_type":"davirvs","aws_instance_key_name":"davirvs","aws_instance_image_id":"davirvs","aws_instance_user_data":"davirvs","aws_instance_security_group_id":"davirvs","aws_instance_count":"davirvs"}'
    """
    req = flask.request.get_json(force=True)
    
    user_id = flask_praetorian.current_user().id
    aws_access_key_id = flask_praetorian.current_user().aws_access_key_id
    aws_secret_key = flask_praetorian.current_user().aws_secret_key

    id = req.get('id', None)
    region = req.get('region', None)
    json_config = req.get('json_config', None)

    terraform_config = TerraformConfig.query.filter_by(user_id=user_id, id=id).first()
    terraform_config.region = region
    terraform_config.json_config = json_config
    db.session.commit()

    json_response = {'id': terraform_config.id, 'user_id': terraform_config.user_id, 'region': terraform_config.region, 'json_config': terraform_config.json_config}
    
    terraform_class = TerraformClass(
        user_id=user_id,
        region=json_response['region'],
        aws_access_key_id=aws_access_key_id,
        aws_secret_key=aws_secret_key,
        json_list_variables=json_response['json_config']
    )
    terraform_class.execute_apply()


    return json_response, 200

# delete TerraformConfig
@app.route('/api/delete-terraform-config/<id>', methods=['DELETE'])
@flask_praetorian.auth_required
def delete_terraform_config(id):
    """
    Deletes a TerraformConfig.
    .. example::
       $ curl http://localhost:5000/api/delete-terraform-config -X POST \
         -d '{"id":"davirvs"}'
    """
    
    user_id = flask_praetorian.current_user().id
    aws_access_key_id = flask_praetorian.current_user().aws_access_key_id
    aws_secret_key = flask_praetorian.current_user().aws_secret_key

    # check if config exists
    config = TerraformConfig.query.filter_by(user_id=user_id, id=id).first()
    if not config:
        return {'message': 'Config does not exist'}, 404

    terraform_config = TerraformConfig.query.filter_by(user_id=user_id, id=id).first()

    json_response = {'id': terraform_config.id, 'user_id': terraform_config.user_id, 'region': terraform_config.region, 'json_config': terraform_config.json_config}

    db.session.delete(terraform_config)
    db.session.commit()

    terraform_class = TerraformClass(
        user_id=user_id,
        region=json_response['region'],
        aws_access_key_id=aws_access_key_id,
        aws_secret_key=aws_secret_key,
        json_list_variables=json_response['json_config']
    )
    terraform_class.destroy()



    return {'message': 'TerraformConfig deleted'}, 200


# get all TerraformConfigs by user
@app.route('/api/get-terraform-configs', methods=['GET'])
@flask_praetorian.auth_required
def get_terraform_configs():
    """
    Gets all TerraformConfigs by user.
    .. example::
       $ curl http://localhost:5000/api/get-terraform-configs -X GET \
         -
    """
    user_id = flask_praetorian.current_user().id

    terraform_configs = TerraformConfig.query.filter_by(user_id=user_id).all()
    terraform_configs_list = []
    for terraform_config in terraform_configs:
        terraform_configs_list.append({'id': terraform_config.id, 'user_id': terraform_config.user_id, 'region': terraform_config.region, 'json_config': terraform_config.json_config})
    return {'terraform_configs': terraform_configs_list}, 200


# get TerraformConfig by id
@app.route('/api/get-terraform-config/<id>', methods=['GET'])
@flask_praetorian.auth_required
def get_terraform_config(id):
    """
    Gets a TerraformConfig by id.
    .. example::
       $ curl http://localhost:5000/api/get-terraform-config -X GET \
         -
    """
    user_id = flask_praetorian.current_user().id

    terraform_config = TerraformConfig.query.filter_by(user_id=user_id, id=id).first()
    return {'id': terraform_config.id, 'user_id': terraform_config.user_id, 'region': terraform_config.region, 'json_config': terraform_config.json_config}, 200


# get output TerraformConfig by id
@app.route('/api/get-output-terraform-config/<id>', methods=['GET'])
@flask_praetorian.auth_required
def get_output_terraform_config(id):
    """
    Gets a TerraformConfig by id.
    .. example::
       $ curl http://localhost:5000/api/get-output-terraform-config -X GET \
         -
    """
    user_id = flask_praetorian.current_user().id
    aws_access_key_id = flask_praetorian.current_user().aws_access_key_id
    aws_secret_key = flask_praetorian.current_user().aws_secret_key

    terraform_config = TerraformConfig.query.filter_by(user_id=user_id, id=id).first()
    json_response = {'id': terraform_config.id, 'user_id': terraform_config.user_id, 'region': terraform_config.region, 'json_config': terraform_config.json_config}

    terraform_class = TerraformClass(
        user_id=user_id,
        region=json_response['region'],
        aws_access_key_id=aws_access_key_id,
        aws_secret_key=aws_secret_key,
        json_list_variables=json_response['json_config']
    )
    outputs = terraform_class.get_terraform_output()

    return outputs, 200


# Run the example
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)