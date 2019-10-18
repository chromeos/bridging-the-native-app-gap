<script context="module">
  export const href = "/invite";
  export const mimePrefix = "text/";
  export const mimeRoute = { href, mimePrefix };
  export const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path d="M9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H3v-.99C3.2 16.29 6.3 15 9 15s5.8 1.29 6 2v1zm3-4v-3h-3V9h3V6h2v3h3v2h-3v3h-2z"/></svg>';
  export const text = "Invite";
  export const title = "Invite friends to Fugu Journal.";
</script>

<script>
  import { fade } from "svelte/transition";
  import { fadeConfig } from "../../js/constants";

  const supported = "contacts" in navigator && "ContactsManager" in window;

  let contacts = []; // name: [], email: [], tel: []
  let error = false;

  async function contactPicker() {
    error = false;
    const props = ["name", "email", "tel"];
    const opts = { multiple: true };
    try {
      contacts = await navigator.contacts.select(props, opts);
    } catch (e) {
      console.error(e);
      error = true;
    }
  }
</script>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 0;
    transform: scale(2);
    font-size: 1.5em;
    background: var(--secondary-color);
    color: var(--background-color);
    fill: var(--background-color);
    border-radius: 5px;
  }

  button span {
    margin-left: 0.5em;
  }
</style>

<!--
Copyright 2019 Google, Inc.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License");
you may not use this file except in compliance with the License. You may
obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
<div in:fade={fadeConfig}>
  <h2>Contacts</h2>
  {JSON.stringify(contacts)}
  <hr />
  {#if supported}
    {#if contacts.length === 0}
      <button on:click={contactPicker}>
        {@html svg}
        <span>Invite Friends</span>
      </button>
    {:else}
      {#each contacts as contact}
        <p>{contact.name} - {contact.email}</p>
      {/each}
      {#if error}
        <h2>There was an error picking contacts</h2>
      {/if}
    {/if}
  {:else}
    <h2>Contact Picker not supported :(</h2>
  {/if}
</div>

<!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 16c-.79 0-1.5.31-2.03.81L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.53.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.48.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.05 4.12c-.05.22-.09.45-.09.69 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3zm0-12c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg> -->
