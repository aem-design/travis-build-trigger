const request = require('request')

let debugMode = false

const args = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command({
        command: 'start-branch-build [github_repo,travis_token,github_user]',
        aliases: ['sbb'],
        desc: 'Start repo build for a particular branch',
        handler: (argv) => {
            debugMode = argv['debug'] || false;
            triggerTravisBuild(argv['github_user'], argv['github_repo'], argv['github_branch'], argv['travis_token']);
        }
    })
    .option('help', {
        alias   : 'h',
        type: 'boolean', /* array | boolean | string */
        description: 'show help'
    })
    .option('debug', {
        alias   : 'd',
        type: 'boolean', /* array | boolean | string */
        description: 'debug mode'
    })
    .option('version', {
        alias   : 'v',
        type: 'boolean', /* array | boolean | string */
        description: 'show version'
    })
    .option('github_repo', {
        description: 'repo name',
        demand: 'github repo name is required'
    })
    .option('github_user', {
        description: 'github user name where repo is located',
        demand: 'github user is required'
    })
    .option('travis_token', {
        description: 'github access token',
        demand: 'github token is required'
    })
    .option('github_branch', {
        description: 'github access token',
        demand: 'github branch to trigger build on',
        default: 'master'
    })
    .example('node generator.js sbb --github_user=aem-design --github_repo=aem --github_token=<TOKEN>' )
    .demandCommand()
    .wrap(130)
    .argv


function debug(content) {
    if (debugMode) {
        console.log(content)
    }
}

function triggerTravisBuild(user, repo, branch, token) {
    debug(['triggerTravisBuild', user, repo, branch])
    const options = {
        url: "https://api.travis-ci.org/repo/" + user + "%2f" + repo,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Travis-API-Version": "3",
            "Authorization": "token " + token
        }
    };

    request(options, (error, res, body) => {
        if (error) {
            console.error(error)
        }
        bodyJson = JSON.parse(body)
        debug(['triggerTravisBuild','bodyJson',bodyJson])
        triggerBuild(bodyJson["id"], branch, token)
    })

}

function triggerBuild(repoId, branch, token) {

    const options = {
        url: "https://api.travis-ci.org/repo/" + repoId + "/requests",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Travis-API-Version": "3",
            "Authorization": "token " + token
        },
        json: {
            "request": {
                "branch": branch,
                "config": null
            }
        }
    };
    debug(['triggerBuild','options', JSON.parse(JSON.stringify(options).replace(token,"xxx")) ])
    request(options, (error, res, body) => {
        if (error) {
            console.error(['triggerBuild','error',`statusCode: ${res.statusCode}`, error])
            return
        }
        console.log(['triggerBuild','done',`statusCode: ${res.statusCode}`, body])
    })

}
