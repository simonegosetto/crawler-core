module.exports = {
    Cargo: {
        target: 'https://www.cargservicesdelnc.com/trackit.php',
        trackingid: '1598099039',
        windowWidth: 1920,
        windowHeight: 1080,
        headless: true
    },
    Market: {
        windowWidth: 1920,
        windowHeight: 1080,
        headless: false,
        Markets:[
            /*{
                name: 'Amazon',
                target: 'https://amazon.it',
                selector: 'field-keywords',
                preAction: undefined,
                action: () => {
                    /!*const links = Array.from(document.querySelectorAll('.a-section.a-spacing-medium'));
                    return links.map(link => {
                        if (link.querySelector(".a-price-whole")) {
                            console.log(link);
                            return {
                                name: link.querySelector(".a-size-medium.a-color-base.a-text-normal").innerText,
                                url: link.querySelector(".a-link-normal.a-text-normal").href,
                                image: link.querySelector(".s-image").src,
                                price: parseFloat(link.querySelector(".a-price-whole").innerText.replace(/[,.]/g, m => (m === ',' ? '.' : ''))),
                            };
                        }
                    }).slice(0, 5);*!/
                    return [1,2,3];
                }
            },
            {
                name: 'Ebay',
                target: 'https://ebay.it',
                selector: '_nkw',
                preAction: undefined,
                action: () => {
                    const links = Array.from(document.querySelectorAll('.s-item__info'));
                    return links.map(link => {
                        if (link.querySelector(".s-item__title")) {
                            return {
                                store: 'Ebay',
                                name: link.querySelector(".s-item__title").innerText,
                                url: link.querySelector(".s-item__link").href,
                                // image: link.querySelector(".s-image").src,
                                price: parseFloat(link.querySelector(".s-item__price").innerText.replace('EUR ','').replace(/[,.]/g, m => (m === ',' ? '.' : ''))),
                            };
                        }
                    });
                }
            },*/
            {
                name: 'Aliexpress',
                target: 'https://www.aliexpress.com/',
                selector: 'SearchText',
                preAction: async (utility, page) => {
                    await utility.elementGenericSelectorClick('.close-layer', page);
                    await page.waitFor(300);
                    await utility.elementGenericSelectorClick('#switcher-info', page);
                    await page.waitFor(2000);
                    await utility.elementGenericSelectorClick('.switcher-currency-c', page);
                    await page.waitFor(500);
                    await utility.elementGenericSelectorWrite('.search-currency','EUR', page);
                    await page.waitFor(500);
                    await utility.elementGenericSelectorClick('a[data-currency="EUR"]', page);
                    await page.waitFor(500);
                    await utility.elementClick('button', 'Save', 0, page);
                    await page.waitFor(500);
                },
                action: () => {
                    const links = Array.from(document.querySelectorAll('.product-card'));
                    return links.map(link => {
                        if (link.querySelector(".product-info")) {
                            return {
                                store: 'Aliexpress',
                                name: link.querySelector(".item-title").innerText,
                                url: link.querySelector(".place-container > a").href,
                                // image: link.querySelector(".s-image").src,
                                price: parseFloat(link.querySelector(".price-current").innerText.replace('€ ','').replace('US $','')
                                    .replace(/[,]/g, m => (m === ',' ? '.' : ''))),
                            };
                        }
                    });
                }
            },
            {
                name: 'Alibaba',
                target: 'https://www.alibaba.com/',
                selector: 'SearchText',
                preAction: undefined,
                action: () => {
                    return [1,2,3];
                }
            }
        ]
    },
};

