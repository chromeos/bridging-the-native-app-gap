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

import { log } from './log';
/**
 * Opens a single file
 *
 * @param {CodeMirror} code - CodeMirror object
 * @param {object} state = State of the world
 *
 * @return {FileHandler} - handler for a file
 */
export async function selectFile(code, state) {
  try {
    const handler = await window.chooseFileSystemEntries();

    await openFile(handler, code, state)();

    return handler;
  } catch (e) {
    throw new Error(e);
  }
}

/**
 * Opens a directory
 *
 * @param {CodeMirror} code - CodeMirror object
 */
export async function selectFolder(code) {
  try {
    const handler = await window.chooseFileSystemEntries({
      type: 'openDirectory',
    });

    const tree = [
      {
        name: handler.name,
        isDirectory: handler.isDirectory,
        items: await walkFolder(handler),
      },
    ];

    code.setValue('');

    return tree;
  } catch (e) {
    throw new Error(e);
  }
}

/**
 * Opens a file for display
 *
 * @param {FileHandler} handler - File Handler
 * @param {CodeMirror} code - CodeMirror instance
 * @param {object} state = State of the world
 *
 * @return {string|DOMElement} - Returns a string if the file is text, or a DOM element to be inserted
 */
export function openFile(handler, code, state) {
  return async function(e = {}) {
    // Reset Target
    if ('target' in e) {
      const target = e.target.closest('button');
      const active = document.querySelector('.tree button[data-active]');
      if (active) {
        active.removeAttribute('data-active');
      }
      target.setAttribute('data-active', true);
    }
    // Reset Preview
    const preview = document.querySelector('.editor--preview');
    preview.innerHTML = '';
    preview.removeAttribute('data-preview');

    const file = await handler.getFile();
    log(file);
    if (validTextFile(file)) {
      const text = await file.text();
      code.setValue(text);
      code.setOption('mode', { name: 'yaml-frontmatter', base: findMode(file) });
      state.current = handler;
      return handler;
    }

    preview.setAttribute('data-preview', true);

    const display = document.createElement('div');
    let innerHTML = '';

    if (file.type.indexOf('image/') === 0) {
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      const url = window.URL.createObjectURL(blob);
      innerHTML += `<img src="${url.toString()}" alt="${file.name}">`;
    }

    innerHTML += `<h2>${file.name}</h2><p>Size: ${(file.size * 0.001).toFixed(3)}KB</p><p>Type: ${file.type}</p><p>Last Modified: ${file.lastModified}</p>`;
    display.innerHTML = innerHTML;
    display.classList.add('unloaded-item');

    preview.setAttribute('data-preview', true);
    preview.appendChild(display);
    state.current = null;
    return null;
  };
}

/**
 * Determines if the file is a known valid text file
 *
 * @param {FileHandler} file - File handler
 *
 * @return {boolean}
 */
export function validTextFile(file) {
  if (file.type.indexOf('text/') === 0 || file.type === 'application/json') {
    return true;
  }

  let ext = file.name.split('.');
  ext = ext[ext.length - 1];

  const extensions = ['scss', 'sass', 'md'];
  const filenames = ['LICENSE'];

  return extensions.indexOf(ext) >= 0 || filenames.indexOf(file.name) >= 0;
}

/**
 * Determines if the file is a known valid text file
 *
 * @param {FileHandler} file - File handler
 *
 * @return {boolean}
 */
export function findMode(file) {
  const modes = {
    html: 'htmlmixed',
    sass: 'text/x-scss',
    scss: 'text/x-scss',
    md: 'markdown',
    javascript: 'javascript',
    json: 'javascript',
  };

  if (file.type.indexOf('text/') === 0) {
    const mode = modes[file.type.replace('text/', '')];
    if (mode) return mode;

    return 'markdown';
  }

  if (file.type === 'application/json') return 'javascript';

  let ext = file.name.split('.');
  ext = ext[ext.length - 1];

  const mode = modes[ext];

  if (mode) return mode;

  return 'markdown';
}

/**
 * Walks
 *
 * @param {DirectoryHandler} dir - Handler
 * @param {object} path - Path object
 */
export async function walkFolder(dir, path = []) {
  const list = [];
  path.push(dir.name);
  for await (const handler of dir.getEntries()) {
    const file = {
      name: handler.name,
      isDirectory: handler.isDirectory,
    };

    if (handler.isFile) {
      file.file = handler;
    } else {
      file.items = await walkFolder(handler, path);
    }

    if (file.name !== '.DS_Store') {
      list.push(file);
    }
  }

  path.splice(-1, 1);

  return list;
}

/**
 * Writes contents to disk
 *
 * @param {FileHandler} handler - File handler to use
 * @param {string} contents - String contents to write
 */
export async function writeFile(handler, contents) {
  // Create a writer
  const writer = await handler.createWriter();
  // Make sure we start with an empty file
  await writer.truncate(0);
  // Write the full length of the contents
  await writer.write(0, contents);
  // Close the file and write the contents to disk
  await writer.close();
}
