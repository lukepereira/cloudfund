export const CLUSTER_JSON_SCHEMA = Object.freeze({
    "definitions": {
        "nodeConfig": {
            "type": "object",
            "properties": {}
        },
        
        "masterAuth": {
            "type": "object",
            "properties": {}
        },
        
        "AddonsConfig": {
            "type": "object",
            "properties": {}
        },
        
        "NodePool": {
            "type": "object",
            "properties": {}
        },
        
        "LegacyAbac": {
            "type": "object",
            "properties": {}
        },
        
        "NetworkPolicy": {
            "type": "object",
            "properties": {}
        },
        
        "IPAllocationPolicy": {
            "type": "object",
            "properties": {}
        },
        
        "MasterAuthorizedNetworksConfig": {
            "type": "object",
            "properties": {}
        },
        
        "MaintenancePolicy": {
            "type": "object",
            "properties": {}
        },
        
        "BinaryAuthorization": {
            "type": "object",
            "properties": {}
        },
        "PodSecurityPolicyConfig": {
            "type": "object",
            "properties": {}
        },
        
        "ClusterAutoscaling": {
            "type": "object",
            "properties": {}
        },
        
        "NetworkConfig": {
            "type": "object",
            "properties": {}
        },
        
        "PrivateClusterConfig": {
            "type": "object",
            "properties": {}
        },
        
        "MaxPodsConstraint": {
            "type": "object",
            "properties": {}
        },
        "VerticalPodAutoscaling": {
            "type": "object",
            "properties": {}
        },
        
        "StatusCondition": {
            "type": "object",
            "properties": {}
        },
        
        "Status": {
            "type": "object",
            "properties": {}
        },
        
        "cluster": {
            "type": "object",
            "properties": {
                "name": { "type": "string" },
                "description": { "type": "string" },
                "initialNodeCount": { "type": "number" },
                "nodeConfig": { "$ref": "#/definitions/nodeConfig" },
                "masterAuth": { "$ref": "#/definitions/masterAuth" },
                "loggingService": { "type": "string" },
                "monitoringService": { "type": "string" },
                "network": { "type": "string" },
                "clusterIpv4Cidr": { "type": "string" },
                "addonsConfig": { "$ref": "#/definitions/AddonsConfig" }, 
                "subnetwork": { "type": "string" },
                "nodePools": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/NodePool" 
                    }
                },
                "locations": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "enableKubernetesAlpha": { "type": "boolean" },
                "resourceLabels": {
                  string: { "type": "string" },
                },
                "labelFingerprint": { "type": "string" },
                "legacyAbac": { "$ref": "#/definitions/LegacyAbac" },
                "networkPolicy": { "$ref": "#/definitions/NetworkPolicy" },
                "ipAllocationPolicy": { "$ref": "#/definitions/IPAllocationPolicy" },
                "masterAuthorizedNetworksConfig": { "$ref": "#/definitions/MasterAuthorizedNetworksConfig" },
                "maintenancePolicy": { "$ref": "#/definitions/MaintenancePolicy" },
                "binaryAuthorization": { "$ref": "#/definitions/BinaryAuthorization" },
                "podSecurityPolicyConfig": { "$ref": "#/definitions/PodSecurityPolicyConfig" },
                "autoscaling": { "$ref": "#/definitions/ClusterAutoscaling" },
                "networkConfig": { "$ref": "#/definitions/NetworkConfig" },
                "privateCluster": { "type": "boolean" },
                "masterIpv4CidrBlock": { "type": "string" },
                "defaultMaxPodsConstraint": { "$ref": "#/definitions/MaxPodsConstraint" },
                "privateClusterConfig": { "$ref": "#/definitions/PrivateClusterConfig" },
                "verticalPodAutoscaling": { "$ref": "#/definitions/VerticalPodAutoscaling" },
                "selfLink": { "type": "string" },
                "zone": { "type": "string" },
                "endpoint": { "type": "string" },
                "initialClusterVersion": { "type": "string" },
                "currentMasterVersion": { "type": "string" },
                "currentNodeVersion": { "type": "string" },
                "createTime": { "type": "string" },
                "status": { "$ref": "#/definitions/Status" },
                "statusMessage": { "type": "string" },
                "nodeIpv4CidrSize": { "type": "number" },
                "servicesIpv4Cidr": { "type": "string" },
                "instanceGroupUrls":  {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "currentNodeCount": { "type": "number" },
                "expireTime": { "type": "string" },
                "location": { "type": "string" },
                "enableTpu": { "type": "boolean" },
                "tpuIpv4CidrBlock": { "type": "string" },
                "conditions":  {
                    "type": "array",
                    "items": { "$ref": "#/definitions/StatusCondition" }
                },
            },
            "required": ["name" ]
        }
    },

    "type": "object",
    "properties": {
        "cluster": { "$ref": "#/definitions/cluster" },
    },
    "required": ["cluster"]
})