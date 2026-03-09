# GitHub Actions Deployment to EC2 (Frontend)

This config deploys `mts-finance-dashboard` to EC2 + Nginx.

Files:
- `.github/workflows/deploy-ec2-frontend.yml`
- `scripts/ec2-deploy-frontend.sh`

## Required GitHub secrets

Add in repo settings:
- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_PRIVATE_KEY`
- `EC2_KNOWN_HOSTS`

## Trigger

Manual only (`workflow_dispatch`).

## What deployment does

1. Uploads latest frontend source from GitHub Actions runner to EC2.
2. Syncs it to `/opt/mts-finance-dashboard`.
3. Syncs publish files to `/var/www/mts-finance-dashboard`.
4. Validates Nginx config (`nginx -t`, optional).
5. Restarts Nginx and checks `http://127.0.0.1/`.

## EC2 prerequisites

- Nginx installed and running.
- Nginx root points to `/var/www/mts-finance-dashboard`.
- Deploy user can run:
  - `sudo rsync ... /var/www/mts-finance-dashboard/`
  - `sudo nginx -t`
  - `sudo systemctl restart nginx`

## Manual run inputs

- `validate_nginx=true` recommended.

