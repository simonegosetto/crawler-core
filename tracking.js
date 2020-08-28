const puppeteer = require('puppeteer');
const config = require('./app/config');
const Console = require('./app/core/console');
const Utility = require('./app/core/utility');
const utility = new Utility();

async function go() {
    try {
        console.log(Console.Reset);
        const browser = await puppeteer.launch({
            headless: config.Cargo.headless,
            args: [`--window-size=${config.Cargo.windowWidth},${config.Cargo.windowHeight}`],
            defaultViewport: null,
        });
        const page = await browser.newPage();
		
		while(true) {
			await page.goto(config.Cargo.target);

			// arretrati
			await utility.formFieldWrite('txtKeyword', page, config.Cargo.trackingid, true, 60);
			await utility.elementGenericSelectorClick('[name=userlogin]', page);
			
			await page.waitFor(1000);
			
			const text = await page.evaluate(() => {
			  return document.querySelectorAll('tbody')[7].querySelector('tr').querySelectorAll('td')[1].innerHTML;
			});
			console.log(Console.FgGreen, text);
			await page.waitFor(60000);
		}

        console.log(Console.Reset);
        // await browser.close();
    } catch (e) {
        console.error(e);
    }
}

go();
