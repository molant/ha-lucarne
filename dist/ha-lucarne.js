/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe = globalThis, Ie = xe.ShadowRoot && (xe.ShadyCSS === void 0 || xe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ue = Symbol(), Xe = /* @__PURE__ */ new WeakMap();
let Pt = class {
  constructor(e, r, a) {
    if (this._$cssResult$ = !0, a !== Ue) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = r;
  }
  get styleSheet() {
    let e = this.o;
    const r = this.t;
    if (Ie && e === void 0) {
      const a = r !== void 0 && r.length === 1;
      a && (e = Xe.get(r)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && Xe.set(r, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Rt = (t) => new Pt(typeof t == "string" ? t : t + "", void 0, Ue), _ = (t, ...e) => {
  const r = t.length === 1 ? t[0] : e.reduce((a, s, n) => a + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[n + 1], t[0]);
  return new Pt(r, t, Ue);
}, Kt = (t, e) => {
  if (Ie) t.adoptedStyleSheets = e.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of e) {
    const a = document.createElement("style"), s = xe.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = r.cssText, t.appendChild(a);
  }
}, et = Ie ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let r = "";
  for (const a of e.cssRules) r += a.cssText;
  return Rt(r);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ft, defineProperty: Wt, getOwnPropertyDescriptor: qt, getOwnPropertyNames: Vt, getOwnPropertySymbols: Yt, getPrototypeOf: Gt } = Object, T = globalThis, tt = T.trustedTypes, Jt = tt ? tt.emptyScript : "", He = T.reactiveElementPolyfillSupport, ie = (t, e) => t, Ce = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Jt : null;
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
} }, Be = (t, e) => !Ft(t, e), rt = { attribute: !0, type: String, converter: Ce, reflect: !1, useDefault: !1, hasChanged: Be };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), T.litPropertyMetadata ?? (T.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let q = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, r = rt) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(e, r), !r.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(e, a, r);
      s !== void 0 && Wt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, r, a) {
    const { get: s, set: n } = qt(this.prototype, e) ?? { get() {
      return this[r];
    }, set(i) {
      this[r] = i;
    } };
    return { get: s, set(i) {
      const o = s == null ? void 0 : s.call(this);
      n == null || n.call(this, i), this.requestUpdate(e, o, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ie("elementProperties"))) return;
    const e = Gt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ie("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ie("properties"))) {
      const r = this.properties, a = [...Vt(r), ...Yt(r)];
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
      for (const s of a) r.unshift(et(s));
    } else e !== void 0 && r.push(et(e));
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
    return Kt(e, this.constructor.elementStyles), e;
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
      const i = (((n = a.converter) == null ? void 0 : n.toAttribute) !== void 0 ? a.converter : Ce).toAttribute(r, a.type);
      this._$Em = e, i == null ? this.removeAttribute(s) : this.setAttribute(s, i), this._$Em = null;
    }
  }
  _$AK(e, r) {
    var n, i;
    const a = this.constructor, s = a._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const o = a.getPropertyOptions(s), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : Ce;
      this._$Em = s;
      const d = l.fromAttribute(r, o.type);
      this[s] = d ?? ((i = this._$Ej) == null ? void 0 : i.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, r, a, s = !1, n) {
    var i;
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (n = this[e]), a ?? (a = o.getPropertyOptions(e)), !((a.hasChanged ?? Be)(n, r) || a.useDefault && a.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(o._$Eu(e, a)))) return;
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
        const { wrapped: o } = i, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, i, l);
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
q.elementStyles = [], q.shadowRootOptions = { mode: "open" }, q[ie("elementProperties")] = /* @__PURE__ */ new Map(), q[ie("finalized")] = /* @__PURE__ */ new Map(), He == null || He({ ReactiveElement: q }), (T.reactiveElementVersions ?? (T.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = globalThis, at = (t) => t, ke = oe.trustedTypes, st = ke ? ke.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, At = "$lit$", M = `lit$${Math.random().toFixed(9).slice(2)}$`, Ot = "?" + M, Zt = `<${Ot}>`, U = document, ce = () => U.createComment(""), de = (t) => t === null || typeof t != "object" && typeof t != "function", Re = Array.isArray, Qt = (t) => Re(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", je = `[ 	
\f\r]`, se = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, nt = /-->/g, it = />/g, L = RegExp(`>|${je}(?:([^\\s"'>=/]+)(${je}*=${je}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, lt = /"/g, Mt = /^(?:script|style|textarea|title)$/i, Tt = (t) => (e, ...r) => ({ _$litType$: t, strings: e, values: r }), c = Tt(1), j = Tt(2), Y = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), ct = /* @__PURE__ */ new WeakMap(), N = U.createTreeWalker(U, 129);
function zt(t, e) {
  if (!Re(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(e) : e;
}
const Xt = (t, e) => {
  const r = t.length - 1, a = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = se;
  for (let o = 0; o < r; o++) {
    const l = t[o];
    let d, p, u = -1, v = 0;
    for (; v < l.length && (i.lastIndex = v, p = i.exec(l), p !== null); ) v = i.lastIndex, i === se ? p[1] === "!--" ? i = nt : p[1] !== void 0 ? i = it : p[2] !== void 0 ? (Mt.test(p[2]) && (s = RegExp("</" + p[2], "g")), i = L) : p[3] !== void 0 && (i = L) : i === L ? p[0] === ">" ? (i = s ?? se, u = -1) : p[1] === void 0 ? u = -2 : (u = i.lastIndex - p[2].length, d = p[1], i = p[3] === void 0 ? L : p[3] === '"' ? lt : ot) : i === lt || i === ot ? i = L : i === nt || i === it ? i = se : (i = L, s = void 0);
    const g = i === L && t[o + 1].startsWith("/>") ? " " : "";
    n += i === se ? l + Zt : u >= 0 ? (a.push(d), l.slice(0, u) + At + l.slice(u) + M + g) : l + M + (u === -2 ? o : g);
  }
  return [zt(t, n + (t[r] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class he {
  constructor({ strings: e, _$litType$: r }, a) {
    let s;
    this.parts = [];
    let n = 0, i = 0;
    const o = e.length - 1, l = this.parts, [d, p] = Xt(e, r);
    if (this.el = he.createElement(d, a), N.currentNode = this.el.content, r === 2 || r === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = N.nextNode()) !== null && l.length < o; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const u of s.getAttributeNames()) if (u.endsWith(At)) {
          const v = p[i++], g = s.getAttribute(u).split(M), w = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: n, name: w[2], strings: g, ctor: w[1] === "." ? tr : w[1] === "?" ? rr : w[1] === "@" ? ar : De }), s.removeAttribute(u);
        } else u.startsWith(M) && (l.push({ type: 6, index: n }), s.removeAttribute(u));
        if (Mt.test(s.tagName)) {
          const u = s.textContent.split(M), v = u.length - 1;
          if (v > 0) {
            s.textContent = ke ? ke.emptyScript : "";
            for (let g = 0; g < v; g++) s.append(u[g], ce()), N.nextNode(), l.push({ type: 2, index: ++n });
            s.append(u[v], ce());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ot) l.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = s.data.indexOf(M, u + 1)) !== -1; ) l.push({ type: 7, index: n }), u += M.length - 1;
      }
      n++;
    }
  }
  static createElement(e, r) {
    const a = U.createElement("template");
    return a.innerHTML = e, a;
  }
}
function G(t, e, r = t, a) {
  var i, o;
  if (e === Y) return e;
  let s = a !== void 0 ? (i = r._$Co) == null ? void 0 : i[a] : r._$Cl;
  const n = de(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((o = s == null ? void 0 : s._$AO) == null || o.call(s, !1), n === void 0 ? s = void 0 : (s = new n(t), s._$AT(t, r, a)), a !== void 0 ? (r._$Co ?? (r._$Co = []))[a] = s : r._$Cl = s), s !== void 0 && (e = G(t, s._$AS(t, e.values), s, a)), e;
}
class er {
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
    const { el: { content: r }, parts: a } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? U).importNode(r, !0);
    N.currentNode = s;
    let n = N.nextNode(), i = 0, o = 0, l = a[0];
    for (; l !== void 0; ) {
      if (i === l.index) {
        let d;
        l.type === 2 ? d = new ve(n, n.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (d = new sr(n, this, e)), this._$AV.push(d), l = a[++o];
      }
      i !== (l == null ? void 0 : l.index) && (n = N.nextNode(), i++);
    }
    return N.currentNode = U, s;
  }
  p(e) {
    let r = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, r), r += a.strings.length - 2) : a._$AI(e[r])), r++;
  }
}
class ve {
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
    e = G(this, e, r), de(e) ? e === $ || e == null || e === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : e !== this._$AH && e !== Y && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Qt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== $ && de(this._$AH) ? this._$AA.nextSibling.data = e : this.T(U.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: r, _$litType$: a } = e, s = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = he.createElement(zt(a.h, a.h[0]), this.options)), a);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(r);
    else {
      const i = new er(s, this), o = i.u(this.options);
      i.p(r), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let r = ct.get(e.strings);
    return r === void 0 && ct.set(e.strings, r = new he(e)), r;
  }
  k(e) {
    Re(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let a, s = 0;
    for (const n of e) s === r.length ? r.push(a = new ve(this.O(ce()), this.O(ce()), this, this.options)) : a = r[s], a._$AI(n), s++;
    s < r.length && (this._$AR(a && a._$AB.nextSibling, s), r.length = s);
  }
  _$AR(e = this._$AA.nextSibling, r) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, r); e !== this._$AB; ) {
      const s = at(e).nextSibling;
      at(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var r;
    this._$AM === void 0 && (this._$Cv = e, (r = this._$AP) == null || r.call(this, e));
  }
}
class De {
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
    if (n === void 0) e = G(this, e, r, 0), i = !de(e) || e !== this._$AH && e !== Y, i && (this._$AH = e);
    else {
      const o = e;
      let l, d;
      for (e = n[0], l = 0; l < n.length - 1; l++) d = G(this, o[a + l], r, l), d === Y && (d = this._$AH[l]), i || (i = !de(d) || d !== this._$AH[l]), d === $ ? e = $ : e !== $ && (e += (d ?? "") + n[l + 1]), this._$AH[l] = d;
    }
    i && !s && this.j(e);
  }
  j(e) {
    e === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class tr extends De {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === $ ? void 0 : e;
  }
}
class rr extends De {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== $);
  }
}
class ar extends De {
  constructor(e, r, a, s, n) {
    super(e, r, a, s, n), this.type = 5;
  }
  _$AI(e, r = this) {
    if ((e = G(this, e, r, 0) ?? $) === Y) return;
    const a = this._$AH, s = e === $ && a !== $ || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, n = e !== $ && (a === $ || s);
    s && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var r;
    typeof this._$AH == "function" ? this._$AH.call(((r = this.options) == null ? void 0 : r.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class sr {
  constructor(e, r, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    G(this, e);
  }
}
const Le = oe.litHtmlPolyfillSupport;
Le == null || Le(he, ve), (oe.litHtmlVersions ?? (oe.litHtmlVersions = [])).push("3.3.3");
const nr = (t, e, r) => {
  const a = (r == null ? void 0 : r.renderBefore) ?? e;
  let s = a._$litPart$;
  if (s === void 0) {
    const n = (r == null ? void 0 : r.renderBefore) ?? null;
    a._$litPart$ = s = new ve(e.insertBefore(ce(), n), n, void 0, r ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis;
class m extends q {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = nr(r, this.renderRoot, this.renderOptions);
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
    return Y;
  }
}
var Dt;
m._$litElement$ = !0, m.finalized = !0, (Dt = I.litElementHydrateSupport) == null || Dt.call(I, { LitElement: m });
const Ne = I.litElementPolyfillSupport;
Ne == null || Ne({ LitElement: m });
(I.litElementVersions ?? (I.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y = (t) => (e, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ir = { attribute: !0, type: String, converter: Ce, reflect: !1, hasChanged: Be }, or = (t = ir, e, r) => {
  const { kind: a, metadata: s } = r;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(r.name, t), a === "accessor") {
    const { name: i } = r;
    return { set(o) {
      const l = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(i, l, t, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(i, void 0, t, o), o;
    } };
  }
  if (a === "setter") {
    const { name: i } = r;
    return function(o) {
      const l = this[i];
      e.call(this, o), this.requestUpdate(i, l, t, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function h(t) {
  return (e, r) => typeof r == "object" ? or(t, e, r) : ((a, s, n) => {
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
const C = _`
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
function lr(t, e, r) {
  let a, s = !1;
  return t.connection.subscribeMessage(
    (n) => {
      var i, o;
      (o = (i = n.variables) == null ? void 0 : i.trigger) != null && o.to_state && r(n.variables.trigger.to_state);
    },
    { type: "subscribe_trigger", trigger: { platform: "state", entity_id: e } }
  ).then((n) => {
    s ? n() : a = n;
  }), () => {
    s = !0, a == null || a();
  };
}
async function Ht(t, e, r, a) {
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
        var o, l;
        return [n, ((l = (o = i == null ? void 0 : i.response) == null ? void 0 : o[n]) == null ? void 0 : l.events) ?? []];
      }).catch((i) => (console.warn(`[lucarne] calendar.get_events failed for ${n}:`, i), [n, []]))
    )
  );
  return new Map(s);
}
function cr(t, e, r) {
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
  return a(), lr(t, e, () => a());
}
function dr(t) {
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
function hr(t) {
  let e = t.parentElement;
  for (; e && !e.style.getPropertyValue("--column-size"); )
    e = e.parentElement;
  return (e == null ? void 0 : e.parentElement) ?? null;
}
function jt(t) {
  if (!dr(t)) return null;
  const e = hr(t);
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
const b = {
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
var pr = Object.defineProperty, ur = Object.getOwnPropertyDescriptor, Pe = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? ur(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && pr(e, r, s), s;
};
function le(t) {
  return t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
}
function gr(t, e, r) {
  return t.filter((a) => le(a.end) > e).sort((a, s) => le(a.start).getTime() - le(s.start).getTime()).slice(0, r);
}
function fr(t, e, r) {
  const a = t.getTime() - r.getTime();
  if (t <= r && r < e) return b.timePillNow;
  if (a > 0 && a < 60 * 60 * 1e3) {
    const d = Math.round(a / 6e4);
    return b.timePillInMinutes(d);
  }
  if (a > 0 && a < 2 * 60 * 60 * 1e3) {
    const d = Math.round(a / 36e5);
    return b.timePillInHours(d);
  }
  const n = t.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (t.toDateString() === r.toDateString()) return n;
  const o = new Date(r);
  return o.setDate(r.getDate() + 1), t.toDateString() === o.toDateString() ? b.timePillTomorrow(n) : `${t.toLocaleDateString("en", { weekday: "short" })} ${n}`;
}
function mr(t) {
  return t.start.length === 10 && t.end.length === 10;
}
let J = class extends m {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.limit = 5;
  }
  render() {
    const t = /* @__PURE__ */ new Date(), e = gr(this.events, t, this.limit);
    return e.length === 0 ? c`<div class="empty-state">${b.nothingOnCalendar}</div>` : c`
      ${e.map((r) => {
      const a = le(r.start), s = le(r.end), n = a <= t && t < s, i = mr(r) ? "all day" : fr(a, s, t), o = this._colorForEvent(r);
      return c`
          <div class="event-row">
            <div class="time-pill ${n ? "now" : ""}">
              ${n ? c`<span class="pulse-dot"></span>` : ""} ${i}
            </div>
            <div class="color-bar" style="background:${o}"></div>
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
J.styles = [
  C,
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
Pe([
  h({ type: Array })
], J.prototype, "events", 2);
Pe([
  h({ type: Object })
], J.prototype, "calendarColors", 2);
Pe([
  h({ type: Number })
], J.prototype, "limit", 2);
J = Pe([
  y("lucarne-agenda-strip")
], J);
const dt = j`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`, V = j`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>`, ne = j`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`, ht = j`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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
</svg>`, vr = j`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M4.22 19.78l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="currentColor"/>
  <path d="M20 15h-1.26A6 6 0 1 0 8 20h12a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.7"/>
</svg>`;
j`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="7" r="4"/>
  <path d="M20 21a8 8 0 1 0-16 0"/>
</svg>`;
j`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"/>
</svg>`;
const _r = j`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, pt = {
  sunny: dt,
  "clear-night": dt,
  cloudy: V,
  fog: V,
  hail: ne,
  lightning: ne,
  "lightning-rainy": ne,
  partlycloudy: vr,
  pouring: ne,
  rainy: ne,
  snowy: ht,
  "snowy-rainy": ht,
  windy: V,
  "windy-variant": V,
  exceptional: V
};
function ut(t) {
  return pt[t] ?? pt[t.toLowerCase()] ?? V;
}
const yr = {
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
function gt(t) {
  return yr[t.toLowerCase()] ?? "#8aa0b8";
}
function br(t) {
  if (!t.length) return b.dressingTipDefault;
  const e = t[0];
  if (e.condition.toLowerCase().includes("snow"))
    return b.dressingTipBoots;
  const a = e.temperature;
  let s;
  return a < 5 ? s = b.dressingTipHeavyCoat : a < 12 ? s = b.dressingTipCoatScarf : a < 18 ? s = b.dressingTipLightJacket : a < 24 ? s = b.dressingTipTShirt : s = b.dressingTipShorts, (e.precipitation_probability ?? 0) > 50 && (s += b.dressingTipUmbrella), s;
}
var wr = Object.defineProperty, $r = Object.getOwnPropertyDescriptor, Ke = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? $r(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && wr(e, r, s), s;
};
let pe = class extends m {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return c`<div class="empty-state">${b.addWeatherEntity}</div>`;
    const t = this.weatherEntity.attributes, e = t.temperature, r = t.temperature_unit ?? "°C", a = this.weatherEntity.state, s = this.forecast[0], n = this.forecast[1], i = br(this.forecast);
    return c`
      <div class="current">
        <span class="condition-icon" style="color: ${gt(a)}">${ut(a)}</span>
        <div class="temp-group">
          <div class="current-temp">${e !== void 0 ? `${Math.round(e)}${r}` : b.errorUnavailable}</div>
          ${s ? c`<div class="high-low">
                ↑${Math.round(s.temperature)}${r}
                ${s.templow !== void 0 ? ` ↓${Math.round(s.templow)}${r}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${n ? c`
            <div class="tomorrow-row">
              <span class="tomorrow-icon" style="color: ${gt(n.condition)}">${ut(n.condition)}</span>
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
pe.styles = [
  C,
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
Ke([
  h({ attribute: !1 })
], pe.prototype, "weatherEntity", 2);
Ke([
  h({ type: Array })
], pe.prototype, "forecast", 2);
pe = Ke([
  y("lucarne-weather-block")
], pe);
var xr = Object.defineProperty, Cr = Object.getOwnPropertyDescriptor, Fe = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Cr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && xr(e, r, s), s;
};
let ue = class extends m {
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
          <span class="empty-icon">${_r}</span>
          ${b.allDone}
        </div>
      ` : c`
      <div class="header">
        ${b.tasksTitle}
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
            ${b.moreItems(a)}
          </div>` : ""}
    `;
  }
  _formatDue(t) {
    const e = t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
    return isNaN(e.getTime()) ? t : e.toLocaleDateString("en", { month: "short", day: "numeric" });
  }
};
ue.styles = [
  C,
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
Fe([
  h({ type: Array })
], ue.prototype, "items", 2);
Fe([
  h({ type: String })
], ue.prototype, "todoEntityId", 2);
ue = Fe([
  y("lucarne-tasks-summary")
], ue);
var kr = Object.defineProperty, Er = Object.getOwnPropertyDescriptor, Lt = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Er(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && kr(e, r, s), s;
};
let Ee = class extends m {
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
Ee.styles = [
  C,
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
Lt([
  h({ type: Array })
], Ee.prototype, "entries", 2);
Ee = Lt([
  y("lucarne-presence-pills")
], Ee);
var Sr = Object.defineProperty, Dr = Object.getOwnPropertyDescriptor, re = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Dr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Sr(e, r, s), s;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-today-card",
  name: "Lucarne Today",
  description: "Family agenda + weather + tasks + presence",
  preview: !0
});
let z = class extends m {
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
      title: b.today,
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
      this._previewOverride = jt(this);
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
    }, 5 * 60 * 1e3), this._config.tasks && (this._todoUnsub = cr(this.hass, this._config.tasks, (t) => {
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
    const t = this._config.calendars.map((n) => n.entity), e = /* @__PURE__ */ new Date(), r = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), a = await Ht(this.hass, t, e, r), s = /* @__PURE__ */ new Map();
    for (const [n, i] of a.entries())
      s.set(
        n,
        i.map((o) => ({ ...o, uid: `${n}::${o.uid ?? o.summary}` }))
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
          <h2 class="card-title">${this._config.title ?? b.today}</h2>
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
z.styles = [
  C,
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
re([
  h({ attribute: !1 })
], z.prototype, "hass", 2);
re([
  f()
], z.prototype, "_config", 2);
re([
  f()
], z.prototype, "_calendarEvents", 2);
re([
  f()
], z.prototype, "_forecast", 2);
re([
  f()
], z.prototype, "_todoItems", 2);
z = re([
  y("lucarne-today-card")
], z);
const Nt = _`
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
`, ft = ["ha-entity-picker", "ha-textfield"], Pr = 3e3;
let be;
function Ar(t) {
  return new Promise((e) => setTimeout(e, t));
}
async function Or() {
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
    ft.map((s) => customElements.whenDefined(s))
  ).then(() => "ready"), r = Ar(Pr).then(() => "timeout");
  if (await Promise.race([e, r]) === "timeout" && !ft.every((s) => customElements.get(s)))
    throw new Error("[lucarne] HA form elements did not register within timeout");
}
function We() {
  return be || (be = Or().catch((t) => {
    throw be = void 0, t;
  })), be;
}
var mt, vt;
(function(t) {
  t.language = "language", t.system = "system", t.comma_decimal = "comma_decimal", t.decimal_comma = "decimal_comma", t.space_comma = "space_comma", t.none = "none";
})(mt || (mt = {})), function(t) {
  t.language = "language", t.system = "system", t.am_pm = "12", t.twenty_four = "24";
}(vt || (vt = {}));
var qe = function(t, e, r, a) {
  a = a || {}, r = r ?? {};
  var s = new Event(e, { bubbles: a.bubbles === void 0 || a.bubbles, cancelable: !!a.cancelable, composed: a.composed === void 0 || a.composed });
  return s.detail = r, t.dispatchEvent(s), s;
}, Mr = Object.defineProperty, Tr = Object.getOwnPropertyDescriptor, Ae = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Tr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Mr(e, r, s), s;
};
let Z = class extends m {
  constructor() {
    super(...arguments), this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), We().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    qe(this, "config-changed", { config: t });
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
Z.styles = [C, Nt];
Ae([
  h({ attribute: !1 })
], Z.prototype, "hass", 2);
Ae([
  f()
], Z.prototype, "_config", 2);
Ae([
  f()
], Z.prototype, "_haReady", 2);
Z = Ae([
  y("lucarne-today-card-editor")
], Z);
function It(t, e) {
  var a, s, n;
  const r = (n = (s = (a = e == null ? void 0 : e.states) == null ? void 0 : a[t.entity]) == null ? void 0 : s.attributes) == null ? void 0 : n.friendly_name;
  return typeof r == "string" && r ? r : t.entity;
}
function _t(t, e) {
  return t.map((r) => ({ ...r, label: It(r, e) }));
}
function Ve(t, e) {
  const r = new Date(t), n = (r.getDay() - (e === "monday" ? 1 : 0) + 7) % 7;
  return r.setDate(r.getDate() - n), r.setHours(0, 0, 0, 0), r;
}
function zr(t, e) {
  const r = Ve(t, e), a = new Date(r);
  return a.setDate(a.getDate() + 6), a.setHours(23, 59, 59, 999), a;
}
function Hr(t) {
  const e = [];
  for (let r = 0; r < 7; r++) {
    const a = new Date(t);
    a.setDate(t.getDate() + r), a.setHours(0, 0, 0, 0), e.push(a);
  }
  return e;
}
function yt(t, e) {
  const r = parseInt(t.split(":")[0], 10), a = parseInt(e.split(":")[0], 10), s = [];
  for (let n = r; n <= a; n++)
    s.push(n);
  return s;
}
function jr(t, e, r) {
  const [a, s] = e.split(":").map(Number), [n, i] = r.split(":").map(Number), o = new Date(t);
  o.setHours(a, s, 0, 0);
  const l = new Date(t);
  return l.setHours(n, i, 0, 0), { bandStartMs: o.getTime(), bandEndMs: l.getTime() };
}
function Lr(t, e, r, a) {
  const s = bt(t.start).getTime(), n = bt(t.end).getTime(), { bandStartMs: i, bandEndMs: o } = jr(e, r, a), l = Math.max(s, i), d = Math.min(n, o);
  return l >= d ? null : { start: new Date(l), end: new Date(d) };
}
function bt(t) {
  return t.length === 10 && !t.includes("T") ? /* @__PURE__ */ new Date(`${t}T00:00:00`) : new Date(t);
}
function Nr(t) {
  return t.start.length === 10 && !t.start.includes("T");
}
function we(t) {
  const e = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return `${e}-${r}-${a}`;
}
function Ir(t) {
  if (t.length === 0) return [];
  const e = t.map((l, d) => ({ ...l, _idx: d }));
  e.sort((l, d) => l.start.getTime() - d.start.getTime());
  const r = [], a = new Array(t.length);
  for (const l of e) {
    const d = l.start.getTime();
    let p = r.findIndex((u) => u <= d);
    p === -1 ? (p = r.length, r.push(l.end.getTime())) : r[p] = l.end.getTime(), a[l._idx] = p;
  }
  const s = new Array(t.length), n = [];
  let i = 0, o = e[0].end.getTime();
  s[e[0]._idx] = 0, n.push(a[e[0]._idx]);
  for (let l = 1; l < e.length; l++) {
    const d = e[l];
    d.start.getTime() >= o ? (i++, n.push(0), o = d.end.getTime()) : o = Math.max(o, d.end.getTime()), s[d._idx] = i, n[i] = Math.max(n[i], a[d._idx]);
  }
  return a.map((l, d) => ({
    lane: l,
    laneCount: n[s[d]] + 1
  }));
}
function $e(t, e) {
  const [r, a] = e.split(":").map(Number), s = new Date(t);
  return s.setHours(r, a, 0, 0), s.getTime();
}
function Ur(t, e, r, a, s) {
  const n = Hr(Ve(e, s)), i = /* @__PURE__ */ new Map();
  for (const o of n)
    i.set(we(o), { allDay: [], inBand: [], earlier: [], later: [] });
  for (const o of t) {
    if (Nr(o)) {
      const p = /* @__PURE__ */ new Date(o.start + "T00:00:00"), u = /* @__PURE__ */ new Date(o.end + "T00:00:00");
      for (const v of n) {
        const g = we(v), w = i.get(g);
        v >= p && v < u && w.allDay.push(o);
      }
      continue;
    }
    const l = new Date(o.start), d = new Date(o.end);
    for (const p of n) {
      const u = we(p), v = i.get(u), g = new Date(p);
      g.setHours(0, 0, 0, 0);
      const w = new Date(p);
      if (w.setHours(23, 59, 59, 999), d <= g || l > w) continue;
      const P = $e(p, r), S = $e(p, a);
      if (d.getTime() <= P)
        v.earlier.push(o);
      else if (l.getTime() >= S)
        v.later.push(o);
      else {
        const W = Lr(o, p, r, a);
        if (W) {
          const Ze = S - P, Qe = (W.start.getTime() - P) / Ze * 100, Bt = (W.end.getTime() - W.start.getTime()) / Ze * 100;
          v.inBand.push({
            event: o,
            lane: 0,
            laneCount: 1,
            topPercent: Math.max(0, Math.min(100, Qe)),
            heightPercent: Math.max(0, Math.min(100 - Qe, Bt))
          });
        }
      }
    }
  }
  for (const o of n) {
    const l = we(o), d = i.get(l);
    if (d.inBand.length === 0) continue;
    const p = $e(o, r), v = $e(o, a) - p, g = d.inBand.map((P) => {
      const S = p + P.topPercent / 100 * v, W = S + P.heightPercent / 100 * v;
      return {
        event: P.event,
        start: new Date(S),
        end: new Date(W),
        lane: 0
      };
    }), w = Ir(g);
    d.inBand = d.inBand.map((P, S) => ({
      ...P,
      lane: w[S].lane,
      laneCount: w[S].laneCount
    }));
  }
  return { weekDays: n, perDay: i };
}
var Br = Object.defineProperty, Rr = Object.getOwnPropertyDescriptor, Ye = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Rr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Br(e, r, s), s;
};
let ge = class extends m {
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
ge.styles = [
  C,
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
Ye([
  h({ type: Array })
], ge.prototype, "calendars", 2);
Ye([
  h({ type: Object })
], ge.prototype, "visibleIds", 2);
ge = Ye([
  y("lucarne-visibility-pills")
], ge);
var Kr = Object.defineProperty, Fr = Object.getOwnPropertyDescriptor, K = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Fr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Kr(e, r, s), s;
};
function wt(t) {
  return t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
}
let A = class extends m {
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
    const t = new Date(this.event.start), e = new Date(this.event.end), r = `${wt(t)}–${wt(e)}`, a = this.event.pending ? "0.5" : "1";
    return c`
      <div @click=${this._handleClick} style="height:100%;width:100%;overflow:hidden;opacity:${a}">
        <div class="event-summary">${this.event.summary}</div>
        <div class="event-time">${r}</div>
      </div>
    `;
  }
};
A.styles = [
  C,
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
K([
  h({ type: Object })
], A.prototype, "event", 2);
K([
  h({ type: String })
], A.prototype, "color", 2);
K([
  h({ type: Number })
], A.prototype, "lane", 2);
K([
  h({ type: Number })
], A.prototype, "laneCount", 2);
K([
  h({ type: Number })
], A.prototype, "topPercent", 2);
K([
  h({ type: Number })
], A.prototype, "heightPercent", 2);
A = K([
  y("lucarne-calendar-event-block")
], A);
var Wr = Object.defineProperty, qr = Object.getOwnPropertyDescriptor, _e = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? qr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Wr(e, r, s), s;
};
let B = class extends m {
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
B.styles = [
  C,
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
_e([
  h({ type: Array })
], B.prototype, "events", 2);
_e([
  h({ type: String })
], B.prototype, "label", 2);
_e([
  h({ type: Object })
], B.prototype, "eventColors", 2);
_e([
  f()
], B.prototype, "_open", 2);
B = _e([
  y("lucarne-out-of-band-stub")
], B);
var Vr = Object.defineProperty, Yr = Object.getOwnPropertyDescriptor, F = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Yr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Vr(e, r, s), s;
};
function $t(t) {
  const e = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return `${e}-${r}-${a}`;
}
function xt(t, e) {
  return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
}
let O = class extends m {
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
    const a = t.currentTarget.getBoundingClientRect(), [s] = this.bandStart.split(":").map(Number), [n] = this.bandEnd.split(":").map(Number), i = n - s, o = Math.max(0, Math.min(1, (t.clientY - a.top) / a.height)), l = s + o * i, d = Math.min(n - 1, Math.round(l * 2) / 2);
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
    const r = $t(t), a = this.layout.perDay.get(r);
    if (!a) return c``;
    const s = yt(this.bandStart, this.bandEnd), i = (s.length - 1) * this.hourHeightPx, o = xt(t, e), [l] = this.bandStart.split(":").map(Number), [d] = this.bandEnd.split(":").map(Number), p = (d - l) * 36e5;
    let u = null;
    if (o) {
      const g = new Date(t);
      g.setHours(l, 0, 0, 0);
      const w = new Date(t);
      w.setHours(d, 0, 0, 0), e >= g && e <= w && (u = (e.getTime() - g.getTime()) / p * 100);
    }
    const v = this._buildEventColorMap([...a.inBand.map((g) => g.event), ...a.earlier, ...a.later]);
    return c`
      <div class="day-col-wrapper">
        ${a.earlier.length > 0 ? c`
              <div class="stub-area-top">
                <lucarne-out-of-band-stub
                  .events=${a.earlier}
                  label="earlier"
                  .eventColors=${v}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}

        <div
          class="day-col"
          style="height:${i}px${this.showCreateButton ? "; cursor: crosshair" : ""}"
          @click=${(g) => this._onBandClick(g, t)}
        >
          ${s.slice(0, -1).map(
      (g, w) => c`
              <div
                class="hour-line"
                style="top: ${(w + 1) / (s.length - 1) * 100}%"
              ></div>
            `
    )}

          ${u !== null ? c`<div class="now-line" style="top:${u}%"></div>` : ""}

          ${a.inBand.map((g) => {
      const w = 100 / g.laneCount, P = g.lane / g.laneCount * 100, S = this._eventColor(g.event);
      return c`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${g.topPercent}%;
                  left: calc(${P}% + 1px);
                  width: calc(${w}% - 2px);
                  height: ${g.heightPercent}%;
                  z-index: ${g.lane + 1};
                  background: ${S}cc;
                  border-left-color: ${S};
                "
                .event=${g.event}
                .color=${S}
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
                  .eventColors=${v}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}
      </div>
    `;
  }
  render() {
    if (!this.layout) return c`<div>Loading…</div>`;
    const t = /* @__PURE__ */ new Date(), e = yt(this.bandStart, this.bandEnd), a = (e.length - 1) * this.hourHeightPx, s = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    return c`
      <div class="grid-wrapper">
        <!-- Header row -->
        <div class="header-spacer"></div>
        ${this.layout.weekDays.map(
      (n, i) => c`
            <div
              class="day-header ${xt(n, t) ? "today" : ""}"
              style="grid-column: ${i + 2}"
            >
              <div>${s.format(n)}</div>
              <div class="day-num">${n.getDate()}</div>
            </div>
          `
    )}

        <!-- All-day row -->
        <div class="allday-spacer">all-day</div>
        ${this.layout.weekDays.map((n, i) => {
      const o = $t(n), l = this.layout.perDay.get(o);
      return c`
            <div class="allday-cell" style="grid-column: ${i + 2}">
              ${((l == null ? void 0 : l.allDay) ?? []).map(
        (d) => c`
                  <div
                    class="allday-event"
                    style="background: ${this._eventColor(d)}cc"
                    @click=${(p) => {
          p.stopPropagation(), this.dispatchEvent(
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
        ${this.layout.weekDays.map((n, i) => c`
          <div style="grid-row:3; grid-column:${i + 2}; position:relative; overflow:visible; display:flex; flex-direction:column;">
            ${this._renderDayColumn(n, t)}
          </div>
        `)}
      </div>
    `;
  }
};
O.styles = [
  C,
  _`
      :host {
        display: block;
        position: relative;
      }
      .grid-wrapper {
        display: grid;
        grid-template-columns: 40px repeat(7, minmax(0, 1fr));
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
F([
  h({ type: Object })
], O.prototype, "layout", 2);
F([
  h({ type: String })
], O.prototype, "bandStart", 2);
F([
  h({ type: String })
], O.prototype, "bandEnd", 2);
F([
  h({ type: Array })
], O.prototype, "calendars", 2);
F([
  h({ type: Number })
], O.prototype, "hourHeightPx", 2);
F([
  h({ type: Boolean })
], O.prototype, "showCreateButton", 2);
O = F([
  y("lucarne-calendar-grid")
], O);
var Gr = Object.defineProperty, Jr = Object.getOwnPropertyDescriptor, Oe = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Jr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Gr(e, r, s), s;
};
function Zr(t) {
  return new Date(t).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: !0
  });
}
let Q = class extends m {
  constructor() {
    super(...arguments), this.event = null, this.color = "#a8d8b9", this.calendarLabel = "";
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  render() {
    var n;
    if (!this.event) return c``;
    const t = this.event, r = t.start.length === 10 && !t.start.includes("T") ? "All day" : `${Zr(t.start)} – ${new Date(t.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 })}`, a = (n = t.uid) != null && n.includes("::") ? t.uid.split("::").slice(1).join("::") : t.uid, s = a && a.length > 0 ? `https://calendar.google.com/calendar/u/0/r/eventedit/${encodeURIComponent(a)}` : null;
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
Q.styles = [
  C,
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
    `
];
Oe([
  h({ type: Object })
], Q.prototype, "event", 2);
Oe([
  h({ type: String })
], Q.prototype, "color", 2);
Oe([
  h({ type: String })
], Q.prototype, "calendarLabel", 2);
Q = Oe([
  y("lucarne-calendar-event-popover")
], Q);
var Qr = Object.defineProperty, Xr = Object.getOwnPropertyDescriptor, k = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? Xr(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && Qr(e, r, s), s;
};
function Ct(t, e) {
  const a = -(/* @__PURE__ */ new Date(`${t}T${e}:00`)).getTimezoneOffset(), s = a >= 0 ? "+" : "-", n = Math.floor(Math.abs(a) / 60).toString().padStart(2, "0"), i = (Math.abs(a) % 60).toString().padStart(2, "0");
  return `${t}T${e}:00${s}${n}:${i}`;
}
function kt(t) {
  return `${Math.floor(t).toString().padStart(2, "0")}:${t % 1 === 0.5 ? "30" : "00"}`;
}
function Et(t) {
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
    this._date = Et(t), this._startTime = kt(Math.max(0, Math.min(23, this.startHour)));
    const e = Math.min(24, this.startHour + 1);
    this._endTime = kt(e < 24 ? e : 23.5), this._calendarEntityId = ((r = this.calendars[0]) == null ? void 0 : r.entity) ?? "", this._title = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
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
      const s = Et(a);
      t.end_date = s, e = this._date, r = s;
    } else {
      const a = Ct(this._date, this._startTime), s = Ct(this._date, this._endTime);
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
  y("lucarne-create-event-popover")
], x);
var ea = Object.defineProperty, ta = Object.getOwnPropertyDescriptor, D = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? ta(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && ea(e, r, s), s;
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
      week_starts_on: "monday",
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
      this._previewOverride = jt(this);
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
  get _weekStart() {
    var r;
    const e = Ve(/* @__PURE__ */ new Date(), ((r = this._config) == null ? void 0 : r.week_starts_on) ?? "monday");
    return e.setDate(e.getDate() + this._weekOffset * 7), e.setHours(0, 0, 0, 0), e;
  }
  get _weekEnd() {
    var t;
    return zr(this._weekStart, ((t = this._config) == null ? void 0 : t.week_starts_on) ?? "monday");
  }
  async _fetchEvents() {
    if (!this._config || !this.hass) return;
    const t = ++this._fetchSeq, e = this._weekStart, r = this._weekEnd, a = this._config.calendars.map((i) => i.entity), s = await Ht(this.hass, a, e, r);
    if (t !== this._fetchSeq) return;
    const n = /* @__PURE__ */ new Map();
    for (const [i, o] of s.entries())
      n.set(
        i,
        o.map((l) => ({ ...l, uid: `${i}::${l.uid ?? ""}` }))
      );
    this._rawEvents = n, this._pendingEvents = [], this._recompute();
  }
  _recompute() {
    var a, s;
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
    const e = ((a = this._config.visible_hours) == null ? void 0 : a.start) ?? "07:00", r = ((s = this._config.visible_hours) == null ? void 0 : s.end) ?? "21:00";
    this._layout = Ur(t, this._weekStart, e, r, this._config.week_starts_on ?? "monday");
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
      const n = e.uid.split("::")[0], i = (s = this._config) == null ? void 0 : s.calendars.find((o) => o.entity === n);
      this._openEventCalLabel = i ? It(i, this.hass) : "";
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
    const t = this._weekStart, e = this._weekEnd, r = (a) => a.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return this._weekOffset === 0 ? "This week" : this._weekOffset === -1 ? "Last week" : this._weekOffset === 1 ? "Next week" : `${r(t)} – ${r(e)}`;
  }
  render() {
    var s, n;
    if (!this._config) return c``;
    const t = ((s = this._config.visible_hours) == null ? void 0 : s.start) ?? "07:00", e = ((n = this._config.visible_hours) == null ? void 0 : n.end) ?? "21:00", r = _t(this._config.calendars, this.hass), a = _t(this._creatableCalendars, this.hass);
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
D([
  h({ attribute: !1 })
], E.prototype, "hass", 2);
D([
  f()
], E.prototype, "_config", 2);
D([
  f()
], E.prototype, "_layout", 2);
D([
  f()
], E.prototype, "_visibleIds", 2);
D([
  f()
], E.prototype, "_weekOffset", 2);
D([
  f()
], E.prototype, "_openEvent", 2);
D([
  f()
], E.prototype, "_openEventColor", 2);
D([
  f()
], E.prototype, "_openEventCalLabel", 2);
D([
  f()
], E.prototype, "_createDay", 2);
D([
  f()
], E.prototype, "_createStartHour", 2);
D([
  f()
], E.prototype, "_creatableCalendars", 2);
E = D([
  y("lucarne-calendar-card")
], E);
var ra = Object.defineProperty, aa = Object.getOwnPropertyDescriptor, Me = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? aa(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && ra(e, r, s), s;
};
let X = class extends m {
  constructor() {
    super(...arguments), this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), We().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    qe(this, "config-changed", { config: t });
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
    var n, i;
    if (!this._config) return c``;
    if (!this._haReady) return c`<div class="loading">Loading editor…</div>`;
    const t = this._config.calendars ?? [], e = ((n = this._config.visible_hours) == null ? void 0 : n.start) ?? "07:00", r = ((i = this._config.visible_hours) == null ? void 0 : i.end) ?? "21:00", a = this._config.week_starts_on ?? "monday", s = this._config.show_create_button ?? !0;
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

      <label class="field">
        <span class="field-label">Week starts on</span>
        <select
          class="select-input"
          .value=${a}
          @change=${this._weekStartsOnChanged}
        >
          <option value="monday" ?selected=${a === "monday"}>Monday</option>
          <option value="sunday" ?selected=${a === "sunday"}>Sunday</option>
        </select>
      </label>

      <label class="toggle-row">
        <span class="toggle-label">Show create-event button</span>
        <input
          type="checkbox"
          .checked=${s}
          @change=${this._showCreateChanged}
        />
      </label>

      <div class="section-label">Calendars</div>
      ${t.map(
      (o, l) => c`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${o.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(d) => this._calEntityChanged(l, d)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${o.color}
              @input=${(d) => this._calColorChanged(l, d)}
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
X.styles = [C, Nt];
Me([
  h({ attribute: !1 })
], X.prototype, "hass", 2);
Me([
  f()
], X.prototype, "_config", 2);
Me([
  f()
], X.prototype, "_haReady", 2);
X = Me([
  y("lucarne-calendar-card-editor")
], X);
function St(t) {
  return t.length === 0 ? !1 : t.every((e) => e.state === "on");
}
var sa = Object.defineProperty, na = Object.getOwnPropertyDescriptor, Te = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? na(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && sa(e, r, s), s;
};
let ee = class extends m {
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
ee.styles = _`
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
Te([
  h()
], ee.prototype, "name", 2);
Te([
  h()
], ee.prototype, "color", 2);
Te([
  h({ attribute: "avatar-url" })
], ee.prototype, "avatarUrl", 2);
ee = Te([
  y("lucarne-kid-avatar")
], ee);
var ia = Object.defineProperty, oa = Object.getOwnPropertyDescriptor, ye = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? oa(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && ia(e, r, s), s;
};
let R = class extends m {
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
R.styles = _`
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
ye([
  h({ attribute: !1 })
], R.prototype, "hass", 2);
ye([
  h()
], R.prototype, "name", 2);
ye([
  h({ attribute: "entity-id" })
], R.prototype, "entityId", 2);
ye([
  h({ type: Boolean, attribute: "is-done" })
], R.prototype, "isDone", 2);
R = ye([
  y("lucarne-chore-row")
], R);
var la = Object.defineProperty, ca = Object.getOwnPropertyDescriptor, Ut = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? ca(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && la(e, r, s), s;
};
let Se = class extends m {
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
Se.styles = _`
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
Ut([
  h({ type: Number })
], Se.prototype, "streak", 2);
Se = Ut([
  y("lucarne-streak-display")
], Se);
var da = Object.defineProperty, ha = Object.getOwnPropertyDescriptor, Ge = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? ha(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && da(e, r, s), s;
};
let fe = class extends m {
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
fe.styles = _`
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
Ge([
  h({ attribute: "kid-slug" })
], fe.prototype, "kidSlug", 2);
Ge([
  h({ type: Boolean })
], fe.prototype, "active", 2);
fe = Ge([
  y("lucarne-celebration-overlay")
], fe);
var pa = Object.defineProperty, ua = Object.getOwnPropertyDescriptor, ae = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? ua(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && pa(e, r, s), s;
};
let H = class extends m {
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
H.styles = _`
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
ae([
  h({ attribute: !1 })
], H.prototype, "hass", 2);
ae([
  h({ attribute: !1 })
], H.prototype, "kid", 2);
ae([
  h({ type: Number })
], H.prototype, "streak", 2);
ae([
  h({ type: Boolean })
], H.prototype, "celebrating", 2);
ae([
  h({ type: Boolean, attribute: "all-done" })
], H.prototype, "allDone", 2);
H = ae([
  y("lucarne-kid-column")
], H);
var ga = Object.defineProperty, fa = Object.getOwnPropertyDescriptor, Je = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? fa(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && ga(e, r, s), s;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-chores-card",
  name: "Lucarne Chores",
  description: "Kid chore grid with streaks and celebration",
  preview: !0
});
let me = class extends m {
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
          var o;
          return {
            state: ((o = this.hass.states[i.entity]) == null ? void 0 : o.state) ?? "unavailable"
          };
        }), s = St(a), n = this._lastAllDoneByKid.get(r) ?? null;
        if (n === null) {
          this._lastAllDoneByKid.set(r, s);
          continue;
        }
        n === !1 && s === !0 ? (this._lastAllDoneByKid.set(r, !0), this._triggerCelebration(r, e)) : n === !0 && s === !1 && this._lastAllDoneByKid.set(r, !1);
      }
  }
  _triggerCelebration(t, e) {
    var l;
    this._celebratingKids = new Set(this._celebratingKids).add(t), this.requestUpdate();
    const r = this._celebrationTimers.get(t);
    r && clearTimeout(r);
    const a = setTimeout(() => {
      this._celebratingKids = new Set(
        [...this._celebratingKids].filter((d) => d !== t)
      ), this._celebrationTimers.delete(t), this.requestUpdate();
    }, 2200);
    this._celebrationTimers.set(t, a);
    const s = (l = this.hass) == null ? void 0 : l.states[e.streak], n = s ? parseInt(s.state, 10) : 0, i = /* @__PURE__ */ new Date(), o = `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}-${String(i.getDate()).padStart(2, "0")}`;
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
          ${e.map((r) => {
      var l;
      const a = r.name.toLowerCase().replace(/\s+/g, "_"), s = (l = this.hass) == null ? void 0 : l.states[r.streak], n = s ? parseInt(s.state, 10) : 0, i = r.chores.map((d) => {
        var p, u;
        return {
          state: ((u = (p = this.hass) == null ? void 0 : p.states[d.entity]) == null ? void 0 : u.state) ?? "unavailable"
        };
      }), o = St(i);
      return c`
              <div class="kid-cell">
                <lucarne-kid-column
                  .hass=${this.hass}
                  .kid=${r}
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
me.styles = [
  C,
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
Je([
  h({ attribute: !1 })
], me.prototype, "hass", 2);
Je([
  f()
], me.prototype, "_config", 2);
me = Je([
  y("lucarne-chores-card")
], me);
var ma = Object.defineProperty, va = Object.getOwnPropertyDescriptor, ze = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? va(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && ma(e, r, s), s;
};
let te = class extends m {
  constructor() {
    super(...arguments), this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), We().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    qe(this, "config-changed", { config: t });
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
te.styles = [
  C,
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
ze([
  h({ attribute: !1 })
], te.prototype, "hass", 2);
ze([
  f()
], te.prototype, "_config", 2);
ze([
  f()
], te.prototype, "_haReady", 2);
te = ze([
  y("lucarne-chores-card-editor")
], te);
//# sourceMappingURL=ha-lucarne.js.map
