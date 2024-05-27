var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _editing, _contentTransitioning, _execCommand, _getStringLitCleaned, getStringLitCleaned_fn, _mountAll, mountAll_fn, _addOuterStylesToMatchSurroundings, addOuterStylesToMatchSurroundings_fn, _setCollapseExpandButtonsListeners, setCollapseExpandButtonsListeners_fn, _setContentListeners, setContentListeners_fn, _openLinkNewTab, openLinkNewTab_fn, _editExistingLink, editExistingLink_fn, _setContentStyle, setContentStyle_fn, _setToolbarEvents, setToolbarEvents_fn, _setEditorEvents, setEditorEvents_fn, _toolbarItemAwarenessOfCurrentCommand, toolbarItemAwarenessOfCurrentCommand_fn, _createAndMountToolbar, createAndMountToolbar_fn, _setToolbarWidth, setToolbarWidth_fn, _getEditorWidth, getEditorWidth_fn, _editingMode, editingMode_fn, _readingMode, readingMode_fn, _showButton, showButton_fn, _hasMoreTextToScroll, hasMoreTextToScroll_fn, _hideFooterButtons, hideFooterButtons_fn;
import { g as getMaxZIndex, I as ITMBaseElement, i, r, y } from "./itm-common-components.0bfe1951.js";
const BEFORE_END = "beforeend";
const TOOLBAR_ITEM = "U89WWg__toolbar-item";
const TOOLBAR_ITEM_SELECT = "U89WWg__toolbar-item-select";
const TOOLBAR_ITEM_INPUT = "U89WWg__toolbar-item-input";
const createOption = (value, text, selected) => {
  const option = document.createElement("option");
  option.innerText = text;
  if (value) {
    option.setAttribute("value", value);
  }
  if (selected) {
    option.setAttribute("selected", selected);
  }
  return option;
};
const createSelect = (commandId, title, options, execCommand) => {
  const select = document.createElement("select");
  select.dataset.commandId = commandId;
  select.className = TOOLBAR_ITEM;
  select.classList.add(TOOLBAR_ITEM_SELECT);
  select.title = title;
  select.addEventListener(
    "change",
    (e) => execCommand(commandId, e.target.options[e.target.selectedIndex].value)
  );
  for (const option of options) {
    select.insertAdjacentElement(
      BEFORE_END,
      createOption(option.value, option.text, option.selected)
    );
  }
  return select;
};
const createLinkPopup = (textToLink, toolbar, href, _t) => {
  return new Promise((resolve, reject) => {
    if (textToLink.trim().length === 0) {
      console.log("No text selected");
      reject();
      return;
    }
    var popup = document.createElement("div");
    const popupWidth = 350;
    popup.style.width = `${popupWidth}px`;
    popup.id = "linkPopup-zpVoaw";
    popup.style.position = "fixed";
    popup.style.zIndex = getMaxZIndex() + 1;
    popup.classList.add("link-popup");
    var text = document.createElement("span");
    text.classList.add("link-popup-text");
    var textText = document.createElement("span");
    textText.innerHTML = _t("textToLink") + ":&nbsp;";
    text.appendChild(textText);
    var selectedTextSpan = document.createElement("span");
    selectedTextSpan.classList.add("link-popup-selected-text");
    selectedTextSpan.innerHTML = textToLink.substring(0, 50) + (textToLink.length > 50 ? "..." : "");
    text.appendChild(selectedTextSpan);
    popup.appendChild(text);
    var linkInput = document.createElement("input");
    linkInput.type = "text";
    linkInput.classList.add("link-popup-input");
    linkInput.style.marginTop = "10px";
    linkInput.style.marginBottom = "10px";
    linkInput.placeholder = _t("linkPlaceholder");
    if (href) {
      linkInput.value = href;
    } else {
      var linkRegex = /((http|https|ftp):\/\/)?(www.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/g;
      var match = textToLink.match(linkRegex);
      if (match && match.length > 0) {
        linkInput.value = match[0];
      }
    }
    popup.appendChild(linkInput);
    var buttonWrapper = document.createElement("div");
    buttonWrapper.style.display = "flex";
    buttonWrapper.id = "buttonWrapper";
    buttonWrapper.style.justifyContent = "flex-end";
    var okButton = document.createElement("itm-button");
    okButton.innerHTML = _t("ok");
    okButton.id = "okButton";
    okButton.style.marginLeft = ".2em";
    okButton.type = "primary";
    okButton.size = "small";
    okButton.addEventListener("click", function() {
      var link = formatURL(linkInput.value);
      if (link) {
        link = sanitizeLink(link);
        popup.remove();
        resolve(link);
      } else {
        resolve(null);
      }
    });
    buttonWrapper.appendChild(okButton);
    var cancelButton = document.createElement("itm-button");
    cancelButton.innerHTML = _t("cancel");
    cancelButton.style.marginLeft = ".2em";
    cancelButton.type = "secondary";
    cancelButton.size = "small";
    cancelButton.addEventListener("click", function() {
      popup.remove();
      reject();
    });
    buttonWrapper.appendChild(cancelButton);
    if (href) {
      var removeButton = document.createElement("itm-button");
      removeButton.innerHTML = _t("removeLink");
      removeButton.id = "removeButton";
      removeButton.style.marginLeft = ".2em";
      removeButton.type = "secondary";
      removeButton.size = "small";
      removeButton.addEventListener("click", function() {
        popup.remove();
        resolve(null);
      });
      buttonWrapper.appendChild(removeButton);
    }
    popup.appendChild(buttonWrapper);
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        popup.remove();
        reject();
      }
    });
    toolbar.appendChild(popup);
    linkInput.focus();
  });
};
const formatURL = (url) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return "https://" + url;
};
function sanitizeLink(link) {
  link = link.trim();
  return link;
}
const createButton = (commandId, title, children, execCommand, editor, _t) => {
  const button = document.createElement("button");
  button.dataset.commandId = commandId;
  button.className = TOOLBAR_ITEM;
  button.title = title;
  button.type = "button";
  button.insertAdjacentElement(BEFORE_END, children);
  if (commandId === "createLink") {
    onClickPopupInputFormToGetLink(button, editor, execCommand, commandId, _t);
  } else {
    button.addEventListener("click", () => execCommand(commandId));
  }
  return button;
};
function onClickPopupInputFormToGetLink(button, editor, execCommand, commandId, _t) {
  button.addEventListener("click", () => {
    let selectedText = editor.shadowRoot.getSelection().toString();
    if (selectedText === "") {
      return;
    }
    var range = editor.shadowRoot.getSelection().getRangeAt(0);
    if (selectedText.endsWith(" ")) {
      selectedText = selectedText.substring(0, selectedText.length - 1);
      range.setEnd(range.endContainer, range.endOffset - 1);
    }
    createLinkPopup(selectedText, button.parentElement, null, _t).then((url) => {
      createAnchor();
      function createAnchor() {
        editor.shadowRoot.getSelection().removeAllRanges();
        editor.shadowRoot.getSelection().addRange(range);
        execCommand(commandId, url);
        execCommand("insertHTML", `<a href="${url}" title="${url}">${selectedText}</a>`);
        editor.shadowRoot.getSelection().removeAllRanges();
      }
    }).catch((err) => {
    });
  });
}
const icons = {
  bold: {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 64C0 46.3 14.3 32 32 32H80 96 224c70.7 0 128 57.3 128 128c0 31.3-11.3 60.1-30 82.3c37.1 22.4 62 63.1 62 109.7c0 70.7-57.3 128-128 128H96 80 32c-17.7 0-32-14.3-32-32s14.3-32 32-32H48V256 96H32C14.3 96 0 81.7 0 64zM224 224c35.3 0 64-28.7 64-64s-28.7-64-64-64H112V224H224zM112 288V416H256c35.3 0 64-28.7 64-64s-28.7-64-64-64H224 112z"/></svg>',
    tooltip: { en: "bold", es: "negrita", pt: "negrito" }
  },
  italic: {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M128 64c0-17.7 14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H293.3L160 416h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H90.7L224 96H160c-17.7 0-32-14.3-32-32z"/></svg>',
    tooltip: { en: "italic", es: "cursiva", pt: "it\xE1lico" }
  },
  underline: {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M16 64c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H128V224c0 53 43 96 96 96s96-43 96-96V96H304c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H384V224c0 88.4-71.6 160-160 160s-160-71.6-160-160V96H48C30.3 96 16 81.7 16 64zM0 448c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32z"/></svg>',
    tooltip: { en: "underline", es: "subrayado", pt: "sublinhado" }
  },
  link: {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>',
    tooltip: { en: "link", es: "enlace", pt: "link" }
  },
  "align-left": {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M288 64c0 17.7-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32H256c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H256c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>',
    tooltip: { en: "align left", es: "alinear a la izquierda", pt: "alinhamento \xE0 esquerda" }
  },
  "align-center": {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M352 64c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32z"/></svg>',
    tooltip: { en: "align center", es: "alinear al centro", pt: "alinhamento ao centro" }
  },
  "align-right": {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M448 64c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>',
    tooltip: { en: "align right", es: "alinear a la derecha", pt: "alinhamento \xE0 direita" }
  },
  "list-ol": {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M24 56c0-13.3 10.7-24 24-24H80c13.3 0 24 10.7 24 24V176h16c13.3 0 24 10.7 24 24s-10.7 24-24 24H40c-13.3 0-24-10.7-24-24s10.7-24 24-24H56V80H48C34.7 80 24 69.3 24 56zM86.7 341.2c-6.5-7.4-18.3-6.9-24 1.2L51.5 357.9c-7.7 10.8-22.7 13.3-33.5 5.6s-13.3-22.7-5.6-33.5l11.1-15.6c23.7-33.2 72.3-35.6 99.2-4.9c21.3 24.4 20.8 60.9-1.1 84.7L86.8 432H120c13.3 0 24 10.7 24 24s-10.7 24-24 24H32c-9.5 0-18.2-5.6-22-14.4s-2.1-18.9 4.3-25.9l72-78c5.3-5.8 5.4-14.6 .3-20.5zM224 64H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>',
    tooltip: { en: "ordered list", es: "lista ordenada", pt: "lista ordenada" }
  },
  "list-ul": {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M64 144c26.5 0 48-21.5 48-48s-21.5-48-48-48S16 69.5 16 96s21.5 48 48 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm48-208c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48z"/></svg>',
    tooltip: { en: "unordered list", es: "lista desordenada", pt: "lista desordenada" }
  },
  outdent: {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M32 64c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32s-14.3 32-32 32H64C46.3 96 32 81.7 32 64zM224 192c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32zm32 96H448c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32s14.3-32 32-32zM32 448c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32s-14.3 32-32 32H64c-17.7 0-32-14.3-32-32zm.2-179.4c-8.2-6.4-8.2-18.9 0-25.3l101.9-79.3c10.5-8.2 25.8-.7 25.8 12.6V335.3c0 13.3-15.3 20.8-25.8 12.6L32.2 268.6z"/></svg>',
    tooltip: { en: "outdent", es: "sangr\xEDa", pt: "sangria" }
  },
  indent: {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 64C0 46.3 14.3 32 32 32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64zM192 192c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32zm32 96H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zM0 448c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM127.8 268.6L25.8 347.9C15.3 356.1 0 348.6 0 335.3V176.7c0-13.3 15.3-20.8 25.8-12.6l101.9 79.3c8.2 6.4 8.2 18.9 0 25.3z"/></svg>',
    tooltip: { en: "indent", es: "sangr\xEDa", pt: "sangria" }
  },
  eraser: {
    svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M264 479.1C263.4 479.1 262.7 480 262.1 480H153.9C134.8 480 116.5 472.4 103 458.9L31.03 386.9C2.912 358.8 2.912 313.2 31.03 285.1L253.1 63.03C281.2 34.91 326.8 34.91 354.9 63.03L480.1 189.1C509.1 217.2 509.1 262.8 480.1 290.9L339.9 432H488C501.3 432 512 442.7 512 456C512 469.3 501.3 480 488 480L264 479.1zM64.97 352.1L136.1 424.1C141.5 429.5 147.6 432 153.9 432H262.1C268.4 432 274.5 429.5 279 424.1L344 360L184 200L64.97 319C55.6 328.4 55.6 343.6 64.97 352.1zM31.03 285.1L64.97 319z"/></svg>',
    tooltip: { en: "eraser", es: "borrador", pt: "borrador" }
  }
};
const createIcon = (icon) => {
  try {
    var img = document.createElement("div");
    img.style.display = "flex";
    img.style.placeContent = "center";
    img.innerHTML = icons[icon].svgString;
    img.querySelector("svg").style.height = ".9em";
    return img;
  } catch (error) {
    console.log(error);
  }
};
const createInput = (commandId, title, type, execCommand) => {
  const input = document.createElement("input");
  input.dataset.commandId = commandId;
  input.className = TOOLBAR_ITEM;
  input.classList.add(TOOLBAR_ITEM_INPUT);
  input.title = title;
  input.type = type;
  input.addEventListener("input", (e) => {
    execCommand(commandId, e.target.value);
  });
  return input;
};
const createToolbar = (options, execCommand, editor, _t) => {
  const toolbar = editor.shadowRoot.getElementById("toolbar");
  toolbar.className = "U89WWg__toolbar";
  if (options.formatblock) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createSelect(
        "formatblock",
        _t("styles"),
        [
          { value: "p", text: "\xB6 Para.", selected: true },
          { value: "h1", text: "Header1" },
          { value: "h2", text: "Header2" },
          { value: "h3", text: "Header3" },
          { value: "pre", text: "</>" }
        ],
        execCommand
      )
    );
  }
  if (options.fontname) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createSelect(
        "fontname",
        _t("font"),
        [
          { value: "Lato, sans-serif", text: "Lato", selected: true },
          { value: "sans-serif", text: "Sans Serif" },
          { value: "serif", text: "Serif" },
          { value: "monospace", text: "Monospace" },
          { value: "tahoma", text: "Tahoma" },
          { value: "verdana", text: "Verdana" },
          { value: "consolas", text: "Consolas" }
        ],
        execCommand
      )
    );
  }
  if (options.bold) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton("bold", _t("bold"), createIcon("bold"), execCommand)
    );
  }
  if (options.italic) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton("italic", _t("italic"), createIcon("italic"), execCommand)
    );
  }
  if (options.underline) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton(
        "underline",
        _t("underline"),
        createIcon("underline"),
        execCommand
      )
    );
  }
  if (options.createLink) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton(
        "createLink",
        _t("createLink"),
        createIcon("link"),
        execCommand,
        editor,
        _t
      )
    );
  }
  if (options.forecolor) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createInput("forecolor", _t("textColor"), "color", execCommand)
    );
  }
  if (options.justifyleft) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton(
        "justifyleft",
        _t("alignLeft"),
        createIcon("align-left"),
        execCommand
      )
    );
  }
  if (options.justifycenter) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton(
        "justifycenter",
        _t("alignCenter"),
        createIcon("align-center"),
        execCommand
      )
    );
  }
  if (options.justifyright) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton(
        "justifyright",
        _t("alignRight"),
        createIcon("align-right"),
        execCommand
      )
    );
  }
  if (options.insertorderedlist) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton(
        "insertorderedlist",
        _t("numberedList"),
        createIcon("list-ol"),
        execCommand
      )
    );
  }
  if (options.insertunorderedlist) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton(
        "insertunorderedlist",
        _t("bulletedList"),
        createIcon("list-ul"),
        execCommand
      )
    );
  }
  if (options.outdent) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton(
        "outdent",
        _t("decreaseIndent"),
        createIcon("outdent"),
        execCommand
      )
    );
  }
  if (options.indent) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton(
        "indent",
        _t("increaseIndent"),
        createIcon("indent"),
        execCommand
      )
    );
  }
  if (options.removeFormat) {
    toolbar.insertAdjacentElement(
      BEFORE_END,
      createButton(
        "removeFormat",
        _t("clearFormatting"),
        createIcon("eraser"),
        execCommand
      )
    );
  }
  return toolbar;
};
const translations = {
  en: {
    bold: "Bold",
    textToLink: "Text",
    expand: "Expand",
    collapse: "Collapse",
    styles: "Styles",
    font: "Font",
    italic: "Italic",
    underline: "Underline",
    createLink: "Create Link",
    textColor: "Text Color",
    alignLeft: "Align Left",
    alignCenter: "Align Center",
    alignRight: "Align Right",
    alignJustify: "Align Justify",
    numberedList: "Numbered List",
    bulletedList: "Bulleted List",
    decreaseIndent: "Decrease Indent",
    increaseIndent: "Increase Indent",
    clearFormatting: "Clear Formatting",
    linkPlaceholder: "Enter a link",
    save: "Save",
    cancel: "Cancel",
    ok: "OK",
    removeLink: "Remove"
  },
  es: {
    bold: "Negrita",
    textToLink: "Texto",
    expand: "Expandir",
    collapse: "Colapsar",
    styles: "Estilos",
    font: "Fuente",
    italic: "It\xE1lica",
    underline: "Subrayado",
    createLink: "Crear Enlace",
    textColor: "Color de Texto",
    alignLeft: "Alinear Izquierda",
    alignCenter: "Alinear Centro",
    alignRight: "Alinear Derecha",
    alignJustify: "Alinear Justificar",
    numberedList: "Lista Numerada",
    bulletedList: "Lista con Vi\xF1etas",
    decreaseIndent: "Disminuir Sangr\xEDa",
    increaseIndent: "Aumentar Sangr\xEDa",
    clearFormatting: "Limpiar Formato",
    linkPlaceholder: "Introduzca un enlace",
    save: "Guardar",
    cancel: "Cancelar",
    ok: "OK",
    removeLink: "Eliminar"
  },
  pt: {
    bold: "Negrito",
    textToLink: "Texto",
    expand: "Expandir",
    collapse: "Colapsar",
    styles: "Estilos",
    font: "Fonte",
    italic: "It\xE1lico",
    underline: "Sublinhado",
    createLink: "Criar Link",
    textColor: "Cor do Texto",
    alignLeft: "Alinhar Esquerda",
    alignCenter: "Alinhar Centro",
    alignRight: "Alinhar Direita",
    alignJustify: "Alinhar Justificar",
    numberedList: "Lista Numerada",
    bulletedList: "Lista com Marcadores",
    decreaseIndent: "Diminuir Recuo",
    increaseIndent: "Aumentar Recuo",
    clearFormatting: "Limpar Formata\xE7\xE3o",
    linkPlaceholder: "Introduza um link",
    save: "Guardar",
    cancel: "Cancelar",
    ok: "OK",
    removeLink: "Remover"
  }
};
const rgbToHex = (color) => {
  try {
    const digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    const red = parseInt(digits[2]);
    const green = parseInt(digits[3]);
    const blue = parseInt(digits[4]);
    const rgb = blue | green << 8 | red << 16;
    return digits[1] + "#" + rgb.toString(16).padStart(6, "0");
  } catch (error) {
  }
};
const EDITOR_STYLES = {
  "collapsed-max-height": "280",
  "expanded-max-height": "10000",
  "font-size": "14"
};
class ITMEditor extends ITMBaseElement {
  constructor() {
    super();
    __privateAdd(this, _getStringLitCleaned);
    __privateAdd(this, _mountAll);
    __privateAdd(this, _addOuterStylesToMatchSurroundings);
    __privateAdd(this, _setCollapseExpandButtonsListeners);
    __privateAdd(this, _setContentListeners);
    __privateAdd(this, _openLinkNewTab);
    __privateAdd(this, _editExistingLink);
    __privateAdd(this, _setContentStyle);
    __privateAdd(this, _setToolbarEvents);
    __privateAdd(this, _setEditorEvents);
    __privateAdd(this, _toolbarItemAwarenessOfCurrentCommand);
    __privateAdd(this, _createAndMountToolbar);
    __privateAdd(this, _setToolbarWidth);
    __privateAdd(this, _getEditorWidth);
    __privateAdd(this, _editingMode);
    __privateAdd(this, _readingMode);
    __privateAdd(this, _showButton);
    __privateAdd(this, _hasMoreTextToScroll);
    __privateAdd(this, _hideFooterButtons);
    __privateAdd(this, _editing, false);
    __privateAdd(this, _contentTransitioning, false);
    __publicField(this, "originalValue", null);
    __publicField(this, "hasChanges", false);
    __privateAdd(this, _execCommand, (commandId, value) => {
      document.execCommand(commandId, false, value);
      this.focus();
    });
    this.toolbar = null;
    this.toolbarOptions = {
      formatblock: true,
      fontname: true,
      bold: true,
      italic: true,
      underline: true,
      createLink: true,
      forecolor: true,
      justifyleft: false,
      justifycenter: false,
      justifyright: false,
      insertorderedlist: true,
      insertunorderedlist: true,
      outdent: true,
      indent: true,
      removeFormat: true
    };
    this.translations = translations;
  }
  get value() {
    if (this.shadowRoot && this.shadowRoot.getElementById("content") != void 0) {
      const content = this.shadowRoot.getElementById("content");
      return __privateMethod(this, _getStringLitCleaned, getStringLitCleaned_fn).call(this, content.innerHTML);
    } else
      return "";
  }
  set value(value) {
    this.originalValue = __privateMethod(this, _getStringLitCleaned, getStringLitCleaned_fn).call(this, value);
    this.updateComplete.then(() => {
      this.shadowRoot.getElementById("content").innerHTML = value;
      this.updateSelection();
      this.commit();
    });
  }
  render() {
    const { readonly, node } = this;
    return y`
        <div id="component-host" class="component-host">
            <div class="header"></div>
            <div id="content" class="content" contenteditable=${readonly ? "false" : "true"}
            @input=${() => this.updateSelection()}>
            ${node}
            </div>
            <div class="footer">
                <itm-button class="footer-button expand-button" size="x-small">${this._t("expand")}</itm-button>
                <itm-button class="footer-button collapse-button" size="x-small" type="secondary">${this._t("collapse")}</itm-button>
            </div>
            <div id="toolbar"></div>
        </div>        
        `;
  }
  firstUpdated() {
    __privateMethod(this, _mountAll, mountAll_fn).call(this);
  }
  expandContent() {
    let maxHeight = EDITOR_STYLES["expanded-max-height"] + "px";
    this.shadowRoot.getElementById("content").style.maxHeight = maxHeight;
  }
  collapseContent() {
    this.shadowRoot.getElementById("content").style.maxHeight = `${EDITOR_STYLES["collapsed-max-height"]}px`;
  }
  updateSelection() {
    var _a;
    const shadowSelection = ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getSelection) ? this.shadowRoot.getSelection() : null;
    const selection = shadowSelection || document.getSelection() || window.getSelection();
    this.updateComplete.then(() => {
      __privateMethod(this, _showButton, showButton_fn).call(this);
    });
    if (this.originalValue != this.value) {
      this.hasChanges = true;
    } else {
      this.hasChanges = false;
    }
    if (this.hasChanges) {
      this.classList.add("dirty");
    } else {
      this.classList.remove("dirty");
    }
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: selection,
        bubbles: true,
        composed: true
      })
    );
  }
  commit() {
    try {
      this.hasChanges = false;
      this.originalValue = this.value;
      this.classList.remove("dirty");
    } catch (error) {
      console.error("Could not commit the changes", error);
    }
  }
}
_editing = new WeakMap();
_contentTransitioning = new WeakMap();
_execCommand = new WeakMap();
_getStringLitCleaned = new WeakSet();
getStringLitCleaned_fn = function(string) {
  let cleanContent = string.replace(/<!--\?lit.*-->/g, "").trim();
  cleanContent = cleanContent.replace(/[\n\r]/g, "").trim();
  return cleanContent;
};
_mountAll = new WeakSet();
mountAll_fn = function() {
  __privateGet(this, _execCommand).call(this, "defaultParagraphSeparator", "p");
  __privateMethod(this, _createAndMountToolbar, createAndMountToolbar_fn).call(this);
  const updateActiveState = (event) => {
    __privateMethod(this, _toolbarItemAwarenessOfCurrentCommand, toolbarItemAwarenessOfCurrentCommand_fn).call(this, event);
  };
  __privateMethod(this, _setEditorEvents, setEditorEvents_fn).call(this, updateActiveState);
  __privateMethod(this, _setToolbarEvents, setToolbarEvents_fn).call(this, updateActiveState);
  __privateMethod(this, _setToolbarWidth, setToolbarWidth_fn).call(this);
  const content = this.shadowRoot.getElementById("content");
  __privateMethod(this, _setContentListeners, setContentListeners_fn).call(this, content);
  __privateMethod(this, _setContentStyle, setContentStyle_fn).call(this, content);
  __privateMethod(this, _setCollapseExpandButtonsListeners, setCollapseExpandButtonsListeners_fn).call(this);
  __privateMethod(this, _addOuterStylesToMatchSurroundings, addOuterStylesToMatchSurroundings_fn).call(this);
};
_addOuterStylesToMatchSurroundings = new WeakSet();
addOuterStylesToMatchSurroundings_fn = function() {
  let bootstrapPaddingTop = document.querySelector(".control-label") == null ? this.style.paddingTop : window.getComputedStyle(document.querySelector(".control-label")).paddingTop;
  this.style.paddingTop = bootstrapPaddingTop;
};
_setCollapseExpandButtonsListeners = new WeakSet();
setCollapseExpandButtonsListeners_fn = function() {
  const expandButton = this.shadowRoot.querySelector(".expand-button");
  if (expandButton.eventListeners) {
    expandButton.removeEventListener("click", expandButton.eventListeners.click);
  }
  expandButton.addEventListener("click", () => {
    __privateMethod(this, _showButton, showButton_fn).call(this);
    this.expandContent();
  });
  const collapseButton = this.shadowRoot.querySelector(".collapse-button");
  if (collapseButton.eventListeners) {
    collapseButton.removeEventListener("click", collapseButton.eventListeners.click);
  }
  collapseButton.addEventListener("click", () => {
    __privateMethod(this, _showButton, showButton_fn).call(this);
    this.collapseContent();
  });
};
_setContentListeners = new WeakSet();
setContentListeners_fn = function(content) {
  if (content.eventListeners) {
    content.removeEventListener("mousedown", content.eventListeners.mousedown);
    content.removeEventListener("click", content.eventListeners.click);
    content.removeEventListener("blur", content.eventListeners.blur);
    content.removeEventListener("transitionstart", content.eventListeners.keydown);
    content.removeEventListener("transitionend", content.eventListeners.keydown);
  }
  content.addEventListener("mousedown", (ev) => {
    const MAIN_BUTTON = 0;
    if (ev.target.tagName === "A") {
      const mainClickedWhileReading = !__privateGet(this, _editing) && ev.button === MAIN_BUTTON;
      const mainClickedWhileEditing = __privateGet(this, _editing) && ev.button === MAIN_BUTTON;
      ev.preventDefault();
      if (mainClickedWhileReading) {
        __privateMethod(this, _openLinkNewTab, openLinkNewTab_fn).call(this, ev);
      } else if (mainClickedWhileEditing) {
        __privateMethod(this, _editExistingLink, editExistingLink_fn).call(this, ev);
      }
    }
  });
  content.addEventListener("click", () => {
    this.toolbar.style.display = "flex";
    __privateMethod(this, _editingMode, editingMode_fn).call(this);
  });
  content.addEventListener("blur", (e) => {
    if (e.relatedTarget === null || !this.toolbar.contains(e.relatedTarget)) {
      this.toolbar.style.display = "none";
      __privateMethod(this, _readingMode, readingMode_fn).call(this);
    }
  });
  content.addEventListener("transitionstart", () => {
    __privateSet(this, _contentTransitioning, true);
  });
  content.addEventListener("transitionend", () => {
    __privateSet(this, _contentTransitioning, false);
  });
};
_openLinkNewTab = new WeakSet();
openLinkNewTab_fn = function(ev) {
  window.open(ev.target.href, "_blank");
};
_editExistingLink = new WeakSet();
editExistingLink_fn = function(ev) {
  const editor = this;
  setSelectionWhereUserClicked(ev);
  const anchor = ev.target.closest("a");
  const href = anchor.getAttribute("href");
  let selectedText = editor.shadowRoot.getSelection().toString();
  var range = editor.shadowRoot.getSelection().getRangeAt(0);
  const self = this;
  createLinkPopup(selectedText, this.toolbar, href, this._t).then(function(url) {
    if (url === null || url === "") {
      removeAnchor();
    } else {
      createAnchor();
    }
    function createAnchor() {
      var _a;
      editor.shadowRoot.getSelection().removeAllRanges();
      editor.shadowRoot.getSelection().addRange(range);
      __privateGet(_a = self, _execCommand).call(_a, "createLink", url);
      const newAnchor = editor.shadowRoot.getSelection().anchorNode.parentElement;
      newAnchor.setAttribute("title", url);
      editor.shadowRoot.getSelection().removeAllRanges();
    }
    function removeAnchor() {
      const text = document.createTextNode(anchor.innerHTML);
      anchor.replaceWith(text);
    }
    editor.shadowRoot.getElementById("content").focus();
  }).catch((err) => {
    console.log("canceled editExistingLink", err);
  });
};
_setContentStyle = new WeakSet();
setContentStyle_fn = function(content) {
  content.style.maxHeight = EDITOR_STYLES["collapsed-max-height"] + "px";
  content.style.scrollbarGutter = "stable";
};
_setToolbarEvents = new WeakSet();
setToolbarEvents_fn = function(updateActiveState) {
  if (this.toolbar.eventListeners) {
    this.toolbar.removeEventListener("click", this.toolbar.eventListeners.click);
  }
  this.toolbar.addEventListener("click", updateActiveState);
};
_setEditorEvents = new WeakSet();
setEditorEvents_fn = function(updateActiveState) {
  const editor = this;
  if (editor.eventListeners) {
    editor.removeEventListener("keydown", editor.eventListeners.keydown);
    editor.removeEventListener("keyup", editor.eventListeners.keyup);
    editor.removeEventListener("click", editor.eventListeners.click);
  }
  editor.addEventListener("keydown", updateActiveState);
  editor.addEventListener("keyup", updateActiveState);
  editor.addEventListener("click", updateActiveState);
};
_toolbarItemAwarenessOfCurrentCommand = new WeakSet();
toolbarItemAwarenessOfCurrentCommand_fn = function(event) {
  const toolbarSelects = this.toolbar.querySelectorAll("select[data-command-id]");
  for (const select of toolbarSelects) {
    const value = document.queryCommandValue(select.dataset.commandId);
    const option = Array.from(select.options).find(
      (option2) => option2.value === value
    );
    select.selectedIndex = option ? option.index : -1;
  }
  const toolbarButtons = this.toolbar.querySelectorAll("button[data-command-id]");
  for (const button of toolbarButtons) {
    const active = document.queryCommandState(button.dataset.commandId);
    button.classList.toggle("active", active);
  }
  const inputButtons = this.toolbar.querySelectorAll("input[data-command-id]");
  for (const input of inputButtons) {
    const value = document.queryCommandValue(input.dataset.commandId);
    if (value) {
      input.value = rgbToHex(value);
    }
  }
};
_createAndMountToolbar = new WeakSet();
createAndMountToolbar_fn = function() {
  const editor = this;
  if (this.toolbar) {
    this.shadowRoot.removeChild(this.toolbar);
  }
  this.toolbar = createToolbar(this.toolbarOptions, __privateGet(this, _execCommand), editor, this._t);
};
_setToolbarWidth = new WeakSet();
setToolbarWidth_fn = function() {
  __privateMethod(this, _getEditorWidth, getEditorWidth_fn).call(this);
};
_getEditorWidth = new WeakSet();
getEditorWidth_fn = function() {
  let compStyles = window.getComputedStyle(this.shadowRoot.getElementById("component-host"));
  const editorWidth = this.shadowRoot.getElementById("component-host").clientWidth - parseFloat(compStyles.getPropertyValue("padding-left")) - parseFloat(compStyles.getPropertyValue("padding-right"));
  return editorWidth;
};
_editingMode = new WeakSet();
editingMode_fn = function() {
  __privateSet(this, _editing, true);
  this.shadowRoot.getElementById("content").style.overflowY = "auto";
  this.shadowRoot.getElementById("component-host").style.border = "1px solid var(--border-color-active)";
  this.shadowRoot.querySelector(".footer").classList.remove("footer-shadow");
  __privateMethod(this, _hideFooterButtons, hideFooterButtons_fn).call(this);
  this.toolbar.style.display = "flex";
};
_readingMode = new WeakSet();
readingMode_fn = function() {
  __privateSet(this, _editing, false);
  this.shadowRoot.getElementById("component-host").style.border = "";
  this.shadowRoot.getElementById("component-host").style.borderBottomColor = "var(--border-color-inactive)";
  this.shadowRoot.getElementById("content").style.overflowY = "hidden";
  this.shadowRoot.getElementById("content").scrollTop = 0;
  __privateMethod(this, _showButton, showButton_fn).call(this);
};
_showButton = new WeakSet();
showButton_fn = function() {
  this.updateComplete.then(async () => {
    let textOverflow = await __privateMethod(this, _hasMoreTextToScroll, hasMoreTextToScroll_fn).call(this, this.shadowRoot.getElementById("content"));
    let readingMode = !__privateGet(this, _editing);
    let expanded = parseInt(this.shadowRoot.getElementById("content").style.maxHeight) == EDITOR_STYLES["expanded-max-height"];
    if (readingMode) {
      if (!expanded) {
        this.shadowRoot.querySelector(".expand-button").style.display = textOverflow ? "block" : "none";
        this.shadowRoot.querySelector(".collapse-button").style.display = "none";
        if (textOverflow)
          this.shadowRoot.querySelector(".footer").classList.add("footer-shadow");
      } else {
        this.shadowRoot.querySelector(".expand-button").style.display = "none";
        this.shadowRoot.querySelector(".collapse-button").style.display = "block";
        this.shadowRoot.querySelector(".footer").classList.remove("footer-shadow");
      }
    } else {
      this.shadowRoot.querySelector(".footer").classList.remove("footer-shadow");
    }
  });
};
_hasMoreTextToScroll = new WeakSet();
hasMoreTextToScroll_fn = async function(element) {
  const waitForContentTransitioning = () => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const maxWaitTime = 1200;
      const checkContentTransitioning = () => {
        if (__privateGet(this, _contentTransitioning)) {
          if (Date.now() - startTime >= maxWaitTime) {
            reject(new Error(`Timed out waiting for contentTransitioning over ${maxWaitTime}ms`));
          } else {
            setTimeout(checkContentTransitioning, 50);
          }
        } else {
          resolve();
        }
      };
      setTimeout(checkContentTransitioning, 50);
    });
  };
  return await waitForContentTransitioning().then(() => {
    return element.scrollHeight > element.clientHeight;
  }).catch((error) => {
    console.warn(error);
    return true;
  });
};
_hideFooterButtons = new WeakSet();
hideFooterButtons_fn = function() {
  this.shadowRoot.querySelector(".collapse-button").style.display = "none";
  this.shadowRoot.querySelector(".expand-button").style.display = "none";
};
__publicField(ITMEditor, "properties", {
  value: { type: String },
  toolbarOptions: { type: Object }
});
__publicField(ITMEditor, "styles", i`
    :host {
        /*variables */
        --font-family: 'Lato', sans-serif;
        --content-font-family: 'Lato', sans-serif;
        --button-font-size: .8em;
        --text-btn-1: #fff;
        --bg-btn-1: #495d73;
        --bg-btn-1-disabled: #5e7083;
        --bg-btn-1-hover: #1E3E62;

        --text-btn-2: #495d73;
        --text-btn-2-disabled: #cacccf;
        --bg-btn-2: #fff;
        --bg-btn-2-hover: #edeff5;
        --border-btn-2: #a6aec1;
        --border-btn-2-disabled: #cacccf;

        --bg-reading-mode: #fff;
        --bg-editing-mode: #fff;

        --border-color-inactive: #c0c0c0;
        --border-color-active: #c1c1c1;

        --toolbar-button-size: 2em;

        --link-color: #488eff;

        --link-font-weight: 600;

        display:block;
        font-size:16px;
        
      }
        :host(:hover) {
            
        }
      .component-host {
    /* position */
        display: flex;
        flex-direction: column;
        height: 100%;
        padding:0.1em;
        
        border: solid 1px transparent;
        border-radius:4px 4px 0 0;
        border-bottom-color: var(--border-color-inactive);
      }
      .component-host:hover {
        border: solid 1px var(--border-color-inactive);
    }

      a {
        cursor: pointer;
        pointer-events:all;
        color: var(--link-color);
        font-weight: var(--link-font-weight);
        text-decoration-line: none;
      }

        a:hover {
            text-decoration-line: underline;
        }
      
      :focus {
        outline: none;
        background-color: var(--editing-mode-bg);
      }

      .header {
      }
      .content {
        flex: 1;
        min-height: 3em;
        padding: 0 0 0 .3em;
        overflow: hidden;
        color: #111;
        background-color: var(--bg-reading-mode);
        font-family: var(--content-font-family);
        font-size: ${r(EDITOR_STYLES["font-size"])}px;
        transition: max-height 0.8s ease-in-out;
      }

      .footer {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        background-color: var(--bg-reading-mode);
      }

      .footer-shadow {
        box-shadow: -1px -12px 12px 5px var(--bg-reading-mode);
        }

      .footer-button{
        display: none;
        margin:.3em;
        bottom: 0;
        right: 0;
      }

      .expand-button {
        display: none;
        }
        .collapse-button {
            display: none;
        }
        /* Link pop-up */
        .link-popup {
            display: flex;
            flex-direction: column;
            background-color: white;
            border: 1px solid var(--border-color-active);
            box-shadow: 0px 0px 9px 5px rgb(0 0 0 / 8%);
            border-radius: 4px;
            padding: 10px;
            cursor: default;
        }

        .link-popup-text {
            display: flex;
            align-self:left;
            font-size: 0.9em;
        }

        .link-popup-selected-text {
            color: var(--link-color);
        }

        .link-popup-input {
            border: solid 1px var(--border-color-inactive);
            border-radius: 3px;
            padding: 0.2em;
        }
        .link-popup-input:focus {
            border: solid 1px var(--border-color-active);
        }
        /* toolbar */
        .U89WWg__toolbar {
            display: none;
            justify-content: center;
            /* border: solid 1px var(--border-color-active);
            border-top-color: transparent;
            border-radius: 0 0 4px 4px; */
            padding: 0.1em;
            background-color: var(--bg-reading-mode);
            /* position: fixed; */
            }

            .U89WWg__toolbar-item {
            background: #ffffff;
            border: solid 1px #eeeeee;
            border-radius: 2px;
            cursor: pointer;
            margin-right: 2px;
            margin-top: 2px;
            height: var(--toolbar-button-size);
            width: var(--toolbar-button-size);
            padding: 2px;
            }

            .U89WWg__toolbar-item-select{
            flex-grow: 1;
            max-width: 7em;
            }

            .U89WWg__toolbar-item-input{
            height: var(--toolbar-button-size);
            width: var(--toolbar-button-size);
            }

            .U89WWg__toolbar-item:hover,
            .U89WWg__toolbar-item.active {
            background: #f0f0f0;
            }

            .U89WWg__toolbar-separator {
            border-left: solid 1px #e0e0e0;
            margin-right: 2px;
            }

            .U89WWg__toolbar-separator:last-child {
            display: none;
            }


        `);
function setSelectionWhereUserClicked(ev) {
  const range = document.createRange();
  range.selectNode(ev.target);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
}
export {
  ITMEditor
};
