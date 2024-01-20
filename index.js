import fs from 'fs';
import https from 'https';
import chalk from 'chalk';
import inquirer from 'inquirer';

function checkUsername(username, website) {
    const url = `https://${website}/${username}`;

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            resolve(response.statusCode === 404);
        }).on('error', (err) => {
            if (err.code === 'ENOTFOUND') {
                reject(new Error(`The website '${website}' is not found.`));
            } else {
                reject(err);
            }
        });
    }).catch(err => {
        console.log(chalk.redBright(err.message));
        process.exit(1);
    });
}

async function main() { 
    const { website } = await inquirer.prompt({
        type: 'input',
        name: 'website',
        message: 'What website do you want to check? e.g. `github.com` \n\u276f'
    });

    const usernames = fs.readFileSync('usernames.txt', 'utf-8').split('\n').map(line => line.trim());

    const availableUsernames = [];

    for (const username of usernames) {
        const isAvailable = await checkUsername(username, website);

        if (isAvailable) {
            availableUsernames.push(username);
            console.log(chalk.green(`\u276f The username '${username}' is available.`));
            fs.appendFileSync('available_usernames.txt', username + '\n');
        } else {
            console.log(chalk.redBright(`\u276f The username '${username}' is not available.`));
        }
    }

    console.log(chalk.blue(`\n${availableUsernames.length} username(s) are available.`));
}

main();

