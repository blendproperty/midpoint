# Deploy notes

Deploys run via `.github/workflows/deploy.yml` on every push to `main`:
SSH into the VPS, `git pull` in `/opt/midpoint`, then
`docker compose -f compose.prod.yml up -d --build`.

`compose.prod.yml` attaches the `midpoint-web` container to the existing
`root_default` Traefik network (external) rather than publishing a host
port directly — Traefik routes `midpoint.onpointoffices.co.za` to it via
labels. Do not add a `ports:`/host-port mapping here; this host runs many
other containers behind the same Traefik instance.
