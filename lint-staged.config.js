/* eslint-env node */
const path = require('path');
const formatCommand =
  'prettier --check --config ./prior-authorized-ai/.prettierrc.json --ignore-path ./prior-authorized-ai/.prettierignore';

module.exports = {
  './prior-authorized-ai/**/*': formatCommand,
};
