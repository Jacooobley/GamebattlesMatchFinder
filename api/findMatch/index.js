const {Builder, By, Capabilities} = require('selenium-webdriver');
require('chromedriver');

const findMatch = async (req, res) => {

    try {
        //Spin up a new webdriver - incognito 
        var chromeCapabilities = Capabilities.chrome();
        var chromeOptions = {'args': ['--test-type', '--incognito']};
        chromeCapabilities.set('chromeOptions', chromeOptions);
        var webdriver = new Builder().withCapabilities(chromeCapabilities).build();

        //Authentication
        await webdriver.get("http://gamebattles.majorleaguegaming.com/");
        await webdriver.findElement(By.className('cookie-close')).click();
        await webdriver.findElement(By.className('mlg-header-right-button')).click();
        await webdriver.findElement(By.id('login')).sendKeys(process.env['user']);
        await webdriver.findElement(By.id('login_password')).sendKeys(process.env['password']);
        await webdriver.findElement(By.id('login_button')).click();

        //We need the wait, else the match finder doesn't work correctly
        await sleep(5000);

        await webdriver.get(`http://gamebattles.majorleaguegaming.com/ps4/call-of-duty-black-ops-4/team/${process.env["teamId"]}`);

        //If there is an alert, get rid of it
        var alert = await webdriver.findElement(By.id('arena-alert'));
        if (alert) {
            await webdriver.findElement(By.xpath('//*[@id="arena-alert-header"]/a')).click();
        }

        //Find match
        await webdriver.get(`http://gamebattles.majorleaguegaming.com/ps4/call-of-duty-black-ops-4/ladder/team-eu/match-finder`);
        await webdriver.findElement(By.xpath("//option[@value='2122']")).click();
        await sleep(1000);
        await webdriver.findElement(By.xpath("//input[@value='Search Matches']")).click();
       
        //Check matches
        var resultElementHTML;
        var resultElement;
        var findingMatch = true;
        var validMatch;

        for(;findingMatch;) {
            resultElement = await webdriver.findElement(By.id('mf_sorted_result'))
            resultElementHTML = await resultElement.getAttribute("innerHTML");

            //If we cant find any matches for the gametype, sleep and try again
            if (resultElementHTML.includes('There are no matches available meeting your search criteria.')){
                await sleep(process.env['waitTime']);
                await webdriver.navigate().refresh();
            } else {
                var matches = await webdriver.findElements(By.xpath('//*[@id="mf_sorted_result"]/tr'));

                var playerCount = process.env['roster'].split(',').length; 

                for (const match of matches) {
                    var matchHTML = await match.getAttribute('innerHTML');

                    const mapCheck = matchHTML.includes(`<strong>${process.env['mapCount']}</strong>`);
                    const rosterCheck = matchHTML.includes(`<strong>${playerCount}v${playerCount}</strong>`);
                    const timeCheck = matchHTML.includes(`<strong>Available Now</strong>`);
                    //TODO: leverege config here
                    const levelCheck = matchHTML.includes(`src="/images/arenas/ladder/levels/lower.png"`);

                    if(mapCheck && rosterCheck && timeCheck && levelCheck) {
                        validMatch = match;
                        findingMatch = false;
                    }
                }

                if (validMatch == null) {
                    await sleep(process.env['waitTime']);
                    await webdriver.navigate().refresh();
                }
            }
        }

        await validMatch.findElement(By.name('do')).submit();
        await webdriver.findElement(By.className('list'));

        var rosterPlayers = await webdriver.findElements(By.xpath('//*[@id="subcontainer"]/div[7]/div[2]/form/table/tbody/tr'));
        var players = process.env['roster'].split(',');

        //Where a player in our list matches a roster player, check the box
        for(const player in players) {
            for (const rosterPlayer in rosterPlayers) 
            {
                var rosterPlayerHTML = await rosterPlayers[rosterPlayer].getAttribute('innerHTML');

                if (rosterPlayerHTML.includes(players[player])) {
                    await rosterPlayers[rosterPlayer].findElement(By.name('roster[]')).click();
                }
            }
        }

        await webdriver.findElement(By.xpath('//*[@id="subcontainer"]/div[7]/div[2]/form/div[4]/input')).click();
        
        //Don't accept matches in development mode
        if (!process.env['devMode']) {
            await webdriver.findElement(By.xpath('//*[@id="accept_match_button"]')).click();
        }
        
        webdriver.close();
        res.status(200).json({ message: 'Match found sucessfully' });
    } catch (err) {
        webdriver.close();
        console.log(err);
        res.status(500).json({ message: 'Error finding match' });
    }
};

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

module.exports = findMatch;