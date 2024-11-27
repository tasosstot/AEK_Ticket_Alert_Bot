const puppeteer = require("puppeteer");
const moment = require("moment/moment");
const greekUtils = require("greek-utils");
const config = require("./config");
const bot = require("./telegram");
const cheerio = require('cheerio');

const isNewTicketAnnouncement = (title, date) => {
  const lastWeek = moment().subtract(7, "day");

  return (
    greekUtils.sanitizeDiacritics(title).toLowerCase().includes("εισιτηρια") && // στον τίτλο με την λέξη "για"
    moment(date, "DD/MM/YYYY").isAfter(lastWeek)
  );
};

const sendTelegramMessage = (title) => {
  bot.sendMessage(
    "901354561",
    title + ": https://www.ticketmaster.gr/aek/showProductList.html"
  );
};

const AEK_NEWS_URL = "https://www.aekfc.gr/newslist/anakoinoseis-42807.htm?lang=el&path=-1817447704";

// Puppeteer-based fetchNews function
const fetchNews = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    // args: [
    //   '--proxy-server=http://***', // Proxy details
    // ]
  });

  const page = await browser.newPage();
  
  // Set the user agent to mimic a real browser
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36");

  // Go to the page and wait until the DOM content is loaded
  await page.goto(AEK_NEWS_URL, { waitUntil: 'domcontentloaded' });

  // Optionally, wait for the content to load by checking for a specific element
  await page.waitForSelector(".default-article-list ul li");

  const content = await page.content(); // Get the full HTML content of the page

  await browser.close();

  return content;
};

// Set an interval to check for new articles periodically
setInterval(() => {


  fetchNews()
    .then((response) => {
      const $ = cheerio.load(response); // Load the HTML content
      const articles = $(".default-article-list ul li");
      articles.each((i, article) => {
        const title = $(article).find(".title").text().trim();
        const date = $(article).find(".date").text().trim();
        console.log("Fetched title:", title);
        console.log("Parsed date:", date);
        if (isNewTicketAnnouncement(title, date)) {
          sendTelegramMessage(title);
        }
      });
    })
    .catch((e) => {
      console.log(e.message);
    });
}, config.refreshInterval * 2000); // e.g. check every 5 minutes
