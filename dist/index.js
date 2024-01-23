"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const chalk_1 = __importDefault(require("chalk"));
const input_1 = __importDefault(require("@inquirer/input"));
const checkUsername = (username, website) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://${website}/${username}`;
    return new Promise((resolve, reject) => {
        https_1.default
            .get(url, (response) => {
            resolve(response.statusCode === 404);
        })
            .on("error", (err) => {
            if (err.code === "ENOTFOUND") {
                reject(new Error(`The website '${website}' is not found.`));
            }
            else {
                reject(err);
            }
        });
    }).catch((err) => {
        throw new Error(err);
    });
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.clear();
    const website = yield (0, input_1.default)({
        message: "What website do you want to check? e.g. 'github.com' \n\u276f",
    });
    const start = Date.now();
    const usernames = fs_1.default
        .readFileSync("usernames.txt", "utf-8")
        .split("\n")
        .map((line) => line.trim());
    const availableUsernames = [];
    const checkUsernames = usernames.map((username) => __awaiter(void 0, void 0, void 0, function* () {
        const isAvailable = yield checkUsername(username, website);
        if (isAvailable) {
            availableUsernames.push(username);
            console.log(chalk_1.default.green(`\u276f The username '${username}' is available.`));
            fs_1.default.appendFileSync("available_usernames.txt", username + "\n");
        }
        else {
            console.log(chalk_1.default.redBright(`\u276f The username '${username}' is not available.`));
        }
    }));
    yield Promise.all(checkUsernames);
    const plural = availableUsernames.length != 1 ? "usernames are" : "username was";
    const pluralTotal = usernames.length != 1 ? "usernames" : "username";
    console.log(chalk_1.default.blue(`\n${chalk_1.default.bold(availableUsernames.length)} ${plural} available.\n`));
    console.log(chalk_1.default.white(`It took ${chalk_1.default.bold.blue((Date.now() - start) / 1000)} seconds to check ${chalk_1.default.bold.blue(usernames.length)} ${pluralTotal}.\n`));
    process.exit(0);
}))();
