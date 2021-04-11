# 🔍 NODEINFO: Whoami Microservice 🔍
### Node Runtime / Docker Instance / Host Environment / Debug Info

---

<a href='https://github.com/cogsmith/nodeinfo'><img src='https://github-readme-stats.vercel.app/api/pin/?username=cogsmith&repo=nodeinfo' align='right'></a>

#### <code><a href='https://github.com/cogsmith/nodeinfo'><img src='https://github.githubassets.com/images/icons/emoji/octocat.png' width='22'> [GITHUB REPO]</a></code>

#### <code><a href='https://hub.docker.com/r/cogsmith/nodeinfo'>🐳 [DOCKER IMAGE]</a></code>

#### <code><a href='https://github.com/cogsmith/nodeinfo/blob/main/app.js'>🧾 [VIEW APP SOURCE CODE]</a></code>

#### <code><a href='https://github.com/cogsmith/nodeinfo/projects/1'>📅 [PROJECT TRACKER BOARD]</a></code>

---

[![](https://shields.io/github/package-json/v/cogsmith/nodeinfo?label=codebase)](http://github.com/cogsmith/nodeinfo)
[![](https://shields.io/github/last-commit/cogsmith/nodeinfo)](https://github.com/cogsmith/nodeinfo/commits/main)
[![](https://github.com/cogsmith/nodeinfo/actions/workflows/DEVKING_CHECK.yml/badge.svg)](https://github.com/cogsmith/nodeinfo/actions/workflows/DEVKING_CHECK.yml)

[![](https://shields.io/github/v/release/cogsmith/nodeinfo?label=latest+release)](https://github.com/cogsmith/nodeinfo/releases)
[![](https://shields.io/github/release-date/cogsmith/nodeinfo?color=blue)](https://github.com/cogsmith/nodeinfo/releases)
[![](https://shields.io/github/commits-since/cogsmith/nodeinfo/latest)](https://github.com/cogsmith/nodeinfo/commits/main)
<!-- [![](https://shields.io/github/commit-activity/m/cogsmith/nodeinfo)](https://github.com/cogsmith/nodeinfo/commits/main) -->

[![](https://shields.io/github/license/cogsmith/nodeinfo?color=lightgray)](https://github.com/cogsmith/nodeinfo/blob/main/LICENSE)
[![](https://shields.io/github/languages/code-size/cogsmith/nodeinfo)](http://github.com/cogsmith/nodeinfo)
[![](https://shields.io/github/repo-size/cogsmith/nodeinfo)](http://github.com/cogsmith/nodeinfo)
[![](https://shields.io/docker/image-size/cogsmith/nodeinfo?sort=date&label=docker+size)](https://hub.docker.com/r/cogsmith/nodeinfo)
[![](https://shields.io/github/issues-raw/cogsmith/nodeinfo)](https://github.com/cogsmith/nodeinfo/issues)

---

![SCREENSHOT](screenshot.png)

---
### No Server Show Message And Exit

~~~
docker run --rm --name nodeinfo cogsmith/nodeinfo

# NODEINFO: 9AEF78AB1BA5 @ 2021-02-18T07:12:24.421Z
~~~

---

### Local Web Server @ Port 99

~~~
docker run -d --rm --name nodeinfo99 --env PORT=9 -p 127.0.0.1:99:9 cogsmith/nodeinfo ; sleep 1 ; curl -L http://127.0.0.1:99 ; curl http://127.0.0.1:99/info

# NODEINFO: 3690BE09C2DD @ 0.0.0.0:80 @ 127.0.0.1:99 @ 2021-02-18T07:12:35.277Z
# {JSON:{DT:...}}
~~~

---

### Public Web Server @ Port 80

~~~
docker run -d --rm --name nodeinfo80 --env PORT=9 -p 0.0.0.0:80:9 cogsmith/nodeinfo ; sleep 1 ; curl -L http://localhost ; curl http://localhost/info

# NODEINFO: 80A831D99043 @ 0.0.0.0:80 @ LOCALHOST @ 2021-02-18T07:12:43.927Z
# {JSON:{DT:...}}
~~~

---

### Clean Up

~~~
docker stop nodeinfo ; docker stop nodeinfo99 ; docker stop nodeinfo80 ; docker rm nodeinfo ; docker rm nodeinfo99 ; docker rm nodeinfo80 ; docker rmi cogsmith/nodeinfo
~~~

---