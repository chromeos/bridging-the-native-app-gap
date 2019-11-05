<script context="module">
  export const href = "/invite";
  export const mimePrefix = "text/";
  export const mimeRoute = { href, mimePrefix };
  export const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path d="M9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H3v-.99C3.2 16.29 6.3 15 9 15s5.8 1.29 6 2v1zm3-4v-3h-3V9h3V6h2v3h3v2h-3v3h-2z"/></svg>';
  export const text = "Invite";
  export const title = "Invite friends to Fugu Journal.";
  export const email =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.8 2L12 10.8 4.8 6h14.4zM4 18V7.87l8 5.33 8-5.33V18H4z"/></svg>';
  export const phone =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.01 14.46l-2.62 2.62a16.141 16.141 0 01-6.5-6.5l2.62-2.62a.98.98 0 00.27-.9L9.13 3.8c-.09-.46-.5-.8-.98-.8H4c-.56 0-1.03.47-1 1.03a17.92 17.92 0 002.43 8.01 18.08 18.08 0 006.5 6.5 17.92 17.92 0 008.01 2.43c.56.03 1.03-.44 1.03-1v-4.15c0-.48-.34-.89-.8-.98l-3.26-.65a.99.99 0 00-.9.27z"/></svg>';
  export const closed =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41z"/><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>';
  export const send =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path d="M2 3v18l20-9L2 3zm2 11l9-2-9-2V6.09L17.13 12 4 17.91V14z"/></svg>';
</script>

<script>
  import { fade } from "svelte/transition";
  import { fadeConfig } from "../../js/constants";

  const supported = "contacts" in navigator && "ContactsManager" in window;
  // const supported = true;

  let contacts = []; // name: [], email: [], tel: []
  let error = false;
  let displayed = {};

  async function contactPicker() {
    error = false;
    const props = ["name", "email", "tel"];
    const opts = { multiple: true };
    try {
      const selected = await navigator.contacts.select(props, opts);
      console.log(selected);
      contacts = selected.filter(c => c.email.length || c.tel.length);
    } catch (e) {
      console.error(e);
      error = true;
    }
  }

  function removeContact(i) {
    return function remove() {
      contacts.splice(i, 1);
      contacts = contacts;
      displayed = {};
    };
  }

  function displayContact(i) {
    return function() {
      displayed = contacts[i];
    };
  }

  function clearContacts() {
    contacts = [];
  }
</script>

<style>
  .holder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .invite {
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

  .remove,
  .icon {
    height: 1.25em;
    width: 1.25em;
    font-size: 1em;
    padding: 0;
    background: none;
    border: 0;
  }

  .contacts {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .contact {
    display: grid;
    grid-template-columns: auto 1fr 1.5em;
    background: var(--secondary-color);
    fill: var(--background-color);
    border-radius: 1em;
    padding: 0.5em 1em;
    grid-gap: 1em;
    flex-grow: 0;
    margin-bottom: 1em;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  .name {
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--background-color);
  }

  .remove {
    grid-column: 3 / span 1;
    grid-row: 1 / span 1;
    cursor: pointer;
  }

  .icons {
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon:first-of-type:not(:last-of-type) {
    margin-right: 0.5em;
  }

  /* .contact {
    display: grid;
    height: 2em;
  } */
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
<div class="holder" in:fade={fadeConfig}>
  {#if supported}
    {#if contacts.length === 0}
      <button class="invite" on:click={contactPicker}>
        {@html svg}
        <span>Invite Friends</span>
      </button>
    {:else}
      <p>
        Tap a contact to verify their email address and/or phone number.
        Pressing the
        <strong>send invite</strong>
        button will clear the contacts. No messages will be sent.
      </p>
      <div class="contacts">
        {#each contacts as contact, i}
          <div class="contact" on:click={displayContact(i)}>
            {#if contact.name.length}
              <span class="name">{contact.name[0]}</span>
            {:else if contact.email.length}
              <span class="name">{contact.email[0]}</span>
            {:else}
              <span class="name">{contact.tel[0]}</span>
            {/if}
            <button class="remove" on:click={removeContact(i)}>
              {@html closed}
            </button>
            <div class="icons">
              {#if contact.email.length}
                <span class="icon" aria-label="Email: {contact.email}">
                  {@html email}
                </span>
              {/if}
              {#if contact.tel.length}
                <span class="icon" aria-label="Telephone: {contact.tel}">
                  {@html phone}
                </span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
      {#if displayed}
        <dl>
          {#each Object.keys(displayed) as key}
            {#if displayed[key].length}
              <dt>{key}</dt>
              <dd>{displayed[key].join(', ')}</dd>
            {/if}
          {/each}
        </dl>
      {/if}
      <button class="invite" on:click={clearContacts}>
        {@html send}
        <span>Send Invite</span>
      </button>
      {#if error}
        <h2>There was an error picking contacts</h2>
      {/if}
    {/if}
  {:else}
    <h2>Contact Picker not supported :(</h2>
  {/if}
</div>

<!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 16c-.79 0-1.5.31-2.03.81L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.53.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.48.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.05 4.12c-.05.22-.09.45-.09.69 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3zm0-12c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg> -->
