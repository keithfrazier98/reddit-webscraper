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
const puppeteer_1 = __importDefault(require("puppeteer"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    //https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c
    const browser = yield puppeteer_1.default.launch({
        executablePath: "/usr/bin/google-chrome",
        args: ["--no-sandbox"], // if we need them.
    });
    const page = yield browser.newPage();
    yield page.goto("https://www.reddit.com/r/cscareerquestions/");
    const posts = yield page.$$("[data-testid='post-container']");
    for (let post in posts) {
        // post.
    }
    console.log(posts.length, "\n", posts);
    yield browser.close();
}))();
