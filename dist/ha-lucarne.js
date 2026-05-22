/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, ae = K.ShadowRoot && (K.ShadyCSS === void 0 || K.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, oe = Symbol(), ue = /* @__PURE__ */ new WeakMap();
let Me = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== oe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ae && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = ue.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && ue.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ze = (s) => new Me(typeof s == "string" ? s : s + "", void 0, oe), S = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((r, i, n) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[n + 1], s[0]);
  return new Me(t, s, oe);
}, je = (s, e) => {
  if (ae) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), i = K.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, s.appendChild(r);
  }
}, fe = ae ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return ze(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Le, defineProperty: Re, getOwnPropertyDescriptor: Be, getOwnPropertyNames: We, getOwnPropertySymbols: Fe, getPrototypeOf: qe } = Object, $ = globalThis, ge = $.trustedTypes, Ve = ge ? ge.emptyScript : "", se = $.reactiveElementPolyfillSupport, z = (s, e) => s, Q = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Ve : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, le = (s, e) => !Le(s, e), me = { attribute: !0, type: String, converter: Q, reflect: !1, useDefault: !1, hasChanged: le };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $.litPropertyMetadata ?? ($.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let P = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = me) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(e, r, t);
      i !== void 0 && Re(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: i, set: n } = Be(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: i, set(a) {
      const o = i == null ? void 0 : i.call(this);
      n == null || n.call(this, a), this.requestUpdate(e, o, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? me;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = qe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const t = this.properties, r = [...We(t), ...Fe(t)];
      for (const i of r) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, i] of t) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const i = this._$Eu(t, r);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const i of r) t.unshift(fe(i));
    } else e !== void 0 && t.push(fe(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return je(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostConnected) == null ? void 0 : r.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostDisconnected) == null ? void 0 : r.call(t);
    });
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    var n;
    const r = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, r);
    if (i !== void 0 && r.reflect === !0) {
      const a = (((n = r.converter) == null ? void 0 : n.toAttribute) !== void 0 ? r.converter : Q).toAttribute(t, r.type);
      this._$Em = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, a;
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const o = r.getPropertyOptions(i), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : Q;
      this._$Em = i;
      const c = l.fromAttribute(t, o.type);
      this[i] = c ?? ((a = this._$Ej) == null ? void 0 : a.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, i = !1, n) {
    var a;
    if (e !== void 0) {
      const o = this.constructor;
      if (i === !1 && (n = this[e]), r ?? (r = o.getPropertyOptions(e)), !((r.hasChanged ?? le)(n, t) || r.useDefault && r.reflect && n === ((a = this._$Ej) == null ? void 0 : a.get(e)) && !this.hasAttribute(o._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: i, wrapped: n }, a) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), n !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
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
        for (const [n, a] of this._$Ep) this[n] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, a] of i) {
        const { wrapped: o } = a, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, a, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (r = this._$EO) == null || r.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((r) => {
      var i;
      return (i = r.hostUpdated) == null ? void 0 : i.call(r);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[z("elementProperties")] = /* @__PURE__ */ new Map(), P[z("finalized")] = /* @__PURE__ */ new Map(), se == null || se({ ReactiveElement: P }), ($.reactiveElementVersions ?? ($.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, ve = (s) => s, X = j.trustedTypes, _e = X ? X.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Oe = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, De = "?" + y, Je = `<${De}>`, E = document, R = () => E.createComment(""), B = (s) => s === null || typeof s != "object" && typeof s != "function", ce = Array.isArray, Ze = (s) => ce(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", re = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ye = /-->/g, $e = />/g, x = RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), we = /'/g, be = /"/g, Ie = /^(?:script|style|textarea|title)$/i, Ne = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), h = Ne(1), b = Ne(2), T = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), xe = /* @__PURE__ */ new WeakMap(), A = E.createTreeWalker(E, 129);
function Ue(s, e) {
  if (!ce(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _e !== void 0 ? _e.createHTML(e) : e;
}
const Ge = (s, e) => {
  const t = s.length - 1, r = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = U;
  for (let o = 0; o < t; o++) {
    const l = s[o];
    let c, f, d = -1, v = 0;
    for (; v < l.length && (a.lastIndex = v, f = a.exec(l), f !== null); ) v = a.lastIndex, a === U ? f[1] === "!--" ? a = ye : f[1] !== void 0 ? a = $e : f[2] !== void 0 ? (Ie.test(f[2]) && (i = RegExp("</" + f[2], "g")), a = x) : f[3] !== void 0 && (a = x) : a === x ? f[0] === ">" ? (a = i ?? U, d = -1) : f[1] === void 0 ? d = -2 : (d = a.lastIndex - f[2].length, c = f[1], a = f[3] === void 0 ? x : f[3] === '"' ? be : we) : a === be || a === we ? a = x : a === ye || a === $e ? a = U : (a = x, i = void 0);
    const _ = a === x && s[o + 1].startsWith("/>") ? " " : "";
    n += a === U ? l + Je : d >= 0 ? (r.push(c), l.slice(0, d) + Oe + l.slice(d) + y + _) : l + y + (d === -2 ? o : _);
  }
  return [Ue(s, n + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class W {
  constructor({ strings: e, _$litType$: t }, r) {
    let i;
    this.parts = [];
    let n = 0, a = 0;
    const o = e.length - 1, l = this.parts, [c, f] = Ge(e, t);
    if (this.el = W.createElement(c, r), A.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = A.nextNode()) !== null && l.length < o; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(Oe)) {
          const v = f[a++], _ = i.getAttribute(d).split(y), G = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: n, name: G[2], strings: _, ctor: G[1] === "." ? Qe : G[1] === "?" ? Xe : G[1] === "@" ? Ye : ee }), i.removeAttribute(d);
        } else d.startsWith(y) && (l.push({ type: 6, index: n }), i.removeAttribute(d));
        if (Ie.test(i.tagName)) {
          const d = i.textContent.split(y), v = d.length - 1;
          if (v > 0) {
            i.textContent = X ? X.emptyScript : "";
            for (let _ = 0; _ < v; _++) i.append(d[_], R()), A.nextNode(), l.push({ type: 2, index: ++n });
            i.append(d[v], R());
          }
        }
      } else if (i.nodeType === 8) if (i.data === De) l.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(y, d + 1)) !== -1; ) l.push({ type: 7, index: n }), d += y.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const r = E.createElement("template");
    return r.innerHTML = e, r;
  }
}
function M(s, e, t = s, r) {
  var a, o;
  if (e === T) return e;
  let i = r !== void 0 ? (a = t._$Co) == null ? void 0 : a[r] : t._$Cl;
  const n = B(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((o = i == null ? void 0 : i._$AO) == null || o.call(i, !1), n === void 0 ? i = void 0 : (i = new n(s), i._$AT(s, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = i : t._$Cl = i), i !== void 0 && (e = M(s, i._$AS(s, e.values), i, r)), e;
}
class Ke {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? E).importNode(t, !0);
    A.currentNode = i;
    let n = A.nextNode(), a = 0, o = 0, l = r[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let c;
        l.type === 2 ? c = new J(n, n.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (c = new et(n, this, e)), this._$AV.push(c), l = r[++o];
      }
      a !== (l == null ? void 0 : l.index) && (n = A.nextNode(), a++);
    }
    return A.currentNode = E, i;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class J {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, r, i) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = M(this, e, t), B(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== T && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ze(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && B(this._$AH) ? this._$AA.nextSibling.data = e : this.T(E.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = W.createElement(Ue(r.h, r.h[0]), this.options)), r);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(t);
    else {
      const a = new Ke(i, this), o = a.u(this.options);
      a.p(t), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = xe.get(e.strings);
    return t === void 0 && xe.set(e.strings, t = new W(e)), t;
  }
  k(e) {
    ce(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, i = 0;
    for (const n of e) i === t.length ? t.push(r = new J(this.O(R()), this.O(R()), this, this.options)) : r = t[i], r._$AI(n), i++;
    i < t.length && (this._$AR(r && r._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, t); e !== this._$AB; ) {
      const i = ve(e).nextSibling;
      ve(e).remove(), e = i;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class ee {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, i, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = u;
  }
  _$AI(e, t = this, r, i) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = M(this, e, t, 0), a = !B(e) || e !== this._$AH && e !== T, a && (this._$AH = e);
    else {
      const o = e;
      let l, c;
      for (e = n[0], l = 0; l < n.length - 1; l++) c = M(this, o[r + l], t, l), c === T && (c = this._$AH[l]), a || (a = !B(c) || c !== this._$AH[l]), c === u ? e = u : e !== u && (e += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    a && !i && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Qe extends ee {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class Xe extends ee {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class Ye extends ee {
  constructor(e, t, r, i, n) {
    super(e, t, r, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = M(this, e, t, 0) ?? u) === T) return;
    const r = this._$AH, i = e === u && r !== u || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== u && (r === u || i);
    i && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class et {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    M(this, e);
  }
}
const ie = j.litHtmlPolyfillSupport;
ie == null || ie(W, J), (j.litHtmlVersions ?? (j.litHtmlVersions = [])).push("3.3.3");
const tt = (s, e, t) => {
  const r = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    r._$litPart$ = i = new J(e.insertBefore(R(), n), n, void 0, t ?? {});
  }
  return i._$AI(s), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis;
class m extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = tt(t, this.renderRoot, this.renderOptions);
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
    return T;
  }
}
var Te;
m._$litElement$ = !0, m.finalized = !0, (Te = C.litElementHydrateSupport) == null || Te.call(C, { LitElement: m });
const ne = C.litElementPolyfillSupport;
ne == null || ne({ LitElement: m });
(C.litElementVersions ?? (C.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = { attribute: !0, type: String, converter: Q, reflect: !1, hasChanged: le }, rt = (s = st, e, t) => {
  const { kind: r, metadata: i } = t;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), r === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(t.name, s), r === "accessor") {
    const { name: a } = t;
    return { set(o) {
      const l = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(a, l, s, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(a, void 0, s, o), o;
    } };
  }
  if (r === "setter") {
    const { name: a } = t;
    return function(o) {
      const l = this[a];
      e.call(this, o), this.requestUpdate(a, l, s, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function g(s) {
  return (e, t) => typeof t == "object" ? rt(s, e, t) : ((r, i, n) => {
    const a = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, r), a ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Z(s) {
  return g({ ...s, state: !0, attribute: !1 });
}
const I = S`
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
function it(s, e, t) {
  let r, i = !1;
  return s.connection.subscribeMessage(
    (n) => {
      var a, o;
      (o = (a = n.variables) == null ? void 0 : a.trigger) != null && o.to_state && t(n.variables.trigger.to_state);
    },
    { type: "subscribe_trigger", trigger: { platform: "state", entity_id: e } }
  ).then((n) => {
    i ? n() : r = n;
  }), () => {
    i = !0, r == null || r();
  };
}
async function nt(s, e, t, r) {
  const i = await Promise.all(
    e.map(
      (n) => s.callWS({
        type: "calendar/list_events",
        entity_id: n,
        start_date_time: t.toISOString(),
        end_date_time: r.toISOString()
      }).then((a) => [n, (a == null ? void 0 : a.events) ?? []]).catch(() => [n, []])
    )
  );
  return new Map(i);
}
function at(s, e, t) {
  const r = async () => {
    var i, n;
    try {
      const a = await s.connection.sendMessagePromise({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: {},
        target: { entity_id: e },
        return_response: !0
      });
      t(((n = (i = a == null ? void 0 : a.response) == null ? void 0 : i[e]) == null ? void 0 : n.items) ?? []);
    } catch {
      t([]);
    }
  };
  return r(), it(s, e, () => r());
}
const p = {
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
  moreItems: (s) => `+ ${s} more`,
  timePillNow: "now",
  timePillInMinutes: (s) => `in ${s}m`,
  timePillInHours: (s) => `in ${s}h`,
  timePillTomorrow: (s) => `tomorrow ${s}`,
  errorUnavailable: "—"
};
var ot = Object.defineProperty, lt = Object.getOwnPropertyDescriptor, te = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? lt(e, t) : e, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (i = (r ? a(e, t, i) : a(i)) || i);
  return r && i && ot(e, t, i), i;
};
function L(s) {
  return s.length === 10 ? /* @__PURE__ */ new Date(s + "T00:00:00") : new Date(s);
}
function ct(s, e, t) {
  return s.filter((r) => L(r.end) > e).sort((r, i) => L(r.start).getTime() - L(i.start).getTime()).slice(0, t);
}
function dt(s, e, t) {
  const r = s.getTime() - t.getTime();
  if (s <= t && t < e) return p.timePillNow;
  if (r > 0 && r < 60 * 60 * 1e3) {
    const c = Math.round(r / 6e4);
    return p.timePillInMinutes(c);
  }
  if (r > 0 && r < 2 * 60 * 60 * 1e3) {
    const c = Math.round(r / 36e5);
    return p.timePillInHours(c);
  }
  const n = s.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (s.toDateString() === t.toDateString()) return n;
  const o = new Date(t);
  return o.setDate(t.getDate() + 1), s.toDateString() === o.toDateString() ? p.timePillTomorrow(n) : `${s.toLocaleDateString("en", { weekday: "short" })} ${n}`;
}
function ht(s) {
  return s.start.length === 10 && s.end.length === 10;
}
let O = class extends m {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.limit = 5;
  }
  render() {
    const s = /* @__PURE__ */ new Date(), e = ct(this.events, s, this.limit);
    return e.length === 0 ? h`<div class="empty-state">${p.nothingOnCalendar}</div>` : h`
      ${e.map((t) => {
      const r = L(t.start), i = L(t.end), n = r <= s && s < i, a = ht(t) ? "all day" : dt(r, i, s), o = this._colorForEvent(t);
      return h`
          <div class="event-row">
            <div class="time-pill ${n ? "now" : ""}">
              ${n ? h`<span class="pulse-dot"></span>` : ""} ${a}
            </div>
            <div class="color-bar" style="background:${o}"></div>
            <div class="event-content">
              <div class="event-summary">${t.summary}</div>
              ${t.location ? h`<div class="event-secondary">${t.location}</div>` : ""}
            </div>
          </div>
        `;
    })}
    `;
  }
  _colorForEvent(s) {
    if (s.uid) {
      const e = s.uid.split("::")[0], t = this.calendarColors.get(e);
      if (t) return t;
    }
    return "var(--lucarne-color-family)";
  }
};
O.styles = [
  I,
  S`
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
te([
  g({ type: Array })
], O.prototype, "events", 2);
te([
  g({ type: Object })
], O.prototype, "calendarColors", 2);
te([
  g({ type: Number })
], O.prototype, "limit", 2);
O = te([
  D("lucarne-agenda-strip")
], O);
const Ae = b`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`, k = b`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>`, H = b`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`, Ce = b`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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
</svg>`, pt = b`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M4.22 19.78l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="currentColor"/>
  <path d="M20 15h-1.26A6 6 0 1 0 8 20h12a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.7"/>
</svg>`;
b`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="7" r="4"/>
  <path d="M20 21a8 8 0 1 0-16 0"/>
</svg>`;
b`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"/>
</svg>`;
const ut = b`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, Ee = {
  sunny: Ae,
  "clear-night": Ae,
  cloudy: k,
  fog: k,
  hail: H,
  lightning: H,
  "lightning-rainy": H,
  partlycloudy: pt,
  pouring: H,
  rainy: H,
  snowy: Ce,
  "snowy-rainy": Ce,
  windy: k,
  "windy-variant": k,
  exceptional: k
};
function Se(s) {
  return Ee[s] ?? Ee[s.toLowerCase()] ?? k;
}
function ft(s) {
  if (!s.length) return p.dressingTipDefault;
  const e = s[0];
  if (e.condition.toLowerCase().includes("snow"))
    return p.dressingTipBoots;
  const r = e.temperature;
  let i;
  return r < 5 ? i = p.dressingTipHeavyCoat : r < 12 ? i = p.dressingTipCoatScarf : r < 18 ? i = p.dressingTipLightJacket : r < 24 ? i = p.dressingTipTShirt : i = p.dressingTipShorts, (e.precipitation_probability ?? 0) > 50 && (i += p.dressingTipUmbrella), i;
}
var gt = Object.defineProperty, mt = Object.getOwnPropertyDescriptor, de = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? mt(e, t) : e, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (i = (r ? a(e, t, i) : a(i)) || i);
  return r && i && gt(e, t, i), i;
};
let F = class extends m {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return h`<div class="empty-state">${p.addWeatherEntity}</div>`;
    const s = this.weatherEntity.attributes, e = s.temperature, t = s.temperature_unit ?? "°C", r = this.weatherEntity.state, i = this.forecast[0], n = this.forecast[1], a = ft(this.forecast);
    return h`
      <div class="current">
        <span class="condition-icon">${Se(r)}</span>
        <div class="temp-group">
          <div class="current-temp">${e !== void 0 ? `${Math.round(e)}${t}` : p.errorUnavailable}</div>
          ${i ? h`<div class="high-low">
                ↑${Math.round(i.temperature)}${t}
                ${i.templow !== void 0 ? ` ↓${Math.round(i.templow)}${t}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${n ? h`
            <div class="tomorrow-row">
              <span class="tomorrow-icon">${Se(n.condition)}</span>
              <span>Tomorrow ↑${Math.round(n.temperature)}${t}${n.templow !== void 0 ? ` ↓${Math.round(n.templow)}${t}` : ""}</span>
            </div>
          ` : ""}
      <div class="dressing-tip">
        <span class="dressing-label">Wear:</span>
        ${a}
      </div>
    `;
  }
};
F.styles = [
  I,
  S`
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
de([
  g({ attribute: !1 })
], F.prototype, "weatherEntity", 2);
de([
  g({ type: Array })
], F.prototype, "forecast", 2);
F = de([
  D("lucarne-weather-block")
], F);
var vt = Object.defineProperty, _t = Object.getOwnPropertyDescriptor, he = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? _t(e, t) : e, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (i = (r ? a(e, t, i) : a(i)) || i);
  return r && i && vt(e, t, i), i;
};
let q = class extends m {
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
    const s = this.items.filter((i) => i.status === "needs_action"), e = s.length, t = s.slice(0, 3), r = e - t.length;
    return e === 0 ? h`
        <div class="empty-state">
          <span class="empty-icon">${ut}</span>
          ${p.allDone}
        </div>
      ` : h`
      <div class="header">
        ${p.tasksTitle}
        <span class="count-badge">${e}</span>
      </div>
      ${t.map(
      (i) => h`
          <div class="task-row">
            <span class="summary">${i.summary}</span>
            ${i.due ? h`<span class="due-chip">${this._formatDue(i.due)}</span>` : ""}
          </div>
        `
    )}
      ${r > 0 ? h`<div class="more-row" @click=${this._handleMoreClick}>
            ${p.moreItems(r)}
          </div>` : ""}
    `;
  }
  _formatDue(s) {
    const e = s.length === 10 ? /* @__PURE__ */ new Date(s + "T00:00:00") : new Date(s);
    return isNaN(e.getTime()) ? s : e.toLocaleDateString("en", { month: "short", day: "numeric" });
  }
};
q.styles = [
  I,
  S`
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
he([
  g({ type: Array })
], q.prototype, "items", 2);
he([
  g({ type: String })
], q.prototype, "todoEntityId", 2);
q = he([
  D("lucarne-tasks-summary")
], q);
var yt = Object.defineProperty, $t = Object.getOwnPropertyDescriptor, He = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? $t(e, t) : e, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (i = (r ? a(e, t, i) : a(i)) || i);
  return r && i && yt(e, t, i), i;
};
let Y = class extends m {
  constructor() {
    super(...arguments), this.entries = [];
  }
  render() {
    return h`
      ${this.entries.map(
      (s) => h`
          <span class="pill ${s.isHome ? "home" : "away"}">
            <span class="dot"></span>
            ${s.name}
          </span>
        `
    )}
    `;
  }
};
Y.styles = [
  I,
  S`
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
He([
  g({ type: Array })
], Y.prototype, "entries", 2);
Y = He([
  D("lucarne-presence-pills")
], Y);
var wt = Object.defineProperty, bt = Object.getOwnPropertyDescriptor, N = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? bt(e, t) : e, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (i = (r ? a(e, t, i) : a(i)) || i);
  return r && i && wt(e, t, i), i;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-today-card",
  name: "Lucarne Today",
  description: "Family agenda + weather + tasks + presence",
  preview: !0
});
let w = class extends m {
  constructor() {
    super(...arguments), this._calendarEvents = /* @__PURE__ */ new Map(), this._forecast = [], this._todoItems = [], this._fetchingForecast = !1, this._lastWeatherState = "";
  }
  setConfig(s) {
    if (!s.calendars || !Array.isArray(s.calendars) || s.calendars.length === 0)
      throw new Error('lucarne-today-card: "calendars" must be a non-empty array');
    for (const e of s.calendars)
      if (!e.entity || !e.color || !e.label)
        throw new Error('lucarne-today-card: each calendar entry requires "entity", "color", and "label"');
    this._config = s, this.isConnected && (this._teardownSubscriptions(), this._setupSubscriptions());
  }
  static getConfigElement() {
    return document.createElement("lucarne-today-card-editor");
  }
  static getStubConfig(s) {
    const e = Object.keys(s.states).filter((n) => n.startsWith("calendar.")).slice(0, 3), t = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], r = e.map((n, a) => {
      var o, l;
      return {
        entity: n,
        color: t[a] ?? "#a8d8b9",
        label: ((l = (o = s.states[n]) == null ? void 0 : o.attributes) == null ? void 0 : l.friendly_name) ?? n
      };
    }), i = "weather.forecast_home" in s.states;
    return {
      type: "custom:lucarne-today-card",
      title: p.today,
      calendars: r.length ? r : [{ entity: "calendar.example", color: "#a8d8b9", label: "Calendar" }],
      weather: i ? "weather.forecast_home" : void 0
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
      var s;
      this._fetchCalendarEvents(), (s = this._config) != null && s.weather && this._fetchForecast();
    }, 5 * 60 * 1e3), this._config.tasks && (this._todoUnsub = at(this.hass, this._config.tasks, (s) => {
      this._todoItems = s;
    })));
  }
  _teardownSubscriptions() {
    var s;
    clearInterval(this._calendarIntervalId), (s = this._todoUnsub) == null || s.call(this), this._todoUnsub = void 0, this._calendarIntervalId = void 0;
  }
  updated(s) {
    var r;
    if (super.updated(s), !s.has("hass") || !this._config) return;
    if (!s.get("hass") && this.hass && !this._calendarIntervalId) {
      this._setupSubscriptions();
      return;
    }
    const t = this._config.weather;
    if (t) {
      const i = (r = this.hass.states[t]) == null ? void 0 : r.state;
      i && i !== this._lastWeatherState && (this._lastWeatherState = i, this._fetchForecast());
    }
  }
  async _fetchCalendarEvents() {
    if (!this._config || !this.hass) return;
    const s = this._config.calendars.map((n) => n.entity), e = /* @__PURE__ */ new Date(), t = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), r = await nt(this.hass, s, e, t), i = /* @__PURE__ */ new Map();
    for (const [n, a] of r.entries())
      i.set(
        n,
        a.map((o) => ({ ...o, uid: `${n}::${o.uid ?? o.summary}` }))
      );
    this._calendarEvents = i;
  }
  async _fetchForecast() {
    var s, e, t;
    if (!(this._fetchingForecast || !((s = this._config) != null && s.weather) || !this.hass)) {
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
        this._forecast = ((t = (e = r == null ? void 0 : r.response) == null ? void 0 : e[this._config.weather]) == null ? void 0 : t.forecast) ?? [];
      } catch {
        this._forecast = [];
      } finally {
        this._fetchingForecast = !1;
      }
    }
  }
  get _mergedEvents() {
    const s = [];
    for (const e of this._calendarEvents.values())
      s.push(...e);
    return s;
  }
  get _calendarColorMap() {
    var e;
    const s = /* @__PURE__ */ new Map();
    for (const t of ((e = this._config) == null ? void 0 : e.calendars) ?? [])
      s.set(t.entity, t.color);
    return s;
  }
  render() {
    var t;
    if (!this._config) return h``;
    const s = this._config.weather ? (t = this.hass) == null ? void 0 : t.states[this._config.weather] : void 0, e = (this._config.presence ?? []).map((r) => {
      var i, n;
      return {
        name: r.name,
        isHome: ((n = (i = this.hass) == null ? void 0 : i.states[r.entity]) == null ? void 0 : n.state) === "on"
      };
    });
    return h`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${this._config.title ?? p.today}</h2>
          ${e.length > 0 ? h`<lucarne-presence-pills .entries=${e}></lucarne-presence-pills>` : ""}
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
                .weatherEntity=${s}
                .forecast=${this._forecast}
              ></lucarne-weather-block>
            </div>
            ${this._config.tasks ? h`
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
w.styles = [
  I,
  S`
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
N([
  g({ attribute: !1 })
], w.prototype, "hass", 2);
N([
  Z()
], w.prototype, "_config", 2);
N([
  Z()
], w.prototype, "_calendarEvents", 2);
N([
  Z()
], w.prototype, "_forecast", 2);
N([
  Z()
], w.prototype, "_todoItems", 2);
w = N([
  D("lucarne-today-card")
], w);
var Pe, ke;
(function(s) {
  s.language = "language", s.system = "system", s.comma_decimal = "comma_decimal", s.decimal_comma = "decimal_comma", s.space_comma = "space_comma", s.none = "none";
})(Pe || (Pe = {})), function(s) {
  s.language = "language", s.system = "system", s.am_pm = "12", s.twenty_four = "24";
}(ke || (ke = {}));
var xt = function(s, e, t, r) {
  r = r || {}, t = t ?? {};
  var i = new Event(e, { bubbles: r.bubbles === void 0 || r.bubbles, cancelable: !!r.cancelable, composed: r.composed === void 0 || r.composed });
  return i.detail = t, s.dispatchEvent(i), i;
}, At = Object.defineProperty, Ct = Object.getOwnPropertyDescriptor, pe = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Ct(e, t) : e, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (i = (r ? a(e, t, i) : a(i)) || i);
  return r && i && At(e, t, i), i;
};
let V = class extends m {
  setConfig(s) {
    this._config = s;
  }
  _fire(s) {
    xt(this, "config-changed", { config: s });
  }
  _titleChanged(s) {
    const e = s.target;
    this._fire({ ...this._config, title: e.value || void 0 });
  }
  _weatherChanged(s) {
    var e;
    this._fire({ ...this._config, weather: ((e = s.detail) == null ? void 0 : e.value) ?? void 0 });
  }
  _tasksChanged(s) {
    var e;
    this._fire({ ...this._config, tasks: ((e = s.detail) == null ? void 0 : e.value) ?? void 0 });
  }
  _agendaLimitChanged(s) {
    const e = s.target, t = parseInt(e.value, 10);
    this._fire({ ...this._config, agenda_limit: isNaN(t) ? void 0 : Math.min(10, Math.max(1, t)) });
  }
  _calEntityChanged(s, e) {
    var r, i;
    const t = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    t[s] = { ...t[s], entity: ((i = e.detail) == null ? void 0 : i.value) ?? "" }, this._fire({ ...this._config, calendars: t });
  }
  _calColorChanged(s, e) {
    var r;
    const t = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    t[s] = { ...t[s], color: e.target.value }, this._fire({ ...this._config, calendars: t });
  }
  _calLabelChanged(s, e) {
    var r;
    const t = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    t[s] = { ...t[s], label: e.target.value }, this._fire({ ...this._config, calendars: t });
  }
  _removeCalendar(s) {
    var t;
    const e = [...((t = this._config) == null ? void 0 : t.calendars) ?? []];
    e.length <= 1 || (e.splice(s, 1), this._fire({ ...this._config, calendars: e }));
  }
  _addCalendar() {
    var i, n, a, o;
    const s = Object.keys(((i = this.hass) == null ? void 0 : i.states) ?? {}).find((l) => l.startsWith("calendar.")), e = s ?? "calendar.example", t = s ? ((a = (n = this.hass.states[s]) == null ? void 0 : n.attributes) == null ? void 0 : a.friendly_name) ?? "Calendar" : "Calendar", r = [
      ...((o = this._config) == null ? void 0 : o.calendars) ?? [],
      { entity: e, color: "#a8d8b9", label: t }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  _presenceEntityChanged(s, e) {
    var r, i;
    const t = [...((r = this._config) == null ? void 0 : r.presence) ?? []];
    t[s] = { ...t[s], entity: ((i = e.detail) == null ? void 0 : i.value) ?? "" }, this._fire({ ...this._config, presence: t });
  }
  _presenceNameChanged(s, e) {
    var r;
    const t = [...((r = this._config) == null ? void 0 : r.presence) ?? []];
    t[s] = { ...t[s], name: e.target.value }, this._fire({ ...this._config, presence: t });
  }
  _removePresence(s) {
    var t;
    const e = [...((t = this._config) == null ? void 0 : t.presence) ?? []];
    e.splice(s, 1), this._fire({ ...this._config, presence: e });
  }
  _addPresence() {
    var e;
    const s = [...((e = this._config) == null ? void 0 : e.presence) ?? [], { entity: "", name: "" }];
    this._fire({ ...this._config, presence: s });
  }
  render() {
    if (!this._config) return h``;
    const s = this._config.calendars ?? [], e = this._config.presence ?? [];
    return h`
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
      ${s.map(
      (t, r) => h`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${t.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(i) => this._calEntityChanged(r, i)}
            ></ha-entity-picker>
            <ha-textfield
              label="Label"
              .value=${t.label}
              @change=${(i) => this._calLabelChanged(r, i)}
            ></ha-textfield>
            <input
              type="color"
              class="cal-color"
              .value=${t.color}
              @input=${(i) => this._calColorChanged(r, i)}
              title="Calendar color"
            />
            <button class="remove" @click=${() => this._removeCalendar(r)} title="Remove">✕</button>
          </div>
        `
    )}
      <button class="add" @click=${this._addCalendar}>+ Add calendar</button>

      <div class="section-label">Presence</div>
      ${e.map(
      (t, r) => h`
          <div class="presence-row">
            <ha-entity-picker
              label="Entity"
              .hass=${this.hass}
              .value=${t.entity}
              .includeDomains=${["input_boolean"]}
              allow-custom-entity
              @value-changed=${(i) => this._presenceEntityChanged(r, i)}
            ></ha-entity-picker>
            <ha-textfield
              label="Display name"
              .value=${t.name}
              @change=${(i) => this._presenceNameChanged(r, i)}
            ></ha-textfield>
            <button class="remove" @click=${() => this._removePresence(r)} title="Remove">✕</button>
          </div>
        `
    )}
      <button class="add" @click=${this._addPresence}>+ Add person</button>
    `;
  }
};
V.styles = [
  I,
  S`
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
pe([
  g({ attribute: !1 })
], V.prototype, "hass", 2);
pe([
  Z()
], V.prototype, "_config", 2);
V = pe([
  D("lucarne-today-card-editor")
], V);
//# sourceMappingURL=ha-lucarne.js.map
