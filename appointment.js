import { chromium } from "playwright";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const homeeId = process.env.HOMEE_ID;
const homeeWebhookKey = process.env.HOMEE_WEBHOOK_KEY;
const code = process.env.CODE;
const plz = process.env.PLZ;

const interval = 5 * 60 * 1000; // Retry interval

const vaccinationAppointmentUrl = `https://229-iz.impfterminservice.de/impftermine/suche/${code}/${plz}`;
const sucessWebhook = `https://${homeeId}.hom.ee/api/v2/webhook_trigger?webhooks_key=${homeeWebhookKey}&event=homee-vaccination-notifier-bw`;

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

console.log("💉 Starting to look for appointments…");

let count = 1;

await page.goto(vaccinationAppointmentUrl);

while (true) {
  console.log(`⏱ Try no.: ${count}`);

  await page.click("button[_ngcontent-nfa-c126]");

  await waitFor(2000);

  let error = await page.$(
    '"Derzeit stehen leider keine Termine zur Verfügung."'
  );

  if (!error) {
    console.log("Appointments available – sending to homee!");

    const response = await fetch(sucessWebhook);
    if (response.ok) {
      console.log("Sucessfully sent", await response.text());
    } else {
      console.log("🚨 Sending to homee failed!");
    }
  }

  console.log(
    `❌ No appointments available, trying again in ${interval / 1000}s`
  );

  await waitFor(2000);

  await page.click("button[_ngcontent-nfa-c125]");

  count = count + 1;
  await waitFor(interval);
}

async function waitFor(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
