CLUSTER_RESOURCE_FIELDS = [
    'name',
    'machineType',
    'diskSizeGb',
    'imageType',
    'diskType',
    'minCpuPlatform',
    'initialNodeCount',
    'autoscaling',
]

CLUSTER_FORM_TYPES = {
    'JSON': 'json',
    'TEMPLATE': 'template',
}

DEFAULT_BOOT_DISK_SIZE = 100

CLUSTER_TEMPLATE = {
     'cluster': {
         'name': '', 
         'masterAuth': {
             'username': 'admin',
             'clientCertificateConfig': {
                 'issueClientCertificate': True
             }
         },
         'loggingService': 'logging.googleapis.com',
         'monitoringService': 'monitoring.googleapis.com',
         'network': '',
         'addonsConfig': {
             'httpLoadBalancing': {},
             'kubernetesDashboard': {
                 'disabled': True
             },
             'istioConfig': {
                 'disabled': True
             }
         },
         'subnetwork': '',
         'nodePools': [],
         'networkPolicy': {},
         'ipAllocationPolicy': {},
         'masterAuthorizedNetworksConfig': {},
         'privateClusterConfig': {},
         'databaseEncryption': {
             'state': 'DECRYPTED'
         },
         'initialClusterVersion': '',
         'location': '',
         'resourceLabels': {
             'project_id': ''
         }
     }
}
 
NODE_POOL_TEMPLATE = {
    'name': 'default-pool',
    'config': {
      'machineType': '',
      'diskSizeGb': 0,
      'oauthScopes': [
          'https://www.googleapis.com/auth/devstorage.read_only',
          'https://www.googleapis.com/auth/logging.write',
          'https://www.googleapis.com/auth/monitoring',
          'https://www.googleapis.com/auth/servicecontrol',
          'https://www.googleapis.com/auth/service.management.readonly',
          'https://www.googleapis.com/auth/trace.append'
      ],
      'imageType': 'COS',
      'diskType': 'pd-standard',
      'labels': {
          'project_id': ''
      }
    },
    'initialNodeCount': 3,
    'autoscaling': {},
    'management': {
      'autoUpgrade': True,
      'autoRepair': True
    },
    'version': '',
}
 