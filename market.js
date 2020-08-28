const puppeteer = require('puppeteer');
const config = require('./app/config');
const Console = require('./app/core/console');
const Utility = require('./app/core/utility');
const utility = new Utility();

let searchValue = undefined;

if (process.argv.length < 3) {
    console.log('Numero parametri non valido !!!');
    return;
} else {
    searchValue = process.argv[2];
}

async function go() {
    try {
        console.log(Console.Reset);

        const browser = await puppeteer.launch({
            headless: config.Market.headless,
            args: [`--window-size=${config.Market.windowWidth},${config.Market.windowHeight}`],
            defaultViewport: null,
        });
        const page = await browser.newPage();
        let pricesList = [];

        page.on('dialog', async dialog => {
            console.log(dialog.message());
            // await dialog.accept();
            await dialog.dismiss();
        });

        for (const market of config.Market.Markets) {
            console.log(`@@@@@@@@@@@ ${market.name} @@@@@@@@@@@`);
            await page.goto(market.target);

            if (market.preAction) {
                await market.preAction(utility, page);
            }

            // campo cerca
            await utility.formFieldWrite(market.selector, page, searchValue, true);
            await utility.keyPress('Enter', page);

            await page.waitFor(3000);

            // create a screenshots
            await page.screenshot({path: `${searchValue}_${market.name}.png`});

            // iscpezione prezzi
            pricesList = [...pricesList, ...await page.evaluate(market.action)];
            // console.log(pricesList);
        }

        console.log(pricesList);
        /*console.log(pricesList.sort((a, b) => {
            return a.price - b.price;
        }));*/

        console.log(Console.Reset);
        await browser.close();
    } catch (e) {
        console.error(e);
    }
}

go();
