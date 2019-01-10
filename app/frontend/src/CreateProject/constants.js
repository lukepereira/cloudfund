export const CLUSTER_FORMS = Object.freeze({
        TEMPLATE_FORM: 'Cluster Template',
        JSON_FORM: 'Cluster JSON',
})

export const CLUSTER_LOCATION_TYPES = Object.freeze({
        REGIONAL: 'Regional',
        ZONAL: 'Zonal',
})

export const REGIONS = [
    {val: 'asia-east1', label: 'asia-east1 (Taiwan)'},
    {val: 'asia-east2', label: 'asia-east2 (Hong Kong)'},
    {val: 'asia-northeast1', label: 'asia-northeast1 (Tokyo)'},
    {val: 'asia-south1', label: 'asia-south1 (Mumbai)'},
    {val: 'asia-southeast1', label: 'asia-southeast1 (Singapore)'},
    {val: 'australia-southeast1', label: 'australia-southeast1 (Sydney)'},
    {val: 'europe-north1', label: 'europe-north1 (Finland)'},
    {val: 'europe-west1', label: 'europe-west1 (Belgium)'},
    {val: 'europe-west2', label: 'europe-west2 (London)'},
    {val: 'europe-west3', label: 'europe-west3 (Frankfurt)'},
    {val: 'europe-west4', label: 'europe-west4 (Netherlands)'},
    {val: 'northamerica-northeast1', label: 'northamerica-northeast1 (Montréal)'},
    {val: 'southamerica-east1', label: 'southamerica-east1 (São Paulo)'},
    {val: 'us-central1', label: 'us-central1 (Iowa)'},
    {val: 'us-east1', label: 'us-east1 (South Carolina)'},
    {val: 'us-east4', label: 'us-east4 (Northern Virginia)'},
    {val: 'us-west1', label: 'us-west1 (Oregon)'},
    {val: 'us-west2', label: 'us-west2 (Los Angeles)'},
]

export const ZONES = [
    {val: 'us-east1-b', label: 'us-east1-b (South Carolina)'},
    {val: 'us-east1-c', label: 'us-east1-c (South Carolina)'},
    {val: 'us-east1-d', label: 'us-east1-d (South Carolina)'},
    {val: 'us-east4-c', label: 'us-east4-c (Northern Virginia)'},
    {val: 'us-east4-b', label: 'us-east4-b (Northern Virginia)'},
    {val: 'us-east4-a', label: 'us-east4-a (Northern Virginia)'},
    {val: 'us-central1-c', label: 'us-central1-c (Iowa)'},
    {val: 'us-central1-a', label: 'us-central1-a (Iowa)'},
    {val: 'us-central1-f', label: 'us-central1-f (Iowa)'},
    {val: 'us-central1-b', label: 'us-central1-b (Iowa)'},
    {val: 'us-west1-b', label: 'us-west1-b (Oregon)'},
    {val: 'us-west1-c', label: 'us-west1-c (Oregon)'},
    {val: 'us-west1-a', label: 'us-west1-a (Oregon)'},
    {val: 'europe-west4-a', label: 'europe-west4-a (Netherlands)'},
    {val: 'europe-west4-b', label: 'europe-west4-b (Netherlands)'},
    {val: 'europe-west4-c', label: 'europe-west4-c (Netherlands)'},
    {val: 'europe-west1-b', label: 'europe-west1-b (Belgium)'},
    {val: 'europe-west1-d', label: 'europe-west1-d (Belgium)'},
    {val: 'europe-west1-c', label: 'europe-west1-c (Belgium)'},
    {val: 'europe-west3-b', label: 'europe-west3-b (Frankfurt)'},
    {val: 'europe-west3-c', label: 'europe-west3-c (Frankfurt)'},
    {val: 'europe-west3-a', label: 'europe-west3-a (Frankfurt)'},
    {val: 'europe-west2-c', label: 'europe-west2-c europe-west2'},
    {val: 'europe-west2-b', label: 'europe-west2-b europe-west2'},
    {val: 'europe-west2-a', label: 'europe-west2-a europe-west2'},
    {val: 'asia-east1-b', label: 'asia-east1-b (Taiwan)'},
    {val: 'asia-east1-a', label: 'asia-east1-a (Taiwan)'},
    {val: 'asia-east1-c', label: 'asia-east1-c (Taiwan)'},
    {val: 'asia-southeast1-b', label: 'asia-southeast1-b (Singapore)'},
    {val: 'asia-southeast1-a', label: 'asia-southeast1-a (Singapore)'},
    {val: 'asia-southeast1-c', label: 'asia-southeast1-c (Singapore)'},
    {val: 'asia-northeast1-b', label: 'asia-northeast1-b (Tokyo)'},
    {val: 'asia-northeast1-c', label: 'asia-northeast1-c (Tokyo)'},
    {val: 'asia-northeast1-a', label: 'asia-northeast1-a (Tokyo)'},
    {val: 'asia-south1-c', label: 'asia-south1-c (Mumbai)'},
    {val: 'asia-south1-b', label: 'asia-south1-b (Mumbai)'},
    {val: 'asia-south1-a', label: 'asia-south1-a (Mumbai)'},
    {val: 'australia-southeast1-b', label: 'australia-southeast1-b (Sydney)'},
    {val: 'australia-southeast1-c', label: 'australia-southeast1-c (Sydney)'},
    {val: 'australia-southeast1-a', label: 'australia-southeast1-a (Sydney)'},
    {val: 'southamerica-east1-b', label: 'southamerica-east1-b (São Paulo)'},
    {val: 'southamerica-east1-c', label: 'southamerica-east1-c (São Paulo)'},
    {val: 'southamerica-east1-a', label: 'southamerica-east1-a (São Paulo)'},
    {val: 'asia-east2-a', label: 'asia-east2-a (Hong Kong)'},
    {val: 'asia-east2-b', label: 'asia-east2-b (Hong Kong)'},
    {val: 'asia-east2-c', label: 'asia-east2-c (Hong Kong)'},
    {val: 'europe-north1-a', label: 'europe-north1-a (Finland)'},
    {val: 'europe-north1-b', label: 'europe-north1-b (Finland)'},
    {val: 'europe-north1-c', label: 'europe-north1-c (Finland)'},
    {val: 'northamerica-northeast1-a', label: 'northamerica-northeast1-a (Montréal)'},
    {val: 'northamerica-northeast1-b', label: 'northamerica-northeast1-b (Montréal)'},
    {val: 'northamerica-northeast1-c', label: 'northamerica-northeast1-c (Montréal)'},
    {val: 'us-west2-a', label: 'us-west2-a (Los Angeles)'},
    {val: 'us-west2-b', label: 'us-west2-b (Los Angeles)'},
    {val: 'us-west2-c', label: 'us-west2-c (Los Angeles)'},
]


/*
let options = []
document.querySelectorAll('.p6n-dropdown-row').forEach(function(el) {
    options.push({
        'val': el.getAttribute('note').split(',')[1].trim(),
        'label': el.getAttribute('note')
    })
})
*/
export const  MACHINE_TYPES = [
    {
        "val": "f1-micro",
        "label": "0.6 GB memory, f1-micro"
    },
    {
        "val": "g1-small",
        "label": "1.7 GB memory, g1-small"
    },
    {
        "val": "n1-standard-1",
        "label": "3.75 GB memory, n1-standard-1"
    },
    {
        "val": "n1-standard-2",
        "label": "7.5 GB memory, n1-standard-2"
    },
    {
        "val": "n1-standard-4",
        "label": "15 GB memory, n1-standard-4"
    },
    {
        "val": "n1-standard-8",
        "label": "30 GB memory, n1-standard-8"
    },
    {
        "val": "n1-highmem-2",
        "label": "13 GB memory, n1-highmem-2"
    },
    {
        "val": "n1-highmem-4",
        "label": "26 GB memory, n1-highmem-4"
    },
    {
        "val": "n1-highmem-8",
        "label": "52 GB memory, n1-highmem-8"
    },
    {
        "val": "n1-highcpu-2",
        "label": "1.8 GB memory, n1-highcpu-2"
    },
    {
        "val": "n1-highcpu-4",
        "label": "3.6 GB memory, n1-highcpu-4"
    },
    {
        "val": "n1-highcpu-8",
        "label": "7.2 GB memory, n1-highcpu-8"
    }
]