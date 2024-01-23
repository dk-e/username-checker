# Username Checker

A lightweight, performant node.js app to bulk check the availablility of usernames of a specified website.

## Prerequisites

-   Have node.js and npm [installed](https://nodejs.org/en/download)

## Installation

1. Clone this repository or download the zip
2. Navigate to the app's folder and install the dependencies with a following command:

```
npm install
yarn install
pnpm install (recommended)
```

## Usage

1. Put the list of usernames you want to check in `usernames.txt`, formatted with a new username on a new line. **Find inspiration [here](https://github.com/zurlyy/word-list).**

2. Run the script with one of the following commands:

```
node index.js
node .
```

3. Allow the app to run, after which a list of available usernames will appear in `available_usernames.txt`

## Example output

![Screenshot of demonstration](./assets/demonstration.png)

## Limitations

-   Please be aware that some sites prevent this method of checking names. Consequently, the effectiveness of this approach may be limited in such cases.
-   Additionally, it is important to note that usernames that are considered "banned" may erroneously appear as available, despite being unavailable.
