import yaml


secrets = yaml.load(
    open(('config/secrets.yaml'))
)


class Config(object):
    DEBUG = False
    GH_ACCESS_TOKEN = secrets['GH_ACCESS_TOKEN']
    STRIPE_KEY = secrets['STRIPE_TEST_KEY']
    GOOGLE_API_KEY = secrets['GOOGLE_API_KEY']


class DevelopmentConfig(Config):
    STRIPE_KEY = secrets['STRIPE_TEST_KEY']
    APP_URL = 'http://localhost:3000'
    GH_REPO_NAME = 'lukepereira/cloudfound'
    GOOGLE_PROJECT_ID = 'scenic-shift-130010'
    BIG_QUERY_TABLE = 'scenic-shift-130010.resource_manager.gcp_billing_export_v1_017DB4_961B54_BD0D8E'
    DEBUG = True


class TestingConfig(Config):
    APP_URL = 'http://localhost:3000'
    GH_REPO_NAME = 'lukepereira/cloudfound'
    GOOGLE_PROJECT_ID = 'scenic-shift-130010'
    TESTING = True
    DEBUG = True


class ProductionConfig(Config):
    APP_URL = 'https://www.cloudfound.io'
    GH_REPO_NAME = 'lukepereira/cloudfound'
    GOOGLE_PROJECT_ID = 'citizen-server'
    STRIPE_KEY = secrets['STRIPE_PRODUCTION_KEY']
    DEBUG = False
    TESTING = False


app_config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
}     
