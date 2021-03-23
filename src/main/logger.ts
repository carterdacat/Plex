import { bgBlue, black, green } from "chalk";
import { loggerTypes } from "./Types";
/**
 * Formats partitons of the timestamp
 * @category Classes.logger
 * @internal
 * @param value the string/number to format
 * @param digits how long to make it
 */
function dateTimePad(value: string | number, digits: number): string | number {
    let number = value;
    while (number.toString().length < digits) {
        number = "0" + number;
    }
    return number;
}
/**
 * Formats a date to a logger timestamp
 * @category Classes.logger
 * @internal
 * @param tDate The date to format
 */
function format(tDate: Date): string {
    return (
        tDate.getFullYear() +
        "-" +
        dateTimePad(tDate.getMonth() + 1, 2) +
        "-" +
        dateTimePad(tDate.getDate(), 2) +
        " " +
        dateTimePad(tDate.getHours(), 2) +
        ":" +
        dateTimePad(tDate.getMinutes(), 2) +
        ":" +
        dateTimePad(tDate.getSeconds(), 2) +
        "." +
        dateTimePad(tDate.getMilliseconds(), 3)
    );
}
/**
 * @category Classes.logger
 * The logger class used to log nice looking logs
 */
export default class Logger {
    /**
     * The function used to log the log
     * @category Functions.logger
     * @param content The content to log
     * @param type
     */
    public log(content: string, type: loggerTypes = "log") {
        const date = `[${format(new Date(Date.now()))}]:`;
        switch (type) {
            // Check the message type and then print him in the console
            case "log": {
                return console.log(`${date} ${bgBlue(type.toUpperCase())} ${content} `);
            }
            case "warn": {
                return console.log(`${date} ${black.bgYellow(type.toUpperCase())} ${content} `);
            }
            case "error": {
                return console.log(`${date} ${black.bgRed(type.toUpperCase())} ${content} `);
            }
            case "debug": {
                return console.log(`${date} ${green(type.toUpperCase())} ${content} `);
            }
            case "cmd": {
                return console.log(`${date} ${black.bgWhite(type.toUpperCase())} ${content}`);
            }
            case "ready": {
                return console.log(`${date} ${black.bgGreen(type.toUpperCase())} ${content}`);
            }
            case "rest": {
                return console.log(`${date} ${black.bgMagenta(type.toUpperCase())} ${content}`);
            }
            default:
                throw new TypeError(
                    "Logger type must be either warn, debug, log, ready, cmd, rest, or error."
                );
        }
    }
}
