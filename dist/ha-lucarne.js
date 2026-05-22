/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he = globalThis, $e = he.ShadowRoot && (he.ShadyCSS === void 0 || he.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, xe = Symbol(), Oe = /* @__PURE__ */ new WeakMap();
let st = class {
  constructor(e, s, r) {
    if (this._$cssResult$ = !0, r !== xe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if ($e && e === void 0) {
      const r = s !== void 0 && s.length === 1;
      r && (e = Oe.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Oe.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ht = (t) => new st(typeof t == "string" ? t : t + "", void 0, xe), _ = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((r, n, a) => r + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[a + 1], t[0]);
  return new st(s, t, xe);
}, pt = (t, e) => {
  if ($e) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const r = document.createElement("style"), n = he.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = s.cssText, t.appendChild(r);
  }
}, Ie = $e ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const r of e.cssRules) s += r.cssText;
  return ht(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ut, defineProperty: gt, getOwnPropertyDescriptor: ft, getOwnPropertyNames: mt, getOwnPropertySymbols: vt, getPrototypeOf: yt } = Object, D = globalThis, He = D.trustedTypes, bt = He ? He.emptyScript : "", ye = D.reactiveElementPolyfillSupport, Z = (t, e) => t, pe = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? bt : null;
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
} }, Ce = (t, e) => !ut(t, e), ze = { attribute: !0, type: String, converter: pe, reflect: !1, useDefault: !1, hasChanged: Ce };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), D.litPropertyMetadata ?? (D.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let B = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = ze) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const r = Symbol(), n = this.getPropertyDescriptor(e, r, s);
      n !== void 0 && gt(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, s, r) {
    const { get: n, set: a } = ft(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? ze;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Z("elementProperties"))) return;
    const e = yt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Z("properties"))) {
      const s = this.properties, r = [...mt(s), ...vt(s)];
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
      for (const n of r) s.unshift(Ie(n));
    } else e !== void 0 && s.push(Ie(e));
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
    return pt(e, this.constructor.elementStyles), e;
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
      const i = (((a = r.converter) == null ? void 0 : a.toAttribute) !== void 0 ? r.converter : pe).toAttribute(s, r.type);
      this._$Em = e, i == null ? this.removeAttribute(n) : this.setAttribute(n, i), this._$Em = null;
    }
  }
  _$AK(e, s) {
    var a, i;
    const r = this.constructor, n = r._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const o = r.getPropertyOptions(n), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((a = o.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? o.converter : pe;
      this._$Em = n;
      const c = l.fromAttribute(s, o.type);
      this[n] = c ?? ((i = this._$Ej) == null ? void 0 : i.get(n)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, s, r, n = !1, a) {
    var i;
    if (e !== void 0) {
      const o = this.constructor;
      if (n === !1 && (a = this[e]), r ?? (r = o.getPropertyOptions(e)), !((r.hasChanged ?? Ce)(a, s) || r.useDefault && r.reflect && a === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(o._$Eu(e, r)))) return;
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
B.elementStyles = [], B.shadowRootOptions = { mode: "open" }, B[Z("elementProperties")] = /* @__PURE__ */ new Map(), B[Z("finalized")] = /* @__PURE__ */ new Map(), ye == null || ye({ ReactiveElement: B }), (D.reactiveElementVersions ?? (D.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis, Le = (t) => t, ue = Q.trustedTypes, je = ue ? ue.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, rt = "$lit$", P = `lit$${Math.random().toFixed(9).slice(2)}$`, nt = "?" + P, _t = `<${nt}>`, L = document, ee = () => L.createComment(""), te = (t) => t === null || typeof t != "object" && typeof t != "function", Ee = Array.isArray, wt = (t) => Ee(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", be = `[ 	
\f\r]`, G = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ne = /-->/g, Ue = />/g, I = RegExp(`>|${be}(?:([^\\s"'>=/]+)(${be}*=${be}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Be = /'/g, Re = /"/g, at = /^(?:script|style|textarea|title)$/i, it = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), d = it(1), O = it(2), W = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), We = /* @__PURE__ */ new WeakMap(), H = L.createTreeWalker(L, 129);
function ot(t, e) {
  if (!Ee(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return je !== void 0 ? je.createHTML(e) : e;
}
const $t = (t, e) => {
  const s = t.length - 1, r = [];
  let n, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = G;
  for (let o = 0; o < s; o++) {
    const l = t[o];
    let c, h, p = -1, f = 0;
    for (; f < l.length && (i.lastIndex = f, h = i.exec(l), h !== null); ) f = i.lastIndex, i === G ? h[1] === "!--" ? i = Ne : h[1] !== void 0 ? i = Ue : h[2] !== void 0 ? (at.test(h[2]) && (n = RegExp("</" + h[2], "g")), i = I) : h[3] !== void 0 && (i = I) : i === I ? h[0] === ">" ? (i = n ?? G, p = -1) : h[1] === void 0 ? p = -2 : (p = i.lastIndex - h[2].length, c = h[1], i = h[3] === void 0 ? I : h[3] === '"' ? Re : Be) : i === Re || i === Be ? i = I : i === Ne || i === Ue ? i = G : (i = I, n = void 0);
    const u = i === I && t[o + 1].startsWith("/>") ? " " : "";
    a += i === G ? l + _t : p >= 0 ? (r.push(c), l.slice(0, p) + rt + l.slice(p) + P + u) : l + P + (p === -2 ? o : u);
  }
  return [ot(t, a + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class se {
  constructor({ strings: e, _$litType$: s }, r) {
    let n;
    this.parts = [];
    let a = 0, i = 0;
    const o = e.length - 1, l = this.parts, [c, h] = $t(e, s);
    if (this.el = se.createElement(c, r), H.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = H.nextNode()) !== null && l.length < o; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(rt)) {
          const f = h[i++], u = n.getAttribute(p).split(P), v = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: a, name: v[2], strings: u, ctor: v[1] === "." ? Ct : v[1] === "?" ? Et : v[1] === "@" ? St : fe }), n.removeAttribute(p);
        } else p.startsWith(P) && (l.push({ type: 6, index: a }), n.removeAttribute(p));
        if (at.test(n.tagName)) {
          const p = n.textContent.split(P), f = p.length - 1;
          if (f > 0) {
            n.textContent = ue ? ue.emptyScript : "";
            for (let u = 0; u < f; u++) n.append(p[u], ee()), H.nextNode(), l.push({ type: 2, index: ++a });
            n.append(p[f], ee());
          }
        }
      } else if (n.nodeType === 8) if (n.data === nt) l.push({ type: 2, index: a });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(P, p + 1)) !== -1; ) l.push({ type: 7, index: a }), p += P.length - 1;
      }
      a++;
    }
  }
  static createElement(e, s) {
    const r = L.createElement("template");
    return r.innerHTML = e, r;
  }
}
function F(t, e, s = t, r) {
  var i, o;
  if (e === W) return e;
  let n = r !== void 0 ? (i = s._$Co) == null ? void 0 : i[r] : s._$Cl;
  const a = te(e) ? void 0 : e._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== a && ((o = n == null ? void 0 : n._$AO) == null || o.call(n, !1), a === void 0 ? n = void 0 : (n = new a(t), n._$AT(t, s, r)), r !== void 0 ? (s._$Co ?? (s._$Co = []))[r] = n : s._$Cl = n), n !== void 0 && (e = F(t, n._$AS(t, e.values), n, r)), e;
}
class xt {
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
    const { el: { content: s }, parts: r } = this._$AD, n = ((e == null ? void 0 : e.creationScope) ?? L).importNode(s, !0);
    H.currentNode = n;
    let a = H.nextNode(), i = 0, o = 0, l = r[0];
    for (; l !== void 0; ) {
      if (i === l.index) {
        let c;
        l.type === 2 ? c = new oe(a, a.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (c = new At(a, this, e)), this._$AV.push(c), l = r[++o];
      }
      i !== (l == null ? void 0 : l.index) && (a = H.nextNode(), i++);
    }
    return H.currentNode = L, n;
  }
  p(e) {
    let s = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, s), s += r.strings.length - 2) : r._$AI(e[s])), s++;
  }
}
class oe {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, s, r, n) {
    this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = r, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    e = F(this, e, s), te(e) ? e === y || e == null || e === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : e !== this._$AH && e !== W && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : wt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== y && te(this._$AH) ? this._$AA.nextSibling.data = e : this.T(L.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var a;
    const { values: s, _$litType$: r } = e, n = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = se.createElement(ot(r.h, r.h[0]), this.options)), r);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === n) this._$AH.p(s);
    else {
      const i = new xt(n, this), o = i.u(this.options);
      i.p(s), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let s = We.get(e.strings);
    return s === void 0 && We.set(e.strings, s = new se(e)), s;
  }
  k(e) {
    Ee(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let r, n = 0;
    for (const a of e) n === s.length ? s.push(r = new oe(this.O(ee()), this.O(ee()), this, this.options)) : r = s[n], r._$AI(a), n++;
    n < s.length && (this._$AR(r && r._$AB.nextSibling, n), s.length = n);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, s); e !== this._$AB; ) {
      const n = Le(e).nextSibling;
      Le(e).remove(), e = n;
    }
  }
  setConnected(e) {
    var s;
    this._$AM === void 0 && (this._$Cv = e, (s = this._$AP) == null || s.call(this, e));
  }
}
class fe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, r, n, a) {
    this.type = 1, this._$AH = y, this._$AN = void 0, this.element = e, this.name = s, this._$AM = n, this.options = a, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = y;
  }
  _$AI(e, s = this, r, n) {
    const a = this.strings;
    let i = !1;
    if (a === void 0) e = F(this, e, s, 0), i = !te(e) || e !== this._$AH && e !== W, i && (this._$AH = e);
    else {
      const o = e;
      let l, c;
      for (e = a[0], l = 0; l < a.length - 1; l++) c = F(this, o[r + l], s, l), c === W && (c = this._$AH[l]), i || (i = !te(c) || c !== this._$AH[l]), c === y ? e = y : e !== y && (e += (c ?? "") + a[l + 1]), this._$AH[l] = c;
    }
    i && !n && this.j(e);
  }
  j(e) {
    e === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ct extends fe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === y ? void 0 : e;
  }
}
class Et extends fe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== y);
  }
}
class St extends fe {
  constructor(e, s, r, n, a) {
    super(e, s, r, n, a), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = F(this, e, s, 0) ?? y) === W) return;
    const r = this._$AH, n = e === y && r !== y || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, a = e !== y && (r === y || n);
    n && this.element.removeEventListener(this.name, this, r), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class At {
  constructor(e, s, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    F(this, e);
  }
}
const _e = Q.litHtmlPolyfillSupport;
_e == null || _e(se, oe), (Q.litHtmlVersions ?? (Q.litHtmlVersions = [])).push("3.3.3");
const kt = (t, e, s) => {
  const r = (s == null ? void 0 : s.renderBefore) ?? e;
  let n = r._$litPart$;
  if (n === void 0) {
    const a = (s == null ? void 0 : s.renderBefore) ?? null;
    r._$litPart$ = n = new oe(e.insertBefore(ee(), a), a, void 0, s ?? {});
  }
  return n._$AI(t), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis;
class b extends B {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = kt(s, this.renderRoot, this.renderOptions);
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
    return W;
  }
}
var tt;
b._$litElement$ = !0, b.finalized = !0, (tt = z.litElementHydrateSupport) == null || tt.call(z, { LitElement: b });
const we = z.litElementPolyfillSupport;
we == null || we({ LitElement: b });
(z.litElementVersions ?? (z.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pt = { attribute: !0, type: String, converter: pe, reflect: !1, hasChanged: Ce }, Dt = (t = Pt, e, s) => {
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
function g(t) {
  return (e, s) => typeof s == "object" ? Dt(t, e, s) : ((r, n, a) => {
    const i = n.hasOwnProperty(a);
    return n.constructor.createProperty(a, r), i ? Object.getOwnPropertyDescriptor(n, a) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function w(t) {
  return g({ ...t, state: !0, attribute: !1 });
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
function Mt(t, e, s) {
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
async function lt(t, e, s, r) {
  const n = await Promise.all(
    e.map(
      (a) => t.callWS({
        type: "calendar/list_events",
        entity_id: a,
        start_date_time: s.toISOString(),
        end_date_time: r.toISOString()
      }).then((i) => [a, (i == null ? void 0 : i.events) ?? []]).catch(() => [a, []])
    )
  );
  return new Map(n);
}
function Tt(t, e, s) {
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
    } catch {
      s([]);
    }
  };
  return r(), Mt(t, e, () => r());
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
var Ot = Object.defineProperty, It = Object.getOwnPropertyDescriptor, me = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? It(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Ot(e, s, n), n;
};
function X(t) {
  return t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
}
function Ht(t, e, s) {
  return t.filter((r) => X(r.end) > e).sort((r, n) => X(r.start).getTime() - X(n.start).getTime()).slice(0, s);
}
function zt(t, e, s) {
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
  const a = t.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (t.toDateString() === s.toDateString()) return a;
  const o = new Date(s);
  return o.setDate(s.getDate() + 1), t.toDateString() === o.toDateString() ? m.timePillTomorrow(a) : `${t.toLocaleDateString("en", { weekday: "short" })} ${a}`;
}
function Lt(t) {
  return t.start.length === 10 && t.end.length === 10;
}
let q = class extends b {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.limit = 5;
  }
  render() {
    const t = /* @__PURE__ */ new Date(), e = Ht(this.events, t, this.limit);
    return e.length === 0 ? d`<div class="empty-state">${m.nothingOnCalendar}</div>` : d`
      ${e.map((s) => {
      const r = X(s.start), n = X(s.end), a = r <= t && t < n, i = Lt(s) ? "all day" : zt(r, n, t), o = this._colorForEvent(s);
      return d`
          <div class="event-row">
            <div class="time-pill ${a ? "now" : ""}">
              ${a ? d`<span class="pulse-dot"></span>` : ""} ${i}
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
q.styles = [
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
me([
  g({ type: Array })
], q.prototype, "events", 2);
me([
  g({ type: Object })
], q.prototype, "calendarColors", 2);
me([
  g({ type: Number })
], q.prototype, "limit", 2);
q = me([
  x("lucarne-agenda-strip")
], q);
const Fe = O`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`, R = O`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>`, J = O`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`, qe = O`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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
</svg>`, jt = O`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M4.22 19.78l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="currentColor"/>
  <path d="M20 15h-1.26A6 6 0 1 0 8 20h12a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.7"/>
</svg>`;
O`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="7" r="4"/>
  <path d="M20 21a8 8 0 1 0-16 0"/>
</svg>`;
O`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"/>
</svg>`;
const Nt = O`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, Ve = {
  sunny: Fe,
  "clear-night": Fe,
  cloudy: R,
  fog: R,
  hail: J,
  lightning: J,
  "lightning-rainy": J,
  partlycloudy: jt,
  pouring: J,
  rainy: J,
  snowy: qe,
  "snowy-rainy": qe,
  windy: R,
  "windy-variant": R,
  exceptional: R
};
function Ke(t) {
  return Ve[t] ?? Ve[t.toLowerCase()] ?? R;
}
function Ut(t) {
  if (!t.length) return m.dressingTipDefault;
  const e = t[0];
  if (e.condition.toLowerCase().includes("snow"))
    return m.dressingTipBoots;
  const r = e.temperature;
  let n;
  return r < 5 ? n = m.dressingTipHeavyCoat : r < 12 ? n = m.dressingTipCoatScarf : r < 18 ? n = m.dressingTipLightJacket : r < 24 ? n = m.dressingTipTShirt : n = m.dressingTipShorts, (e.precipitation_probability ?? 0) > 50 && (n += m.dressingTipUmbrella), n;
}
var Bt = Object.defineProperty, Rt = Object.getOwnPropertyDescriptor, Se = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Rt(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Bt(e, s, n), n;
};
let re = class extends b {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return d`<div class="empty-state">${m.addWeatherEntity}</div>`;
    const t = this.weatherEntity.attributes, e = t.temperature, s = t.temperature_unit ?? "°C", r = this.weatherEntity.state, n = this.forecast[0], a = this.forecast[1], i = Ut(this.forecast);
    return d`
      <div class="current">
        <span class="condition-icon">${Ke(r)}</span>
        <div class="temp-group">
          <div class="current-temp">${e !== void 0 ? `${Math.round(e)}${s}` : m.errorUnavailable}</div>
          ${n ? d`<div class="high-low">
                ↑${Math.round(n.temperature)}${s}
                ${n.templow !== void 0 ? ` ↓${Math.round(n.templow)}${s}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${a ? d`
            <div class="tomorrow-row">
              <span class="tomorrow-icon">${Ke(a.condition)}</span>
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
re.styles = [
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
Se([
  g({ attribute: !1 })
], re.prototype, "weatherEntity", 2);
Se([
  g({ type: Array })
], re.prototype, "forecast", 2);
re = Se([
  x("lucarne-weather-block")
], re);
var Wt = Object.defineProperty, Ft = Object.getOwnPropertyDescriptor, Ae = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Ft(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Wt(e, s, n), n;
};
let ne = class extends b {
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
    return e === 0 ? d`
        <div class="empty-state">
          <span class="empty-icon">${Nt}</span>
          ${m.allDone}
        </div>
      ` : d`
      <div class="header">
        ${m.tasksTitle}
        <span class="count-badge">${e}</span>
      </div>
      ${s.map(
      (n) => d`
          <div class="task-row">
            <span class="summary">${n.summary}</span>
            ${n.due ? d`<span class="due-chip">${this._formatDue(n.due)}</span>` : ""}
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
ne.styles = [
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
Ae([
  g({ type: Array })
], ne.prototype, "items", 2);
Ae([
  g({ type: String })
], ne.prototype, "todoEntityId", 2);
ne = Ae([
  x("lucarne-tasks-summary")
], ne);
var qt = Object.defineProperty, Vt = Object.getOwnPropertyDescriptor, ct = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Vt(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && qt(e, s, n), n;
};
let ge = class extends b {
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
ge.styles = [
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
ct([
  g({ type: Array })
], ge.prototype, "entries", 2);
ge = ct([
  x("lucarne-presence-pills")
], ge);
var Kt = Object.defineProperty, Yt = Object.getOwnPropertyDescriptor, K = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Yt(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Kt(e, s, n), n;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-today-card",
  name: "Lucarne Today",
  description: "Family agenda + weather + tasks + presence",
  preview: !0
});
let M = class extends b {
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
    const e = Object.keys(t.states).filter((a) => a.startsWith("calendar.")).slice(0, 3), s = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], r = e.map((a, i) => {
      var o, l;
      return {
        entity: a,
        color: s[i] ?? "#a8d8b9",
        label: ((l = (o = t.states[a]) == null ? void 0 : o.attributes) == null ? void 0 : l.friendly_name) ?? a
      };
    }), n = "weather.forecast_home" in t.states;
    return {
      type: "custom:lucarne-today-card",
      title: m.today,
      calendars: r.length ? r : [{ entity: "calendar.example", color: "#a8d8b9", label: "Calendar" }],
      weather: n ? "weather.forecast_home" : void 0
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
    }, 5 * 60 * 1e3), this._config.tasks && (this._todoUnsub = Tt(this.hass, this._config.tasks, (t) => {
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
    const t = this._config.calendars.map((a) => a.entity), e = /* @__PURE__ */ new Date(), s = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), r = await lt(this.hass, t, e, s), n = /* @__PURE__ */ new Map();
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
      var n, a;
      return {
        name: r.name,
        isHome: ((a = (n = this.hass) == null ? void 0 : n.states[r.entity]) == null ? void 0 : a.state) === "on"
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
M.styles = [
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
K([
  g({ attribute: !1 })
], M.prototype, "hass", 2);
K([
  w()
], M.prototype, "_config", 2);
K([
  w()
], M.prototype, "_calendarEvents", 2);
K([
  w()
], M.prototype, "_forecast", 2);
K([
  w()
], M.prototype, "_todoItems", 2);
M = K([
  x("lucarne-today-card")
], M);
var Ye, Ge;
(function(t) {
  t.language = "language", t.system = "system", t.comma_decimal = "comma_decimal", t.decimal_comma = "decimal_comma", t.space_comma = "space_comma", t.none = "none";
})(Ye || (Ye = {})), function(t) {
  t.language = "language", t.system = "system", t.am_pm = "12", t.twenty_four = "24";
}(Ge || (Ge = {}));
var Gt = function(t, e, s, r) {
  r = r || {}, s = s ?? {};
  var n = new Event(e, { bubbles: r.bubbles === void 0 || r.bubbles, cancelable: !!r.cancelable, composed: r.composed === void 0 || r.composed });
  return n.detail = s, t.dispatchEvent(n), n;
}, Jt = Object.defineProperty, Zt = Object.getOwnPropertyDescriptor, ke = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Zt(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && Jt(e, s, n), n;
};
let ae = class extends b {
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    Gt(this, "config-changed", { config: t });
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
    var n, a, i, o;
    const t = Object.keys(((n = this.hass) == null ? void 0 : n.states) ?? {}).find((l) => l.startsWith("calendar.")), e = t ?? "calendar.example", s = t ? ((i = (a = this.hass.states[t]) == null ? void 0 : a.attributes) == null ? void 0 : i.friendly_name) ?? "Calendar" : "Calendar", r = [
      ...((o = this._config) == null ? void 0 : o.calendars) ?? [],
      { entity: e, color: "#a8d8b9", label: s }
    ];
    this._fire({ ...this._config, calendars: r });
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
              @value-changed=${(n) => this._calEntityChanged(r, n)}
            ></ha-entity-picker>
            <ha-textfield
              label="Label"
              .value=${s.label}
              @change=${(n) => this._calLabelChanged(r, n)}
            ></ha-textfield>
            <input
              type="color"
              class="cal-color"
              .value=${s.color}
              @input=${(n) => this._calColorChanged(r, n)}
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
              @value-changed=${(n) => this._presenceEntityChanged(r, n)}
            ></ha-entity-picker>
            <ha-textfield
              label="Display name"
              .value=${s.name}
              @change=${(n) => this._presenceNameChanged(r, n)}
            ></ha-textfield>
            <button class="remove" @click=${() => this._removePresence(r)} title="Remove">✕</button>
          </div>
        `
    )}
      <button class="add" @click=${this._addPresence}>+ Add person</button>
    `;
  }
};
ae.styles = [
  C,
  _`
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
ke([
  g({ attribute: !1 })
], ae.prototype, "hass", 2);
ke([
  w()
], ae.prototype, "_config", 2);
ae = ke([
  x("lucarne-today-card-editor")
], ae);
function Pe(t, e) {
  const s = new Date(t), a = (s.getDay() - (e === "monday" ? 1 : 0) + 7) % 7;
  return s.setDate(s.getDate() - a), s.setHours(0, 0, 0, 0), s;
}
function Qt(t, e) {
  const s = Pe(t, e), r = new Date(s);
  return r.setDate(r.getDate() + 6), r.setHours(23, 59, 59, 999), r;
}
function Xt(t) {
  const e = [];
  for (let s = 0; s < 7; s++) {
    const r = new Date(t);
    r.setDate(t.getDate() + s), r.setHours(0, 0, 0, 0), e.push(r);
  }
  return e;
}
function Je(t, e) {
  const s = parseInt(t.split(":")[0], 10), r = parseInt(e.split(":")[0], 10), n = [];
  for (let a = s; a <= r; a++)
    n.push(a);
  return n;
}
function es(t, e, s) {
  const [r, n] = e.split(":").map(Number), [a, i] = s.split(":").map(Number), o = new Date(t);
  o.setHours(r, n, 0, 0);
  const l = new Date(t);
  return l.setHours(a, i, 0, 0), { bandStartMs: o.getTime(), bandEndMs: l.getTime() };
}
function ts(t, e, s, r) {
  const n = Ze(t.start).getTime(), a = Ze(t.end).getTime(), { bandStartMs: i, bandEndMs: o } = es(e, s, r), l = Math.max(n, i), c = Math.min(a, o);
  return l >= c ? null : { start: new Date(l), end: new Date(c) };
}
function Ze(t) {
  return t.length === 10 && !t.includes("T") ? /* @__PURE__ */ new Date(`${t}T00:00:00`) : new Date(t);
}
function ss(t) {
  return t.start.length === 10 && !t.start.includes("T");
}
function ce(t) {
  const e = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
  return `${e}-${s}-${r}`;
}
function rs(t) {
  if (t.length === 0) return [];
  const e = t.map((l, c) => ({ ...l, _idx: c }));
  e.sort((l, c) => l.start.getTime() - c.start.getTime());
  const s = [], r = new Array(t.length);
  for (const l of e) {
    const c = l.start.getTime();
    let h = s.findIndex((p) => p <= c);
    h === -1 ? (h = s.length, s.push(l.end.getTime())) : s[h] = l.end.getTime(), r[l._idx] = h;
  }
  const n = new Array(t.length), a = [];
  let i = 0, o = e[0].end.getTime();
  n[e[0]._idx] = 0, a.push(r[e[0]._idx]);
  for (let l = 1; l < e.length; l++) {
    const c = e[l];
    c.start.getTime() >= o ? (i++, a.push(0), o = c.end.getTime()) : o = Math.max(o, c.end.getTime()), n[c._idx] = i, a[i] = Math.max(a[i], r[c._idx]);
  }
  return r.map((l, c) => ({
    lane: l,
    laneCount: a[n[c]] + 1
  }));
}
function de(t, e) {
  const [s, r] = e.split(":").map(Number), n = new Date(t);
  return n.setHours(s, r, 0, 0), n.getTime();
}
function ns(t, e, s, r, n) {
  const a = Xt(Pe(e, n)), i = /* @__PURE__ */ new Map();
  for (const o of a)
    i.set(ce(o), { allDay: [], inBand: [], earlier: [], later: [] });
  for (const o of t) {
    if (ss(o)) {
      const h = /* @__PURE__ */ new Date(o.start + "T00:00:00"), p = /* @__PURE__ */ new Date(o.end + "T00:00:00");
      for (const f of a) {
        const u = ce(f), v = i.get(u);
        f >= h && f < p && v.allDay.push(o);
      }
      continue;
    }
    const l = new Date(o.start), c = new Date(o.end);
    for (const h of a) {
      const p = ce(h), f = i.get(p), u = new Date(h);
      u.setHours(0, 0, 0, 0);
      const v = new Date(h);
      if (v.setHours(23, 59, 59, 999), c <= u || l > v) continue;
      const E = de(h, s), $ = de(h, r);
      if (c.getTime() <= E)
        f.earlier.push(o);
      else if (l.getTime() >= $)
        f.later.push(o);
      else {
        const U = ts(o, h, s, r);
        if (U) {
          const Me = $ - E, Te = (U.start.getTime() - E) / Me * 100, dt = (U.end.getTime() - U.start.getTime()) / Me * 100;
          f.inBand.push({
            event: o,
            lane: 0,
            laneCount: 1,
            topPercent: Math.max(0, Math.min(100, Te)),
            heightPercent: Math.max(0, Math.min(100 - Te, dt))
          });
        }
      }
    }
  }
  for (const o of a) {
    const l = ce(o), c = i.get(l);
    if (c.inBand.length === 0) continue;
    const h = de(o, s), f = de(o, r) - h, u = c.inBand.map((E) => {
      const $ = h + E.topPercent / 100 * f, U = $ + E.heightPercent / 100 * f;
      return {
        event: E.event,
        start: new Date($),
        end: new Date(U),
        lane: 0
      };
    }), v = rs(u);
    c.inBand = c.inBand.map((E, $) => ({
      ...E,
      lane: v[$].lane,
      laneCount: v[$].laneCount
    }));
  }
  return { weekDays: a, perDay: i };
}
var as = Object.defineProperty, is = Object.getOwnPropertyDescriptor, De = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? is(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && as(e, s, n), n;
};
let ie = class extends b {
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
ie.styles = [
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
De([
  g({ type: Array })
], ie.prototype, "calendars", 2);
De([
  g({ type: Object })
], ie.prototype, "visibleIds", 2);
ie = De([
  x("lucarne-visibility-pills")
], ie);
var os = Object.defineProperty, ls = Object.getOwnPropertyDescriptor, N = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? ls(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && os(e, s, n), n;
};
function Qe(t) {
  return t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
}
let A = class extends b {
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
    const t = new Date(this.event.start), e = new Date(this.event.end), s = `${Qe(t)}–${Qe(e)}`;
    return d`
      <div @click=${this._handleClick} style="height:100%;width:100%;overflow:hidden">
        <div class="event-summary">${this.event.summary}</div>
        <div class="event-time">${s}</div>
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
N([
  g({ type: Object })
], A.prototype, "event", 2);
N([
  g({ type: String })
], A.prototype, "color", 2);
N([
  g({ type: Number })
], A.prototype, "lane", 2);
N([
  g({ type: Number })
], A.prototype, "laneCount", 2);
N([
  g({ type: Number })
], A.prototype, "topPercent", 2);
N([
  g({ type: Number })
], A.prototype, "heightPercent", 2);
A = N([
  x("lucarne-calendar-event-block")
], A);
var cs = Object.defineProperty, ds = Object.getOwnPropertyDescriptor, le = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? ds(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && cs(e, s, n), n;
};
let j = class extends b {
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
j.styles = [
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
le([
  g({ type: Array })
], j.prototype, "events", 2);
le([
  g({ type: String })
], j.prototype, "label", 2);
le([
  g({ type: Object })
], j.prototype, "eventColors", 2);
le([
  w()
], j.prototype, "_open", 2);
j = le([
  x("lucarne-out-of-band-stub")
], j);
var hs = Object.defineProperty, ps = Object.getOwnPropertyDescriptor, Y = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? ps(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && hs(e, s, n), n;
};
function Xe(t) {
  const e = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
  return `${e}-${s}-${r}`;
}
function et(t, e) {
  return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
}
let T = class extends b {
  constructor() {
    super(...arguments), this.layout = null, this.bandStart = "07:00", this.bandEnd = "21:00", this.calendars = [], this.hourHeightPx = 60;
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
  _buildEventColorMap(t) {
    const e = /* @__PURE__ */ new Map();
    for (const s of t)
      e.set(s.uid ?? "", this._eventColor(s));
    return e;
  }
  _renderDayColumn(t, e) {
    if (!this.layout) return d``;
    const s = Xe(t), r = this.layout.perDay.get(s);
    if (!r) return d``;
    const n = Je(this.bandStart, this.bandEnd), i = (n.length - 1) * this.hourHeightPx, o = et(t, e), [l] = this.bandStart.split(":").map(Number), [c] = this.bandEnd.split(":").map(Number), h = (c - l) * 36e5;
    let p = null;
    if (o) {
      const u = new Date(t);
      u.setHours(l, 0, 0, 0);
      const v = new Date(t);
      v.setHours(c, 0, 0, 0), e >= u && e <= v && (p = (e.getTime() - u.getTime()) / h * 100);
    }
    const f = this._buildEventColorMap([...r.inBand.map((u) => u.event), ...r.earlier, ...r.later]);
    return d`
      <div class="day-col-wrapper">
        ${r.earlier.length > 0 ? d`
              <div class="stub-area-top">
                <lucarne-out-of-band-stub
                  .events=${r.earlier}
                  label="earlier"
                  .eventColors=${f}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}

        <div class="day-col" style="height:${i}px">
          ${n.slice(0, -1).map(
      (u, v) => d`
              <div
                class="hour-line"
                style="top: ${(v + 1) / (n.length - 1) * 100}%"
              ></div>
            `
    )}

          ${p !== null ? d`<div class="now-line" style="top:${p}%"></div>` : ""}

          ${r.inBand.map((u) => {
      const v = 100 / u.laneCount, E = u.lane / u.laneCount * 100, $ = this._eventColor(u.event);
      return d`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${u.topPercent}%;
                  left: calc(${E}% + 1px);
                  width: calc(${v}% - 2px);
                  height: ${u.heightPercent}%;
                  z-index: ${u.lane + 1};
                  background: ${$}cc;
                  border-left-color: ${$};
                "
                .event=${u.event}
                .color=${$}
                .lane=${u.lane}
                .laneCount=${u.laneCount}
                .topPercent=${u.topPercent}
                .heightPercent=${u.heightPercent}
              ></lucarne-calendar-event-block>
            `;
    })}
        </div>

        ${r.later.length > 0 ? d`
              <div class="stub-area-bottom">
                <lucarne-out-of-band-stub
                  .events=${r.later}
                  label="tonight"
                  .eventColors=${f}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}
      </div>
    `;
  }
  render() {
    if (!this.layout) return d`<div>Loading…</div>`;
    const t = /* @__PURE__ */ new Date(), e = Je(this.bandStart, this.bandEnd), r = (e.length - 1) * this.hourHeightPx, n = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    return d`
      <div class="grid-wrapper">
        <!-- Header row -->
        <div class="header-spacer"></div>
        ${this.layout.weekDays.map(
      (a, i) => d`
            <div
              class="day-header ${et(a, t) ? "today" : ""}"
              style="grid-column: ${i + 2}"
            >
              <div>${n.format(a).toUpperCase()}</div>
              <div class="day-num">${a.getDate()}</div>
            </div>
          `
    )}

        <!-- All-day row -->
        <div class="allday-spacer">all-day</div>
        ${this.layout.weekDays.map((a, i) => {
      const o = Xe(a), l = this.layout.perDay.get(o);
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
      (a, i) => d`
              <div
                class="hour-label"
                style="top: ${i / (e.length - 1) * 100}%"
              >
                ${a === 0 || a === 24 ? "12 AM" : a < 12 ? `${a} AM` : a === 12 ? "12 PM" : `${a - 12} PM`}
              </div>
            `
    )}
        </div>

        <!-- Day columns -->
        ${this.layout.weekDays.map((a, i) => d`
          <div style="grid-row:3; grid-column:${i + 2}; position:relative; overflow:visible; display:flex; flex-direction:column;">
            ${this._renderDayColumn(a, t)}
          </div>
        `)}
      </div>
    `;
  }
};
T.styles = [
  C,
  _`
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
Y([
  g({ type: Object })
], T.prototype, "layout", 2);
Y([
  g({ type: String })
], T.prototype, "bandStart", 2);
Y([
  g({ type: String })
], T.prototype, "bandEnd", 2);
Y([
  g({ type: Array })
], T.prototype, "calendars", 2);
Y([
  g({ type: Number })
], T.prototype, "hourHeightPx", 2);
T = Y([
  x("lucarne-calendar-grid")
], T);
var us = Object.defineProperty, gs = Object.getOwnPropertyDescriptor, ve = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? gs(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && us(e, s, n), n;
};
function fs(t) {
  return new Date(t).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: !0
  });
}
let V = class extends b {
  constructor() {
    super(...arguments), this.event = null, this.color = "#a8d8b9", this.calendarLabel = "";
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  render() {
    var a;
    if (!this.event) return d``;
    const t = this.event, s = t.start.length === 10 && !t.start.includes("T") ? "All day" : `${fs(t.start)} – ${new Date(t.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 })}`, r = (a = t.uid) != null && a.includes("::") ? t.uid.split("::").slice(1).join("::") : t.uid, n = r && r.length > 0 ? `https://calendar.google.com/calendar/u/0/r/eventedit/${encodeURIComponent(r)}` : null;
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

        ${n ? d`
              <a class="ext-link" href="${n}" target="_blank" rel="noopener noreferrer">
                Open in Google Calendar ↗
              </a>
            ` : ""}
      </div>
    `;
  }
};
V.styles = [
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
ve([
  g({ type: Object })
], V.prototype, "event", 2);
ve([
  g({ type: String })
], V.prototype, "color", 2);
ve([
  g({ type: String })
], V.prototype, "calendarLabel", 2);
V = ve([
  x("lucarne-calendar-event-popover")
], V);
var ms = Object.defineProperty, vs = Object.getOwnPropertyDescriptor, k = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? vs(e, s) : e, a = t.length - 1, i; a >= 0; a--)
    (i = t[a]) && (n = (r ? i(e, s, n) : i(n)) || n);
  return r && n && ms(e, s, n), n;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-calendar-card",
  name: "Lucarne Calendar",
  description: "Week view calendar with per-person color, visibility pills, and create-event flow",
  preview: !0
});
let S = class extends b {
  constructor() {
    super(...arguments), this._layout = null, this._visibleIds = /* @__PURE__ */ new Set(), this._weekOffset = 0, this._openEvent = null, this._openEventColor = "", this._openEventCalLabel = "", this._fetchSeq = 0, this._rawEvents = /* @__PURE__ */ new Map();
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
    this._config = e, this._visibleIds = new Set(t.calendars.map((s) => s.entity)), this.isConnected && (this._teardown(), this._setup());
  }
  static getStubConfig(t) {
    const e = Object.keys(t.states).filter((n) => n.startsWith("calendar.")).slice(0, 3), s = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], r = e.map((n, a) => {
      var i, o;
      return {
        entity: n,
        color: s[a] ?? "#a8d8b9",
        label: ((o = (i = t.states[n]) == null ? void 0 : i.attributes) == null ? void 0 : o.friendly_name) ?? n
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
  connectedCallback() {
    super.connectedCallback(), this._setup();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._teardown();
  }
  updated(t) {
    if (super.updated(t), !t.has("hass") || !this._config) return;
    !t.get("hass") && this.hass && !this._intervalId && this._setup();
  }
  _setup() {
    !this._config || !this.hass || (this._fetchEvents(), this._intervalId = setInterval(() => this._fetchEvents(), 5 * 60 * 1e3));
  }
  _teardown() {
    clearInterval(this._intervalId), this._intervalId = void 0;
  }
  get _weekStart() {
    var s;
    const e = Pe(/* @__PURE__ */ new Date(), ((s = this._config) == null ? void 0 : s.week_starts_on) ?? "monday");
    return e.setDate(e.getDate() + this._weekOffset * 7), e.setHours(0, 0, 0, 0), e;
  }
  get _weekEnd() {
    var t;
    return Qt(this._weekStart, ((t = this._config) == null ? void 0 : t.week_starts_on) ?? "monday");
  }
  async _fetchEvents() {
    if (!this._config || !this.hass) return;
    const t = ++this._fetchSeq, e = this._weekStart, s = this._weekEnd, r = this._config.calendars.map((i) => i.entity), n = await lt(this.hass, r, e, s);
    if (t !== this._fetchSeq) return;
    const a = /* @__PURE__ */ new Map();
    for (const [i, o] of n.entries())
      a.set(
        i,
        o.map((l) => ({ ...l, uid: `${i}::${l.uid ?? ""}` }))
      );
    this._rawEvents = a, this._recompute();
  }
  _recompute() {
    var r, n;
    if (!this._config) return;
    const t = [];
    for (const [a, i] of this._rawEvents.entries())
      this._visibleIds.has(a) && t.push(...i);
    const e = ((r = this._config.visible_hours) == null ? void 0 : r.start) ?? "07:00", s = ((n = this._config.visible_hours) == null ? void 0 : n.end) ?? "21:00";
    this._layout = ns(t, this._weekStart, e, s, this._config.week_starts_on ?? "monday");
  }
  _onVisibilityChange(t) {
    this._visibleIds = t.detail, this._recompute();
  }
  _onEventTap(t) {
    var r, n;
    const { event: e, color: s } = t.detail;
    if (this._openEvent = e, this._openEventColor = s, (r = e.uid) != null && r.includes("::")) {
      const a = e.uid.split("::")[0], i = (n = this._config) == null ? void 0 : n.calendars.find((o) => o.entity === a);
      this._openEventCalLabel = (i == null ? void 0 : i.label) ?? "";
    } else
      this._openEventCalLabel = "";
  }
  _closePopover() {
    this._openEvent = null;
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

        <div class="grid-area" @lucarne-event-tap=${this._onEventTap}>
          <lucarne-calendar-grid
            .layout=${this._layout}
            .bandStart=${t}
            .bandEnd=${e}
            .calendars=${this._config.calendars}
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
      </ha-card>
    `;
  }
};
S.styles = [
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
k([
  g({ attribute: !1 })
], S.prototype, "hass", 2);
k([
  w()
], S.prototype, "_config", 2);
k([
  w()
], S.prototype, "_layout", 2);
k([
  w()
], S.prototype, "_visibleIds", 2);
k([
  w()
], S.prototype, "_weekOffset", 2);
k([
  w()
], S.prototype, "_openEvent", 2);
k([
  w()
], S.prototype, "_openEventColor", 2);
k([
  w()
], S.prototype, "_openEventCalLabel", 2);
S = k([
  x("lucarne-calendar-card")
], S);
//# sourceMappingURL=ha-lucarne.js.map
