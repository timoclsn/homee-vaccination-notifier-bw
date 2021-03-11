# homee vaccination notifier bw

Get a notification from your homee if there are covid vaccination appointments in BW.

🚨 As https://www.impfterminservice.de/ get's updated – the elemnts on the website might also change and this script will not work anymore. But you can simply inspect for that changes and adapt the scripts.

🚨 Some vaccination centers use different URLs – you may have to change the URL in the script. Just check the URL for your vaccination center on https://www.impfterminservice.de/ and adapt it in the scripts.

## How to use it:

- Add homeegram with webhook trigger ('homee-vaccination-notifier-bw') and push notification action
- Add homee ID to `.env`
- Add homee webhook key to `.env`
- Adapt PLZ `.env`
- For `code.js` add "Vermittlungscode" to `.env
- `npm install`
- `node code.js` or `node appointment.js`

## Scripts

- `code.js` ist used to get a "Vermittlungscode"
- `appointment.js` is used to check for appointments if you have a "Vermittlungscode"
