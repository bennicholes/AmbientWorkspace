import { ElementFinder } from 'protractor';

let message: ElementFinder = element(by.className('message'));

describe('Hue Page', () => {

  beforeEach(() => {
    browser.get('');
  });

  it('should have correct header text', () => {
    element(by.css('.bar-button-menutoggle')).click();
    element.all(by.css('ion-label')).first().click();
    expect(message.getText()).toEqual('Hue stuff');
  });
});
