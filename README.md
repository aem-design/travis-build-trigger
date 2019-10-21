## Travis Build Trigger

[![build_status](https://travis-ci.org/aem-design/docker-travis-build-trigger.svg?branch=master)](https://travis-ci.org/aem-design/docker-travis-build-trigger) 
[![github license](https://img.shields.io/github/license/aem-design/docker-travis-build-trigger)](https://github.com/aem-design/docker-travis-build-trigger) 
[![github issues](https://img.shields.io/github/issues/aem-design/docker-travis-build-trigger)](https://github.com/aem-design/docker-travis-build-trigger) 
[![github last commit](https://img.shields.io/github/last-commit/aem-design/docker-travis-build-trigger)](https://github.com/aem-design/docker-travis-build-trigger) 
[![github repo size](https://img.shields.io/github/repo-size/aem-design/docker-travis-build-trigger)](https://github.com/aem-design/docker-travis-build-trigger) 
[![docker stars](https://img.shields.io/docker/stars/aemdesign/travis-build-trigger)](https://hub.docker.com/r/aemdesign/travis-build-trigger) 
[![docker pulls](https://img.shields.io/docker/pulls/aemdesign/travis-build-trigger)](https://hub.docker.com/r/aemdesign/travis-build-trigger) 
[![github release](https://img.shields.io/github/release/aem-design/docker-travis-build-trigger)](https://github.com/aem-design/docker-travis-build-trigger)

This is docker image based on [node:10](https://hub.docker.com/_/node)

### Script Parameters

Following parameters are available

| Name              | Default Value                 | Notes |
| ---               | ---                           | ---   |
| github_user       |                               | github user name where repo is located |
| github_repo       |                               | repo name |
| travis_token      |                               | travis access token |
| github_branch     | master                        | github branch to trigger build on |
| travis_url        | https://api.travis-ci.org/repo/  | travis url to use to trigger jobs |

### Starting

To trigger a job directly

```bash
docker run --rm aemdesign/travis-trigger-build \
start-branch-build \
--github_user=aem-design --github_repo=aem --travis_token=<TOKEN>
``` 

To trigger in Travis pipeline add the following to your stages

```yaml
before_install:
  # get current repo user name
  - declare -a REPO_SLUG_ARRAY="(${TRAVIS_REPO_SLUG/\// })"
deploy:
  # trigger rebuild in related repo
  - provider: script
    script: if [[ $TRAVIS_BRANCH == "master" ]]; then bash docker run --rm aemdesign/travis-trigger-build start-branch-build --github_user=${REPO_SLUG_ARRAY[0]} --github_repo=aem --github_branch=${TRAVIS_BRANCH} --travis_token=${TRAVIS_TOKEN}; fi
```
