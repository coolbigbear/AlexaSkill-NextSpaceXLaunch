// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const fetch = require('cross-fetch');
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, you can say Hello or Help. Which would you like to try?';
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
        let flight = await getSpaceXData()
        await console.log(flight)
        return handlerInput.responseBuilder
            .speak("hello")
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();        
    }
};

function getSpaceXData() {
    var flight_number;
    fetch('https://api.spacexdata.com/v3/launches/upcoming')
    .then(res => {
        return res.json()
    })
    .then(smth => {
        flight_number = smth[0].flight_number.toString()
        return flight_number
    })
    .catch(error => {
        console.log("Woopsie! " + error)
    })
    return flight_number
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

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

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
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
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();

    // https.get('https://api.spacexdata.com/v3/launches/upcoming', (resp) => {
    //     let data = '';
    //     let mission;
    //     let date;
    //     let rocket_name;
    //     let no_of_payloads;

    //     console.log(`statusCode: ${resp.statusCode}`)

    //     // A chunk of data has been recieved.
    //     resp.on('data', (chunk) => {
    //         data += chunk;
    //     });

    //     // The whole response has been received. Print out the result.
    //     resp.on('end', () => {
    //         data = JSON.parse(data)[0]

    //         mission = data.mission_name
    //         date = data.launch_date_local
    //         rocket_name = data.rocket.rocket_name
    //         no_of_payloads = data.rocket.second_stage.payloads.length

    //         console.log(mission)
    //         console.log(no_of_payloads)
    //         console.log(rocket_name)
    //         console.log(date)
    //         console.log("This is what I'll say " + mission)
    //     })

    //     req.on('error', error => {
    //         console.error('Found this error: ' + error)
    //     })

    //     req.end()