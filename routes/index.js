const express = require('express');
const twilio = require('twilio');
require('dotenv').config();

const router = express.Router();
const Call = require('../models').call;
const { badRequestHandler, serverErrorHandler } = require('../helpers/errorHandlers');

const ngrokUrl = process.env.NGROK_URL;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const personalNumber = process.env.PERSONAL_NUMBER;

const twilioClient = twilio(accountSid, authToken);

/* POST handle incoming call. */
router.post('/incoming-call', (req, res) => {
	const digitPressed = req.body.digit;

	if (digitPressed === '1') {
		twilioClient.calls
			.create({
				url: `${ngrokUrl}/voice.xml`,
				to: personalNumber,
				from: twilioNumber,
			}).then(
				(call) => {
					Call.create({
						call_sid: call.sid,
						status: 'forwarded',
						from: call.from,
						to: call.to
					}).then(
						() => {
							return res.json({
								message: 'Call forwarded successfully!',
								call_details: call
							});
						},
						(err) => {
							return serverErrorHandler(res, 'Error: Failed to create a call in POST handle incoming call', err, { call_create_failed: true });
						}
					);
				},
				(err) => {
					return serverErrorHandler(res, 'Error: Failed to forward a call in POST handle incoming call', err, { call_forward_failed: true });
				}
			);
	} else if (digitPressed === '2') {
		const voicemailUrl = req.body.voicemail_url;
		const callSid = req.body.call_sid;
		const callingNumber = req.body.calling_number;

		if (!voicemailUrl) {
			return badRequestHandler(res, 'Error: Voicemail url is not specified!');
		}

		if (!callSid) {
			return badRequestHandler(res, 'Error: Call sid is not specified!');
		}

		if (!callingNumber) {
			return badRequestHandler(res, 'Error: Calling number is not specified!');
		}

		Call.create({
			call_sid: callSid,
			status: 'voicemail',
			from: callingNumber,
			to: personalNumber,
			voicemail_url: voicemailUrl
		}).then(
			() => {
				return res.json({
					message: 'Voicemail stored successfully!',
				});
			},
			(err) => {
				return serverErrorHandler(res, 'Error: Failed to create call in POST handle incoming call', err, { call_create_failed: true });
			}
		);
	} else {
		return res.json({
			message: 'No option selected!',
		});
	}
});

/* POST update call info. */
router.post('/update', (req, res) => {
	const callSID = req.body.call_sid;

	if (!callSID) {
		return badRequestHandler(res, 'Error: Call sid is not specified!');
	}

	twilioClient.calls(callSID).fetch().then(
		(callDetails) => {
			if (!callDetails) {
				return badRequestHandler(res, 'Error: Call sid is invalid');
			}

			Call.findOne({
				where: { call_sid: callSID }
			}).then(
				(call) => {
					call.update({
						duration: callDetails.duration
					}).then(
						() => {
							return res.json({
								message: 'Call info updated successfully!'
							});
						},
						(err) => {
							return serverErrorHandler(res, 'Error: Failed to update call info in POST update call info', err, { call_update_failed: true });
						}
					);
				},
				(err) => {
					return serverErrorHandler(res, 'Error: Failed to fetch call details in POST update call info', err, { call_fetch_failed: true });
				}
			);
		},
		(err) => {
			return serverErrorHandler(res, 'Error: Failed to fetch twilio call details in POST update call info', err, { twilio_call_fetch_failed: true });
		}
	);
});

/* GET calls info. */
router.get('/all', (req, res) => {
	Call.findAll().then(
		(callsInfo) => {
			return res.json({
				message: 'Call details fetched successfully!',
				callsInfo
			});
		},
		(err) => {
			return serverErrorHandler(res, 'Error: Failed to fetch call details in GET calls info', err, { calls_fetch_failed: true });
		}
	);
});

module.exports = router;
