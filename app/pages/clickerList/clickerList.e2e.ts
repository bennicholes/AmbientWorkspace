import { ElementFinder } from 'protractor';

let clickerField: ElementFinder = element(by.css('.text-input'));
let clickerButton: ElementFinder = element.all(by.className('button')).first();
let removeButton: ElementFinder = element.all(by.css('.button-outline-danger')).first();
let firstClicker: ElementFinder = element.all(by.className('clickerList')).first();

describe('ClickerList', () => {

  beforeEach(() => {
    browser.get('');
    // switch to last menu item (the clickers list) before every test - probably a better way to do this
    element(by.css('.bar-button-menutoggle')).click();
    element.all(by.css('ion-label')).last().click();
  });

  it('should switch into clickers page from menu', () => {
    element(by.css('.bar-button-menutoggle')).click();
    element.all(by.css('ion-label')).last().click();
    expect(element.all(by.css('.toolbar-title')).last().getText()).toEqual('Clickers');
  });

  it('has an input box for new Clickers', () => {
    expect(element(by.css('.text-input')).isPresent()).toEqual(true);
  });

  it('should add a Clicker', () => {
    'test clicker one'.split('').forEach((c) => clickerField.sendKeys(c));
    clickerButton.click();
    expect(firstClicker.getText()).toEqual('test clicker one (0)');
  });

  it('should click a Clicker', () => {
    firstClicker.click();
    expect(firstClicker.getText()).toEqual('test clicker one (1)');
  });

  it('should delete a Clicker', () => {
    removeButton.click();
    element.all(by.className('clickerList')).count()
      .then((count) => expect(count).toEqual(0));
  });
});
