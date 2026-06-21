#!/usr/bin/env bash

# Genesis Platform Core Infrastructure Automation
# Enforces strict GitOps synchronisation and OCI image governance.

set -euo pipefail

# -----------------------------------------------------------------------------
# Environmental Variables (Configure these prior to execution)
# -----------------------------------------------------------------------------
REGISTRY_URL=${REGISTRY_URL:-"ghcr.io"}
REGISTRY_USER=${REGISTRY_USER:-"genesis-admin"}
REGISTRY_PASS=${REGISTRY_PASS:-"YOUR_SECURE_TOKEN"}
REGISTRY_EMAIL=${REGISTRY_EMAIL:-"admin@genesis.app"}
TARGET_NAMESPACE="vector-db"
ARGOCD_NAMESPACE="argocd"

echo "[❖] Initiating Genesis Platform Infrastructure Deployment..."

# -----------------------------------------------------------------------------
# Phase 1: Namespace & Security Perimeter Setup
# -----------------------------------------------------------------------------
echo "[1/4] Securing the perimeter and establishing namespaces..."

kubectl create namespace "${TARGET_NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace "${ARGOCD_NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

# Generate the OCI Registry Secret
kubectl create secret docker-registry registry-credentials \
  --docker-server="${REGISTRY_URL}" \
  --docker-username="${REGISTRY_USER}" \
  --docker-password="${REGISTRY_PASS}" \
  --docker-email="${REGISTRY_EMAIL}" \
  -n "${TARGET_NAMESPACE}" \
  --dry-run=client -o yaml | kubectl apply -f -

# Patch the default service account to pull secure images autonomously
kubectl patch serviceaccount default -n "${TARGET_NAMESPACE}" -p '{"imagePullSecrets": [{"name": "registry-credentials"}]}'

# -----------------------------------------------------------------------------
# Phase 2: ArgoCD OCI Repository Authentication
# -----------------------------------------------------------------------------
echo "[2/4] Arming ArgoCD with private repository credentials..."

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: private-oci-registry
  namespace: ${ARGOCD_NAMESPACE}
  labels:
    argocd.argoproj.io/secret-type: repository
stringData:
  type: helm
  url: ${REGISTRY_URL}/infrastructure-charts
  enableOCI: "true"
  username: ${REGISTRY_USER}
  password: ${REGISTRY_PASS}
EOF

# -----------------------------------------------------------------------------
# Phase 3: Cryptographic Audit & Governance Policies (Kyverno)
# -----------------------------------------------------------------------------
echo "[3/4] Establishing cryptographic turnstiles for OCI verification..."

cat <<EOF | kubectl apply -f -
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-vector-db-signatures
spec:
  validationFailureAction: Enforce
  background: false
  rules:
    - name: verify-image
      match:
        any:
          - resources:
              namespaces:
                - ${TARGET_NAMESPACE}
              kinds:
                - Pod
      verifyImages:
        - imageRule: "${REGISTRY_URL}/secure-images/*"
          attestations:
            - predicateType: cosign.sigstore.dev/attestation/v1
          publicKeys: |-
            -----BEGIN PUBLIC KEY-----
            # INJECT_YOUR_ACTUAL_PUBLIC_KEY_HERE
            MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz6...
            -----END PUBLIC KEY-----
EOF

# -----------------------------------------------------------------------------
# Phase 4: GitOps Application Deployment (Milvus)
# -----------------------------------------------------------------------------
echo "[4/4] Deploying the Milvus Vector Database via GitOps..."

cat <<EOF | kubectl apply -f -
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: vector-database-genesis
  namespace: ${ARGOCD_NAMESPACE}
spec:
  project: default
  source:
    chart: milvus
    repoURL: oci://${REGISTRY_URL}/infrastructure-charts
    targetRevision: 4.2.0
    helm:
      values: |
        image:
          repository: ${REGISTRY_URL}/secure-images/milvus
          tag: v2.4.0-secure
          pullSecrets:
            - registry-credentials
        cluster:
          enabled: true
        persistence:
          enabled: true
          storageClass: "premium-rwo"
  destination:
    server: https://kubernetes.default.svc
    namespace: ${TARGET_NAMESPACE}
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
EOF

echo "[✓] Deployment protocols executed successfully. ArgoCD is now reconciling the state."