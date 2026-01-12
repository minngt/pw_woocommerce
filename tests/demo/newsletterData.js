const {chromium} = require('playwright');

async function newsletterData () {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://vnexpress.net/khoa-hoc-cong-nghe', {waitUntil: 'domcontentloaded'});

    const notes = await page.$$eval('article.item-news', articles => {
        return articles.map(article => {
            const titleElement = article.querySelector('h3.title-news a, h4.title-news a');
            const contentElement = article.querySelector('p.description a');
            
            const title = titleElement ? titleElement.innerText.replace(/[\n\t]/g, '') : 'No title found';
            const content = contentElement ? contentElement.innerText : 'No content found';

            return {title, content}
        }).filter(article => article.content !== 'No content found' && article.title !== 'No title found').slice(0, 10);
    });

    console.log(notes);
    await browser.close();

    return notes
};

module.exports = {newsletterData};