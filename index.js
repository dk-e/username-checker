import fs from 'fs'
import https from 'https'
import chalk from 'chalk'

function checkUsername(username) {
    const url = `https://github.com/${username}`;

    return new Promise((resolve) => {
        https.get(url, (response) => {
            resolve(response.statusCode === 404);
        });
    });
}

async function main() {
    const usernames = fs.readFileSync('usernames.txt', 'utf-8').split('\n').map(line => line.trim());

    const availableUsernames = [];

    for (const username of usernames) {
        const isAvailable = await checkUsername(username);

        if (isAvailable) {
            availableUsernames.push(username);
            console.log(chalk.green(`The username '${username}' is available.`));
            fs.appendFileSync('available_usernames.txt', username + '\n');
        } else {
            console.log(chalk.redBright(`The username '${username}' is not available.`));
        }
    }

    console.log(chalk.blue(`\n${availableUsernames.length} username(s) are available.`));
}

main();
