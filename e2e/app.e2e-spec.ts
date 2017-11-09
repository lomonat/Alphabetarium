import { XmlconverterPage } from './app.po';

describe('xmlconverter App', () => {
  let page: XmlconverterPage;

  beforeEach(() => {
    page = new XmlconverterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
