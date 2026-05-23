/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ae = globalThis, Ve = Ae.ShadowRoot && (Ae.ShadyCSS === void 0 || Ae.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, qe = Symbol(), rt = /* @__PURE__ */ new WeakMap();
let Ht = class {
  constructor(e, s, r) {
    if (this._$cssResult$ = !0, r !== qe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (Ve && e === void 0) {
      const r = s !== void 0 && s.length === 1;
      r && (e = rt.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && rt.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Zt = (t) => new Ht(typeof t == "string" ? t : t + "", void 0, qe), y = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((r, n, a) => r + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[a + 1], t[0]);
  return new Ht(s, t, qe);
}, Qt = (t, e) => {
  if (Ve) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const r = document.createElement("style"), n = Ae.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = s.cssText, t.appendChild(r);
  }
}, nt = Ve ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const r of e.cssRules) s += r.cssText;
  return Zt(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: es, defineProperty: ts, getOwnPropertyDescriptor: ss, getOwnPropertyNames: rs, getOwnPropertySymbols: ns, getPrototypeOf: as } = Object, j = globalThis, at = j.trustedTypes, is = at ? at.emptyScript : "", Be = j.reactiveElementPolyfillSupport, he = (t, e) => t, Me = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? is : null;
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
} }, Ye = (t, e) => !es(t, e), it = { attribute: !0, type: String, converter: Me, reflect: !1, useDefault: !1, hasChanged: Ye };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), j.litPropertyMetadata ?? (j.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Z = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = it) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const r = Symbol(), n = this.getPropertyDescriptor(e, r, s);
      n !== void 0 && ts(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, s, r) {
    const { get: n, set: a } = ss(this.prototype, e) ?? { get() {
      return this[s];
    }, set(i) {
      this[s] = i;
    } };
    return { get: n, set(i) {
      const o = n == null ? void 0 : n.call(this);
      a == null || a.call(this, i), this.requestUpdate(e, o, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? it;
  }
  static _$Ei() {
    if (this.hasOwnProperty(he("elementProperties"))) return;
    const e = as(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(he("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(he("properties"))) {
      const s = this.properties, r = [...rs(s), ...ns(s)];
      for (const n of r) this.createProperty(n, s[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [r, n] of s) this.elementProperties.set(r, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, r] of this.elementProperties) {
      const n = this._$Eu(s, r);
      n !== void 0 && this._$Eh.set(n, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const n of r) s.unshift(nt(n));
    } else e !== void 0 && s.push(nt(e));
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
    return Qt(e, this.constructor.elementStyles), e;
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
    var a;
    const r = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, r);
    if (n !== void 0 && r.reflect === !0) {
      const i = (((a = r.converter) == null ? void 0 : a.toAttribute) !== void 0 ? r.converter : Me).toAttribute(s, r.type);
      this._$Em = e, i == null ? this.removeAttribute(n) : this.setAttribute(n, i), this._$Em = null;
    }
  }
  _$AK(e, s) {
    var a, i;
    const r = this.constructor, n = r._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const o = r.getPropertyOptions(n), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((a = o.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? o.converter : Me;
      this._$Em = n;
      const d = l.fromAttribute(s, o.type);
      this[n] = d ?? ((i = this._$Ej) == null ? void 0 : i.get(n)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, s, r, n = !1, a) {
    var i;
    if (e !== void 0) {
      const o = this.constructor;
      if (n === !1 && (a = this[e]), r ?? (r = o.getPropertyOptions(e)), !((r.hasChanged ?? Ye)(a, s) || r.useDefault && r.reflect && a === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(o._$Eu(e, r)))) return;
      this.C(e, s, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: r, reflect: n, wrapped: a }, i) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, i ?? s ?? this[e]), a !== !0 || i !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (s = void 0), this._$AL.set(e, s)), n === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [a, i] of this._$Ep) this[a] = i;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [a, i] of n) {
        const { wrapped: o } = i, l = this[a];
        o !== !0 || this._$AL.has(a) || l === void 0 || this.C(a, void 0, i, l);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), (r = this._$EO) == null || r.forEach((n) => {
        var a;
        return (a = n.hostUpdate) == null ? void 0 : a.call(n);
      }), this.update(s)) : this._$EM();
    } catch (n) {
      throw e = !1, this._$EM(), n;
    }
    e && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var s;
    (s = this._$EO) == null || s.forEach((r) => {
      var n;
      return (n = r.hostUpdated) == null ? void 0 : n.call(r);
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
Z.elementStyles = [], Z.shadowRootOptions = { mode: "open" }, Z[he("elementProperties")] = /* @__PURE__ */ new Map(), Z[he("finalized")] = /* @__PURE__ */ new Map(), Be == null || Be({ ReactiveElement: Z }), (j.reactiveElementVersions ?? (j.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = globalThis, ot = (t) => t, Oe = ue.trustedTypes, lt = Oe ? Oe.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Rt = "$lit$", R = `lit$${Math.random().toFixed(9).slice(2)}$`, jt = "?" + R, os = `<${jt}>`, V = document, fe = () => V.createComment(""), ge = (t) => t === null || typeof t != "object" && typeof t != "function", Xe = Array.isArray, ls = (t) => Xe(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Fe = `[ 	
\f\r]`, ce = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, dt = />/g, F = RegExp(`>|${Fe}(?:([^\\s"'>=/]+)(${Fe}*=${Fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ht = /'/g, ut = /"/g, Lt = /^(?:script|style|textarea|title)$/i, Ut = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), c = Ut(1), B = Ut(2), q = Symbol.for("lit-noChange"), x = Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), W = V.createTreeWalker(V, 129);
function Nt(t, e) {
  if (!Xe(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return lt !== void 0 ? lt.createHTML(e) : e;
}
const cs = (t, e) => {
  const s = t.length - 1, r = [];
  let n, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = ce;
  for (let o = 0; o < s; o++) {
    const l = t[o];
    let d, u, p = -1, m = 0;
    for (; m < l.length && (i.lastIndex = m, u = i.exec(l), u !== null); ) m = i.lastIndex, i === ce ? u[1] === "!--" ? i = ct : u[1] !== void 0 ? i = dt : u[2] !== void 0 ? (Lt.test(u[2]) && (n = RegExp("</" + u[2], "g")), i = F) : u[3] !== void 0 && (i = F) : i === F ? u[0] === ">" ? (i = n ?? ce, p = -1) : u[1] === void 0 ? p = -2 : (p = i.lastIndex - u[2].length, d = u[1], i = u[3] === void 0 ? F : u[3] === '"' ? ut : ht) : i === ut || i === ht ? i = F : i === ct || i === dt ? i = ce : (i = F, n = void 0);
    const f = i === F && t[o + 1].startsWith("/>") ? " " : "";
    a += i === ce ? l + os : p >= 0 ? (r.push(d), l.slice(0, p) + Rt + l.slice(p) + R + f) : l + R + (p === -2 ? o : f);
  }
  return [Nt(t, a + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class me {
  constructor({ strings: e, _$litType$: s }, r) {
    let n;
    this.parts = [];
    let a = 0, i = 0;
    const o = e.length - 1, l = this.parts, [d, u] = cs(e, s);
    if (this.el = me.createElement(d, r), W.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = W.nextNode()) !== null && l.length < o; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(Rt)) {
          const m = u[i++], f = n.getAttribute(p).split(R), _ = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: a, name: _[2], strings: f, ctor: _[1] === "." ? hs : _[1] === "?" ? us : _[1] === "@" ? ps : He }), n.removeAttribute(p);
        } else p.startsWith(R) && (l.push({ type: 6, index: a }), n.removeAttribute(p));
        if (Lt.test(n.tagName)) {
          const p = n.textContent.split(R), m = p.length - 1;
          if (m > 0) {
            n.textContent = Oe ? Oe.emptyScript : "";
            for (let f = 0; f < m; f++) n.append(p[f], fe()), W.nextNode(), l.push({ type: 2, index: ++a });
            n.append(p[m], fe());
          }
        }
      } else if (n.nodeType === 8) if (n.data === jt) l.push({ type: 2, index: a });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(R, p + 1)) !== -1; ) l.push({ type: 7, index: a }), p += R.length - 1;
      }
      a++;
    }
  }
  static createElement(e, s) {
    const r = V.createElement("template");
    return r.innerHTML = e, r;
  }
}
function ee(t, e, s = t, r) {
  var i, o;
  if (e === q) return e;
  let n = r !== void 0 ? (i = s._$Co) == null ? void 0 : i[r] : s._$Cl;
  const a = ge(e) ? void 0 : e._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== a && ((o = n == null ? void 0 : n._$AO) == null || o.call(n, !1), a === void 0 ? n = void 0 : (n = new a(t), n._$AT(t, s, r)), r !== void 0 ? (s._$Co ?? (s._$Co = []))[r] = n : s._$Cl = n), n !== void 0 && (e = ee(t, n._$AS(t, e.values), n, r)), e;
}
class ds {
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
    const { el: { content: s }, parts: r } = this._$AD, n = ((e == null ? void 0 : e.creationScope) ?? V).importNode(s, !0);
    W.currentNode = n;
    let a = W.nextNode(), i = 0, o = 0, l = r[0];
    for (; l !== void 0; ) {
      if (i === l.index) {
        let d;
        l.type === 2 ? d = new $e(a, a.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (d = new fs(a, this, e)), this._$AV.push(d), l = r[++o];
      }
      i !== (l == null ? void 0 : l.index) && (a = W.nextNode(), i++);
    }
    return W.currentNode = V, n;
  }
  p(e) {
    let s = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, s), s += r.strings.length - 2) : r._$AI(e[s])), s++;
  }
}
class $e {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, s, r, n) {
    this.type = 2, this._$AH = x, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = r, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    e = ee(this, e, s), ge(e) ? e === x || e == null || e === "" ? (this._$AH !== x && this._$AR(), this._$AH = x) : e !== this._$AH && e !== q && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ls(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== x && ge(this._$AH) ? this._$AA.nextSibling.data = e : this.T(V.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var a;
    const { values: s, _$litType$: r } = e, n = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = me.createElement(Nt(r.h, r.h[0]), this.options)), r);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === n) this._$AH.p(s);
    else {
      const i = new ds(n, this), o = i.u(this.options);
      i.p(s), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let s = pt.get(e.strings);
    return s === void 0 && pt.set(e.strings, s = new me(e)), s;
  }
  k(e) {
    Xe(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let r, n = 0;
    for (const a of e) n === s.length ? s.push(r = new $e(this.O(fe()), this.O(fe()), this, this.options)) : r = s[n], r._$AI(a), n++;
    n < s.length && (this._$AR(r && r._$AB.nextSibling, n), s.length = n);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, s); e !== this._$AB; ) {
      const n = ot(e).nextSibling;
      ot(e).remove(), e = n;
    }
  }
  setConnected(e) {
    var s;
    this._$AM === void 0 && (this._$Cv = e, (s = this._$AP) == null || s.call(this, e));
  }
}
class He {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, r, n, a) {
    this.type = 1, this._$AH = x, this._$AN = void 0, this.element = e, this.name = s, this._$AM = n, this.options = a, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = x;
  }
  _$AI(e, s = this, r, n) {
    const a = this.strings;
    let i = !1;
    if (a === void 0) e = ee(this, e, s, 0), i = !ge(e) || e !== this._$AH && e !== q, i && (this._$AH = e);
    else {
      const o = e;
      let l, d;
      for (e = a[0], l = 0; l < a.length - 1; l++) d = ee(this, o[r + l], s, l), d === q && (d = this._$AH[l]), i || (i = !ge(d) || d !== this._$AH[l]), d === x ? e = x : e !== x && (e += (d ?? "") + a[l + 1]), this._$AH[l] = d;
    }
    i && !n && this.j(e);
  }
  j(e) {
    e === x ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class hs extends He {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === x ? void 0 : e;
  }
}
class us extends He {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== x);
  }
}
class ps extends He {
  constructor(e, s, r, n, a) {
    super(e, s, r, n, a), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = ee(this, e, s, 0) ?? x) === q) return;
    const r = this._$AH, n = e === x && r !== x || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, a = e !== x && (r === x || n);
    n && this.element.removeEventListener(this.name, this, r), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class fs {
  constructor(e, s, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ee(this, e);
  }
}
const We = ue.litHtmlPolyfillSupport;
We == null || We(me, $e), (ue.litHtmlVersions ?? (ue.litHtmlVersions = [])).push("3.3.3");
const gs = (t, e, s) => {
  const r = (s == null ? void 0 : s.renderBefore) ?? e;
  let n = r._$litPart$;
  if (n === void 0) {
    const a = (s == null ? void 0 : s.renderBefore) ?? null;
    r._$litPart$ = n = new $e(e.insertBefore(fe(), a), a, void 0, s ?? {});
  }
  return n._$AI(t), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis;
let v = class extends Z {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = gs(s, this.renderRoot, this.renderOptions);
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
    return q;
  }
};
var It;
v._$litElement$ = !0, v.finalized = !0, (It = K.litElementHydrateSupport) == null || It.call(K, { LitElement: v });
const Ke = K.litElementPolyfillSupport;
Ke == null || Ke({ LitElement: v });
(K.litElementVersions ?? (K.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const b = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ms = { attribute: !0, type: String, converter: Me, reflect: !1, hasChanged: Ye }, vs = (t = ms, e, s) => {
  const { kind: r, metadata: n } = s;
  let a = globalThis.litPropertyMetadata.get(n);
  if (a === void 0 && globalThis.litPropertyMetadata.set(n, a = /* @__PURE__ */ new Map()), r === "setter" && ((t = Object.create(t)).wrapped = !0), a.set(s.name, t), r === "accessor") {
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
function h(t) {
  return (e, s) => typeof s == "object" ? vs(t, e, s) : ((r, n, a) => {
    const i = n.hasOwnProperty(a);
    return n.constructor.createProperty(a, r), i ? Object.getOwnPropertyDescriptor(n, a) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(t) {
  return h({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _s = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Bt(t, e) {
  return (s, r, n) => {
    const a = (i) => {
      var o;
      return ((o = i.renderRoot) == null ? void 0 : o.querySelector(t)) ?? null;
    };
    return _s(s, r, { get() {
      return a(this);
    } });
  };
}
const E = y`
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

    --lucarne-skeleton-base: rgba(0, 0, 0, 0.06);
    --lucarne-skeleton-highlight: rgba(0, 0, 0, 0.12);
    --lucarne-pan-easing: cubic-bezier(0.32, 0.72, 0, 1);
    --lucarne-pan-duration: 240ms;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --lucarne-skeleton-base: rgba(255, 255, 255, 0.08);
      --lucarne-skeleton-highlight: rgba(255, 255, 255, 0.16);
    }
  }
`;
function ys(t, e, s) {
  let r, n = !1;
  return t.connection.subscribeMessage(
    (a) => {
      var i, o;
      (o = (i = a.variables) == null ? void 0 : i.trigger) != null && o.to_state && s(a.variables.trigger.to_state);
    },
    { type: "subscribe_trigger", trigger: { platform: "state", entity_id: e } }
  ).then((a) => {
    n ? a() : r = a;
  }), () => {
    n = !0, r == null || r();
  };
}
function ft(t) {
  return typeof t == "string" ? t : t && typeof t == "object" ? t.dateTime ?? t.date ?? "" : "";
}
function bs(t) {
  const e = {
    start: ft(t.start),
    end: ft(t.end),
    summary: t.summary ?? ""
  };
  return t.description && (e.description = t.description), t.location && (e.location = t.location), t.uid && (e.uid = t.uid), t.recurrence_id && (e.recurrence_id = t.recurrence_id), t.rrule && (e.rrule = t.rrule), e;
}
async function Ft(t, e, s, r) {
  const n = /* @__PURE__ */ new Set(), a = encodeURIComponent(s.toISOString()), i = encodeURIComponent(r.toISOString()), o = await Promise.all(
    e.map(
      (l) => t.callApi(
        "GET",
        `calendars/${encodeURIComponent(l)}?start=${a}&end=${i}`
      ).then((d) => [l, d.map(bs)]).catch((d) => (console.warn(`[lucarne] GET /api/calendars/${l} failed:`, d), n.add(l), [l, []]))
    )
  );
  return { events: new Map(o), failed: n };
}
async function ws(t, e, s, r, n) {
  await t.connection.sendMessagePromise({
    type: "calendar/event/delete",
    entity_id: e,
    uid: s,
    recurrence_id: r,
    recurrence_range: n
  });
}
const $s = 2;
function xs(t, e) {
  var r, n;
  const s = (n = (r = t.states[e]) == null ? void 0 : r.attributes) == null ? void 0 : n.supported_features;
  return typeof s != "number" ? !1 : (s & $s) !== 0;
}
function Cs(t, e, s) {
  const r = async () => {
    var n, a;
    try {
      const i = await t.connection.sendMessagePromise({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: {},
        target: { entity_id: e },
        return_response: !0
      });
      s(((a = (n = i == null ? void 0 : i.response) == null ? void 0 : n[e]) == null ? void 0 : a.items) ?? []);
    } catch (i) {
      console.warn(`[lucarne] todo.get_items failed for ${e}:`, i), s([]);
    }
  };
  return r(), ys(t, e, () => r());
}
function ks(t) {
  let e = t;
  for (; e; ) {
    if (e instanceof Element) {
      const n = e.tagName.toLowerCase();
      if (n === "hui-dialog-edit-card" || n === "ha-dialog") return !0;
    }
    const s = e.parentNode;
    if (s) {
      e = s;
      continue;
    }
    const r = e.getRootNode();
    e = r instanceof ShadowRoot ? r.host : null;
  }
  return !1;
}
function Es(t) {
  let e = t.parentElement;
  for (; e && !e.style.getPropertyValue("--column-size"); )
    e = e.parentElement;
  return (e == null ? void 0 : e.parentElement) ?? null;
}
function Wt(t) {
  if (!ks(t)) return null;
  const e = Es(t);
  if (!e) return null;
  const s = e.style.getPropertyValue("--grid-column-count"), r = () => {
    e.style.getPropertyValue("--grid-column-count") !== "1" && e.style.setProperty("--grid-column-count", "1");
  };
  r();
  const n = new MutationObserver(r);
  return n.observe(e, { attributes: !0, attributeFilter: ["style"] }), {
    uninstall() {
      n.disconnect(), s ? e.style.setProperty("--grid-column-count", s) : e.style.removeProperty("--grid-column-count");
    }
  };
}
const w = {
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
var Ds = Object.defineProperty, Ss = Object.getOwnPropertyDescriptor, Re = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Ss(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Ds(e, s, n), n;
};
function pe(t) {
  return t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
}
function Ps(t, e, s) {
  return t.filter((r) => pe(r.end) > e).sort((r, n) => pe(r.start).getTime() - pe(n.start).getTime()).slice(0, s);
}
function Ts(t, e, s) {
  const r = t.getTime() - s.getTime();
  if (t <= s && s < e) return w.timePillNow;
  if (r > 0 && r < 60 * 60 * 1e3) {
    const d = Math.round(r / 6e4);
    return w.timePillInMinutes(d);
  }
  if (r > 0 && r < 2 * 60 * 60 * 1e3) {
    const d = Math.round(r / 36e5);
    return w.timePillInHours(d);
  }
  const a = t.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (t.toDateString() === s.toDateString()) return a;
  const o = new Date(s);
  return o.setDate(s.getDate() + 1), t.toDateString() === o.toDateString() ? w.timePillTomorrow(a) : `${t.toLocaleDateString("en", { weekday: "short" })} ${a}`;
}
function As(t) {
  return t.start.length === 10 && t.end.length === 10;
}
let te = class extends v {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.limit = 5;
  }
  render() {
    const t = /* @__PURE__ */ new Date(), e = Ps(this.events, t, this.limit);
    return e.length === 0 ? c`<div class="empty-state">${w.nothingOnCalendar}</div>` : c`
      ${e.map((s) => {
      const r = pe(s.start), n = pe(s.end), a = r <= t && t < n, i = As(s) ? "all day" : Ts(r, n, t), o = this._colorForEvent(s);
      return c`
          <div class="event-row">
            <div class="time-pill ${a ? "now" : ""}">
              ${a ? c`<span class="pulse-dot"></span>` : ""} ${i}
            </div>
            <div class="color-bar" style="background:${o}"></div>
            <div class="event-content">
              <div class="event-summary">${s.summary}</div>
              ${s.location ? c`<div class="event-secondary">${s.location}</div>` : ""}
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
te.styles = [
  E,
  y`
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
Re([
  h({ type: Array })
], te.prototype, "events", 2);
Re([
  h({ type: Object })
], te.prototype, "calendarColors", 2);
Re([
  h({ type: Number })
], te.prototype, "limit", 2);
te = Re([
  b("lucarne-agenda-strip")
], te);
const gt = B`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`, Q = B`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>`, de = B`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`, mt = B`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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
</svg>`, Ms = B`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M4.22 19.78l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="currentColor"/>
  <path d="M20 15h-1.26A6 6 0 1 0 8 20h12a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.7"/>
</svg>`;
B`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="7" r="4"/>
  <path d="M20 21a8 8 0 1 0-16 0"/>
</svg>`;
B`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"/>
</svg>`;
const Os = B`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, vt = {
  sunny: gt,
  "clear-night": gt,
  cloudy: Q,
  fog: Q,
  hail: de,
  lightning: de,
  "lightning-rainy": de,
  partlycloudy: Ms,
  pouring: de,
  rainy: de,
  snowy: mt,
  "snowy-rainy": mt,
  windy: Q,
  "windy-variant": Q,
  exceptional: Q
};
function _t(t) {
  return vt[t] ?? vt[t.toLowerCase()] ?? Q;
}
const zs = {
  sunny: "#f4b740",
  "clear-night": "#7a86c8",
  cloudy: "#8aa0b8",
  partlycloudy: "#9bb3cf",
  rainy: "#5a8fc0",
  pouring: "#4a7aa8",
  snowy: "#a8c5e8",
  "snowy-rainy": "#86a8d0",
  fog: "#a8a8a8",
  hail: "#7ac0d8",
  lightning: "#c89c4a",
  "lightning-rainy": "#a08358",
  windy: "#7a8a95",
  "windy-variant": "#7a8a95",
  exceptional: "#c87060"
};
function yt(t) {
  return zs[t.toLowerCase()] ?? "#8aa0b8";
}
function Is(t) {
  if (!t.length) return w.dressingTipDefault;
  const e = t[0];
  if (e.condition.toLowerCase().includes("snow"))
    return w.dressingTipBoots;
  const r = e.temperature;
  let n;
  return r < 5 ? n = w.dressingTipHeavyCoat : r < 12 ? n = w.dressingTipCoatScarf : r < 18 ? n = w.dressingTipLightJacket : r < 24 ? n = w.dressingTipTShirt : n = w.dressingTipShorts, (e.precipitation_probability ?? 0) > 50 && (n += w.dressingTipUmbrella), n;
}
var Hs = Object.defineProperty, Rs = Object.getOwnPropertyDescriptor, Ge = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Rs(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Hs(e, s, n), n;
};
let ve = class extends v {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return c`<div class="empty-state">${w.addWeatherEntity}</div>`;
    const t = this.weatherEntity.attributes, e = t.temperature, s = t.temperature_unit ?? "°C", r = this.weatherEntity.state, n = this.forecast[0], a = this.forecast[1], i = Is(this.forecast);
    return c`
      <div class="current">
        <span class="condition-icon" style="color: ${yt(r)}">${_t(r)}</span>
        <div class="temp-group">
          <div class="current-temp">${e !== void 0 ? `${Math.round(e)}${s}` : w.errorUnavailable}</div>
          ${n ? c`<div class="high-low">
                ↑${Math.round(n.temperature)}${s}
                ${n.templow !== void 0 ? ` ↓${Math.round(n.templow)}${s}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${a ? c`
            <div class="tomorrow-row">
              <span class="tomorrow-icon" style="color: ${yt(a.condition)}">${_t(a.condition)}</span>
              <span>Tomorrow ↑${Math.round(a.temperature)}${s}${a.templow !== void 0 ? ` ↓${Math.round(a.templow)}${s}` : ""}</span>
            </div>
          ` : ""}
      <div class="dressing-tip">
        <span class="dressing-label">Wear:</span>
        ${i}
      </div>
    `;
  }
};
ve.styles = [
  E,
  y`
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
Ge([
  h({ attribute: !1 })
], ve.prototype, "weatherEntity", 2);
Ge([
  h({ type: Array })
], ve.prototype, "forecast", 2);
ve = Ge([
  b("lucarne-weather-block")
], ve);
var js = Object.defineProperty, Ls = Object.getOwnPropertyDescriptor, Je = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Ls(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && js(e, s, n), n;
};
let _e = class extends v {
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
    const t = this.items.filter((n) => n.status === "needs_action"), e = t.length, s = t.slice(0, 3), r = e - s.length;
    return e === 0 ? c`
        <div class="empty-state">
          <span class="empty-icon">${Os}</span>
          ${w.allDone}
        </div>
      ` : c`
      <div class="header">
        ${w.tasksTitle}
        <span class="count-badge">${e}</span>
      </div>
      ${s.map(
      (n) => c`
          <div class="task-row">
            <span class="summary">${n.summary}</span>
            ${n.due ? c`<span class="due-chip">${this._formatDue(n.due)}</span>` : ""}
          </div>
        `
    )}
      ${r > 0 ? c`<div class="more-row" @click=${this._handleMoreClick}>
            ${w.moreItems(r)}
          </div>` : ""}
    `;
  }
  _formatDue(t) {
    const e = t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
    return isNaN(e.getTime()) ? t : e.toLocaleDateString("en", { month: "short", day: "numeric" });
  }
};
_e.styles = [
  E,
  y`
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
Je([
  h({ type: Array })
], _e.prototype, "items", 2);
Je([
  h({ type: String })
], _e.prototype, "todoEntityId", 2);
_e = Je([
  b("lucarne-tasks-summary")
], _e);
var Us = Object.defineProperty, Ns = Object.getOwnPropertyDescriptor, Kt = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Ns(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Us(e, s, n), n;
};
let ze = class extends v {
  constructor() {
    super(...arguments), this.entries = [];
  }
  render() {
    return c`
      ${this.entries.map(
      (t) => c`
          <span class="pill ${t.isHome ? "home" : "away"}">
            <span class="dot"></span>
            ${t.name}
          </span>
        `
    )}
    `;
  }
};
ze.styles = [
  E,
  y`
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
Kt([
  h({ type: Array })
], ze.prototype, "entries", 2);
ze = Kt([
  b("lucarne-presence-pills")
], ze);
var Bs = Object.defineProperty, Fs = Object.getOwnPropertyDescriptor, ie = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Fs(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Bs(e, s, n), n;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-today-card",
  name: "Lucarne Today",
  description: "Family agenda + weather + tasks + presence",
  preview: !0
});
let L = class extends v {
  constructor() {
    super(...arguments), this._calendarEvents = /* @__PURE__ */ new Map(), this._forecast = [], this._todoItems = [], this._fetchingForecast = !1, this._lastWeatherState = "";
  }
  setConfig(t) {
    if (!t.calendars || !Array.isArray(t.calendars) || t.calendars.length === 0)
      throw new Error('lucarne-today-card: "calendars" must be a non-empty array');
    for (const e of t.calendars)
      if (!e.entity || !e.color)
        throw new Error('lucarne-today-card: each calendar entry requires "entity" and "color"');
    this._config = t, this.isConnected && (this._teardownSubscriptions(), this._setupSubscriptions());
  }
  static getConfigElement() {
    return document.createElement("lucarne-today-card-editor");
  }
  static getStubConfig(t) {
    const e = Object.keys(t.states).filter((a) => a.startsWith("calendar.")).slice(0, 3), s = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], r = e.map((a, i) => ({
      entity: a,
      color: s[i] ?? "#a8d8b9"
    })), n = "weather.forecast_home" in t.states;
    return {
      type: "custom:lucarne-today-card",
      title: w.today,
      calendars: r.length ? r : [{ entity: "calendar.example", color: "#a8d8b9" }],
      weather: n ? "weather.forecast_home" : void 0
    };
  }
  getCardSize() {
    return 4;
  }
  getGridOptions() {
    return { columns: 6, rows: "auto", min_columns: 3, max_columns: 6 };
  }
  connectedCallback() {
    super.connectedCallback(), this._setupSubscriptions(), requestAnimationFrame(() => {
      this._previewOverride = Wt(this);
    });
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this._teardownSubscriptions(), (t = this._previewOverride) == null || t.uninstall(), this._previewOverride = void 0;
  }
  _setupSubscriptions() {
    !this._config || !this.hass || (this._fetchCalendarEvents(), this._config.weather && this._fetchForecast(), this._calendarIntervalId = setInterval(() => {
      var t;
      this._fetchCalendarEvents(), (t = this._config) != null && t.weather && this._fetchForecast();
    }, 5 * 60 * 1e3), this._config.tasks && (this._todoUnsub = Cs(this.hass, this._config.tasks, (t) => {
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
      const n = (r = this.hass.states[s]) == null ? void 0 : r.state;
      n && n !== this._lastWeatherState && (this._lastWeatherState = n, this._fetchForecast());
    }
  }
  async _fetchCalendarEvents() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.map((a) => a.entity), e = /* @__PURE__ */ new Date(), s = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), { events: r } = await Ft(this.hass, t, e, s), n = /* @__PURE__ */ new Map();
    for (const [a, i] of r.entries())
      n.set(
        a,
        i.map((o) => ({ ...o, uid: `${a}::${o.uid ?? o.summary}` }))
      );
    this._calendarEvents = n;
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
      } catch (r) {
        console.warn(`[lucarne] weather.get_forecasts failed for ${this._config.weather}:`, r), this._forecast = [];
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
    if (!this._config) return c``;
    const t = this._config.weather ? (s = this.hass) == null ? void 0 : s.states[this._config.weather] : void 0, e = (this._config.presence ?? []).map((r) => {
      var n, a;
      return {
        name: r.name,
        isHome: ((a = (n = this.hass) == null ? void 0 : n.states[r.entity]) == null ? void 0 : a.state) === "on"
      };
    });
    return c`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${this._config.title ?? w.today}</h2>
          ${e.length > 0 ? c`<lucarne-presence-pills .entries=${e}></lucarne-presence-pills>` : ""}
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
            ${this._config.tasks ? c`
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
L.styles = [
  E,
  y`
      :host {
        display: block;
        width: 100%;
        font-family: var(--primary-font-family, sans-serif);
        container-type: inline-size;
      }
      ha-card {
        width: 100%;
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
      @container (max-width: 500px) {
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
ie([
  h({ attribute: !1 })
], L.prototype, "hass", 2);
ie([
  g()
], L.prototype, "_config", 2);
ie([
  g()
], L.prototype, "_calendarEvents", 2);
ie([
  g()
], L.prototype, "_forecast", 2);
ie([
  g()
], L.prototype, "_todoItems", 2);
L = ie([
  b("lucarne-today-card")
], L);
const Vt = y`
  :host {
    display: flex;
    flex-direction: column;
    gap: var(--lucarne-spacing-md);
    padding: var(--lucarne-spacing-lg);
    box-sizing: border-box;
    width: 100%;
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
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--lucarne-spacing-xs);
  }
  .field-label {
    font-size: var(--lucarne-fs-sm);
    color: var(--lucarne-on-surface-muted);
  }
  .row {
    display: flex;
    gap: var(--lucarne-spacing-sm);
    align-items: flex-start;
  }
  .row > * {
    flex: 1;
  }
  .text-input,
  .select-input {
    font: inherit;
    font-size: var(--lucarne-fs-md);
    color: var(--lucarne-on-surface);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
    border-radius: var(--lucarne-radius-sm);
    padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-md);
    width: 100%;
    box-sizing: border-box;
  }
  .text-input:focus,
  .select-input:focus {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: -1px;
  }
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--lucarne-spacing-md);
    padding: var(--lucarne-spacing-xs) 0;
  }
  .toggle-label {
    font-size: var(--lucarne-fs-md);
    color: var(--lucarne-on-surface);
  }
  .cal-row,
  .presence-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: var(--lucarne-spacing-sm);
    align-items: center;
    padding: var(--lucarne-spacing-sm) 0;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
  }
  .presence-row {
    grid-template-columns: 1fr auto;
  }
  .row-stack {
    display: flex;
    flex-direction: column;
    gap: var(--lucarne-spacing-xs);
    min-width: 0;
  }
  .cal-row ha-entity-picker,
  .presence-row ha-entity-picker,
  .row ha-entity-picker,
  .row-stack ha-entity-picker {
    width: 100%;
    min-width: 0;
  }
  .cal-color {
    width: 24px;
    height: 24px;
    border-radius: var(--lucarne-radius-sm);
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
    cursor: pointer;
    flex-shrink: 0;
    padding: 0;
    appearance: none;
    -webkit-appearance: none;
  }
  .cal-color::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  .cal-color::-webkit-color-swatch {
    border: none;
    border-radius: var(--lucarne-radius-sm);
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
  .editor-error {
    color: var(--error-color, #f44336);
    font-size: var(--lucarne-fs-sm);
    margin-top: var(--lucarne-spacing-xs);
  }
  button.add {
    background: none;
    border: 1px dashed var(--divider-color, rgba(0, 0, 0, 0.2));
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
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
  }
  .loading {
    color: var(--lucarne-on-surface-muted);
    font-size: var(--lucarne-fs-sm);
    text-align: center;
    padding: var(--lucarne-spacing-lg);
  }
`, bt = ["ha-entity-picker", "ha-textfield"], Ws = 3e3;
let Se;
function Ks(t) {
  return new Promise((e) => setTimeout(e, t));
}
async function Vs() {
  const t = window.loadCardHelpers;
  if (t)
    try {
      const n = await t(), i = (await Promise.resolve(
        n.createCardElement({ type: "entities", entities: [] })
      )).constructor;
      typeof (i == null ? void 0 : i.getConfigElement) == "function" && await Promise.resolve(i.getConfigElement());
    } catch (n) {
      console.warn("[lucarne] loadCardHelpers failed; falling back to whenDefined", n);
    }
  const e = Promise.all(
    bt.map((n) => customElements.whenDefined(n))
  ).then(() => "ready"), s = Ks(Ws).then(() => "timeout");
  if (await Promise.race([e, s]) === "timeout" && !bt.every((n) => customElements.get(n)))
    throw new Error("[lucarne] HA form elements did not register within timeout");
}
function Ze() {
  return Se || (Se = Vs().catch((t) => {
    throw Se = void 0, t;
  })), Se;
}
var wt, $t;
(function(t) {
  t.language = "language", t.system = "system", t.comma_decimal = "comma_decimal", t.decimal_comma = "decimal_comma", t.space_comma = "space_comma", t.none = "none";
})(wt || (wt = {})), function(t) {
  t.language = "language", t.system = "system", t.am_pm = "12", t.twenty_four = "24";
}($t || ($t = {}));
var Qe = function(t, e, s, r) {
  r = r || {}, s = s ?? {};
  var n = new Event(e, { bubbles: r.bubbles === void 0 || r.bubbles, cancelable: !!r.cancelable, composed: r.composed === void 0 || r.composed });
  return n.detail = s, t.dispatchEvent(n), n;
}, qs = Object.defineProperty, Ys = Object.getOwnPropertyDescriptor, je = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Ys(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && qs(e, s, n), n;
};
let se = class extends v {
  constructor() {
    super(...arguments), this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), Ze().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    Qe(this, "config-changed", { config: t });
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
    var r, n;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], entity: ((n = e.detail) == null ? void 0 : n.value) ?? "" }, this._fire({ ...this._config, calendars: s });
  }
  _calColorChanged(t, e) {
    var r;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], color: e.target.value }, this._fire({ ...this._config, calendars: s });
  }
  _removeCalendar(t) {
    var s;
    const e = [...((s = this._config) == null ? void 0 : s.calendars) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, calendars: e }));
  }
  _addCalendar() {
    var r, n;
    const e = Object.keys(((r = this.hass) == null ? void 0 : r.states) ?? {}).find((a) => a.startsWith("calendar.")) ?? "calendar.example", s = [
      ...((n = this._config) == null ? void 0 : n.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: s });
  }
  _presenceEntityChanged(t, e) {
    var r, n;
    const s = [...((r = this._config) == null ? void 0 : r.presence) ?? []];
    s[t] = { ...s[t], entity: ((n = e.detail) == null ? void 0 : n.value) ?? "" }, this._fire({ ...this._config, presence: s });
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
    if (!this._config) return c``;
    if (!this._haReady) return c`<div class="loading">Loading editor…</div>`;
    const t = this._config.calendars ?? [], e = this._config.presence ?? [];
    return c`
      <label class="field">
        <span class="field-label">Card title</span>
        <input
          class="text-input"
          type="text"
          .value=${this._config.title ?? ""}
          @change=${this._titleChanged}
        />
      </label>
      <label class="field">
        <span class="field-label">Agenda limit (1–10)</span>
        <input
          class="text-input"
          type="number"
          min="1"
          max="10"
          .value=${String(this._config.agenda_limit ?? 5)}
          @change=${this._agendaLimitChanged}
        />
      </label>

      <ha-entity-picker
        label="Weather entity"
        .hass=${this.hass}
        .value=${this._config.weather ?? ""}
        .includeDomains=${["weather"]}
        allow-custom-entity
        @value-changed=${this._weatherChanged}
      ></ha-entity-picker>

      <ha-entity-picker
        label="Todo entity"
        .hass=${this.hass}
        .value=${this._config.tasks ?? ""}
        .includeDomains=${["todo"]}
        allow-custom-entity
        @value-changed=${this._tasksChanged}
      ></ha-entity-picker>

      <div class="section-label">Calendars</div>
      ${t.map(
      (s, r) => c`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${s.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(n) => this._calEntityChanged(r, n)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${s.color}
              @input=${(n) => this._calColorChanged(r, n)}
              title="Calendar color"
            />
            <button type="button" class="remove" @click=${() => this._removeCalendar(r)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addCalendar}>+ Add calendar</button>

      <div class="section-label">Presence</div>
      ${e.map(
      (s, r) => c`
          <div class="presence-row">
            <div class="row-stack">
              <ha-entity-picker
                label="Entity"
                .hass=${this.hass}
                .value=${s.entity}
                .includeDomains=${["input_boolean"]}
                allow-custom-entity
                @value-changed=${(n) => this._presenceEntityChanged(r, n)}
              ></ha-entity-picker>
              <input
                class="text-input"
                type="text"
                placeholder="Display name"
                .value=${s.name}
                @change=${(n) => this._presenceNameChanged(r, n)}
              />
            </div>
            <button type="button" class="remove" @click=${() => this._removePresence(r)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addPresence}>+ Add person</button>
    `;
  }
};
se.styles = [E, Vt];
je([
  h({ attribute: !1 })
], se.prototype, "hass", 2);
je([
  g()
], se.prototype, "_config", 2);
je([
  g()
], se.prototype, "_haReady", 2);
se = je([
  b("lucarne-today-card-editor")
], se);
function qt(t, e) {
  var r, n, a;
  const s = (a = (n = (r = e == null ? void 0 : e.states) == null ? void 0 : r[t.entity]) == null ? void 0 : n.attributes) == null ? void 0 : a.friendly_name;
  return typeof s == "string" && s ? s : t.entity;
}
function xt(t, e) {
  return t.map((s) => ({ ...s, label: qt(s, e) }));
}
function Ct(t, e) {
  const s = parseInt(t.split(":")[0], 10), r = parseInt(e.split(":")[0], 10), n = [];
  for (let a = s; a <= r; a++)
    n.push(a);
  return n;
}
function Xs(t, e, s) {
  const [r, n] = e.split(":").map(Number), [a, i] = s.split(":").map(Number), o = new Date(t);
  o.setHours(r, n, 0, 0);
  const l = new Date(t);
  return l.setHours(a, i, 0, 0), { bandStartMs: o.getTime(), bandEndMs: l.getTime() };
}
function Gs(t, e, s, r) {
  const n = kt(t.start).getTime(), a = kt(t.end).getTime(), { bandStartMs: i, bandEndMs: o } = Xs(e, s, r), l = Math.max(n, i), d = Math.min(a, o);
  return l >= d ? null : { start: new Date(l), end: new Date(d) };
}
function kt(t) {
  return t.length === 10 && !t.includes("T") ? /* @__PURE__ */ new Date(`${t}T00:00:00`) : new Date(t);
}
function Js(t) {
  return t.start.length === 10 && !t.start.includes("T");
}
function T(t) {
  const e = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
  return `${e}-${s}-${r}`;
}
function Yt(t) {
  return t.uid ?? `${t.start}|${t.end}|${t.summary ?? ""}`;
}
function Zs(t) {
  if (t.length === 0) return [];
  const e = t.map((l, d) => ({ ...l, _idx: d }));
  e.sort((l, d) => l.start.getTime() - d.start.getTime());
  const s = [], r = new Array(t.length);
  for (const l of e) {
    const d = l.start.getTime();
    let u = s.findIndex((p) => p <= d);
    u === -1 ? (u = s.length, s.push(l.end.getTime())) : s[u] = l.end.getTime(), r[l._idx] = u;
  }
  const n = new Array(t.length), a = [];
  let i = 0, o = e[0].end.getTime();
  n[e[0]._idx] = 0, a.push(r[e[0]._idx]);
  for (let l = 1; l < e.length; l++) {
    const d = e[l];
    d.start.getTime() >= o ? (i++, a.push(0), o = d.end.getTime()) : o = Math.max(o, d.end.getTime()), n[d._idx] = i, a[i] = Math.max(a[i], r[d._idx]);
  }
  return r.map((l, d) => ({
    lane: l,
    laneCount: a[n[d]] + 1
  }));
}
function Pe(t, e) {
  const [s, r] = e.split(":").map(Number), n = new Date(t);
  return n.setHours(s, r, 0, 0), n.getTime();
}
function Qs(t, e, s, r) {
  const n = /* @__PURE__ */ new Map();
  for (const o of e)
    n.set(T(o), { allDay: [], inBand: [], earlier: [], later: [] });
  const a = e.length > 0 ? e[0] : null, i = e.length > 0 ? e[e.length - 1] : null;
  for (const o of t) {
    if (Js(o)) {
      const u = /* @__PURE__ */ new Date(o.start + "T00:00:00"), p = /* @__PURE__ */ new Date(o.end + "T00:00:00"), m = a !== null && u < a, f = i ? new Date(i) : null;
      f && f.setDate(f.getDate() + 1);
      const _ = f !== null && p > f;
      for (const $ of e) {
        const P = T($), M = n.get(P);
        if ($ >= u && $ < p && (M.allDay.push(o), m || _)) {
          M.allDayClipped || (M.allDayClipped = /* @__PURE__ */ new Map());
          const Ee = a !== null && T($) === T(a), De = i !== null && T($) === T(i);
          M.allDayClipped.set(Yt(o), {
            left: m && Ee,
            right: _ && De
          });
        }
      }
      continue;
    }
    const l = new Date(o.start), d = new Date(o.end);
    for (const u of e) {
      const p = T(u), m = n.get(p), f = new Date(u);
      f.setHours(0, 0, 0, 0);
      const _ = new Date(u);
      if (_.setHours(23, 59, 59, 999), d <= f || l > _) continue;
      const $ = Pe(u, s), P = Pe(u, r);
      if (d.getTime() <= $)
        m.earlier.push(o);
      else if (l.getTime() >= P)
        m.later.push(o);
      else {
        const M = Gs(o, u, s, r);
        if (M) {
          const Ee = P - $, De = (M.start.getTime() - $) / Ee * 100, Jt = (M.end.getTime() - M.start.getTime()) / Ee * 100;
          m.inBand.push({
            event: o,
            lane: 0,
            laneCount: 1,
            topPercent: Math.max(0, Math.min(100, De)),
            heightPercent: Math.max(0, Math.min(100 - De, Jt))
          });
        }
      }
    }
  }
  for (const o of e) {
    const l = T(o), d = n.get(l);
    if (d.inBand.length === 0) continue;
    const u = Pe(o, s), m = Pe(o, r) - u, f = d.inBand.map(($) => {
      const P = u + $.topPercent / 100 * m, M = P + $.heightPercent / 100 * m;
      return {
        event: $.event,
        start: new Date(P),
        end: new Date(M),
        lane: 0
      };
    }), _ = Zs(f);
    d.inBand = d.inBand.map(($, P) => ({
      ...$,
      lane: _[P].lane,
      laneCount: _[P].laneCount
    }));
  }
  return { days: e, perDay: n };
}
function er(t, e) {
  const s = Math.min(e.minColWidth, e.maxColWidth), r = Math.max(e.minColWidth, e.maxColWidth), n = Math.min(e.minDays, e.maxDays), a = Math.max(e.minDays, e.maxDays), i = Math.max(0, t - e.timeColWidth);
  if (i <= 0)
    return { visibleCount: n, dayWidthPx: s };
  const o = Math.floor(i / s), l = Math.ceil(i / r), d = Math.min(a, Math.max(n, l, Math.min(o, a))), u = i / d;
  return { visibleCount: d, dayWidthPx: u };
}
function tr(t) {
  return `syn:${t.start}|${t.end}|${t.summary ?? ""}`;
}
function Et(t) {
  if (t !== void 0 && !(typeof t != "number" || !Number.isFinite(t)))
    return Math.max(0, Math.floor(t));
}
function Te(t, e) {
  const s = new Date(t);
  return s.setDate(s.getDate() + e), s;
}
function Dt(t) {
  const e = new Date(t);
  return e.setHours(0, 0, 0, 0), e;
}
class sr {
  constructor(e, s) {
    this._isConnected = !1, this._hasHass = !1, this._dayOffset = 0, this._fetchSeq = 0, this._cachedEvents = /* @__PURE__ */ new Map(), this._cachedDayKeys = /* @__PURE__ */ new Set(), this._host = e, this._opts = s, this._fetcher = s.fetcher ?? Ft, this._pollIntervalMs = s.pollIntervalMs ?? 5 * 6e4, this._tickIntervalMs = s.tickIntervalMs ?? 6e4, this._panBound = s.panBoundDays ?? 90, this._visibleCount = s.visibleCount, this._bufferDaysExplicit = Et(s.bufferDays);
    const r = (s.now ?? (() => /* @__PURE__ */ new Date()))();
    this._anchorToday = Dt(r), e.addController(this);
  }
  // -------------------------------------------------------------------------
  // Lit ReactiveController lifecycle
  // -------------------------------------------------------------------------
  hostConnected() {
    this._isConnected = !0, this._tickIntervalMs > 0 && (this._tickTimer = setInterval(() => this.tick(), this._tickIntervalMs)), this._pollIntervalMs > 0 && (this._pollTimer = setInterval(() => this._poll(), this._pollIntervalMs)), this._hass && this._fetchRange(...this._computeRange());
  }
  hostDisconnected() {
    this._isConnected = !1, clearInterval(this._tickTimer), clearInterval(this._pollTimer), this._tickTimer = void 0, this._pollTimer = void 0;
  }
  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------
  setHass(e) {
    const s = !this._hasHass;
    this._hass = e, this._hasHass = !0, s && this._isConnected && this._fetchRange(...this._computeRange());
  }
  updateCalendars(e) {
    const s = new Set(this._opts.calendars.map((a) => a.entity)), r = new Set(e.map((a) => a.entity)), n = s.size !== r.size || [...r].some((a) => !s.has(a));
    this._opts.calendars = e, n && this._hass && this._fetchRange(...this._computeRange());
  }
  setVisibleCount(e) {
    var r, n;
    const s = this._visibleCount;
    if (this._visibleCount = e, (n = (r = this._opts).onChange) == null || n.call(r), this._host.requestUpdate(), e !== s) {
      const [a, i] = this._computeRange();
      this._rangeIsCovered(a, i) || this._fetchRange(a, i);
    }
  }
  /**
   * Set the off-screen render buffer (days drawn on each side of the visible
   * window). Pass `undefined` to revert to the default (matches visibleCount).
   * Non-finite or non-numeric input is coerced to `undefined` (default) so
   * bad YAML config doesn't blank the grid.
   */
  setBufferDays(e) {
    var r, n;
    const s = Et(e);
    s !== this._bufferDaysExplicit && (this._bufferDaysExplicit = s, (n = (r = this._opts).onChange) == null || n.call(r), this._host.requestUpdate());
  }
  pan(e) {
    var o, l;
    const s = -this._panBound, r = this._panBound - this._visibleCount, n = Math.max(s, Math.min(r, this._dayOffset + e));
    this._dayOffset = n, (l = (o = this._opts).onChange) == null || l.call(o), this._host.requestUpdate();
    const [a, i] = this._computeRange();
    this._rangeIsCovered(a, i) || this._fetchRange(a, i);
  }
  goToToday() {
    var n, a;
    const e = this._dayOffset === 0;
    this._dayOffset = 0, e || (a = (n = this._opts).onChange) == null || a.call(n), this._host.requestUpdate();
    const [s, r] = this._computeRange();
    this._rangeIsCovered(s, r) || this._fetchRange(s, r);
  }
  tick() {
    var r, n;
    const e = (this._opts.now ?? (() => /* @__PURE__ */ new Date()))(), s = Dt(e);
    s.getTime() !== this._anchorToday.getTime() && (this._anchorToday = s, this._dayOffset === 0 && ((n = (r = this._opts).onChange) == null || n.call(r), this._host.requestUpdate(), this._hass && this._fetchRange(...this._computeRange())));
  }
  async _poll() {
    this._hass && this._fetchRange(...this._computeRange());
  }
  // -------------------------------------------------------------------------
  // Getters
  // -------------------------------------------------------------------------
  get days() {
    return Array.from({ length: this._visibleCount }, (e, s) => {
      const r = Te(this._anchorToday, this._dayOffset + s);
      return r.setHours(0, 0, 0, 0), r;
    });
  }
  /** Effective buffer-day count (explicit override or visibleCount). */
  get bufferDays() {
    return this._bufferDaysExplicit ?? this._visibleCount;
  }
  /**
   * Days to render in the grid track: `bufferDays + visibleCount + bufferDays`.
   * The visible window occupies indices `[bufferDays, bufferDays + visibleCount)`.
   * Days outside the cached event range are rendered as skeleton columns.
   */
  get renderDays() {
    const e = this.bufferDays, s = e * 2 + this._visibleCount;
    return Array.from({ length: s }, (r, n) => {
      const a = Te(this._anchorToday, this._dayOffset - e + n);
      return a.setHours(0, 0, 0, 0), a;
    });
  }
  get dayOffset() {
    return this._dayOffset;
  }
  get isAtToday() {
    return this._dayOffset === 0;
  }
  get canPanBack() {
    return this._dayOffset > -this._panBound;
  }
  get canPanForward() {
    return this._dayOffset + this._visibleCount < this._panBound;
  }
  get cachedEvents() {
    return this._cachedEvents;
  }
  get cachedRange() {
    if (!this._cacheStart || !this._cacheEnd) return [];
    const e = [], s = new Date(this._cacheStart);
    for (; s < this._cacheEnd; )
      e.push(new Date(s)), s.setDate(s.getDate() + 1);
    return e;
  }
  isDayCached(e) {
    return this._cachedDayKeys.has(T(e));
  }
  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------
  /** Compute [start, end) for the current visible+buffer range. */
  _computeRange() {
    const e = this._visibleCount, s = Te(this._anchorToday, this._dayOffset - e);
    s.setHours(0, 0, 0, 0);
    const r = Te(this._anchorToday, this._dayOffset + 2 * e);
    return r.setHours(0, 0, 0, 0), [s, r];
  }
  _rangeIsCovered(e, s) {
    return !this._cacheStart || !this._cacheEnd ? !1 : e >= this._cacheStart && s <= this._cacheEnd;
  }
  _fetchRange(e, s) {
    var a, i;
    if (!this._hass) return;
    const r = ++this._fetchSeq, n = this._opts.calendars.map((o) => o.entity);
    (i = (a = this._opts).onFetchStart) == null || i.call(a, { start: e, end: s }), this._fetcher(this._hass, n, e, s).then(({ events: o, failed: l }) => {
      var u, p;
      if (r !== this._fetchSeq) return;
      const d = /* @__PURE__ */ new Map();
      for (const [m, f] of o.entries())
        d.set(
          m,
          f.map((_) => {
            const $ = _.uid && _.uid.length > 0 ? _.uid : tr(_);
            return { ..._, uid: `${m}::${$}` };
          })
        );
      this._cachedEvents = d, this._cachedDayKeys = /* @__PURE__ */ new Set();
      for (const m = new Date(e); m < s; m.setDate(m.getDate() + 1))
        this._cachedDayKeys.add(T(m));
      this._cacheStart = new Date(e), this._cacheEnd = new Date(s), (p = (u = this._opts).onFetchComplete) == null || p.call(u, d, l);
    }).catch((o) => {
      console.warn("[lucarne] RollingWindowController fetch failed:", o);
    });
  }
}
var rr = Object.defineProperty, nr = Object.getOwnPropertyDescriptor, et = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? nr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && rr(e, s, n), n;
};
let ye = class extends v {
  constructor() {
    super(...arguments), this.calendars = [], this.visibleIds = /* @__PURE__ */ new Set();
  }
  _toggle(t) {
    const e = new Set(this.visibleIds);
    e.has(t) ? e.delete(t) : e.add(t), this.dispatchEvent(new CustomEvent("visibility-change", { detail: e, bubbles: !0, composed: !0 }));
  }
  render() {
    return c`
      ${this.calendars.map(
      (t) => c`
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
ye.styles = [
  E,
  y`
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
        touch-action: manipulation;
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
et([
  h({ type: Array })
], ye.prototype, "calendars", 2);
et([
  h({ type: Object })
], ye.prototype, "visibleIds", 2);
ye = et([
  b("lucarne-visibility-pills")
], ye);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ar = { ATTRIBUTE: 1 }, ir = (t) => (...e) => ({ _$litDirective$: t, values: e });
let or = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, s, r) {
    this._$Ct = e, this._$AM = s, this._$Ci = r;
  }
  _$AS(e, s) {
    return this.update(e, s);
  }
  update(e, s) {
    return this.render(...s);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xt = "important", lr = " !" + Xt, cr = ir(class extends or {
  constructor(t) {
    var e;
    if (super(t), t.type !== ar.ATTRIBUTE || t.name !== "style" || ((e = t.strings) == null ? void 0 : e.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return Object.keys(t).reduce((e, s) => {
      const r = t[s];
      return r == null ? e : e + `${s = s.includes("-") ? s : s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
    }, "");
  }
  update(t, [e]) {
    const { style: s } = t.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(e)), this.render(e);
    for (const r of this.ft) e[r] == null && (this.ft.delete(r), r.includes("-") ? s.removeProperty(r) : s[r] = null);
    for (const r in e) {
      const n = e[r];
      if (n != null) {
        this.ft.add(r);
        const a = typeof n == "string" && n.endsWith(lr);
        r.includes("-") || a ? s.setProperty(r, a ? n.slice(0, -11) : n, a ? Xt : "") : s[r] = n;
      }
    }
    return q;
  }
});
var dr = Object.defineProperty, hr = Object.getOwnPropertyDescriptor, J = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? hr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && dr(e, s, n), n;
};
function St(t) {
  return t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
}
let I = class extends v {
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
    const t = new Date(this.event.start), e = new Date(this.event.end), s = `${St(t)}–${St(e)}`, r = this.event.pending ? "0.5" : "1";
    return c`
      <div @click=${this._handleClick} style="height:100%;width:100%;overflow:hidden;opacity:${r}">
        <div class="event-summary">${this.event.summary}</div>
        <div class="event-time">${s}</div>
      </div>
    `;
  }
};
I.styles = [
  E,
  y`
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
J([
  h({ type: Object })
], I.prototype, "event", 2);
J([
  h({ type: String })
], I.prototype, "color", 2);
J([
  h({ type: Number })
], I.prototype, "lane", 2);
J([
  h({ type: Number })
], I.prototype, "laneCount", 2);
J([
  h({ type: Number })
], I.prototype, "topPercent", 2);
J([
  h({ type: Number })
], I.prototype, "heightPercent", 2);
I = J([
  b("lucarne-calendar-event-block")
], I);
var ur = Object.defineProperty, pr = Object.getOwnPropertyDescriptor, xe = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? pr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && ur(e, s, n), n;
};
let Y = class extends v {
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
    if (this.events.length === 0) return c``;
    const t = this._chipEl;
    let e = 0, s = 0;
    if (t) {
      const r = t.getBoundingClientRect();
      e = r.bottom + 4, s = r.left;
    }
    return c`
      <button class="stub-chip" @click=${this._openPopover}>
        +${this.events.length} ${this.label}
      </button>

      ${this._open ? c`
            <div class="backdrop" @click=${this._close}></div>
            <div class="mini-popover" style="top:${e}px;left:${s}px;">
              <div class="mini-title">${this.label}</div>
              ${this.events.map(
      (r) => c`
                  <div class="mini-event" @click=${(n) => this._tapEvent(n, r)}>
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
Y.styles = [
  E,
  y`
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
xe([
  h({ type: Array })
], Y.prototype, "events", 2);
xe([
  h({ type: String })
], Y.prototype, "label", 2);
xe([
  h({ type: Object })
], Y.prototype, "eventColors", 2);
xe([
  g()
], Y.prototype, "_open", 2);
Y = xe([
  b("lucarne-out-of-band-stub")
], Y);
var fr = Object.defineProperty, gr = Object.getOwnPropertyDescriptor, Le = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? gr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && fr(e, s, n), n;
};
function mr(t) {
  return 20 + (t * 37 + 11) % 30;
}
function vr(t) {
  return 10 + (t * 53 + 7) % 60;
}
let re = class extends v {
  constructor() {
    super(...arguments), this.bandStart = "07:00", this.bandEnd = "21:00", this.hourHeightPx = 60;
  }
  render() {
    const [t] = this.bandStart.split(":").map(Number), [e] = this.bandEnd.split(":").map(Number), r = Math.max(1, e - t) * this.hourHeightPx;
    return c`
      <!-- Fake event blocks in time grid -->
      ${[0, 1].map((n) => {
      const i = vr(n) / 100 * r, o = mr(n);
      return c`
          <div
            class="fake-event"
            style="top: ${i}px; height: ${o}px;"
          >
            <div class="shimmer-sweep"></div>
          </div>
        `;
    })}
    `;
  }
};
re.styles = [
  E,
  y`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
      }
      .fake-event {
        position: absolute;
        left: 6px;
        right: 6px;
        border-radius: 3px;
        background: var(--lucarne-skeleton-base);
        overflow: hidden;
      }
      .shimmer-sweep {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--lucarne-skeleton-highlight) 50%,
          transparent 100%
        );
        animation: shimmer-sweep 3s ease-in-out infinite;
      }
      @keyframes shimmer-sweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
      @media (prefers-reduced-motion: reduce) {
        .shimmer-sweep {
          display: none;
        }
        .fake-event {
          background: var(--lucarne-skeleton-base);
        }
      }
    `
];
Le([
  h({ type: String })
], re.prototype, "bandStart", 2);
Le([
  h({ type: String })
], re.prototype, "bandEnd", 2);
Le([
  h({ type: Number })
], re.prototype, "hourHeightPx", 2);
re = Le([
  b("lucarne-skeleton-day-column")
], re);
var _r = Object.defineProperty, yr = Object.getOwnPropertyDescriptor, z = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? yr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && _r(e, s, n), n;
};
function Pt(t, e) {
  return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
}
let A = class extends v {
  constructor() {
    super(...arguments), this.layout = null, this.bandStart = "07:00", this.bandEnd = "21:00", this.calendars = [], this.hourHeightPx = 60, this.showCreateButton = !1, this.dayWidthPx = 0, this.bufferDays = 0, this.cachedDayKeys = /* @__PURE__ */ new Set();
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
    const r = t.currentTarget.getBoundingClientRect(), [n] = this.bandStart.split(":").map(Number), [a] = this.bandEnd.split(":").map(Number), i = a - n, o = Math.max(0, Math.min(1, (t.clientY - r.top) / r.height)), l = n + o * i, d = Math.min(a - 1, Math.round(l * 2) / 2);
    this.dispatchEvent(
      new CustomEvent("lucarne-create-event-tap", {
        detail: { day: e, startHour: d },
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
    if (!this.layout) return c``;
    const s = T(t), r = this.layout.perDay.get(s);
    if (!r) return c``;
    const n = Ct(this.bandStart, this.bandEnd), i = (n.length - 1) * this.hourHeightPx, o = Pt(t, e), [l] = this.bandStart.split(":").map(Number), [d] = this.bandEnd.split(":").map(Number), u = (d - l) * 36e5;
    let p = null;
    if (o) {
      const f = new Date(t);
      f.setHours(l, 0, 0, 0);
      const _ = new Date(t);
      _.setHours(d, 0, 0, 0), e >= f && e <= _ && (p = (e.getTime() - f.getTime()) / u * 100);
    }
    const m = this._buildEventColorMap([...r.inBand.map((f) => f.event), ...r.earlier, ...r.later]);
    return c`
      <div class="day-col-wrapper">
        ${r.earlier.length > 0 ? c`
              <div class="stub-area-top">
                <lucarne-out-of-band-stub
                  .events=${r.earlier}
                  label="earlier"
                  .eventColors=${m}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}

        <div
          class="day-col"
          style="height:${i}px${this.showCreateButton ? "; cursor: crosshair" : ""}"
          @click=${(f) => this._onBandClick(f, t)}
        >
          ${n.slice(0, -1).map(
      (f, _) => c`
              <div
                class="hour-line"
                style="top: ${(_ + 1) / (n.length - 1) * 100}%"
              ></div>
            `
    )}

          ${p !== null ? c`<div class="now-line" style="top:${p}%"></div>` : ""}

          ${r.inBand.map((f) => {
      const _ = 100 / f.laneCount, $ = f.lane / f.laneCount * 100, P = this._eventColor(f.event);
      return c`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${f.topPercent}%;
                  left: calc(${$}% + 1px);
                  width: calc(${_}% - 2px);
                  height: ${f.heightPercent}%;
                  z-index: ${f.lane + 1};
                  background: ${P}cc;
                  border-left-color: ${P};
                "
                .event=${f.event}
                .color=${P}
                .lane=${f.lane}
                .laneCount=${f.laneCount}
                .topPercent=${f.topPercent}
                .heightPercent=${f.heightPercent}
              ></lucarne-calendar-event-block>
            `;
    })}
        </div>

        ${r.later.length > 0 ? c`
              <div class="stub-area-bottom">
                <lucarne-out-of-band-stub
                  .events=${r.later}
                  label="tonight"
                  .eventColors=${m}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}
      </div>
    `;
  }
  render() {
    if (!this.layout) return c`<div>Loading…</div>`;
    const t = /* @__PURE__ */ new Date(), e = Ct(this.bandStart, this.bandEnd), r = (e.length - 1) * this.hourHeightPx, n = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    return c`
      <div class="grid-wrapper" style=${cr({
      "--lucarne-day-render-count": String(this.layout.days.length),
      "--lucarne-day-width-px": `${this.dayWidthPx}px`,
      "--lucarne-day-baseline-px": `${-this.bufferDays * this.dayWidthPx}px`
    })}>
        <!-- Time-column gutter cells (col 1): stay fixed during pan -->
        <div class="header-spacer" style="grid-row:1; grid-column:1"></div>
        <div class="allday-spacer" style="grid-row:2; grid-column:1">all-day</div>
        <div class="time-col" style="height:${r}px; grid-row:3; grid-column:1">
          ${e.map(
      (a, i) => c`
              <div
                class="hour-label"
                style="top: ${i / (e.length - 1) * 100}%"
              >
                ${a === 0 || a === 24 ? "12 AM" : a < 12 ? `${a} AM` : a === 12 ? "12 PM" : `${a - 12} PM`}
              </div>
            `
    )}
        </div>

        <!--
          Three .day-cols-track elements (one per outer grid row) so each outer auto-row
          is sized by its day content. All three receive the same translateX during pan.
        -->

        <!-- Row 1: day header track -->
        <div class="day-cols-track" style="grid-row:1">
          ${this.layout.days.map(
      (a, i) => c`
              <div
                class="day-header ${Pt(a, t) ? "today" : ""}"
                style="grid-column: ${i + 1}"
              >
                <div>${n.format(a)}</div>
                <div class="day-num">${a.getDate()}</div>
              </div>
            `
    )}
        </div>

        <!-- Row 2: all-day event track -->
        <div class="day-cols-track" style="grid-row:2">
          ${this.layout.days.map((a, i) => {
      const o = T(a), l = this.cachedDayKeys.has(o), d = this.layout.perDay.get(o);
      return c`
              <div class="allday-cell" style="grid-column: ${i + 1}">
                ${l ? ((d == null ? void 0 : d.allDay) ?? []).map(
        (u) => {
          var m;
          const p = (m = d == null ? void 0 : d.allDayClipped) == null ? void 0 : m.get(Yt(u));
          return c`
                        <div
                          class="allday-event"
                          style="background: ${this._eventColor(u)}cc"
                          @click=${(f) => {
            f.stopPropagation(), this.dispatchEvent(
              new CustomEvent("lucarne-event-tap", {
                detail: { event: u, color: this._eventColor(u) },
                bubbles: !0,
                composed: !0
              })
            );
          }}
                        >
                          ${p != null && p.left ? c`<span class="clip-chevron">‹</span>` : ""}${u.summary}${p != null && p.right ? c`<span class="clip-chevron">›</span>` : ""}
                        </div>
                      `;
        }
      ) : c`<div class="allday-skeleton"><div class="shimmer-sweep"></div></div>`}
              </div>
            `;
    })}
        </div>

        <!-- Row 3: time-band columns track -->
        <div class="day-cols-track" style="grid-row:3">
          ${this.layout.days.map((a, i) => {
      const o = T(a), l = this.cachedDayKeys.has(o);
      return c`
              <div style="grid-column:${i + 1}; position:relative; overflow:visible; display:flex; flex-direction:column;">
                ${l ? this._renderDayColumn(a, t) : c`<lucarne-skeleton-day-column
                      .bandStart=${this.bandStart}
                      .bandEnd=${this.bandEnd}
                      .hourHeightPx=${this.hourHeightPx}
                    ></lucarne-skeleton-day-column>`}
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
};
A.styles = [
  E,
  y`
      :host {
        display: block;
        position: relative;
      }
      .grid-wrapper {
        display: grid;
        /* minmax(0, 1fr) prevents the .day-cols-track (which is wider than 1fr
           when render buffer columns are present) from expanding the column. */
        grid-template-columns: 40px minmax(0, 1fr);
        grid-template-rows: auto auto 1fr;
      }
      /*
       * Three .day-cols-track elements — one per outer grid row — so that each
       * outer auto-row is sized by its day-column content (headers, allday cells,
       * time-band cols). All three receive the same translateX during pan.
       * Using a single spanning element would decouple the inner sub-grid row
       * sizing from the outer grid rows and cause the time-column gutter labels
       * to misalign with the day content (no CSS subgrid on Safari < 16).
       *
       * Track is rendered at fixed px widths (--lucarne-day-render-count columns
       * × --lucarne-day-width-px each) so visible columns keep their target width
       * even with buffer days added on either side. The baseline transform shifts
       * the track left by bufferDays * dayWidthPx so visible day 0 lands at the
       * container's left edge. The pan handler overrides transform via inline
       * style during gestures; on snap completion it clears the inline style so
       * this CSS baseline reapplies (the new days then occupy the same screen
       * position as the OLD days at the snap target — visually invisible swap).
       */
      .day-cols-track {
        grid-column: 2;
        display: grid;
        grid-template-columns: repeat(var(--lucarne-day-render-count, 7), var(--lucarne-day-width-px, 140px));
        width: calc(var(--lucarne-day-render-count, 7) * var(--lucarne-day-width-px, 140px));
        transform: translateX(var(--lucarne-day-baseline-px, 0px));
        will-change: transform;
      }
      /* Header row: day names */
      .header-spacer {
        grid-column: 1;
        grid-row: 1;
        position: sticky;
        top: 0;
        left: 0;
        z-index: 4;
        background: var(--lucarne-surface);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        border-right: 1px solid rgba(0, 0, 0, 0.07);
      }
      .day-header {
        text-align: center;
        padding: var(--lucarne-spacing-sm) 2px;
        font-size: var(--lucarne-fs-sm);
        font-weight: 700;
        color: var(--lucarne-on-surface-muted);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        user-select: none;
        position: sticky;
        top: 0;
        z-index: 3;
        background: var(--lucarne-surface);
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
        position: sticky;
        left: 0;
        z-index: 2;
        background: var(--lucarne-surface);
      }
      .allday-cell {
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        border-right: 1px solid rgba(0, 0, 0, 0.05);
        padding: 2px 1px;
        min-height: 24px;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
      .allday-skeleton {
        height: 18px;
        border-radius: 3px;
        margin: 2px 4px;
        background: var(--lucarne-skeleton-base);
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
      }
      .shimmer-sweep {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--lucarne-skeleton-highlight) 50%,
          transparent 100%
        );
        animation: allday-shimmer 3s ease-in-out infinite;
      }
      @keyframes allday-shimmer {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
      @media (prefers-reduced-motion: reduce) {
        .shimmer-sweep {
          display: none;
        }
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
      .clip-chevron {
        font-style: normal;
        margin: 0 1px;
        opacity: 0.7;
      }
      /* Time grid */
      .time-col {
        grid-column: 1;
        grid-row: 3;
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        position: sticky;
        left: 0;
        z-index: 2;
        background: var(--lucarne-surface);
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
        position: relative;
        isolation: isolate;
        border-right: 1px solid rgba(0, 0, 0, 0.05);
        overflow: visible;
        touch-action: manipulation;
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
z([
  h({ type: Object })
], A.prototype, "layout", 2);
z([
  h({ type: String })
], A.prototype, "bandStart", 2);
z([
  h({ type: String })
], A.prototype, "bandEnd", 2);
z([
  h({ type: Array })
], A.prototype, "calendars", 2);
z([
  h({ type: Number })
], A.prototype, "hourHeightPx", 2);
z([
  h({ type: Boolean })
], A.prototype, "showCreateButton", 2);
z([
  h({ type: Number })
], A.prototype, "dayWidthPx", 2);
z([
  h({ type: Number })
], A.prototype, "bufferDays", 2);
z([
  h({ attribute: !1 })
], A.prototype, "cachedDayKeys", 2);
A = z([
  b("lucarne-calendar-grid")
], A);
const br = 500;
function wr(t, e, s) {
  return e <= 0 ? 0 : Math.abs(s) >= br ? s > 0 ? Math.ceil(t / e) : Math.floor(t / e) : Math.round(t / e);
}
function Tt(t, e) {
  if (Math.abs(t) <= e) return t;
  const s = Math.abs(t) - e;
  return Math.sign(t) * (e + s * 0.33);
}
var $r = Object.defineProperty, xr = Object.getOwnPropertyDescriptor, oe = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? xr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && $r(e, s, n), n;
};
let U = class extends v {
  constructor() {
    super(...arguments), this.dayWidthPx = 0, this.bufferDays = 0, this.canPanBack = !0, this.canPanForward = !0, this._startX = 0, this._startY = 0, this._startTime = 0, this._isDragging = !1, this._cachedTargets = [];
  }
  /** All .day-cols-track elements inside the slotted calendar-grid's shadow root. */
  get _panTargets() {
    var e, s;
    const t = (e = this._slot) == null ? void 0 : e.assignedElements()[0];
    return t ? Array.from(
      ((s = t.shadowRoot) == null ? void 0 : s.querySelectorAll(".day-cols-track")) ?? []
    ) : [];
  }
  /** Cache targets on gesture start so pointermove does not re-query every frame. */
  _cachePanTargets() {
    this._cachedTargets = this._panTargets;
  }
  _applyRubberBand(t) {
    return t > 0 && !this.canPanBack || t < 0 && !this.canPanForward ? Tt(t, 0) : t;
  }
  /** Baseline transform in px (negative). Matches the CSS `--lucarne-day-baseline-px`. */
  _baselinePx() {
    return -this.bufferDays * this.dayWidthPx;
  }
  _setTranslate(t) {
    const e = this._baselinePx() + t;
    for (const s of this._cachedTargets)
      s.style.transition = "", s.style.transform = `translateX(${e}px)`;
  }
  /**
   * Clear inline transform on all current `.day-cols-track` elements so the
   * grid's CSS baseline (`transform: translateX(var(--lucarne-day-baseline-px))`)
   * takes over. Re-queries via `_panTargets` because Lit may have replaced
   * track nodes during a re-render.
   */
  _clearInlineTransform() {
    for (const t of this._panTargets)
      t.style.transition = "", t.style.transform = "";
  }
  _cancelPendingSnap() {
    this._pendingTransitionEnd && this._pendingSnapTarget && this._pendingSnapTarget.removeEventListener("transitionend", this._pendingTransitionEnd), this._pendingTransitionEnd = void 0, this._pendingSnapTarget = void 0, this._pendingClearRaf !== void 0 && (cancelAnimationFrame(this._pendingClearRaf), this._pendingClearRaf = void 0);
  }
  /** Schedule the post-snap inline-transform clear, replacing any pending one. */
  _scheduleClearInline() {
    this._pendingClearRaf !== void 0 && cancelAnimationFrame(this._pendingClearRaf), this._pendingClearRaf = requestAnimationFrame(() => {
      this._pendingClearRaf = void 0, this._clearInlineTransform();
    });
  }
  _snapAndCommit(t) {
    const e = this._cachedTargets;
    if (e.length === 0) {
      t !== 0 && (this._dispatchPanSnap(t), this._scheduleClearInline());
      return;
    }
    this._cancelPendingSnap();
    const s = this._baselinePx();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const d of e)
        d.style.transition = "", d.style.transform = `translateX(${s}px)`;
      t !== 0 && this._dispatchPanSnap(t), this._scheduleClearInline();
      return;
    }
    const n = getComputedStyle(this).getPropertyValue("--lucarne-pan-duration").trim() || "240ms", a = getComputedStyle(this).getPropertyValue("--lucarne-pan-easing").trim() || "cubic-bezier(0.32, 0.72, 0, 1)", i = `transform ${n} ${a}`, o = s + t * this.dayWidthPx;
    for (const d of e)
      d.style.transition = i, d.style.transform = `translateX(${o}px)`;
    const l = () => {
      this._pendingTransitionEnd = void 0, e[0].removeEventListener("transitionend", l), t !== 0 && this._dispatchPanSnap(t), this._scheduleClearInline();
    };
    this._pendingSnapTarget = e[0], this._pendingTransitionEnd = l, e[0].addEventListener("transitionend", l, { once: !0 });
  }
  _dispatchPanSnap(t) {
    this.dispatchEvent(
      new CustomEvent("pan-snap", {
        detail: { deltaDays: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onPointerDown(t) {
    t.pointerType === "mouse" && t.button !== 0 || this._pointerId === void 0 && (this._cancelPendingSnap(), this._pointerId = t.pointerId, this._startX = t.clientX, this._startY = t.clientY, this._startTime = performance.now(), this._isDragging = !1, this._cachePanTargets());
  }
  _onPointerMove(t) {
    if (t.pointerId !== this._pointerId) return;
    const e = t.clientX - this._startX, s = t.clientY - this._startY;
    if (!this._isDragging) {
      if (Math.abs(e) < 10 && Math.abs(s) < 10) return;
      if (Math.abs(s) > Math.abs(e)) {
        try {
          t.currentTarget.releasePointerCapture(t.pointerId);
        } catch {
        }
        this._pointerId = void 0;
        return;
      }
      this._isDragging = !0;
      try {
        t.currentTarget.setPointerCapture(t.pointerId);
      } catch {
      }
    }
    const r = this._applyRubberBand(e);
    this._setTranslate(r);
  }
  _onPointerUp(t) {
    if (t.pointerId === this._pointerId) {
      try {
        t.currentTarget.releasePointerCapture(t.pointerId);
      } catch {
      }
      if (this._isDragging) {
        const e = t.clientX - this._startX, s = performance.now() - this._startTime, r = s > 0 ? e / s * 1e3 : 0, n = this._applyRubberBand(e), a = wr(n, this.dayWidthPx, r);
        this._snapAndCommit(a);
      }
      this._pointerId = void 0, this._isDragging = !1, this._cachedTargets = [];
    }
  }
  render() {
    return c`
      <div
        class="pan-wrapper"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
      >
        <slot></slot>
      </div>
    `;
  }
};
U.styles = y`
    :host {
      display: block;
      overflow: hidden;
      position: relative;
    }
    .pan-wrapper {
      touch-action: pan-y;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      position: relative;
    }
    ::slotted(*) {
      display: block;
    }
  `;
oe([
  h({ type: Number })
], U.prototype, "dayWidthPx", 2);
oe([
  h({ type: Number })
], U.prototype, "bufferDays", 2);
oe([
  h({ type: Boolean })
], U.prototype, "canPanBack", 2);
oe([
  h({ type: Boolean })
], U.prototype, "canPanForward", 2);
oe([
  Bt("slot")
], U.prototype, "_slot", 2);
U = oe([
  b("lucarne-calendar-day-pan")
], U);
var Cr = Object.defineProperty, kr = Object.getOwnPropertyDescriptor, H = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? kr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Cr(e, s, n), n;
};
function Er(t) {
  return new Date(t).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: !0
  });
}
let O = class extends v {
  constructor() {
    super(...arguments), this.event = null, this.color = "#a8d8b9", this.calendarLabel = "", this.entityId = "", this._confirmingDelete = !1, this._deleting = !1, this._deleteError = "";
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  _isRecurring(t) {
    return !!t.rrule || !!t.recurrence_id;
  }
  /**
   * Returns true when the uid is a synthetic placeholder (no real upstream
   * uid available). HA's `calendar.delete_event` and Google's eventedit URL
   * both require a real uid, so we skip those affordances for synthetic ids.
   */
  _hasSyntheticUid(t) {
    if (!t) return !0;
    const e = t.includes("::") ? t.split("::").slice(1).join("::") : t;
    return e.startsWith("syn:") || e.startsWith("pending:") || e.length === 0;
  }
  _startDelete() {
    this._confirmingDelete = !0, this._deleteError = "";
  }
  _cancelDelete() {
    this._confirmingDelete = !1;
  }
  async _confirmDelete() {
    var e;
    if (!((e = this.event) != null && e.uid) || !this.entityId) return;
    this._deleting = !0, this._deleteError = "";
    const t = this.event.uid.includes("::") ? this.event.uid.split("::").slice(1).join("::") : this.event.uid;
    try {
      await ws(this.hass, this.entityId, t);
    } catch (s) {
      this._deleteError = s instanceof Error ? s.message : "Failed to delete event", this._deleting = !1, this._confirmingDelete = !1;
      return;
    }
    this.dispatchEvent(new CustomEvent("lucarne-event-deleted", {
      detail: { entityId: this.entityId, uid: this.event.uid },
      bubbles: !0,
      composed: !0
    })), this._deleting = !1, this._confirmingDelete = !1;
  }
  render() {
    var o;
    if (!this.event) return c``;
    const t = this.event, s = t.start.length === 10 && !t.start.includes("T") ? "All day" : `${Er(t.start)} – ${new Date(t.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 })}`, r = (o = t.uid) != null && o.includes("::") ? t.uid.split("::").slice(1).join("::") : t.uid, n = this._hasSyntheticUid(t.uid), a = r && r.length > 0 && !n ? `https://calendar.google.com/calendar/u/0/r/eventedit/${encodeURIComponent(r)}` : null, i = !!this.entityId && !!t.uid && this.hass != null && xs(this.hass, this.entityId) && !this._isRecurring(t) && !n;
    return c`
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

        ${this.calendarLabel ? c`
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

        ${t.location ? c`
              <div class="detail-row">
                <em class="detail-icon">📍</em>
                <span class="detail-text">${t.location}</span>
              </div>
            ` : ""}

        ${t.description ? c`
              <div class="detail-row">
                <em class="detail-icon">📝</em>
                <span class="detail-text">${t.description}</span>
              </div>
            ` : ""}

        ${a ? c`
              <a class="ext-link" href="${a}" target="_blank" rel="noopener noreferrer">
                Open in Google Calendar ↗
              </a>
            ` : ""}

        ${this._deleteError ? c`<div class="error-msg">${this._deleteError}</div>` : ""}

        ${i ? c`
          <div class="actions">
            ${this._confirmingDelete ? c`
                  <button class="btn btn-cancel" @click=${this._cancelDelete} ?disabled=${this._deleting}>Cancel</button>
                  <button class="btn btn-delete" @click=${this._confirmDelete} ?disabled=${this._deleting}>Confirm delete?</button>
                ` : c`<button class="btn btn-delete" @click=${this._startDelete}>Delete</button>`}
          </div>
        ` : ""}
      </div>
    `;
  }
};
O.styles = [
  E,
  y`
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
      .actions {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        justify-content: flex-start;
        margin-top: var(--lucarne-spacing-md);
      }
      .btn {
        border: none;
        border-radius: var(--lucarne-radius-sm);
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        padding: 8px 14px;
        min-height: 44px;
      }
      .btn-delete {
        background: #c62828;
        color: #fff;
      }
      .btn-delete:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .btn-cancel {
        background: rgba(0, 0, 0, 0.08);
        color: var(--lucarne-on-surface);
      }
      .btn-cancel:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .error-msg {
        color: #c62828;
        font-size: var(--lucarne-fs-sm);
        margin-top: var(--lucarne-spacing-sm);
      }
    `
];
H([
  h({ attribute: !1 })
], O.prototype, "hass", 2);
H([
  h({ type: Object })
], O.prototype, "event", 2);
H([
  h({ type: String })
], O.prototype, "color", 2);
H([
  h({ type: String })
], O.prototype, "calendarLabel", 2);
H([
  h({ type: String })
], O.prototype, "entityId", 2);
H([
  g()
], O.prototype, "_confirmingDelete", 2);
H([
  g()
], O.prototype, "_deleting", 2);
H([
  g()
], O.prototype, "_deleteError", 2);
O = H([
  b("lucarne-calendar-event-popover")
], O);
var Dr = Object.defineProperty, Sr = Object.getOwnPropertyDescriptor, D = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Sr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Dr(e, s, n), n;
};
function At(t, e) {
  const r = -(/* @__PURE__ */ new Date(`${t}T${e}:00`)).getTimezoneOffset(), n = r >= 0 ? "+" : "-", a = Math.floor(Math.abs(r) / 60).toString().padStart(2, "0"), i = (Math.abs(r) % 60).toString().padStart(2, "0");
  return `${t}T${e}:00${n}${a}:${i}`;
}
function Mt(t) {
  return `${Math.floor(t).toString().padStart(2, "0")}:${t % 1 === 0.5 ? "30" : "00"}`;
}
function Ot(t) {
  const e = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
  return `${e}-${s}-${r}`;
}
let C = class extends v {
  constructor() {
    super(...arguments), this.day = null, this.startHour = 9, this.calendars = [], this._title = "", this._calendarEntityId = "", this._date = "", this._startTime = "", this._endTime = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
  }
  updated(t) {
    super.updated(t), (t.has("day") || t.has("startHour")) && this._initDefaults();
  }
  _initDefaults() {
    var s;
    const t = this.day ?? /* @__PURE__ */ new Date();
    this._date = Ot(t), this._startTime = Mt(Math.max(0, Math.min(23, this.startHour)));
    const e = Math.min(24, this.startHour + 1);
    this._endTime = Mt(e < 24 ? e : 23.5), this._calendarEntityId = ((s = this.calendars[0]) == null ? void 0 : s.entity) ?? "", this._title = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
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
      const n = Ot(r);
      t.end_date = n, e = this._date, s = n;
    } else {
      const r = At(this._date, this._startTime), n = At(this._date, this._endTime);
      t.start_date_time = r, t.end_date_time = n, e = r, s = n;
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
            // Synthetic pending uid: unique per optimistic create so
            // multiple pendings don't collide on the `entity::` key.
            // Replaced by the real event on the next fetch.
            uid: `${this._calendarEntityId}::pending:${e}|${s}|${this._title.trim()}`,
            pending: !0
          }
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    return this.calendars.length ? c`
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
      (t) => c`<option value=${t.entity}>${t.label}</option>`
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

        ${this._allDay ? "" : c`
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

        ${this._error ? c`<div class="error-msg">${this._error}</div>` : ""}

        <div class="actions">
          <button class="btn btn-cancel" @click=${this._close}>Cancel</button>
          <button class="btn btn-create" ?disabled=${this._saving} @click=${this._create}>
            ${this._saving ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    ` : c``;
  }
};
C.styles = [
  E,
  y`
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
        appearance: none;
        -webkit-appearance: none;
        text-align: left;
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
      input[type='date']::-webkit-date-and-time-value,
      input[type='time']::-webkit-date-and-time-value {
        text-align: left;
      }
      input[type='date']::-webkit-calendar-picker-indicator,
      input[type='time']::-webkit-calendar-picker-indicator {
        opacity: 0.6;
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
        appearance: none;
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        min-height: unset;
        margin: 0;
        cursor: pointer;
        border: 2px solid var(--primary-color, #03a9f4);
        border-radius: 3px;
        background: transparent;
        position: relative;
        flex-shrink: 0;
      }
      .allday-row input[type='checkbox']:checked::after {
        content: '';
        position: absolute;
        left: 3px;
        top: 0;
        width: 4px;
        height: 9px;
        border: solid var(--primary-color, #03a9f4);
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
      .allday-row input[type='checkbox']:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
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
D([
  h({ attribute: !1 })
], C.prototype, "hass", 2);
D([
  h({ type: Object })
], C.prototype, "day", 2);
D([
  h({ type: Number })
], C.prototype, "startHour", 2);
D([
  h({ type: Array })
], C.prototype, "calendars", 2);
D([
  g()
], C.prototype, "_title", 2);
D([
  g()
], C.prototype, "_calendarEntityId", 2);
D([
  g()
], C.prototype, "_date", 2);
D([
  g()
], C.prototype, "_startTime", 2);
D([
  g()
], C.prototype, "_endTime", 2);
D([
  g()
], C.prototype, "_allDay", 2);
D([
  g()
], C.prototype, "_description", 2);
D([
  g()
], C.prototype, "_location", 2);
D([
  g()
], C.prototype, "_error", 2);
D([
  g()
], C.prototype, "_saving", 2);
C = D([
  b("lucarne-create-event-popover")
], C);
var Pr = Object.defineProperty, Tr = Object.getOwnPropertyDescriptor, S = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Tr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Pr(e, s, n), n;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-calendar-card",
  name: "Lucarne Calendar",
  description: "Week view calendar with per-person color, visibility pills, and create-event flow",
  preview: !0
});
let k = class extends v {
  constructor() {
    super(...arguments), this._layout = null, this._visibleIds = /* @__PURE__ */ new Set(), this._openEvent = null, this._openEventColor = "", this._openEventCalLabel = "", this._openEventEntityId = "", this._createDay = null, this._createStartHour = 9, this._creatableCalendars = [], this._dayWidthPx = 0, this._deletedUids = /* @__PURE__ */ new Set(), this._pendingEvents = [], this._lastVisibleCount = 3;
  }
  setConfig(t) {
    if (!t.calendars || !Array.isArray(t.calendars) || t.calendars.length === 0)
      throw new Error('lucarne-calendar-card: "calendars" must be a non-empty array');
    for (const r of t.calendars)
      if (!r.entity || !r.color)
        throw new Error('lucarne-calendar-card: each calendar requires "entity" and "color"');
    let e = t;
    if (t.visible_hours) {
      const r = /^\d{1,2}:\d{2}$/;
      if (!r.test(t.visible_hours.start) || !r.test(t.visible_hours.end))
        throw new Error('lucarne-calendar-card: "visible_hours" start and end must be in HH:MM format');
      const n = parseInt(t.visible_hours.start.split(":")[0], 10), a = parseInt(t.visible_hours.end.split(":")[0], 10);
      if (n < 0 || a > 24 || n >= a)
        throw new Error('lucarne-calendar-card: "visible_hours" must satisfy 0 <= start < end <= 24');
      e = {
        ...t,
        visible_hours: {
          start: `${String(n).padStart(2, "0")}:00`,
          end: `${String(a).padStart(2, "0")}:00`
        }
      };
    }
    const s = this._config;
    if (this._config = e, this._visibleIds = new Set(t.calendars.map((r) => r.entity)), this.hass && this._updateCreatableCalendars(), this._rolling)
      this._rolling.updateCalendars(e.calendars), (s == null ? void 0 : s.render_buffer_days) !== e.render_buffer_days && this._rolling.setBufferDays(e.render_buffer_days), ((s == null ? void 0 : s.min_days) !== t.min_days || (s == null ? void 0 : s.max_days) !== t.max_days || (s == null ? void 0 : s.min_col_width) !== t.min_col_width || (s == null ? void 0 : s.max_col_width) !== t.max_col_width) && this._onResize();
    else {
      const r = this._effectiveConfig();
      this._lastVisibleCount = r.minDays, this._rolling = new sr(this, {
        calendars: e.calendars,
        visibleCount: r.minDays,
        bufferDays: e.render_buffer_days,
        onFetchComplete: (n, a) => this._onFetchComplete(n, a),
        onChange: () => this._recompute()
      });
    }
  }
  static getStubConfig(t) {
    const e = Object.keys(t.states).filter((n) => n.startsWith("calendar.")).slice(0, 3), s = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], r = e.map((n, a) => ({
      entity: n,
      color: s[a] ?? "#a8d8b9"
    }));
    return {
      type: "custom:lucarne-calendar-card",
      title: "Calendar",
      calendars: r.length ? r : [{ entity: "calendar.example", color: "#a8d8b9" }],
      visible_hours: { start: "07:00", end: "21:00" },
      show_create_button: !0,
      min_days: 3,
      max_days: 7,
      min_col_width: 140,
      max_col_width: 220
    };
  }
  getCardSize() {
    return 6;
  }
  getGridOptions() {
    return { columns: 9, rows: "auto", min_columns: 6, max_columns: 12 };
  }
  static getConfigElement() {
    return document.createElement("lucarne-calendar-card-editor");
  }
  connectedCallback() {
    super.connectedCallback(), requestAnimationFrame(() => {
      this._previewOverride = Wt(this);
    });
  }
  disconnectedCallback() {
    var t, e;
    super.disconnectedCallback(), (t = this._resizeObserver) == null || t.disconnect(), (e = this._previewOverride) == null || e.uninstall(), this._previewOverride = void 0;
  }
  firstUpdated() {
    !this._resizeObserver && this._gridAreaEl && (this._resizeObserver = new ResizeObserver(() => this._onResize()), this._resizeObserver.observe(this._gridAreaEl), this._onResize());
  }
  updated(t) {
    super.updated(t), !(!t.has("hass") || !this._config) && (this._rolling.setHass(this.hass), this._updateCreatableCalendars());
  }
  _effectiveConfig() {
    const t = this._config;
    return {
      minDays: t.min_days && t.min_days > 0 ? t.min_days : 3,
      maxDays: t.max_days && t.max_days > 0 ? t.max_days : 7,
      minColWidth: t.min_col_width && t.min_col_width > 0 ? t.min_col_width : 140,
      maxColWidth: t.max_col_width && t.max_col_width > 0 ? t.max_col_width : 220,
      timeColWidth: 40
    };
  }
  _onResize() {
    this._resizeFrame === void 0 && (this._resizeFrame = requestAnimationFrame(() => {
      var r;
      this._resizeFrame = void 0;
      const t = ((r = this._gridAreaEl) == null ? void 0 : r.getBoundingClientRect().width) ?? 0, { visibleCount: e, dayWidthPx: s } = er(t, this._effectiveConfig());
      e !== this._lastVisibleCount && (this._lastVisibleCount = e, this._rolling.setVisibleCount(e), this.style.setProperty("--lucarne-day-count", String(e))), this._dayWidthPx = s;
    }));
  }
  _recompute() {
    var a, i;
    if (!this._config) return;
    const t = [];
    for (const [o, l] of this._rolling.cachedEvents.entries())
      this._visibleIds.has(o) && t.push(...l);
    t.push(
      ...this._pendingEvents.filter((o) => {
        var d;
        const l = (d = o.uid) == null ? void 0 : d.split("::")[0];
        return l ? this._visibleIds.has(l) : !0;
      })
    );
    const e = this._deletedUids.size > 0 ? t.filter((o) => !o.uid || !this._deletedUids.has(o.uid)) : t, s = ((a = this._config.visible_hours) == null ? void 0 : a.start) ?? "07:00", r = ((i = this._config.visible_hours) == null ? void 0 : i.end) ?? "21:00", n = this._rolling.renderDays;
    this._layout = Qs(e, n, s, r);
  }
  _supportsCreate(t) {
    var s, r, n;
    const e = (n = (r = (s = this.hass) == null ? void 0 : s.states[t]) == null ? void 0 : r.attributes) == null ? void 0 : n.supported_features;
    return e !== void 0 && (e & 1) !== 0;
  }
  _updateCreatableCalendars() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.filter((s) => this._supportsCreate(s.entity));
    t.length === this._creatableCalendars.length && t.every((s, r) => {
      var n;
      return s.entity === ((n = this._creatableCalendars[r]) == null ? void 0 : n.entity);
    }) || (this._creatableCalendars = t);
  }
  _onVisibilityChange(t) {
    this._visibleIds = t.detail, this._recompute();
  }
  _onEventTap(t) {
    var r, n;
    const { event: e, color: s } = t.detail;
    if (this._openEvent = e, this._openEventColor = s, (r = e.uid) != null && r.includes("::")) {
      const a = e.uid.split("::")[0];
      this._openEventEntityId = a;
      const i = (n = this._config) == null ? void 0 : n.calendars.find((o) => o.entity === a);
      this._openEventCalLabel = i ? qt(i, this.hass) : "";
    } else
      this._openEventEntityId = "", this._openEventCalLabel = "";
  }
  _onEventDeleted(t) {
    this._deletedUids = /* @__PURE__ */ new Set([...this._deletedUids, t.detail.uid]), this._openEvent = null, this._openEventEntityId = "", this._recompute();
  }
  /**
   * Called by RollingWindowController after every successful fetch. Clears
   * `_pendingEvents` (optimistic creates have either landed or been
   * superseded) and prunes `_deletedUids` so it only retains uids the server
   * still returns — i.e. our delete hasn't propagated yet. Wholesale-clearing
   * here would let a stale fetch resurrect a freshly-deleted event between
   * the user's tap and the server's next state.
   *
   * `failed` is the set of entity ids whose `calendar.get_events` call threw.
   * Tombstones whose entity prefix is in `failed` are NEVER pruned, because
   * we can't distinguish "really gone" from "the fetch never returned data
   * for this entity." Without this guard, a transient per-entity failure
   * would silently resurrect every optimistic delete for that entity.
   */
  _onFetchComplete(t, e) {
    if (this._pendingEvents = [], this._deletedUids.size > 0) {
      const s = /* @__PURE__ */ new Set();
      for (const n of t.values())
        for (const a of n)
          a.uid && s.add(a.uid);
      const r = /* @__PURE__ */ new Set();
      for (const n of this._deletedUids) {
        const a = n.includes("::") ? n.split("::")[0] : "";
        (e.has(a) || s.has(n)) && r.add(n);
      }
      this._deletedUids = r;
    }
    this._recompute();
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
  _rangeLabel() {
    const t = this._rolling.days;
    if (t.length === 0) return "";
    const e = t[0], s = t[t.length - 1], r = (i, o) => i.toLocaleDateString("en-US", o), n = e.getMonth() === s.getMonth() && e.getFullYear() === s.getFullYear(), a = e.getFullYear() === s.getFullYear();
    return n ? `${r(e, { month: "short", day: "numeric" })} – ${r(s, { day: "numeric" })}` : a ? `${r(e, { month: "short", day: "numeric" })} – ${r(s, { month: "short", day: "numeric" })}` : `${r(e, { month: "short", day: "numeric", year: "numeric" })} – ${r(s, { month: "short", day: "numeric", year: "numeric" })}`;
  }
  render() {
    var n, a;
    if (!this._config) return c``;
    const t = ((n = this._config.visible_hours) == null ? void 0 : n.start) ?? "07:00", e = ((a = this._config.visible_hours) == null ? void 0 : a.end) ?? "21:00", s = xt(this._config.calendars, this.hass), r = xt(this._creatableCalendars, this.hass);
    return c`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${this._config.title ?? "Calendar"}</h2>
          <div class="week-nav">
            <button
              class="nav-btn"
              @click=${() => this._rolling.pan(-this._lastVisibleCount)}
              ?disabled=${!this._rolling.canPanBack}
              aria-label="Previous ${this._lastVisibleCount} days"
            >←</button>
            ${this._rolling.isAtToday ? "" : c`<button class="nav-btn" @click=${() => this._rolling.goToToday()} aria-label="Today">Today</button>`}
            <span class="week-label">${this._rangeLabel()}</span>
            <button
              class="nav-btn"
              @click=${() => this._rolling.pan(+this._lastVisibleCount)}
              ?disabled=${!this._rolling.canPanForward}
              aria-label="Next ${this._lastVisibleCount} days"
            >→</button>
          </div>
        </div>

        <div class="pills-row">
          <lucarne-visibility-pills
            .calendars=${s}
            .visibleIds=${this._visibleIds}
            @visibility-change=${this._onVisibilityChange}
          ></lucarne-visibility-pills>
        </div>

        <div
          class="grid-area"
          @lucarne-event-tap=${this._onEventTap}
          @lucarne-create-event-tap=${this._onCreateEventTap}
        >
          <lucarne-calendar-day-pan
            .dayWidthPx=${this._dayWidthPx}
            .bufferDays=${this._rolling.bufferDays}
            .canPanBack=${this._rolling.canPanBack}
            .canPanForward=${this._rolling.canPanForward}
            @pan-snap=${(i) => this._rolling.pan(-i.detail.deltaDays)}
          >
            <lucarne-calendar-grid
              .layout=${this._layout}
              .bandStart=${t}
              .bandEnd=${e}
              .calendars=${s}
              .dayWidthPx=${this._dayWidthPx}
              .bufferDays=${this._rolling.bufferDays}
              .cachedDayKeys=${new Set(this._rolling.cachedRange.map(T))}
              .showCreateButton=${(this._config.show_create_button ?? !0) && this._creatableCalendars.length > 0}
            ></lucarne-calendar-grid>
          </lucarne-calendar-day-pan>
        </div>

        ${this._openEvent ? c`
              <lucarne-calendar-event-popover
                .event=${this._openEvent}
                .color=${this._openEventColor}
                .calendarLabel=${this._openEventCalLabel}
                .hass=${this.hass}
                .entityId=${this._openEventEntityId}
                @popover-close=${this._closePopover}
                @lucarne-event-deleted=${this._onEventDeleted}
              ></lucarne-calendar-event-popover>
            ` : ""}

        ${this._createDay !== null ? c`
              <lucarne-create-event-popover
                .hass=${this.hass}
                .day=${this._createDay}
                .startHour=${this._createStartHour}
                .calendars=${r}
                @popover-close=${this._closeCreatePopover}
                @lucarne-event-created=${this._onEventCreated}
              ></lucarne-create-event-popover>
            ` : ""}
      </ha-card>
    `;
  }
};
k.styles = [
  E,
  y`
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
        touch-action: manipulation;
      }
      .nav-btn:hover:not(:disabled) {
        background: rgba(0, 0, 0, 0.04);
      }
      .nav-btn:disabled {
        opacity: 0.3;
        cursor: default;
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
        max-height: calc(100vh - 280px);
        max-height: calc(100dvh - 280px);
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
      }
    `
];
S([
  h({ attribute: !1 })
], k.prototype, "hass", 2);
S([
  Bt(".grid-area")
], k.prototype, "_gridAreaEl", 2);
S([
  g()
], k.prototype, "_config", 2);
S([
  g()
], k.prototype, "_layout", 2);
S([
  g()
], k.prototype, "_visibleIds", 2);
S([
  g()
], k.prototype, "_openEvent", 2);
S([
  g()
], k.prototype, "_openEventColor", 2);
S([
  g()
], k.prototype, "_openEventCalLabel", 2);
S([
  g()
], k.prototype, "_openEventEntityId", 2);
S([
  g()
], k.prototype, "_createDay", 2);
S([
  g()
], k.prototype, "_createStartHour", 2);
S([
  g()
], k.prototype, "_creatableCalendars", 2);
S([
  g()
], k.prototype, "_dayWidthPx", 2);
S([
  g()
], k.prototype, "_deletedUids", 2);
k = S([
  b("lucarne-calendar-card")
], k);
var Ar = Object.defineProperty, Mr = Object.getOwnPropertyDescriptor, Ce = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Mr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Ar(e, s, n), n;
};
let X = class extends v {
  constructor() {
    super(...arguments), this._haReady = !1, this._invalid = {};
  }
  connectedCallback() {
    super.connectedCallback(), Ze().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    Qe(this, "config-changed", { config: t });
  }
  _titleChanged(t) {
    const e = t.target;
    this._fire({ ...this._config, title: e.value || void 0 });
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
    var r, n;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], entity: ((n = e.detail) == null ? void 0 : n.value) ?? "" }, this._fire({ ...this._config, calendars: s });
  }
  _calColorChanged(t, e) {
    var r;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], color: e.target.value }, this._fire({ ...this._config, calendars: s });
  }
  _removeCalendar(t) {
    var s;
    const e = [...((s = this._config) == null ? void 0 : s.calendars) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, calendars: e }));
  }
  _windowFieldChanged(t, e) {
    const s = e.target.value, r = s === "" ? void 0 : Number(s), n = { ...this._config, [t]: r }, a = n.min_days ?? 3, i = n.max_days ?? 7, o = n.min_col_width ?? 140, l = n.max_col_width ?? 220;
    this._invalid = {
      days: a > i,
      cols: o > l
    }, this._fire(n);
  }
  _addCalendar() {
    var r, n;
    const e = Object.keys(((r = this.hass) == null ? void 0 : r.states) ?? {}).find((a) => a.startsWith("calendar.")) ?? "calendar.example", s = [
      ...((n = this._config) == null ? void 0 : n.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: s });
  }
  render() {
    var l, d;
    if (!this._config) return c``;
    if (!this._haReady) return c`<div class="loading">Loading editor…</div>`;
    const t = this._config.calendars ?? [], e = ((l = this._config.visible_hours) == null ? void 0 : l.start) ?? "07:00", s = ((d = this._config.visible_hours) == null ? void 0 : d.end) ?? "21:00", r = this._config.show_create_button ?? !0, n = this._config.min_days, a = this._config.max_days, i = this._config.min_col_width, o = this._config.max_col_width;
    return c`
      <label class="field">
        <span class="field-label">Card title</span>
        <input
          class="text-input"
          type="text"
          .value=${this._config.title ?? ""}
          @change=${this._titleChanged}
        />
      </label>

      <div class="row">
        <label class="field">
          <span class="field-label">Visible hours start (HH:MM)</span>
          <input
            class="text-input"
            type="text"
            .value=${e}
            @change=${this._bandStartChanged}
          />
        </label>
        <label class="field">
          <span class="field-label">Visible hours end (HH:MM)</span>
          <input
            class="text-input"
            type="text"
            .value=${s}
            @change=${this._bandEndChanged}
          />
        </label>
      </div>

      <label class="toggle-row">
        <span class="toggle-label">Show create-event button</span>
        <input
          type="checkbox"
          .checked=${r}
          @change=${this._showCreateChanged}
        />
      </label>

      <div class="section-label">Visible day window</div>
      <div class="row">
        <label class="field">
          <span class="field-label">Min days (1–14)</span>
          <input
            class="text-input"
            type="number"
            min="1"
            max="14"
            step="1"
            .value=${n !== void 0 ? String(n) : ""}
            placeholder="3"
            @change=${(u) => this._windowFieldChanged("min_days", u)}
          />
          ${this._invalid.days ? c`<div class="editor-error">Min days must be ≤ max days</div>` : ""}
        </label>
        <label class="field">
          <span class="field-label">Max days (1–14)</span>
          <input
            class="text-input"
            type="number"
            min="1"
            max="14"
            step="1"
            .value=${a !== void 0 ? String(a) : ""}
            placeholder="7"
            @change=${(u) => this._windowFieldChanged("max_days", u)}
          />
          ${this._invalid.days ? c`<div class="editor-error">Max days must be ≥ min days</div>` : ""}
        </label>
      </div>
      <div class="row">
        <label class="field">
          <span class="field-label">Min column width px (60–400)</span>
          <input
            class="text-input"
            type="number"
            min="60"
            max="400"
            step="10"
            .value=${i !== void 0 ? String(i) : ""}
            placeholder="140"
            @change=${(u) => this._windowFieldChanged("min_col_width", u)}
          />
          ${this._invalid.cols ? c`<div class="editor-error">Min width must be ≤ max width</div>` : ""}
        </label>
        <label class="field">
          <span class="field-label">Max column width px (100–600)</span>
          <input
            class="text-input"
            type="number"
            min="100"
            max="600"
            step="10"
            .value=${o !== void 0 ? String(o) : ""}
            placeholder="220"
            @change=${(u) => this._windowFieldChanged("max_col_width", u)}
          />
          ${this._invalid.cols ? c`<div class="editor-error">Max width must be ≥ min width</div>` : ""}
        </label>
      </div>

      <div class="section-label">Calendars</div>
      ${t.map(
      (u, p) => c`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${u.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(m) => this._calEntityChanged(p, m)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${u.color}
              @input=${(m) => this._calColorChanged(p, m)}
              title="Calendar color"
            />
            <button type="button" class="remove" @click=${() => this._removeCalendar(p)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addCalendar}>+ Add calendar</button>
    `;
  }
};
X.styles = [E, Vt];
Ce([
  h({ attribute: !1 })
], X.prototype, "hass", 2);
Ce([
  g()
], X.prototype, "_config", 2);
Ce([
  g()
], X.prototype, "_haReady", 2);
Ce([
  g()
], X.prototype, "_invalid", 2);
X = Ce([
  b("lucarne-calendar-card-editor")
], X);
function zt(t) {
  return t.length === 0 ? !1 : t.every((e) => e.state === "on");
}
var Or = Object.defineProperty, zr = Object.getOwnPropertyDescriptor, Ue = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? zr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Or(e, s, n), n;
};
let ne = class extends v {
  constructor() {
    super(...arguments), this.name = "", this.color = "#a8d8b9", this.avatarUrl = "";
  }
  render() {
    if (this.avatarUrl)
      return c`
        <div class="avatar" style="background:${this.color}">
          <img src="${this.avatarUrl}" alt="${this.name}" />
        </div>
      `;
    const t = this.name.trim().charAt(0) || "?";
    return c`
      <div class="avatar" style="background:${this.color}">
        <span class="initial">${t}</span>
      </div>
    `;
  }
};
ne.styles = y`
    :host {
      display: block;
    }
    .avatar {
      width: clamp(48px, 6vw, 72px);
      height: clamp(48px, 6vw, 72px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar .initial {
      font-size: clamp(1.25rem, 2.5vw, 2rem);
      font-weight: 700;
      color: rgba(0, 0, 0, 0.7);
      line-height: 1;
      text-transform: uppercase;
      font-family: var(--primary-font-family, sans-serif);
    }
  `;
Ue([
  h()
], ne.prototype, "name", 2);
Ue([
  h()
], ne.prototype, "color", 2);
Ue([
  h({ attribute: "avatar-url" })
], ne.prototype, "avatarUrl", 2);
ne = Ue([
  b("lucarne-kid-avatar")
], ne);
var Ir = Object.defineProperty, Hr = Object.getOwnPropertyDescriptor, ke = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Hr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Ir(e, s, n), n;
};
let G = class extends v {
  constructor() {
    super(...arguments), this.name = "", this.entityId = "", this.isDone = !1;
  }
  _toggle() {
    !this.hass || !this.entityId || this.hass.callService("input_boolean", "toggle", { entity_id: this.entityId });
  }
  render() {
    return c`
      <div class="row" @click=${this._toggle} role="checkbox" aria-checked=${this.isDone} tabindex="0"
           @keydown=${(t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), t.repeat || this._toggle());
    }}>
        <div class="check ${this.isDone ? "done" : ""}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 5" stroke="rgba(0,0,0,0.7)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="label ${this.isDone ? "done" : ""}">${this.name}</span>
      </div>
    `;
  }
};
G.styles = y`
    :host {
      display: block;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 60px;
      padding: 8px 4px;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.1s;
      -webkit-tap-highlight-color: transparent;
    }
    .row:hover,
    .row:active {
      background: rgba(0, 0, 0, 0.04);
    }
    .check {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2.5px solid rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, border-color 0.15s;
    }
    .check.done {
      background: var(--chore-color, #a8d8b9);
      border-color: var(--chore-color, #a8d8b9);
    }
    .check svg {
      opacity: 0;
      transition: opacity 0.15s;
    }
    .check.done svg {
      opacity: 1;
    }
    .label {
      font-size: clamp(0.875rem, 1.2vw, 1rem);
      color: var(--primary-text-color, #212121);
      font-family: var(--primary-font-family, sans-serif);
      transition: text-decoration 0.15s, color 0.15s;
    }
    .label.done {
      text-decoration: line-through;
      color: var(--secondary-text-color, #727272);
    }
  `;
ke([
  h({ attribute: !1 })
], G.prototype, "hass", 2);
ke([
  h()
], G.prototype, "name", 2);
ke([
  h({ attribute: "entity-id" })
], G.prototype, "entityId", 2);
ke([
  h({ type: Boolean, attribute: "is-done" })
], G.prototype, "isDone", 2);
G = ke([
  b("lucarne-chore-row")
], G);
var Rr = Object.defineProperty, jr = Object.getOwnPropertyDescriptor, Gt = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? jr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Rr(e, s, n), n;
};
let Ie = class extends v {
  constructor() {
    super(...arguments), this.streak = 0;
  }
  _milestoneClass(t) {
    return t >= 30 ? "milestone-5" : t >= 14 ? "milestone-4" : t >= 7 ? "milestone-3" : t >= 3 ? "milestone-2" : t >= 1 ? "milestone-1" : "";
  }
  render() {
    const t = isNaN(this.streak) ? 0 : this.streak, e = t > 0 ? "day streak" : "start a streak today";
    return c`
      <div class="streak-row">
        <span class="flame ${this._milestoneClass(t)}">🔥</span>
        <span class="count">${t}</span>
      </div>
      <div class="label">${e}</div>
    `;
  }
};
Ie.styles = y`
    :host {
      display: block;
      text-align: center;
      padding: 8px 4px;
      font-family: var(--primary-font-family, sans-serif);
    }
    .streak-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .flame {
      font-size: clamp(1.1rem, 1.8vw, 1.5rem);
      line-height: 1;
      transition: font-size 0.2s;
    }
    .flame.milestone-1 { font-size: clamp(1.2rem, 2vw, 1.6rem); }
    .flame.milestone-2 { font-size: clamp(1.3rem, 2.2vw, 1.75rem); }
    .flame.milestone-3 { font-size: clamp(1.4rem, 2.4vw, 1.9rem); }
    .flame.milestone-4 { font-size: clamp(1.5rem, 2.6vw, 2rem); }
    .flame.milestone-5 { font-size: clamp(1.6rem, 2.8vw, 2.2rem); }
    .count {
      font-size: clamp(1rem, 1.5vw, 1.25rem);
      font-weight: 700;
      color: var(--primary-text-color, #212121);
    }
    .label {
      font-size: clamp(0.7rem, 0.9vw, 0.8rem);
      color: var(--secondary-text-color, #727272);
      margin-top: 2px;
    }
  `;
Gt([
  h({ type: Number })
], Ie.prototype, "streak", 2);
Ie = Gt([
  b("lucarne-streak-display")
], Ie);
var Lr = Object.defineProperty, Ur = Object.getOwnPropertyDescriptor, tt = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Ur(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Lr(e, s, n), n;
};
let be = class extends v {
  constructor() {
    super(...arguments), this.kidSlug = "", this.active = !1, this._dots = [];
  }
  connectedCallback() {
    super.connectedCallback(), this._generateDots();
  }
  _generateDots() {
    const t = ["#f5c89c", "#b8e0d2", "#f0b8c8", "#a8d8b9", "#c8b4e0", "#f0dca0"];
    this._dots = Array.from({ length: 18 }, (e, s) => ({
      left: `${s / 17 * 90 + 5}%`,
      color: t[s % t.length],
      delay: `${(s * 0.08).toFixed(2)}s`,
      size: `${8 + Math.round(Math.random() * 6)}px`
    }));
  }
  render() {
    return this.active ? c`
      ${this._dots.map(
      (t) => c`
          <div
            class="dot"
            style="left:${t.left};background:${t.color};animation-delay:${t.delay};width:${t.size};height:${t.size}"
          ></div>
        `
    )}
    ` : c``;
  }
};
be.styles = y`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      border-radius: inherit;
    }
    .dot {
      position: absolute;
      bottom: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: float-up 2s ease-out forwards;
    }
    @keyframes float-up {
      0%   { transform: translateY(0) scale(1);   opacity: 0.9; }
      60%  { opacity: 0.7; }
      100% { transform: translateY(-110%) scale(0.6); opacity: 0; }
    }
  `;
tt([
  h({ attribute: "kid-slug" })
], be.prototype, "kidSlug", 2);
tt([
  h({ type: Boolean })
], be.prototype, "active", 2);
be = tt([
  b("lucarne-celebration-overlay")
], be);
var Nr = Object.defineProperty, Br = Object.getOwnPropertyDescriptor, le = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Br(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Nr(e, s, n), n;
};
let N = class extends v {
  constructor() {
    super(...arguments), this.streak = 0, this.celebrating = !1, this.allDone = !1;
  }
  render() {
    if (!this.kid) return c``;
    const t = this.kid.chores ?? [];
    return c`
      <div class="column" style="--chore-color:${this.kid.color}">
        <lucarne-celebration-overlay
          kid-slug=${this.kid.name.toLowerCase().replace(/\s+/g, "_")}
          ?active=${this.celebrating}
        ></lucarne-celebration-overlay>

        <div class="header">
          <lucarne-kid-avatar
            name=${this.kid.name}
            color=${this.kid.color}
            avatar-url=${this.kid.avatar ?? ""}
          ></lucarne-kid-avatar>
          <div class="kid-name">${this.kid.name}</div>
        </div>

        <div class="chores">
          ${t.map((e) => {
      var r, n;
      const s = ((n = (r = this.hass) == null ? void 0 : r.states[e.entity]) == null ? void 0 : n.state) ?? "unavailable";
      return c`
              <lucarne-chore-row
                .hass=${this.hass}
                name=${e.name}
                entity-id=${e.entity}
                ?is-done=${s === "on"}
              ></lucarne-chore-row>
            `;
    })}
        </div>

        ${this.allDone ? c`<div class="all-done-banner">✨ All done!</div>` : ""}

        <div class="streak-area">
          <lucarne-streak-display .streak=${this.streak}></lucarne-streak-display>
        </div>
      </div>
    `;
  }
};
N.styles = y`
    :host {
      display: block;
      position: relative;
    }
    .column {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px 12px;
      position: relative;
    }
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      margin-bottom: 8px;
    }
    .kid-name {
      font-size: clamp(1rem, 1.5vw, 1.25rem);
      font-weight: 700;
      color: var(--primary-text-color, #212121);
      font-family: var(--primary-font-family, sans-serif);
      text-align: center;
    }
    .chores {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .streak-area {
      padding-top: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.07);
      margin-top: 8px;
    }
    .all-done-banner {
      text-align: center;
      font-size: clamp(0.8rem, 1.2vw, 0.95rem);
      font-weight: 600;
      padding: 6px 0;
      color: rgba(0, 0, 0, 0.6);
    }
  `;
le([
  h({ attribute: !1 })
], N.prototype, "hass", 2);
le([
  h({ attribute: !1 })
], N.prototype, "kid", 2);
le([
  h({ type: Number })
], N.prototype, "streak", 2);
le([
  h({ type: Boolean })
], N.prototype, "celebrating", 2);
le([
  h({ type: Boolean, attribute: "all-done" })
], N.prototype, "allDone", 2);
N = le([
  b("lucarne-kid-column")
], N);
var Fr = Object.defineProperty, Wr = Object.getOwnPropertyDescriptor, st = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Wr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Fr(e, s, n), n;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-chores-card",
  name: "Lucarne Chores",
  description: "Kid chore grid with streaks and celebration",
  preview: !0
});
let we = class extends v {
  constructor() {
    super(...arguments), this._lastAllDoneByKid = /* @__PURE__ */ new Map(), this._celebratingKids = /* @__PURE__ */ new Set(), this._celebrationTimers = /* @__PURE__ */ new Map();
  }
  setConfig(t) {
    if (!t.kids || t.kids.length === 0)
      throw new Error("lucarne-chores-card: kids must be a non-empty array");
    for (const r of t.kids)
      if (!r.chores || r.chores.length === 0)
        throw new Error(`lucarne-chores-card: kid "${r.name}" must have at least 1 chore`);
    const e = t.kids.map((r) => r.name.toLowerCase().replace(/\s+/g, "_"));
    if (new Set(e).size !== e.length)
      throw new Error("lucarne-chores-card: kid names must be unique (two names produce the same slug)");
    this._config = t;
  }
  static getConfigElement() {
    return document.createElement("lucarne-chores-card-editor");
  }
  getCardSize() {
    return 5;
  }
  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6, max_columns: 12 };
  }
  static getStubConfig() {
    return {
      type: "custom:lucarne-chores-card",
      title: "Chores",
      kids: [
        {
          name: "Kid 1",
          color: "#f5c89c",
          streak: "counter.kid_1_streak",
          chores: [
            { name: "Brush teeth", entity: "input_boolean.kid_1_brush_teeth" },
            { name: "Make bed", entity: "input_boolean.kid_1_make_bed" },
            { name: "Put away toys", entity: "input_boolean.kid_1_put_away_toys" },
            { name: "School bag ready", entity: "input_boolean.kid_1_school_bag_ready" },
            { name: "Kindness act", entity: "input_boolean.kid_1_kindness_act" }
          ]
        },
        {
          name: "Kid 2",
          color: "#b8e0d2",
          streak: "counter.kid_2_streak",
          chores: [
            { name: "Brush teeth", entity: "input_boolean.kid_2_brush_teeth" },
            { name: "Make bed", entity: "input_boolean.kid_2_make_bed" },
            { name: "Put away toys", entity: "input_boolean.kid_2_put_away_toys" },
            { name: "School bag ready", entity: "input_boolean.kid_2_school_bag_ready" },
            { name: "Kindness act", entity: "input_boolean.kid_2_kindness_act" }
          ]
        },
        {
          name: "Kid 3",
          color: "#f0b8c8",
          streak: "counter.kid_3_streak",
          chores: [
            { name: "Brush teeth", entity: "input_boolean.kid_3_brush_teeth" },
            { name: "Make bed", entity: "input_boolean.kid_3_make_bed" },
            { name: "Put away toys", entity: "input_boolean.kid_3_put_away_toys" },
            { name: "School bag ready", entity: "input_boolean.kid_3_school_bag_ready" },
            { name: "Kindness act", entity: "input_boolean.kid_3_kindness_act" }
          ]
        }
      ]
    };
  }
  updated(t) {
    if (super.updated(t), !(!t.has("hass") || !this._config || !this.hass))
      for (const e of this._config.kids) {
        const s = e.name.toLowerCase().replace(/\s+/g, "_"), r = e.chores.map((i) => {
          var o;
          return {
            state: ((o = this.hass.states[i.entity]) == null ? void 0 : o.state) ?? "unavailable"
          };
        }), n = zt(r), a = this._lastAllDoneByKid.get(s) ?? null;
        if (a === null) {
          this._lastAllDoneByKid.set(s, n);
          continue;
        }
        a === !1 && n === !0 ? (this._lastAllDoneByKid.set(s, !0), this._triggerCelebration(s, e)) : a === !0 && n === !1 && this._lastAllDoneByKid.set(s, !1);
      }
  }
  _triggerCelebration(t, e) {
    var l;
    this._celebratingKids = new Set(this._celebratingKids).add(t), this.requestUpdate();
    const s = this._celebrationTimers.get(t);
    s && clearTimeout(s);
    const r = setTimeout(() => {
      this._celebratingKids = new Set(
        [...this._celebratingKids].filter((d) => d !== t)
      ), this._celebrationTimers.delete(t), this.requestUpdate();
    }, 2200);
    this._celebrationTimers.set(t, r);
    const n = (l = this.hass) == null ? void 0 : l.states[e.streak], a = n ? parseInt(n.state, 10) : 0, i = /* @__PURE__ */ new Date(), o = `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}-${String(i.getDate()).padStart(2, "0")}`;
    this.hass.connection.sendMessagePromise({
      type: "fire_event",
      event_type: "ha_lucarne_chores_all_done",
      event_data: {
        kid_slug: t,
        kid_name: e.name,
        date: o,
        chores_completed: e.chores.length,
        streak: isNaN(a) ? 0 : a
      }
    });
  }
  render() {
    if (!this._config) return c``;
    const t = this._config.title ?? "Chores", e = this._config.kids ?? [];
    return c`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${t}</h2>
        </div>
        <div class="kids-grid">
          ${e.map((s) => {
      var l;
      const r = s.name.toLowerCase().replace(/\s+/g, "_"), n = (l = this.hass) == null ? void 0 : l.states[s.streak], a = n ? parseInt(n.state, 10) : 0, i = s.chores.map((d) => {
        var u, p;
        return {
          state: ((p = (u = this.hass) == null ? void 0 : u.states[d.entity]) == null ? void 0 : p.state) ?? "unavailable"
        };
      }), o = zt(i);
      return c`
              <div class="kid-cell">
                <lucarne-kid-column
                  .hass=${this.hass}
                  .kid=${s}
                  .streak=${isNaN(a) ? 0 : a}
                  ?celebrating=${this._celebratingKids.has(r)}
                  ?all-done=${o}
                ></lucarne-kid-column>
              </div>
            `;
    })}
        </div>
      </ha-card>
    `;
  }
};
we.styles = [
  E,
  y`
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
        padding: var(--lucarne-spacing-lg) var(--lucarne-spacing-xl) var(--lucarne-spacing-md);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      }
      .card-title {
        font-size: var(--lucarne-fs-lg);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        margin: 0;
      }
      .kids-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
      .kid-cell {
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        position: relative;
      }
      .kid-cell:last-child {
        border-right: none;
      }
      @media (max-width: 600px) {
        .kids-grid {
          grid-template-columns: 1fr;
        }
        .kid-cell {
          border-right: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        }
        .kid-cell:last-child {
          border-bottom: none;
        }
      }
    `
];
st([
  h({ attribute: !1 })
], we.prototype, "hass", 2);
st([
  g()
], we.prototype, "_config", 2);
we = st([
  b("lucarne-chores-card")
], we);
var Kr = Object.defineProperty, Vr = Object.getOwnPropertyDescriptor, Ne = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Vr(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Kr(e, s, n), n;
};
let ae = class extends v {
  constructor() {
    super(...arguments), this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), Ze().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    Qe(this, "config-changed", { config: t });
  }
  _titleChanged(t) {
    const e = t.target.value;
    this._fire({ ...this._config, title: e || void 0 });
  }
  _kidFieldChanged(t, e, s) {
    var n;
    const r = [...((n = this._config) == null ? void 0 : n.kids) ?? []];
    r[t] = { ...r[t], [e]: s.target.value }, this._fire({ ...this._config, kids: r });
  }
  _kidColorChanged(t, e) {
    var r;
    const s = [...((r = this._config) == null ? void 0 : r.kids) ?? []];
    s[t] = { ...s[t], color: e.target.value }, this._fire({ ...this._config, kids: s });
  }
  _kidStreakChanged(t, e) {
    var r, n;
    const s = [...((r = this._config) == null ? void 0 : r.kids) ?? []];
    s[t] = { ...s[t], streak: ((n = e.detail) == null ? void 0 : n.value) ?? "" }, this._fire({ ...this._config, kids: s });
  }
  _choreNameChanged(t, e, s) {
    var a;
    const r = [...((a = this._config) == null ? void 0 : a.kids) ?? []], n = [...r[t].chores];
    n[e] = { ...n[e], name: s.target.value }, r[t] = { ...r[t], chores: n }, this._fire({ ...this._config, kids: r });
  }
  _choreEntityChanged(t, e, s) {
    var a, i;
    const r = [...((a = this._config) == null ? void 0 : a.kids) ?? []], n = [...r[t].chores];
    n[e] = { ...n[e], entity: ((i = s.detail) == null ? void 0 : i.value) ?? "" }, r[t] = { ...r[t], chores: n }, this._fire({ ...this._config, kids: r });
  }
  _removeChore(t, e) {
    var n;
    const s = [...((n = this._config) == null ? void 0 : n.kids) ?? []], r = [...s[t].chores];
    r.length <= 1 || (r.splice(e, 1), s[t] = { ...s[t], chores: r }, this._fire({ ...this._config, kids: s }));
  }
  _addChore(t) {
    var r;
    const e = [...((r = this._config) == null ? void 0 : r.kids) ?? []], s = [...e[t].chores, { name: "New chore", entity: "" }];
    e[t] = { ...e[t], chores: s }, this._fire({ ...this._config, kids: e });
  }
  _removeKid(t) {
    var s;
    const e = [...((s = this._config) == null ? void 0 : s.kids) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, kids: e }));
  }
  _addKid() {
    var a;
    const t = ((a = this._config) == null ? void 0 : a.kids) ?? [], e = new Set(
      t.map((i) => i.name.toLowerCase().replace(/\s+/g, "_"))
    ), s = ["#f5c89c", "#b8e0d2", "#f0b8c8", "#a8d8b9", "#c8b4e0"];
    let r = t.length + 1;
    for (; e.has(`kid_${r}`); ) r++;
    const n = [
      ...t,
      {
        name: `Kid ${r}`,
        color: s[(r - 1) % s.length],
        streak: `counter.kid_${r}_streak`,
        chores: [{ name: "Chore 1", entity: "" }]
      }
    ];
    this._fire({ ...this._config, kids: n });
  }
  render() {
    if (!this._config) return c``;
    if (!this._haReady) return c`<div class="loading">Loading editor…</div>`;
    const t = this._config.kids ?? [];
    return c`
      <div class="section-label">General</div>
      <ha-textfield
        label="Card title"
        .value=${this._config.title ?? ""}
        @change=${this._titleChanged}
      ></ha-textfield>

      <div class="section-label">Kids</div>
      ${t.map(
      (e, s) => c`
          <div class="kid-block">
            <div class="kid-header">
              <div class="kid-header-fields">
                <ha-textfield
                  label="Name"
                  .value=${e.name}
                  @change=${(r) => this._kidFieldChanged(s, "name", r)}
                ></ha-textfield>
                <ha-textfield
                  label="Avatar URL (optional)"
                  .value=${e.avatar ?? ""}
                  @change=${(r) => this._kidFieldChanged(s, "avatar", r)}
                ></ha-textfield>
              </div>
              <button type="button" class="remove" @click=${() => this._removeKid(s)} title="Remove kid">✕</button>
            </div>

            <div class="color-row">
              <input
                type="color"
                class="color-swatch"
                .value=${e.color}
                @input=${(r) => this._kidColorChanged(s, r)}
                title="Kid color"
              />
              <ha-entity-picker
                label="Streak counter"
                .hass=${this.hass}
                .value=${e.streak}
                .includeDomains=${["counter"]}
                allow-custom-entity
                @value-changed=${(r) => this._kidStreakChanged(s, r)}
              ></ha-entity-picker>
            </div>

            <div class="chore-label">Chores</div>
            ${e.chores.map(
        (r, n) => c`
                <div class="chore-row">
                  <ha-textfield
                    label="Chore name"
                    .value=${r.name}
                    @change=${(a) => this._choreNameChanged(s, n, a)}
                  ></ha-textfield>
                  <ha-entity-picker
                    label="Entity"
                    .hass=${this.hass}
                    .value=${r.entity}
                    .includeDomains=${["input_boolean"]}
                    allow-custom-entity
                    @value-changed=${(a) => this._choreEntityChanged(s, n, a)}
                  ></ha-entity-picker>
                  <button type="button" class="remove" @click=${() => this._removeChore(s, n)} title="Remove">✕</button>
                </div>
              `
      )}
            <button type="button" class="add" @click=${() => this._addChore(s)}>+ Add chore</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addKid}>+ Add kid</button>
    `;
  }
};
ae.styles = [
  E,
  y`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-md);
        padding: var(--lucarne-spacing-lg);
        box-sizing: border-box;
        width: 100%;
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
      .kid-block {
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: var(--lucarne-radius-md);
        padding: var(--lucarne-spacing-md);
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-sm);
        margin-bottom: var(--lucarne-spacing-sm);
      }
      .kid-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--lucarne-spacing-sm);
      }
      .kid-header-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--lucarne-spacing-sm);
        flex: 1;
      }
      .color-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
      }
      .color-swatch {
        width: 32px;
        height: 32px;
        border-radius: var(--lucarne-radius-sm);
        border: 1px solid rgba(0, 0, 0, 0.2);
        cursor: pointer;
        flex-shrink: 0;
      }
      .chore-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: var(--lucarne-spacing-sm);
        align-items: center;
        padding: var(--lucarne-spacing-xs) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      .chore-row ha-entity-picker,
      .chore-row ha-textfield,
      .kid-header-fields ha-entity-picker,
      .kid-header-fields ha-textfield {
        width: 100%;
        min-width: 0;
      }
      .chore-row:last-of-type {
        border-bottom: none;
      }
      .chore-label {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-top: var(--lucarne-spacing-xs);
      }
      button.remove {
        background: none;
        border: none;
        color: var(--error-color, #f44336);
        cursor: pointer;
        font-size: 1.1em;
        padding: 4px 8px;
        border-radius: var(--lucarne-radius-sm);
        flex-shrink: 0;
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
      .loading {
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        text-align: center;
        padding: var(--lucarne-spacing-lg);
      }
    `
];
Ne([
  h({ attribute: !1 })
], ae.prototype, "hass", 2);
Ne([
  g()
], ae.prototype, "_config", 2);
Ne([
  g()
], ae.prototype, "_haReady", 2);
ae = Ne([
  b("lucarne-chores-card-editor")
], ae);
//# sourceMappingURL=ha-lucarne.js.map
