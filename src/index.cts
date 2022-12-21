import puppeteer from "puppeteer";

(async () => {
  //https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox"], // if we need them.
  });
  const page = await browser.newPage();
  await page.goto("https://www.reddit.com/r/cscareerquestions/");

  const posts = await page.$$("[data-testid='post-container']");
  
  for(let post in posts){
    // post.
  }

  console.log(posts.length, "\n", posts);
  await browser.close();
})();

