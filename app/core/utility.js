const Console = require('./console');

class Utility {

    /**
     * Metodo che ritorna l'inner html di un elemento
     * @param elementDOMTag
     * @param elementDOMIndex
     * @param page
     * @returns {Promise<void>}
     */
    inputValueGetByName = async (formControlName, isTemplateDriven, page) => {
        try {
            return page.evaluate(selector => selector.value, await page.waitForSelector(this.formControlNameSelector(formControlName, isTemplateDriven)));
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    /**
     * Scrive il value di un input cancellando quello precedente
     * @param formControlName
     * @param isTemplateDriven
     * @param value
     * @param page
     * @returns {Promise<void>}
     */
    setInputValueByName = async (formControlName, isTemplateDriven, inputValue, page) => {
        try {
            await page.$eval(await this.formControlNameSelector(formControlName, isTemplateDriven), (el, selectValue) => el.value = selectValue, inputValue);
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };
    /**
     * Metodo che restituisce il selettore completo per un form Reactive o Template-Driven
     * @param name
     * @param isTemplateDriven
     * @returns {string}
     */
    formControlNameSelector = (name, isTemplateDriven) => {
        try {
            return isTemplateDriven ? `[name="${name}"]` : `[formControlName="${name}"]`;
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    /**
     * Metodo di click di un elemento in base al testo che contiene
     * @param elementDOMTag
     * @param elementDOMText
     * @param elementDOMIndex
     * @param page
     * @returns {Promise<void>}
     */
    elementClick = async (elementDOMTag, elementDOMText, elementDOMIndex, page) => {
        try {
            console.log(Console.FgYellow, `clicco sul tag ${elementDOMTag} col testo ${elementDOMText}`);
            await page.waitForXPath(`(//${elementDOMTag}[contains(., '${elementDOMText}')])`);
            const button = await page.$x(`(//${elementDOMTag}[contains(., '${elementDOMText}')])`);
            let buttonP = await page.evaluate(el => el.click(), button[elementDOMIndex]);
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    elementClickByXPathAttribute = async (elementDOMXPath, elementDOMIndex, page) => {
        try {
            console.log(Console.FgYellow, `clicco sulla path  tag ${elementDOMXPath}`);
            await page.waitForXPath(`(//${elementDOMXPath})`);
            const elem = await page.$x(`(//${elementDOMXPath})`);
            let elemP = await page.evaluate(el => el.click(), elem[elementDOMIndex]);
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    /**
     * dato un determinato elemento e il suo indice ritorna il suo indexHTML
     * @param elementDOMTag
     * @param elementDOMIndex
     * @param page
     * @param isCurrency
     * @returns {Promise<string>}
     */
    elementValueGetByIndex = async (elementDOMTag, elementDOMIndex, page, isCurrency = false) => {
        try {
            await page.waitForXPath(`(//${elementDOMTag})`);
            const elem = await page.$x(`(//${elementDOMTag})`);
            let valueInnerText = await page.evaluate(el => el.innerText, elem[elementDOMIndex]);
            if (isCurrency) {
                valueInnerText = valueInnerText.replace('.','').replace(',','.');
                valueInnerText = valueInnerText.replace('€', '');
                valueInnerText = valueInnerText.trim();
            }
            return (valueInnerText);
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    /**
     * ritorna il valore di un elemento random dato il tag html e il suo indice
     * @param elementDOMTag
     * @param page
     * @param isCurrency
     * @returns {Promise<{index: number, value: string}>}
     */
    elementValueRandomGet = async (elementDOMTag, page, isCurrency = false) => {
        try {
            await page.waitForXPath(`(//${elementDOMTag})`);
            const elem = await page.$x(`(//${elementDOMTag})`);
            const index = await this.randomIntGet(elem.length);
            let valueInnerText = await page.evaluate(el => el.innerText, elem[index]);
            if (isCurrency) {
                valueInnerText = valueInnerText.replace('.','').replace(',','.');
                valueInnerText = valueInnerText.replace('€', '');
                valueInnerText = valueInnerText.trim();
            }
            return ({value: valueInnerText, index});
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };


    /**
     *
     * @param formControlName
     * @param page
     * @param isTemplateDriven
     * @returns {Promise<void>}
     */
    elementFormControlNameClick = async (formControlName, page, isTemplateDriven = false) => {
        try {
            console.log(Console.FgYellow, `clicco su ${formControlName}`);
            await page.waitForSelector(this.formControlNameSelector(formControlName, isTemplateDriven));
            await page.click(this.formControlNameSelector(formControlName, isTemplateDriven));
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    elementGenericSelectorClick = async (selector, page) => {
        try {
            await page.waitForSelector(selector);
            await page.click(selector);
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    elementGenericSelectorWrite = async (selector, text, page, delay = 30) => {
        try {
            await page.waitForSelector(selector);
            await this.inputWrite(text, page, delay);
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    /**
     *
     * @param formControlName
     * @param page
     * @param text
     * @param isTemplateDriven
     * @param delay
     * @returns {Promise<void>}
     */
    formFieldWrite = async (formControlName, page, text, isTemplateDriven = false, delay = 30) => {
        try {
            console.log(Console.FgYellow, `scrivo ${text} su ${formControlName}`);
            await this.elementFormControlNameClick(formControlName, page, isTemplateDriven);
            await page.waitFor(100);
            await this.inputWrite(text, page, delay);
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    searchFieldWrite = async (placeholderName, text, page, delay = 30) => {
        try {
            console.log(Console.FgYellow, `scrivo ${text} su ${placeholderName}`);
            await this.elementGenericSelectorClick(placeholderName, page);
            await this.inputWrite(text, page, delay);
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    /**
     * Metodo semplice di scrittura del testo
     * @param text
     * @param page
     * @param delay
     * @returns {Promise<void>}
     */
    inputWrite = async (text, page, delay = 30) => {
        try {
            await page.keyboard.type(text, {delay});
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    /**
     * Metodo di press di un pulsante della tastiera per N volte
     * @param key
     * @param page
     * @param times
     * @returns {Promise<void>}
     */
    keyPress = async (key, page, times = 1) => {
        try {
            for (let i = 0; i < times; i++) {
                console.log(Console.FgCyan, `clicco il bottone ${key} su ${i+1} volte`);
                await page.keyboard.press(`${key}`);
            }
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    optionFormSelect = async (selector, elementPosition = 1, page, isTemplateDriven = false) => {
        try {
            console.log(Console.FgYellow, `clicco l'opzione ${elementPosition} su ${selector}`);
            await this.elementFormControlNameClick(selector, page, isTemplateDriven);
            await this.keyPress('ArrowDown', page, elementPosition);
            await this.keyPress('Enter', page);
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    optionFormSelectField = async (selector, elementPosition = 1, page) => {
        try {
            console.log(Console.FgYellow, `clicco l'opzione ${elementPosition} su ${selector}`);
            await this.elementGenericSelectorClick(selector, page);
            await this.keyPress('ArrowDown', page, elementPosition);
            await this.keyPress('Enter', page);
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    setKendoInputValueByName = async (formControlName, isTemplateDriven, inputValue, page) => {
        try {
            await page.$eval(await this.formControlNameSelector(formControlName, isTemplateDriven), (el, selectValue) => el.value = selectValue, inputValue);
        } catch (e) {
            console.error(Console.FgRed, e.message);
        }
    };

    /**
     * ritorna un numero intero random dato un massimo
     * @param max
     * @returns {Promise<number>}
     */
    randomIntGet(max) {
        return new Promise(res => res(Math.floor(Math.random() * Math.floor(max))))
    }
}

module.exports = Utility;
