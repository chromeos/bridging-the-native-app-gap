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
import { serial as test } from 'ava';
import glob from 'glob';
import express from 'express';
import path from 'path';
import { startChrome } from './helpers/chrome';
import { lighthouse } from './helpers/lighthouse';

test.before(async t => {
  const app = express();
  app.use(express.static(path.join(__dirname, '../public')));
  // Setting up test context
  t.context.server = app.listen(8080); // eslint-disable-line no-param-reassign
  t.context.chrome = await startChrome(); // eslint-disable-line no-param-reassign
});

test.after.always(t => {
  t.context.server.close();
  t.context.chrome.kill();
});

// Get all paths and give each a name
const paths = glob.sync(path.join(__dirname, '../public/**/*.html')).map(f => {
  const p = f
    .replace('/index.html', '')
    .replace(path.join(__dirname, '../public'), '')
    .replace(/^\//, '');
  return {
    path: p,
    name: p || 'home',
  };
});

// Run Lighthouse for each path
paths.forEach(p => {
  test(lighthouse, p.path, p.name);
});
