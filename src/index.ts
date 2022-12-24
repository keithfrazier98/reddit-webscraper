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

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    // const currentTime= Date.now()
    // let postTime= await post.$eval("[data-testid='post_timestamp']", (el)=> el.innerHTML)
    // postTime = postTime.match(/[0-9]/)[1]
    // const postTimeInMS
    // const timestamp =

    const evalInnerHTML = async (selector: string) =>
      await post.$eval(selector, (el) => el.innerHTML);

    const titleParent = await post.$("[data-adclicklocation='title']");
    if (!titleParent)
      throw new Error("Could not get the title from the document.");
    const titleEl = await titleParent.$eval("h3", el=> el.innerHTML);
    if (!titleEl) throw new Error("Could not get the title from the document.");

    //title
    const data = {
      // timestap: ,
      title: titleEl,
      username: await evalInnerHTML("[data-testid='post_author_link']"),
      commentAmt: await post.$eval(
        "[data-test-id='comments-page-link-num-comments']",
        (el) => {
          const span = el.lastChild?.textContent;
          const split = span?.split(" ");
          if (split) return split[0];
        }
      ),
      upvotes: await post.$eval("[id*='vote-arrows']", (el) => el.children[1].innerHTML),
    };

    console.log(data);
  }

  await browser.close();
})();
