import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";

setGlobalOptions({maxInstances: 10});

export const healthCheck = onRequest((request, response) => {
  response.status(200).json({
    status: "ok",
    service: "ArchConnect-KE Functions",
  });
});