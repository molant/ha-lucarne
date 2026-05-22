/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ge = globalThis, Ee = ge.ShadowRoot && (ge.ShadyCSS === void 0 || ge.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Se = Symbol(), Le = /* @__PURE__ */ new WeakMap();
let ct = class {
  constructor(e, s, r) {
    if (this._$cssResult$ = !0, r !== Se) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (Ee && e === void 0) {
      const r = s !== void 0 && s.length === 1;
      r && (e = Le.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Le.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (t) => new ct(typeof t == "string" ? t : t + "", void 0, Se), $ = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((r, a, n) => r + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[n + 1], t[0]);
  return new ct(s, t, Se);
}, yt = (t, e) => {
  if (Ee) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const r = document.createElement("style"), a = ge.litNonce;
    a !== void 0 && r.setAttribute("nonce", a), r.textContent = s.cssText, t.appendChild(r);
  }
}, je = Ee ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const r of e.cssRules) s += r.cssText;
  return bt(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: wt, defineProperty: $t, getOwnPropertyDescriptor: xt, getOwnPropertyNames: Ct, getOwnPropertySymbols: Et, getPrototypeOf: St } = Object, O = globalThis, Ne = O.trustedTypes, kt = Ne ? Ne.emptyScript : "", we = O.reactiveElementPolyfillSupport, X = (t, e) => t, fe = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? kt : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let s = t;
  switch (e) {
    case Boolean:
      s = t !== null;
      break;
    case Number:
      s = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(t);
      } catch {
        s = null;
      }
  }
  return s;
} }, ke = (t, e) => !wt(t, e), Ue = { attribute: !0, type: String, converter: fe, reflect: !1, useDefault: !1, hasChanged: ke };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), O.litPropertyMetadata ?? (O.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let F = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = Ue) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const r = Symbol(), a = this.getPropertyDescriptor(e, r, s);
      a !== void 0 && $t(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, s, r) {
    const { get: a, set: n } = xt(this.prototype, e) ?? { get() {
      return this[s];
    }, set(i) {
      this[s] = i;
    } };
    return { get: a, set(i) {
      const o = a == null ? void 0 : a.call(this);
      n == null || n.call(this, i), this.requestUpdate(e, o, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ue;
  }
  static _$Ei() {
    if (this.hasOwnProperty(X("elementProperties"))) return;
    const e = St(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(X("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(X("properties"))) {
      const s = this.properties, r = [...Ct(s), ...Et(s)];
      for (const a of r) this.createProperty(a, s[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [r, a] of s) this.elementProperties.set(r, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, r] of this.elementProperties) {
      const a = this._$Eu(s, r);
      a !== void 0 && this._$Eh.set(a, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const a of r) s.unshift(je(a));
    } else e !== void 0 && s.push(je(e));
    return s;
  }
  static _$Eu(e, s) {
    const r = s.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((s) => this.enableUpdating = s), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((s) => s(this));
  }
  addController(e) {
    var s;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((s = e.hostConnected) == null || s.call(e));
  }
  removeController(e) {
    var s;
    (s = this._$EO) == null || s.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const r of s.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return yt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((s) => {
      var r;
      return (r = s.hostConnected) == null ? void 0 : r.call(s);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var r;
      return (r = s.hostDisconnected) == null ? void 0 : r.call(s);
    });
  }
  attributeChangedCallback(e, s, r) {
    this._$AK(e, r);
  }
  _$ET(e, s) {
    var n;
    const r = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, r);
    if (a !== void 0 && r.reflect === !0) {
      const i = (((n = r.converter) == null ? void 0 : n.toAttribute) !== void 0 ? r.converter : fe).toAttribute(s, r.type);
      this._$Em = e, i == null ? this.removeAttribute(a) : this.setAttribute(a, i), this._$Em = null;
    }
  }
  _$AK(e, s) {
    var n, i;
    const r = this.constructor, a = r._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const o = r.getPropertyOptions(a), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : fe;
      this._$Em = a;
      const c = l.fromAttribute(s, o.type);
      this[a] = c ?? ((i = this._$Ej) == null ? void 0 : i.get(a)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, s, r, a = !1, n) {
    var i;
    if (e !== void 0) {
      const o = this.constructor;
      if (a === !1 && (n = this[e]), r ?? (r = o.getPropertyOptions(e)), !((r.hasChanged ?? ke)(n, s) || r.useDefault && r.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(o._$Eu(e, r)))) return;
      this.C(e, s, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: r, reflect: a, wrapped: n }, i) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, i ?? s ?? this[e]), n !== !0 || i !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (s = void 0), this._$AL.set(e, s)), a === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, i] of this._$Ep) this[n] = i;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [n, i] of a) {
        const { wrapped: o } = i, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, i, l);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), (r = this._$EO) == null || r.forEach((a) => {
        var n;
        return (n = a.hostUpdate) == null ? void 0 : n.call(a);
      }), this.update(s)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
    }
    e && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var s;
    (s = this._$EO) == null || s.forEach((r) => {
      var a;
      return (a = r.hostUpdated) == null ? void 0 : a.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((s) => this._$ET(s, this[s]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
F.elementStyles = [], F.shadowRootOptions = { mode: "open" }, F[X("elementProperties")] = /* @__PURE__ */ new Map(), F[X("finalized")] = /* @__PURE__ */ new Map(), we == null || we({ ReactiveElement: F }), (O.reactiveElementVersions ?? (O.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ee = globalThis, Be = (t) => t, ve = ee.trustedTypes, Re = ve ? ve.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, dt = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + T, Dt = `<${ht}>`, N = document, se = () => N.createComment(""), re = (t) => t === null || typeof t != "object" && typeof t != "function", De = Array.isArray, At = (t) => De(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", $e = `[ 	
\f\r]`, Z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, We = /-->/g, Fe = />/g, z = RegExp(`>|${$e}(?:([^\\s"'>=/]+)(${$e}*=${$e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), qe = /'/g, Ve = /"/g, pt = /^(?:script|style|textarea|title)$/i, ut = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), d = ut(1), I = ut(2), V = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), Ke = /* @__PURE__ */ new WeakMap(), L = N.createTreeWalker(N, 129);
function gt(t, e) {
  if (!De(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Re !== void 0 ? Re.createHTML(e) : e;
}
const Pt = (t, e) => {
  const s = t.length - 1, r = [];
  let a, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = Z;
  for (let o = 0; o < s; o++) {
    const l = t[o];
    let c, h, g = -1, v = 0;
    for (; v < l.length && (i.lastIndex = v, h = i.exec(l), h !== null); ) v = i.lastIndex, i === Z ? h[1] === "!--" ? i = We : h[1] !== void 0 ? i = Fe : h[2] !== void 0 ? (pt.test(h[2]) && (a = RegExp("</" + h[2], "g")), i = z) : h[3] !== void 0 && (i = z) : i === z ? h[0] === ">" ? (i = a ?? Z, g = -1) : h[1] === void 0 ? g = -2 : (g = i.lastIndex - h[2].length, c = h[1], i = h[3] === void 0 ? z : h[3] === '"' ? Ve : qe) : i === Ve || i === qe ? i = z : i === We || i === Fe ? i = Z : (i = z, a = void 0);
    const p = i === z && t[o + 1].startsWith("/>") ? " " : "";
    n += i === Z ? l + Dt : g >= 0 ? (r.push(c), l.slice(0, g) + dt + l.slice(g) + T + p) : l + T + (g === -2 ? o : p);
  }
  return [gt(t, n + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class ae {
  constructor({ strings: e, _$litType$: s }, r) {
    let a;
    this.parts = [];
    let n = 0, i = 0;
    const o = e.length - 1, l = this.parts, [c, h] = Pt(e, s);
    if (this.el = ae.createElement(c, r), L.currentNode = this.el.content, s === 2 || s === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (a = L.nextNode()) !== null && l.length < o; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const g of a.getAttributeNames()) if (g.endsWith(dt)) {
          const v = h[i++], p = a.getAttribute(g).split(T), _ = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: n, name: _[2], strings: p, ctor: _[1] === "." ? Tt : _[1] === "?" ? Ot : _[1] === "@" ? Ht : _e }), a.removeAttribute(g);
        } else g.startsWith(T) && (l.push({ type: 6, index: n }), a.removeAttribute(g));
        if (pt.test(a.tagName)) {
          const g = a.textContent.split(T), v = g.length - 1;
          if (v > 0) {
            a.textContent = ve ? ve.emptyScript : "";
            for (let p = 0; p < v; p++) a.append(g[p], se()), L.nextNode(), l.push({ type: 2, index: ++n });
            a.append(g[v], se());
          }
        }
      } else if (a.nodeType === 8) if (a.data === ht) l.push({ type: 2, index: n });
      else {
        let g = -1;
        for (; (g = a.data.indexOf(T, g + 1)) !== -1; ) l.push({ type: 7, index: n }), g += T.length - 1;
      }
      n++;
    }
  }
  static createElement(e, s) {
    const r = N.createElement("template");
    return r.innerHTML = e, r;
  }
}
function K(t, e, s = t, r) {
  var i, o;
  if (e === V) return e;
  let a = r !== void 0 ? (i = s._$Co) == null ? void 0 : i[r] : s._$Cl;
  const n = re(e) ? void 0 : e._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== n && ((o = a == null ? void 0 : a._$AO) == null || o.call(a, !1), n === void 0 ? a = void 0 : (a = new n(t), a._$AT(t, s, r)), r !== void 0 ? (s._$Co ?? (s._$Co = []))[r] = a : s._$Cl = a), a !== void 0 && (e = K(t, a._$AS(t, e.values), a, r)), e;
}
class Mt {
  constructor(e, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: s }, parts: r } = this._$AD, a = ((e == null ? void 0 : e.creationScope) ?? N).importNode(s, !0);
    L.currentNode = a;
    let n = L.nextNode(), i = 0, o = 0, l = r[0];
    for (; l !== void 0; ) {
      if (i === l.index) {
        let c;
        l.type === 2 ? c = new de(n, n.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (c = new It(n, this, e)), this._$AV.push(c), l = r[++o];
      }
      i !== (l == null ? void 0 : l.index) && (n = L.nextNode(), i++);
    }
    return L.currentNode = N, a;
  }
  p(e) {
    let s = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, s), s += r.strings.length - 2) : r._$AI(e[s])), s++;
  }
}
class de {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, s, r, a) {
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = r, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = s.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, s = this) {
    e = K(this, e, s), re(e) ? e === b || e == null || e === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : e !== this._$AH && e !== V && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : At(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== b && re(this._$AH) ? this._$AA.nextSibling.data = e : this.T(N.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: s, _$litType$: r } = e, a = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = ae.createElement(gt(r.h, r.h[0]), this.options)), r);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === a) this._$AH.p(s);
    else {
      const i = new Mt(a, this), o = i.u(this.options);
      i.p(s), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let s = Ke.get(e.strings);
    return s === void 0 && Ke.set(e.strings, s = new ae(e)), s;
  }
  k(e) {
    De(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let r, a = 0;
    for (const n of e) a === s.length ? s.push(r = new de(this.O(se()), this.O(se()), this, this.options)) : r = s[a], r._$AI(n), a++;
    a < s.length && (this._$AR(r && r._$AB.nextSibling, a), s.length = a);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, s); e !== this._$AB; ) {
      const a = Be(e).nextSibling;
      Be(e).remove(), e = a;
    }
  }
  setConnected(e) {
    var s;
    this._$AM === void 0 && (this._$Cv = e, (s = this._$AP) == null || s.call(this, e));
  }
}
class _e {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, r, a, n) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = e, this.name = s, this._$AM = a, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = b;
  }
  _$AI(e, s = this, r, a) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) e = K(this, e, s, 0), i = !re(e) || e !== this._$AH && e !== V, i && (this._$AH = e);
    else {
      const o = e;
      let l, c;
      for (e = n[0], l = 0; l < n.length - 1; l++) c = K(this, o[r + l], s, l), c === V && (c = this._$AH[l]), i || (i = !re(c) || c !== this._$AH[l]), c === b ? e = b : e !== b && (e += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    i && !a && this.j(e);
  }
  j(e) {
    e === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Tt extends _e {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === b ? void 0 : e;
  }
}
class Ot extends _e {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== b);
  }
}
class Ht extends _e {
  constructor(e, s, r, a, n) {
    super(e, s, r, a, n), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = K(this, e, s, 0) ?? b) === V) return;
    const r = this._$AH, a = e === b && r !== b || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== b && (r === b || a);
    a && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class It {
  constructor(e, s, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    K(this, e);
  }
}
const xe = ee.litHtmlPolyfillSupport;
xe == null || xe(ae, de), (ee.litHtmlVersions ?? (ee.litHtmlVersions = [])).push("3.3.3");
const zt = (t, e, s) => {
  const r = (s == null ? void 0 : s.renderBefore) ?? e;
  let a = r._$litPart$;
  if (a === void 0) {
    const n = (s == null ? void 0 : s.renderBefore) ?? null;
    r._$litPart$ = a = new de(e.insertBefore(se(), n), n, void 0, s ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis;
class y extends F {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var s;
    const e = super.createRenderRoot();
    return (s = this.renderOptions).renderBefore ?? (s.renderBefore = e.firstChild), e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = zt(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return V;
  }
}
var lt;
y._$litElement$ = !0, y.finalized = !0, (lt = j.litElementHydrateSupport) == null || lt.call(j, { LitElement: y });
const Ce = j.litElementPolyfillSupport;
Ce == null || Ce({ LitElement: y });
(j.litElementVersions ?? (j.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lt = { attribute: !0, type: String, converter: fe, reflect: !1, hasChanged: ke }, jt = (t = Lt, e, s) => {
  const { kind: r, metadata: a } = s;
  let n = globalThis.litPropertyMetadata.get(a);
  if (n === void 0 && globalThis.litPropertyMetadata.set(a, n = /* @__PURE__ */ new Map()), r === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(s.name, t), r === "accessor") {
    const { name: i } = s;
    return { set(o) {
      const l = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(i, l, t, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(i, void 0, t, o), o;
    } };
  }
  if (r === "setter") {
    const { name: i } = s;
    return function(o) {
      const l = this[i];
      e.call(this, o), this.requestUpdate(i, l, t, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function u(t) {
  return (e, s) => typeof s == "object" ? jt(t, e, s) : ((r, a, n) => {
    const i = a.hasOwnProperty(n);
    return a.constructor.createProperty(n, r), i ? Object.getOwnPropertyDescriptor(a, n) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(t) {
  return u({ ...t, state: !0, attribute: !1 });
}
const S = $`
  :host {
    --lucarne-spacing-xs: 4px;
    --lucarne-spacing-sm: 8px;
    --lucarne-spacing-md: 12px;
    --lucarne-spacing-lg: 16px;
    --lucarne-spacing-xl: 24px;
    --lucarne-spacing-xxl: 32px;

    --lucarne-radius-sm: 4px;
    --lucarne-radius-md: 8px;
    --lucarne-radius-lg: 16px;

    --lucarne-fs-sm: clamp(0.75rem, 0.5vw + 0.5rem, 0.875rem);
    --lucarne-fs-md: clamp(0.875rem, 0.75vw + 0.6rem, 1rem);
    --lucarne-fs-lg: clamp(1rem, 1vw + 0.75rem, 1.25rem);
    --lucarne-fs-xl: clamp(1.25rem, 1.5vw + 0.875rem, 1.75rem);

    --lucarne-shadow-card: 0 1px 4px rgba(0, 0, 0, 0.08);

    --lucarne-color-family: #a8d8b9;
    --lucarne-color-anton: #a8c5e8;
    --lucarne-color-ingrid: #c8b4e0;
    --lucarne-color-holidays: #d4cfc4;
    --lucarne-color-birthdays: #f0dca0;
    --lucarne-color-les-lilas: #b8b4e8;

    --lucarne-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --lucarne-on-surface: var(--primary-text-color, #212121);
    --lucarne-on-surface-muted: var(--secondary-text-color, #727272);
  }
`;
function Nt(t, e, s) {
  let r, a = !1;
  return t.connection.subscribeMessage(
    (n) => {
      var i, o;
      (o = (i = n.variables) == null ? void 0 : i.trigger) != null && o.to_state && s(n.variables.trigger.to_state);
    },
    { type: "subscribe_trigger", trigger: { platform: "state", entity_id: e } }
  ).then((n) => {
    a ? n() : r = n;
  }), () => {
    a = !0, r == null || r();
  };
}
async function ft(t, e, s, r) {
  const a = await Promise.all(
    e.map(
      (n) => t.callWS({
        type: "calendar/list_events",
        entity_id: n,
        start_date_time: s.toISOString(),
        end_date_time: r.toISOString()
      }).then((i) => [n, (i == null ? void 0 : i.events) ?? []]).catch(() => [n, []])
    )
  );
  return new Map(a);
}
function Ut(t, e, s) {
  const r = async () => {
    var a, n;
    try {
      const i = await t.connection.sendMessagePromise({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: {},
        target: { entity_id: e },
        return_response: !0
      });
      s(((n = (a = i == null ? void 0 : i.response) == null ? void 0 : a[e]) == null ? void 0 : n.items) ?? []);
    } catch {
      s([]);
    }
  };
  return r(), Nt(t, e, () => r());
}
const m = {
  today: "Today",
  nothingOnCalendar: "Nothing on the calendar today",
  allDone: "All done!",
  addWeatherEntity: "Add a weather entity to show forecast",
  dressingTipHeavyCoat: "Heavy coat + hat",
  dressingTipCoatScarf: "Coat + scarf",
  dressingTipLightJacket: "Light jacket",
  dressingTipTShirt: "T-shirt",
  dressingTipShorts: "Shorts weather",
  dressingTipBoots: "Boots + heavy coat",
  dressingTipUmbrella: " + umbrella",
  dressingTipDefault: "Check the weather",
  tasksTitle: "Ingrid's Tasks",
  moreItems: (t) => `+ ${t} more`,
  timePillNow: "now",
  timePillInMinutes: (t) => `in ${t}m`,
  timePillInHours: (t) => `in ${t}h`,
  timePillTomorrow: (t) => `tomorrow ${t}`,
  errorUnavailable: "—"
};
var Bt = Object.defineProperty, Rt = Object.getOwnPropertyDescriptor, be = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Rt(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Bt(e, s, a), a;
};
function te(t) {
  return t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
}
function Wt(t, e, s) {
  return t.filter((r) => te(r.end) > e).sort((r, a) => te(r.start).getTime() - te(a.start).getTime()).slice(0, s);
}
function Ft(t, e, s) {
  const r = t.getTime() - s.getTime();
  if (t <= s && s < e) return m.timePillNow;
  if (r > 0 && r < 60 * 60 * 1e3) {
    const c = Math.round(r / 6e4);
    return m.timePillInMinutes(c);
  }
  if (r > 0 && r < 2 * 60 * 60 * 1e3) {
    const c = Math.round(r / 36e5);
    return m.timePillInHours(c);
  }
  const n = t.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (t.toDateString() === s.toDateString()) return n;
  const o = new Date(s);
  return o.setDate(s.getDate() + 1), t.toDateString() === o.toDateString() ? m.timePillTomorrow(n) : `${t.toLocaleDateString("en", { weekday: "short" })} ${n}`;
}
function qt(t) {
  return t.start.length === 10 && t.end.length === 10;
}
let Y = class extends y {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.limit = 5;
  }
  render() {
    const t = /* @__PURE__ */ new Date(), e = Wt(this.events, t, this.limit);
    return e.length === 0 ? d`<div class="empty-state">${m.nothingOnCalendar}</div>` : d`
      ${e.map((s) => {
      const r = te(s.start), a = te(s.end), n = r <= t && t < a, i = qt(s) ? "all day" : Ft(r, a, t), o = this._colorForEvent(s);
      return d`
          <div class="event-row">
            <div class="time-pill ${n ? "now" : ""}">
              ${n ? d`<span class="pulse-dot"></span>` : ""} ${i}
            </div>
            <div class="color-bar" style="background:${o}"></div>
            <div class="event-content">
              <div class="event-summary">${s.summary}</div>
              ${s.location ? d`<div class="event-secondary">${s.location}</div>` : ""}
            </div>
          </div>
        `;
    })}
    `;
  }
  _colorForEvent(t) {
    if (t.uid) {
      const e = t.uid.split("::")[0], s = this.calendarColors.get(e);
      if (s) return s;
    }
    return "var(--lucarne-color-family)";
  }
};
Y.styles = [
  S,
  $`
      :host {
        display: block;
        padding: var(--lucarne-spacing-md) var(--lucarne-spacing-lg);
        container-type: inline-size;
      }
      .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--lucarne-spacing-xl) 0;
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-md);
        text-align: center;
      }
      .event-row {
        display: flex;
        align-items: flex-start;
        gap: var(--lucarne-spacing-md);
        padding: var(--lucarne-spacing-sm) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      .event-row:last-child {
        border-bottom: none;
      }
      .time-pill {
        flex-shrink: 0;
        min-width: 64px;
        padding: 3px 8px;
        border-radius: var(--lucarne-radius-md);
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        text-align: center;
        background: rgba(0, 0, 0, 0.06);
        color: var(--lucarne-on-surface-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }
      .time-pill.now {
        background: rgba(76, 175, 80, 0.15);
        color: #2e7d32;
      }
      .pulse-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #4caf50;
        animation: pulse 1.4s ease-in-out infinite;
        flex-shrink: 0;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.85); }
      }
      .color-bar {
        flex-shrink: 0;
        width: 4px;
        min-height: 36px;
        border-radius: var(--lucarne-radius-sm);
        align-self: stretch;
      }
      .event-content {
        flex: 1;
        min-width: 0;
      }
      .event-summary {
        font-size: var(--lucarne-fs-md);
        font-weight: 500;
        color: var(--lucarne-on-surface);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .event-secondary {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      @container (min-width: 600px) {
        :host {
          display: flex;
          flex-direction: column;
        }
      }
    `
];
be([
  u({ type: Array })
], Y.prototype, "events", 2);
be([
  u({ type: Object })
], Y.prototype, "calendarColors", 2);
be([
  u({ type: Number })
], Y.prototype, "limit", 2);
Y = be([
  E("lucarne-agenda-strip")
], Y);
const Ye = I`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`, q = I`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>`, Q = I`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`, Ge = I`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="21" x2="8" y2="19"/>
  <line x1="8" y1="19" x2="10" y2="17"/>
  <line x1="8" y1="19" x2="6" y2="17"/>
  <line x1="16" y1="21" x2="16" y2="19"/>
  <line x1="16" y1="19" x2="18" y2="17"/>
  <line x1="16" y1="19" x2="14" y2="17"/>
  <line x1="12" y1="22" x2="12" y2="20"/>
  <line x1="12" y1="20" x2="14" y2="18"/>
  <line x1="12" y1="20" x2="10" y2="18"/>
</svg>`, Vt = I`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M4.22 19.78l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="currentColor"/>
  <path d="M20 15h-1.26A6 6 0 1 0 8 20h12a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.7"/>
</svg>`;
I`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="7" r="4"/>
  <path d="M20 21a8 8 0 1 0-16 0"/>
</svg>`;
I`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"/>
</svg>`;
const Kt = I`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, Je = {
  sunny: Ye,
  "clear-night": Ye,
  cloudy: q,
  fog: q,
  hail: Q,
  lightning: Q,
  "lightning-rainy": Q,
  partlycloudy: Vt,
  pouring: Q,
  rainy: Q,
  snowy: Ge,
  "snowy-rainy": Ge,
  windy: q,
  "windy-variant": q,
  exceptional: q
};
function Ze(t) {
  return Je[t] ?? Je[t.toLowerCase()] ?? q;
}
function Yt(t) {
  if (!t.length) return m.dressingTipDefault;
  const e = t[0];
  if (e.condition.toLowerCase().includes("snow"))
    return m.dressingTipBoots;
  const r = e.temperature;
  let a;
  return r < 5 ? a = m.dressingTipHeavyCoat : r < 12 ? a = m.dressingTipCoatScarf : r < 18 ? a = m.dressingTipLightJacket : r < 24 ? a = m.dressingTipTShirt : a = m.dressingTipShorts, (e.precipitation_probability ?? 0) > 50 && (a += m.dressingTipUmbrella), a;
}
var Gt = Object.defineProperty, Jt = Object.getOwnPropertyDescriptor, Ae = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Jt(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Gt(e, s, a), a;
};
let ne = class extends y {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return d`<div class="empty-state">${m.addWeatherEntity}</div>`;
    const t = this.weatherEntity.attributes, e = t.temperature, s = t.temperature_unit ?? "°C", r = this.weatherEntity.state, a = this.forecast[0], n = this.forecast[1], i = Yt(this.forecast);
    return d`
      <div class="current">
        <span class="condition-icon">${Ze(r)}</span>
        <div class="temp-group">
          <div class="current-temp">${e !== void 0 ? `${Math.round(e)}${s}` : m.errorUnavailable}</div>
          ${a ? d`<div class="high-low">
                ↑${Math.round(a.temperature)}${s}
                ${a.templow !== void 0 ? ` ↓${Math.round(a.templow)}${s}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${n ? d`
            <div class="tomorrow-row">
              <span class="tomorrow-icon">${Ze(n.condition)}</span>
              <span>Tomorrow ↑${Math.round(n.temperature)}${s}${n.templow !== void 0 ? ` ↓${Math.round(n.templow)}${s}` : ""}</span>
            </div>
          ` : ""}
      <div class="dressing-tip">
        <span class="dressing-label">Wear:</span>
        ${i}
      </div>
    `;
  }
};
ne.styles = [
  S,
  $`
      :host {
        display: block;
        padding: var(--lucarne-spacing-md) var(--lucarne-spacing-lg);
      }
      .empty-state {
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        padding: var(--lucarne-spacing-lg) 0;
        text-align: center;
      }
      .current {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-md);
        margin-bottom: var(--lucarne-spacing-md);
      }
      .condition-icon {
        width: 48px;
        height: 48px;
        color: var(--lucarne-on-surface);
        flex-shrink: 0;
      }
      .temp-group {
        flex: 1;
      }
      .current-temp {
        font-size: var(--lucarne-fs-xl);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        line-height: 1;
      }
      .high-low {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        margin-top: 4px;
      }
      .tomorrow-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        margin-bottom: var(--lucarne-spacing-md);
        padding-bottom: var(--lucarne-spacing-md);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      }
      .tomorrow-icon {
        width: 18px;
        height: 18px;
        opacity: 0.7;
        flex-shrink: 0;
      }
      .dressing-tip {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        font-style: italic;
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-xs);
      }
      .dressing-label {
        font-weight: 600;
        font-style: normal;
        color: var(--lucarne-on-surface-muted);
      }
    `
];
Ae([
  u({ attribute: !1 })
], ne.prototype, "weatherEntity", 2);
Ae([
  u({ type: Array })
], ne.prototype, "forecast", 2);
ne = Ae([
  E("lucarne-weather-block")
], ne);
var Zt = Object.defineProperty, Qt = Object.getOwnPropertyDescriptor, Pe = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Qt(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Zt(e, s, a), a;
};
let ie = class extends y {
  constructor() {
    super(...arguments), this.items = [];
  }
  _handleMoreClick() {
    this.todoEntityId && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.todoEntityId },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    const t = this.items.filter((a) => a.status === "needs_action"), e = t.length, s = t.slice(0, 3), r = e - s.length;
    return e === 0 ? d`
        <div class="empty-state">
          <span class="empty-icon">${Kt}</span>
          ${m.allDone}
        </div>
      ` : d`
      <div class="header">
        ${m.tasksTitle}
        <span class="count-badge">${e}</span>
      </div>
      ${s.map(
      (a) => d`
          <div class="task-row">
            <span class="summary">${a.summary}</span>
            ${a.due ? d`<span class="due-chip">${this._formatDue(a.due)}</span>` : ""}
          </div>
        `
    )}
      ${r > 0 ? d`<div class="more-row" @click=${this._handleMoreClick}>
            ${m.moreItems(r)}
          </div>` : ""}
    `;
  }
  _formatDue(t) {
    const e = t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
    return isNaN(e.getTime()) ? t : e.toLocaleDateString("en", { month: "short", day: "numeric" });
  }
};
ie.styles = [
  S,
  $`
      :host {
        display: block;
        padding: var(--lucarne-spacing-md) var(--lucarne-spacing-lg);
      }
      .header {
        display: flex;
        align-items: baseline;
        gap: var(--lucarne-spacing-sm);
        margin-bottom: var(--lucarne-spacing-sm);
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: var(--lucarne-on-surface-muted);
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }
      .count-badge {
        background: var(--lucarne-color-ingrid);
        color: #5b3f7e;
        padding: 1px 7px;
        border-radius: var(--lucarne-radius-lg);
        font-size: 0.8em;
        font-weight: 700;
      }
      .task-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        padding: var(--lucarne-spacing-xs) 0;
        font-size: var(--lucarne-fs-md);
        color: var(--lucarne-on-surface);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .task-row:last-of-type {
        border-bottom: none;
      }
      .due-chip {
        font-size: 0.75em;
        color: var(--lucarne-on-surface-muted);
        background: rgba(0, 0, 0, 0.06);
        padding: 1px 6px;
        border-radius: var(--lucarne-radius-sm);
        margin-left: auto;
        white-space: nowrap;
      }
      .more-row {
        padding: var(--lucarne-spacing-xs) 0 0;
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        cursor: pointer;
        text-decoration: underline dotted;
      }
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--lucarne-spacing-sm);
        padding: var(--lucarne-spacing-lg) 0;
        color: #4caf50;
        font-size: var(--lucarne-fs-md);
      }
      .empty-icon {
        width: 28px;
        height: 28px;
        color: #4caf50;
      }
    `
];
Pe([
  u({ type: Array })
], ie.prototype, "items", 2);
Pe([
  u({ type: String })
], ie.prototype, "todoEntityId", 2);
ie = Pe([
  E("lucarne-tasks-summary")
], ie);
var Xt = Object.defineProperty, es = Object.getOwnPropertyDescriptor, vt = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? es(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Xt(e, s, a), a;
};
let me = class extends y {
  constructor() {
    super(...arguments), this.entries = [];
  }
  render() {
    return d`
      ${this.entries.map(
      (t) => d`
          <span class="pill ${t.isHome ? "home" : "away"}">
            <span class="dot"></span>
            ${t.name}
          </span>
        `
    )}
    `;
  }
};
me.styles = [
  S,
  $`
      :host {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lucarne-spacing-xs);
      }
      .pill {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 3px 10px 3px 7px;
        border-radius: var(--lucarne-radius-lg);
        font-size: var(--lucarne-fs-sm);
        font-weight: 500;
        background: var(--lucarne-surface);
        border: 1.5px solid currentColor;
        transition: opacity 0.2s;
      }
      .pill.away {
        opacity: 0.45;
      }
      .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .pill.home .dot {
        background: #4caf50;
      }
      .pill.away .dot {
        background: #9e9e9e;
      }
      .pill.home {
        color: #2e7d32;
        border-color: #a5d6a7;
      }
      .pill.away {
        color: var(--lucarne-on-surface-muted);
        border-color: #e0e0e0;
      }
    `
];
vt([
  u({ type: Array })
], me.prototype, "entries", 2);
me = vt([
  E("lucarne-presence-pills")
], me);
var ts = Object.defineProperty, ss = Object.getOwnPropertyDescriptor, J = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? ss(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && ts(e, s, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-today-card",
  name: "Lucarne Today",
  description: "Family agenda + weather + tasks + presence",
  preview: !0
});
let H = class extends y {
  constructor() {
    super(...arguments), this._calendarEvents = /* @__PURE__ */ new Map(), this._forecast = [], this._todoItems = [], this._fetchingForecast = !1, this._lastWeatherState = "";
  }
  setConfig(t) {
    if (!t.calendars || !Array.isArray(t.calendars) || t.calendars.length === 0)
      throw new Error('lucarne-today-card: "calendars" must be a non-empty array');
    for (const e of t.calendars)
      if (!e.entity || !e.color || !e.label)
        throw new Error('lucarne-today-card: each calendar entry requires "entity", "color", and "label"');
    this._config = t, this.isConnected && (this._teardownSubscriptions(), this._setupSubscriptions());
  }
  static getConfigElement() {
    return document.createElement("lucarne-today-card-editor");
  }
  static getStubConfig(t) {
    const e = Object.keys(t.states).filter((n) => n.startsWith("calendar.")).slice(0, 3), s = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], r = e.map((n, i) => {
      var o, l;
      return {
        entity: n,
        color: s[i] ?? "#a8d8b9",
        label: ((l = (o = t.states[n]) == null ? void 0 : o.attributes) == null ? void 0 : l.friendly_name) ?? n
      };
    }), a = "weather.forecast_home" in t.states;
    return {
      type: "custom:lucarne-today-card",
      title: m.today,
      calendars: r.length ? r : [{ entity: "calendar.example", color: "#a8d8b9", label: "Calendar" }],
      weather: a ? "weather.forecast_home" : void 0
    };
  }
  getCardSize() {
    return 4;
  }
  connectedCallback() {
    super.connectedCallback(), this._setupSubscriptions();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._teardownSubscriptions();
  }
  _setupSubscriptions() {
    !this._config || !this.hass || (this._fetchCalendarEvents(), this._config.weather && this._fetchForecast(), this._calendarIntervalId = setInterval(() => {
      var t;
      this._fetchCalendarEvents(), (t = this._config) != null && t.weather && this._fetchForecast();
    }, 5 * 60 * 1e3), this._config.tasks && (this._todoUnsub = Ut(this.hass, this._config.tasks, (t) => {
      this._todoItems = t;
    })));
  }
  _teardownSubscriptions() {
    var t;
    clearInterval(this._calendarIntervalId), (t = this._todoUnsub) == null || t.call(this), this._todoUnsub = void 0, this._calendarIntervalId = void 0;
  }
  updated(t) {
    var r;
    if (super.updated(t), !t.has("hass") || !this._config) return;
    if (!t.get("hass") && this.hass && !this._calendarIntervalId) {
      this._setupSubscriptions();
      return;
    }
    const s = this._config.weather;
    if (s) {
      const a = (r = this.hass.states[s]) == null ? void 0 : r.state;
      a && a !== this._lastWeatherState && (this._lastWeatherState = a, this._fetchForecast());
    }
  }
  async _fetchCalendarEvents() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.map((n) => n.entity), e = /* @__PURE__ */ new Date(), s = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), r = await ft(this.hass, t, e, s), a = /* @__PURE__ */ new Map();
    for (const [n, i] of r.entries())
      a.set(
        n,
        i.map((o) => ({ ...o, uid: `${n}::${o.uid ?? o.summary}` }))
      );
    this._calendarEvents = a;
  }
  async _fetchForecast() {
    var t, e, s;
    if (!(this._fetchingForecast || !((t = this._config) != null && t.weather) || !this.hass)) {
      this._fetchingForecast = !0;
      try {
        const r = await this.hass.connection.sendMessagePromise({
          type: "call_service",
          domain: "weather",
          service: "get_forecasts",
          service_data: { type: "daily" },
          target: { entity_id: this._config.weather },
          return_response: !0
        });
        this._forecast = ((s = (e = r == null ? void 0 : r.response) == null ? void 0 : e[this._config.weather]) == null ? void 0 : s.forecast) ?? [];
      } catch {
        this._forecast = [];
      } finally {
        this._fetchingForecast = !1;
      }
    }
  }
  get _mergedEvents() {
    const t = [];
    for (const e of this._calendarEvents.values())
      t.push(...e);
    return t;
  }
  get _calendarColorMap() {
    var e;
    const t = /* @__PURE__ */ new Map();
    for (const s of ((e = this._config) == null ? void 0 : e.calendars) ?? [])
      t.set(s.entity, s.color);
    return t;
  }
  render() {
    var s;
    if (!this._config) return d``;
    const t = this._config.weather ? (s = this.hass) == null ? void 0 : s.states[this._config.weather] : void 0, e = (this._config.presence ?? []).map((r) => {
      var a, n;
      return {
        name: r.name,
        isHome: ((n = (a = this.hass) == null ? void 0 : a.states[r.entity]) == null ? void 0 : n.state) === "on"
      };
    });
    return d`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${this._config.title ?? m.today}</h2>
          ${e.length > 0 ? d`<lucarne-presence-pills .entries=${e}></lucarne-presence-pills>` : ""}
        </div>
        <div class="card-body">
          <div class="left-col">
            <lucarne-agenda-strip
              .events=${this._mergedEvents}
              .calendarColors=${this._calendarColorMap}
              .limit=${this._config.agenda_limit ?? 5}
            ></lucarne-agenda-strip>
          </div>
          <div class="right-col">
            <div class="weather-section">
              <lucarne-weather-block
                .weatherEntity=${t}
                .forecast=${this._forecast}
              ></lucarne-weather-block>
            </div>
            ${this._config.tasks ? d`
                  <div class="tasks-section">
                    <lucarne-tasks-summary
                      .items=${this._todoItems}
                      .todoEntityId=${this._config.tasks}
                    ></lucarne-tasks-summary>
                  </div>
                ` : ""}
          </div>
        </div>
      </ha-card>
    `;
  }
};
H.styles = [
  S,
  $`
      :host {
        display: block;
        font-family: var(--primary-font-family, sans-serif);
      }
      ha-card {
        padding: 0;
        overflow: hidden;
      }
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--lucarne-spacing-lg) var(--lucarne-spacing-xl) var(--lucarne-spacing-md);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      }
      .card-title {
        font-size: var(--lucarne-fs-lg);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        margin: 0;
      }
      .card-body {
        display: grid;
        grid-template-columns: 2fr 1fr;
        min-height: 260px;
      }
      .left-col {
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        overflow: auto;
      }
      .right-col {
        display: flex;
        flex-direction: column;
      }
      .weather-section {
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        flex: 0 0 auto;
      }
      .tasks-section {
        flex: 1;
        overflow: auto;
      }
      @media (max-width: 700px) {
        .card-body {
          grid-template-columns: 1fr;
        }
        .left-col {
          border-right: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        }
        .right-col {
          flex-direction: column;
        }
      }
    `
];
J([
  u({ attribute: !1 })
], H.prototype, "hass", 2);
J([
  f()
], H.prototype, "_config", 2);
J([
  f()
], H.prototype, "_calendarEvents", 2);
J([
  f()
], H.prototype, "_forecast", 2);
J([
  f()
], H.prototype, "_todoItems", 2);
H = J([
  E("lucarne-today-card")
], H);
var Qe, Xe;
(function(t) {
  t.language = "language", t.system = "system", t.comma_decimal = "comma_decimal", t.decimal_comma = "decimal_comma", t.space_comma = "space_comma", t.none = "none";
})(Qe || (Qe = {})), function(t) {
  t.language = "language", t.system = "system", t.am_pm = "12", t.twenty_four = "24";
}(Xe || (Xe = {}));
var mt = function(t, e, s, r) {
  r = r || {}, s = s ?? {};
  var a = new Event(e, { bubbles: r.bubbles === void 0 || r.bubbles, cancelable: !!r.cancelable, composed: r.composed === void 0 || r.composed });
  return a.detail = s, t.dispatchEvent(a), a;
}, rs = Object.defineProperty, as = Object.getOwnPropertyDescriptor, Me = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? as(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && rs(e, s, a), a;
};
let oe = class extends y {
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    mt(this, "config-changed", { config: t });
  }
  _titleChanged(t) {
    const e = t.target;
    this._fire({ ...this._config, title: e.value || void 0 });
  }
  _weatherChanged(t) {
    var e;
    this._fire({ ...this._config, weather: ((e = t.detail) == null ? void 0 : e.value) ?? void 0 });
  }
  _tasksChanged(t) {
    var e;
    this._fire({ ...this._config, tasks: ((e = t.detail) == null ? void 0 : e.value) ?? void 0 });
  }
  _agendaLimitChanged(t) {
    const e = t.target, s = parseInt(e.value, 10);
    this._fire({ ...this._config, agenda_limit: isNaN(s) ? void 0 : Math.min(10, Math.max(1, s)) });
  }
  _calEntityChanged(t, e) {
    var r, a;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], entity: ((a = e.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, calendars: s });
  }
  _calColorChanged(t, e) {
    var r;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], color: e.target.value }, this._fire({ ...this._config, calendars: s });
  }
  _calLabelChanged(t, e) {
    var r;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], label: e.target.value }, this._fire({ ...this._config, calendars: s });
  }
  _removeCalendar(t) {
    var s;
    const e = [...((s = this._config) == null ? void 0 : s.calendars) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, calendars: e }));
  }
  _addCalendar() {
    var a, n, i, o;
    const t = Object.keys(((a = this.hass) == null ? void 0 : a.states) ?? {}).find((l) => l.startsWith("calendar.")), e = t ?? "calendar.example", s = t ? ((i = (n = this.hass.states[t]) == null ? void 0 : n.attributes) == null ? void 0 : i.friendly_name) ?? "Calendar" : "Calendar", r = [
      ...((o = this._config) == null ? void 0 : o.calendars) ?? [],
      { entity: e, color: "#a8d8b9", label: s }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  _presenceEntityChanged(t, e) {
    var r, a;
    const s = [...((r = this._config) == null ? void 0 : r.presence) ?? []];
    s[t] = { ...s[t], entity: ((a = e.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, presence: s });
  }
  _presenceNameChanged(t, e) {
    var r;
    const s = [...((r = this._config) == null ? void 0 : r.presence) ?? []];
    s[t] = { ...s[t], name: e.target.value }, this._fire({ ...this._config, presence: s });
  }
  _removePresence(t) {
    var s;
    const e = [...((s = this._config) == null ? void 0 : s.presence) ?? []];
    e.splice(t, 1), this._fire({ ...this._config, presence: e });
  }
  _addPresence() {
    var e;
    const t = [...((e = this._config) == null ? void 0 : e.presence) ?? [], { entity: "", name: "" }];
    this._fire({ ...this._config, presence: t });
  }
  render() {
    if (!this._config) return d``;
    const t = this._config.calendars ?? [], e = this._config.presence ?? [];
    return d`
      <div class="section-label">General</div>
      <ha-textfield
        label="Card title"
        .value=${this._config.title ?? ""}
        @change=${this._titleChanged}
      ></ha-textfield>
      <ha-textfield
        label="Agenda limit (1–10)"
        type="number"
        min="1"
        max="10"
        .value=${String(this._config.agenda_limit ?? 5)}
        @change=${this._agendaLimitChanged}
      ></ha-textfield>

      <div class="section-label">Weather</div>
      <ha-entity-picker
        label="Weather entity"
        .hass=${this.hass}
        .value=${this._config.weather ?? ""}
        .includeDomains=${["weather"]}
        allow-custom-entity
        @value-changed=${this._weatherChanged}
      ></ha-entity-picker>

      <div class="section-label">Tasks</div>
      <ha-entity-picker
        label="Todo entity (Ingrid's tasks)"
        .hass=${this.hass}
        .value=${this._config.tasks ?? ""}
        .includeDomains=${["todo"]}
        allow-custom-entity
        @value-changed=${this._tasksChanged}
      ></ha-entity-picker>

      <div class="section-label">Calendars</div>
      ${t.map(
      (s, r) => d`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${s.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(a) => this._calEntityChanged(r, a)}
            ></ha-entity-picker>
            <ha-textfield
              label="Label"
              .value=${s.label}
              @change=${(a) => this._calLabelChanged(r, a)}
            ></ha-textfield>
            <input
              type="color"
              class="cal-color"
              .value=${s.color}
              @input=${(a) => this._calColorChanged(r, a)}
              title="Calendar color"
            />
            <button class="remove" @click=${() => this._removeCalendar(r)} title="Remove">✕</button>
          </div>
        `
    )}
      <button class="add" @click=${this._addCalendar}>+ Add calendar</button>

      <div class="section-label">Presence</div>
      ${e.map(
      (s, r) => d`
          <div class="presence-row">
            <ha-entity-picker
              label="Entity"
              .hass=${this.hass}
              .value=${s.entity}
              .includeDomains=${["input_boolean"]}
              allow-custom-entity
              @value-changed=${(a) => this._presenceEntityChanged(r, a)}
            ></ha-entity-picker>
            <ha-textfield
              label="Display name"
              .value=${s.name}
              @change=${(a) => this._presenceNameChanged(r, a)}
            ></ha-textfield>
            <button class="remove" @click=${() => this._removePresence(r)} title="Remove">✕</button>
          </div>
        `
    )}
      <button class="add" @click=${this._addPresence}>+ Add person</button>
    `;
  }
};
oe.styles = [
  S,
  $`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-md);
        padding: var(--lucarne-spacing-lg);
      }
      .section-label {
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: var(--lucarne-on-surface-muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin: var(--lucarne-spacing-md) 0 var(--lucarne-spacing-xs);
      }
      .section-label:first-of-type {
        margin-top: 0;
      }
      .row {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        align-items: flex-start;
      }
      .row > * {
        flex: 1;
      }
      .cal-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto auto;
        gap: var(--lucarne-spacing-sm);
        align-items: center;
        padding: var(--lucarne-spacing-xs) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      .cal-color {
        width: 32px;
        height: 32px;
        border-radius: var(--lucarne-radius-sm);
        border: 1px solid rgba(0, 0, 0, 0.2);
        cursor: pointer;
        flex-shrink: 0;
      }
      .presence-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: var(--lucarne-spacing-sm);
        align-items: center;
        padding: var(--lucarne-spacing-xs) 0;
      }
      button.remove {
        background: none;
        border: none;
        color: var(--error-color, #f44336);
        cursor: pointer;
        font-size: 1.1em;
        padding: 4px 8px;
        border-radius: var(--lucarne-radius-sm);
      }
      button.add {
        background: none;
        border: 1px dashed rgba(0, 0, 0, 0.2);
        border-radius: var(--lucarne-radius-md);
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-md);
        cursor: pointer;
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        width: 100%;
        text-align: center;
        margin-top: var(--lucarne-spacing-xs);
      }
      button.add:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    `
];
Me([
  u({ attribute: !1 })
], oe.prototype, "hass", 2);
Me([
  f()
], oe.prototype, "_config", 2);
oe = Me([
  E("lucarne-today-card-editor")
], oe);
function Te(t, e) {
  const s = new Date(t), n = (s.getDay() - (e === "monday" ? 1 : 0) + 7) % 7;
  return s.setDate(s.getDate() - n), s.setHours(0, 0, 0, 0), s;
}
function ns(t, e) {
  const s = Te(t, e), r = new Date(s);
  return r.setDate(r.getDate() + 6), r.setHours(23, 59, 59, 999), r;
}
function is(t) {
  const e = [];
  for (let s = 0; s < 7; s++) {
    const r = new Date(t);
    r.setDate(t.getDate() + s), r.setHours(0, 0, 0, 0), e.push(r);
  }
  return e;
}
function et(t, e) {
  const s = parseInt(t.split(":")[0], 10), r = parseInt(e.split(":")[0], 10), a = [];
  for (let n = s; n <= r; n++)
    a.push(n);
  return a;
}
function os(t, e, s) {
  const [r, a] = e.split(":").map(Number), [n, i] = s.split(":").map(Number), o = new Date(t);
  o.setHours(r, a, 0, 0);
  const l = new Date(t);
  return l.setHours(n, i, 0, 0), { bandStartMs: o.getTime(), bandEndMs: l.getTime() };
}
function ls(t, e, s, r) {
  const a = tt(t.start).getTime(), n = tt(t.end).getTime(), { bandStartMs: i, bandEndMs: o } = os(e, s, r), l = Math.max(a, i), c = Math.min(n, o);
  return l >= c ? null : { start: new Date(l), end: new Date(c) };
}
function tt(t) {
  return t.length === 10 && !t.includes("T") ? /* @__PURE__ */ new Date(`${t}T00:00:00`) : new Date(t);
}
function cs(t) {
  return t.start.length === 10 && !t.start.includes("T");
}
function pe(t) {
  const e = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
  return `${e}-${s}-${r}`;
}
function ds(t) {
  if (t.length === 0) return [];
  const e = t.map((l, c) => ({ ...l, _idx: c }));
  e.sort((l, c) => l.start.getTime() - c.start.getTime());
  const s = [], r = new Array(t.length);
  for (const l of e) {
    const c = l.start.getTime();
    let h = s.findIndex((g) => g <= c);
    h === -1 ? (h = s.length, s.push(l.end.getTime())) : s[h] = l.end.getTime(), r[l._idx] = h;
  }
  const a = new Array(t.length), n = [];
  let i = 0, o = e[0].end.getTime();
  a[e[0]._idx] = 0, n.push(r[e[0]._idx]);
  for (let l = 1; l < e.length; l++) {
    const c = e[l];
    c.start.getTime() >= o ? (i++, n.push(0), o = c.end.getTime()) : o = Math.max(o, c.end.getTime()), a[c._idx] = i, n[i] = Math.max(n[i], r[c._idx]);
  }
  return r.map((l, c) => ({
    lane: l,
    laneCount: n[a[c]] + 1
  }));
}
function ue(t, e) {
  const [s, r] = e.split(":").map(Number), a = new Date(t);
  return a.setHours(s, r, 0, 0), a.getTime();
}
function hs(t, e, s, r, a) {
  const n = is(Te(e, a)), i = /* @__PURE__ */ new Map();
  for (const o of n)
    i.set(pe(o), { allDay: [], inBand: [], earlier: [], later: [] });
  for (const o of t) {
    if (cs(o)) {
      const h = /* @__PURE__ */ new Date(o.start + "T00:00:00"), g = /* @__PURE__ */ new Date(o.end + "T00:00:00");
      for (const v of n) {
        const p = pe(v), _ = i.get(p);
        v >= h && v < g && _.allDay.push(o);
      }
      continue;
    }
    const l = new Date(o.start), c = new Date(o.end);
    for (const h of n) {
      const g = pe(h), v = i.get(g), p = new Date(h);
      p.setHours(0, 0, 0, 0);
      const _ = new Date(h);
      if (_.setHours(23, 59, 59, 999), c <= p || l > _) continue;
      const A = ue(h, s), k = ue(h, r);
      if (c.getTime() <= A)
        v.earlier.push(o);
      else if (l.getTime() >= k)
        v.later.push(o);
      else {
        const W = ls(o, h, s, r);
        if (W) {
          const Ie = k - A, ze = (W.start.getTime() - A) / Ie * 100, _t = (W.end.getTime() - W.start.getTime()) / Ie * 100;
          v.inBand.push({
            event: o,
            lane: 0,
            laneCount: 1,
            topPercent: Math.max(0, Math.min(100, ze)),
            heightPercent: Math.max(0, Math.min(100 - ze, _t))
          });
        }
      }
    }
  }
  for (const o of n) {
    const l = pe(o), c = i.get(l);
    if (c.inBand.length === 0) continue;
    const h = ue(o, s), v = ue(o, r) - h, p = c.inBand.map((A) => {
      const k = h + A.topPercent / 100 * v, W = k + A.heightPercent / 100 * v;
      return {
        event: A.event,
        start: new Date(k),
        end: new Date(W),
        lane: 0
      };
    }), _ = ds(p);
    c.inBand = c.inBand.map((A, k) => ({
      ...A,
      lane: _[k].lane,
      laneCount: _[k].laneCount
    }));
  }
  return { weekDays: n, perDay: i };
}
var ps = Object.defineProperty, us = Object.getOwnPropertyDescriptor, Oe = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? us(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && ps(e, s, a), a;
};
let le = class extends y {
  constructor() {
    super(...arguments), this.calendars = [], this.visibleIds = /* @__PURE__ */ new Set();
  }
  _toggle(t) {
    const e = new Set(this.visibleIds);
    e.has(t) ? e.delete(t) : e.add(t), this.dispatchEvent(new CustomEvent("visibility-change", { detail: e, bubbles: !0, composed: !0 }));
  }
  render() {
    return d`
      ${this.calendars.map(
      (t) => d`
          <button
            class="pill ${this.visibleIds.has(t.entity) ? "visible" : "hidden"}"
            style="background: ${this.visibleIds.has(t.entity) ? t.color + "33" : "transparent"}"
            @click=${() => this._toggle(t.entity)}
            aria-pressed=${this.visibleIds.has(t.entity)}
            aria-label="${t.label}"
          >
            <span class="dot" style="background: ${t.color}"></span>
            <span class="label">${t.label}</span>
          </button>
        `
    )}
    `;
  }
};
le.styles = [
  S,
  $`
      :host {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lucarne-spacing-xs);
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-xl);
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: var(--lucarne-fs-sm);
        cursor: pointer;
        user-select: none;
        transition: opacity 0.15s, background 0.15s;
        border: 1.5px solid transparent;
        min-height: 44px;
        box-sizing: border-box;
      }
      .pill.visible {
        opacity: 1;
        border-color: transparent;
      }
      .pill.hidden {
        opacity: 0.45;
        text-decoration: line-through;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .label {
        white-space: nowrap;
        font-weight: 500;
        color: var(--lucarne-on-surface);
      }
    `
];
Oe([
  u({ type: Array })
], le.prototype, "calendars", 2);
Oe([
  u({ type: Object })
], le.prototype, "visibleIds", 2);
le = Oe([
  E("lucarne-visibility-pills")
], le);
var gs = Object.defineProperty, fs = Object.getOwnPropertyDescriptor, B = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? fs(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && gs(e, s, a), a;
};
function st(t) {
  return t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
}
let P = class extends y {
  constructor() {
    super(...arguments), this.color = "#a8d8b9", this.lane = 0, this.laneCount = 1, this.topPercent = 0, this.heightPercent = 10;
  }
  _handleClick(t) {
    t.stopPropagation(), this.dispatchEvent(
      new CustomEvent("lucarne-event-tap", {
        detail: { event: this.event, color: this.color },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    const t = new Date(this.event.start), e = new Date(this.event.end), s = `${st(t)}–${st(e)}`, r = this.event.pending ? "0.5" : "1";
    return d`
      <div @click=${this._handleClick} style="height:100%;width:100%;overflow:hidden;opacity:${r}">
        <div class="event-summary">${this.event.summary}</div>
        <div class="event-time">${s}</div>
      </div>
    `;
  }
};
P.styles = [
  S,
  $`
      :host {
        /* Position/size is controlled by inline style from the parent day column.
         * display:block so the host fills its inline-style-determined box. */
        display: block;
        overflow: hidden;
        cursor: pointer;
        border-radius: var(--lucarne-radius-sm);
        border-left: 3px solid transparent;
        transition: filter 0.1s;
        box-sizing: border-box;
        padding: 2px 4px;
      }
      :host(:hover) {
        filter: brightness(0.92);
        z-index: 10;
      }
      .event-summary {
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: rgba(0, 0, 0, 0.8);
        line-height: 1.2;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal;
        word-break: break-word;
      }
      .event-time {
        font-size: 0.7rem;
        color: rgba(0, 0, 0, 0.55);
        line-height: 1.1;
        margin-top: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `
];
B([
  u({ type: Object })
], P.prototype, "event", 2);
B([
  u({ type: String })
], P.prototype, "color", 2);
B([
  u({ type: Number })
], P.prototype, "lane", 2);
B([
  u({ type: Number })
], P.prototype, "laneCount", 2);
B([
  u({ type: Number })
], P.prototype, "topPercent", 2);
B([
  u({ type: Number })
], P.prototype, "heightPercent", 2);
P = B([
  E("lucarne-calendar-event-block")
], P);
var vs = Object.defineProperty, ms = Object.getOwnPropertyDescriptor, he = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? ms(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && vs(e, s, a), a;
};
let U = class extends y {
  constructor() {
    super(...arguments), this.events = [], this.label = "earlier", this.eventColors = /* @__PURE__ */ new Map(), this._open = !1;
  }
  _formatTime(t) {
    return new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
  }
  _openPopover(t) {
    t.stopPropagation(), this._chipEl = t.currentTarget, this._open = !0;
  }
  _close() {
    this._open = !1;
  }
  _tapEvent(t, e) {
    t.stopPropagation(), this._close(), this.dispatchEvent(
      new CustomEvent("lucarne-event-tap", {
        detail: { event: e, color: this.eventColors.get(e.uid ?? "") ?? "#a8d8b9" },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    if (this.events.length === 0) return d``;
    const t = this._chipEl;
    let e = 0, s = 0;
    if (t) {
      const r = t.getBoundingClientRect();
      e = r.bottom + 4, s = r.left;
    }
    return d`
      <button class="stub-chip" @click=${this._openPopover}>
        +${this.events.length} ${this.label}
      </button>

      ${this._open ? d`
            <div class="backdrop" @click=${this._close}></div>
            <div class="mini-popover" style="top:${e}px;left:${s}px;">
              <div class="mini-title">${this.label}</div>
              ${this.events.map(
      (r) => d`
                  <div class="mini-event" @click=${(a) => this._tapEvent(a, r)}>
                    <span class="mini-event-summary">${r.summary}</span>
                    <span class="mini-event-time">${this._formatTime(r.start)}</span>
                  </div>
                `
    )}
            </div>
          ` : ""}
    `;
  }
};
U.styles = [
  S,
  $`
      :host {
        display: block;
      }
      .stub-chip {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 8px;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.07);
        color: var(--lucarne-on-surface-muted);
        min-height: 44px;
        box-sizing: border-box;
        border: none;
        width: 100%;
        justify-content: center;
      }
      .stub-chip:hover {
        background: rgba(0, 0, 0, 0.12);
      }
      .backdrop {
        position: fixed;
        inset: 0;
        z-index: 100;
      }
      .mini-popover {
        position: fixed;
        z-index: 101;
        background: var(--lucarne-surface);
        border-radius: var(--lucarne-radius-md);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
        padding: var(--lucarne-spacing-md);
        min-width: 220px;
        max-width: 320px;
        max-height: 60vh;
        overflow-y: auto;
      }
      .mini-title {
        font-size: var(--lucarne-fs-sm);
        font-weight: 700;
        color: var(--lucarne-on-surface-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--lucarne-spacing-sm);
      }
      .mini-event {
        display: flex;
        flex-direction: column;
        padding: var(--lucarne-spacing-sm) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        cursor: pointer;
        min-height: 44px;
        justify-content: center;
      }
      .mini-event:last-child {
        border-bottom: none;
      }
      .mini-event:hover {
        background: rgba(0, 0, 0, 0.04);
        border-radius: var(--lucarne-radius-sm);
      }
      .mini-event-summary {
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: var(--lucarne-on-surface);
      }
      .mini-event-time {
        font-size: 0.7rem;
        color: var(--lucarne-on-surface-muted);
      }
    `
];
he([
  u({ type: Array })
], U.prototype, "events", 2);
he([
  u({ type: String })
], U.prototype, "label", 2);
he([
  u({ type: Object })
], U.prototype, "eventColors", 2);
he([
  f()
], U.prototype, "_open", 2);
U = he([
  E("lucarne-out-of-band-stub")
], U);
var _s = Object.defineProperty, bs = Object.getOwnPropertyDescriptor, R = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? bs(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && _s(e, s, a), a;
};
function rt(t) {
  const e = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
  return `${e}-${s}-${r}`;
}
function at(t, e) {
  return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
}
let M = class extends y {
  constructor() {
    super(...arguments), this.layout = null, this.bandStart = "07:00", this.bandEnd = "21:00", this.calendars = [], this.hourHeightPx = 60, this.showCreateButton = !1;
  }
  get _colorMap() {
    const t = /* @__PURE__ */ new Map();
    for (const e of this.calendars) t.set(e.entity, e.color);
    return t;
  }
  _eventColor(t) {
    var s;
    const e = this._colorMap;
    if ((s = t.uid) != null && s.includes("::")) {
      const r = t.uid.split("::")[0];
      return e.get(r) ?? "#a8d8b9";
    }
    return "#a8d8b9";
  }
  _onBandClick(t, e) {
    if (!this.showCreateButton) return;
    const r = t.currentTarget.getBoundingClientRect(), [a] = this.bandStart.split(":").map(Number), [n] = this.bandEnd.split(":").map(Number), i = n - a, o = Math.max(0, Math.min(1, (t.clientY - r.top) / r.height)), l = a + o * i, c = Math.min(n - 1, Math.round(l * 2) / 2);
    this.dispatchEvent(
      new CustomEvent("lucarne-create-event-tap", {
        detail: { day: e, startHour: c },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _buildEventColorMap(t) {
    const e = /* @__PURE__ */ new Map();
    for (const s of t)
      e.set(s.uid ?? "", this._eventColor(s));
    return e;
  }
  _renderDayColumn(t, e) {
    if (!this.layout) return d``;
    const s = rt(t), r = this.layout.perDay.get(s);
    if (!r) return d``;
    const a = et(this.bandStart, this.bandEnd), i = (a.length - 1) * this.hourHeightPx, o = at(t, e), [l] = this.bandStart.split(":").map(Number), [c] = this.bandEnd.split(":").map(Number), h = (c - l) * 36e5;
    let g = null;
    if (o) {
      const p = new Date(t);
      p.setHours(l, 0, 0, 0);
      const _ = new Date(t);
      _.setHours(c, 0, 0, 0), e >= p && e <= _ && (g = (e.getTime() - p.getTime()) / h * 100);
    }
    const v = this._buildEventColorMap([...r.inBand.map((p) => p.event), ...r.earlier, ...r.later]);
    return d`
      <div class="day-col-wrapper">
        ${r.earlier.length > 0 ? d`
              <div class="stub-area-top">
                <lucarne-out-of-band-stub
                  .events=${r.earlier}
                  label="earlier"
                  .eventColors=${v}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}

        <div
          class="day-col"
          style="height:${i}px${this.showCreateButton ? "; cursor: crosshair" : ""}"
          @click=${(p) => this._onBandClick(p, t)}
        >
          ${a.slice(0, -1).map(
      (p, _) => d`
              <div
                class="hour-line"
                style="top: ${(_ + 1) / (a.length - 1) * 100}%"
              ></div>
            `
    )}

          ${g !== null ? d`<div class="now-line" style="top:${g}%"></div>` : ""}

          ${r.inBand.map((p) => {
      const _ = 100 / p.laneCount, A = p.lane / p.laneCount * 100, k = this._eventColor(p.event);
      return d`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${p.topPercent}%;
                  left: calc(${A}% + 1px);
                  width: calc(${_}% - 2px);
                  height: ${p.heightPercent}%;
                  z-index: ${p.lane + 1};
                  background: ${k}cc;
                  border-left-color: ${k};
                "
                .event=${p.event}
                .color=${k}
                .lane=${p.lane}
                .laneCount=${p.laneCount}
                .topPercent=${p.topPercent}
                .heightPercent=${p.heightPercent}
              ></lucarne-calendar-event-block>
            `;
    })}
        </div>

        ${r.later.length > 0 ? d`
              <div class="stub-area-bottom">
                <lucarne-out-of-band-stub
                  .events=${r.later}
                  label="tonight"
                  .eventColors=${v}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}
      </div>
    `;
  }
  render() {
    if (!this.layout) return d`<div>Loading…</div>`;
    const t = /* @__PURE__ */ new Date(), e = et(this.bandStart, this.bandEnd), r = (e.length - 1) * this.hourHeightPx, a = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    return d`
      <div class="grid-wrapper">
        <!-- Header row -->
        <div class="header-spacer"></div>
        ${this.layout.weekDays.map(
      (n, i) => d`
            <div
              class="day-header ${at(n, t) ? "today" : ""}"
              style="grid-column: ${i + 2}"
            >
              <div>${a.format(n).toUpperCase()}</div>
              <div class="day-num">${n.getDate()}</div>
            </div>
          `
    )}

        <!-- All-day row -->
        <div class="allday-spacer">all-day</div>
        ${this.layout.weekDays.map((n, i) => {
      const o = rt(n), l = this.layout.perDay.get(o);
      return d`
            <div class="allday-cell" style="grid-column: ${i + 2}">
              ${((l == null ? void 0 : l.allDay) ?? []).map(
        (c) => d`
                  <div
                    class="allday-event"
                    style="background: ${this._eventColor(c)}cc"
                    @click=${(h) => {
          h.stopPropagation(), this.dispatchEvent(
            new CustomEvent("lucarne-event-tap", {
              detail: { event: c, color: this._eventColor(c) },
              bubbles: !0,
              composed: !0
            })
          );
        }}
                  >
                    ${c.summary}
                  </div>
                `
      )}
            </div>
          `;
    })}

        <!-- Time column -->
        <div class="time-col" style="height:${r}px; grid-row:3; grid-column:1">
          ${e.map(
      (n, i) => d`
              <div
                class="hour-label"
                style="top: ${i / (e.length - 1) * 100}%"
              >
                ${n === 0 || n === 24 ? "12 AM" : n < 12 ? `${n} AM` : n === 12 ? "12 PM" : `${n - 12} PM`}
              </div>
            `
    )}
        </div>

        <!-- Day columns -->
        ${this.layout.weekDays.map((n, i) => d`
          <div style="grid-row:3; grid-column:${i + 2}; position:relative; overflow:visible; display:flex; flex-direction:column;">
            ${this._renderDayColumn(n, t)}
          </div>
        `)}
      </div>
    `;
  }
};
M.styles = [
  S,
  $`
      :host {
        display: block;
        overflow: auto;
        position: relative;
      }
      .grid-wrapper {
        display: grid;
        grid-template-columns: 48px repeat(7, 1fr);
        grid-template-rows: auto auto 1fr;
        min-width: 600px;
      }
      /* Header row: day names */
      .header-spacer {
        grid-column: 1;
        grid-row: 1;
      }
      .day-header {
        grid-row: 1;
        text-align: center;
        padding: var(--lucarne-spacing-sm) 2px;
        font-size: var(--lucarne-fs-sm);
        font-weight: 700;
        color: var(--lucarne-on-surface-muted);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        user-select: none;
      }
      .day-header .day-num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        font-size: var(--lucarne-fs-md);
        font-weight: 700;
        margin-top: 2px;
      }
      .day-header.today .day-num {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }
      /* All-day row */
      .allday-spacer {
        grid-column: 1;
        grid-row: 2;
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        font-size: 0.65rem;
        color: var(--lucarne-on-surface-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
        min-height: 24px;
      }
      .allday-cell {
        grid-row: 2;
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        border-right: 1px solid rgba(0, 0, 0, 0.05);
        padding: 2px 1px;
        min-height: 24px;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
      .allday-event {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 1px 4px;
        border-radius: 3px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: rgba(0, 0, 0, 0.8);
      }
      /* Time grid */
      .time-col {
        grid-column: 1;
        grid-row: 3;
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        position: relative;
      }
      .hour-label {
        position: absolute;
        right: 6px;
        font-size: 0.68rem;
        color: var(--lucarne-on-surface-muted);
        transform: translateY(-50%);
        white-space: nowrap;
        user-select: none;
      }
      .day-col {
        grid-row: 3;
        position: relative;
        border-right: 1px solid rgba(0, 0, 0, 0.05);
        overflow: visible;
      }
      .hour-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(0, 0, 0, 0.06);
        pointer-events: none;
      }
      .now-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background: #e53935;
        z-index: 5;
        pointer-events: none;
      }
      .now-line::before {
        content: '';
        position: absolute;
        left: -4px;
        top: -4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #e53935;
      }
      .day-col-wrapper {
        display: flex;
        flex-direction: column;
      }
      .stub-area-top {
        padding: 2px 2px 0;
        flex-shrink: 0;
      }
      .stub-area-bottom {
        padding: 0 2px 2px;
        flex-shrink: 0;
      }
    `
];
R([
  u({ type: Object })
], M.prototype, "layout", 2);
R([
  u({ type: String })
], M.prototype, "bandStart", 2);
R([
  u({ type: String })
], M.prototype, "bandEnd", 2);
R([
  u({ type: Array })
], M.prototype, "calendars", 2);
R([
  u({ type: Number })
], M.prototype, "hourHeightPx", 2);
R([
  u({ type: Boolean })
], M.prototype, "showCreateButton", 2);
M = R([
  E("lucarne-calendar-grid")
], M);
var ys = Object.defineProperty, ws = Object.getOwnPropertyDescriptor, ye = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? ws(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && ys(e, s, a), a;
};
function $s(t) {
  return new Date(t).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: !0
  });
}
let G = class extends y {
  constructor() {
    super(...arguments), this.event = null, this.color = "#a8d8b9", this.calendarLabel = "";
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  render() {
    var n;
    if (!this.event) return d``;
    const t = this.event, s = t.start.length === 10 && !t.start.includes("T") ? "All day" : `${$s(t.start)} – ${new Date(t.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 })}`, r = (n = t.uid) != null && n.includes("::") ? t.uid.split("::").slice(1).join("::") : t.uid, a = r && r.length > 0 ? `https://calendar.google.com/calendar/u/0/r/eventedit/${encodeURIComponent(r)}` : null;
    return d`
      <div class="backdrop" @click=${this._close}></div>
      <div class="popover" role="dialog" aria-modal="true">
        <div class="popover-header">
          <span class="color-dot" style="background:${this.color}"></span>
          <span class="event-title">${t.summary}</span>
          <button class="close-btn" @click=${this._close} aria-label="Close">✕</button>
        </div>

        <div class="detail-row">
          <em class="detail-icon">⏰</em>
          <span class="detail-text">${s}</span>
        </div>

        ${this.calendarLabel ? d`
              <div class="detail-row">
                <em class="detail-icon">📅</em>
                <span class="calendar-label detail-text">
                  <span
                    style="width:8px;height:8px;border-radius:50%;background:${this.color};display:inline-block;flex-shrink:0"
                  ></span>
                  ${this.calendarLabel}
                </span>
              </div>
            ` : ""}

        ${t.location ? d`
              <div class="detail-row">
                <em class="detail-icon">📍</em>
                <span class="detail-text">${t.location}</span>
              </div>
            ` : ""}

        ${t.description ? d`
              <div class="detail-row">
                <em class="detail-icon">📝</em>
                <span class="detail-text">${t.description}</span>
              </div>
            ` : ""}

        ${a ? d`
              <a class="ext-link" href="${a}" target="_blank" rel="noopener noreferrer">
                Open in Google Calendar ↗
              </a>
            ` : ""}
      </div>
    `;
  }
};
G.styles = [
  S,
  $`
      :host {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 200;
      }
      .backdrop {
        position: absolute;
        inset: 0;
      }
      .popover {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--lucarne-surface);
        border-radius: var(--lucarne-radius-lg);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        padding: var(--lucarne-spacing-xl);
        min-width: 280px;
        max-width: min(480px, 90vw);
        z-index: 1;
      }
      .popover-header {
        display: flex;
        align-items: flex-start;
        gap: var(--lucarne-spacing-md);
        margin-bottom: var(--lucarne-spacing-md);
      }
      .color-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
        margin-top: 4px;
      }
      .event-title {
        font-size: var(--lucarne-fs-lg);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        line-height: 1.3;
      }
      .close-btn {
        margin-left: auto;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.25rem;
        color: var(--lucarne-on-surface-muted);
        padding: 4px;
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--lucarne-radius-sm);
      }
      .close-btn:hover {
        background: rgba(0, 0, 0, 0.06);
      }
      .detail-row {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        align-items: flex-start;
        margin-bottom: var(--lucarne-spacing-sm);
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        line-height: 1.4;
      }
      .detail-icon {
        flex-shrink: 0;
        font-style: normal;
        width: 18px;
        text-align: center;
      }
      .detail-text {
        color: var(--lucarne-on-surface);
      }
      .calendar-label {
        font-size: var(--lucarne-fs-sm);
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }
      .ext-link {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: var(--primary-color, #03a9f4);
        text-decoration: none;
        font-size: var(--lucarne-fs-sm);
        margin-top: var(--lucarne-spacing-md);
        min-height: 44px;
      }
    `
];
ye([
  u({ type: Object })
], G.prototype, "event", 2);
ye([
  u({ type: String })
], G.prototype, "color", 2);
ye([
  u({ type: String })
], G.prototype, "calendarLabel", 2);
G = ye([
  E("lucarne-calendar-event-popover")
], G);
var xs = Object.defineProperty, Cs = Object.getOwnPropertyDescriptor, x = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Cs(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && xs(e, s, a), a;
};
function nt(t, e) {
  const r = -(/* @__PURE__ */ new Date(`${t}T${e}:00`)).getTimezoneOffset(), a = r >= 0 ? "+" : "-", n = Math.floor(Math.abs(r) / 60).toString().padStart(2, "0"), i = (Math.abs(r) % 60).toString().padStart(2, "0");
  return `${t}T${e}:00${a}${n}:${i}`;
}
function it(t) {
  return `${Math.floor(t).toString().padStart(2, "0")}:${t % 1 === 0.5 ? "30" : "00"}`;
}
function ot(t) {
  const e = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
  return `${e}-${s}-${r}`;
}
let w = class extends y {
  constructor() {
    super(...arguments), this.day = null, this.startHour = 9, this.calendars = [], this._title = "", this._calendarEntityId = "", this._date = "", this._startTime = "", this._endTime = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
  }
  updated(t) {
    super.updated(t), (t.has("day") || t.has("startHour")) && this._initDefaults();
  }
  _initDefaults() {
    var s;
    const t = this.day ?? /* @__PURE__ */ new Date();
    this._date = ot(t), this._startTime = it(Math.max(0, Math.min(23, this.startHour)));
    const e = Math.min(24, this.startHour + 1);
    this._endTime = it(e < 24 ? e : 23.5), this._calendarEntityId = ((s = this.calendars[0]) == null ? void 0 : s.entity) ?? "", this._title = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  async _create() {
    if (this._saving) return;
    if (!this._title.trim()) {
      this._error = "Title is required";
      return;
    }
    if (!this._allDay && this._startTime >= this._endTime) {
      this._error = "End time must be after start time";
      return;
    }
    this._saving = !0, this._error = "";
    const t = { summary: this._title.trim() };
    this._description.trim() && (t.description = this._description.trim()), this._location.trim() && (t.location = this._location.trim());
    let e, s;
    if (this._allDay) {
      t.start_date = this._date;
      const r = /* @__PURE__ */ new Date(`${this._date}T00:00:00`);
      r.setDate(r.getDate() + 1);
      const a = ot(r);
      t.end_date = a, e = this._date, s = a;
    } else {
      const r = nt(this._date, this._startTime), a = nt(this._date, this._endTime);
      t.start_date_time = r, t.end_date_time = a, e = r, s = a;
    }
    try {
      await this.hass.callService("calendar", "create_event", t, {
        entity_id: this._calendarEntityId
      });
    } catch (r) {
      this._error = r instanceof Error ? r.message : "Failed to create event", this._saving = !1;
      return;
    }
    this.dispatchEvent(
      new CustomEvent("lucarne-event-created", {
        detail: {
          entityId: this._calendarEntityId,
          event: {
            summary: this._title.trim(),
            start: e,
            end: s,
            description: this._description.trim() || void 0,
            location: this._location.trim() || void 0,
            uid: `${this._calendarEntityId}::`,
            pending: !0
          }
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    return this.calendars.length ? d`
      <div class="backdrop" @click=${this._close}></div>
      <div class="popover" role="dialog" aria-modal="true" aria-label="Create event">
        <div class="popover-header">
          <h2 class="popover-title">New Event</h2>
          <button class="close-btn" @click=${this._close} aria-label="Cancel">✕</button>
        </div>

        <div class="field">
          <label for="ce-title">Title *</label>
          <input
            id="ce-title"
            type="text"
            placeholder="Event title"
            .value=${this._title}
            @input=${(t) => this._title = t.target.value}
            @keydown=${(t) => t.key === "Enter" && this._create()}
          />
        </div>

        <div class="field">
          <label for="ce-calendar">Calendar</label>
          <select
            id="ce-calendar"
            .value=${this._calendarEntityId}
            @change=${(t) => this._calendarEntityId = t.target.value}
          >
            ${this.calendars.map(
      (t) => d`<option value=${t.entity}>${t.label}</option>`
    )}
          </select>
        </div>

        <div class="field">
          <label for="ce-date">Date</label>
          <input
            id="ce-date"
            type="date"
            .value=${this._date}
            @change=${(t) => this._date = t.target.value}
          />
        </div>

        <div class="allday-row">
          <input
            id="ce-allday"
            type="checkbox"
            .checked=${this._allDay}
            @change=${(t) => this._allDay = t.target.checked}
          />
          <label for="ce-allday" style="margin:0; font-weight:400; color:var(--lucarne-on-surface)">All day</label>
        </div>

        ${this._allDay ? "" : d`
              <div class="time-row">
                <div class="field">
                  <label for="ce-start">Start</label>
                  <input
                    id="ce-start"
                    type="time"
                    .value=${this._startTime}
                    @change=${(t) => this._startTime = t.target.value}
                  />
                </div>
                <div class="field">
                  <label for="ce-end">End</label>
                  <input
                    id="ce-end"
                    type="time"
                    .value=${this._endTime}
                    @change=${(t) => this._endTime = t.target.value}
                  />
                </div>
              </div>
            `}

        <div class="field">
          <label for="ce-location">Location</label>
          <input
            id="ce-location"
            type="text"
            placeholder="Optional"
            .value=${this._location}
            @input=${(t) => this._location = t.target.value}
          />
        </div>

        <div class="field">
          <label for="ce-description">Description</label>
          <textarea
            id="ce-description"
            placeholder="Optional"
            .value=${this._description}
            @input=${(t) => this._description = t.target.value}
          ></textarea>
        </div>

        ${this._error ? d`<div class="error-msg">${this._error}</div>` : ""}

        <div class="actions">
          <button class="btn btn-cancel" @click=${this._close}>Cancel</button>
          <button class="btn btn-create" ?disabled=${this._saving} @click=${this._create}>
            ${this._saving ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    ` : d``;
  }
};
w.styles = [
  S,
  $`
      :host {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 200;
      }
      .backdrop {
        position: absolute;
        inset: 0;
      }
      .popover {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--lucarne-surface);
        border-radius: var(--lucarne-radius-lg);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        padding: var(--lucarne-spacing-xl);
        min-width: 300px;
        max-width: min(480px, 92vw);
        z-index: 1;
      }
      .popover-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--lucarne-spacing-md);
      }
      .popover-title {
        font-size: var(--lucarne-fs-lg);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        margin: 0;
      }
      .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.25rem;
        color: var(--lucarne-on-surface-muted);
        padding: 4px;
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--lucarne-radius-sm);
      }
      .close-btn:hover {
        background: rgba(0, 0, 0, 0.06);
      }
      .field {
        margin-bottom: var(--lucarne-spacing-md);
      }
      label {
        display: block;
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: var(--lucarne-on-surface-muted);
        margin-bottom: 4px;
      }
      input[type='text'],
      input[type='date'],
      input[type='time'],
      select,
      textarea {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: var(--lucarne-radius-sm);
        padding: 8px 10px;
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface);
        background: var(--lucarne-surface);
        min-height: 44px;
        font-family: inherit;
      }
      input:focus,
      select:focus,
      textarea:focus {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 1px;
      }
      textarea {
        min-height: 64px;
        resize: vertical;
      }
      .time-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--lucarne-spacing-sm);
      }
      .allday-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        margin-bottom: var(--lucarne-spacing-md);
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface);
        min-height: 44px;
      }
      .allday-row input[type='checkbox'] {
        width: 18px;
        height: 18px;
        min-height: unset;
        cursor: pointer;
      }
      .error-msg {
        color: #c62828;
        font-size: var(--lucarne-fs-sm);
        margin-bottom: var(--lucarne-spacing-sm);
        padding: 6px 10px;
        background: #ffebee;
        border-radius: var(--lucarne-radius-sm);
      }
      .actions {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        justify-content: flex-end;
        margin-top: var(--lucarne-spacing-md);
      }
      .btn {
        padding: 8px 20px;
        border-radius: var(--lucarne-radius-sm);
        border: none;
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        min-height: 44px;
        min-width: 80px;
      }
      .btn-cancel {
        background: rgba(0, 0, 0, 0.06);
        color: var(--lucarne-on-surface-muted);
      }
      .btn-create {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }
      .btn-create:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `
];
x([
  u({ attribute: !1 })
], w.prototype, "hass", 2);
x([
  u({ type: Object })
], w.prototype, "day", 2);
x([
  u({ type: Number })
], w.prototype, "startHour", 2);
x([
  u({ type: Array })
], w.prototype, "calendars", 2);
x([
  f()
], w.prototype, "_title", 2);
x([
  f()
], w.prototype, "_calendarEntityId", 2);
x([
  f()
], w.prototype, "_date", 2);
x([
  f()
], w.prototype, "_startTime", 2);
x([
  f()
], w.prototype, "_endTime", 2);
x([
  f()
], w.prototype, "_allDay", 2);
x([
  f()
], w.prototype, "_description", 2);
x([
  f()
], w.prototype, "_location", 2);
x([
  f()
], w.prototype, "_error", 2);
x([
  f()
], w.prototype, "_saving", 2);
w = x([
  E("lucarne-create-event-popover")
], w);
var Es = Object.defineProperty, Ss = Object.getOwnPropertyDescriptor, D = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Ss(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Es(e, s, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-calendar-card",
  name: "Lucarne Calendar",
  description: "Week view calendar with per-person color, visibility pills, and create-event flow",
  preview: !0
});
let C = class extends y {
  constructor() {
    super(...arguments), this._layout = null, this._visibleIds = /* @__PURE__ */ new Set(), this._weekOffset = 0, this._openEvent = null, this._openEventColor = "", this._openEventCalLabel = "", this._createDay = null, this._createStartHour = 9, this._creatableCalendars = [], this._fetchSeq = 0, this._rawEvents = /* @__PURE__ */ new Map(), this._pendingEvents = [];
  }
  setConfig(t) {
    if (!t.calendars || !Array.isArray(t.calendars) || t.calendars.length === 0)
      throw new Error('lucarne-calendar-card: "calendars" must be a non-empty array');
    for (const s of t.calendars)
      if (!s.entity || !s.color || !s.label)
        throw new Error('lucarne-calendar-card: each calendar requires "entity", "color", and "label"');
    let e = t;
    if (t.visible_hours) {
      const s = /^\d{1,2}:\d{2}$/;
      if (!s.test(t.visible_hours.start) || !s.test(t.visible_hours.end))
        throw new Error('lucarne-calendar-card: "visible_hours" start and end must be in HH:MM format');
      const r = parseInt(t.visible_hours.start.split(":")[0], 10), a = parseInt(t.visible_hours.end.split(":")[0], 10);
      if (r < 0 || a > 24 || r >= a)
        throw new Error('lucarne-calendar-card: "visible_hours" must satisfy 0 <= start < end <= 24');
      e = {
        ...t,
        visible_hours: {
          start: `${String(r).padStart(2, "0")}:00`,
          end: `${String(a).padStart(2, "0")}:00`
        }
      };
    }
    this._config = e, this._visibleIds = new Set(t.calendars.map((s) => s.entity)), this.hass && this._updateCreatableCalendars(), this.isConnected && (this._teardown(), this._setup());
  }
  static getStubConfig(t) {
    const e = Object.keys(t.states).filter((a) => a.startsWith("calendar.")).slice(0, 3), s = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], r = e.map((a, n) => {
      var i, o;
      return {
        entity: a,
        color: s[n] ?? "#a8d8b9",
        label: ((o = (i = t.states[a]) == null ? void 0 : i.attributes) == null ? void 0 : o.friendly_name) ?? a
      };
    });
    return {
      type: "custom:lucarne-calendar-card",
      title: "Calendar",
      calendars: r.length ? r : [{ entity: "calendar.example", color: "#a8d8b9", label: "Calendar" }],
      visible_hours: { start: "07:00", end: "21:00" },
      week_starts_on: "monday",
      show_create_button: !0
    };
  }
  getCardSize() {
    return 6;
  }
  static getConfigElement() {
    return document.createElement("lucarne-calendar-card-editor");
  }
  connectedCallback() {
    super.connectedCallback(), this._setup();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._teardown();
  }
  updated(t) {
    if (super.updated(t), !t.has("hass") || !this._config) return;
    !t.get("hass") && this.hass && !this._intervalId && this._setup(), this._updateCreatableCalendars();
  }
  _setup() {
    !this._config || !this.hass || (this._fetchEvents(), this._intervalId = setInterval(() => this._fetchEvents(), 5 * 60 * 1e3));
  }
  _teardown() {
    clearInterval(this._intervalId), this._intervalId = void 0;
  }
  get _weekStart() {
    var s;
    const e = Te(/* @__PURE__ */ new Date(), ((s = this._config) == null ? void 0 : s.week_starts_on) ?? "monday");
    return e.setDate(e.getDate() + this._weekOffset * 7), e.setHours(0, 0, 0, 0), e;
  }
  get _weekEnd() {
    var t;
    return ns(this._weekStart, ((t = this._config) == null ? void 0 : t.week_starts_on) ?? "monday");
  }
  async _fetchEvents() {
    if (!this._config || !this.hass) return;
    const t = ++this._fetchSeq, e = this._weekStart, s = this._weekEnd, r = this._config.calendars.map((i) => i.entity), a = await ft(this.hass, r, e, s);
    if (t !== this._fetchSeq) return;
    const n = /* @__PURE__ */ new Map();
    for (const [i, o] of a.entries())
      n.set(
        i,
        o.map((l) => ({ ...l, uid: `${i}::${l.uid ?? ""}` }))
      );
    this._rawEvents = n, this._pendingEvents = [], this._recompute();
  }
  _recompute() {
    var r, a;
    if (!this._config) return;
    const t = [];
    for (const [n, i] of this._rawEvents.entries())
      this._visibleIds.has(n) && t.push(...i);
    t.push(
      ...this._pendingEvents.filter((n) => {
        var o;
        const i = (o = n.uid) == null ? void 0 : o.split("::")[0];
        return i ? this._visibleIds.has(i) : !0;
      })
    );
    const e = ((r = this._config.visible_hours) == null ? void 0 : r.start) ?? "07:00", s = ((a = this._config.visible_hours) == null ? void 0 : a.end) ?? "21:00";
    this._layout = hs(t, this._weekStart, e, s, this._config.week_starts_on ?? "monday");
  }
  _supportsCreate(t) {
    var s, r, a;
    const e = (a = (r = (s = this.hass) == null ? void 0 : s.states[t]) == null ? void 0 : r.attributes) == null ? void 0 : a.supported_features;
    return e !== void 0 && (e & 1) !== 0;
  }
  _updateCreatableCalendars() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.filter((s) => this._supportsCreate(s.entity));
    t.length === this._creatableCalendars.length && t.every((s, r) => {
      var a;
      return s.entity === ((a = this._creatableCalendars[r]) == null ? void 0 : a.entity);
    }) || (this._creatableCalendars = t);
  }
  _onVisibilityChange(t) {
    this._visibleIds = t.detail, this._recompute();
  }
  _onEventTap(t) {
    var r, a;
    const { event: e, color: s } = t.detail;
    if (this._openEvent = e, this._openEventColor = s, (r = e.uid) != null && r.includes("::")) {
      const n = e.uid.split("::")[0], i = (a = this._config) == null ? void 0 : a.calendars.find((o) => o.entity === n);
      this._openEventCalLabel = (i == null ? void 0 : i.label) ?? "";
    } else
      this._openEventCalLabel = "";
  }
  _closePopover() {
    this._openEvent = null;
  }
  _onCreateEventTap(t) {
    const { day: e, startHour: s } = t.detail;
    this._createDay = e, this._createStartHour = s;
  }
  _closeCreatePopover() {
    this._createDay = null;
  }
  _onEventCreated(t) {
    const { event: e } = t.detail;
    this._pendingEvents = [...this._pendingEvents, e], this._recompute(), this._closeCreatePopover();
  }
  _navWeek(t) {
    this._weekOffset += t, this._fetchEvents();
  }
  _weekLabel() {
    const t = this._weekStart, e = this._weekEnd, s = (r) => r.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return this._weekOffset === 0 ? "This week" : this._weekOffset === -1 ? "Last week" : this._weekOffset === 1 ? "Next week" : `${s(t)} – ${s(e)}`;
  }
  render() {
    var s, r;
    if (!this._config) return d``;
    const t = ((s = this._config.visible_hours) == null ? void 0 : s.start) ?? "07:00", e = ((r = this._config.visible_hours) == null ? void 0 : r.end) ?? "21:00";
    return d`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${this._config.title ?? "Calendar"}</h2>
          <div class="week-nav">
            <button class="nav-btn" @click=${() => this._navWeek(-1)} aria-label="Previous week">←</button>
            <span class="week-label">${this._weekLabel()}</span>
            <button class="nav-btn" @click=${() => this._navWeek(1)} aria-label="Next week">→</button>
          </div>
        </div>

        <div class="pills-row">
          <lucarne-visibility-pills
            .calendars=${this._config.calendars}
            .visibleIds=${this._visibleIds}
            @visibility-change=${this._onVisibilityChange}
          ></lucarne-visibility-pills>
        </div>

        <div
          class="grid-area"
          @lucarne-event-tap=${this._onEventTap}
          @lucarne-create-event-tap=${this._onCreateEventTap}
        >
          <lucarne-calendar-grid
            .layout=${this._layout}
            .bandStart=${t}
            .bandEnd=${e}
            .calendars=${this._config.calendars}
            .showCreateButton=${(this._config.show_create_button ?? !0) && this._creatableCalendars.length > 0}
          ></lucarne-calendar-grid>
        </div>

        ${this._openEvent ? d`
              <lucarne-calendar-event-popover
                .event=${this._openEvent}
                .color=${this._openEventColor}
                .calendarLabel=${this._openEventCalLabel}
                @popover-close=${this._closePopover}
              ></lucarne-calendar-event-popover>
            ` : ""}

        ${this._createDay !== null ? d`
              <lucarne-create-event-popover
                .hass=${this.hass}
                .day=${this._createDay}
                .startHour=${this._createStartHour}
                .calendars=${this._creatableCalendars}
                @popover-close=${this._closeCreatePopover}
                @lucarne-event-created=${this._onEventCreated}
              ></lucarne-create-event-popover>
            ` : ""}
      </ha-card>
    `;
  }
};
C.styles = [
  S,
  $`
      :host {
        display: block;
        font-family: var(--primary-font-family, sans-serif);
      }
      ha-card {
        padding: 0;
        overflow: hidden;
      }
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--lucarne-spacing-lg) var(--lucarne-spacing-xl) var(--lucarne-spacing-xs);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .card-title {
        font-size: var(--lucarne-fs-lg);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        margin: 0;
      }
      .week-nav {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-xs);
      }
      .nav-btn {
        background: none;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: var(--lucarne-radius-sm);
        padding: 4px 10px;
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        min-height: 44px;
        min-width: 44px;
      }
      .nav-btn:hover {
        background: rgba(0, 0, 0, 0.04);
      }
      .week-label {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        min-width: 80px;
        text-align: center;
      }
      .pills-row {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .grid-area {
        overflow: auto;
      }
    `
];
D([
  u({ attribute: !1 })
], C.prototype, "hass", 2);
D([
  f()
], C.prototype, "_config", 2);
D([
  f()
], C.prototype, "_layout", 2);
D([
  f()
], C.prototype, "_visibleIds", 2);
D([
  f()
], C.prototype, "_weekOffset", 2);
D([
  f()
], C.prototype, "_openEvent", 2);
D([
  f()
], C.prototype, "_openEventColor", 2);
D([
  f()
], C.prototype, "_openEventCalLabel", 2);
D([
  f()
], C.prototype, "_createDay", 2);
D([
  f()
], C.prototype, "_createStartHour", 2);
D([
  f()
], C.prototype, "_creatableCalendars", 2);
C = D([
  E("lucarne-calendar-card")
], C);
var ks = Object.defineProperty, Ds = Object.getOwnPropertyDescriptor, He = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Ds(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && ks(e, s, a), a;
};
let ce = class extends y {
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    mt(this, "config-changed", { config: t });
  }
  _titleChanged(t) {
    const e = t.target;
    this._fire({ ...this._config, title: e.value || void 0 });
  }
  _weekStartsOnChanged(t) {
    const e = t.target.value;
    e && this._fire({ ...this._config, week_starts_on: e });
  }
  _bandStartChanged(t) {
    const e = t.target;
    this._fire({
      ...this._config,
      visible_hours: { ...this._config.visible_hours ?? { start: "07:00", end: "21:00" }, start: e.value }
    });
  }
  _bandEndChanged(t) {
    const e = t.target;
    this._fire({
      ...this._config,
      visible_hours: { ...this._config.visible_hours ?? { start: "07:00", end: "21:00" }, end: e.value }
    });
  }
  _showCreateChanged(t) {
    const e = t.target.checked;
    this._fire({ ...this._config, show_create_button: e });
  }
  _calEntityChanged(t, e) {
    var r, a;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], entity: ((a = e.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, calendars: s });
  }
  _calColorChanged(t, e) {
    var r;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], color: e.target.value }, this._fire({ ...this._config, calendars: s });
  }
  _calLabelChanged(t, e) {
    var r;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], label: e.target.value }, this._fire({ ...this._config, calendars: s });
  }
  _removeCalendar(t) {
    var s;
    const e = [...((s = this._config) == null ? void 0 : s.calendars) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, calendars: e }));
  }
  _addCalendar() {
    var a, n, i, o;
    const t = Object.keys(((a = this.hass) == null ? void 0 : a.states) ?? {}).find((l) => l.startsWith("calendar.")), e = t ?? "calendar.example", s = t ? ((i = (n = this.hass.states[t]) == null ? void 0 : n.attributes) == null ? void 0 : i.friendly_name) ?? "Calendar" : "Calendar", r = [
      ...((o = this._config) == null ? void 0 : o.calendars) ?? [],
      { entity: e, color: "#a8d8b9", label: s }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  render() {
    var n, i;
    if (!this._config) return d``;
    const t = this._config.calendars ?? [], e = ((n = this._config.visible_hours) == null ? void 0 : n.start) ?? "07:00", s = ((i = this._config.visible_hours) == null ? void 0 : i.end) ?? "21:00", r = this._config.week_starts_on ?? "monday", a = this._config.show_create_button ?? !0;
    return d`
      <div class="section-label">General</div>
      <ha-textfield
        label="Card title"
        .value=${this._config.title ?? ""}
        @change=${this._titleChanged}
      ></ha-textfield>

      <div class="section-label">Visible Hours</div>
      <div class="row">
        <ha-textfield
          label="Band start (HH:MM)"
          .value=${e}
          @change=${this._bandStartChanged}
        ></ha-textfield>
        <ha-textfield
          label="Band end (HH:MM)"
          .value=${s}
          @change=${this._bandEndChanged}
        ></ha-textfield>
      </div>

      <div class="section-label">Week Settings</div>
      <ha-select
        label="Week starts on"
        .value=${r}
        @selected=${this._weekStartsOnChanged}
        @closed=${(o) => o.stopPropagation()}
      >
        <ha-list-item value="monday">Monday</ha-list-item>
        <ha-list-item value="sunday">Sunday</ha-list-item>
      </ha-select>

      <div class="toggle-row">
        <span class="toggle-label">Show create-event button</span>
        <ha-switch
          .checked=${a}
          @change=${this._showCreateChanged}
        ></ha-switch>
      </div>

      <div class="section-label">Calendars</div>
      ${t.map(
      (o, l) => d`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${o.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(c) => this._calEntityChanged(l, c)}
            ></ha-entity-picker>
            <ha-textfield
              label="Label"
              .value=${o.label}
              @change=${(c) => this._calLabelChanged(l, c)}
            ></ha-textfield>
            <input
              type="color"
              class="cal-color"
              .value=${o.color}
              @input=${(c) => this._calColorChanged(l, c)}
              title="Calendar color"
            />
            <button class="remove" @click=${() => this._removeCalendar(l)} title="Remove">✕</button>
          </div>
        `
    )}
      <button class="add" @click=${this._addCalendar}>+ Add calendar</button>
    `;
  }
};
ce.styles = [
  S,
  $`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-md);
        padding: var(--lucarne-spacing-lg);
      }
      .section-label {
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: var(--lucarne-on-surface-muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin: var(--lucarne-spacing-md) 0 var(--lucarne-spacing-xs);
      }
      .section-label:first-of-type {
        margin-top: 0;
      }
      .row {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        align-items: flex-start;
      }
      .row > * {
        flex: 1;
      }
      .cal-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto auto;
        gap: var(--lucarne-spacing-sm);
        align-items: center;
        padding: var(--lucarne-spacing-xs) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      .cal-color {
        width: 32px;
        height: 32px;
        border-radius: var(--lucarne-radius-sm);
        border: 1px solid rgba(0, 0, 0, 0.2);
        cursor: pointer;
        flex-shrink: 0;
      }
      button.remove {
        background: none;
        border: none;
        color: var(--error-color, #f44336);
        cursor: pointer;
        font-size: 1.1em;
        padding: 4px 8px;
        border-radius: var(--lucarne-radius-sm);
      }
      button.add {
        background: none;
        border: 1px dashed rgba(0, 0, 0, 0.2);
        border-radius: var(--lucarne-radius-md);
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-md);
        cursor: pointer;
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        width: 100%;
        text-align: center;
        margin-top: var(--lucarne-spacing-xs);
      }
      button.add:hover {
        background: rgba(0, 0, 0, 0.04);
      }
      .toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--lucarne-spacing-xs) 0;
      }
      .toggle-label {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface);
      }
    `
];
He([
  u({ attribute: !1 })
], ce.prototype, "hass", 2);
He([
  f()
], ce.prototype, "_config", 2);
ce = He([
  E("lucarne-calendar-card-editor")
], ce);
//# sourceMappingURL=ha-lucarne.js.map
