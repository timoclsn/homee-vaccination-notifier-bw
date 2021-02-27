import { chromium } from "playwright";
import fetch from "node-fetch";

const homeeId = process.env.HOMEE_ID;
const homeeWebhookKey = process.env.HOMEE_WEBHOOK_KEY;

const plz = 73730; // Vaccination center plz
const interval = 60000; // Retry interval

const vaccinationAppointmentUrl = `https://229-iz.impfterminservice.de/impftermine/service?plz=${plz}`;
const sucessWebhook = `https://${homeeId}.hom.ee/api/v2/webhook_trigger?webhooks_key=${homeeWebhookKey}&event=vaccine`;
const errorText = '"Es wurden keine freien Termine in Ihrer Region gefunden"';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

console.log("💉 Starting to look for appointments…");

let count = 1;

await page.goto(vaccinationAppointmentUrl);

while (true) {
  console.log(`⏱ Try no.: ${count}`);

  await page.click("label[_ngcontent-nfa-c113] :text('Nein')", {
    force: true,
  });

  await waitFor(5000);

  let error = await page.$(errorText);

  if (!error) {
    console.log("1️⃣ First step successful");

    await page.waitForSelector(
      ':is(strong:has-text("Gehören Sie einer der genannten Personengruppen an?"))'
    );

    await page.click("label[_ngcontent-nfa-c112] :text('Ja')", {
      force: true,
    });

    await page.fill("input[type='tel']", "30");

    await page.click("button[_ngcontent-nfa-c112]");

    await waitFor(5000);

    let error = await page.$(errorText);

    if (!error) {
      console.log(
        "2️⃣ Second step successful, appointments available – sending to homee!"
      );

      const response = await fetch(sucessWebhook);
      console.log("Sucessfully sent", await response.text());
    }
  }

  console.log(
    `❌ No appointments available, trying again in ${interval / 1000}s`
  );

  count = count + 1;
  await waitFor(interval);
}

async function waitFor(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
