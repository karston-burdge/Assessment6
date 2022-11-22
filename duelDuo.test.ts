

import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

test('Draw button displays the div with id=choices', async () => {
    await driver.findElement(By.id('draw')).click()
    const botCard = await driver.findElement(By.id('choices'))
    const botCardDisplayed = await botCard.isDisplayed()
    expect(botCardDisplayed).toBe(true)
})

test('Add to Duo button displays the div with id=player-duo', async () => {
    await driver.findElement(By.id('draw')).click()
    await driver.findElement(By.className('bot-btn')).click()
    const playerBot = await driver.findElement(By.id('player-duo'))
    const playerBotDisplayed = await playerBot.isDisplayed()
    expect(playerBotDisplayed).toBe(true)
})