// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  
  // Get all age elements and their timestamps
  let ageElements = await page.locator('.age').all();
  const timestamps = [];
  let j = 1;
  
  while (j <= 100) {
    // Get current page elements
    ageElements = await page.locator('.age').all();
    
    for (const element of ageElements) {
      if (j > 100) break;
      
      const title = await element.getAttribute('title');
      const timestamp = title.split('T')[1].split(" ")[0];
      const timearr = timestamp.split(':');
      const hour = parseInt(timearr[0]);
      const minute = parseInt(timearr[1]);
      const sec = parseInt(timearr[2]);
      const day = parseInt(title.split('T')[0].split('-')[2]);
      const myMap = {
        "hour": hour,
        "min": minute,
        "sec": sec,
        "day": day
      }
      timestamps.push(myMap);
      j++;
    }
    
    // If we haven't reached 100 items and there's a "More" link, click it
    if (j <= 100) {
      const moreLink = page.locator('.morelink');
      if (await moreLink.isVisible()) {
        // Wait for the more link to be clickable
        await moreLink.waitFor({ state: 'visible' });
        // Click and wait for navigation
        await Promise.all([
          page.waitForLoadState('networkidle'),
          moreLink.click()
        ]);
        // Wait a bit for the new content to be fully loaded
        await page.waitForTimeout(1000);
      } else {
        break; // No more pages available
      }
    }
  }
  

  // validate if in order
  // the first map needs to have a higher number of seconds
  let isValid = true;
  let firstMap =  timestamps[0];
  //calculate seconds
  let firstnumSec = firstMap['sec'] + (firstMap['min'] * 60)  + (firstMap['hour'] * 60 * 60);

  let currnumSec = 0;
  for (let i = 1; i < timestamps.length; i++){
    const curr =  timestamps[i];
    // if curr['day'] is greater than the firstMap['day'] then there is no reason to check the seconds
    if (curr['day'] > firstMap['day']){
      isValid == false;
    } 
    //calculate currnumsec and compare to firstnumsec
    currnumSec =  curr['sec'] + (curr['min'] * 60)  + (curr['hour'] * 60 * 60);
    if (firstnumSec > currnumSec){
      firstMap = curr;
      firstnumSec =  currnumSec;
      continue;
    }
    
    firstMap = curr;
    firstnumSec =  currnumSec;
  }
  //print results
  if(isValid){
    console.log('The articles are in order.');
  }
  else{console.log('The articles are not in order.');}
 
}
(async () => {
  await sortHackerNewsArticles();
  
})();
