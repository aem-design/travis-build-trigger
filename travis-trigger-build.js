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
            triggerTravisBuild(argv);
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
        description: 'travis access token',
        demand: 'travis token is required'
    })
    .option('github_branch', {
        description: 'github branch to trigger build on',
        default: 'master'
    })
    .option('travis_url', {
        description: 'travis url to use to trigger jobs',
        default: 'https://api.travis-ci.org/repo/'
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

function triggerTravisBuild(argv) {
    debug(['triggerTravisBuild', JSON.parse(JSON.stringify(argv).replace(argv['travis_token'],"xxx"))])

    let headers = {
        "Content-Type": "application/json",
            "Accept": "application/json",
            "Travis-API-Version": "3",
            "Authorization": "token " + argv['travis_token']
    }

    const options = {
        url: argv['travis_url'] + argv['github_user'] + "%2f" + argv['github_repo'],
        method: "GET",
        headers: headers
    };

    request(options, (error, res, body) => {
        if (error) {
            console.error(error)
        }
        bodyJson = JSON.parse(body)
        debug(['triggerTravisBuild','bodyJson',bodyJson])
        repoId = bodyJson["id"]

        const options = {
            url: argv['travis_url'] + repoId + "/requests",
            method: "POST",
            headers: headers,
            json: {
                "request": {
                    "branch": argv['github_branch'],
                    "config": null
                }
            }
        };
        debug(['triggerBuild','options', JSON.parse(JSON.stringify(options).replace(argv['travis_token'],"xxx")) ])
        request(options, (error, res, body) => {
            if (error) {
                console.error(['triggerBuild','error',`statusCode: ${res.statusCode}`, error])
                return
            }
            console.log(['triggerBuild','done',`statusCode: ${res.statusCode}`, body])
        })

    })

}
