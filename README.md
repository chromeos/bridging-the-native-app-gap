# Bridging the Native App Gap

Supporting code for Chrome Dev Summit 2019 talk [Bridging the Native App Gap](https://developer.chrome.com/devsummit/sessions/bridging-the-native-app-gap/)

## Fugu Journal

Fugu Journal users to share images, video, and audio from devices and browsers that have [Web Share Target v2 API](https://developers.google.com/web/updates/2018/12/web-share-target) into it if it's installed as a PWA to their devices, use the device's native share sheet to share items out again using [Web Share API](https://developers.google.com/web/updates/2016/09/navigator-share), and allows them to collaborate with friends by picking them from their address book using the [Contact Picker API](https://web.dev/contact-picker/).

As a demonstration app, all items shared into it are only stored locally on device using the PWA's service worker cache, and contacts are only displayed when chosen, they likewise aren't uploaded or used anywhere else.

## Fugu Edit

Fugu Edit uses the [Native File System API](https://web.dev/native-file-system/) to allow users to open files and folders into a syntax highlighted text editor and save them again. This differs from the traditional upload, edit, and download in that it's working against the files directly on the hard drive. If installed and on a supported device (may need to enable the **File Handler API** in **chrome://flags**), it also allows users to open files directly from their file system into it using the [File Handler API](https://github.com/WICG/file-handling)
