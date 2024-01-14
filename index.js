import fs from 'fs';
import https from 'https';
import chalk from 'chalk';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function checkUsername(username, website) {
    const url = `https://${website}/${username}`;

    return new Promise((resolve) => {
        https.get(url, (response) => {
            resolve(response.statusCode === 404);
        });
    });
}

async function main() {
    const website = await new Promise((resolve) => {
            rl.question(chalk.blue('What website do you want to check? e.g. `github.com` '), (answer) => {
                resolve(answer.trim());
            });
        });

    const usernames = fs.readFileSync('usernames.txt', 'utf-8').split('\n').map(line => line.trim());

    const availableUsernames = [];

    for (const username of usernames) {
        const isAvailable = await checkUsername(username, website);

        if (isAvailable) {
            availableUsernames.push(username);
            console.log(chalk.green(`The username '${username}' is available.`));
            fs.appendFileSync('available_usernames.txt', username + '\n');
        } else {
            console.log(chalk.redBright(`The username '${username}' is not available.`));
        }
    }

    console.log(chalk.blue(`\n${availableUsernames.length} username(s) are available.`));

    rl.close();
}

main();
