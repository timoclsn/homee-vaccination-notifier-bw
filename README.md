# homee vaccination notifier bw

Get a notification from your homee if there are covid vaccination appointments in BW.

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
