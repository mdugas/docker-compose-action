const core = require("@actions/core");
const composeV1 = require('docker-compose')
const composeV2 = require('docker-compose/dist/v2')
const compose =
  core.getInput("compose-version") === "v1"
    ? composeV1
    : composeV2
const utils = require("./utils");

try {
  const composeFiles = utils.parseComposeFiles(
    core.getMultilineInput("compose-file")
  );
  if (!composeFiles.length) {
    return;
  }

  const options = {
    config: composeFiles,
    log: true,
    composeOptions: utils.parseFlags(core.getInput("compose-flags")),
    commandOptions: utils.parseFlags(core.getInput("down-flags")),
  };

  compose.down(options).then(
    () => {
      console.log("compose removed");
    },
    (err) => {
      core.setFailed(`compose down failed ${err}`);
    }
  );
} catch (error) {
  core.setFailed(error.message);
}
