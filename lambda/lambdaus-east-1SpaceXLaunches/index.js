// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.

const fetch = require('node-fetch')
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hi, you can ask me when\'s the next spacex launch.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};  
const NextSpaceXLaunch = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NextSpaceXLaunch';
    },
    async handle(handlerInput) {
        var response = await getSpaceXData();

        // received this:
        console.log("Got this response: " + String(response))

        // rocket name stuff
        var rocket_name = response[0].rocket.rocket_name
        
        // Payload stuff
        var payloads_number = (response[0].rocket.second_stage.payloads).length
        var payload_string = ''
        if (payloads_number <= 0) {
            payload_string = 'with no payload'
        }
        else if (payloads_number == 1) {
            payload_string = `containing ${payloads_number} payload`
        }
        else {
            payload_string = `containing ${payloads_number} payloads`
        }

        // Launch time and date
        var launch_date_local = response[0].launch_date_local
        var date = launch_date_local.split('T')[0]
        var time = launch_date_local.split('T')[1].slice(0,-6)

        return handlerInput.responseBuilder
                .speak(`<say-as interpret-as="date">The next launch is on ${date} at </say-as>` +
                    `<say-as interpret-as="time">${time}.</say-as>` + ` It's the ${rocket_name} ${payload_string}`)
                .getResponse();
    }
};

function handleErrors(response) {
    if (!response.status == 200) {
        throw Error(response.statusText);
    }
    return response;
}

function getSpaceXData() {
    return fetch('https://api.spacexdata.com/v3/launches/upcoming')
    .then(handleErrors)
    .then(res => {
        return res.json()
    })
    .catch(error => {
        console.log("Woopsie! " + error)
        return error
    })
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can ask me when\'s the next spacex launch';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};    

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        NextSpaceXLaunch,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler) 
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();