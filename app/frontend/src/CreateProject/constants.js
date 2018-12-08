export const CLUSTER_FORMS = Object.freeze({
        TEMPLATE_FORM: 'Cluster Template',
        JSON_FORM: 'Cluster JSON',
})

export const REGIONS = [
    {val: 'northamerica-northeast1', label:  'northamerica-northeast1 (Montréal)'},
    {val: 'us-central', label: 'us-central (Iowa)'},
    {val: 'us-west2', label: 'us-west2 (Los Angeles)'},
    {val: 'us-east1', label: 'us-east1 (South Carolina)'},
    {val: 'us-east4', label: 'us-east4 (Northern Virginia)'},
    {val: 'southamerica-east1', label: 'southamerica-east1 (São Paulo)'},
    {val: 'europe-west', label: 'europe-west (Belgium)'},
    {val: 'europe-west2', label: 'europe-west2 (London)'},
    {val: 'europe-west3', label: 'europe-west3 (Frankfurt)'},
    {val: 'asia-northeast1', label: 'asia-northeast1 (Tokyo)'},
    {val: 'asia-east2', label: 'asia-east2 (Hong Kong)'},
    {val: 'asia-south1', label: 'asia-south1 (Mumbai)'},
    {val: 'australia-southeast1', label: 'australia-southeast1 (Sydney)'},
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