/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ae = globalThis, Ve = Ae.ShadowRoot && (Ae.ShadyCSS === void 0 || Ae.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, qe = Symbol(), rt = /* @__PURE__ */ new WeakMap();
let Rt = class {
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
const Zt = (t) => new Rt(typeof t == "string" ? t : t + "", void 0, qe), y = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((r, a, n) => r + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[n + 1], t[0]);
  return new Rt(s, t, qe);
}, Qt = (t, e) => {
  if (Ve) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const r = document.createElement("style"), a = Ae.litNonce;
    a !== void 0 && r.setAttribute("nonce", a), r.textContent = s.cssText, t.appendChild(r);
  }
}, at = Ve ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const r of e.cssRules) s += r.cssText;
  return Zt(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: es, defineProperty: ts, getOwnPropertyDescriptor: ss, getOwnPropertyNames: rs, getOwnPropertySymbols: as, getPrototypeOf: ns } = Object, j = globalThis, nt = j.trustedTypes, is = nt ? nt.emptyScript : "", Be = j.reactiveElementPolyfillSupport, he = (t, e) => t, Oe = { toAttribute(t, e) {
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
} }, Ye = (t, e) => !es(t, e), it = { attribute: !0, type: String, converter: Oe, reflect: !1, useDefault: !1, hasChanged: Ye };
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
      const r = Symbol(), a = this.getPropertyDescriptor(e, r, s);
      a !== void 0 && ts(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, s, r) {
    const { get: a, set: n } = ss(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? it;
  }
  static _$Ei() {
    if (this.hasOwnProperty(he("elementProperties"))) return;
    const e = ns(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(he("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(he("properties"))) {
      const s = this.properties, r = [...rs(s), ...as(s)];
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
      for (const a of r) s.unshift(at(a));
    } else e !== void 0 && s.push(at(e));
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
    var n;
    const r = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, r);
    if (a !== void 0 && r.reflect === !0) {
      const i = (((n = r.converter) == null ? void 0 : n.toAttribute) !== void 0 ? r.converter : Oe).toAttribute(s, r.type);
      this._$Em = e, i == null ? this.removeAttribute(a) : this.setAttribute(a, i), this._$Em = null;
    }
  }
  _$AK(e, s) {
    var n, i;
    const r = this.constructor, a = r._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const o = r.getPropertyOptions(a), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : Oe;
      this._$Em = a;
      const d = l.fromAttribute(s, o.type);
      this[a] = d ?? ((i = this._$Ej) == null ? void 0 : i.get(a)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, s, r, a = !1, n) {
    var i;
    if (e !== void 0) {
      const o = this.constructor;
      if (a === !1 && (n = this[e]), r ?? (r = o.getPropertyOptions(e)), !((r.hasChanged ?? Ye)(n, s) || r.useDefault && r.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(o._$Eu(e, r)))) return;
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
Z.elementStyles = [], Z.shadowRootOptions = { mode: "open" }, Z[he("elementProperties")] = /* @__PURE__ */ new Map(), Z[he("finalized")] = /* @__PURE__ */ new Map(), Be == null || Be({ ReactiveElement: Z }), (j.reactiveElementVersions ?? (j.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = globalThis, ot = (t) => t, Me = ue.trustedTypes, lt = Me ? Me.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ht = "$lit$", H = `lit$${Math.random().toFixed(9).slice(2)}$`, jt = "?" + H, os = `<${jt}>`, V = document, fe = () => V.createComment(""), ge = (t) => t === null || typeof t != "object" && typeof t != "function", Xe = Array.isArray, ls = (t) => Xe(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Fe = `[ 	
\f\r]`, ce = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, dt = />/g, F = RegExp(`>|${Fe}(?:([^\\s"'>=/]+)(${Fe}*=${Fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ht = /'/g, ut = /"/g, Lt = /^(?:script|style|textarea|title)$/i, Nt = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), c = Nt(1), B = Nt(2), q = Symbol.for("lit-noChange"), x = Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), W = V.createTreeWalker(V, 129);
function Ut(t, e) {
  if (!Xe(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return lt !== void 0 ? lt.createHTML(e) : e;
}
const cs = (t, e) => {
  const s = t.length - 1, r = [];
  let a, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = ce;
  for (let o = 0; o < s; o++) {
    const l = t[o];
    let d, h, p = -1, g = 0;
    for (; g < l.length && (i.lastIndex = g, h = i.exec(l), h !== null); ) g = i.lastIndex, i === ce ? h[1] === "!--" ? i = ct : h[1] !== void 0 ? i = dt : h[2] !== void 0 ? (Lt.test(h[2]) && (a = RegExp("</" + h[2], "g")), i = F) : h[3] !== void 0 && (i = F) : i === F ? h[0] === ">" ? (i = a ?? ce, p = -1) : h[1] === void 0 ? p = -2 : (p = i.lastIndex - h[2].length, d = h[1], i = h[3] === void 0 ? F : h[3] === '"' ? ut : ht) : i === ut || i === ht ? i = F : i === ct || i === dt ? i = ce : (i = F, a = void 0);
    const f = i === F && t[o + 1].startsWith("/>") ? " " : "";
    n += i === ce ? l + os : p >= 0 ? (r.push(d), l.slice(0, p) + Ht + l.slice(p) + H + f) : l + H + (p === -2 ? o : f);
  }
  return [Ut(t, n + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class me {
  constructor({ strings: e, _$litType$: s }, r) {
    let a;
    this.parts = [];
    let n = 0, i = 0;
    const o = e.length - 1, l = this.parts, [d, h] = cs(e, s);
    if (this.el = me.createElement(d, r), W.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (a = W.nextNode()) !== null && l.length < o; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const p of a.getAttributeNames()) if (p.endsWith(Ht)) {
          const g = h[i++], f = a.getAttribute(p).split(H), v = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: n, name: v[2], strings: f, ctor: v[1] === "." ? hs : v[1] === "?" ? us : v[1] === "@" ? ps : Re }), a.removeAttribute(p);
        } else p.startsWith(H) && (l.push({ type: 6, index: n }), a.removeAttribute(p));
        if (Lt.test(a.tagName)) {
          const p = a.textContent.split(H), g = p.length - 1;
          if (g > 0) {
            a.textContent = Me ? Me.emptyScript : "";
            for (let f = 0; f < g; f++) a.append(p[f], fe()), W.nextNode(), l.push({ type: 2, index: ++n });
            a.append(p[g], fe());
          }
        }
      } else if (a.nodeType === 8) if (a.data === jt) l.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = a.data.indexOf(H, p + 1)) !== -1; ) l.push({ type: 7, index: n }), p += H.length - 1;
      }
      n++;
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
  let a = r !== void 0 ? (i = s._$Co) == null ? void 0 : i[r] : s._$Cl;
  const n = ge(e) ? void 0 : e._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== n && ((o = a == null ? void 0 : a._$AO) == null || o.call(a, !1), n === void 0 ? a = void 0 : (a = new n(t), a._$AT(t, s, r)), r !== void 0 ? (s._$Co ?? (s._$Co = []))[r] = a : s._$Cl = a), a !== void 0 && (e = ee(t, a._$AS(t, e.values), a, r)), e;
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
    const { el: { content: s }, parts: r } = this._$AD, a = ((e == null ? void 0 : e.creationScope) ?? V).importNode(s, !0);
    W.currentNode = a;
    let n = W.nextNode(), i = 0, o = 0, l = r[0];
    for (; l !== void 0; ) {
      if (i === l.index) {
        let d;
        l.type === 2 ? d = new $e(n, n.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (d = new fs(n, this, e)), this._$AV.push(d), l = r[++o];
      }
      i !== (l == null ? void 0 : l.index) && (n = W.nextNode(), i++);
    }
    return W.currentNode = V, a;
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
  constructor(e, s, r, a) {
    this.type = 2, this._$AH = x, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = r, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
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
    var n;
    const { values: s, _$litType$: r } = e, a = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = me.createElement(Ut(r.h, r.h[0]), this.options)), r);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === a) this._$AH.p(s);
    else {
      const i = new ds(a, this), o = i.u(this.options);
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
    let r, a = 0;
    for (const n of e) a === s.length ? s.push(r = new $e(this.O(fe()), this.O(fe()), this, this.options)) : r = s[a], r._$AI(n), a++;
    a < s.length && (this._$AR(r && r._$AB.nextSibling, a), s.length = a);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, s); e !== this._$AB; ) {
      const a = ot(e).nextSibling;
      ot(e).remove(), e = a;
    }
  }
  setConnected(e) {
    var s;
    this._$AM === void 0 && (this._$Cv = e, (s = this._$AP) == null || s.call(this, e));
  }
}
class Re {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, r, a, n) {
    this.type = 1, this._$AH = x, this._$AN = void 0, this.element = e, this.name = s, this._$AM = a, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = x;
  }
  _$AI(e, s = this, r, a) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) e = ee(this, e, s, 0), i = !ge(e) || e !== this._$AH && e !== q, i && (this._$AH = e);
    else {
      const o = e;
      let l, d;
      for (e = n[0], l = 0; l < n.length - 1; l++) d = ee(this, o[r + l], s, l), d === q && (d = this._$AH[l]), i || (i = !ge(d) || d !== this._$AH[l]), d === x ? e = x : e !== x && (e += (d ?? "") + n[l + 1]), this._$AH[l] = d;
    }
    i && !a && this.j(e);
  }
  j(e) {
    e === x ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class hs extends Re {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === x ? void 0 : e;
  }
}
class us extends Re {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== x);
  }
}
class ps extends Re {
  constructor(e, s, r, a, n) {
    super(e, s, r, a, n), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = ee(this, e, s, 0) ?? x) === q) return;
    const r = this._$AH, a = e === x && r !== x || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== x && (r === x || a);
    a && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
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
  let a = r._$litPart$;
  if (a === void 0) {
    const n = (s == null ? void 0 : s.renderBefore) ?? null;
    r._$litPart$ = a = new $e(e.insertBefore(fe(), n), n, void 0, s ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis;
let _ = class extends Z {
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
_._$litElement$ = !0, _.finalized = !0, (It = K.litElementHydrateSupport) == null || It.call(K, { LitElement: _ });
const Ke = K.litElementPolyfillSupport;
Ke == null || Ke({ LitElement: _ });
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
const ms = { attribute: !0, type: String, converter: Oe, reflect: !1, hasChanged: Ye }, vs = (t = ms, e, s) => {
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
  return (e, s) => typeof s == "object" ? vs(t, e, s) : ((r, a, n) => {
    const i = a.hasOwnProperty(n);
    return a.constructor.createProperty(n, r), i ? Object.getOwnPropertyDescriptor(a, n) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function m(t) {
  return u({ ...t, state: !0, attribute: !1 });
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
  return (s, r, a) => {
    const n = (i) => {
      var o;
      return ((o = i.renderRoot) == null ? void 0 : o.querySelector(t)) ?? null;
    };
    return _s(s, r, { get() {
      return n(this);
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
  const a = /* @__PURE__ */ new Set(), n = encodeURIComponent(s.toISOString()), i = encodeURIComponent(r.toISOString()), o = await Promise.all(
    e.map(
      (l) => t.callApi(
        "GET",
        `calendars/${encodeURIComponent(l)}?start=${n}&end=${i}`
      ).then((d) => [l, d.map(bs)]).catch((d) => (console.warn(`[lucarne] GET /api/calendars/${l} failed:`, d), a.add(l), [l, []]))
    )
  );
  return { events: new Map(o), failed: a };
}
async function ws(t, e, s, r, a) {
  await t.connection.sendMessagePromise({
    type: "calendar/event/delete",
    entity_id: e,
    uid: s,
    recurrence_id: r,
    recurrence_range: a
  });
}
const $s = 2;
function xs(t, e) {
  var r, a;
  const s = (a = (r = t.states[e]) == null ? void 0 : r.attributes) == null ? void 0 : a.supported_features;
  return typeof s != "number" ? !1 : (s & $s) !== 0;
}
function Cs(t, e, s) {
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
      const a = e.tagName.toLowerCase();
      if (a === "hui-dialog-edit-card" || a === "ha-dialog") return !0;
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
  const a = new MutationObserver(r);
  return a.observe(e, { attributes: !0, attributeFilter: ["style"] }), {
    uninstall() {
      a.disconnect(), s ? e.style.setProperty("--grid-column-count", s) : e.style.removeProperty("--grid-column-count");
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
var Ds = Object.defineProperty, Ss = Object.getOwnPropertyDescriptor, He = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Ss(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Ds(e, s, a), a;
};
function pe(t) {
  return t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
}
function Ps(t, e, s) {
  return t.filter((r) => pe(r.end) > e).sort((r, a) => pe(r.start).getTime() - pe(a.start).getTime()).slice(0, s);
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
  const n = t.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (t.toDateString() === s.toDateString()) return n;
  const o = new Date(s);
  return o.setDate(s.getDate() + 1), t.toDateString() === o.toDateString() ? w.timePillTomorrow(n) : `${t.toLocaleDateString("en", { weekday: "short" })} ${n}`;
}
function As(t) {
  return t.start.length === 10 && t.end.length === 10;
}
let te = class extends _ {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.limit = 5;
  }
  render() {
    const t = /* @__PURE__ */ new Date(), e = Ps(this.events, t, this.limit);
    return e.length === 0 ? c`<div class="empty-state">${w.nothingOnCalendar}</div>` : c`
      ${e.map((s) => {
      const r = pe(s.start), a = pe(s.end), n = r <= t && t < a, i = As(s) ? "all day" : Ts(r, a, t), o = this._colorForEvent(s);
      return c`
          <div class="event-row">
            <div class="time-pill ${n ? "now" : ""}">
              ${n ? c`<span class="pulse-dot"></span>` : ""} ${i}
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
He([
  u({ type: Array })
], te.prototype, "events", 2);
He([
  u({ type: Object })
], te.prototype, "calendarColors", 2);
He([
  u({ type: Number })
], te.prototype, "limit", 2);
te = He([
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
</svg>`, Os = B`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
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
const Ms = B`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, vt = {
  sunny: gt,
  "clear-night": gt,
  cloudy: Q,
  fog: Q,
  hail: de,
  lightning: de,
  "lightning-rainy": de,
  partlycloudy: Os,
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
  let a;
  return r < 5 ? a = w.dressingTipHeavyCoat : r < 12 ? a = w.dressingTipCoatScarf : r < 18 ? a = w.dressingTipLightJacket : r < 24 ? a = w.dressingTipTShirt : a = w.dressingTipShorts, (e.precipitation_probability ?? 0) > 50 && (a += w.dressingTipUmbrella), a;
}
var Rs = Object.defineProperty, Hs = Object.getOwnPropertyDescriptor, Ge = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Hs(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Rs(e, s, a), a;
};
let ve = class extends _ {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return c`<div class="empty-state">${w.addWeatherEntity}</div>`;
    const t = this.weatherEntity.attributes, e = t.temperature, s = t.temperature_unit ?? "°C", r = this.weatherEntity.state, a = this.forecast[0], n = this.forecast[1], i = Is(this.forecast);
    return c`
      <div class="current">
        <span class="condition-icon" style="color: ${yt(r)}">${_t(r)}</span>
        <div class="temp-group">
          <div class="current-temp">${e !== void 0 ? `${Math.round(e)}${s}` : w.errorUnavailable}</div>
          ${a ? c`<div class="high-low">
                ↑${Math.round(a.temperature)}${s}
                ${a.templow !== void 0 ? ` ↓${Math.round(a.templow)}${s}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${n ? c`
            <div class="tomorrow-row">
              <span class="tomorrow-icon" style="color: ${yt(n.condition)}">${_t(n.condition)}</span>
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
  u({ attribute: !1 })
], ve.prototype, "weatherEntity", 2);
Ge([
  u({ type: Array })
], ve.prototype, "forecast", 2);
ve = Ge([
  b("lucarne-weather-block")
], ve);
var js = Object.defineProperty, Ls = Object.getOwnPropertyDescriptor, Je = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Ls(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && js(e, s, a), a;
};
let _e = class extends _ {
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
    return e === 0 ? c`
        <div class="empty-state">
          <span class="empty-icon">${Ms}</span>
          ${w.allDone}
        </div>
      ` : c`
      <div class="header">
        ${w.tasksTitle}
        <span class="count-badge">${e}</span>
      </div>
      ${s.map(
      (a) => c`
          <div class="task-row">
            <span class="summary">${a.summary}</span>
            ${a.due ? c`<span class="due-chip">${this._formatDue(a.due)}</span>` : ""}
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
  u({ type: Array })
], _e.prototype, "items", 2);
Je([
  u({ type: String })
], _e.prototype, "todoEntityId", 2);
_e = Je([
  b("lucarne-tasks-summary")
], _e);
var Ns = Object.defineProperty, Us = Object.getOwnPropertyDescriptor, Kt = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Us(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Ns(e, s, a), a;
};
let ze = class extends _ {
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
  u({ type: Array })
], ze.prototype, "entries", 2);
ze = Kt([
  b("lucarne-presence-pills")
], ze);
var Bs = Object.defineProperty, Fs = Object.getOwnPropertyDescriptor, ie = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Fs(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Bs(e, s, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-today-card",
  name: "Lucarne Today",
  description: "Family agenda + weather + tasks + presence",
  preview: !0
});
let L = class extends _ {
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
    const e = Object.keys(t.states).filter((n) => n.startsWith("calendar.")).slice(0, 3), s = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], r = e.map((n, i) => ({
      entity: n,
      color: s[i] ?? "#a8d8b9"
    })), a = "weather.forecast_home" in t.states;
    return {
      type: "custom:lucarne-today-card",
      title: w.today,
      calendars: r.length ? r : [{ entity: "calendar.example", color: "#a8d8b9" }],
      weather: a ? "weather.forecast_home" : void 0
    };
  }
  getCardSize() {
    return 4;
  }
  getGridOptions() {
    return { columns: 6, rows: "auto", min_columns: 3, max_columns: 6 };
  }
  connectedCallback() {
    super.connectedCallback(), this._setupSubscriptions(), this._previewOverrideRaf = requestAnimationFrame(() => {
      this._previewOverrideRaf = void 0, this.isConnected && (this._previewOverride = Wt(this));
    });
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this._teardownSubscriptions(), this._previewOverrideRaf !== void 0 && (cancelAnimationFrame(this._previewOverrideRaf), this._previewOverrideRaf = void 0), (t = this._previewOverride) == null || t.uninstall(), this._previewOverride = void 0;
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
      const a = (r = this.hass.states[s]) == null ? void 0 : r.state;
      a && a !== this._lastWeatherState && (this._lastWeatherState = a, this._fetchForecast());
    }
  }
  async _fetchCalendarEvents() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.map((n) => n.entity), e = /* @__PURE__ */ new Date(), s = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), { events: r } = await Ft(this.hass, t, e, s), a = /* @__PURE__ */ new Map();
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
      var a, n;
      return {
        name: r.name,
        isHome: ((n = (a = this.hass) == null ? void 0 : a.states[r.entity]) == null ? void 0 : n.state) === "on"
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
  u({ attribute: !1 })
], L.prototype, "hass", 2);
ie([
  m()
], L.prototype, "_config", 2);
ie([
  m()
], L.prototype, "_calendarEvents", 2);
ie([
  m()
], L.prototype, "_forecast", 2);
ie([
  m()
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
      const a = await t(), i = (await Promise.resolve(
        a.createCardElement({ type: "entities", entities: [] })
      )).constructor;
      typeof (i == null ? void 0 : i.getConfigElement) == "function" && await Promise.resolve(i.getConfigElement());
    } catch (a) {
      console.warn("[lucarne] loadCardHelpers failed; falling back to whenDefined", a);
    }
  const e = Promise.all(
    bt.map((a) => customElements.whenDefined(a))
  ).then(() => "ready"), s = Ks(Ws).then(() => "timeout");
  if (await Promise.race([e, s]) === "timeout" && !bt.every((a) => customElements.get(a)))
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
  var a = new Event(e, { bubbles: r.bubbles === void 0 || r.bubbles, cancelable: !!r.cancelable, composed: r.composed === void 0 || r.composed });
  return a.detail = s, t.dispatchEvent(a), a;
}, qs = Object.defineProperty, Ys = Object.getOwnPropertyDescriptor, je = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Ys(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && qs(e, s, a), a;
};
let se = class extends _ {
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
    var r, a;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], entity: ((a = e.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, calendars: s });
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
    var r, a;
    const e = Object.keys(((r = this.hass) == null ? void 0 : r.states) ?? {}).find((n) => n.startsWith("calendar.")) ?? "calendar.example", s = [
      ...((a = this._config) == null ? void 0 : a.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: s });
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
              @value-changed=${(a) => this._calEntityChanged(r, a)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${s.color}
              @input=${(a) => this._calColorChanged(r, a)}
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
                @value-changed=${(a) => this._presenceEntityChanged(r, a)}
              ></ha-entity-picker>
              <input
                class="text-input"
                type="text"
                placeholder="Display name"
                .value=${s.name}
                @change=${(a) => this._presenceNameChanged(r, a)}
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
  u({ attribute: !1 })
], se.prototype, "hass", 2);
je([
  m()
], se.prototype, "_config", 2);
je([
  m()
], se.prototype, "_haReady", 2);
se = je([
  b("lucarne-today-card-editor")
], se);
function qt(t, e) {
  var r, a, n;
  const s = (n = (a = (r = e == null ? void 0 : e.states) == null ? void 0 : r[t.entity]) == null ? void 0 : a.attributes) == null ? void 0 : n.friendly_name;
  return typeof s == "string" && s ? s : t.entity;
}
function xt(t, e) {
  return t.map((s) => ({ ...s, label: qt(s, e) }));
}
function Ct(t, e) {
  const s = parseInt(t.split(":")[0], 10), r = parseInt(e.split(":")[0], 10), a = [];
  for (let n = s; n <= r; n++)
    a.push(n);
  return a;
}
function Xs(t, e, s) {
  const [r, a] = e.split(":").map(Number), [n, i] = s.split(":").map(Number), o = new Date(t);
  o.setHours(r, a, 0, 0);
  const l = new Date(t);
  return l.setHours(n, i, 0, 0), { bandStartMs: o.getTime(), bandEndMs: l.getTime() };
}
function Gs(t, e, s, r) {
  const a = kt(t.start).getTime(), n = kt(t.end).getTime(), { bandStartMs: i, bandEndMs: o } = Xs(e, s, r), l = Math.max(a, i), d = Math.min(n, o);
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
    let h = s.findIndex((p) => p <= d);
    h === -1 ? (h = s.length, s.push(l.end.getTime())) : s[h] = l.end.getTime(), r[l._idx] = h;
  }
  const a = new Array(t.length), n = [];
  let i = 0, o = e[0].end.getTime();
  a[e[0]._idx] = 0, n.push(r[e[0]._idx]);
  for (let l = 1; l < e.length; l++) {
    const d = e[l];
    d.start.getTime() >= o ? (i++, n.push(0), o = d.end.getTime()) : o = Math.max(o, d.end.getTime()), a[d._idx] = i, n[i] = Math.max(n[i], r[d._idx]);
  }
  return r.map((l, d) => ({
    lane: l,
    laneCount: n[a[d]] + 1
  }));
}
function Pe(t, e) {
  const [s, r] = e.split(":").map(Number), a = new Date(t);
  return a.setHours(s, r, 0, 0), a.getTime();
}
function Qs(t, e, s, r) {
  const a = /* @__PURE__ */ new Map();
  for (const o of e)
    a.set(T(o), { allDay: [], inBand: [], earlier: [], later: [] });
  const n = e.length > 0 ? e[0] : null, i = e.length > 0 ? e[e.length - 1] : null;
  for (const o of t) {
    if (Js(o)) {
      const h = /* @__PURE__ */ new Date(o.start + "T00:00:00"), p = /* @__PURE__ */ new Date(o.end + "T00:00:00"), g = n !== null && h < n, f = i ? new Date(i) : null;
      f && f.setDate(f.getDate() + 1);
      const v = f !== null && p > f;
      for (const $ of e) {
        const P = T($), O = a.get(P);
        if ($ >= h && $ < p && (O.allDay.push(o), g || v)) {
          O.allDayClipped || (O.allDayClipped = /* @__PURE__ */ new Map());
          const Ee = n !== null && T($) === T(n), De = i !== null && T($) === T(i);
          O.allDayClipped.set(Yt(o), {
            left: g && Ee,
            right: v && De
          });
        }
      }
      continue;
    }
    const l = new Date(o.start), d = new Date(o.end);
    for (const h of e) {
      const p = T(h), g = a.get(p), f = new Date(h);
      f.setHours(0, 0, 0, 0);
      const v = new Date(h);
      if (v.setHours(23, 59, 59, 999), d <= f || l > v) continue;
      const $ = Pe(h, s), P = Pe(h, r);
      if (d.getTime() <= $)
        g.earlier.push(o);
      else if (l.getTime() >= P)
        g.later.push(o);
      else {
        const O = Gs(o, h, s, r);
        if (O) {
          const Ee = P - $, De = (O.start.getTime() - $) / Ee * 100, Jt = (O.end.getTime() - O.start.getTime()) / Ee * 100;
          g.inBand.push({
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
    const l = T(o), d = a.get(l);
    if (d.inBand.length === 0) continue;
    const h = Pe(o, s), g = Pe(o, r) - h, f = d.inBand.map(($) => {
      const P = h + $.topPercent / 100 * g, O = P + $.heightPercent / 100 * g;
      return {
        event: $.event,
        start: new Date(P),
        end: new Date(O),
        lane: 0
      };
    }), v = Zs(f);
    d.inBand = d.inBand.map(($, P) => ({
      ...$,
      lane: v[P].lane,
      laneCount: v[P].laneCount
    }));
  }
  return { days: e, perDay: a };
}
function er(t, e) {
  const s = Math.min(e.minColWidth, e.maxColWidth), r = Math.max(e.minColWidth, e.maxColWidth), a = Math.min(e.minDays, e.maxDays), n = Math.max(e.minDays, e.maxDays), i = Math.max(0, t - e.timeColWidth);
  if (i <= 0)
    return { visibleCount: a, dayWidthPx: s };
  const o = Math.floor(i / s), l = Math.ceil(i / r), d = Math.min(n, Math.max(a, l, Math.min(o, n))), h = i / d;
  return { visibleCount: d, dayWidthPx: h };
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
    const s = new Set(this._opts.calendars.map((n) => n.entity)), r = new Set(e.map((n) => n.entity)), a = s.size !== r.size || [...r].some((n) => !s.has(n));
    this._opts.calendars = e, a && this._hass && this._fetchRange(...this._computeRange());
  }
  setVisibleCount(e) {
    var r, a;
    const s = this._visibleCount;
    if (this._visibleCount = e, (a = (r = this._opts).onChange) == null || a.call(r), this._host.requestUpdate(), e !== s) {
      const [n, i] = this._computeRange();
      this._rangeIsCovered(n, i) || this._fetchRange(n, i);
    }
  }
  /**
   * Set the off-screen render buffer (days drawn on each side of the visible
   * window). Pass `undefined` to revert to the default (matches visibleCount).
   * Non-finite or non-numeric input is coerced to `undefined` (default) so
   * bad YAML config doesn't blank the grid.
   */
  setBufferDays(e) {
    var r, a;
    const s = Et(e);
    s !== this._bufferDaysExplicit && (this._bufferDaysExplicit = s, (a = (r = this._opts).onChange) == null || a.call(r), this._host.requestUpdate());
  }
  pan(e) {
    var o, l;
    const s = -this._panBound, r = this._panBound - this._visibleCount, a = Math.max(s, Math.min(r, this._dayOffset + e));
    this._dayOffset = a, (l = (o = this._opts).onChange) == null || l.call(o), this._host.requestUpdate();
    const [n, i] = this._computeRange();
    this._rangeIsCovered(n, i) || this._fetchRange(n, i);
  }
  goToToday() {
    var a, n;
    const e = this._dayOffset === 0;
    this._dayOffset = 0, e || (n = (a = this._opts).onChange) == null || n.call(a), this._host.requestUpdate();
    const [s, r] = this._computeRange();
    this._rangeIsCovered(s, r) || this._fetchRange(s, r);
  }
  tick() {
    var r, a;
    const e = (this._opts.now ?? (() => /* @__PURE__ */ new Date()))(), s = Dt(e);
    s.getTime() !== this._anchorToday.getTime() && (this._anchorToday = s, this._dayOffset === 0 && ((a = (r = this._opts).onChange) == null || a.call(r), this._host.requestUpdate(), this._hass && this._fetchRange(...this._computeRange())));
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
    return Array.from({ length: s }, (r, a) => {
      const n = Te(this._anchorToday, this._dayOffset - e + a);
      return n.setHours(0, 0, 0, 0), n;
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
    var n, i;
    if (!this._hass) return;
    const r = ++this._fetchSeq, a = this._opts.calendars.map((o) => o.entity);
    (i = (n = this._opts).onFetchStart) == null || i.call(n, { start: e, end: s }), this._fetcher(this._hass, a, e, s).then(({ events: o, failed: l }) => {
      var h, p;
      if (r !== this._fetchSeq) return;
      const d = /* @__PURE__ */ new Map();
      for (const [g, f] of o.entries())
        d.set(
          g,
          f.map((v) => {
            const $ = v.uid && v.uid.length > 0 ? v.uid : tr(v);
            return { ...v, uid: `${g}::${$}` };
          })
        );
      this._cachedEvents = d, this._cachedDayKeys = /* @__PURE__ */ new Set();
      for (const g = new Date(e); g < s; g.setDate(g.getDate() + 1))
        this._cachedDayKeys.add(T(g));
      this._cacheStart = new Date(e), this._cacheEnd = new Date(s), (p = (h = this._opts).onFetchComplete) == null || p.call(h, d, l);
    }).catch((o) => {
      console.warn("[lucarne] RollingWindowController fetch failed:", o);
    });
  }
}
var rr = Object.defineProperty, ar = Object.getOwnPropertyDescriptor, et = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? ar(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && rr(e, s, a), a;
};
let ye = class extends _ {
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
  u({ type: Array })
], ye.prototype, "calendars", 2);
et([
  u({ type: Object })
], ye.prototype, "visibleIds", 2);
ye = et([
  b("lucarne-visibility-pills")
], ye);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nr = { ATTRIBUTE: 1 }, ir = (t) => (...e) => ({ _$litDirective$: t, values: e });
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
    if (super(t), t.type !== nr.ATTRIBUTE || t.name !== "style" || ((e = t.strings) == null ? void 0 : e.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
      const a = e[r];
      if (a != null) {
        this.ft.add(r);
        const n = typeof a == "string" && a.endsWith(lr);
        r.includes("-") || n ? s.setProperty(r, n ? a.slice(0, -11) : a, n ? Xt : "") : s[r] = a;
      }
    }
    return q;
  }
});
var dr = Object.defineProperty, hr = Object.getOwnPropertyDescriptor, J = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? hr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && dr(e, s, a), a;
};
function St(t) {
  return t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
}
let I = class extends _ {
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
  u({ type: Object })
], I.prototype, "event", 2);
J([
  u({ type: String })
], I.prototype, "color", 2);
J([
  u({ type: Number })
], I.prototype, "lane", 2);
J([
  u({ type: Number })
], I.prototype, "laneCount", 2);
J([
  u({ type: Number })
], I.prototype, "topPercent", 2);
J([
  u({ type: Number })
], I.prototype, "heightPercent", 2);
I = J([
  b("lucarne-calendar-event-block")
], I);
var ur = Object.defineProperty, pr = Object.getOwnPropertyDescriptor, xe = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? pr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && ur(e, s, a), a;
};
let Y = class extends _ {
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
  u({ type: Array })
], Y.prototype, "events", 2);
xe([
  u({ type: String })
], Y.prototype, "label", 2);
xe([
  u({ type: Object })
], Y.prototype, "eventColors", 2);
xe([
  m()
], Y.prototype, "_open", 2);
Y = xe([
  b("lucarne-out-of-band-stub")
], Y);
var fr = Object.defineProperty, gr = Object.getOwnPropertyDescriptor, Le = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? gr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && fr(e, s, a), a;
};
function mr(t) {
  return 20 + (t * 37 + 11) % 30;
}
function vr(t) {
  return 10 + (t * 53 + 7) % 60;
}
let re = class extends _ {
  constructor() {
    super(...arguments), this.bandStart = "07:00", this.bandEnd = "21:00", this.hourHeightPx = 60;
  }
  render() {
    const [t] = this.bandStart.split(":").map(Number), [e] = this.bandEnd.split(":").map(Number), r = Math.max(1, e - t) * this.hourHeightPx;
    return c`
      <div class="sk-host" style="height:${r}px">
        ${[0, 1].map((a) => {
      const i = vr(a) / 100 * r, o = mr(a);
      return c`
            <div
              class="fake-event"
              style="top: ${i}px; height: ${o}px;"
            >
              <div class="shimmer-sweep"></div>
            </div>
          `;
    })}
      </div>
    `;
  }
};
re.styles = [
  E,
  y`
      :host {
        display: block;
        width: 100%;
      }
      /*
       * Wrapper with an explicit pixel height derived from bandStart/bandEnd
       * and hourHeightPx. Avoids height:100% on :host because the parent
       * wrapper in calendar-grid is a flex column with no fixed height — on
       * the initial render (cachedDayKeys empty, no real day-col anywhere to
       * establish a row height), 100% of nothing collapsed the skeleton to
       * 0px and the shimmer was invisible.
       */
      .sk-host {
        position: relative;
        width: 100%;
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
  u({ type: String })
], re.prototype, "bandStart", 2);
Le([
  u({ type: String })
], re.prototype, "bandEnd", 2);
Le([
  u({ type: Number })
], re.prototype, "hourHeightPx", 2);
re = Le([
  b("lucarne-skeleton-day-column")
], re);
var _r = Object.defineProperty, yr = Object.getOwnPropertyDescriptor, z = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? yr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && _r(e, s, a), a;
};
function Pt(t, e) {
  return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
}
let A = class extends _ {
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
    const r = t.currentTarget.getBoundingClientRect(), [a] = this.bandStart.split(":").map(Number), [n] = this.bandEnd.split(":").map(Number), i = n - a, o = Math.max(0, Math.min(1, (t.clientY - r.top) / r.height)), l = a + o * i, d = Math.min(n - 1, Math.round(l * 2) / 2);
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
    const a = Ct(this.bandStart, this.bandEnd), i = (a.length - 1) * this.hourHeightPx, o = Pt(t, e), [l] = this.bandStart.split(":").map(Number), [d] = this.bandEnd.split(":").map(Number), h = (d - l) * 36e5;
    let p = null;
    if (o) {
      const f = new Date(t);
      f.setHours(l, 0, 0, 0);
      const v = new Date(t);
      v.setHours(d, 0, 0, 0), e >= f && e <= v && (p = (e.getTime() - f.getTime()) / h * 100);
    }
    const g = this._buildEventColorMap([...r.inBand.map((f) => f.event), ...r.earlier, ...r.later]);
    return c`
      <div class="day-col-wrapper">
        ${r.earlier.length > 0 ? c`
              <div class="stub-area-top">
                <lucarne-out-of-band-stub
                  .events=${r.earlier}
                  label="earlier"
                  .eventColors=${g}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}

        <div
          class="day-col"
          style="height:${i}px${this.showCreateButton ? "; cursor: crosshair" : ""}"
          @click=${(f) => this._onBandClick(f, t)}
        >
          ${a.slice(0, -1).map(
      (f, v) => c`
              <div
                class="hour-line"
                style="top: ${(v + 1) / (a.length - 1) * 100}%"
              ></div>
            `
    )}

          ${p !== null ? c`<div class="now-line" style="top:${p}%"></div>` : ""}

          ${r.inBand.map((f) => {
      const v = 100 / f.laneCount, $ = f.lane / f.laneCount * 100, P = this._eventColor(f.event);
      return c`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${f.topPercent}%;
                  left: calc(${$}% + 1px);
                  width: calc(${v}% - 2px);
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
                  .eventColors=${g}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}
      </div>
    `;
  }
  render() {
    if (!this.layout) return c`<div>Loading…</div>`;
    const t = /* @__PURE__ */ new Date(), e = Ct(this.bandStart, this.bandEnd), r = (e.length - 1) * this.hourHeightPx, a = new Intl.DateTimeFormat("en-US", { weekday: "short" }), n = {
      "--lucarne-day-render-count": String(this.layout.days.length)
    };
    return this.dayWidthPx > 0 && (n["--lucarne-day-width-px"] = `${this.dayWidthPx}px`, n["--lucarne-day-baseline-px"] = `${-this.bufferDays * this.dayWidthPx}px`), c`
      <div class="grid-wrapper" style=${cr(n)}>
        <!-- Time-column gutter cells (col 1): stay fixed during pan -->
        <div class="header-spacer" style="grid-row:1; grid-column:1"></div>
        <div class="allday-spacer" style="grid-row:2; grid-column:1">all-day</div>
        <div class="time-col" style="height:${r}px; grid-row:3; grid-column:1">
          ${e.map(
      (i, o) => c`
              <div
                class="hour-label"
                style="top: ${o / (e.length - 1) * 100}%"
              >
                ${i === 0 || i === 24 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
              </div>
            `
    )}
        </div>

        <!-- Row 1: day header track -->
        <div class="day-cols-track" style="grid-row:1">
          ${this.layout.days.map(
      (i, o) => c`
              <div
                class="day-header ${Pt(i, t) ? "today" : ""}"
                style="grid-column: ${o + 1}"
              >
                <div>${a.format(i)}</div>
                <div class="day-num">${i.getDate()}</div>
              </div>
            `
    )}
        </div>

        <!-- Row 2: all-day event track (wrapped in .day-cols-clip — see CSS) -->
        <div class="day-cols-clip" style="grid-row:2">
          <div class="day-cols-track">
            ${this.layout.days.map((i, o) => {
      const l = T(i), d = this.cachedDayKeys.has(l), h = this.layout.perDay.get(l);
      return c`
                <div class="allday-cell" style="grid-column: ${o + 1}">
                  ${d ? ((h == null ? void 0 : h.allDay) ?? []).map(
        (p) => {
          var f;
          const g = (f = h == null ? void 0 : h.allDayClipped) == null ? void 0 : f.get(Yt(p));
          return c`
                          <div
                            class="allday-event"
                            style="background: ${this._eventColor(p)}cc"
                            @click=${(v) => {
            v.stopPropagation(), this.dispatchEvent(
              new CustomEvent("lucarne-event-tap", {
                detail: { event: p, color: this._eventColor(p) },
                bubbles: !0,
                composed: !0
              })
            );
          }}
                          >
                            ${g != null && g.left ? c`<span class="clip-chevron">‹</span>` : ""}${p.summary}${g != null && g.right ? c`<span class="clip-chevron">›</span>` : ""}
                          </div>
                        `;
        }
      ) : c`<div class="allday-skeleton"><div class="shimmer-sweep"></div></div>`}
                </div>
              `;
    })}
          </div>
        </div>

        <!-- Row 3: time-band columns track -->
        <div class="day-cols-track" style="grid-row:3">
          ${this.layout.days.map((i, o) => {
      const l = T(i), d = this.cachedDayKeys.has(l);
      return c`
              <div style="grid-column:${o + 1}; position:relative; overflow:visible; display:flex; flex-direction:column;">
                ${d ? this._renderDayColumn(i, t) : c`<lucarne-skeleton-day-column
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
       * Wraps ONLY the row-2 all-day .day-cols-track in a column-2-scoped
       * overflow:hidden box (issue #3). On iPad Safari the sticky gutter
       * spacer wasn't reliably stacking above the all-day track's
       * transform-induced stacking context, so all-day events bled across the
       * hour column during pan. Clipping at the column boundary fixes it
       * unconditionally and browser-agnostic.
       *
       * Why row 2 only:
       *  - Row 1 (.day-header) uses position: sticky; top: 0 — an
       *    overflow:hidden ancestor becomes its scrollport and breaks sticky.
       *  - Row 3 contains <lucarne-out-of-band-stub> whose backdrop/popover are
       *    position: fixed. Because .day-cols-track has a transform, it is the
       *    containing block for those fixed children; clipping it would also
       *    clip the stub's full-viewport overlay.
       *  - Row 3's regular events already don't bleed past the gutter (the
       *    .time-col sticky spacer plus the .day-col isolation: isolate keep
       *    them stacked correctly).
       */
      .day-cols-clip {
        grid-column: 2;
        overflow: hidden;
        min-width: 0;
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
       *
       * Rows 1 and 3 place the track directly into grid-column 2; row 2 wraps
       * the track in a .day-cols-clip first (see the .day-cols-clip rule above
       * for why row 2 needs the wrapper and rows 1 and 3 don't).
       */
      .day-cols-track {
        grid-column: 2;
        display: grid;
        grid-template-columns: repeat(var(--lucarne-day-render-count, 7), var(--lucarne-day-width-px, 140px));
        width: calc(var(--lucarne-day-render-count, 7) * var(--lucarne-day-width-px, 140px));
        transform: translateX(var(--lucarne-day-baseline-px, 0px));
        will-change: transform;
      }
      /*
       * Reset grid-column on the inner track when it's inside a clip wrapper —
       * the wrapper already owns grid-column 2; the track is now a normal block
       * child of the wrapper, not a grid item.
       */
      .day-cols-clip > .day-cols-track {
        grid-column: auto;
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
  u({ type: Object })
], A.prototype, "layout", 2);
z([
  u({ type: String })
], A.prototype, "bandStart", 2);
z([
  u({ type: String })
], A.prototype, "bandEnd", 2);
z([
  u({ type: Array })
], A.prototype, "calendars", 2);
z([
  u({ type: Number })
], A.prototype, "hourHeightPx", 2);
z([
  u({ type: Boolean })
], A.prototype, "showCreateButton", 2);
z([
  u({ type: Number })
], A.prototype, "dayWidthPx", 2);
z([
  u({ type: Number })
], A.prototype, "bufferDays", 2);
z([
  u({ attribute: !1 })
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
  for (var a = r > 1 ? void 0 : r ? xr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && $r(e, s, a), a;
};
let N = class extends _ {
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
    const a = getComputedStyle(this).getPropertyValue("--lucarne-pan-duration").trim() || "240ms", n = getComputedStyle(this).getPropertyValue("--lucarne-pan-easing").trim() || "cubic-bezier(0.32, 0.72, 0, 1)", i = `transform ${a} ${n}`, o = s + t * this.dayWidthPx;
    for (const d of e)
      d.style.transition = i, d.style.transform = `translateX(${o}px)`;
    const l = (d) => {
      const h = d;
      h.target === e[0] && (h.propertyName && h.propertyName !== "transform" || (this._pendingTransitionEnd = void 0, e[0].removeEventListener("transitionend", l), t !== 0 && this._dispatchPanSnap(t), this._scheduleClearInline()));
    };
    this._pendingSnapTarget = e[0], this._pendingTransitionEnd = l, e[0].addEventListener("transitionend", l);
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
        const e = t.clientX - this._startX, s = performance.now() - this._startTime, r = s > 0 ? e / s * 1e3 : 0, a = this._applyRubberBand(e);
        let n = wr(a, this.dayWidthPx, r);
        (n > 0 && !this.canPanBack || n < 0 && !this.canPanForward) && (n = 0), this._snapAndCommit(n);
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
N.styles = y`
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
  u({ type: Number })
], N.prototype, "dayWidthPx", 2);
oe([
  u({ type: Number })
], N.prototype, "bufferDays", 2);
oe([
  u({ type: Boolean })
], N.prototype, "canPanBack", 2);
oe([
  u({ type: Boolean })
], N.prototype, "canPanForward", 2);
oe([
  Bt("slot")
], N.prototype, "_slot", 2);
N = oe([
  b("lucarne-calendar-day-pan")
], N);
var Cr = Object.defineProperty, kr = Object.getOwnPropertyDescriptor, R = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? kr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Cr(e, s, a), a;
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
let M = class extends _ {
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
   * uid available). The HA `calendar/event/delete` WebSocket command needs
   * a real upstream uid, so the trash button is hidden for synthetic ids.
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
    if (!this.event) return c``;
    const t = this.event, s = t.start.length === 10 && !t.start.includes("T") ? "All day" : `${Er(t.start)} – ${new Date(t.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 })}`, r = this._hasSyntheticUid(t.uid), a = !!this.entityId && !!t.uid && this.hass != null && xs(this.hass, this.entityId) && !this._isRecurring(t) && !r, n = this._confirmingDelete ? this._confirmDelete : this._startDelete, i = this._confirmingDelete ? "Confirm delete" : "Delete event";
    return c`
      <div class="backdrop" @click=${this._close}></div>
      <div class="popover" role="dialog" aria-modal="true">
        <div class="popover-header">
          <span class="color-dot" style="background:${this.color}"></span>
          <span class="event-title">${t.summary}</span>
          ${a ? c`
                <button
                  class="icon-btn ${this._confirmingDelete ? "armed" : ""}"
                  @click=${n}
                  ?disabled=${this._deleting}
                  aria-label=${i}
                  title=${i}
                >🗑️</button>
              ` : c`<span></span>`}
          <button class="icon-btn" @click=${this._close} aria-label="Close">✕</button>
        </div>

        ${this._confirmingDelete ? c`
              <div class="confirm-pill" role="alert">
                <span>Tap 🗑️ again to delete this event.</span>
                <button
                  class="cancel-link"
                  @click=${this._cancelDelete}
                  ?disabled=${this._deleting}
                >Cancel</button>
              </div>
            ` : ""}

        <div class="detail-row">
          <em class="detail-icon">⏰</em>
          <span class="detail-text">${s}</span>
        </div>

        ${this.calendarLabel ? c`
              <div class="detail-row">
                <em class="detail-icon">📅</em>
                <span class="calendar-label detail-text">
                  <span
                    style="width:10px;height:10px;border-radius:50%;background:${this.color};display:inline-block;flex-shrink:0"
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

        ${this._deleteError ? c`<div class="error-msg">${this._deleteError}</div>` : ""}
      </div>
    `;
  }
};
M.styles = [
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
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        column-gap: var(--lucarne-spacing-md);
        align-items: center;
        margin-bottom: var(--lucarne-spacing-md);
      }
      .color-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .event-title {
        font-size: var(--lucarne-fs-xl);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        line-height: 1.25;
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        color: var(--lucarne-on-surface-muted);
        padding: 4px;
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--lucarne-radius-sm);
        line-height: 1;
      }
      .icon-btn:hover {
        background: rgba(0, 0, 0, 0.06);
      }
      .icon-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .icon-btn.armed {
        background: rgba(198, 40, 40, 0.12);
      }
      .confirm-pill {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--lucarne-spacing-sm);
        background: rgba(198, 40, 40, 0.08);
        color: #b71c1c;
        border-radius: var(--lucarne-radius-sm);
        padding: 8px 12px;
        font-size: var(--lucarne-fs-md);
        font-weight: 600;
        margin-bottom: var(--lucarne-spacing-md);
      }
      .confirm-pill .cancel-link {
        background: none;
        border: none;
        color: var(--lucarne-on-surface);
        font-size: var(--lucarne-fs-md);
        font-weight: 500;
        cursor: pointer;
        text-decoration: underline;
        padding: 4px 6px;
        margin-left: auto;
        min-height: 32px;
      }
      .confirm-pill .cancel-link:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .detail-row {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        align-items: center;
        margin-bottom: var(--lucarne-spacing-sm);
        font-size: var(--lucarne-fs-md);
        color: var(--lucarne-on-surface-muted);
        line-height: 1.4;
      }
      .detail-icon {
        flex-shrink: 0;
        font-style: normal;
        width: 22px;
        text-align: center;
        font-size: 1.1em;
      }
      .detail-text {
        color: var(--lucarne-on-surface);
      }
      .calendar-label {
        font-size: var(--lucarne-fs-md);
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .error-msg {
        color: #b71c1c;
        font-size: var(--lucarne-fs-md);
        margin-top: var(--lucarne-spacing-sm);
      }
    `
];
R([
  u({ attribute: !1 })
], M.prototype, "hass", 2);
R([
  u({ type: Object })
], M.prototype, "event", 2);
R([
  u({ type: String })
], M.prototype, "color", 2);
R([
  u({ type: String })
], M.prototype, "calendarLabel", 2);
R([
  u({ type: String })
], M.prototype, "entityId", 2);
R([
  m()
], M.prototype, "_confirmingDelete", 2);
R([
  m()
], M.prototype, "_deleting", 2);
R([
  m()
], M.prototype, "_deleteError", 2);
M = R([
  b("lucarne-calendar-event-popover")
], M);
var Dr = Object.defineProperty, Sr = Object.getOwnPropertyDescriptor, D = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Sr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Dr(e, s, a), a;
};
function At(t, e) {
  const r = -(/* @__PURE__ */ new Date(`${t}T${e}:00`)).getTimezoneOffset(), a = r >= 0 ? "+" : "-", n = Math.floor(Math.abs(r) / 60).toString().padStart(2, "0"), i = (Math.abs(r) % 60).toString().padStart(2, "0");
  return `${t}T${e}:00${a}${n}:${i}`;
}
function Ot(t) {
  return `${Math.floor(t).toString().padStart(2, "0")}:${t % 1 === 0.5 ? "30" : "00"}`;
}
function Mt(t) {
  const e = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
  return `${e}-${s}-${r}`;
}
let C = class extends _ {
  constructor() {
    super(...arguments), this.day = null, this.startHour = 9, this.calendars = [], this._title = "", this._calendarEntityId = "", this._date = "", this._startTime = "", this._endTime = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
  }
  updated(t) {
    super.updated(t), (t.has("day") || t.has("startHour")) && this._initDefaults();
  }
  _initDefaults() {
    var s;
    const t = this.day ?? /* @__PURE__ */ new Date();
    this._date = Mt(t), this._startTime = Ot(Math.max(0, Math.min(23, this.startHour)));
    const e = Math.min(24, this.startHour + 1);
    this._endTime = Ot(e < 24 ? e : 23.5), this._calendarEntityId = ((s = this.calendars[0]) == null ? void 0 : s.entity) ?? "", this._title = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
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
      const a = Mt(r);
      t.end_date = a, e = this._date, s = a;
    } else {
      const r = At(this._date, this._startTime), a = At(this._date, this._endTime);
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
  u({ attribute: !1 })
], C.prototype, "hass", 2);
D([
  u({ type: Object })
], C.prototype, "day", 2);
D([
  u({ type: Number })
], C.prototype, "startHour", 2);
D([
  u({ type: Array })
], C.prototype, "calendars", 2);
D([
  m()
], C.prototype, "_title", 2);
D([
  m()
], C.prototype, "_calendarEntityId", 2);
D([
  m()
], C.prototype, "_date", 2);
D([
  m()
], C.prototype, "_startTime", 2);
D([
  m()
], C.prototype, "_endTime", 2);
D([
  m()
], C.prototype, "_allDay", 2);
D([
  m()
], C.prototype, "_description", 2);
D([
  m()
], C.prototype, "_location", 2);
D([
  m()
], C.prototype, "_error", 2);
D([
  m()
], C.prototype, "_saving", 2);
C = D([
  b("lucarne-create-event-popover")
], C);
var Pr = Object.defineProperty, Tr = Object.getOwnPropertyDescriptor, S = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Tr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Pr(e, s, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-calendar-card",
  name: "Lucarne Calendar",
  description: "Week view calendar with per-person color, visibility pills, and create-event flow",
  preview: !0
});
let k = class extends _ {
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
      const a = parseInt(t.visible_hours.start.split(":")[0], 10), n = parseInt(t.visible_hours.end.split(":")[0], 10);
      if (a < 0 || n > 24 || a >= n)
        throw new Error('lucarne-calendar-card: "visible_hours" must satisfy 0 <= start < end <= 24');
      e = {
        ...t,
        visible_hours: {
          start: `${String(a).padStart(2, "0")}:00`,
          end: `${String(n).padStart(2, "0")}:00`
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
        onFetchComplete: (a, n) => this._onFetchComplete(a, n),
        onChange: () => this._recompute()
      });
    }
  }
  static getStubConfig(t) {
    const e = Object.keys(t.states).filter((a) => a.startsWith("calendar.")).slice(0, 3), s = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], r = e.map((a, n) => ({
      entity: a,
      color: s[n] ?? "#a8d8b9"
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
    super.connectedCallback(), this._previewOverrideRaf = requestAnimationFrame(() => {
      this._previewOverrideRaf = void 0, this.isConnected && (this._previewOverride = Wt(this));
    });
  }
  disconnectedCallback() {
    var t, e;
    super.disconnectedCallback(), this._previewOverrideRaf !== void 0 && (cancelAnimationFrame(this._previewOverrideRaf), this._previewOverrideRaf = void 0), (t = this._resizeObserver) == null || t.disconnect(), (e = this._previewOverride) == null || e.uninstall(), this._previewOverride = void 0;
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
    var n, i;
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
    const e = this._deletedUids.size > 0 ? t.filter((o) => !o.uid || !this._deletedUids.has(o.uid)) : t, s = ((n = this._config.visible_hours) == null ? void 0 : n.start) ?? "07:00", r = ((i = this._config.visible_hours) == null ? void 0 : i.end) ?? "21:00", a = this._rolling.renderDays;
    this._layout = Qs(e, a, s, r);
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
      const n = e.uid.split("::")[0];
      this._openEventEntityId = n;
      const i = (a = this._config) == null ? void 0 : a.calendars.find((o) => o.entity === n);
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
   * `failed` is the set of entity ids whose REST fetch
   * (`GET /api/calendars/<entity_id>`) threw. Tombstones whose entity prefix
   * is in `failed` are NEVER pruned, because we can't distinguish "really
   * gone" from "the fetch never returned data for this entity." Without this
   * guard, a transient per-entity failure would silently resurrect every
   * optimistic delete for that entity.
   */
  _onFetchComplete(t, e) {
    if (this._pendingEvents = [], this._deletedUids.size > 0) {
      const s = /* @__PURE__ */ new Set();
      for (const a of t.values())
        for (const n of a)
          n.uid && s.add(n.uid);
      const r = /* @__PURE__ */ new Set();
      for (const a of this._deletedUids) {
        const n = a.includes("::") ? a.split("::")[0] : "";
        (e.has(n) || s.has(a)) && r.add(a);
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
    const e = t[0], s = t[t.length - 1], r = (i, o) => i.toLocaleDateString("en-US", o), a = e.getMonth() === s.getMonth() && e.getFullYear() === s.getFullYear(), n = e.getFullYear() === s.getFullYear();
    return a ? `${r(e, { month: "short", day: "numeric" })} – ${r(s, { day: "numeric" })}` : n ? `${r(e, { month: "short", day: "numeric" })} – ${r(s, { month: "short", day: "numeric" })}` : `${r(e, { month: "short", day: "numeric", year: "numeric" })} – ${r(s, { month: "short", day: "numeric", year: "numeric" })}`;
  }
  render() {
    var a, n;
    if (!this._config) return c``;
    const t = ((a = this._config.visible_hours) == null ? void 0 : a.start) ?? "07:00", e = ((n = this._config.visible_hours) == null ? void 0 : n.end) ?? "21:00", s = xt(this._config.calendars, this.hass), r = xt(this._creatableCalendars, this.hass);
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
  u({ attribute: !1 })
], k.prototype, "hass", 2);
S([
  Bt(".grid-area")
], k.prototype, "_gridAreaEl", 2);
S([
  m()
], k.prototype, "_config", 2);
S([
  m()
], k.prototype, "_layout", 2);
S([
  m()
], k.prototype, "_visibleIds", 2);
S([
  m()
], k.prototype, "_openEvent", 2);
S([
  m()
], k.prototype, "_openEventColor", 2);
S([
  m()
], k.prototype, "_openEventCalLabel", 2);
S([
  m()
], k.prototype, "_openEventEntityId", 2);
S([
  m()
], k.prototype, "_createDay", 2);
S([
  m()
], k.prototype, "_createStartHour", 2);
S([
  m()
], k.prototype, "_creatableCalendars", 2);
S([
  m()
], k.prototype, "_dayWidthPx", 2);
S([
  m()
], k.prototype, "_deletedUids", 2);
k = S([
  b("lucarne-calendar-card")
], k);
var Ar = Object.defineProperty, Or = Object.getOwnPropertyDescriptor, Ce = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Or(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Ar(e, s, a), a;
};
let X = class extends _ {
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
    var r, a;
    const s = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    s[t] = { ...s[t], entity: ((a = e.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, calendars: s });
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
    const s = e.target, r = s.value === "" ? void 0 : s.valueAsNumber, a = r !== void 0 && Number.isFinite(r) ? r : void 0, n = { ...this._config, [t]: a }, i = n.min_days ?? 3, o = n.max_days ?? 7, l = n.min_col_width ?? 140, d = n.max_col_width ?? 220;
    this._invalid = {
      days: i > o,
      cols: l > d
    }, this._fire(n);
  }
  _addCalendar() {
    var r, a;
    const e = Object.keys(((r = this.hass) == null ? void 0 : r.states) ?? {}).find((n) => n.startsWith("calendar.")) ?? "calendar.example", s = [
      ...((a = this._config) == null ? void 0 : a.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: s });
  }
  render() {
    var l, d;
    if (!this._config) return c``;
    if (!this._haReady) return c`<div class="loading">Loading editor…</div>`;
    const t = this._config.calendars ?? [], e = ((l = this._config.visible_hours) == null ? void 0 : l.start) ?? "07:00", s = ((d = this._config.visible_hours) == null ? void 0 : d.end) ?? "21:00", r = this._config.show_create_button ?? !0, a = this._config.min_days, n = this._config.max_days, i = this._config.min_col_width, o = this._config.max_col_width;
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
            .value=${a !== void 0 ? String(a) : ""}
            placeholder="3"
            @change=${(h) => this._windowFieldChanged("min_days", h)}
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
            .value=${n !== void 0 ? String(n) : ""}
            placeholder="7"
            @change=${(h) => this._windowFieldChanged("max_days", h)}
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
            @change=${(h) => this._windowFieldChanged("min_col_width", h)}
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
            @change=${(h) => this._windowFieldChanged("max_col_width", h)}
          />
          ${this._invalid.cols ? c`<div class="editor-error">Max width must be ≥ min width</div>` : ""}
        </label>
      </div>

      <div class="section-label">Calendars</div>
      ${t.map(
      (h, p) => c`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${h.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(g) => this._calEntityChanged(p, g)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${h.color}
              @input=${(g) => this._calColorChanged(p, g)}
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
  u({ attribute: !1 })
], X.prototype, "hass", 2);
Ce([
  m()
], X.prototype, "_config", 2);
Ce([
  m()
], X.prototype, "_haReady", 2);
Ce([
  m()
], X.prototype, "_invalid", 2);
X = Ce([
  b("lucarne-calendar-card-editor")
], X);
function zt(t) {
  return t.length === 0 ? !1 : t.every((e) => e.state === "on");
}
var Mr = Object.defineProperty, zr = Object.getOwnPropertyDescriptor, Ne = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? zr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Mr(e, s, a), a;
};
let ae = class extends _ {
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
ae.styles = y`
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
Ne([
  u()
], ae.prototype, "name", 2);
Ne([
  u()
], ae.prototype, "color", 2);
Ne([
  u({ attribute: "avatar-url" })
], ae.prototype, "avatarUrl", 2);
ae = Ne([
  b("lucarne-kid-avatar")
], ae);
var Ir = Object.defineProperty, Rr = Object.getOwnPropertyDescriptor, ke = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Rr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Ir(e, s, a), a;
};
let G = class extends _ {
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
  u({ attribute: !1 })
], G.prototype, "hass", 2);
ke([
  u()
], G.prototype, "name", 2);
ke([
  u({ attribute: "entity-id" })
], G.prototype, "entityId", 2);
ke([
  u({ type: Boolean, attribute: "is-done" })
], G.prototype, "isDone", 2);
G = ke([
  b("lucarne-chore-row")
], G);
var Hr = Object.defineProperty, jr = Object.getOwnPropertyDescriptor, Gt = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? jr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Hr(e, s, a), a;
};
let Ie = class extends _ {
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
  u({ type: Number })
], Ie.prototype, "streak", 2);
Ie = Gt([
  b("lucarne-streak-display")
], Ie);
var Lr = Object.defineProperty, Nr = Object.getOwnPropertyDescriptor, tt = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Nr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Lr(e, s, a), a;
};
let be = class extends _ {
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
  u({ attribute: "kid-slug" })
], be.prototype, "kidSlug", 2);
tt([
  u({ type: Boolean })
], be.prototype, "active", 2);
be = tt([
  b("lucarne-celebration-overlay")
], be);
var Ur = Object.defineProperty, Br = Object.getOwnPropertyDescriptor, le = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Br(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Ur(e, s, a), a;
};
let U = class extends _ {
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
      var r, a;
      const s = ((a = (r = this.hass) == null ? void 0 : r.states[e.entity]) == null ? void 0 : a.state) ?? "unavailable";
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
U.styles = y`
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
  u({ attribute: !1 })
], U.prototype, "hass", 2);
le([
  u({ attribute: !1 })
], U.prototype, "kid", 2);
le([
  u({ type: Number })
], U.prototype, "streak", 2);
le([
  u({ type: Boolean })
], U.prototype, "celebrating", 2);
le([
  u({ type: Boolean, attribute: "all-done" })
], U.prototype, "allDone", 2);
U = le([
  b("lucarne-kid-column")
], U);
var Fr = Object.defineProperty, Wr = Object.getOwnPropertyDescriptor, st = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Wr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Fr(e, s, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-chores-card",
  name: "Lucarne Chores",
  description: "Kid chore grid with streaks and celebration",
  preview: !0
});
let we = class extends _ {
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
        }), a = zt(r), n = this._lastAllDoneByKid.get(s) ?? null;
        if (n === null) {
          this._lastAllDoneByKid.set(s, a);
          continue;
        }
        n === !1 && a === !0 ? (this._lastAllDoneByKid.set(s, !0), this._triggerCelebration(s, e)) : n === !0 && a === !1 && this._lastAllDoneByKid.set(s, !1);
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
    const a = (l = this.hass) == null ? void 0 : l.states[e.streak], n = a ? parseInt(a.state, 10) : 0, i = /* @__PURE__ */ new Date(), o = `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}-${String(i.getDate()).padStart(2, "0")}`;
    this.hass.connection.sendMessagePromise({
      type: "fire_event",
      event_type: "ha_lucarne_chores_all_done",
      event_data: {
        kid_slug: t,
        kid_name: e.name,
        date: o,
        chores_completed: e.chores.length,
        streak: isNaN(n) ? 0 : n
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
      const r = s.name.toLowerCase().replace(/\s+/g, "_"), a = (l = this.hass) == null ? void 0 : l.states[s.streak], n = a ? parseInt(a.state, 10) : 0, i = s.chores.map((d) => {
        var h, p;
        return {
          state: ((p = (h = this.hass) == null ? void 0 : h.states[d.entity]) == null ? void 0 : p.state) ?? "unavailable"
        };
      }), o = zt(i);
      return c`
              <div class="kid-cell">
                <lucarne-kid-column
                  .hass=${this.hass}
                  .kid=${s}
                  .streak=${isNaN(n) ? 0 : n}
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
  u({ attribute: !1 })
], we.prototype, "hass", 2);
st([
  m()
], we.prototype, "_config", 2);
we = st([
  b("lucarne-chores-card")
], we);
var Kr = Object.defineProperty, Vr = Object.getOwnPropertyDescriptor, Ue = (t, e, s, r) => {
  for (var a = r > 1 ? void 0 : r ? Vr(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = (r ? i(e, s, a) : i(a)) || a);
  return r && a && Kr(e, s, a), a;
};
let ne = class extends _ {
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
    var a;
    const r = [...((a = this._config) == null ? void 0 : a.kids) ?? []];
    r[t] = { ...r[t], [e]: s.target.value }, this._fire({ ...this._config, kids: r });
  }
  _kidColorChanged(t, e) {
    var r;
    const s = [...((r = this._config) == null ? void 0 : r.kids) ?? []];
    s[t] = { ...s[t], color: e.target.value }, this._fire({ ...this._config, kids: s });
  }
  _kidStreakChanged(t, e) {
    var r, a;
    const s = [...((r = this._config) == null ? void 0 : r.kids) ?? []];
    s[t] = { ...s[t], streak: ((a = e.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, kids: s });
  }
  _choreNameChanged(t, e, s) {
    var n;
    const r = [...((n = this._config) == null ? void 0 : n.kids) ?? []], a = [...r[t].chores];
    a[e] = { ...a[e], name: s.target.value }, r[t] = { ...r[t], chores: a }, this._fire({ ...this._config, kids: r });
  }
  _choreEntityChanged(t, e, s) {
    var n, i;
    const r = [...((n = this._config) == null ? void 0 : n.kids) ?? []], a = [...r[t].chores];
    a[e] = { ...a[e], entity: ((i = s.detail) == null ? void 0 : i.value) ?? "" }, r[t] = { ...r[t], chores: a }, this._fire({ ...this._config, kids: r });
  }
  _removeChore(t, e) {
    var a;
    const s = [...((a = this._config) == null ? void 0 : a.kids) ?? []], r = [...s[t].chores];
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
    var n;
    const t = ((n = this._config) == null ? void 0 : n.kids) ?? [], e = new Set(
      t.map((i) => i.name.toLowerCase().replace(/\s+/g, "_"))
    ), s = ["#f5c89c", "#b8e0d2", "#f0b8c8", "#a8d8b9", "#c8b4e0"];
    let r = t.length + 1;
    for (; e.has(`kid_${r}`); ) r++;
    const a = [
      ...t,
      {
        name: `Kid ${r}`,
        color: s[(r - 1) % s.length],
        streak: `counter.kid_${r}_streak`,
        chores: [{ name: "Chore 1", entity: "" }]
      }
    ];
    this._fire({ ...this._config, kids: a });
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
        (r, a) => c`
                <div class="chore-row">
                  <ha-textfield
                    label="Chore name"
                    .value=${r.name}
                    @change=${(n) => this._choreNameChanged(s, a, n)}
                  ></ha-textfield>
                  <ha-entity-picker
                    label="Entity"
                    .hass=${this.hass}
                    .value=${r.entity}
                    .includeDomains=${["input_boolean"]}
                    allow-custom-entity
                    @value-changed=${(n) => this._choreEntityChanged(s, a, n)}
                  ></ha-entity-picker>
                  <button type="button" class="remove" @click=${() => this._removeChore(s, a)} title="Remove">✕</button>
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
ne.styles = [
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
Ue([
  u({ attribute: !1 })
], ne.prototype, "hass", 2);
Ue([
  m()
], ne.prototype, "_config", 2);
Ue([
  m()
], ne.prototype, "_haReady", 2);
ne = Ue([
  b("lucarne-chores-card-editor")
], ne);
//# sourceMappingURL=ha-lucarne.js.map
