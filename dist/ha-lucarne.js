/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $e = globalThis, Ne = $e.ShadowRoot && ($e.ShadyCSS === void 0 || $e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ie = Symbol(), Je = /* @__PURE__ */ new WeakMap();
let Et = class {
  constructor(e, r, a) {
    if (this._$cssResult$ = !0, a !== Ie) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = r;
  }
  get styleSheet() {
    let e = this.o;
    const r = this.t;
    if (Ne && e === void 0) {
      const a = r !== void 0 && r.length === 1;
      a && (e = Je.get(r)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && Je.set(r, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const It = (t) => new Et(typeof t == "string" ? t : t + "", void 0, Ie), v = (t, ...e) => {
  const r = t.length === 1 ? t[0] : e.reduce((a, s, n) => a + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[n + 1], t[0]);
  return new Et(r, t, Ie);
}, Ut = (t, e) => {
  if (Ne) t.adoptedStyleSheets = e.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of e) {
    const a = document.createElement("style"), s = $e.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = r.cssText, t.appendChild(a);
  }
}, Ze = Ne ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let r = "";
  for (const a of e.cssRules) r += a.cssText;
  return It(r);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Bt, defineProperty: Rt, getOwnPropertyDescriptor: Kt, getOwnPropertyNames: Ft, getOwnPropertySymbols: Wt, getPrototypeOf: qt } = Object, M = globalThis, Qe = M.trustedTypes, Vt = Qe ? Qe.emptyScript : "", ze = M.reactiveElementPolyfillSupport, ne = (t, e) => t, xe = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Vt : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let r = t;
  switch (e) {
    case Boolean:
      r = t !== null;
      break;
    case Number:
      r = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        r = JSON.parse(t);
      } catch {
        r = null;
      }
  }
  return r;
} }, Ue = (t, e) => !Bt(t, e), Xe = { attribute: !0, type: String, converter: xe, reflect: !1, useDefault: !1, hasChanged: Ue };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), M.litPropertyMetadata ?? (M.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let W = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, r = Xe) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(e, r), !r.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(e, a, r);
      s !== void 0 && Rt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, r, a) {
    const { get: s, set: n } = Kt(this.prototype, e) ?? { get() {
      return this[r];
    }, set(i) {
      this[r] = i;
    } };
    return { get: s, set(i) {
      const l = s == null ? void 0 : s.call(this);
      n == null || n.call(this, i), this.requestUpdate(e, l, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Xe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ne("elementProperties"))) return;
    const e = qt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ne("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ne("properties"))) {
      const r = this.properties, a = [...Ft(r), ...Wt(r)];
      for (const s of a) this.createProperty(s, r[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const r = litPropertyMetadata.get(e);
      if (r !== void 0) for (const [a, s] of r) this.elementProperties.set(a, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, a] of this.elementProperties) {
      const s = this._$Eu(r, a);
      s !== void 0 && this._$Eh.set(s, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const r = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const s of a) r.unshift(Ze(s));
    } else e !== void 0 && r.push(Ze(e));
    return r;
  }
  static _$Eu(e, r) {
    const a = r.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((r) => this.enableUpdating = r), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((r) => r(this));
  }
  addController(e) {
    var r;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((r = e.hostConnected) == null || r.call(e));
  }
  removeController(e) {
    var r;
    (r = this._$EO) == null || r.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), r = this.constructor.elementProperties;
    for (const a of r.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ut(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((r) => {
      var a;
      return (a = r.hostConnected) == null ? void 0 : a.call(r);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((r) => {
      var a;
      return (a = r.hostDisconnected) == null ? void 0 : a.call(r);
    });
  }
  attributeChangedCallback(e, r, a) {
    this._$AK(e, a);
  }
  _$ET(e, r) {
    var n;
    const a = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, a);
    if (s !== void 0 && a.reflect === !0) {
      const i = (((n = a.converter) == null ? void 0 : n.toAttribute) !== void 0 ? a.converter : xe).toAttribute(r, a.type);
      this._$Em = e, i == null ? this.removeAttribute(s) : this.setAttribute(s, i), this._$Em = null;
    }
  }
  _$AK(e, r) {
    var n, i;
    const a = this.constructor, s = a._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const l = a.getPropertyOptions(s), o = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : xe;
      this._$Em = s;
      const d = o.fromAttribute(r, l.type);
      this[s] = d ?? ((i = this._$Ej) == null ? void 0 : i.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, r, a, s = !1, n) {
    var i;
    if (e !== void 0) {
      const l = this.constructor;
      if (s === !1 && (n = this[e]), a ?? (a = l.getPropertyOptions(e)), !((a.hasChanged ?? Ue)(n, r) || a.useDefault && a.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(l._$Eu(e, a)))) return;
      this.C(e, r, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, r, { useDefault: a, reflect: s, wrapped: n }, i) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, i ?? r ?? this[e]), n !== !0 || i !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (r = void 0), this._$AL.set(e, r)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (r) {
      Promise.reject(r);
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
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, i] of s) {
        const { wrapped: l } = i, o = this[n];
        l !== !0 || this._$AL.has(n) || o === void 0 || this.C(n, void 0, i, o);
      }
    }
    let e = !1;
    const r = this._$AL;
    try {
      e = this.shouldUpdate(r), e ? (this.willUpdate(r), (a = this._$EO) == null || a.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
      }), this.update(r)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(r);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var r;
    (r = this._$EO) == null || r.forEach((a) => {
      var s;
      return (s = a.hostUpdated) == null ? void 0 : s.call(a);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((r) => this._$ET(r, this[r]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
W.elementStyles = [], W.shadowRootOptions = { mode: "open" }, W[ne("elementProperties")] = /* @__PURE__ */ new Map(), W[ne("finalized")] = /* @__PURE__ */ new Map(), ze == null || ze({ ReactiveElement: W }), (M.reactiveElementVersions ?? (M.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ie = globalThis, et = (t) => t, Ce = ie.trustedTypes, tt = Ce ? Ce.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, St = "$lit$", O = `lit$${Math.random().toFixed(9).slice(2)}$`, Dt = "?" + O, Yt = `<${Dt}>`, I = document, le = () => I.createComment(""), ce = (t) => t === null || typeof t != "object" && typeof t != "function", Be = Array.isArray, Gt = (t) => Be(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", He = `[ 	
\f\r]`, ae = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, at = />/g, j = RegExp(`>|${He}(?:([^\\s"'>=/]+)(${He}*=${He}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), st = /'/g, nt = /"/g, Pt = /^(?:script|style|textarea|title)$/i, At = (t) => (e, ...r) => ({ _$litType$: t, strings: e, values: r }), c = At(1), H = At(2), V = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), it = /* @__PURE__ */ new WeakMap(), L = I.createTreeWalker(I, 129);
function Ot(t, e) {
  if (!Be(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tt !== void 0 ? tt.createHTML(e) : e;
}
const Jt = (t, e) => {
  const r = t.length - 1, a = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = ae;
  for (let l = 0; l < r; l++) {
    const o = t[l];
    let d, g, p = -1, y = 0;
    for (; y < o.length && (i.lastIndex = y, g = i.exec(o), g !== null); ) y = i.lastIndex, i === ae ? g[1] === "!--" ? i = rt : g[1] !== void 0 ? i = at : g[2] !== void 0 ? (Pt.test(g[2]) && (s = RegExp("</" + g[2], "g")), i = j) : g[3] !== void 0 && (i = j) : i === j ? g[0] === ">" ? (i = s ?? ae, p = -1) : g[1] === void 0 ? p = -2 : (p = i.lastIndex - g[2].length, d = g[1], i = g[3] === void 0 ? j : g[3] === '"' ? nt : st) : i === nt || i === st ? i = j : i === rt || i === at ? i = ae : (i = j, s = void 0);
    const u = i === j && t[l + 1].startsWith("/>") ? " " : "";
    n += i === ae ? o + Yt : p >= 0 ? (a.push(d), o.slice(0, p) + St + o.slice(p) + O + u) : o + O + (p === -2 ? l : u);
  }
  return [Ot(t, n + (t[r] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class de {
  constructor({ strings: e, _$litType$: r }, a) {
    let s;
    this.parts = [];
    let n = 0, i = 0;
    const l = e.length - 1, o = this.parts, [d, g] = Jt(e, r);
    if (this.el = de.createElement(d, a), L.currentNode = this.el.content, r === 2 || r === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (s = L.nextNode()) !== null && o.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const p of s.getAttributeNames()) if (p.endsWith(St)) {
          const y = g[i++], u = s.getAttribute(p).split(O), b = /([.?@])?(.*)/.exec(y);
          o.push({ type: 1, index: n, name: b[2], strings: u, ctor: b[1] === "." ? Qt : b[1] === "?" ? Xt : b[1] === "@" ? er : Se }), s.removeAttribute(p);
        } else p.startsWith(O) && (o.push({ type: 6, index: n }), s.removeAttribute(p));
        if (Pt.test(s.tagName)) {
          const p = s.textContent.split(O), y = p.length - 1;
          if (y > 0) {
            s.textContent = Ce ? Ce.emptyScript : "";
            for (let u = 0; u < y; u++) s.append(p[u], le()), L.nextNode(), o.push({ type: 2, index: ++n });
            s.append(p[y], le());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Dt) o.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = s.data.indexOf(O, p + 1)) !== -1; ) o.push({ type: 7, index: n }), p += O.length - 1;
      }
      n++;
    }
  }
  static createElement(e, r) {
    const a = I.createElement("template");
    return a.innerHTML = e, a;
  }
}
function Y(t, e, r = t, a) {
  var i, l;
  if (e === V) return e;
  let s = a !== void 0 ? (i = r._$Co) == null ? void 0 : i[a] : r._$Cl;
  const n = ce(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), n === void 0 ? s = void 0 : (s = new n(t), s._$AT(t, r, a)), a !== void 0 ? (r._$Co ?? (r._$Co = []))[a] = s : r._$Cl = s), s !== void 0 && (e = Y(t, s._$AS(t, e.values), s, a)), e;
}
class Zt {
  constructor(e, r) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = r;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: r }, parts: a } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? I).importNode(r, !0);
    L.currentNode = s;
    let n = L.nextNode(), i = 0, l = 0, o = a[0];
    for (; o !== void 0; ) {
      if (i === o.index) {
        let d;
        o.type === 2 ? d = new me(n, n.nextSibling, this, e) : o.type === 1 ? d = new o.ctor(n, o.name, o.strings, this, e) : o.type === 6 && (d = new tr(n, this, e)), this._$AV.push(d), o = a[++l];
      }
      i !== (o == null ? void 0 : o.index) && (n = L.nextNode(), i++);
    }
    return L.currentNode = I, s;
  }
  p(e) {
    let r = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, r), r += a.strings.length - 2) : a._$AI(e[r])), r++;
  }
}
class me {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, r, a, s) {
    this.type = 2, this._$AH = $, this._$AN = void 0, this._$AA = e, this._$AB = r, this._$AM = a, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = r.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, r = this) {
    e = Y(this, e, r), ce(e) ? e === $ || e == null || e === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : e !== this._$AH && e !== V && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Gt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== $ && ce(this._$AH) ? this._$AA.nextSibling.data = e : this.T(I.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: r, _$litType$: a } = e, s = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = de.createElement(Ot(a.h, a.h[0]), this.options)), a);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(r);
    else {
      const i = new Zt(s, this), l = i.u(this.options);
      i.p(r), this.T(l), this._$AH = i;
    }
  }
  _$AC(e) {
    let r = it.get(e.strings);
    return r === void 0 && it.set(e.strings, r = new de(e)), r;
  }
  k(e) {
    Be(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let a, s = 0;
    for (const n of e) s === r.length ? r.push(a = new me(this.O(le()), this.O(le()), this, this.options)) : a = r[s], a._$AI(n), s++;
    s < r.length && (this._$AR(a && a._$AB.nextSibling, s), r.length = s);
  }
  _$AR(e = this._$AA.nextSibling, r) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, r); e !== this._$AB; ) {
      const s = et(e).nextSibling;
      et(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var r;
    this._$AM === void 0 && (this._$Cv = e, (r = this._$AP) == null || r.call(this, e));
  }
}
class Se {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, r, a, s, n) {
    this.type = 1, this._$AH = $, this._$AN = void 0, this.element = e, this.name = r, this._$AM = s, this.options = n, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = $;
  }
  _$AI(e, r = this, a, s) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) e = Y(this, e, r, 0), i = !ce(e) || e !== this._$AH && e !== V, i && (this._$AH = e);
    else {
      const l = e;
      let o, d;
      for (e = n[0], o = 0; o < n.length - 1; o++) d = Y(this, l[a + o], r, o), d === V && (d = this._$AH[o]), i || (i = !ce(d) || d !== this._$AH[o]), d === $ ? e = $ : e !== $ && (e += (d ?? "") + n[o + 1]), this._$AH[o] = d;
    }
    i && !s && this.j(e);
  }
  j(e) {
    e === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Qt extends Se {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === $ ? void 0 : e;
  }
}
class Xt extends Se {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== $);
  }
}
class er extends Se {
  constructor(e, r, a, s, n) {
    super(e, r, a, s, n), this.type = 5;
  }
  _$AI(e, r = this) {
    if ((e = Y(this, e, r, 0) ?? $) === V) return;
    const a = this._$AH, s = e === $ && a !== $ || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, n = e !== $ && (a === $ || s);
    s && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var r;
    typeof this._$AH == "function" ? this._$AH.call(((r = this.options) == null ? void 0 : r.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class tr {
  constructor(e, r, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Y(this, e);
  }
}
const je = ie.litHtmlPolyfillSupport;
je == null || je(de, me), (ie.litHtmlVersions ?? (ie.litHtmlVersions = [])).push("3.3.3");
const rr = (t, e, r) => {
  const a = (r == null ? void 0 : r.renderBefore) ?? e;
  let s = a._$litPart$;
  if (s === void 0) {
    const n = (r == null ? void 0 : r.renderBefore) ?? null;
    a._$litPart$ = s = new me(e.insertBefore(le(), n), n, void 0, r ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis;
class m extends W {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var r;
    const e = super.createRenderRoot();
    return (r = this.renderOptions).renderBefore ?? (r.renderBefore = e.firstChild), e;
  }
  update(e) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = rr(r, this.renderRoot, this.renderOptions);
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
var kt;
m._$litElement$ = !0, m.finalized = !0, (kt = N.litElementHydrateSupport) == null || kt.call(N, { LitElement: m });
const Le = N.litElementPolyfillSupport;
Le == null || Le({ LitElement: m });
(N.litElementVersions ?? (N.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _ = (t) => (e, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ar = { attribute: !0, type: String, converter: xe, reflect: !1, hasChanged: Ue }, sr = (t = ar, e, r) => {
  const { kind: a, metadata: s } = r;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(r.name, t), a === "accessor") {
    const { name: i } = r;
    return { set(l) {
      const o = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(i, o, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(i, void 0, t, l), l;
    } };
  }
  if (a === "setter") {
    const { name: i } = r;
    return function(l) {
      const o = this[i];
      e.call(this, l), this.requestUpdate(i, o, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function h(t) {
  return (e, r) => typeof r == "object" ? sr(t, e, r) : ((a, s, n) => {
    const i = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, a), i ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(t, e, r);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(t) {
  return h({ ...t, state: !0, attribute: !1 });
}
const C = v`
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
function nr(t, e, r) {
  let a, s = !1;
  return t.connection.subscribeMessage(
    (n) => {
      var i, l;
      (l = (i = n.variables) == null ? void 0 : i.trigger) != null && l.to_state && r(n.variables.trigger.to_state);
    },
    { type: "subscribe_trigger", trigger: { platform: "state", entity_id: e } }
  ).then((n) => {
    s ? n() : a = n;
  }), () => {
    s = !0, a == null || a();
  };
}
async function Mt(t, e, r, a) {
  const s = await Promise.all(
    e.map(
      (n) => t.connection.sendMessagePromise({
        type: "call_service",
        domain: "calendar",
        service: "get_events",
        service_data: {
          start_date_time: r.toISOString(),
          end_date_time: a.toISOString()
        },
        target: { entity_id: n },
        return_response: !0
      }).then((i) => {
        var l, o;
        return [n, ((o = (l = i == null ? void 0 : i.response) == null ? void 0 : l[n]) == null ? void 0 : o.events) ?? []];
      }).catch((i) => (console.warn(`[lucarne] calendar.get_events failed for ${n}:`, i), [n, []]))
    )
  );
  return new Map(s);
}
function ir(t, e, r) {
  const a = async () => {
    var s, n;
    try {
      const i = await t.connection.sendMessagePromise({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: {},
        target: { entity_id: e },
        return_response: !0
      });
      r(((n = (s = i == null ? void 0 : i.response) == null ? void 0 : s[e]) == null ? void 0 : n.items) ?? []);
    } catch (i) {
      console.warn(`[lucarne] todo.get_items failed for ${e}:`, i), r([]);
    }
  };
  return a(), nr(t, e, () => a());
}
function or(t) {
  let e = t;
  for (; e; ) {
    if (e instanceof Element) {
      const s = e.tagName.toLowerCase();
      if (s === "hui-dialog-edit-card" || s === "ha-dialog") return !0;
    }
    const r = e.parentNode;
    if (r) {
      e = r;
      continue;
    }
    const a = e.getRootNode();
    e = a instanceof ShadowRoot ? a.host : null;
  }
  return !1;
}
function lr(t) {
  let e = t.parentElement;
  for (; e && !e.style.getPropertyValue("--column-size"); )
    e = e.parentElement;
  return (e == null ? void 0 : e.parentElement) ?? null;
}
function Tt(t) {
  if (!or(t)) return null;
  const e = lr(t);
  if (!e) return null;
  const r = e.style.getPropertyValue("--grid-column-count"), a = () => {
    e.style.getPropertyValue("--grid-column-count") !== "1" && e.style.setProperty("--grid-column-count", "1");
  };
  a();
  const s = new MutationObserver(a);
  return s.observe(e, { attributes: !0, attributeFilter: ["style"] }), {
    uninstall() {
      s.disconnect(), r ? e.style.setProperty("--grid-column-count", r) : e.style.removeProperty("--grid-column-count");
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
var cr = Object.defineProperty, dr = Object.getOwnPropertyDescriptor, De = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? dr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && cr(e, r, s), s;
};
function oe(t) {
  return t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
}
function hr(t, e, r) {
  return t.filter((a) => oe(a.end) > e).sort((a, s) => oe(a.start).getTime() - oe(s.start).getTime()).slice(0, r);
}
function pr(t, e, r) {
  const a = t.getTime() - r.getTime();
  if (t <= r && r < e) return w.timePillNow;
  if (a > 0 && a < 60 * 60 * 1e3) {
    const d = Math.round(a / 6e4);
    return w.timePillInMinutes(d);
  }
  if (a > 0 && a < 2 * 60 * 60 * 1e3) {
    const d = Math.round(a / 36e5);
    return w.timePillInHours(d);
  }
  const n = t.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (t.toDateString() === r.toDateString()) return n;
  const l = new Date(r);
  return l.setDate(r.getDate() + 1), t.toDateString() === l.toDateString() ? w.timePillTomorrow(n) : `${t.toLocaleDateString("en", { weekday: "short" })} ${n}`;
}
function ur(t) {
  return t.start.length === 10 && t.end.length === 10;
}
let G = class extends m {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.limit = 5;
  }
  render() {
    const t = /* @__PURE__ */ new Date(), e = hr(this.events, t, this.limit);
    return e.length === 0 ? c`<div class="empty-state">${w.nothingOnCalendar}</div>` : c`
      ${e.map((r) => {
      const a = oe(r.start), s = oe(r.end), n = a <= t && t < s, i = ur(r) ? "all day" : pr(a, s, t), l = this._colorForEvent(r);
      return c`
          <div class="event-row">
            <div class="time-pill ${n ? "now" : ""}">
              ${n ? c`<span class="pulse-dot"></span>` : ""} ${i}
            </div>
            <div class="color-bar" style="background:${l}"></div>
            <div class="event-content">
              <div class="event-summary">${r.summary}</div>
              ${r.location ? c`<div class="event-secondary">${r.location}</div>` : ""}
            </div>
          </div>
        `;
    })}
    `;
  }
  _colorForEvent(t) {
    if (t.uid) {
      const e = t.uid.split("::")[0], r = this.calendarColors.get(e);
      if (r) return r;
    }
    return "var(--lucarne-color-family)";
  }
};
G.styles = [
  C,
  v`
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
De([
  h({ type: Array })
], G.prototype, "events", 2);
De([
  h({ type: Object })
], G.prototype, "calendarColors", 2);
De([
  h({ type: Number })
], G.prototype, "limit", 2);
G = De([
  _("lucarne-agenda-strip")
], G);
const ot = H`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`, q = H`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>`, se = H`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`, lt = H`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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
</svg>`, gr = H`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M4.22 19.78l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="currentColor"/>
  <path d="M20 15h-1.26A6 6 0 1 0 8 20h12a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.7"/>
</svg>`;
H`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="7" r="4"/>
  <path d="M20 21a8 8 0 1 0-16 0"/>
</svg>`;
H`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"/>
</svg>`;
const fr = H`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, ct = {
  sunny: ot,
  "clear-night": ot,
  cloudy: q,
  fog: q,
  hail: se,
  lightning: se,
  "lightning-rainy": se,
  partlycloudy: gr,
  pouring: se,
  rainy: se,
  snowy: lt,
  "snowy-rainy": lt,
  windy: q,
  "windy-variant": q,
  exceptional: q
};
function dt(t) {
  return ct[t] ?? ct[t.toLowerCase()] ?? q;
}
const mr = {
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
function ht(t) {
  return mr[t.toLowerCase()] ?? "#8aa0b8";
}
function vr(t) {
  if (!t.length) return w.dressingTipDefault;
  const e = t[0];
  if (e.condition.toLowerCase().includes("snow"))
    return w.dressingTipBoots;
  const a = e.temperature;
  let s;
  return a < 5 ? s = w.dressingTipHeavyCoat : a < 12 ? s = w.dressingTipCoatScarf : a < 18 ? s = w.dressingTipLightJacket : a < 24 ? s = w.dressingTipTShirt : s = w.dressingTipShorts, (e.precipitation_probability ?? 0) > 50 && (s += w.dressingTipUmbrella), s;
}
var _r = Object.defineProperty, yr = Object.getOwnPropertyDescriptor, Re = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? yr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && _r(e, r, s), s;
};
let he = class extends m {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return c`<div class="empty-state">${w.addWeatherEntity}</div>`;
    const t = this.weatherEntity.attributes, e = t.temperature, r = t.temperature_unit ?? "°C", a = this.weatherEntity.state, s = this.forecast[0], n = this.forecast[1], i = vr(this.forecast);
    return c`
      <div class="current">
        <span class="condition-icon" style="color: ${ht(a)}">${dt(a)}</span>
        <div class="temp-group">
          <div class="current-temp">${e !== void 0 ? `${Math.round(e)}${r}` : w.errorUnavailable}</div>
          ${s ? c`<div class="high-low">
                ↑${Math.round(s.temperature)}${r}
                ${s.templow !== void 0 ? ` ↓${Math.round(s.templow)}${r}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${n ? c`
            <div class="tomorrow-row">
              <span class="tomorrow-icon" style="color: ${ht(n.condition)}">${dt(n.condition)}</span>
              <span>Tomorrow ↑${Math.round(n.temperature)}${r}${n.templow !== void 0 ? ` ↓${Math.round(n.templow)}${r}` : ""}</span>
            </div>
          ` : ""}
      <div class="dressing-tip">
        <span class="dressing-label">Wear:</span>
        ${i}
      </div>
    `;
  }
};
he.styles = [
  C,
  v`
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
Re([
  h({ attribute: !1 })
], he.prototype, "weatherEntity", 2);
Re([
  h({ type: Array })
], he.prototype, "forecast", 2);
he = Re([
  _("lucarne-weather-block")
], he);
var br = Object.defineProperty, wr = Object.getOwnPropertyDescriptor, Ke = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? wr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && br(e, r, s), s;
};
let pe = class extends m {
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
    const t = this.items.filter((s) => s.status === "needs_action"), e = t.length, r = t.slice(0, 3), a = e - r.length;
    return e === 0 ? c`
        <div class="empty-state">
          <span class="empty-icon">${fr}</span>
          ${w.allDone}
        </div>
      ` : c`
      <div class="header">
        ${w.tasksTitle}
        <span class="count-badge">${e}</span>
      </div>
      ${r.map(
      (s) => c`
          <div class="task-row">
            <span class="summary">${s.summary}</span>
            ${s.due ? c`<span class="due-chip">${this._formatDue(s.due)}</span>` : ""}
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
pe.styles = [
  C,
  v`
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
Ke([
  h({ type: Array })
], pe.prototype, "items", 2);
Ke([
  h({ type: String })
], pe.prototype, "todoEntityId", 2);
pe = Ke([
  _("lucarne-tasks-summary")
], pe);
var $r = Object.defineProperty, xr = Object.getOwnPropertyDescriptor, zt = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? xr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && $r(e, r, s), s;
};
let ke = class extends m {
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
ke.styles = [
  C,
  v`
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
zt([
  h({ type: Array })
], ke.prototype, "entries", 2);
ke = zt([
  _("lucarne-presence-pills")
], ke);
var Cr = Object.defineProperty, kr = Object.getOwnPropertyDescriptor, te = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? kr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Cr(e, r, s), s;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-today-card",
  name: "Lucarne Today",
  description: "Family agenda + weather + tasks + presence",
  preview: !0
});
let T = class extends m {
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
    const e = Object.keys(t.states).filter((n) => n.startsWith("calendar.")).slice(0, 3), r = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], a = e.map((n, i) => ({
      entity: n,
      color: r[i] ?? "#a8d8b9"
    })), s = "weather.forecast_home" in t.states;
    return {
      type: "custom:lucarne-today-card",
      title: w.today,
      calendars: a.length ? a : [{ entity: "calendar.example", color: "#a8d8b9" }],
      weather: s ? "weather.forecast_home" : void 0
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
      this._previewOverride = Tt(this);
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
    }, 5 * 60 * 1e3), this._config.tasks && (this._todoUnsub = ir(this.hass, this._config.tasks, (t) => {
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
    const r = this._config.weather;
    if (r) {
      const s = (a = this.hass.states[r]) == null ? void 0 : a.state;
      s && s !== this._lastWeatherState && (this._lastWeatherState = s, this._fetchForecast());
    }
  }
  async _fetchCalendarEvents() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.map((n) => n.entity), e = /* @__PURE__ */ new Date(), r = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), a = await Mt(this.hass, t, e, r), s = /* @__PURE__ */ new Map();
    for (const [n, i] of a.entries())
      s.set(
        n,
        i.map((l) => ({ ...l, uid: `${n}::${l.uid ?? l.summary}` }))
      );
    this._calendarEvents = s;
  }
  async _fetchForecast() {
    var t, e, r;
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
        this._forecast = ((r = (e = a == null ? void 0 : a.response) == null ? void 0 : e[this._config.weather]) == null ? void 0 : r.forecast) ?? [];
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
    for (const r of ((e = this._config) == null ? void 0 : e.calendars) ?? [])
      t.set(r.entity, r.color);
    return t;
  }
  render() {
    var r;
    if (!this._config) return c``;
    const t = this._config.weather ? (r = this.hass) == null ? void 0 : r.states[this._config.weather] : void 0, e = (this._config.presence ?? []).map((a) => {
      var s, n;
      return {
        name: a.name,
        isHome: ((n = (s = this.hass) == null ? void 0 : s.states[a.entity]) == null ? void 0 : n.state) === "on"
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
T.styles = [
  C,
  v`
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
te([
  h({ attribute: !1 })
], T.prototype, "hass", 2);
te([
  f()
], T.prototype, "_config", 2);
te([
  f()
], T.prototype, "_calendarEvents", 2);
te([
  f()
], T.prototype, "_forecast", 2);
te([
  f()
], T.prototype, "_todoItems", 2);
T = te([
  _("lucarne-today-card")
], T);
const Ht = v`
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
`, pt = ["ha-entity-picker", "ha-textfield"], Er = 3e3;
let ye;
function Sr(t) {
  return new Promise((e) => setTimeout(e, t));
}
async function Dr() {
  const t = window.loadCardHelpers;
  if (t)
    try {
      const s = await t(), i = (await Promise.resolve(
        s.createCardElement({ type: "entities", entities: [] })
      )).constructor;
      typeof (i == null ? void 0 : i.getConfigElement) == "function" && await Promise.resolve(i.getConfigElement());
    } catch (s) {
      console.warn("[lucarne] loadCardHelpers failed; falling back to whenDefined", s);
    }
  const e = Promise.all(
    pt.map((s) => customElements.whenDefined(s))
  ).then(() => "ready"), r = Sr(Er).then(() => "timeout");
  if (await Promise.race([e, r]) === "timeout" && !pt.every((s) => customElements.get(s)))
    throw new Error("[lucarne] HA form elements did not register within timeout");
}
function Fe() {
  return ye || (ye = Dr().catch((t) => {
    throw ye = void 0, t;
  })), ye;
}
var ut, gt;
(function(t) {
  t.language = "language", t.system = "system", t.comma_decimal = "comma_decimal", t.decimal_comma = "decimal_comma", t.space_comma = "space_comma", t.none = "none";
})(ut || (ut = {})), function(t) {
  t.language = "language", t.system = "system", t.am_pm = "12", t.twenty_four = "24";
}(gt || (gt = {}));
var We = function(t, e, r, a) {
  a = a || {}, r = r ?? {};
  var s = new Event(e, { bubbles: a.bubbles === void 0 || a.bubbles, cancelable: !!a.cancelable, composed: a.composed === void 0 || a.composed });
  return s.detail = r, t.dispatchEvent(s), s;
}, Pr = Object.defineProperty, Ar = Object.getOwnPropertyDescriptor, Pe = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Ar(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Pr(e, r, s), s;
};
let J = class extends m {
  constructor() {
    super(...arguments), this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), Fe().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    We(this, "config-changed", { config: t });
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
    const e = t.target, r = parseInt(e.value, 10);
    this._fire({ ...this._config, agenda_limit: isNaN(r) ? void 0 : Math.min(10, Math.max(1, r)) });
  }
  _calEntityChanged(t, e) {
    var a, s;
    const r = [...((a = this._config) == null ? void 0 : a.calendars) ?? []];
    r[t] = { ...r[t], entity: ((s = e.detail) == null ? void 0 : s.value) ?? "" }, this._fire({ ...this._config, calendars: r });
  }
  _calColorChanged(t, e) {
    var a;
    const r = [...((a = this._config) == null ? void 0 : a.calendars) ?? []];
    r[t] = { ...r[t], color: e.target.value }, this._fire({ ...this._config, calendars: r });
  }
  _removeCalendar(t) {
    var r;
    const e = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, calendars: e }));
  }
  _addCalendar() {
    var a, s;
    const e = Object.keys(((a = this.hass) == null ? void 0 : a.states) ?? {}).find((n) => n.startsWith("calendar.")) ?? "calendar.example", r = [
      ...((s = this._config) == null ? void 0 : s.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  _presenceEntityChanged(t, e) {
    var a, s;
    const r = [...((a = this._config) == null ? void 0 : a.presence) ?? []];
    r[t] = { ...r[t], entity: ((s = e.detail) == null ? void 0 : s.value) ?? "" }, this._fire({ ...this._config, presence: r });
  }
  _presenceNameChanged(t, e) {
    var a;
    const r = [...((a = this._config) == null ? void 0 : a.presence) ?? []];
    r[t] = { ...r[t], name: e.target.value }, this._fire({ ...this._config, presence: r });
  }
  _removePresence(t) {
    var r;
    const e = [...((r = this._config) == null ? void 0 : r.presence) ?? []];
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
      (r, a) => c`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${r.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(s) => this._calEntityChanged(a, s)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${r.color}
              @input=${(s) => this._calColorChanged(a, s)}
              title="Calendar color"
            />
            <button type="button" class="remove" @click=${() => this._removeCalendar(a)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addCalendar}>+ Add calendar</button>

      <div class="section-label">Presence</div>
      ${e.map(
      (r, a) => c`
          <div class="presence-row">
            <div class="row-stack">
              <ha-entity-picker
                label="Entity"
                .hass=${this.hass}
                .value=${r.entity}
                .includeDomains=${["input_boolean"]}
                allow-custom-entity
                @value-changed=${(s) => this._presenceEntityChanged(a, s)}
              ></ha-entity-picker>
              <input
                class="text-input"
                type="text"
                placeholder="Display name"
                .value=${r.name}
                @change=${(s) => this._presenceNameChanged(a, s)}
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
J.styles = [C, Ht];
Pe([
  h({ attribute: !1 })
], J.prototype, "hass", 2);
Pe([
  f()
], J.prototype, "_config", 2);
Pe([
  f()
], J.prototype, "_haReady", 2);
J = Pe([
  _("lucarne-today-card-editor")
], J);
function jt(t, e) {
  var a, s, n;
  const r = (n = (s = (a = e == null ? void 0 : e.states) == null ? void 0 : a[t.entity]) == null ? void 0 : s.attributes) == null ? void 0 : n.friendly_name;
  return typeof r == "string" && r ? r : t.entity;
}
function ft(t, e) {
  return t.map((r) => ({ ...r, label: jt(r, e) }));
}
function mt(t, e) {
  const r = parseInt(t.split(":")[0], 10), a = parseInt(e.split(":")[0], 10), s = [];
  for (let n = r; n <= a; n++)
    s.push(n);
  return s;
}
function Or(t, e, r) {
  const [a, s] = e.split(":").map(Number), [n, i] = r.split(":").map(Number), l = new Date(t);
  l.setHours(a, s, 0, 0);
  const o = new Date(t);
  return o.setHours(n, i, 0, 0), { bandStartMs: l.getTime(), bandEndMs: o.getTime() };
}
function Mr(t, e, r, a) {
  const s = vt(t.start).getTime(), n = vt(t.end).getTime(), { bandStartMs: i, bandEndMs: l } = Or(e, r, a), o = Math.max(s, i), d = Math.min(n, l);
  return o >= d ? null : { start: new Date(o), end: new Date(d) };
}
function vt(t) {
  return t.length === 10 && !t.includes("T") ? /* @__PURE__ */ new Date(`${t}T00:00:00`) : new Date(t);
}
function Tr(t) {
  return t.start.length === 10 && !t.start.includes("T");
}
function be(t) {
  const e = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return `${e}-${r}-${a}`;
}
function zr(t) {
  if (t.length === 0) return [];
  const e = t.map((o, d) => ({ ...o, _idx: d }));
  e.sort((o, d) => o.start.getTime() - d.start.getTime());
  const r = [], a = new Array(t.length);
  for (const o of e) {
    const d = o.start.getTime();
    let g = r.findIndex((p) => p <= d);
    g === -1 ? (g = r.length, r.push(o.end.getTime())) : r[g] = o.end.getTime(), a[o._idx] = g;
  }
  const s = new Array(t.length), n = [];
  let i = 0, l = e[0].end.getTime();
  s[e[0]._idx] = 0, n.push(a[e[0]._idx]);
  for (let o = 1; o < e.length; o++) {
    const d = e[o];
    d.start.getTime() >= l ? (i++, n.push(0), l = d.end.getTime()) : l = Math.max(l, d.end.getTime()), s[d._idx] = i, n[i] = Math.max(n[i], a[d._idx]);
  }
  return a.map((o, d) => ({
    lane: o,
    laneCount: n[s[d]] + 1
  }));
}
function we(t, e) {
  const [r, a] = e.split(":").map(Number), s = new Date(t);
  return s.setHours(r, a, 0, 0), s.getTime();
}
function Hr(t, e, r, a) {
  const s = /* @__PURE__ */ new Map();
  for (const n of e)
    s.set(be(n), { allDay: [], inBand: [], earlier: [], later: [] });
  for (const n of t) {
    if (Tr(n)) {
      const o = /* @__PURE__ */ new Date(n.start + "T00:00:00"), d = /* @__PURE__ */ new Date(n.end + "T00:00:00");
      for (const g of e) {
        const p = be(g), y = s.get(p);
        g >= o && g < d && y.allDay.push(n);
      }
      continue;
    }
    const i = new Date(n.start), l = new Date(n.end);
    for (const o of e) {
      const d = be(o), g = s.get(d), p = new Date(o);
      p.setHours(0, 0, 0, 0);
      const y = new Date(o);
      if (y.setHours(23, 59, 59, 999), l <= p || i > y) continue;
      const u = we(o, r), b = we(o, a);
      if (l.getTime() <= u)
        g.earlier.push(n);
      else if (i.getTime() >= b)
        g.later.push(n);
      else {
        const A = Mr(n, o, r, a);
        if (A) {
          const F = b - u, Ge = (A.start.getTime() - u) / F * 100, Nt = (A.end.getTime() - A.start.getTime()) / F * 100;
          g.inBand.push({
            event: n,
            lane: 0,
            laneCount: 1,
            topPercent: Math.max(0, Math.min(100, Ge)),
            heightPercent: Math.max(0, Math.min(100 - Ge, Nt))
          });
        }
      }
    }
  }
  for (const n of e) {
    const i = be(n), l = s.get(i);
    if (l.inBand.length === 0) continue;
    const o = we(n, r), g = we(n, a) - o, p = l.inBand.map((u) => {
      const b = o + u.topPercent / 100 * g, A = b + u.heightPercent / 100 * g;
      return {
        event: u.event,
        start: new Date(b),
        end: new Date(A),
        lane: 0
      };
    }), y = zr(p);
    l.inBand = l.inBand.map((u, b) => ({
      ...u,
      lane: y[b].lane,
      laneCount: y[b].laneCount
    }));
  }
  return { days: e, perDay: s };
}
var jr = Object.defineProperty, Lr = Object.getOwnPropertyDescriptor, qe = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Lr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && jr(e, r, s), s;
};
let ue = class extends m {
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
ue.styles = [
  C,
  v`
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
qe([
  h({ type: Array })
], ue.prototype, "calendars", 2);
qe([
  h({ type: Object })
], ue.prototype, "visibleIds", 2);
ue = qe([
  _("lucarne-visibility-pills")
], ue);
var Nr = Object.defineProperty, Ir = Object.getOwnPropertyDescriptor, R = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Ir(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Nr(e, r, s), s;
};
function _t(t) {
  return t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
}
let D = class extends m {
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
    const t = new Date(this.event.start), e = new Date(this.event.end), r = `${_t(t)}–${_t(e)}`, a = this.event.pending ? "0.5" : "1";
    return c`
      <div @click=${this._handleClick} style="height:100%;width:100%;overflow:hidden;opacity:${a}">
        <div class="event-summary">${this.event.summary}</div>
        <div class="event-time">${r}</div>
      </div>
    `;
  }
};
D.styles = [
  C,
  v`
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
R([
  h({ type: Object })
], D.prototype, "event", 2);
R([
  h({ type: String })
], D.prototype, "color", 2);
R([
  h({ type: Number })
], D.prototype, "lane", 2);
R([
  h({ type: Number })
], D.prototype, "laneCount", 2);
R([
  h({ type: Number })
], D.prototype, "topPercent", 2);
R([
  h({ type: Number })
], D.prototype, "heightPercent", 2);
D = R([
  _("lucarne-calendar-event-block")
], D);
var Ur = Object.defineProperty, Br = Object.getOwnPropertyDescriptor, ve = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Br(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Ur(e, r, s), s;
};
let U = class extends m {
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
    let e = 0, r = 0;
    if (t) {
      const a = t.getBoundingClientRect();
      e = a.bottom + 4, r = a.left;
    }
    return c`
      <button class="stub-chip" @click=${this._openPopover}>
        +${this.events.length} ${this.label}
      </button>

      ${this._open ? c`
            <div class="backdrop" @click=${this._close}></div>
            <div class="mini-popover" style="top:${e}px;left:${r}px;">
              <div class="mini-title">${this.label}</div>
              ${this.events.map(
      (a) => c`
                  <div class="mini-event" @click=${(s) => this._tapEvent(s, a)}>
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
U.styles = [
  C,
  v`
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
ve([
  h({ type: Array })
], U.prototype, "events", 2);
ve([
  h({ type: String })
], U.prototype, "label", 2);
ve([
  h({ type: Object })
], U.prototype, "eventColors", 2);
ve([
  f()
], U.prototype, "_open", 2);
U = ve([
  _("lucarne-out-of-band-stub")
], U);
var Rr = Object.defineProperty, Kr = Object.getOwnPropertyDescriptor, K = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Kr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Rr(e, r, s), s;
};
function yt(t) {
  const e = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return `${e}-${r}-${a}`;
}
function bt(t, e) {
  return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
}
let P = class extends m {
  constructor() {
    super(...arguments), this.layout = null, this.bandStart = "07:00", this.bandEnd = "21:00", this.calendars = [], this.hourHeightPx = 60, this.showCreateButton = !1;
  }
  get _colorMap() {
    const t = /* @__PURE__ */ new Map();
    for (const e of this.calendars) t.set(e.entity, e.color);
    return t;
  }
  _eventColor(t) {
    var r;
    const e = this._colorMap;
    if ((r = t.uid) != null && r.includes("::")) {
      const a = t.uid.split("::")[0];
      return e.get(a) ?? "#a8d8b9";
    }
    return "#a8d8b9";
  }
  _onBandClick(t, e) {
    if (!this.showCreateButton) return;
    const a = t.currentTarget.getBoundingClientRect(), [s] = this.bandStart.split(":").map(Number), [n] = this.bandEnd.split(":").map(Number), i = n - s, l = Math.max(0, Math.min(1, (t.clientY - a.top) / a.height)), o = s + l * i, d = Math.min(n - 1, Math.round(o * 2) / 2);
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
    for (const r of t)
      e.set(r.uid ?? "", this._eventColor(r));
    return e;
  }
  _renderDayColumn(t, e) {
    if (!this.layout) return c``;
    const r = yt(t), a = this.layout.perDay.get(r);
    if (!a) return c``;
    const s = mt(this.bandStart, this.bandEnd), i = (s.length - 1) * this.hourHeightPx, l = bt(t, e), [o] = this.bandStart.split(":").map(Number), [d] = this.bandEnd.split(":").map(Number), g = (d - o) * 36e5;
    let p = null;
    if (l) {
      const u = new Date(t);
      u.setHours(o, 0, 0, 0);
      const b = new Date(t);
      b.setHours(d, 0, 0, 0), e >= u && e <= b && (p = (e.getTime() - u.getTime()) / g * 100);
    }
    const y = this._buildEventColorMap([...a.inBand.map((u) => u.event), ...a.earlier, ...a.later]);
    return c`
      <div class="day-col-wrapper">
        ${a.earlier.length > 0 ? c`
              <div class="stub-area-top">
                <lucarne-out-of-band-stub
                  .events=${a.earlier}
                  label="earlier"
                  .eventColors=${y}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}

        <div
          class="day-col"
          style="height:${i}px${this.showCreateButton ? "; cursor: crosshair" : ""}"
          @click=${(u) => this._onBandClick(u, t)}
        >
          ${s.slice(0, -1).map(
      (u, b) => c`
              <div
                class="hour-line"
                style="top: ${(b + 1) / (s.length - 1) * 100}%"
              ></div>
            `
    )}

          ${p !== null ? c`<div class="now-line" style="top:${p}%"></div>` : ""}

          ${a.inBand.map((u) => {
      const b = 100 / u.laneCount, A = u.lane / u.laneCount * 100, F = this._eventColor(u.event);
      return c`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${u.topPercent}%;
                  left: calc(${A}% + 1px);
                  width: calc(${b}% - 2px);
                  height: ${u.heightPercent}%;
                  z-index: ${u.lane + 1};
                  background: ${F}cc;
                  border-left-color: ${F};
                "
                .event=${u.event}
                .color=${F}
                .lane=${u.lane}
                .laneCount=${u.laneCount}
                .topPercent=${u.topPercent}
                .heightPercent=${u.heightPercent}
              ></lucarne-calendar-event-block>
            `;
    })}
        </div>

        ${a.later.length > 0 ? c`
              <div class="stub-area-bottom">
                <lucarne-out-of-band-stub
                  .events=${a.later}
                  label="tonight"
                  .eventColors=${y}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}
      </div>
    `;
  }
  render() {
    if (!this.layout) return c`<div>Loading…</div>`;
    const t = /* @__PURE__ */ new Date(), e = mt(this.bandStart, this.bandEnd), a = (e.length - 1) * this.hourHeightPx, s = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    return c`
      <div class="grid-wrapper">
        <!-- Header row -->
        <div class="header-spacer"></div>
        ${this.layout.days.map(
      (n, i) => c`
            <div
              class="day-header ${bt(n, t) ? "today" : ""}"
              style="grid-column: ${i + 2}"
            >
              <div>${s.format(n)}</div>
              <div class="day-num">${n.getDate()}</div>
            </div>
          `
    )}

        <!-- All-day row -->
        <div class="allday-spacer">all-day</div>
        ${this.layout.days.map((n, i) => {
      const l = yt(n), o = this.layout.perDay.get(l);
      return c`
            <div class="allday-cell" style="grid-column: ${i + 2}">
              ${((o == null ? void 0 : o.allDay) ?? []).map(
        (d) => c`
                  <div
                    class="allday-event"
                    style="background: ${this._eventColor(d)}cc"
                    @click=${(g) => {
          g.stopPropagation(), this.dispatchEvent(
            new CustomEvent("lucarne-event-tap", {
              detail: { event: d, color: this._eventColor(d) },
              bubbles: !0,
              composed: !0
            })
          );
        }}
                  >
                    ${d.summary}
                  </div>
                `
      )}
            </div>
          `;
    })}

        <!-- Time column -->
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

        <!-- Day columns -->
        ${this.layout.days.map((n, i) => c`
          <div style="grid-row:3; grid-column:${i + 2}; position:relative; overflow:visible; display:flex; flex-direction:column;">
            ${this._renderDayColumn(n, t)}
          </div>
        `)}
      </div>
    `;
  }
};
P.styles = [
  C,
  v`
      :host {
        display: block;
        position: relative;
      }
      .grid-wrapper {
        display: grid;
        grid-template-columns: 40px repeat(var(--lucarne-day-count, 7), minmax(0, 1fr));
        grid-template-rows: auto auto 1fr;
        min-width: 480px;
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
        grid-row: 1;
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
        grid-row: 3;
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
K([
  h({ type: Object })
], P.prototype, "layout", 2);
K([
  h({ type: String })
], P.prototype, "bandStart", 2);
K([
  h({ type: String })
], P.prototype, "bandEnd", 2);
K([
  h({ type: Array })
], P.prototype, "calendars", 2);
K([
  h({ type: Number })
], P.prototype, "hourHeightPx", 2);
K([
  h({ type: Boolean })
], P.prototype, "showCreateButton", 2);
P = K([
  _("lucarne-calendar-grid")
], P);
var Fr = Object.defineProperty, Wr = Object.getOwnPropertyDescriptor, Ae = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Wr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Fr(e, r, s), s;
};
function qr(t) {
  return new Date(t).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: !0
  });
}
let Z = class extends m {
  constructor() {
    super(...arguments), this.event = null, this.color = "#a8d8b9", this.calendarLabel = "";
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  render() {
    var n;
    if (!this.event) return c``;
    const t = this.event, r = t.start.length === 10 && !t.start.includes("T") ? "All day" : `${qr(t.start)} – ${new Date(t.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 })}`, a = (n = t.uid) != null && n.includes("::") ? t.uid.split("::").slice(1).join("::") : t.uid, s = a && a.length > 0 ? `https://calendar.google.com/calendar/u/0/r/eventedit/${encodeURIComponent(a)}` : null;
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
          <span class="detail-text">${r}</span>
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

        ${s ? c`
              <a class="ext-link" href="${s}" target="_blank" rel="noopener noreferrer">
                Open in Google Calendar ↗
              </a>
            ` : ""}
      </div>
    `;
  }
};
Z.styles = [
  C,
  v`
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
Ae([
  h({ type: Object })
], Z.prototype, "event", 2);
Ae([
  h({ type: String })
], Z.prototype, "color", 2);
Ae([
  h({ type: String })
], Z.prototype, "calendarLabel", 2);
Z = Ae([
  _("lucarne-calendar-event-popover")
], Z);
var Vr = Object.defineProperty, Yr = Object.getOwnPropertyDescriptor, k = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Yr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Vr(e, r, s), s;
};
function wt(t, e) {
  const a = -(/* @__PURE__ */ new Date(`${t}T${e}:00`)).getTimezoneOffset(), s = a >= 0 ? "+" : "-", n = Math.floor(Math.abs(a) / 60).toString().padStart(2, "0"), i = (Math.abs(a) % 60).toString().padStart(2, "0");
  return `${t}T${e}:00${s}${n}:${i}`;
}
function $t(t) {
  return `${Math.floor(t).toString().padStart(2, "0")}:${t % 1 === 0.5 ? "30" : "00"}`;
}
function xt(t) {
  const e = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return `${e}-${r}-${a}`;
}
let x = class extends m {
  constructor() {
    super(...arguments), this.day = null, this.startHour = 9, this.calendars = [], this._title = "", this._calendarEntityId = "", this._date = "", this._startTime = "", this._endTime = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
  }
  updated(t) {
    super.updated(t), (t.has("day") || t.has("startHour")) && this._initDefaults();
  }
  _initDefaults() {
    var r;
    const t = this.day ?? /* @__PURE__ */ new Date();
    this._date = xt(t), this._startTime = $t(Math.max(0, Math.min(23, this.startHour)));
    const e = Math.min(24, this.startHour + 1);
    this._endTime = $t(e < 24 ? e : 23.5), this._calendarEntityId = ((r = this.calendars[0]) == null ? void 0 : r.entity) ?? "", this._title = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
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
    let e, r;
    if (this._allDay) {
      t.start_date = this._date;
      const a = /* @__PURE__ */ new Date(`${this._date}T00:00:00`);
      a.setDate(a.getDate() + 1);
      const s = xt(a);
      t.end_date = s, e = this._date, r = s;
    } else {
      const a = wt(this._date, this._startTime), s = wt(this._date, this._endTime);
      t.start_date_time = a, t.end_date_time = s, e = a, r = s;
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
            end: r,
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
x.styles = [
  C,
  v`
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
k([
  h({ attribute: !1 })
], x.prototype, "hass", 2);
k([
  h({ type: Object })
], x.prototype, "day", 2);
k([
  h({ type: Number })
], x.prototype, "startHour", 2);
k([
  h({ type: Array })
], x.prototype, "calendars", 2);
k([
  f()
], x.prototype, "_title", 2);
k([
  f()
], x.prototype, "_calendarEntityId", 2);
k([
  f()
], x.prototype, "_date", 2);
k([
  f()
], x.prototype, "_startTime", 2);
k([
  f()
], x.prototype, "_endTime", 2);
k([
  f()
], x.prototype, "_allDay", 2);
k([
  f()
], x.prototype, "_description", 2);
k([
  f()
], x.prototype, "_location", 2);
k([
  f()
], x.prototype, "_error", 2);
k([
  f()
], x.prototype, "_saving", 2);
x = k([
  _("lucarne-create-event-popover")
], x);
var Gr = Object.defineProperty, Jr = Object.getOwnPropertyDescriptor, S = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Jr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Gr(e, r, s), s;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-calendar-card",
  name: "Lucarne Calendar",
  description: "Week view calendar with per-person color, visibility pills, and create-event flow",
  preview: !0
});
let E = class extends m {
  constructor() {
    super(...arguments), this._layout = null, this._visibleIds = /* @__PURE__ */ new Set(), this._weekOffset = 0, this._openEvent = null, this._openEventColor = "", this._openEventCalLabel = "", this._createDay = null, this._createStartHour = 9, this._creatableCalendars = [], this._fetchSeq = 0, this._rawEvents = /* @__PURE__ */ new Map(), this._pendingEvents = [];
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
      const a = parseInt(t.visible_hours.start.split(":")[0], 10), s = parseInt(t.visible_hours.end.split(":")[0], 10);
      if (a < 0 || s > 24 || a >= s)
        throw new Error('lucarne-calendar-card: "visible_hours" must satisfy 0 <= start < end <= 24');
      e = {
        ...t,
        visible_hours: {
          start: `${String(a).padStart(2, "0")}:00`,
          end: `${String(s).padStart(2, "0")}:00`
        }
      };
    }
    this._config = e, this._visibleIds = new Set(t.calendars.map((r) => r.entity)), this.hass && this._updateCreatableCalendars(), this.isConnected && (this._teardown(), this._setup());
  }
  static getStubConfig(t) {
    const e = Object.keys(t.states).filter((s) => s.startsWith("calendar.")).slice(0, 3), r = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], a = e.map((s, n) => ({
      entity: s,
      color: r[n] ?? "#a8d8b9"
    }));
    return {
      type: "custom:lucarne-calendar-card",
      title: "Calendar",
      calendars: a.length ? a : [{ entity: "calendar.example", color: "#a8d8b9" }],
      visible_hours: { start: "07:00", end: "21:00" },
      show_create_button: !0
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
    super.connectedCallback(), this._setup(), requestAnimationFrame(() => {
      this._previewOverride = Tt(this);
    });
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this._teardown(), (t = this._previewOverride) == null || t.uninstall(), this._previewOverride = void 0;
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
  // Single source of truth for the day array during Phase 1; Phase 2 deletes this
  // entirely (controller.days replaces it). Called by both _recompute and _fetchEvents.
  _currentDays() {
    var s;
    const t = /* @__PURE__ */ new Date();
    t.setHours(0, 0, 0, 0);
    const e = t.getDay(), r = (((s = this._config) == null ? void 0 : s.week_starts_on) ?? "monday") === "monday" ? 1 : 0, a = (e - r + 7) % 7;
    return t.setDate(t.getDate() - a + this._weekOffset * 7), Array.from({ length: 7 }, (n, i) => {
      const l = new Date(t);
      return l.setDate(t.getDate() + i), l;
    });
  }
  async _fetchEvents() {
    if (!this._config || !this.hass) return;
    const t = ++this._fetchSeq, e = this._currentDays(), r = e[0], a = new Date(e[6]);
    a.setDate(a.getDate() + 1), a.setHours(0, 0, 0, 0);
    const s = this._config.calendars.map((l) => l.entity), n = await Mt(this.hass, s, r, a);
    if (t !== this._fetchSeq) return;
    const i = /* @__PURE__ */ new Map();
    for (const [l, o] of n.entries())
      i.set(
        l,
        o.map((d) => ({ ...d, uid: `${l}::${d.uid ?? ""}` }))
      );
    this._rawEvents = i, this._pendingEvents = [], this._recompute();
  }
  _recompute() {
    var s, n;
    if (!this._config) return;
    const t = [];
    for (const [i, l] of this._rawEvents.entries())
      this._visibleIds.has(i) && t.push(...l);
    t.push(
      ...this._pendingEvents.filter((i) => {
        var o;
        const l = (o = i.uid) == null ? void 0 : o.split("::")[0];
        return l ? this._visibleIds.has(l) : !0;
      })
    );
    const e = ((s = this._config.visible_hours) == null ? void 0 : s.start) ?? "07:00", r = ((n = this._config.visible_hours) == null ? void 0 : n.end) ?? "21:00", a = this._currentDays();
    this._layout = Hr(t, a, e, r);
  }
  _supportsCreate(t) {
    var r, a, s;
    const e = (s = (a = (r = this.hass) == null ? void 0 : r.states[t]) == null ? void 0 : a.attributes) == null ? void 0 : s.supported_features;
    return e !== void 0 && (e & 1) !== 0;
  }
  _updateCreatableCalendars() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.filter((r) => this._supportsCreate(r.entity));
    t.length === this._creatableCalendars.length && t.every((r, a) => {
      var s;
      return r.entity === ((s = this._creatableCalendars[a]) == null ? void 0 : s.entity);
    }) || (this._creatableCalendars = t);
  }
  _onVisibilityChange(t) {
    this._visibleIds = t.detail, this._recompute();
  }
  _onEventTap(t) {
    var a, s;
    const { event: e, color: r } = t.detail;
    if (this._openEvent = e, this._openEventColor = r, (a = e.uid) != null && a.includes("::")) {
      const n = e.uid.split("::")[0], i = (s = this._config) == null ? void 0 : s.calendars.find((l) => l.entity === n);
      this._openEventCalLabel = i ? jt(i, this.hass) : "";
    } else
      this._openEventCalLabel = "";
  }
  _closePopover() {
    this._openEvent = null;
  }
  _onCreateEventTap(t) {
    const { day: e, startHour: r } = t.detail;
    this._createDay = e, this._createStartHour = r;
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
    const t = this._currentDays(), e = t[0], r = t[t.length - 1], a = (s) => s.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return this._weekOffset === 0 ? "This week" : this._weekOffset === -1 ? "Last week" : this._weekOffset === 1 ? "Next week" : `${a(e)} – ${a(r)}`;
  }
  render() {
    var s, n;
    if (!this._config) return c``;
    const t = ((s = this._config.visible_hours) == null ? void 0 : s.start) ?? "07:00", e = ((n = this._config.visible_hours) == null ? void 0 : n.end) ?? "21:00", r = ft(this._config.calendars, this.hass), a = ft(this._creatableCalendars, this.hass);
    return c`
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
            .calendars=${r}
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
            .calendars=${r}
            .showCreateButton=${(this._config.show_create_button ?? !0) && this._creatableCalendars.length > 0}
          ></lucarne-calendar-grid>
        </div>

        ${this._openEvent ? c`
              <lucarne-calendar-event-popover
                .event=${this._openEvent}
                .color=${this._openEventColor}
                .calendarLabel=${this._openEventCalLabel}
                @popover-close=${this._closePopover}
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
E.styles = [
  C,
  v`
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
        max-height: calc(100vh - 280px);
        max-height: calc(100dvh - 280px);
        touch-action: pan-x pan-y;
        -webkit-overflow-scrolling: touch;
      }
    `
];
S([
  h({ attribute: !1 })
], E.prototype, "hass", 2);
S([
  f()
], E.prototype, "_config", 2);
S([
  f()
], E.prototype, "_layout", 2);
S([
  f()
], E.prototype, "_visibleIds", 2);
S([
  f()
], E.prototype, "_weekOffset", 2);
S([
  f()
], E.prototype, "_openEvent", 2);
S([
  f()
], E.prototype, "_openEventColor", 2);
S([
  f()
], E.prototype, "_openEventCalLabel", 2);
S([
  f()
], E.prototype, "_createDay", 2);
S([
  f()
], E.prototype, "_createStartHour", 2);
S([
  f()
], E.prototype, "_creatableCalendars", 2);
E = S([
  _("lucarne-calendar-card")
], E);
var Zr = Object.defineProperty, Qr = Object.getOwnPropertyDescriptor, Oe = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Qr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Zr(e, r, s), s;
};
let Q = class extends m {
  constructor() {
    super(...arguments), this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), Fe().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    We(this, "config-changed", { config: t });
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
    var a, s;
    const r = [...((a = this._config) == null ? void 0 : a.calendars) ?? []];
    r[t] = { ...r[t], entity: ((s = e.detail) == null ? void 0 : s.value) ?? "" }, this._fire({ ...this._config, calendars: r });
  }
  _calColorChanged(t, e) {
    var a;
    const r = [...((a = this._config) == null ? void 0 : a.calendars) ?? []];
    r[t] = { ...r[t], color: e.target.value }, this._fire({ ...this._config, calendars: r });
  }
  _removeCalendar(t) {
    var r;
    const e = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, calendars: e }));
  }
  _addCalendar() {
    var a, s;
    const e = Object.keys(((a = this.hass) == null ? void 0 : a.states) ?? {}).find((n) => n.startsWith("calendar.")) ?? "calendar.example", r = [
      ...((s = this._config) == null ? void 0 : s.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  render() {
    var s, n;
    if (!this._config) return c``;
    if (!this._haReady) return c`<div class="loading">Loading editor…</div>`;
    const t = this._config.calendars ?? [], e = ((s = this._config.visible_hours) == null ? void 0 : s.start) ?? "07:00", r = ((n = this._config.visible_hours) == null ? void 0 : n.end) ?? "21:00", a = this._config.show_create_button ?? !0;
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
            .value=${r}
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

      <div class="section-label">Calendars</div>
      ${t.map(
      (i, l) => c`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${i.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(o) => this._calEntityChanged(l, o)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${i.color}
              @input=${(o) => this._calColorChanged(l, o)}
              title="Calendar color"
            />
            <button type="button" class="remove" @click=${() => this._removeCalendar(l)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addCalendar}>+ Add calendar</button>
    `;
  }
};
Q.styles = [C, Ht];
Oe([
  h({ attribute: !1 })
], Q.prototype, "hass", 2);
Oe([
  f()
], Q.prototype, "_config", 2);
Oe([
  f()
], Q.prototype, "_haReady", 2);
Q = Oe([
  _("lucarne-calendar-card-editor")
], Q);
function Ct(t) {
  return t.length === 0 ? !1 : t.every((e) => e.state === "on");
}
var Xr = Object.defineProperty, ea = Object.getOwnPropertyDescriptor, Me = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? ea(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Xr(e, r, s), s;
};
let X = class extends m {
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
X.styles = v`
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
Me([
  h()
], X.prototype, "name", 2);
Me([
  h()
], X.prototype, "color", 2);
Me([
  h({ attribute: "avatar-url" })
], X.prototype, "avatarUrl", 2);
X = Me([
  _("lucarne-kid-avatar")
], X);
var ta = Object.defineProperty, ra = Object.getOwnPropertyDescriptor, _e = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? ra(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && ta(e, r, s), s;
};
let B = class extends m {
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
B.styles = v`
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
_e([
  h({ attribute: !1 })
], B.prototype, "hass", 2);
_e([
  h()
], B.prototype, "name", 2);
_e([
  h({ attribute: "entity-id" })
], B.prototype, "entityId", 2);
_e([
  h({ type: Boolean, attribute: "is-done" })
], B.prototype, "isDone", 2);
B = _e([
  _("lucarne-chore-row")
], B);
var aa = Object.defineProperty, sa = Object.getOwnPropertyDescriptor, Lt = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? sa(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && aa(e, r, s), s;
};
let Ee = class extends m {
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
Ee.styles = v`
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
Lt([
  h({ type: Number })
], Ee.prototype, "streak", 2);
Ee = Lt([
  _("lucarne-streak-display")
], Ee);
var na = Object.defineProperty, ia = Object.getOwnPropertyDescriptor, Ve = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? ia(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && na(e, r, s), s;
};
let ge = class extends m {
  constructor() {
    super(...arguments), this.kidSlug = "", this.active = !1, this._dots = [];
  }
  connectedCallback() {
    super.connectedCallback(), this._generateDots();
  }
  _generateDots() {
    const t = ["#f5c89c", "#b8e0d2", "#f0b8c8", "#a8d8b9", "#c8b4e0", "#f0dca0"];
    this._dots = Array.from({ length: 18 }, (e, r) => ({
      left: `${r / 17 * 90 + 5}%`,
      color: t[r % t.length],
      delay: `${(r * 0.08).toFixed(2)}s`,
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
ge.styles = v`
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
Ve([
  h({ attribute: "kid-slug" })
], ge.prototype, "kidSlug", 2);
Ve([
  h({ type: Boolean })
], ge.prototype, "active", 2);
ge = Ve([
  _("lucarne-celebration-overlay")
], ge);
var oa = Object.defineProperty, la = Object.getOwnPropertyDescriptor, re = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? la(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && oa(e, r, s), s;
};
let z = class extends m {
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
      var a, s;
      const r = ((s = (a = this.hass) == null ? void 0 : a.states[e.entity]) == null ? void 0 : s.state) ?? "unavailable";
      return c`
              <lucarne-chore-row
                .hass=${this.hass}
                name=${e.name}
                entity-id=${e.entity}
                ?is-done=${r === "on"}
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
z.styles = v`
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
re([
  h({ attribute: !1 })
], z.prototype, "hass", 2);
re([
  h({ attribute: !1 })
], z.prototype, "kid", 2);
re([
  h({ type: Number })
], z.prototype, "streak", 2);
re([
  h({ type: Boolean })
], z.prototype, "celebrating", 2);
re([
  h({ type: Boolean, attribute: "all-done" })
], z.prototype, "allDone", 2);
z = re([
  _("lucarne-kid-column")
], z);
var ca = Object.defineProperty, da = Object.getOwnPropertyDescriptor, Ye = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? da(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && ca(e, r, s), s;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-chores-card",
  name: "Lucarne Chores",
  description: "Kid chore grid with streaks and celebration",
  preview: !0
});
let fe = class extends m {
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
        const r = e.name.toLowerCase().replace(/\s+/g, "_"), a = e.chores.map((i) => {
          var l;
          return {
            state: ((l = this.hass.states[i.entity]) == null ? void 0 : l.state) ?? "unavailable"
          };
        }), s = Ct(a), n = this._lastAllDoneByKid.get(r) ?? null;
        if (n === null) {
          this._lastAllDoneByKid.set(r, s);
          continue;
        }
        n === !1 && s === !0 ? (this._lastAllDoneByKid.set(r, !0), this._triggerCelebration(r, e)) : n === !0 && s === !1 && this._lastAllDoneByKid.set(r, !1);
      }
  }
  _triggerCelebration(t, e) {
    var o;
    this._celebratingKids = new Set(this._celebratingKids).add(t), this.requestUpdate();
    const r = this._celebrationTimers.get(t);
    r && clearTimeout(r);
    const a = setTimeout(() => {
      this._celebratingKids = new Set(
        [...this._celebratingKids].filter((d) => d !== t)
      ), this._celebrationTimers.delete(t), this.requestUpdate();
    }, 2200);
    this._celebrationTimers.set(t, a);
    const s = (o = this.hass) == null ? void 0 : o.states[e.streak], n = s ? parseInt(s.state, 10) : 0, i = /* @__PURE__ */ new Date(), l = `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}-${String(i.getDate()).padStart(2, "0")}`;
    this.hass.connection.sendMessagePromise({
      type: "fire_event",
      event_type: "ha_lucarne_chores_all_done",
      event_data: {
        kid_slug: t,
        kid_name: e.name,
        date: l,
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
          ${e.map((r) => {
      var o;
      const a = r.name.toLowerCase().replace(/\s+/g, "_"), s = (o = this.hass) == null ? void 0 : o.states[r.streak], n = s ? parseInt(s.state, 10) : 0, i = r.chores.map((d) => {
        var g, p;
        return {
          state: ((p = (g = this.hass) == null ? void 0 : g.states[d.entity]) == null ? void 0 : p.state) ?? "unavailable"
        };
      }), l = Ct(i);
      return c`
              <div class="kid-cell">
                <lucarne-kid-column
                  .hass=${this.hass}
                  .kid=${r}
                  .streak=${isNaN(n) ? 0 : n}
                  ?celebrating=${this._celebratingKids.has(a)}
                  ?all-done=${l}
                ></lucarne-kid-column>
              </div>
            `;
    })}
        </div>
      </ha-card>
    `;
  }
};
fe.styles = [
  C,
  v`
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
Ye([
  h({ attribute: !1 })
], fe.prototype, "hass", 2);
Ye([
  f()
], fe.prototype, "_config", 2);
fe = Ye([
  _("lucarne-chores-card")
], fe);
var ha = Object.defineProperty, pa = Object.getOwnPropertyDescriptor, Te = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? pa(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && ha(e, r, s), s;
};
let ee = class extends m {
  constructor() {
    super(...arguments), this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), Fe().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    We(this, "config-changed", { config: t });
  }
  _titleChanged(t) {
    const e = t.target.value;
    this._fire({ ...this._config, title: e || void 0 });
  }
  _kidFieldChanged(t, e, r) {
    var s;
    const a = [...((s = this._config) == null ? void 0 : s.kids) ?? []];
    a[t] = { ...a[t], [e]: r.target.value }, this._fire({ ...this._config, kids: a });
  }
  _kidColorChanged(t, e) {
    var a;
    const r = [...((a = this._config) == null ? void 0 : a.kids) ?? []];
    r[t] = { ...r[t], color: e.target.value }, this._fire({ ...this._config, kids: r });
  }
  _kidStreakChanged(t, e) {
    var a, s;
    const r = [...((a = this._config) == null ? void 0 : a.kids) ?? []];
    r[t] = { ...r[t], streak: ((s = e.detail) == null ? void 0 : s.value) ?? "" }, this._fire({ ...this._config, kids: r });
  }
  _choreNameChanged(t, e, r) {
    var n;
    const a = [...((n = this._config) == null ? void 0 : n.kids) ?? []], s = [...a[t].chores];
    s[e] = { ...s[e], name: r.target.value }, a[t] = { ...a[t], chores: s }, this._fire({ ...this._config, kids: a });
  }
  _choreEntityChanged(t, e, r) {
    var n, i;
    const a = [...((n = this._config) == null ? void 0 : n.kids) ?? []], s = [...a[t].chores];
    s[e] = { ...s[e], entity: ((i = r.detail) == null ? void 0 : i.value) ?? "" }, a[t] = { ...a[t], chores: s }, this._fire({ ...this._config, kids: a });
  }
  _removeChore(t, e) {
    var s;
    const r = [...((s = this._config) == null ? void 0 : s.kids) ?? []], a = [...r[t].chores];
    a.length <= 1 || (a.splice(e, 1), r[t] = { ...r[t], chores: a }, this._fire({ ...this._config, kids: r }));
  }
  _addChore(t) {
    var a;
    const e = [...((a = this._config) == null ? void 0 : a.kids) ?? []], r = [...e[t].chores, { name: "New chore", entity: "" }];
    e[t] = { ...e[t], chores: r }, this._fire({ ...this._config, kids: e });
  }
  _removeKid(t) {
    var r;
    const e = [...((r = this._config) == null ? void 0 : r.kids) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, kids: e }));
  }
  _addKid() {
    var n;
    const t = ((n = this._config) == null ? void 0 : n.kids) ?? [], e = new Set(
      t.map((i) => i.name.toLowerCase().replace(/\s+/g, "_"))
    ), r = ["#f5c89c", "#b8e0d2", "#f0b8c8", "#a8d8b9", "#c8b4e0"];
    let a = t.length + 1;
    for (; e.has(`kid_${a}`); ) a++;
    const s = [
      ...t,
      {
        name: `Kid ${a}`,
        color: r[(a - 1) % r.length],
        streak: `counter.kid_${a}_streak`,
        chores: [{ name: "Chore 1", entity: "" }]
      }
    ];
    this._fire({ ...this._config, kids: s });
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
      (e, r) => c`
          <div class="kid-block">
            <div class="kid-header">
              <div class="kid-header-fields">
                <ha-textfield
                  label="Name"
                  .value=${e.name}
                  @change=${(a) => this._kidFieldChanged(r, "name", a)}
                ></ha-textfield>
                <ha-textfield
                  label="Avatar URL (optional)"
                  .value=${e.avatar ?? ""}
                  @change=${(a) => this._kidFieldChanged(r, "avatar", a)}
                ></ha-textfield>
              </div>
              <button type="button" class="remove" @click=${() => this._removeKid(r)} title="Remove kid">✕</button>
            </div>

            <div class="color-row">
              <input
                type="color"
                class="color-swatch"
                .value=${e.color}
                @input=${(a) => this._kidColorChanged(r, a)}
                title="Kid color"
              />
              <ha-entity-picker
                label="Streak counter"
                .hass=${this.hass}
                .value=${e.streak}
                .includeDomains=${["counter"]}
                allow-custom-entity
                @value-changed=${(a) => this._kidStreakChanged(r, a)}
              ></ha-entity-picker>
            </div>

            <div class="chore-label">Chores</div>
            ${e.chores.map(
        (a, s) => c`
                <div class="chore-row">
                  <ha-textfield
                    label="Chore name"
                    .value=${a.name}
                    @change=${(n) => this._choreNameChanged(r, s, n)}
                  ></ha-textfield>
                  <ha-entity-picker
                    label="Entity"
                    .hass=${this.hass}
                    .value=${a.entity}
                    .includeDomains=${["input_boolean"]}
                    allow-custom-entity
                    @value-changed=${(n) => this._choreEntityChanged(r, s, n)}
                  ></ha-entity-picker>
                  <button type="button" class="remove" @click=${() => this._removeChore(r, s)} title="Remove">✕</button>
                </div>
              `
      )}
            <button type="button" class="add" @click=${() => this._addChore(r)}>+ Add chore</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addKid}>+ Add kid</button>
    `;
  }
};
ee.styles = [
  C,
  v`
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
Te([
  h({ attribute: !1 })
], ee.prototype, "hass", 2);
Te([
  f()
], ee.prototype, "_config", 2);
Te([
  f()
], ee.prototype, "_haReady", 2);
ee = Te([
  _("lucarne-chores-card-editor")
], ee);
//# sourceMappingURL=ha-lucarne.js.map
