kubectl create ns kubeless
kubectl create -f https://github.com/kubeless/kubeless/releases/download/v0.6.0/kubeless-v0.6.0.yaml
kubectl get pods -n kubeless
