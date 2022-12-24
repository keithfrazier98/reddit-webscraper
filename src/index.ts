import puppeteer, { ElementHandle, Page } from "puppeteer";

(async () => {
  //https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c
  // setup the browser and set a viewport size to help with scrolling
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox"], // if we need them.
  });
  const page = await browser.newPage();
  await page.goto("https://www.reddit.com/r/cscareerquestions/");
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  /**
   * Scrapes the current posts available in the document.
   * @param skip
   * @returns
   */
  async function scrapeCurrentPosts(skip: number = 0) {
    let posts = await page.$$("[data-testid='post-container']");
    posts = posts.slice(skip);

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

      const currentTime = Date.now();
      let postTime: any = await post.$eval(
        "[data-testid='post_timestamp']",
        (el) => el.innerHTML
      );
      postTime = postTime.match(/[0-9]*/);
      // console.log(postTime)
      if (postTime) postTime = postTime[0];
      const postTimeInMS = Number(postTime) * 3.6e6;
      // console.log(postTimeInMS)
      const timestamp = new Date(currentTime - postTimeInMS);

      const evalInnerHTML = async (selector: string) =>
        await post.$eval(selector, (el) => el.innerHTML);

      const titleParent = await post.$("[data-adclicklocation='title']");
      if (!titleParent)
        throw new Error("Could not get the title from the document.");
      const titleEl = await titleParent.$eval("h3", (el) => el.innerHTML);
      if (!titleEl)
        throw new Error("Could not get the title from the document.");

      //title
      const data = {
        // timestap: ,
        title: titleEl,
        username: await evalInnerHTML("[data-testid='post_author_link']"),
        timestamp,
        commentAmt: await post.$eval(
          "[data-test-id='comments-page-link-num-comments']",
          (el) => {
            const span = el.lastChild?.textContent;
            const split = span?.split(" ");
            if (split) return split[0];
          }
        ),
        upvotes: await post.$eval(
          "[id*='vote-arrows']",
          (el) => el.children[1].innerHTML
        ),
      };

      console.log(data);
    }

    return [posts.length, posts[posts.length - 1]] as [
      number,
      ElementHandle<Element>
    ];
  }

  try {
    let count = 0;
    while (count < 1) {
      const [postsScraped, lastPost] = await scrapeCurrentPosts(count);
      count += postsScraped;

      //scroll for more posts to load
      await page.evaluate(() => {
        const elements = document.querySelectorAll(
          "[data-testid='post-container']"
        );

        if (elements) {
          elements[elements.length - 1].scrollIntoView();
        }
      });

      console.log("Current Scrape Count: " + count);
      console.log("Waiting for two seconds");
      // delay continuing for two seconds or else reddit will crash
      // probably due to rate limiting
      await new Promise((res, rej) => {
        setTimeout(() => {
          console.log("Timeout finished");
          res(null);
        }, 2000);
      });
    }
  } catch (error) {
    console.error(error);
  }

  await browser.close();
})();
