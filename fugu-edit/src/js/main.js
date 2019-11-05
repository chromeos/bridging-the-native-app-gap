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
/* global CodeMirror, launchQueue, launchParams */
import { log } from './lib/log';
import { selectFile, selectFolder, openFile, writeFile } from './lib/files';

const state = {
  current: null,
};

const code = CodeMirror.fromTextArea(document.querySelector('#code'), {
  theme: 'monokai',
  lineWrapping: true,
  lineNumbers: true,
  tabSize: 2,
  indentWithTabs: true,
});

window.addEventListener('keydown', async e => {
  const meta = e.ctrlKey === true || e.metaKey === true;
  if (meta && e.key === 'o') {
    e.preventDefault();

    if (e.shiftKey === true) {
      const tree = await selectFolder(code);
      const builtTree = buildTreeView(tree);
      document.querySelector('.editor--sidebar').appendChild(builtTree);
      document.querySelector('.editor').setAttribute('data-sidebar', true);
    } else {
      await selectFile(code, state);
      document.querySelector('.editor').removeAttribute('data-sidebar');
    }
  } else if (meta && e.key === 's') {
    e.preventDefault();
    await writeFile(state.current, code.getValue());
  }
});

window.addEventListener('load', () => {
  if ('launchParams' in window) {
    if (!launchParams.files.length) return;

    const handler = launchParams.files[0];
    openFiles(handler, code, state);
  }
});

// if ('launchQueue' in window) {
//   launchQueue.setConsumer(launchParams => {
//     if (!launchParams.files.length) return;

//     console.log(launchParams.fileHandles);

//     const handler = launchParams.fileHandles[0];
//     openFile(handler, code, state);
//   });
// }

/**
 * Builds the HTML for a tree view
 *
 * @param {array} tree - Array of tree leaves
 * @param {DOM} html - HTML fragment
 *
 * @return {DOM} - HTML fragment
 */
function buildTreeView(tree, html = document.createElement('ul')) {
  html.classList.add('tree');
  tree.forEach(leaf => {
    const wrapper = document.createElement('li');
    if (leaf.isDirectory === false) {
      wrapper.innerHTML = `<button class="tree--file"><svg class="tree--icon"><use xlink:href="#file" /></svg><span>${leaf.name}</span></button>`;
      wrapper.querySelector('button').addEventListener('click', openFile(leaf.file, code, state));
    } else {
      wrapper.innerHTML = `<button class="tree--folder" data-state="open"><svg class="tree--icon"><use xlink:href="#open-folder" /></svg><span>${leaf.name}</span></button>`;
      wrapper.querySelector('button').addEventListener('click', toggleTree);
      wrapper.appendChild(buildTreeView(leaf.items));
    }

    html.appendChild(wrapper);
  });
  return html;
}

/**
 * Toggles a tree view
 * @param {Event} e - JavaScript Event
 */
function toggleTree(e) {
  const target = e.target.closest('button');
  const icon = target.querySelector('use');
  const state = icon.getAttribute('xlink:href');
  if (state === '#open-folder') {
    icon.setAttribute('xlink:href', '#closed-folder');
  } else {
    icon.setAttribute('xlink:href', '#open-folder');
  }
  target.nextSibling.classList.toggle('tree--CLOSED');
}

// eslint-disable-next-line no-constant-condition
if ('serviceWorker' in navigator && PRODUCTION) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      log('Service Worker registered! 😎');
      log(registration);
    } catch (e) {
      log('Registration failed 😫');
      log(e);
    }
  });
}
