/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ChromeLauncher = require('chrome-launcher');

/**
 * Create and launch an instance of Chrome Launcher
 *
 * @param {object} opts - The options to pass to Chrome Launcher. Defaults to an object including the headless flag
 * @return {object} An instance of Chrome Launcher
 */
function startChrome(opts = { chromeFlags: ['--headless'] }) {
  return ChromeLauncher.launch({ chromeFlags: opts.chromeFlags });
}

module.exports = {
  startChrome,
};
