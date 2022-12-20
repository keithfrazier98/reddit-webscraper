import puppeteer from "puppeteer";

(async () => {
  //https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox"], // if we need them.
  });
  const page = await browser.newPage();
  const webpage = await page.goto("https://www.google.com/");
  await browser.close();
})();
