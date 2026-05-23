/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = globalThis, Ve = Te.ShadowRoot && (Te.ShadyCSS === void 0 || Te.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, qe = Symbol(), at = /* @__PURE__ */ new WeakMap();
let zt = class {
  constructor(e, s, a) {
    if (this._$cssResult$ = !0, a !== qe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (Ve && e === void 0) {
      const a = s !== void 0 && s.length === 1;
      a && (e = at.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && at.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Xt = (t) => new zt(typeof t == "string" ? t : t + "", void 0, qe), _ = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((a, r, n) => a + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[n + 1], t[0]);
  return new zt(s, t, qe);
}, Gt = (t, e) => {
  if (Ve) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const a = document.createElement("style"), r = Te.litNonce;
    r !== void 0 && a.setAttribute("nonce", r), a.textContent = s.cssText, t.appendChild(a);
  }
}, rt = Ve ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const a of e.cssRules) s += a.cssText;
  return Xt(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Jt, defineProperty: Zt, getOwnPropertyDescriptor: Qt, getOwnPropertyNames: es, getOwnPropertySymbols: ts, getPrototypeOf: ss } = Object, R = globalThis, nt = R.trustedTypes, as = nt ? nt.emptyScript : "", Ue = R.reactiveElementPolyfillSupport, de = (t, e) => t, Ae = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? as : null;
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
} }, Ye = (t, e) => !Jt(t, e), it = { attribute: !0, type: String, converter: Ae, reflect: !1, useDefault: !1, hasChanged: Ye };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), R.litPropertyMetadata ?? (R.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Z = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = it) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const a = Symbol(), r = this.getPropertyDescriptor(e, a, s);
      r !== void 0 && Zt(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, s, a) {
    const { get: r, set: n } = Qt(this.prototype, e) ?? { get() {
      return this[s];
    }, set(i) {
      this[s] = i;
    } };
    return { get: r, set(i) {
      const o = r == null ? void 0 : r.call(this);
      n == null || n.call(this, i), this.requestUpdate(e, o, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? it;
  }
  static _$Ei() {
    if (this.hasOwnProperty(de("elementProperties"))) return;
    const e = ss(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(de("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(de("properties"))) {
      const s = this.properties, a = [...es(s), ...ts(s)];
      for (const r of a) this.createProperty(r, s[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [a, r] of s) this.elementProperties.set(a, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, a] of this.elementProperties) {
      const r = this._$Eu(s, a);
      r !== void 0 && this._$Eh.set(r, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const r of a) s.unshift(rt(r));
    } else e !== void 0 && s.push(rt(e));
    return s;
  }
  static _$Eu(e, s) {
    const a = s.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const a of s.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Gt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((s) => {
      var a;
      return (a = s.hostConnected) == null ? void 0 : a.call(s);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var a;
      return (a = s.hostDisconnected) == null ? void 0 : a.call(s);
    });
  }
  attributeChangedCallback(e, s, a) {
    this._$AK(e, a);
  }
  _$ET(e, s) {
    var n;
    const a = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, a);
    if (r !== void 0 && a.reflect === !0) {
      const i = (((n = a.converter) == null ? void 0 : n.toAttribute) !== void 0 ? a.converter : Ae).toAttribute(s, a.type);
      this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
    }
  }
  _$AK(e, s) {
    var n, i;
    const a = this.constructor, r = a._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = a.getPropertyOptions(r), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : Ae;
      this._$Em = r;
      const d = l.fromAttribute(s, o.type);
      this[r] = d ?? ((i = this._$Ej) == null ? void 0 : i.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, s, a, r = !1, n) {
    var i;
    if (e !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[e]), a ?? (a = o.getPropertyOptions(e)), !((a.hasChanged ?? Ye)(n, s) || a.useDefault && a.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(o._$Eu(e, a)))) return;
      this.C(e, s, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: a, reflect: r, wrapped: n }, i) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, i ?? s ?? this[e]), n !== !0 || i !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (s = void 0), this._$AL.set(e, s)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
    var a;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, i] of this._$Ep) this[n] = i;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, i] of r) {
        const { wrapped: o } = i, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, i, l);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), (a = this._$EO) == null || a.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(s)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var s;
    (s = this._$EO) == null || s.forEach((a) => {
      var r;
      return (r = a.hostUpdated) == null ? void 0 : r.call(a);
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
Z.elementStyles = [], Z.shadowRootOptions = { mode: "open" }, Z[de("elementProperties")] = /* @__PURE__ */ new Map(), Z[de("finalized")] = /* @__PURE__ */ new Map(), Ue == null || Ue({ ReactiveElement: Z }), (R.reactiveElementVersions ?? (R.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he = globalThis, ot = (t) => t, Me = he.trustedTypes, lt = Me ? Me.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, It = "$lit$", j = `lit$${Math.random().toFixed(9).slice(2)}$`, Ht = "?" + j, rs = `<${Ht}>`, K = document, pe = () => K.createComment(""), ge = (t) => t === null || typeof t != "object" && typeof t != "function", Xe = Array.isArray, ns = (t) => Xe(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Be = `[ 	
\f\r]`, le = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, dt = />/g, B = RegExp(`>|${Be}(?:([^\\s"'>=/]+)(${Be}*=${Be}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ht = /'/g, ut = /"/g, jt = /^(?:script|style|textarea|title)$/i, Rt = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), c = Rt(1), U = Rt(2), V = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), F = K.createTreeWalker(K, 129);
function Lt(t, e) {
  if (!Xe(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return lt !== void 0 ? lt.createHTML(e) : e;
}
const is = (t, e) => {
  const s = t.length - 1, a = [];
  let r, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = le;
  for (let o = 0; o < s; o++) {
    const l = t[o];
    let d, u, p = -1, m = 0;
    for (; m < l.length && (i.lastIndex = m, u = i.exec(l), u !== null); ) m = i.lastIndex, i === le ? u[1] === "!--" ? i = ct : u[1] !== void 0 ? i = dt : u[2] !== void 0 ? (jt.test(u[2]) && (r = RegExp("</" + u[2], "g")), i = B) : u[3] !== void 0 && (i = B) : i === B ? u[0] === ">" ? (i = r ?? le, p = -1) : u[1] === void 0 ? p = -2 : (p = i.lastIndex - u[2].length, d = u[1], i = u[3] === void 0 ? B : u[3] === '"' ? ut : ht) : i === ut || i === ht ? i = B : i === ct || i === dt ? i = le : (i = B, r = void 0);
    const g = i === B && t[o + 1].startsWith("/>") ? " " : "";
    n += i === le ? l + rs : p >= 0 ? (a.push(d), l.slice(0, p) + It + l.slice(p) + j + g) : l + j + (p === -2 ? o : g);
  }
  return [Lt(t, n + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class fe {
  constructor({ strings: e, _$litType$: s }, a) {
    let r;
    this.parts = [];
    let n = 0, i = 0;
    const o = e.length - 1, l = this.parts, [d, u] = is(e, s);
    if (this.el = fe.createElement(d, a), F.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = F.nextNode()) !== null && l.length < o; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(It)) {
          const m = u[i++], g = r.getAttribute(p).split(j), b = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: n, name: b[2], strings: g, ctor: b[1] === "." ? ls : b[1] === "?" ? cs : b[1] === "@" ? ds : Ie }), r.removeAttribute(p);
        } else p.startsWith(j) && (l.push({ type: 6, index: n }), r.removeAttribute(p));
        if (jt.test(r.tagName)) {
          const p = r.textContent.split(j), m = p.length - 1;
          if (m > 0) {
            r.textContent = Me ? Me.emptyScript : "";
            for (let g = 0; g < m; g++) r.append(p[g], pe()), F.nextNode(), l.push({ type: 2, index: ++n });
            r.append(p[m], pe());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ht) l.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(j, p + 1)) !== -1; ) l.push({ type: 7, index: n }), p += j.length - 1;
      }
      n++;
    }
  }
  static createElement(e, s) {
    const a = K.createElement("template");
    return a.innerHTML = e, a;
  }
}
function ee(t, e, s = t, a) {
  var i, o;
  if (e === V) return e;
  let r = a !== void 0 ? (i = s._$Co) == null ? void 0 : i[a] : s._$Cl;
  const n = ge(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((o = r == null ? void 0 : r._$AO) == null || o.call(r, !1), n === void 0 ? r = void 0 : (r = new n(t), r._$AT(t, s, a)), a !== void 0 ? (s._$Co ?? (s._$Co = []))[a] = r : s._$Cl = r), r !== void 0 && (e = ee(t, r._$AS(t, e.values), r, a)), e;
}
class os {
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
    const { el: { content: s }, parts: a } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? K).importNode(s, !0);
    F.currentNode = r;
    let n = F.nextNode(), i = 0, o = 0, l = a[0];
    for (; l !== void 0; ) {
      if (i === l.index) {
        let d;
        l.type === 2 ? d = new we(n, n.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (d = new hs(n, this, e)), this._$AV.push(d), l = a[++o];
      }
      i !== (l == null ? void 0 : l.index) && (n = F.nextNode(), i++);
    }
    return F.currentNode = K, r;
  }
  p(e) {
    let s = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, s), s += a.strings.length - 2) : a._$AI(e[s])), s++;
  }
}
class we {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, s, a, r) {
    this.type = 2, this._$AH = $, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = a, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    e = ee(this, e, s), ge(e) ? e === $ || e == null || e === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : e !== this._$AH && e !== V && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ns(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== $ && ge(this._$AH) ? this._$AA.nextSibling.data = e : this.T(K.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: s, _$litType$: a } = e, r = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = fe.createElement(Lt(a.h, a.h[0]), this.options)), a);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(s);
    else {
      const i = new os(r, this), o = i.u(this.options);
      i.p(s), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let s = pt.get(e.strings);
    return s === void 0 && pt.set(e.strings, s = new fe(e)), s;
  }
  k(e) {
    Xe(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let a, r = 0;
    for (const n of e) r === s.length ? s.push(a = new we(this.O(pe()), this.O(pe()), this, this.options)) : a = s[r], a._$AI(n), r++;
    r < s.length && (this._$AR(a && a._$AB.nextSibling, r), s.length = r);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, s); e !== this._$AB; ) {
      const r = ot(e).nextSibling;
      ot(e).remove(), e = r;
    }
  }
  setConnected(e) {
    var s;
    this._$AM === void 0 && (this._$Cv = e, (s = this._$AP) == null || s.call(this, e));
  }
}
class Ie {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, a, r, n) {
    this.type = 1, this._$AH = $, this._$AN = void 0, this.element = e, this.name = s, this._$AM = r, this.options = n, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = $;
  }
  _$AI(e, s = this, a, r) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) e = ee(this, e, s, 0), i = !ge(e) || e !== this._$AH && e !== V, i && (this._$AH = e);
    else {
      const o = e;
      let l, d;
      for (e = n[0], l = 0; l < n.length - 1; l++) d = ee(this, o[a + l], s, l), d === V && (d = this._$AH[l]), i || (i = !ge(d) || d !== this._$AH[l]), d === $ ? e = $ : e !== $ && (e += (d ?? "") + n[l + 1]), this._$AH[l] = d;
    }
    i && !r && this.j(e);
  }
  j(e) {
    e === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ls extends Ie {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === $ ? void 0 : e;
  }
}
class cs extends Ie {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== $);
  }
}
class ds extends Ie {
  constructor(e, s, a, r, n) {
    super(e, s, a, r, n), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = ee(this, e, s, 0) ?? $) === V) return;
    const a = this._$AH, r = e === $ && a !== $ || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, n = e !== $ && (a === $ || r);
    r && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class hs {
  constructor(e, s, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ee(this, e);
  }
}
const Fe = he.litHtmlPolyfillSupport;
Fe == null || Fe(fe, we), (he.litHtmlVersions ?? (he.litHtmlVersions = [])).push("3.3.3");
const us = (t, e, s) => {
  const a = (s == null ? void 0 : s.renderBefore) ?? e;
  let r = a._$litPart$;
  if (r === void 0) {
    const n = (s == null ? void 0 : s.renderBefore) ?? null;
    a._$litPart$ = r = new we(e.insertBefore(pe(), n), n, void 0, s ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = us(s, this.renderRoot, this.renderOptions);
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
};
var Ot;
v._$litElement$ = !0, v.finalized = !0, (Ot = W.litElementHydrateSupport) == null || Ot.call(W, { LitElement: v });
const We = W.litElementPolyfillSupport;
We == null || We({ LitElement: v });
(W.litElementVersions ?? (W.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ps = { attribute: !0, type: String, converter: Ae, reflect: !1, hasChanged: Ye }, gs = (t = ps, e, s) => {
  const { kind: a, metadata: r } = s;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(s.name, t), a === "accessor") {
    const { name: i } = s;
    return { set(o) {
      const l = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(i, l, t, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(i, void 0, t, o), o;
    } };
  }
  if (a === "setter") {
    const { name: i } = s;
    return function(o) {
      const l = this[i];
      e.call(this, o), this.requestUpdate(i, l, t, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function h(t) {
  return (e, s) => typeof s == "object" ? gs(t, e, s) : ((a, r, n) => {
    const i = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, a), i ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(t) {
  return h({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fs = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Nt(t, e) {
  return (s, a, r) => {
    const n = (i) => {
      var o;
      return ((o = i.renderRoot) == null ? void 0 : o.querySelector(t)) ?? null;
    };
    return fs(s, a, { get() {
      return n(this);
    } });
  };
}
const E = _`
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
function ms(t, e, s) {
  let a, r = !1;
  return t.connection.subscribeMessage(
    (n) => {
      var i, o;
      (o = (i = n.variables) == null ? void 0 : i.trigger) != null && o.to_state && s(n.variables.trigger.to_state);
    },
    { type: "subscribe_trigger", trigger: { platform: "state", entity_id: e } }
  ).then((n) => {
    r ? n() : a = n;
  }), () => {
    r = !0, a == null || a();
  };
}
async function Ut(t, e, s, a) {
  const r = await Promise.all(
    e.map(
      (n) => t.connection.sendMessagePromise({
        type: "call_service",
        domain: "calendar",
        service: "get_events",
        service_data: {
          start_date_time: s.toISOString(),
          end_date_time: a.toISOString()
        },
        target: { entity_id: n },
        return_response: !0
      }).then((i) => {
        var o, l;
        return [n, ((l = (o = i == null ? void 0 : i.response) == null ? void 0 : o[n]) == null ? void 0 : l.events) ?? []];
      }).catch((i) => (console.warn(`[lucarne] calendar.get_events failed for ${n}:`, i), [n, []]))
    )
  );
  return new Map(r);
}
async function vs(t, e, s) {
  await t.callService("calendar", "delete_event", { uid: s }, { entity_id: e });
}
const _s = 4;
function ys(t, e) {
  var a, r;
  const s = (r = (a = t.states[e]) == null ? void 0 : a.attributes) == null ? void 0 : r.supported_features;
  return typeof s != "number" ? !1 : (s & _s) !== 0;
}
function bs(t, e, s) {
  const a = async () => {
    var r, n;
    try {
      const i = await t.connection.sendMessagePromise({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: {},
        target: { entity_id: e },
        return_response: !0
      });
      s(((n = (r = i == null ? void 0 : i.response) == null ? void 0 : r[e]) == null ? void 0 : n.items) ?? []);
    } catch (i) {
      console.warn(`[lucarne] todo.get_items failed for ${e}:`, i), s([]);
    }
  };
  return a(), ms(t, e, () => a());
}
function ws(t) {
  let e = t;
  for (; e; ) {
    if (e instanceof Element) {
      const r = e.tagName.toLowerCase();
      if (r === "hui-dialog-edit-card" || r === "ha-dialog") return !0;
    }
    const s = e.parentNode;
    if (s) {
      e = s;
      continue;
    }
    const a = e.getRootNode();
    e = a instanceof ShadowRoot ? a.host : null;
  }
  return !1;
}
function $s(t) {
  let e = t.parentElement;
  for (; e && !e.style.getPropertyValue("--column-size"); )
    e = e.parentElement;
  return (e == null ? void 0 : e.parentElement) ?? null;
}
function Bt(t) {
  if (!ws(t)) return null;
  const e = $s(t);
  if (!e) return null;
  const s = e.style.getPropertyValue("--grid-column-count"), a = () => {
    e.style.getPropertyValue("--grid-column-count") !== "1" && e.style.setProperty("--grid-column-count", "1");
  };
  a();
  const r = new MutationObserver(a);
  return r.observe(e, { attributes: !0, attributeFilter: ["style"] }), {
    uninstall() {
      r.disconnect(), s ? e.style.setProperty("--grid-column-count", s) : e.style.removeProperty("--grid-column-count");
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
var xs = Object.defineProperty, Cs = Object.getOwnPropertyDescriptor, He = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Cs(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && xs(e, s, r), r;
};
function ue(t) {
  return t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
}
function ks(t, e, s) {
  return t.filter((a) => ue(a.end) > e).sort((a, r) => ue(a.start).getTime() - ue(r.start).getTime()).slice(0, s);
}
function Es(t, e, s) {
  const a = t.getTime() - s.getTime();
  if (t <= s && s < e) return w.timePillNow;
  if (a > 0 && a < 60 * 60 * 1e3) {
    const d = Math.round(a / 6e4);
    return w.timePillInMinutes(d);
  }
  if (a > 0 && a < 2 * 60 * 60 * 1e3) {
    const d = Math.round(a / 36e5);
    return w.timePillInHours(d);
  }
  const n = t.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (t.toDateString() === s.toDateString()) return n;
  const o = new Date(s);
  return o.setDate(s.getDate() + 1), t.toDateString() === o.toDateString() ? w.timePillTomorrow(n) : `${t.toLocaleDateString("en", { weekday: "short" })} ${n}`;
}
function Ds(t) {
  return t.start.length === 10 && t.end.length === 10;
}
let te = class extends v {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.limit = 5;
  }
  render() {
    const t = /* @__PURE__ */ new Date(), e = ks(this.events, t, this.limit);
    return e.length === 0 ? c`<div class="empty-state">${w.nothingOnCalendar}</div>` : c`
      ${e.map((s) => {
      const a = ue(s.start), r = ue(s.end), n = a <= t && t < r, i = Ds(s) ? "all day" : Es(a, r, t), o = this._colorForEvent(s);
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
  _`
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
  h({ type: Array })
], te.prototype, "events", 2);
He([
  h({ type: Object })
], te.prototype, "calendarColors", 2);
He([
  h({ type: Number })
], te.prototype, "limit", 2);
te = He([
  y("lucarne-agenda-strip")
], te);
const gt = U`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`, Q = U`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>`, ce = U`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`, ft = U`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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
</svg>`, Ss = U`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M4.22 19.78l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="currentColor"/>
  <path d="M20 15h-1.26A6 6 0 1 0 8 20h12a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.7"/>
</svg>`;
U`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="7" r="4"/>
  <path d="M20 21a8 8 0 1 0-16 0"/>
</svg>`;
U`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"/>
</svg>`;
const Ps = U`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, mt = {
  sunny: gt,
  "clear-night": gt,
  cloudy: Q,
  fog: Q,
  hail: ce,
  lightning: ce,
  "lightning-rainy": ce,
  partlycloudy: Ss,
  pouring: ce,
  rainy: ce,
  snowy: ft,
  "snowy-rainy": ft,
  windy: Q,
  "windy-variant": Q,
  exceptional: Q
};
function vt(t) {
  return mt[t] ?? mt[t.toLowerCase()] ?? Q;
}
const Ts = {
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
function _t(t) {
  return Ts[t.toLowerCase()] ?? "#8aa0b8";
}
function As(t) {
  if (!t.length) return w.dressingTipDefault;
  const e = t[0];
  if (e.condition.toLowerCase().includes("snow"))
    return w.dressingTipBoots;
  const a = e.temperature;
  let r;
  return a < 5 ? r = w.dressingTipHeavyCoat : a < 12 ? r = w.dressingTipCoatScarf : a < 18 ? r = w.dressingTipLightJacket : a < 24 ? r = w.dressingTipTShirt : r = w.dressingTipShorts, (e.precipitation_probability ?? 0) > 50 && (r += w.dressingTipUmbrella), r;
}
var Ms = Object.defineProperty, Os = Object.getOwnPropertyDescriptor, Ge = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Os(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ms(e, s, r), r;
};
let me = class extends v {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return c`<div class="empty-state">${w.addWeatherEntity}</div>`;
    const t = this.weatherEntity.attributes, e = t.temperature, s = t.temperature_unit ?? "°C", a = this.weatherEntity.state, r = this.forecast[0], n = this.forecast[1], i = As(this.forecast);
    return c`
      <div class="current">
        <span class="condition-icon" style="color: ${_t(a)}">${vt(a)}</span>
        <div class="temp-group">
          <div class="current-temp">${e !== void 0 ? `${Math.round(e)}${s}` : w.errorUnavailable}</div>
          ${r ? c`<div class="high-low">
                ↑${Math.round(r.temperature)}${s}
                ${r.templow !== void 0 ? ` ↓${Math.round(r.templow)}${s}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${n ? c`
            <div class="tomorrow-row">
              <span class="tomorrow-icon" style="color: ${_t(n.condition)}">${vt(n.condition)}</span>
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
me.styles = [
  E,
  _`
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
], me.prototype, "weatherEntity", 2);
Ge([
  h({ type: Array })
], me.prototype, "forecast", 2);
me = Ge([
  y("lucarne-weather-block")
], me);
var zs = Object.defineProperty, Is = Object.getOwnPropertyDescriptor, Je = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Is(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && zs(e, s, r), r;
};
let ve = class extends v {
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
    const t = this.items.filter((r) => r.status === "needs_action"), e = t.length, s = t.slice(0, 3), a = e - s.length;
    return e === 0 ? c`
        <div class="empty-state">
          <span class="empty-icon">${Ps}</span>
          ${w.allDone}
        </div>
      ` : c`
      <div class="header">
        ${w.tasksTitle}
        <span class="count-badge">${e}</span>
      </div>
      ${s.map(
      (r) => c`
          <div class="task-row">
            <span class="summary">${r.summary}</span>
            ${r.due ? c`<span class="due-chip">${this._formatDue(r.due)}</span>` : ""}
          </div>
        `
    )}
      ${a > 0 ? c`<div class="more-row" @click=${this._handleMoreClick}>
            ${w.moreItems(a)}
          </div>` : ""}
    `;
  }
  _formatDue(t) {
    const e = t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
    return isNaN(e.getTime()) ? t : e.toLocaleDateString("en", { month: "short", day: "numeric" });
  }
};
ve.styles = [
  E,
  _`
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
], ve.prototype, "items", 2);
Je([
  h({ type: String })
], ve.prototype, "todoEntityId", 2);
ve = Je([
  y("lucarne-tasks-summary")
], ve);
var Hs = Object.defineProperty, js = Object.getOwnPropertyDescriptor, Ft = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? js(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Hs(e, s, r), r;
};
let Oe = class extends v {
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
Oe.styles = [
  E,
  _`
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
Ft([
  h({ type: Array })
], Oe.prototype, "entries", 2);
Oe = Ft([
  y("lucarne-presence-pills")
], Oe);
var Rs = Object.defineProperty, Ls = Object.getOwnPropertyDescriptor, ie = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ls(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Rs(e, s, r), r;
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
    const e = Object.keys(t.states).filter((n) => n.startsWith("calendar.")).slice(0, 3), s = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], a = e.map((n, i) => ({
      entity: n,
      color: s[i] ?? "#a8d8b9"
    })), r = "weather.forecast_home" in t.states;
    return {
      type: "custom:lucarne-today-card",
      title: w.today,
      calendars: a.length ? a : [{ entity: "calendar.example", color: "#a8d8b9" }],
      weather: r ? "weather.forecast_home" : void 0
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
      this._previewOverride = Bt(this);
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
    }, 5 * 60 * 1e3), this._config.tasks && (this._todoUnsub = bs(this.hass, this._config.tasks, (t) => {
      this._todoItems = t;
    })));
  }
  _teardownSubscriptions() {
    var t;
    clearInterval(this._calendarIntervalId), (t = this._todoUnsub) == null || t.call(this), this._todoUnsub = void 0, this._calendarIntervalId = void 0;
  }
  updated(t) {
    var a;
    if (super.updated(t), !t.has("hass") || !this._config) return;
    if (!t.get("hass") && this.hass && !this._calendarIntervalId) {
      this._setupSubscriptions();
      return;
    }
    const s = this._config.weather;
    if (s) {
      const r = (a = this.hass.states[s]) == null ? void 0 : a.state;
      r && r !== this._lastWeatherState && (this._lastWeatherState = r, this._fetchForecast());
    }
  }
  async _fetchCalendarEvents() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.map((n) => n.entity), e = /* @__PURE__ */ new Date(), s = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), a = await Ut(this.hass, t, e, s), r = /* @__PURE__ */ new Map();
    for (const [n, i] of a.entries())
      r.set(
        n,
        i.map((o) => ({ ...o, uid: `${n}::${o.uid ?? o.summary}` }))
      );
    this._calendarEvents = r;
  }
  async _fetchForecast() {
    var t, e, s;
    if (!(this._fetchingForecast || !((t = this._config) != null && t.weather) || !this.hass)) {
      this._fetchingForecast = !0;
      try {
        const a = await this.hass.connection.sendMessagePromise({
          type: "call_service",
          domain: "weather",
          service: "get_forecasts",
          service_data: { type: "daily" },
          target: { entity_id: this._config.weather },
          return_response: !0
        });
        this._forecast = ((s = (e = a == null ? void 0 : a.response) == null ? void 0 : e[this._config.weather]) == null ? void 0 : s.forecast) ?? [];
      } catch (a) {
        console.warn(`[lucarne] weather.get_forecasts failed for ${this._config.weather}:`, a), this._forecast = [];
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
    const t = this._config.weather ? (s = this.hass) == null ? void 0 : s.states[this._config.weather] : void 0, e = (this._config.presence ?? []).map((a) => {
      var r, n;
      return {
        name: a.name,
        isHome: ((n = (r = this.hass) == null ? void 0 : r.states[a.entity]) == null ? void 0 : n.state) === "on"
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
  _`
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
  f()
], L.prototype, "_config", 2);
ie([
  f()
], L.prototype, "_calendarEvents", 2);
ie([
  f()
], L.prototype, "_forecast", 2);
ie([
  f()
], L.prototype, "_todoItems", 2);
L = ie([
  y("lucarne-today-card")
], L);
const Wt = _`
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
`, yt = ["ha-entity-picker", "ha-textfield"], Ns = 3e3;
let Se;
function Us(t) {
  return new Promise((e) => setTimeout(e, t));
}
async function Bs() {
  const t = window.loadCardHelpers;
  if (t)
    try {
      const r = await t(), i = (await Promise.resolve(
        r.createCardElement({ type: "entities", entities: [] })
      )).constructor;
      typeof (i == null ? void 0 : i.getConfigElement) == "function" && await Promise.resolve(i.getConfigElement());
    } catch (r) {
      console.warn("[lucarne] loadCardHelpers failed; falling back to whenDefined", r);
    }
  const e = Promise.all(
    yt.map((r) => customElements.whenDefined(r))
  ).then(() => "ready"), s = Us(Ns).then(() => "timeout");
  if (await Promise.race([e, s]) === "timeout" && !yt.every((r) => customElements.get(r)))
    throw new Error("[lucarne] HA form elements did not register within timeout");
}
function Ze() {
  return Se || (Se = Bs().catch((t) => {
    throw Se = void 0, t;
  })), Se;
}
var bt, wt;
(function(t) {
  t.language = "language", t.system = "system", t.comma_decimal = "comma_decimal", t.decimal_comma = "decimal_comma", t.space_comma = "space_comma", t.none = "none";
})(bt || (bt = {})), function(t) {
  t.language = "language", t.system = "system", t.am_pm = "12", t.twenty_four = "24";
}(wt || (wt = {}));
var Qe = function(t, e, s, a) {
  a = a || {}, s = s ?? {};
  var r = new Event(e, { bubbles: a.bubbles === void 0 || a.bubbles, cancelable: !!a.cancelable, composed: a.composed === void 0 || a.composed });
  return r.detail = s, t.dispatchEvent(r), r;
}, Fs = Object.defineProperty, Ws = Object.getOwnPropertyDescriptor, je = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ws(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Fs(e, s, r), r;
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
    var a, r;
    const s = [...((a = this._config) == null ? void 0 : a.calendars) ?? []];
    s[t] = { ...s[t], entity: ((r = e.detail) == null ? void 0 : r.value) ?? "" }, this._fire({ ...this._config, calendars: s });
  }
  _calColorChanged(t, e) {
    var a;
    const s = [...((a = this._config) == null ? void 0 : a.calendars) ?? []];
    s[t] = { ...s[t], color: e.target.value }, this._fire({ ...this._config, calendars: s });
  }
  _removeCalendar(t) {
    var s;
    const e = [...((s = this._config) == null ? void 0 : s.calendars) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, calendars: e }));
  }
  _addCalendar() {
    var a, r;
    const e = Object.keys(((a = this.hass) == null ? void 0 : a.states) ?? {}).find((n) => n.startsWith("calendar.")) ?? "calendar.example", s = [
      ...((r = this._config) == null ? void 0 : r.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: s });
  }
  _presenceEntityChanged(t, e) {
    var a, r;
    const s = [...((a = this._config) == null ? void 0 : a.presence) ?? []];
    s[t] = { ...s[t], entity: ((r = e.detail) == null ? void 0 : r.value) ?? "" }, this._fire({ ...this._config, presence: s });
  }
  _presenceNameChanged(t, e) {
    var a;
    const s = [...((a = this._config) == null ? void 0 : a.presence) ?? []];
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
      (s, a) => c`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${s.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(r) => this._calEntityChanged(a, r)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${s.color}
              @input=${(r) => this._calColorChanged(a, r)}
              title="Calendar color"
            />
            <button type="button" class="remove" @click=${() => this._removeCalendar(a)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addCalendar}>+ Add calendar</button>

      <div class="section-label">Presence</div>
      ${e.map(
      (s, a) => c`
          <div class="presence-row">
            <div class="row-stack">
              <ha-entity-picker
                label="Entity"
                .hass=${this.hass}
                .value=${s.entity}
                .includeDomains=${["input_boolean"]}
                allow-custom-entity
                @value-changed=${(r) => this._presenceEntityChanged(a, r)}
              ></ha-entity-picker>
              <input
                class="text-input"
                type="text"
                placeholder="Display name"
                .value=${s.name}
                @change=${(r) => this._presenceNameChanged(a, r)}
              />
            </div>
            <button type="button" class="remove" @click=${() => this._removePresence(a)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addPresence}>+ Add person</button>
    `;
  }
};
se.styles = [E, Wt];
je([
  h({ attribute: !1 })
], se.prototype, "hass", 2);
je([
  f()
], se.prototype, "_config", 2);
je([
  f()
], se.prototype, "_haReady", 2);
se = je([
  y("lucarne-today-card-editor")
], se);
function Kt(t, e) {
  var a, r, n;
  const s = (n = (r = (a = e == null ? void 0 : e.states) == null ? void 0 : a[t.entity]) == null ? void 0 : r.attributes) == null ? void 0 : n.friendly_name;
  return typeof s == "string" && s ? s : t.entity;
}
function $t(t, e) {
  return t.map((s) => ({ ...s, label: Kt(s, e) }));
}
function xt(t, e) {
  const s = parseInt(t.split(":")[0], 10), a = parseInt(e.split(":")[0], 10), r = [];
  for (let n = s; n <= a; n++)
    r.push(n);
  return r;
}
function Ks(t, e, s) {
  const [a, r] = e.split(":").map(Number), [n, i] = s.split(":").map(Number), o = new Date(t);
  o.setHours(a, r, 0, 0);
  const l = new Date(t);
  return l.setHours(n, i, 0, 0), { bandStartMs: o.getTime(), bandEndMs: l.getTime() };
}
function Vs(t, e, s, a) {
  const r = Ct(t.start).getTime(), n = Ct(t.end).getTime(), { bandStartMs: i, bandEndMs: o } = Ks(e, s, a), l = Math.max(r, i), d = Math.min(n, o);
  return l >= d ? null : { start: new Date(l), end: new Date(d) };
}
function Ct(t) {
  return t.length === 10 && !t.includes("T") ? /* @__PURE__ */ new Date(`${t}T00:00:00`) : new Date(t);
}
function qs(t) {
  return t.start.length === 10 && !t.start.includes("T");
}
function T(t) {
  const e = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return `${e}-${s}-${a}`;
}
function Ys(t) {
  if (t.length === 0) return [];
  const e = t.map((l, d) => ({ ...l, _idx: d }));
  e.sort((l, d) => l.start.getTime() - d.start.getTime());
  const s = [], a = new Array(t.length);
  for (const l of e) {
    const d = l.start.getTime();
    let u = s.findIndex((p) => p <= d);
    u === -1 ? (u = s.length, s.push(l.end.getTime())) : s[u] = l.end.getTime(), a[l._idx] = u;
  }
  const r = new Array(t.length), n = [];
  let i = 0, o = e[0].end.getTime();
  r[e[0]._idx] = 0, n.push(a[e[0]._idx]);
  for (let l = 1; l < e.length; l++) {
    const d = e[l];
    d.start.getTime() >= o ? (i++, n.push(0), o = d.end.getTime()) : o = Math.max(o, d.end.getTime()), r[d._idx] = i, n[i] = Math.max(n[i], a[d._idx]);
  }
  return a.map((l, d) => ({
    lane: l,
    laneCount: n[r[d]] + 1
  }));
}
function Pe(t, e) {
  const [s, a] = e.split(":").map(Number), r = new Date(t);
  return r.setHours(s, a, 0, 0), r.getTime();
}
function Xs(t, e, s, a) {
  const r = /* @__PURE__ */ new Map();
  for (const o of e)
    r.set(T(o), { allDay: [], inBand: [], earlier: [], later: [] });
  const n = e.length > 0 ? e[0] : null, i = e.length > 0 ? e[e.length - 1] : null;
  for (const o of t) {
    if (qs(o)) {
      const u = /* @__PURE__ */ new Date(o.start + "T00:00:00"), p = /* @__PURE__ */ new Date(o.end + "T00:00:00"), m = n !== null && u < n, g = i ? new Date(i) : null;
      g && g.setDate(g.getDate() + 1);
      const b = g !== null && p > g;
      for (const x of e) {
        const P = T(x), A = r.get(P);
        if (x >= u && x < p && (A.allDay.push(o), m || b)) {
          A.allDayClipped || (A.allDayClipped = /* @__PURE__ */ new Map());
          const Ee = n !== null && T(x) === T(n), De = i !== null && T(x) === T(i);
          A.allDayClipped.set(o.uid ?? o.summary, {
            left: m && Ee,
            right: b && De
          });
        }
      }
      continue;
    }
    const l = new Date(o.start), d = new Date(o.end);
    for (const u of e) {
      const p = T(u), m = r.get(p), g = new Date(u);
      g.setHours(0, 0, 0, 0);
      const b = new Date(u);
      if (b.setHours(23, 59, 59, 999), d <= g || l > b) continue;
      const x = Pe(u, s), P = Pe(u, a);
      if (d.getTime() <= x)
        m.earlier.push(o);
      else if (l.getTime() >= P)
        m.later.push(o);
      else {
        const A = Vs(o, u, s, a);
        if (A) {
          const Ee = P - x, De = (A.start.getTime() - x) / Ee * 100, Yt = (A.end.getTime() - A.start.getTime()) / Ee * 100;
          m.inBand.push({
            event: o,
            lane: 0,
            laneCount: 1,
            topPercent: Math.max(0, Math.min(100, De)),
            heightPercent: Math.max(0, Math.min(100 - De, Yt))
          });
        }
      }
    }
  }
  for (const o of e) {
    const l = T(o), d = r.get(l);
    if (d.inBand.length === 0) continue;
    const u = Pe(o, s), m = Pe(o, a) - u, g = d.inBand.map((x) => {
      const P = u + x.topPercent / 100 * m, A = P + x.heightPercent / 100 * m;
      return {
        event: x.event,
        start: new Date(P),
        end: new Date(A),
        lane: 0
      };
    }), b = Ys(g);
    d.inBand = d.inBand.map((x, P) => ({
      ...x,
      lane: b[P].lane,
      laneCount: b[P].laneCount
    }));
  }
  return { days: e, perDay: r };
}
function Gs(t, e) {
  const s = Math.min(e.minColWidth, e.maxColWidth), a = Math.max(e.minColWidth, e.maxColWidth), r = Math.min(e.minDays, e.maxDays), n = Math.max(e.minDays, e.maxDays), i = Math.max(0, t - e.timeColWidth);
  if (i <= 0)
    return { visibleCount: r, dayWidthPx: s };
  const o = Math.floor(i / s), l = Math.ceil(i / a), d = Math.min(n, Math.max(r, l, Math.min(o, n))), u = i / d;
  return { visibleCount: d, dayWidthPx: u };
}
function Ke(t, e) {
  const s = new Date(t);
  return s.setDate(s.getDate() + e), s;
}
function kt(t) {
  const e = new Date(t);
  return e.setHours(0, 0, 0, 0), e;
}
class Js {
  constructor(e, s) {
    this._isConnected = !1, this._hasHass = !1, this._dayOffset = 0, this._fetchSeq = 0, this._cachedEvents = /* @__PURE__ */ new Map(), this._cachedDayKeys = /* @__PURE__ */ new Set(), this._host = e, this._opts = s, this._fetcher = s.fetcher ?? Ut, this._pollIntervalMs = s.pollIntervalMs ?? 5 * 6e4, this._tickIntervalMs = s.tickIntervalMs ?? 6e4, this._panBound = s.panBoundDays ?? 90, this._visibleCount = s.visibleCount;
    const a = (s.now ?? (() => /* @__PURE__ */ new Date()))();
    this._anchorToday = kt(a), e.addController(this);
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
    const s = new Set(this._opts.calendars.map((n) => n.entity)), a = new Set(e.map((n) => n.entity)), r = s.size !== a.size || [...a].some((n) => !s.has(n));
    this._opts.calendars = e, r && this._hass && this._fetchRange(...this._computeRange());
  }
  setVisibleCount(e) {
    var a, r;
    const s = this._visibleCount;
    if (this._visibleCount = e, (r = (a = this._opts).onChange) == null || r.call(a), this._host.requestUpdate(), e !== s) {
      const [n, i] = this._computeRange();
      this._rangeIsCovered(n, i) || this._fetchRange(n, i);
    }
  }
  pan(e) {
    var o, l;
    const s = -this._panBound, a = this._panBound - this._visibleCount, r = Math.max(s, Math.min(a, this._dayOffset + e));
    this._dayOffset = r, (l = (o = this._opts).onChange) == null || l.call(o), this._host.requestUpdate();
    const [n, i] = this._computeRange();
    this._rangeIsCovered(n, i) || this._fetchRange(n, i);
  }
  goToToday() {
    var r, n;
    const e = this._dayOffset === 0;
    this._dayOffset = 0, e || (n = (r = this._opts).onChange) == null || n.call(r), this._host.requestUpdate();
    const [s, a] = this._computeRange();
    this._rangeIsCovered(s, a) || this._fetchRange(s, a);
  }
  tick() {
    var a, r;
    const e = (this._opts.now ?? (() => /* @__PURE__ */ new Date()))(), s = kt(e);
    s.getTime() !== this._anchorToday.getTime() && (this._anchorToday = s, this._dayOffset === 0 && ((r = (a = this._opts).onChange) == null || r.call(a), this._host.requestUpdate(), this._hass && this._fetchRange(...this._computeRange())));
  }
  async _poll() {
    this._hass && this._fetchRange(...this._computeRange());
  }
  // -------------------------------------------------------------------------
  // Getters
  // -------------------------------------------------------------------------
  get days() {
    return Array.from({ length: this._visibleCount }, (e, s) => {
      const a = Ke(this._anchorToday, this._dayOffset + s);
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
    const e = this._visibleCount, s = Ke(this._anchorToday, this._dayOffset - e);
    s.setHours(0, 0, 0, 0);
    const a = Ke(this._anchorToday, this._dayOffset + 2 * e);
    return a.setHours(0, 0, 0, 0), [s, a];
  }
  _rangeIsCovered(e, s) {
    return !this._cacheStart || !this._cacheEnd ? !1 : e >= this._cacheStart && s <= this._cacheEnd;
  }
  _fetchRange(e, s) {
    var n, i;
    if (!this._hass) return;
    const a = ++this._fetchSeq, r = this._opts.calendars.map((o) => o.entity);
    (i = (n = this._opts).onFetchStart) == null || i.call(n, { start: e, end: s }), this._fetcher(this._hass, r, e, s).then((o) => {
      var d, u;
      if (a !== this._fetchSeq) return;
      const l = /* @__PURE__ */ new Map();
      for (const [p, m] of o.entries())
        l.set(
          p,
          m.map((g) => ({ ...g, uid: `${p}::${g.uid ?? ""}` }))
        );
      this._cachedEvents = l, this._cachedDayKeys = /* @__PURE__ */ new Set();
      for (const p = new Date(e); p < s; p.setDate(p.getDate() + 1))
        this._cachedDayKeys.add(T(p));
      this._cacheStart = new Date(e), this._cacheEnd = new Date(s), (u = (d = this._opts).onFetchComplete) == null || u.call(d, l);
    }).catch((o) => {
      console.warn("[lucarne] RollingWindowController fetch failed:", o);
    });
  }
}
var Zs = Object.defineProperty, Qs = Object.getOwnPropertyDescriptor, et = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Qs(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Zs(e, s, r), r;
};
let _e = class extends v {
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
_e.styles = [
  E,
  _`
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
], _e.prototype, "calendars", 2);
et([
  h({ type: Object })
], _e.prototype, "visibleIds", 2);
_e = et([
  y("lucarne-visibility-pills")
], _e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ea = { ATTRIBUTE: 1 }, ta = (t) => (...e) => ({ _$litDirective$: t, values: e });
let sa = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, s, a) {
    this._$Ct = e, this._$AM = s, this._$Ci = a;
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
const Vt = "important", aa = " !" + Vt, ra = ta(class extends sa {
  constructor(t) {
    var e;
    if (super(t), t.type !== ea.ATTRIBUTE || t.name !== "style" || ((e = t.strings) == null ? void 0 : e.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return Object.keys(t).reduce((e, s) => {
      const a = t[s];
      return a == null ? e : e + `${s = s.includes("-") ? s : s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${a};`;
    }, "");
  }
  update(t, [e]) {
    const { style: s } = t.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(e)), this.render(e);
    for (const a of this.ft) e[a] == null && (this.ft.delete(a), a.includes("-") ? s.removeProperty(a) : s[a] = null);
    for (const a in e) {
      const r = e[a];
      if (r != null) {
        this.ft.add(a);
        const n = typeof r == "string" && r.endsWith(aa);
        a.includes("-") || n ? s.setProperty(a, n ? r.slice(0, -11) : r, n ? Vt : "") : s[a] = r;
      }
    }
    return V;
  }
});
var na = Object.defineProperty, ia = Object.getOwnPropertyDescriptor, J = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ia(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && na(e, s, r), r;
};
function Et(t) {
  return t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
}
let z = class extends v {
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
    const t = new Date(this.event.start), e = new Date(this.event.end), s = `${Et(t)}–${Et(e)}`, a = this.event.pending ? "0.5" : "1";
    return c`
      <div @click=${this._handleClick} style="height:100%;width:100%;overflow:hidden;opacity:${a}">
        <div class="event-summary">${this.event.summary}</div>
        <div class="event-time">${s}</div>
      </div>
    `;
  }
};
z.styles = [
  E,
  _`
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
], z.prototype, "event", 2);
J([
  h({ type: String })
], z.prototype, "color", 2);
J([
  h({ type: Number })
], z.prototype, "lane", 2);
J([
  h({ type: Number })
], z.prototype, "laneCount", 2);
J([
  h({ type: Number })
], z.prototype, "topPercent", 2);
J([
  h({ type: Number })
], z.prototype, "heightPercent", 2);
z = J([
  y("lucarne-calendar-event-block")
], z);
var oa = Object.defineProperty, la = Object.getOwnPropertyDescriptor, $e = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? la(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && oa(e, s, r), r;
};
let q = class extends v {
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
      const a = t.getBoundingClientRect();
      e = a.bottom + 4, s = a.left;
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
      (a) => c`
                  <div class="mini-event" @click=${(r) => this._tapEvent(r, a)}>
                    <span class="mini-event-summary">${a.summary}</span>
                    <span class="mini-event-time">${this._formatTime(a.start)}</span>
                  </div>
                `
    )}
            </div>
          ` : ""}
    `;
  }
};
q.styles = [
  E,
  _`
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
$e([
  h({ type: Array })
], q.prototype, "events", 2);
$e([
  h({ type: String })
], q.prototype, "label", 2);
$e([
  h({ type: Object })
], q.prototype, "eventColors", 2);
$e([
  f()
], q.prototype, "_open", 2);
q = $e([
  y("lucarne-out-of-band-stub")
], q);
var ca = Object.defineProperty, da = Object.getOwnPropertyDescriptor, Re = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? da(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && ca(e, s, r), r;
};
function ha(t) {
  return 20 + (t * 37 + 11) % 30;
}
function ua(t) {
  return 10 + (t * 53 + 7) % 60;
}
let ae = class extends v {
  constructor() {
    super(...arguments), this.bandStart = "07:00", this.bandEnd = "21:00", this.hourHeightPx = 60;
  }
  render() {
    const [t] = this.bandStart.split(":").map(Number), [e] = this.bandEnd.split(":").map(Number), a = Math.max(1, e - t) * this.hourHeightPx;
    return c`
      <!-- Fake event blocks in time grid -->
      ${[0, 1].map((r) => {
      const i = ua(r) / 100 * a, o = ha(r);
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
ae.styles = [
  E,
  _`
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
Re([
  h({ type: String })
], ae.prototype, "bandStart", 2);
Re([
  h({ type: String })
], ae.prototype, "bandEnd", 2);
Re([
  h({ type: Number })
], ae.prototype, "hourHeightPx", 2);
ae = Re([
  y("lucarne-skeleton-day-column")
], ae);
var pa = Object.defineProperty, ga = Object.getOwnPropertyDescriptor, I = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ga(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && pa(e, s, r), r;
};
function Dt(t, e) {
  return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
}
let M = class extends v {
  constructor() {
    super(...arguments), this.layout = null, this.bandStart = "07:00", this.bandEnd = "21:00", this.calendars = [], this.hourHeightPx = 60, this.showCreateButton = !1, this.dayWidthPx = 0, this.cachedDayKeys = /* @__PURE__ */ new Set();
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
      const a = t.uid.split("::")[0];
      return e.get(a) ?? "#a8d8b9";
    }
    return "#a8d8b9";
  }
  _onBandClick(t, e) {
    if (!this.showCreateButton) return;
    const a = t.currentTarget.getBoundingClientRect(), [r] = this.bandStart.split(":").map(Number), [n] = this.bandEnd.split(":").map(Number), i = n - r, o = Math.max(0, Math.min(1, (t.clientY - a.top) / a.height)), l = r + o * i, d = Math.min(n - 1, Math.round(l * 2) / 2);
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
    const s = T(t), a = this.layout.perDay.get(s);
    if (!a) return c``;
    const r = xt(this.bandStart, this.bandEnd), i = (r.length - 1) * this.hourHeightPx, o = Dt(t, e), [l] = this.bandStart.split(":").map(Number), [d] = this.bandEnd.split(":").map(Number), u = (d - l) * 36e5;
    let p = null;
    if (o) {
      const g = new Date(t);
      g.setHours(l, 0, 0, 0);
      const b = new Date(t);
      b.setHours(d, 0, 0, 0), e >= g && e <= b && (p = (e.getTime() - g.getTime()) / u * 100);
    }
    const m = this._buildEventColorMap([...a.inBand.map((g) => g.event), ...a.earlier, ...a.later]);
    return c`
      <div class="day-col-wrapper">
        ${a.earlier.length > 0 ? c`
              <div class="stub-area-top">
                <lucarne-out-of-band-stub
                  .events=${a.earlier}
                  label="earlier"
                  .eventColors=${m}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}

        <div
          class="day-col"
          style="height:${i}px${this.showCreateButton ? "; cursor: crosshair" : ""}"
          @click=${(g) => this._onBandClick(g, t)}
        >
          ${r.slice(0, -1).map(
      (g, b) => c`
              <div
                class="hour-line"
                style="top: ${(b + 1) / (r.length - 1) * 100}%"
              ></div>
            `
    )}

          ${p !== null ? c`<div class="now-line" style="top:${p}%"></div>` : ""}

          ${a.inBand.map((g) => {
      const b = 100 / g.laneCount, x = g.lane / g.laneCount * 100, P = this._eventColor(g.event);
      return c`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${g.topPercent}%;
                  left: calc(${x}% + 1px);
                  width: calc(${b}% - 2px);
                  height: ${g.heightPercent}%;
                  z-index: ${g.lane + 1};
                  background: ${P}cc;
                  border-left-color: ${P};
                "
                .event=${g.event}
                .color=${P}
                .lane=${g.lane}
                .laneCount=${g.laneCount}
                .topPercent=${g.topPercent}
                .heightPercent=${g.heightPercent}
              ></lucarne-calendar-event-block>
            `;
    })}
        </div>

        ${a.later.length > 0 ? c`
              <div class="stub-area-bottom">
                <lucarne-out-of-band-stub
                  .events=${a.later}
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
    const t = /* @__PURE__ */ new Date(), e = xt(this.bandStart, this.bandEnd), a = (e.length - 1) * this.hourHeightPx, r = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    return c`
      <div class="grid-wrapper" style=${ra({ "--lucarne-day-count": String(this.layout.days.length) })}>
        <!-- Time-column gutter cells (col 1): stay fixed during pan -->
        <div class="header-spacer" style="grid-row:1; grid-column:1"></div>
        <div class="allday-spacer" style="grid-row:2; grid-column:1">all-day</div>
        <div class="time-col" style="height:${a}px; grid-row:3; grid-column:1">
          ${e.map(
      (n, i) => c`
              <div
                class="hour-label"
                style="top: ${i / (e.length - 1) * 100}%"
              >
                ${n === 0 || n === 24 ? "12 AM" : n < 12 ? `${n} AM` : n === 12 ? "12 PM" : `${n - 12} PM`}
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
      (n, i) => c`
              <div
                class="day-header ${Dt(n, t) ? "today" : ""}"
                style="grid-column: ${i + 1}"
              >
                <div>${r.format(n)}</div>
                <div class="day-num">${n.getDate()}</div>
              </div>
            `
    )}
        </div>

        <!-- Row 2: all-day event track -->
        <div class="day-cols-track" style="grid-row:2">
          ${this.layout.days.map((n, i) => {
      const o = T(n), l = this.cachedDayKeys.has(o), d = this.layout.perDay.get(o);
      return c`
              <div class="allday-cell" style="grid-column: ${i + 1}">
                ${l ? ((d == null ? void 0 : d.allDay) ?? []).map(
        (u) => {
          var m;
          const p = (m = d == null ? void 0 : d.allDayClipped) == null ? void 0 : m.get(u.uid ?? u.summary);
          return c`
                        <div
                          class="allday-event"
                          style="background: ${this._eventColor(u)}cc"
                          @click=${(g) => {
            g.stopPropagation(), this.dispatchEvent(
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
          ${this.layout.days.map((n, i) => {
      const o = T(n), l = this.cachedDayKeys.has(o);
      return c`
              <div style="grid-column:${i + 1}; position:relative; overflow:visible; display:flex; flex-direction:column;">
                ${l ? this._renderDayColumn(n, t) : c`<lucarne-skeleton-day-column
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
M.styles = [
  E,
  _`
      :host {
        display: block;
        position: relative;
      }
      .grid-wrapper {
        display: grid;
        grid-template-columns: 40px 1fr;
        grid-template-rows: auto auto 1fr;
      }
      /*
       * Three .day-cols-track elements — one per outer grid row — so that each
       * outer auto-row is sized by its day-column content (headers, allday cells,
       * time-band cols). All three receive the same translateX during pan.
       * Using a single spanning element would decouple the inner sub-grid row
       * sizing from the outer grid rows and cause the time-column gutter labels
       * to misalign with the day content (no CSS subgrid on Safari < 16).
       */
      .day-cols-track {
        grid-column: 2;
        display: grid;
        grid-template-columns: repeat(var(--lucarne-day-count, 7), minmax(0, 1fr));
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
I([
  h({ type: Object })
], M.prototype, "layout", 2);
I([
  h({ type: String })
], M.prototype, "bandStart", 2);
I([
  h({ type: String })
], M.prototype, "bandEnd", 2);
I([
  h({ type: Array })
], M.prototype, "calendars", 2);
I([
  h({ type: Number })
], M.prototype, "hourHeightPx", 2);
I([
  h({ type: Boolean })
], M.prototype, "showCreateButton", 2);
I([
  h({ type: Number })
], M.prototype, "dayWidthPx", 2);
I([
  h({ attribute: !1 })
], M.prototype, "cachedDayKeys", 2);
M = I([
  y("lucarne-calendar-grid")
], M);
const fa = 500;
function ma(t, e, s) {
  return e <= 0 ? 0 : Math.abs(s) >= fa ? s > 0 ? Math.ceil(t / e) : Math.floor(t / e) : Math.round(t / e);
}
function St(t, e) {
  if (Math.abs(t) <= e) return t;
  const s = Math.abs(t) - e;
  return Math.sign(t) * (e + s * 0.33);
}
var va = Object.defineProperty, _a = Object.getOwnPropertyDescriptor, xe = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? _a(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && va(e, s, r), r;
};
let Y = class extends v {
  constructor() {
    super(...arguments), this.dayWidthPx = 0, this.canPanBack = !0, this.canPanForward = !0, this._startX = 0, this._startY = 0, this._startTime = 0, this._isDragging = !1, this._cachedTargets = [];
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
    return t > 0 && !this.canPanBack || t < 0 && !this.canPanForward ? St(t, 0) : t;
  }
  _setTranslate(t) {
    for (const e of this._cachedTargets)
      e.style.transition = "", e.style.transform = `translateX(${t}px)`;
  }
  _cancelPendingSnap() {
    this._pendingTransitionEnd && this._pendingSnapTarget && this._pendingSnapTarget.removeEventListener("transitionend", this._pendingTransitionEnd), this._pendingTransitionEnd = void 0, this._pendingSnapTarget = void 0;
  }
  _snapAndCommit(t) {
    const e = this._cachedTargets;
    if (e.length === 0) {
      t !== 0 && this._dispatchPanSnap(t);
      return;
    }
    if (this._cancelPendingSnap(), window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const l of e)
        l.style.transition = "", l.style.transform = "translateX(0px)";
      t !== 0 && this._dispatchPanSnap(t);
      return;
    }
    const a = getComputedStyle(this).getPropertyValue("--lucarne-pan-duration").trim() || "240ms", r = getComputedStyle(this).getPropertyValue("--lucarne-pan-easing").trim() || "cubic-bezier(0.32, 0.72, 0, 1)", n = `transform ${a} ${r}`, i = t * this.dayWidthPx;
    for (const l of e)
      l.style.transition = n, l.style.transform = `translateX(${i}px)`;
    const o = () => {
      this._pendingTransitionEnd = void 0, e[0].removeEventListener("transitionend", o);
      for (const l of e)
        l.style.transition = "", l.style.transform = "translateX(0px)";
      e[0].offsetWidth, t !== 0 && this._dispatchPanSnap(t);
    };
    this._pendingSnapTarget = e[0], this._pendingTransitionEnd = o, e[0].addEventListener("transitionend", o, { once: !0 });
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
    const a = this._applyRubberBand(e);
    this._setTranslate(a);
  }
  _onPointerUp(t) {
    if (t.pointerId === this._pointerId) {
      try {
        t.currentTarget.releasePointerCapture(t.pointerId);
      } catch {
      }
      if (this._isDragging) {
        const e = t.clientX - this._startX, s = performance.now() - this._startTime, a = s > 0 ? e / s * 1e3 : 0, r = this._applyRubberBand(e), n = ma(r, this.dayWidthPx, a);
        this._snapAndCommit(n);
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
Y.styles = _`
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
xe([
  h({ type: Number })
], Y.prototype, "dayWidthPx", 2);
xe([
  h({ type: Boolean })
], Y.prototype, "canPanBack", 2);
xe([
  h({ type: Boolean })
], Y.prototype, "canPanForward", 2);
xe([
  Nt("slot")
], Y.prototype, "_slot", 2);
Y = xe([
  y("lucarne-calendar-day-pan")
], Y);
var ya = Object.defineProperty, ba = Object.getOwnPropertyDescriptor, H = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ba(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && ya(e, s, r), r;
};
function wa(t) {
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
      await vs(this.hass, this.entityId, t);
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
    var i;
    if (!this.event) return c``;
    const t = this.event, s = t.start.length === 10 && !t.start.includes("T") ? "All day" : `${wa(t.start)} – ${new Date(t.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 })}`, a = (i = t.uid) != null && i.includes("::") ? t.uid.split("::").slice(1).join("::") : t.uid, r = a && a.length > 0 ? `https://calendar.google.com/calendar/u/0/r/eventedit/${encodeURIComponent(a)}` : null, n = !!this.entityId && !!t.uid && this.hass != null && ys(this.hass, this.entityId) && !this._isRecurring(t);
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

        ${r ? c`
              <a class="ext-link" href="${r}" target="_blank" rel="noopener noreferrer">
                Open in Google Calendar ↗
              </a>
            ` : ""}

        ${this._deleteError ? c`<div class="error-msg">${this._deleteError}</div>` : ""}

        ${n ? c`
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
  _`
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
  f()
], O.prototype, "_confirmingDelete", 2);
H([
  f()
], O.prototype, "_deleting", 2);
H([
  f()
], O.prototype, "_deleteError", 2);
O = H([
  y("lucarne-calendar-event-popover")
], O);
var $a = Object.defineProperty, xa = Object.getOwnPropertyDescriptor, D = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? xa(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && $a(e, s, r), r;
};
function Pt(t, e) {
  const a = -(/* @__PURE__ */ new Date(`${t}T${e}:00`)).getTimezoneOffset(), r = a >= 0 ? "+" : "-", n = Math.floor(Math.abs(a) / 60).toString().padStart(2, "0"), i = (Math.abs(a) % 60).toString().padStart(2, "0");
  return `${t}T${e}:00${r}${n}:${i}`;
}
function Tt(t) {
  return `${Math.floor(t).toString().padStart(2, "0")}:${t % 1 === 0.5 ? "30" : "00"}`;
}
function At(t) {
  const e = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return `${e}-${s}-${a}`;
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
    this._date = At(t), this._startTime = Tt(Math.max(0, Math.min(23, this.startHour)));
    const e = Math.min(24, this.startHour + 1);
    this._endTime = Tt(e < 24 ? e : 23.5), this._calendarEntityId = ((s = this.calendars[0]) == null ? void 0 : s.entity) ?? "", this._title = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
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
      const a = /* @__PURE__ */ new Date(`${this._date}T00:00:00`);
      a.setDate(a.getDate() + 1);
      const r = At(a);
      t.end_date = r, e = this._date, s = r;
    } else {
      const a = Pt(this._date, this._startTime), r = Pt(this._date, this._endTime);
      t.start_date_time = a, t.end_date_time = r, e = a, s = r;
    }
    try {
      await this.hass.callService("calendar", "create_event", t, {
        entity_id: this._calendarEntityId
      });
    } catch (a) {
      this._error = a instanceof Error ? a.message : "Failed to create event", this._saving = !1;
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
  _`
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
        width: 18px;
        height: 18px;
        min-height: unset;
        cursor: pointer;
        accent-color: var(--primary-color, #03a9f4);
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
  f()
], C.prototype, "_title", 2);
D([
  f()
], C.prototype, "_calendarEntityId", 2);
D([
  f()
], C.prototype, "_date", 2);
D([
  f()
], C.prototype, "_startTime", 2);
D([
  f()
], C.prototype, "_endTime", 2);
D([
  f()
], C.prototype, "_allDay", 2);
D([
  f()
], C.prototype, "_description", 2);
D([
  f()
], C.prototype, "_location", 2);
D([
  f()
], C.prototype, "_error", 2);
D([
  f()
], C.prototype, "_saving", 2);
C = D([
  y("lucarne-create-event-popover")
], C);
var Ca = Object.defineProperty, ka = Object.getOwnPropertyDescriptor, S = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ka(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ca(e, s, r), r;
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
    for (const a of t.calendars)
      if (!a.entity || !a.color)
        throw new Error('lucarne-calendar-card: each calendar requires "entity" and "color"');
    let e = t;
    if (t.visible_hours) {
      const a = /^\d{1,2}:\d{2}$/;
      if (!a.test(t.visible_hours.start) || !a.test(t.visible_hours.end))
        throw new Error('lucarne-calendar-card: "visible_hours" start and end must be in HH:MM format');
      const r = parseInt(t.visible_hours.start.split(":")[0], 10), n = parseInt(t.visible_hours.end.split(":")[0], 10);
      if (r < 0 || n > 24 || r >= n)
        throw new Error('lucarne-calendar-card: "visible_hours" must satisfy 0 <= start < end <= 24');
      e = {
        ...t,
        visible_hours: {
          start: `${String(r).padStart(2, "0")}:00`,
          end: `${String(n).padStart(2, "0")}:00`
        }
      };
    }
    const s = this._config;
    if (this._config = e, this._visibleIds = new Set(t.calendars.map((a) => a.entity)), this.hass && this._updateCreatableCalendars(), this._rolling)
      this._rolling.updateCalendars(e.calendars), ((s == null ? void 0 : s.min_days) !== t.min_days || (s == null ? void 0 : s.max_days) !== t.max_days || (s == null ? void 0 : s.min_col_width) !== t.min_col_width || (s == null ? void 0 : s.max_col_width) !== t.max_col_width) && this._onResize();
    else {
      const a = this._effectiveConfig();
      this._lastVisibleCount = a.minDays, this._rolling = new Js(this, {
        calendars: e.calendars,
        visibleCount: a.minDays,
        onFetchComplete: () => {
          this._pendingEvents = [], this._deletedUids = /* @__PURE__ */ new Set(), this._recompute();
        },
        onChange: () => this._recompute()
      });
    }
  }
  static getStubConfig(t) {
    const e = Object.keys(t.states).filter((r) => r.startsWith("calendar.")).slice(0, 3), s = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], a = e.map((r, n) => ({
      entity: r,
      color: s[n] ?? "#a8d8b9"
    }));
    return {
      type: "custom:lucarne-calendar-card",
      title: "Calendar",
      calendars: a.length ? a : [{ entity: "calendar.example", color: "#a8d8b9" }],
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
      this._previewOverride = Bt(this);
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
      var a;
      this._resizeFrame = void 0;
      const t = ((a = this._gridAreaEl) == null ? void 0 : a.getBoundingClientRect().width) ?? 0, { visibleCount: e, dayWidthPx: s } = Gs(t, this._effectiveConfig());
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
    const e = this._deletedUids.size > 0 ? t.filter((o) => !o.uid || !this._deletedUids.has(o.uid)) : t, s = ((n = this._config.visible_hours) == null ? void 0 : n.start) ?? "07:00", a = ((i = this._config.visible_hours) == null ? void 0 : i.end) ?? "21:00", r = this._rolling.days;
    this._layout = Xs(e, r, s, a);
  }
  _supportsCreate(t) {
    var s, a, r;
    const e = (r = (a = (s = this.hass) == null ? void 0 : s.states[t]) == null ? void 0 : a.attributes) == null ? void 0 : r.supported_features;
    return e !== void 0 && (e & 1) !== 0;
  }
  _updateCreatableCalendars() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.filter((s) => this._supportsCreate(s.entity));
    t.length === this._creatableCalendars.length && t.every((s, a) => {
      var r;
      return s.entity === ((r = this._creatableCalendars[a]) == null ? void 0 : r.entity);
    }) || (this._creatableCalendars = t);
  }
  _onVisibilityChange(t) {
    this._visibleIds = t.detail, this._recompute();
  }
  _onEventTap(t) {
    var a, r;
    const { event: e, color: s } = t.detail;
    if (this._openEvent = e, this._openEventColor = s, (a = e.uid) != null && a.includes("::")) {
      const n = e.uid.split("::")[0];
      this._openEventEntityId = n;
      const i = (r = this._config) == null ? void 0 : r.calendars.find((o) => o.entity === n);
      this._openEventCalLabel = i ? Kt(i, this.hass) : "";
    } else
      this._openEventEntityId = "", this._openEventCalLabel = "";
  }
  _onEventDeleted(t) {
    this._deletedUids = /* @__PURE__ */ new Set([...this._deletedUids, t.detail.uid]), this._openEvent = null, this._openEventEntityId = "", this._recompute();
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
    const e = t[0], s = t[t.length - 1], a = (i, o) => i.toLocaleDateString("en-US", o), r = e.getMonth() === s.getMonth() && e.getFullYear() === s.getFullYear(), n = e.getFullYear() === s.getFullYear();
    return r ? `${a(e, { month: "short", day: "numeric" })} – ${a(s, { day: "numeric" })}` : n ? `${a(e, { month: "short", day: "numeric" })} – ${a(s, { month: "short", day: "numeric" })}` : `${a(e, { month: "short", day: "numeric", year: "numeric" })} – ${a(s, { month: "short", day: "numeric", year: "numeric" })}`;
  }
  render() {
    var r, n;
    if (!this._config) return c``;
    const t = ((r = this._config.visible_hours) == null ? void 0 : r.start) ?? "07:00", e = ((n = this._config.visible_hours) == null ? void 0 : n.end) ?? "21:00", s = $t(this._config.calendars, this.hass), a = $t(this._creatableCalendars, this.hass);
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
                .calendars=${a}
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
  _`
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
  Nt(".grid-area")
], k.prototype, "_gridAreaEl", 2);
S([
  f()
], k.prototype, "_config", 2);
S([
  f()
], k.prototype, "_layout", 2);
S([
  f()
], k.prototype, "_visibleIds", 2);
S([
  f()
], k.prototype, "_openEvent", 2);
S([
  f()
], k.prototype, "_openEventColor", 2);
S([
  f()
], k.prototype, "_openEventCalLabel", 2);
S([
  f()
], k.prototype, "_openEventEntityId", 2);
S([
  f()
], k.prototype, "_createDay", 2);
S([
  f()
], k.prototype, "_createStartHour", 2);
S([
  f()
], k.prototype, "_creatableCalendars", 2);
S([
  f()
], k.prototype, "_dayWidthPx", 2);
S([
  f()
], k.prototype, "_deletedUids", 2);
k = S([
  y("lucarne-calendar-card")
], k);
var Ea = Object.defineProperty, Da = Object.getOwnPropertyDescriptor, Ce = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Da(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ea(e, s, r), r;
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
    var a, r;
    const s = [...((a = this._config) == null ? void 0 : a.calendars) ?? []];
    s[t] = { ...s[t], entity: ((r = e.detail) == null ? void 0 : r.value) ?? "" }, this._fire({ ...this._config, calendars: s });
  }
  _calColorChanged(t, e) {
    var a;
    const s = [...((a = this._config) == null ? void 0 : a.calendars) ?? []];
    s[t] = { ...s[t], color: e.target.value }, this._fire({ ...this._config, calendars: s });
  }
  _removeCalendar(t) {
    var s;
    const e = [...((s = this._config) == null ? void 0 : s.calendars) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, calendars: e }));
  }
  _windowFieldChanged(t, e) {
    const s = e.target.value, a = s === "" ? void 0 : Number(s), r = { ...this._config, [t]: a }, n = r.min_days ?? 3, i = r.max_days ?? 7, o = r.min_col_width ?? 140, l = r.max_col_width ?? 220;
    this._invalid = {
      days: n > i,
      cols: o > l
    }, this._fire(r);
  }
  _addCalendar() {
    var a, r;
    const e = Object.keys(((a = this.hass) == null ? void 0 : a.states) ?? {}).find((n) => n.startsWith("calendar.")) ?? "calendar.example", s = [
      ...((r = this._config) == null ? void 0 : r.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: s });
  }
  render() {
    var l, d;
    if (!this._config) return c``;
    if (!this._haReady) return c`<div class="loading">Loading editor…</div>`;
    const t = this._config.calendars ?? [], e = ((l = this._config.visible_hours) == null ? void 0 : l.start) ?? "07:00", s = ((d = this._config.visible_hours) == null ? void 0 : d.end) ?? "21:00", a = this._config.show_create_button ?? !0, r = this._config.min_days, n = this._config.max_days, i = this._config.min_col_width, o = this._config.max_col_width;
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
          .checked=${a}
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
            .value=${r !== void 0 ? String(r) : ""}
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
            .value=${n !== void 0 ? String(n) : ""}
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
X.styles = [E, Wt];
Ce([
  h({ attribute: !1 })
], X.prototype, "hass", 2);
Ce([
  f()
], X.prototype, "_config", 2);
Ce([
  f()
], X.prototype, "_haReady", 2);
Ce([
  f()
], X.prototype, "_invalid", 2);
X = Ce([
  y("lucarne-calendar-card-editor")
], X);
function Mt(t) {
  return t.length === 0 ? !1 : t.every((e) => e.state === "on");
}
var Sa = Object.defineProperty, Pa = Object.getOwnPropertyDescriptor, Le = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Pa(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Sa(e, s, r), r;
};
let re = class extends v {
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
re.styles = _`
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
Le([
  h()
], re.prototype, "name", 2);
Le([
  h()
], re.prototype, "color", 2);
Le([
  h({ attribute: "avatar-url" })
], re.prototype, "avatarUrl", 2);
re = Le([
  y("lucarne-kid-avatar")
], re);
var Ta = Object.defineProperty, Aa = Object.getOwnPropertyDescriptor, ke = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Aa(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ta(e, s, r), r;
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
G.styles = _`
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
  y("lucarne-chore-row")
], G);
var Ma = Object.defineProperty, Oa = Object.getOwnPropertyDescriptor, qt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Oa(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ma(e, s, r), r;
};
let ze = class extends v {
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
ze.styles = _`
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
qt([
  h({ type: Number })
], ze.prototype, "streak", 2);
ze = qt([
  y("lucarne-streak-display")
], ze);
var za = Object.defineProperty, Ia = Object.getOwnPropertyDescriptor, tt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ia(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && za(e, s, r), r;
};
let ye = class extends v {
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
ye.styles = _`
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
], ye.prototype, "kidSlug", 2);
tt([
  h({ type: Boolean })
], ye.prototype, "active", 2);
ye = tt([
  y("lucarne-celebration-overlay")
], ye);
var Ha = Object.defineProperty, ja = Object.getOwnPropertyDescriptor, oe = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ja(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ha(e, s, r), r;
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
      var a, r;
      const s = ((r = (a = this.hass) == null ? void 0 : a.states[e.entity]) == null ? void 0 : r.state) ?? "unavailable";
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
N.styles = _`
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
oe([
  h({ attribute: !1 })
], N.prototype, "hass", 2);
oe([
  h({ attribute: !1 })
], N.prototype, "kid", 2);
oe([
  h({ type: Number })
], N.prototype, "streak", 2);
oe([
  h({ type: Boolean })
], N.prototype, "celebrating", 2);
oe([
  h({ type: Boolean, attribute: "all-done" })
], N.prototype, "allDone", 2);
N = oe([
  y("lucarne-kid-column")
], N);
var Ra = Object.defineProperty, La = Object.getOwnPropertyDescriptor, st = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? La(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ra(e, s, r), r;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-chores-card",
  name: "Lucarne Chores",
  description: "Kid chore grid with streaks and celebration",
  preview: !0
});
let be = class extends v {
  constructor() {
    super(...arguments), this._lastAllDoneByKid = /* @__PURE__ */ new Map(), this._celebratingKids = /* @__PURE__ */ new Set(), this._celebrationTimers = /* @__PURE__ */ new Map();
  }
  setConfig(t) {
    if (!t.kids || t.kids.length === 0)
      throw new Error("lucarne-chores-card: kids must be a non-empty array");
    for (const a of t.kids)
      if (!a.chores || a.chores.length === 0)
        throw new Error(`lucarne-chores-card: kid "${a.name}" must have at least 1 chore`);
    const e = t.kids.map((a) => a.name.toLowerCase().replace(/\s+/g, "_"));
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
        const s = e.name.toLowerCase().replace(/\s+/g, "_"), a = e.chores.map((i) => {
          var o;
          return {
            state: ((o = this.hass.states[i.entity]) == null ? void 0 : o.state) ?? "unavailable"
          };
        }), r = Mt(a), n = this._lastAllDoneByKid.get(s) ?? null;
        if (n === null) {
          this._lastAllDoneByKid.set(s, r);
          continue;
        }
        n === !1 && r === !0 ? (this._lastAllDoneByKid.set(s, !0), this._triggerCelebration(s, e)) : n === !0 && r === !1 && this._lastAllDoneByKid.set(s, !1);
      }
  }
  _triggerCelebration(t, e) {
    var l;
    this._celebratingKids = new Set(this._celebratingKids).add(t), this.requestUpdate();
    const s = this._celebrationTimers.get(t);
    s && clearTimeout(s);
    const a = setTimeout(() => {
      this._celebratingKids = new Set(
        [...this._celebratingKids].filter((d) => d !== t)
      ), this._celebrationTimers.delete(t), this.requestUpdate();
    }, 2200);
    this._celebrationTimers.set(t, a);
    const r = (l = this.hass) == null ? void 0 : l.states[e.streak], n = r ? parseInt(r.state, 10) : 0, i = /* @__PURE__ */ new Date(), o = `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}-${String(i.getDate()).padStart(2, "0")}`;
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
      const a = s.name.toLowerCase().replace(/\s+/g, "_"), r = (l = this.hass) == null ? void 0 : l.states[s.streak], n = r ? parseInt(r.state, 10) : 0, i = s.chores.map((d) => {
        var u, p;
        return {
          state: ((p = (u = this.hass) == null ? void 0 : u.states[d.entity]) == null ? void 0 : p.state) ?? "unavailable"
        };
      }), o = Mt(i);
      return c`
              <div class="kid-cell">
                <lucarne-kid-column
                  .hass=${this.hass}
                  .kid=${s}
                  .streak=${isNaN(n) ? 0 : n}
                  ?celebrating=${this._celebratingKids.has(a)}
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
be.styles = [
  E,
  _`
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
], be.prototype, "hass", 2);
st([
  f()
], be.prototype, "_config", 2);
be = st([
  y("lucarne-chores-card")
], be);
var Na = Object.defineProperty, Ua = Object.getOwnPropertyDescriptor, Ne = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ua(e, s) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Na(e, s, r), r;
};
let ne = class extends v {
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
    var r;
    const a = [...((r = this._config) == null ? void 0 : r.kids) ?? []];
    a[t] = { ...a[t], [e]: s.target.value }, this._fire({ ...this._config, kids: a });
  }
  _kidColorChanged(t, e) {
    var a;
    const s = [...((a = this._config) == null ? void 0 : a.kids) ?? []];
    s[t] = { ...s[t], color: e.target.value }, this._fire({ ...this._config, kids: s });
  }
  _kidStreakChanged(t, e) {
    var a, r;
    const s = [...((a = this._config) == null ? void 0 : a.kids) ?? []];
    s[t] = { ...s[t], streak: ((r = e.detail) == null ? void 0 : r.value) ?? "" }, this._fire({ ...this._config, kids: s });
  }
  _choreNameChanged(t, e, s) {
    var n;
    const a = [...((n = this._config) == null ? void 0 : n.kids) ?? []], r = [...a[t].chores];
    r[e] = { ...r[e], name: s.target.value }, a[t] = { ...a[t], chores: r }, this._fire({ ...this._config, kids: a });
  }
  _choreEntityChanged(t, e, s) {
    var n, i;
    const a = [...((n = this._config) == null ? void 0 : n.kids) ?? []], r = [...a[t].chores];
    r[e] = { ...r[e], entity: ((i = s.detail) == null ? void 0 : i.value) ?? "" }, a[t] = { ...a[t], chores: r }, this._fire({ ...this._config, kids: a });
  }
  _removeChore(t, e) {
    var r;
    const s = [...((r = this._config) == null ? void 0 : r.kids) ?? []], a = [...s[t].chores];
    a.length <= 1 || (a.splice(e, 1), s[t] = { ...s[t], chores: a }, this._fire({ ...this._config, kids: s }));
  }
  _addChore(t) {
    var a;
    const e = [...((a = this._config) == null ? void 0 : a.kids) ?? []], s = [...e[t].chores, { name: "New chore", entity: "" }];
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
    let a = t.length + 1;
    for (; e.has(`kid_${a}`); ) a++;
    const r = [
      ...t,
      {
        name: `Kid ${a}`,
        color: s[(a - 1) % s.length],
        streak: `counter.kid_${a}_streak`,
        chores: [{ name: "Chore 1", entity: "" }]
      }
    ];
    this._fire({ ...this._config, kids: r });
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
                  @change=${(a) => this._kidFieldChanged(s, "name", a)}
                ></ha-textfield>
                <ha-textfield
                  label="Avatar URL (optional)"
                  .value=${e.avatar ?? ""}
                  @change=${(a) => this._kidFieldChanged(s, "avatar", a)}
                ></ha-textfield>
              </div>
              <button type="button" class="remove" @click=${() => this._removeKid(s)} title="Remove kid">✕</button>
            </div>

            <div class="color-row">
              <input
                type="color"
                class="color-swatch"
                .value=${e.color}
                @input=${(a) => this._kidColorChanged(s, a)}
                title="Kid color"
              />
              <ha-entity-picker
                label="Streak counter"
                .hass=${this.hass}
                .value=${e.streak}
                .includeDomains=${["counter"]}
                allow-custom-entity
                @value-changed=${(a) => this._kidStreakChanged(s, a)}
              ></ha-entity-picker>
            </div>

            <div class="chore-label">Chores</div>
            ${e.chores.map(
        (a, r) => c`
                <div class="chore-row">
                  <ha-textfield
                    label="Chore name"
                    .value=${a.name}
                    @change=${(n) => this._choreNameChanged(s, r, n)}
                  ></ha-textfield>
                  <ha-entity-picker
                    label="Entity"
                    .hass=${this.hass}
                    .value=${a.entity}
                    .includeDomains=${["input_boolean"]}
                    allow-custom-entity
                    @value-changed=${(n) => this._choreEntityChanged(s, r, n)}
                  ></ha-entity-picker>
                  <button type="button" class="remove" @click=${() => this._removeChore(s, r)} title="Remove">✕</button>
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
  _`
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
], ne.prototype, "hass", 2);
Ne([
  f()
], ne.prototype, "_config", 2);
Ne([
  f()
], ne.prototype, "_haReady", 2);
ne = Ne([
  y("lucarne-chores-card-editor")
], ne);
//# sourceMappingURL=ha-lucarne.js.map
