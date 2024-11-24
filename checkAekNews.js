const cheerio = require("cheerio");
const moment = require("moment/moment");
const request = require("request-promise");
const greekUtils = require("greek-utils");
const config = require("./config");
const bot = require("./telegram");


const isNewTicketAnnouncement = (title, date) => {
  const lastWeek = moment().subtract(7, "day");

  return (
    greekUtils.sanitizeDiacritics(title).toLowerCase().includes("εισιτηρια") &&
    moment(date, "DD/MM/YYYY").isAfter(lastWeek)
  );
};

const sendTelegramMessage = (title) => {
  bot.sendMessage(
    "901354561",
    title + ": https://www.ticketmaster.gr/aek/showProductList.html"
  );
};

const AEK_NEWS_URL =
  "https://www.aekfc.gr/newslist/anakoinoseis-42807.htm?lang=el&path=-1817447704";

const fetchNews = () => {
  return request(AEK_NEWS_URL);
};

setInterval(() => {
  fetchNews()
    .then((response) => {
      const $ = cheerio.load(response);
      const articles = $(".default-article-list ul li");
      articles.each((i, article) => {
        const title = $(article).find(".title").text().trim();
        const date = $(article).find(".date").text().trim();

        if (isNewTicketAnnouncement(title, date)) {
          sendTelegramMessage(title);
        }
      });
    })
    .catch((e) => {
      console.log(e.message);
    });
}, config.refreshInterval * 1000);
