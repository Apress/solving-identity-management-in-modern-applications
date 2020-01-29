const notProvided = Symbol('not-provided');

/**
 * Environment variable handler utility, We call dotenv/config
 * as first line, so this should be fine. If some variable is not provided
 * we should bail out as soon as possible.
 *
 * @param {Any} name - Name of the environment variable
 * @param {Any} defaultValue - Default value, if not provided and variable is missing
 * the process will exit
 *
 */
export default function env(name, defaultValue = notProvided) {
  const value = process.env[name] || defaultValue;

  if (value === notProvided) {
    console.error(new Error(`Environment Variable ${name} provided`));
    // eslint-disable-next-line no-process-exit
    process.exit(-1);
  }

  return value;
}
