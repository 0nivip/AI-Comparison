import dotenv from "dotenv";

dotenv.config();

interface Config {
    OPENAI_API_KEY: string;
    COHERE_API_KEY: string;
    GEMINI_API_KEY: string;
}

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these variables or not setup a .env file at all
type ENV = Partial<Config>;

// Loading process.env as ENV interface
const getConfig = (): ENV => ({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    COHERE_API_KEY: process.env.COHERE_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
});

// Throw an Error if any field is undefined.
// We don't want our app to run if it can't connect to the APIs and ensure
// that these fields are accessible. If all is good, return
// it as Config which just removes the undefined from our type definition.

const getSanitizedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in .env file`);
        }
    }
    return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

// VS will show it when you are trying to import it
const env = sanitizedConfig;
export default env;
