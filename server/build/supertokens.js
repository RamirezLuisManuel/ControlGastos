"use strict";
/*import supertokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import Passwordless from "supertokens-node/recipe/passwordless";

supertokens.init({
    framework: "express",
    supertokens: {
        connectionURI: "http://localhost:3567", // Cambiar si usas SuperTokens alojado
    },
    appInfo: {
        appName: "Agenda de Ahorro",
        apiDomain: "http://localhost:3000", // Backend
        websiteDomain: "http://localhost:4200", // Frontend
    },
    recipeList: [
        EmailPassword.init({
            override: {
                apis: (originalImplementation) => ({
                    ...originalImplementation,
                    async signInPOST(input) {
                        const response = await originalImplementation.signInPOST(input);
                        if (response.status === "OK") {
                            const { user } = response;
                            const email = user.email; // Tomar el correo desde la respuesta del usuario
                            // Llamar al flujo de envío de código aquí
                            await sendVerificationCode(email);
                        }
                        return response;
                    },
                }),
            },
        }),
        Passwordless.init({
            contactMethod: "EMAIL",
            flowType: "USER_INPUT_CODE",
            createAndSendCustomEmail: async ({ email, userInputCode }) => {
                await sendEmailWithSMTP(email, userInputCode);
            },
        }),
        Session.init(), // Manejo de sesiones
    ],
});
*/
