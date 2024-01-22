import fs from 'fs';
import https from 'https';
import chalk from 'chalk';
import input from '@inquirer/input';

const checkUsername = async (username, website) => {
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
        throw new Error(err.message);
    });
}

async function main() {
    console.clear();

    const website = await input({
        message: "What website do you want to check? e.g. 'github.com' \n\u276f"
    });

    const start = Date.now();

    const usernames = fs.readFileSync('usernames.txt', 'utf-8').split('\n').map(line => line.trim());
    const availableUsernames = [];

    const checkUsernames = usernames.map(async (username) => {
        const isAvailable = await checkUsername(username, website);
    
        if (isAvailable) {
            availableUsernames.push(username);
            console.log(chalk.green(`\u276f The username '${username}' is available.`));
            fs.appendFileSync('available_usernames.txt', username + '\n');
        } else {
            console.log(chalk.redBright(`\u276f The username '${username}' is not available.`));
        }
    });
    
    await Promise.all(checkUsernames);

    const plural = availableUsernames.length != 1 ? 'usernames are' : 'username was';
    const plural2 = usernames.length != 1 ? 'usernames were' : 'username was';
    console.log(chalk.blue(`\n${chalk.bold(availableUsernames.length)} ${plural} available after ${chalk.bold((Date.now() - start) / 1000)} seconds.\n`));
    console.log(chalk.yellow(`A total of ${chalk.bold(usernames.length)} ${plural2} checked.\n`));
    process.exit(0);
}

main();


