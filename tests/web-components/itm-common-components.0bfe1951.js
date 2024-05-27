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
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _setInitialLanguage, setInitialLanguage_fn;
const getMaxZIndex = () => {
  return Math.max(
    ...Array.from(
      document.querySelectorAll("body *"),
      (el) => parseFloat(window.getComputedStyle(el).zIndex)
    ).filter((zIndex) => !Number.isNaN(zIndex)),
    0
  );
};
const getVersion = () => {
  return "1.0.2";
};
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = window, e$2 = t$1.ShadowRoot && (void 0 === t$1.ShadyCSS || t$1.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$3 = Symbol(), n$3 = /* @__PURE__ */ new WeakMap();
class o$3 {
  constructor(t2, e2, n2) {
    if (this._$cssResult$ = true, n2 !== s$3)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$2 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = n$3.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && n$3.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
}
const r$2 = (t2) => new o$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$3), i$1 = (t2, ...e2) => {
  const n2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, n3) => e3 + ((t3) => {
    if (true === t3._$cssResult$)
      return t3.cssText;
    if ("number" == typeof t3)
      return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[n3 + 1], t2[0]);
  return new o$3(n2, t2, s$3);
}, S$1 = (s2, n2) => {
  e$2 ? s2.adoptedStyleSheets = n2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet) : n2.forEach((e2) => {
    const n3 = document.createElement("style"), o2 = t$1.litNonce;
    void 0 !== o2 && n3.setAttribute("nonce", o2), n3.textContent = e2.cssText, s2.appendChild(n3);
  });
}, c$1 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules)
    e2 += s2.cssText;
  return r$2(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var s$2;
const e$1 = window, r$1 = e$1.trustedTypes, h$1 = r$1 ? r$1.emptyScript : "", o$2 = e$1.reactiveElementPolyfillSupport, n$2 = { toAttribute(t2, i2) {
  switch (i2) {
    case Boolean:
      t2 = t2 ? h$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, i2) {
  let s2 = t2;
  switch (i2) {
    case Boolean:
      s2 = null !== t2;
      break;
    case Number:
      s2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        s2 = JSON.parse(t2);
      } catch (t3) {
        s2 = null;
      }
  }
  return s2;
} }, a$1 = (t2, i2) => i2 !== t2 && (i2 == i2 || t2 == t2), l$2 = { attribute: true, type: String, converter: n$2, reflect: false, hasChanged: a$1 };
class d$1 extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this.u();
  }
  static addInitializer(t2) {
    var i2;
    this.finalize(), (null !== (i2 = this.h) && void 0 !== i2 ? i2 : this.h = []).push(t2);
  }
  static get observedAttributes() {
    this.finalize();
    const t2 = [];
    return this.elementProperties.forEach((i2, s2) => {
      const e2 = this._$Ep(s2, i2);
      void 0 !== e2 && (this._$Ev.set(e2, s2), t2.push(e2));
    }), t2;
  }
  static createProperty(t2, i2 = l$2) {
    if (i2.state && (i2.attribute = false), this.finalize(), this.elementProperties.set(t2, i2), !i2.noAccessor && !this.prototype.hasOwnProperty(t2)) {
      const s2 = "symbol" == typeof t2 ? Symbol() : "__" + t2, e2 = this.getPropertyDescriptor(t2, s2, i2);
      void 0 !== e2 && Object.defineProperty(this.prototype, t2, e2);
    }
  }
  static getPropertyDescriptor(t2, i2, s2) {
    return { get() {
      return this[i2];
    }, set(e2) {
      const r2 = this[t2];
      this[i2] = e2, this.requestUpdate(t2, r2, s2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) || l$2;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t2 = Object.getPrototypeOf(this);
    if (t2.finalize(), void 0 !== t2.h && (this.h = [...t2.h]), this.elementProperties = new Map(t2.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t3 = this.properties, i2 = [...Object.getOwnPropertyNames(t3), ...Object.getOwnPropertySymbols(t3)];
      for (const s2 of i2)
        this.createProperty(s2, t3[s2]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i2) {
    const s2 = [];
    if (Array.isArray(i2)) {
      const e2 = new Set(i2.flat(1 / 0).reverse());
      for (const i3 of e2)
        s2.unshift(c$1(i3));
    } else
      void 0 !== i2 && s2.push(c$1(i2));
    return s2;
  }
  static _$Ep(t2, i2) {
    const s2 = i2.attribute;
    return false === s2 ? void 0 : "string" == typeof s2 ? s2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  u() {
    var t2;
    this._$E_ = new Promise((t3) => this.enableUpdating = t3), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t2 = this.constructor.h) || void 0 === t2 || t2.forEach((t3) => t3(this));
  }
  addController(t2) {
    var i2, s2;
    (null !== (i2 = this._$ES) && void 0 !== i2 ? i2 : this._$ES = []).push(t2), void 0 !== this.renderRoot && this.isConnected && (null === (s2 = t2.hostConnected) || void 0 === s2 || s2.call(t2));
  }
  removeController(t2) {
    var i2;
    null === (i2 = this._$ES) || void 0 === i2 || i2.splice(this._$ES.indexOf(t2) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t2, i2) => {
      this.hasOwnProperty(i2) && (this._$Ei.set(i2, this[i2]), delete this[i2]);
    });
  }
  createRenderRoot() {
    var t2;
    const s2 = null !== (t2 = this.shadowRoot) && void 0 !== t2 ? t2 : this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(s2, this.constructor.elementStyles), s2;
  }
  connectedCallback() {
    var t2;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t2 = this._$ES) || void 0 === t2 || t2.forEach((t3) => {
      var i2;
      return null === (i2 = t3.hostConnected) || void 0 === i2 ? void 0 : i2.call(t3);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var t2;
    null === (t2 = this._$ES) || void 0 === t2 || t2.forEach((t3) => {
      var i2;
      return null === (i2 = t3.hostDisconnected) || void 0 === i2 ? void 0 : i2.call(t3);
    });
  }
  attributeChangedCallback(t2, i2, s2) {
    this._$AK(t2, s2);
  }
  _$EO(t2, i2, s2 = l$2) {
    var e2;
    const r2 = this.constructor._$Ep(t2, s2);
    if (void 0 !== r2 && true === s2.reflect) {
      const h2 = (void 0 !== (null === (e2 = s2.converter) || void 0 === e2 ? void 0 : e2.toAttribute) ? s2.converter : n$2).toAttribute(i2, s2.type);
      this._$El = t2, null == h2 ? this.removeAttribute(r2) : this.setAttribute(r2, h2), this._$El = null;
    }
  }
  _$AK(t2, i2) {
    var s2;
    const e2 = this.constructor, r2 = e2._$Ev.get(t2);
    if (void 0 !== r2 && this._$El !== r2) {
      const t3 = e2.getPropertyOptions(r2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== (null === (s2 = t3.converter) || void 0 === s2 ? void 0 : s2.fromAttribute) ? t3.converter : n$2;
      this._$El = r2, this[r2] = h2.fromAttribute(i2, t3.type), this._$El = null;
    }
  }
  requestUpdate(t2, i2, s2) {
    let e2 = true;
    void 0 !== t2 && (((s2 = s2 || this.constructor.getPropertyOptions(t2)).hasChanged || a$1)(this[t2], i2) ? (this._$AL.has(t2) || this._$AL.set(t2, i2), true === s2.reflect && this._$El !== t2 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t2, s2))) : e2 = false), !this.isUpdatePending && e2 && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = true;
    try {
      await this._$E_;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t2;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((t3, i3) => this[i3] = t3), this._$Ei = void 0);
    let i2 = false;
    const s2 = this._$AL;
    try {
      i2 = this.shouldUpdate(s2), i2 ? (this.willUpdate(s2), null === (t2 = this._$ES) || void 0 === t2 || t2.forEach((t3) => {
        var i3;
        return null === (i3 = t3.hostUpdate) || void 0 === i3 ? void 0 : i3.call(t3);
      }), this.update(s2)) : this._$Ek();
    } catch (t3) {
      throw i2 = false, this._$Ek(), t3;
    }
    i2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var i2;
    null === (i2 = this._$ES) || void 0 === i2 || i2.forEach((t3) => {
      var i3;
      return null === (i3 = t3.hostUpdated) || void 0 === i3 ? void 0 : i3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    void 0 !== this._$EC && (this._$EC.forEach((t3, i2) => this._$EO(i2, this[i2], t3)), this._$EC = void 0), this._$Ek();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
}
d$1.finalized = true, d$1.elementProperties = /* @__PURE__ */ new Map(), d$1.elementStyles = [], d$1.shadowRootOptions = { mode: "open" }, null == o$2 || o$2({ ReactiveElement: d$1 }), (null !== (s$2 = e$1.reactiveElementVersions) && void 0 !== s$2 ? s$2 : e$1.reactiveElementVersions = []).push("1.4.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;
const i = window, s$1 = i.trustedTypes, e = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, o$1 = `lit$${(Math.random() + "").slice(9)}$`, n$1 = "?" + o$1, l$1 = `<${n$1}>`, h = document, r = (t2 = "") => h.createComment(t2), d = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, u = Array.isArray, c = (t2) => u(t2) || "function" == typeof (null == t2 ? void 0 : t2[Symbol.iterator]), v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, a = /-->/g, f = />/g, _ = RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), m = /'/g, p = /"/g, $ = /^(?:script|style|textarea|title)$/i, g = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), y = g(1), x = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), T = /* @__PURE__ */ new WeakMap(), A = h.createTreeWalker(h, 129, null, false), E = (t2, i2) => {
  const s2 = t2.length - 1, n2 = [];
  let h2, r2 = 2 === i2 ? "<svg>" : "", d2 = v;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let e2, u3, c2 = -1, g2 = 0;
    for (; g2 < s3.length && (d2.lastIndex = g2, u3 = d2.exec(s3), null !== u3); )
      g2 = d2.lastIndex, d2 === v ? "!--" === u3[1] ? d2 = a : void 0 !== u3[1] ? d2 = f : void 0 !== u3[2] ? ($.test(u3[2]) && (h2 = RegExp("</" + u3[2], "g")), d2 = _) : void 0 !== u3[3] && (d2 = _) : d2 === _ ? ">" === u3[0] ? (d2 = null != h2 ? h2 : v, c2 = -1) : void 0 === u3[1] ? c2 = -2 : (c2 = d2.lastIndex - u3[2].length, e2 = u3[1], d2 = void 0 === u3[3] ? _ : '"' === u3[3] ? p : m) : d2 === p || d2 === m ? d2 = _ : d2 === a || d2 === f ? d2 = v : (d2 = _, h2 = void 0);
    const y2 = d2 === _ && t2[i3 + 1].startsWith("/>") ? " " : "";
    r2 += d2 === v ? s3 + l$1 : c2 >= 0 ? (n2.push(e2), s3.slice(0, c2) + "$lit$" + s3.slice(c2) + o$1 + y2) : s3 + o$1 + (-2 === c2 ? (n2.push(void 0), i3) : y2);
  }
  const u2 = r2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : "");
  if (!Array.isArray(t2) || !t2.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [void 0 !== e ? e.createHTML(u2) : u2, n2];
};
class C {
  constructor({ strings: t2, _$litType$: i2 }, e2) {
    let l2;
    this.parts = [];
    let h2 = 0, d2 = 0;
    const u2 = t2.length - 1, c2 = this.parts, [v2, a2] = E(t2, i2);
    if (this.el = C.createElement(v2, e2), A.currentNode = this.el.content, 2 === i2) {
      const t3 = this.el.content, i3 = t3.firstChild;
      i3.remove(), t3.append(...i3.childNodes);
    }
    for (; null !== (l2 = A.nextNode()) && c2.length < u2; ) {
      if (1 === l2.nodeType) {
        if (l2.hasAttributes()) {
          const t3 = [];
          for (const i3 of l2.getAttributeNames())
            if (i3.endsWith("$lit$") || i3.startsWith(o$1)) {
              const s2 = a2[d2++];
              if (t3.push(i3), void 0 !== s2) {
                const t4 = l2.getAttribute(s2.toLowerCase() + "$lit$").split(o$1), i4 = /([.?@])?(.*)/.exec(s2);
                c2.push({ type: 1, index: h2, name: i4[2], strings: t4, ctor: "." === i4[1] ? M : "?" === i4[1] ? k : "@" === i4[1] ? H : S });
              } else
                c2.push({ type: 6, index: h2 });
            }
          for (const i3 of t3)
            l2.removeAttribute(i3);
        }
        if ($.test(l2.tagName)) {
          const t3 = l2.textContent.split(o$1), i3 = t3.length - 1;
          if (i3 > 0) {
            l2.textContent = s$1 ? s$1.emptyScript : "";
            for (let s2 = 0; s2 < i3; s2++)
              l2.append(t3[s2], r()), A.nextNode(), c2.push({ type: 2, index: ++h2 });
            l2.append(t3[i3], r());
          }
        }
      } else if (8 === l2.nodeType)
        if (l2.data === n$1)
          c2.push({ type: 2, index: h2 });
        else {
          let t3 = -1;
          for (; -1 !== (t3 = l2.data.indexOf(o$1, t3 + 1)); )
            c2.push({ type: 7, index: h2 }), t3 += o$1.length - 1;
        }
      h2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = h.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function P(t2, i2, s2 = t2, e2) {
  var o2, n2, l2, h2;
  if (i2 === x)
    return i2;
  let r2 = void 0 !== e2 ? null === (o2 = s2._$Co) || void 0 === o2 ? void 0 : o2[e2] : s2._$Cl;
  const u2 = d(i2) ? void 0 : i2._$litDirective$;
  return (null == r2 ? void 0 : r2.constructor) !== u2 && (null === (n2 = null == r2 ? void 0 : r2._$AO) || void 0 === n2 || n2.call(r2, false), void 0 === u2 ? r2 = void 0 : (r2 = new u2(t2), r2._$AT(t2, s2, e2)), void 0 !== e2 ? (null !== (l2 = (h2 = s2)._$Co) && void 0 !== l2 ? l2 : h2._$Co = [])[e2] = r2 : s2._$Cl = r2), void 0 !== r2 && (i2 = P(t2, r2._$AS(t2, i2.values), r2, e2)), i2;
}
class V {
  constructor(t2, i2) {
    this.u = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  v(t2) {
    var i2;
    const { el: { content: s2 }, parts: e2 } = this._$AD, o2 = (null !== (i2 = null == t2 ? void 0 : t2.creationScope) && void 0 !== i2 ? i2 : h).importNode(s2, true);
    A.currentNode = o2;
    let n2 = A.nextNode(), l2 = 0, r2 = 0, d2 = e2[0];
    for (; void 0 !== d2; ) {
      if (l2 === d2.index) {
        let i3;
        2 === d2.type ? i3 = new N(n2, n2.nextSibling, this, t2) : 1 === d2.type ? i3 = new d2.ctor(n2, d2.name, d2.strings, this, t2) : 6 === d2.type && (i3 = new I(n2, this, t2)), this.u.push(i3), d2 = e2[++r2];
      }
      l2 !== (null == d2 ? void 0 : d2.index) && (n2 = A.nextNode(), l2++);
    }
    return o2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this.u)
      void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class N {
  constructor(t2, i2, s2, e2) {
    var o2;
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cm = null === (o2 = null == e2 ? void 0 : e2.isConnected) || void 0 === o2 || o2;
  }
  get _$AU() {
    var t2, i2;
    return null !== (i2 = null === (t2 = this._$AM) || void 0 === t2 ? void 0 : t2._$AU) && void 0 !== i2 ? i2 : this._$Cm;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === t2.nodeType && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = P(this, t2, i2), d(t2) ? t2 === b || null == t2 || "" === t2 ? (this._$AH !== b && this._$AR(), this._$AH = b) : t2 !== this._$AH && t2 !== x && this.g(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : c(t2) ? this.k(t2) : this.g(t2);
  }
  O(t2, i2 = this._$AB) {
    return this._$AA.parentNode.insertBefore(t2, i2);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  g(t2) {
    this._$AH !== b && d(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(h.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var i2;
    const { values: s2, _$litType$: e2 } = t2, o2 = "number" == typeof e2 ? this._$AC(t2) : (void 0 === e2.el && (e2.el = C.createElement(e2.h, this.options)), e2);
    if ((null === (i2 = this._$AH) || void 0 === i2 ? void 0 : i2._$AD) === o2)
      this._$AH.p(s2);
    else {
      const t3 = new V(o2, this), i3 = t3.v(this.options);
      t3.p(s2), this.T(i3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = T.get(t2.strings);
    return void 0 === i2 && T.set(t2.strings, i2 = new C(t2)), i2;
  }
  k(t2) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const o2 of t2)
      e2 === i2.length ? i2.push(s2 = new N(this.O(r()), this.O(r()), this, this.options)) : s2 = i2[e2], s2._$AI(o2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, i2) {
    var s2;
    for (null === (s2 = this._$AP) || void 0 === s2 || s2.call(this, false, true, i2); t2 && t2 !== this._$AB; ) {
      const i3 = t2.nextSibling;
      t2.remove(), t2 = i3;
    }
  }
  setConnected(t2) {
    var i2;
    void 0 === this._$AM && (this._$Cm = t2, null === (i2 = this._$AP) || void 0 === i2 || i2.call(this, t2));
  }
}
class S {
  constructor(t2, i2, s2, e2, o2) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = o2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = b;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const o2 = this.strings;
    let n2 = false;
    if (void 0 === o2)
      t2 = P(this, t2, i2, 0), n2 = !d(t2) || t2 !== this._$AH && t2 !== x, n2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let l2, h2;
      for (t2 = o2[0], l2 = 0; l2 < o2.length - 1; l2++)
        h2 = P(this, e3[s2 + l2], i2, l2), h2 === x && (h2 = this._$AH[l2]), n2 || (n2 = !d(h2) || h2 !== this._$AH[l2]), h2 === b ? t2 = b : t2 !== b && (t2 += (null != h2 ? h2 : "") + o2[l2 + 1]), this._$AH[l2] = h2;
    }
    n2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t2 ? t2 : "");
  }
}
class M extends S {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === b ? void 0 : t2;
  }
}
const R = s$1 ? s$1.emptyScript : "";
class k extends S {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    t2 && t2 !== b ? this.element.setAttribute(this.name, R) : this.element.removeAttribute(this.name);
  }
}
class H extends S {
  constructor(t2, i2, s2, e2, o2) {
    super(t2, i2, s2, e2, o2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    var s2;
    if ((t2 = null !== (s2 = P(this, t2, i2, 0)) && void 0 !== s2 ? s2 : b) === x)
      return;
    const e2 = this._$AH, o2 = t2 === b && e2 !== b || t2.capture !== e2.capture || t2.once !== e2.once || t2.passive !== e2.passive, n2 = t2 !== b && (e2 === b || o2);
    o2 && this.element.removeEventListener(this.name, this, e2), n2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var i2, s2;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s2 = null === (i2 = this.options) || void 0 === i2 ? void 0 : i2.host) && void 0 !== s2 ? s2 : this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class I {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    P(this, t2);
  }
}
const z = i.litHtmlPolyfillSupport;
null == z || z(C, N), (null !== (t = i.litHtmlVersions) && void 0 !== t ? t : i.litHtmlVersions = []).push("2.4.0");
const Z = (t2, i2, s2) => {
  var e2, o2;
  const n2 = null !== (e2 = null == s2 ? void 0 : s2.renderBefore) && void 0 !== e2 ? e2 : i2;
  let l2 = n2._$litPart$;
  if (void 0 === l2) {
    const t3 = null !== (o2 = null == s2 ? void 0 : s2.renderBefore) && void 0 !== o2 ? o2 : null;
    n2._$litPart$ = l2 = new N(i2.insertBefore(r(), t3), t3, void 0, null != s2 ? s2 : {});
  }
  return l2._$AI(t2), l2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var l, o;
class s extends d$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t2, e2;
    const i2 = super.createRenderRoot();
    return null !== (t2 = (e2 = this.renderOptions).renderBefore) && void 0 !== t2 || (e2.renderBefore = i2.firstChild), i2;
  }
  update(t2) {
    const i2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = Z(i2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t2;
    super.connectedCallback(), null === (t2 = this._$Do) || void 0 === t2 || t2.setConnected(true);
  }
  disconnectedCallback() {
    var t2;
    super.disconnectedCallback(), null === (t2 = this._$Do) || void 0 === t2 || t2.setConnected(false);
  }
  render() {
    return x;
  }
}
s.finalized = true, s._$litElement$ = true, null === (l = globalThis.litElementHydrateSupport) || void 0 === l || l.call(globalThis, { LitElement: s });
const n = globalThis.litElementPolyfillSupport;
null == n || n({ LitElement: s });
(null !== (o = globalThis.litElementVersions) && void 0 !== o ? o : globalThis.litElementVersions = []).push("3.2.2");
const LANGS = ["en", "es", "pt"];
class ITMBaseElement extends s {
  constructor() {
    super();
    __privateAdd(this, _setInitialLanguage);
    __privateMethod(this, _setInitialLanguage, setInitialLanguage_fn).call(this);
    this._t = this._t.bind(this);
    this.version = getVersion();
  }
  _t(key) {
    if (this.translations && this.translations[this.language] && this.translations[this.language][key]) {
      return this.translations[this.language][key];
    }
    return key;
  }
  addTranslations(translations) {
    if (!this.translations) {
      this.translations = {};
    }
    for (let lang in translations) {
      if (!LANGS.includes(lang)) {
        console.warn(`Language ${lang} is not supported. Supported languages are: ${LANGS.join(", ")}
The object format is {en:{}, es:{}, pt:{}}`);
        return;
      }
      if (!this.translations[lang]) {
        this.translations[lang] = {};
      }
      for (let key in translations[lang]) {
        this.translations[lang][key] = translations[lang][key];
      }
    }
    if (this.reloadElements && typeof this.reloadElements === "function") {
      this.reloadElements();
    } else {
      console.warn("reloadElements() not found in child element. Translations will not be applied");
    }
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
_setInitialLanguage = new WeakSet();
setInitialLanguage_fn = function() {
  if (window.strLanguage && LANGS.includes(window.strLanguage)) {
    this.language = window.strLanguage;
  } else if (window.language && LANGS.includes(window.language)) {
    this.language = window.language;
  } else {
    this.language = "en";
  }
};
__publicField(ITMBaseElement, "properties", {
  language: { type: String },
  translations: { type: Object }
});
class ITMButton extends ITMBaseElement {
  constructor() {
    super();
    this.disabled = false;
    this.spin = false;
    this.type = "primary";
    this.size = "regular";
  }
  get size() {
    return this._size;
  }
  set size(value) {
    const SIZES = ["x-small", "small", "regular"];
    if (!SIZES.includes(value)) {
      console.warn(`Invalid size: ${value}. Valid values are ${SIZES.join(", ")}`);
      return;
    }
    const oldValue = this._size;
    this._size = value;
    this.requestUpdate("size", oldValue);
  }
  updated(changedProperties) {
    if (changedProperties.has("size")) {
      if (changedProperties.get("size") !== void 0) {
        this.shadowRoot.querySelector(".button").classList.remove(`button-size-${changedProperties.get("size")}`);
      }
      this.shadowRoot.querySelector(".button").classList.add(`button-size-${this.size}`);
    }
  }
  disable() {
    this.disabled = true;
  }
  enable() {
    this.disabled = false;
  }
  startSpin() {
    this.spin = true;
    setTimeout(() => {
      if (this.spin) {
        this.disable();
      }
    }, 200);
  }
  stopSpin(successful) {
    if (!this.spin)
      return;
    this.spin = false;
    this.disabled = false;
    if (typeof successful === "object" && successful.success) {
      this.renderRoot.getElementById("check").classList.add("spincheck");
      setTimeout(() => {
        this.renderRoot.getElementById("check").classList.remove("spincheck");
      }, 1100);
    } else if (typeof successful === "object" && successful.success === false) {
      this.renderRoot.getElementById("xmark").classList.add("pulsexmark");
      setTimeout(() => {
        this.renderRoot.getElementById("xmark").classList.remove("pulsexmark");
      }, 4400);
    }
  }
  render() {
    return y`
         <button class="button ${this.type == "primary" ? "button-1" : "button-2"}" ?disabled=${this.disabled}>
            <svg id="spinner" class="spinner ${this.spin == true ? "spin" : ""}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" >
                <path d="M296 48c0 22.091-17.909 40-40 40s-40-17.909-40-40 17.909-40 40-40 40 17.909 40 40zm-40 376c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm248-168c0-22.091-17.909-40-40-40s-40 17.909-40 40 17.909 40 40 40 40-17.909 40-40zm-416 0c0-22.091-17.909-40-40-40S8 233.909 8 256s17.909 40 40 40 40-17.909 40-40zm20.922-187.078c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40c0-22.092-17.909-40-40-40zm294.156 294.156c-22.091 0-40 17.909-40 40s17.909 40 40 40c22.092 0 40-17.909 40-40s-17.908-40-40-40zm-294.156 0c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40z"/>
            </svg>
            <svg id="check" class="check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
            </svg>
            <svg id="xmark" class="xmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/>
            </svg>

            <slot></slot></button>
        `;
  }
}
__publicField(ITMButton, "styles", i$1`
      :host {
        all: initial;
        contain: layout style;            
        display: block;
                    /* Because we are using the native click, we need to prevent host from firing click */
                    pointer-events:none;
                    --button-font-size-regular: 14px;
                    --button-font-size-small: 12px;
                    --button-font-size-x-small: 11px;
                    --button-text-btn-1: #fff;
                    --button-bg-btn-1: #495d73;
                    --button-bg-btn-1-disabled: #5e7083;
                    --button-bg-btn-1-hover: #1E3E62;

                    --button-text-btn-2: #495d73;
                    --button-text-btn-2-disabled: #cacccf;
                    --button-bg-btn-2: #fff;
                    --button-bg-btn-2-hover: #edeff5;
                    /** ⚠️ TODO border hover */
                    --button-border-btn-2: #a6aec1;
                    --button-border-btn-2-disabled: #cacccf;

                    --button-spinner-fill: #cacccf;
                    --button-check-fill: #c2d4c3;
                    --button-xmark-fill: #c95445;
                }
                .button {
                    /* Font cannot come from host 🤷🏻‍♂️ */
                    pointer-events:all;
                    display:flex;
                    font-family: Lato, Arial, Helvetica, sans-serif;
                    
                    flex-direction: row; 
                    justify-items: center; 
                    align-items: center; 
                    cursor: pointer;
                    border-style : solid;
                    border-width:1px; 
                    white-space: nowrap;
                }

                .button-size-regular {
                    font-size: var(--button-font-size-regular);
                    margin-left:.3em;
                    padding-top: 0.55em;
                    padding-bottom: 0.55em; 
                    padding-left: .95em;
                    padding-right: .95em; 
                    border-radius: 0.125em;
                }
                .button-size-small {
                    font-size: var(--button-font-size-small);
                    margin-left:.2em;
                    padding-top: 0.45em;
                    padding-bottom: 0.45em; 
                    padding-left: .75em;
                    padding-right: .75em; 
                    border-radius: 0.1em;
                }
                .button-size-x-small {
                    font-size: var(--button-font-size-x-small);
                    margin-left:.2em;
                    padding: 1px 6px 1px 6px;
                    border-radius: 2px;
                }




                .button:disabled {
                    cursor: default;
                    pointer-events: none;
                }
                .button-1 {
                    color:var(--button-text-btn-1);
                    background:var(--button-bg-btn-1);
                    border-color:var(--button-bg-btn-1);
                }
                .button-1:hover {
                    background:var(--button-bg-btn-1-hover);
                }
                .button-1:disabled {
                    background:var(--button-bg-btn-1-disabled);
                    border-color:var(--button-bg-btn-1-disabled);
                }

                .button-2 {
                    color:var(--button-text-btn-2);
                    background:var(--button-bg-btn-2);
                    border-color:var(--button-border-btn-2);
                }
                .button-2:hover {
                    background:var(--button-bg-btn-2-hover);
                }
                .button-2:disabled {
                    border-color:var(--button-border-btn-2-disabled);
                    color:var(--button-text-btn-2-disabled);
                }
                .spinner{
                    width: 1em;
                    margin-right: 0.5em;
                    display:none;
                    fill:var(--button-spinner-fill);
                }
                .spin{
                    display:inline;
                    animation: spin 1.57s infinite linear;
                }
                @keyframes spin {
                    from {transform:rotate(0deg);}
                    to {transform:rotate(360deg);}
                }
                @keyframes spincheck {
                    from {transform:rotate(270deg);}
                    to {transform:rotate(360deg);}
                }

                @keyframes pulsexmark{
                    0% {transform:scale(1);}
                    50% {transform:scale(1.7);}
                    100% {transform:scale(1);}
                }

                @keyframes confirmout {
                    0% {transform: scale(1.0);}
                    100% {transform: scale(0);}
                }

                .check{
                    width: 1.2em;
                    margin-right: 0.5em;
                    display:none;
                    fill:var(--button-check-fill);
                }
                .xmark{
                    width: calc(1.2em * 320 / 512);
                    margin-right: 0.5em;
                    display:none;
                    fill:var(--button-xmark-fill);
                }

                .spincheck{
                    display:inline;
                    /**animation: name duration timing-function delay iteration-count direction fill-mode play-state; */
                    animation: spincheck .5s linear 0s 1 normal none running,
                               confirmout .3s linear .8s 1 normal forwards running;
                }

                .pulsexmark{
                    display:inline;
                    animation: pulsexmark .5s linear 0s 1 normal none running,
                               confirmout .3s linear 4s 1 normal forwards running;
                }
      `);
__publicField(ITMButton, "properties", {
  disabled: { type: Boolean },
  spin: { type: Boolean },
  type: { type: String },
  size: { type: String }
});
class ITMEllipsisMenu extends ITMBaseElement {
  constructor() {
    super();
    this.items = [];
    this.disabled = false;
    this.open = false;
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
  }
  firstUpdated() {
    window.addEventListener("click", this._handleOutsideClick);
  }
  disconnectedCallback() {
    window.removeEventListener("click", this._handleOutsideClick);
  }
  _handleOutsideClick(e2) {
    const path = e2.composedPath();
    if (!path.includes(this)) {
      this.open = false;
      this.requestUpdate();
    }
  }
  _setZIndexToMaxPage() {
    const menu = this.shadowRoot.querySelector(".menu");
    const maxZIndex = this._getPageMaxZIndex();
    menu.style.zIndex = maxZIndex + 1;
  }
  _getPageMaxZIndex() {
    const allElements = document.getElementsByTagName("*");
    let maxZIndex = 0;
    for (let i2 = 0; i2 < allElements.length; i2++) {
      const zIndex = parseInt(window.getComputedStyle(allElements[i2]).zIndex);
      if (zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    }
    return maxZIndex;
  }
  disable() {
    this.disabled = true;
  }
  enable() {
    this.disabled = false;
  }
  _handleMenuClick(e2) {
    this.open = !this.open;
    this.requestUpdate();
    this._setZIndexToMaxPage();
  }
  _handleItemClick(item, event) {
    event.stopPropagation();
    if (!item.enabled)
      return;
    this.dispatchEvent(new CustomEvent("item-select", { detail: item.value }));
    this.open = false;
    this.requestUpdate();
  }
  render() {
    return y`
        <div class="menu-wrapper">
            <div class="ellipsis" @click=${this._handleMenuClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="14">
                <path d="M432 256a48 48 0 1 1 -96 0 48 48 0 1 1 96 0zm-160 0a48 48 0 1 1 -96 0 48 48 0 1 1 96 0zM64 304a48 48 0 1 1 0-96 48 48 0 1 1 0 96z"/>
            </svg>
            </div>
            <div class="menu ${this.open ? "open" : ""}">
                ${this.items.map(
      (item, index) => y`
                        <div class="menu-item ${item.enabled ? "" : "disabled"}" 
                             title="${item.tooltip[this.language]}" 
                             @click=${(event) => this._handleItemClick(item, event)}>
                            ${item.text[this.language]}
                        </div>
                    `
    )}
            </div>
            </div>
        `;
  }
}
__publicField(ITMEllipsisMenu, "styles", i$1`
        :host {
            all: initial;          
            display: block;
            pointer-events:none;
            --font-size-minus: 13px;
            --text-ellipsis: #888;
            --bg-ellipsis: #fff;
            --bg-ellipsis-hover: #f0f0f0;
            --border-ellipsis: #ccc;
        }
        .ellipsis {
            pointer-events: all;
            display: flex;
            justify-content: center;
            border: 1px solid var(--border-ellipsis);
            border-radius: 2px;
            padding: 3px;
            cursor: pointer;
            fill: var(--text-ellipsis);
            user-select: none;
            width: 1em;
            height: 1em;
            background: var(--bg-ellipsis);
        }
        .ellipsis:hover {
            background-color: var(--bg-ellipsis-hover);
        }
        .menu-wrapper {
            /* Make the menu-wrapper a containing block for absolute positioning */
            position: relative;
            display: inline-block;
}
        .menu {
            /* Position the menu below the ellipsis, without affecting its position */
            position: absolute;
            top: 100%;  /* align the top of the menu with the bottom of the wrapper */
            right: 0;  /* align the left edge of the menu with the left edge of the wrapper */
            margin-top: 3px; /* add a small gap between the wrapper and the menu */
            border: 1px solid var(--border-ellipsis);
            border-radius: 3px;
            background: #fff;
            padding: 5px 0;
            min-width: 100px;
            box-shadow: 0 2px 5px rgba(0,0,0,.15);
            font-size: var(--font-size-minus);
            font-family: Lato, Arial, Helvetica, sans-serif;
            display: none;
        }
        .menu.open {
            display: block !important;
        }

        .menu-item {
            pointer-events: auto;
            padding: 5px 10px;
            cursor: pointer;
            user-select: none;
            white-space: nowrap; 
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 15em;
        }

        .menu-item:hover {
            background-color: var(--bg-ellipsis-hover);
        }
        .disabled {
            color: #ccc;
            cursor: default;
        }
    `);
__publicField(ITMEllipsisMenu, "properties", {
  items: { type: Array },
  disabled: { type: Boolean }
});
class ITMDropdown extends ITMBaseElement {
  constructor() {
    super();
    this.items = [];
  }
  setItems(items) {
    this.items = items;
  }
  firstUpdated() {
    this.shadowRoot.querySelector(".dropdown").addEventListener("change", this._handleChange.bind(this));
  }
  _handleChange(event) {
    this.dispatchEvent(new CustomEvent("change", { detail: event.target.value }));
  }
  render() {
    return y`
            <select class="dropdown">
                ${this.items.map((item) => y`
                    <option value="${item.value}" ?disabled="${!item.enabled}">${this._t(item.text)}</option>
                `)}
            </select>
        `;
  }
}
__publicField(ITMDropdown, "styles", i$1`
        :host {
            all: initial;
            display: block;
            //pointer-events: none;
            --font-size-minus: 13px;
            --text-dropdown: #888;
            --bg-dropdown: #fff;
            --bg-dropdown-hover: #f0f0f0;
            --border-dropdown: #ccc;
            --min-width-dropdown: 5em;
            --width-dropdown: 10em;
        }
        .dropdown {
            pointer-events: all;
            display: flex;
            justify-content: center;
            border: 1px solid var(--border-dropdown);
            border-radius: 2px;
            padding: 3px;
            cursor: pointer;
            fill: var(--text-dropdown);
            user-select: none;
            background: var(--bg-dropdown);
        }
        .dropdown:hover {
            background-color: var(--bg-dropdown-hover);
        }
    `);
__publicField(ITMDropdown, "properties", {
  items: { type: Array }
});
class ITMCaret extends ITMBaseElement {
  constructor() {
    super();
    this.disabled = false;
    if (!this.value || this.value !== "up" && this.value !== "down") {
      this.value = "up";
    }
  }
  firstUpdated() {
    this.updateRotation();
  }
  toggle() {
    this.value = this.value === "up" ? "down" : "up";
    this.updateRotation();
    this.dispatchEvent(new CustomEvent("change", {
      detail: this.value
    }));
  }
  updateRotation() {
    const svg = this.shadowRoot.querySelector("svg");
    svg.style.transform = this.value === "up" ? "rotate(180deg)" : "rotate(0deg)";
  }
  render() {
    return y`
        <svg class="caret-up-down" @click="${this.toggle}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M256 0a256 256 0 1 0 0 512 256 256 0 1 0 0-512zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z"/>
        </svg>
        `;
  }
}
__publicField(ITMCaret, "styles", i$1`
        :host {
            all: initial;
            display: block;
            pointer-events: none;
            --caret-up-down-fill: #495d73;
            --caret-up-down-fill-disabled: #5e7083;
            --caret-up-down-fill-hover: #1E3E62;
        }
        .caret-up-down {
            pointer-events: all;
            cursor: pointer;
            width: 1.5em;
            fill: var(--caret-up-down-fill);
            transition: transform 0.3s ease;
        }
        .dropdown:hover {
            background-color: var(--caret-up-down-fill-hover);
        }
        .dropdown:disabled {
            fill: var(--caret-up-down-fill-disabled);
        }
    `);
__publicField(ITMCaret, "properties", {
  disabled: { type: Boolean },
  value: { type: String }
});
console.log("ITM Common Components ", "1.0.2");
customElements.define("itm-button", ITMButton);
customElements.define("itm-ellipsis-menu", ITMEllipsisMenu);
customElements.define("itm-dropdown", ITMDropdown);
customElements.define("itm-caret-up-down", ITMCaret);
customElements.whenDefined("itm-button").then(() => {
  import("./itm-editor.af0c78f1.js").then((module) => {
    customElements.define("itm-editor", module.ITMEditor);
  });
});
export {
  ITMBaseElement as I,
  getMaxZIndex as g,
  i$1 as i,
  r$2 as r,
  y
};
