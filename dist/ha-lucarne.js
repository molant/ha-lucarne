/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = globalThis, lt = qe.ShadowRoot && (qe.ShadyCSS === void 0 || qe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ct = Symbol(), wt = /* @__PURE__ */ new WeakMap();
let sr = class {
  constructor(t, r, s) {
    if (this._$cssResult$ = !0, s !== ct) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = r;
  }
  get styleSheet() {
    let t = this.o;
    const r = this.t;
    if (lt && t === void 0) {
      const s = r !== void 0 && r.length === 1;
      s && (t = wt.get(r)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && wt.set(r, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Cr = (e) => new sr(typeof e == "string" ? e : e + "", void 0, ct), b = (e, ...t) => {
  const r = e.length === 1 ? e[0] : t.reduce((s, a, n) => s + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + e[n + 1], e[0]);
  return new sr(r, e, ct);
}, Er = (e, t) => {
  if (lt) e.adoptedStyleSheets = t.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of t) {
    const s = document.createElement("style"), a = qe.litNonce;
    a !== void 0 && s.setAttribute("nonce", a), s.textContent = r.cssText, e.appendChild(s);
  }
}, $t = lt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let r = "";
  for (const s of t.cssRules) r += s.cssText;
  return Cr(r);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mr, defineProperty: Dr, getOwnPropertyDescriptor: Sr, getOwnPropertyNames: Tr, getOwnPropertySymbols: Pr, getPrototypeOf: Ar } = Object, G = globalThis, xt = G.trustedTypes, Or = xt ? xt.emptyScript : "", at = G.reactiveElementPolyfillSupport, ke = (e, t) => e, Ke = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Or : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let r = e;
  switch (t) {
    case Boolean:
      r = e !== null;
      break;
    case Number:
      r = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        r = JSON.parse(e);
      } catch {
        r = null;
      }
  }
  return r;
} }, dt = (e, t) => !Mr(e, t), kt = { attribute: !0, type: String, converter: Ke, reflect: !1, useDefault: !1, hasChanged: dt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), G.litPropertyMetadata ?? (G.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let he = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, r = kt) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(t, r), !r.noAccessor) {
      const s = Symbol(), a = this.getPropertyDescriptor(t, s, r);
      a !== void 0 && Dr(this.prototype, t, a);
    }
  }
  static getPropertyDescriptor(t, r, s) {
    const { get: a, set: n } = Sr(this.prototype, t) ?? { get() {
      return this[r];
    }, set(i) {
      this[r] = i;
    } };
    return { get: a, set(i) {
      const o = a == null ? void 0 : a.call(this);
      n == null || n.call(this, i), this.requestUpdate(t, o, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? kt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ke("elementProperties"))) return;
    const t = Ar(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ke("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ke("properties"))) {
      const r = this.properties, s = [...Tr(r), ...Pr(r)];
      for (const a of s) this.createProperty(a, r[a]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const r = litPropertyMetadata.get(t);
      if (r !== void 0) for (const [s, a] of r) this.elementProperties.set(s, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, s] of this.elementProperties) {
      const a = this._$Eu(r, s);
      a !== void 0 && this._$Eh.set(a, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const r = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const a of s) r.unshift($t(a));
    } else t !== void 0 && r.push($t(t));
    return r;
  }
  static _$Eu(t, r) {
    const s = r.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((r) => this.enableUpdating = r), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((r) => r(this));
  }
  addController(t) {
    var r;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((r = t.hostConnected) == null || r.call(t));
  }
  removeController(t) {
    var r;
    (r = this._$EO) == null || r.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), r = this.constructor.elementProperties;
    for (const s of r.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Er(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((r) => {
      var s;
      return (s = r.hostConnected) == null ? void 0 : s.call(r);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((r) => {
      var s;
      return (s = r.hostDisconnected) == null ? void 0 : s.call(r);
    });
  }
  attributeChangedCallback(t, r, s) {
    this._$AK(t, s);
  }
  _$ET(t, r) {
    var n;
    const s = this.constructor.elementProperties.get(t), a = this.constructor._$Eu(t, s);
    if (a !== void 0 && s.reflect === !0) {
      const i = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : Ke).toAttribute(r, s.type);
      this._$Em = t, i == null ? this.removeAttribute(a) : this.setAttribute(a, i), this._$Em = null;
    }
  }
  _$AK(t, r) {
    var n, i;
    const s = this.constructor, a = s._$Eh.get(t);
    if (a !== void 0 && this._$Em !== a) {
      const o = s.getPropertyOptions(a), c = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : Ke;
      this._$Em = a;
      const d = c.fromAttribute(r, o.type);
      this[a] = d ?? ((i = this._$Ej) == null ? void 0 : i.get(a)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, r, s, a = !1, n) {
    var i;
    if (t !== void 0) {
      const o = this.constructor;
      if (a === !1 && (n = this[t]), s ?? (s = o.getPropertyOptions(t)), !((s.hasChanged ?? dt)(n, r) || s.useDefault && s.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, r, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, r, { useDefault: s, reflect: a, wrapped: n }, i) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, i ?? r ?? this[t]), n !== !0 || i !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (r = void 0), this._$AL.set(t, r)), a === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (r) {
      Promise.reject(r);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, i] of this._$Ep) this[n] = i;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [n, i] of a) {
        const { wrapped: o } = i, c = this[n];
        o !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, i, c);
      }
    }
    let t = !1;
    const r = this._$AL;
    try {
      t = this.shouldUpdate(r), t ? (this.willUpdate(r), (s = this._$EO) == null || s.forEach((a) => {
        var n;
        return (n = a.hostUpdate) == null ? void 0 : n.call(a);
      }), this.update(r)) : this._$EM();
    } catch (a) {
      throw t = !1, this._$EM(), a;
    }
    t && this._$AE(r);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var r;
    (r = this._$EO) == null || r.forEach((s) => {
      var a;
      return (a = s.hostUpdated) == null ? void 0 : a.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((r) => this._$ET(r, this[r]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
he.elementStyles = [], he.shadowRootOptions = { mode: "open" }, he[ke("elementProperties")] = /* @__PURE__ */ new Map(), he[ke("finalized")] = /* @__PURE__ */ new Map(), at == null || at({ ReactiveElement: he }), (G.reactiveElementVersions ?? (G.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ce = globalThis, Ct = (e) => e, Xe = Ce.trustedTypes, Et = Xe ? Xe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, nr = "$lit$", X = `lit$${Math.random().toFixed(9).slice(2)}$`, ir = "?" + X, Ir = `<${ir}>`, se = document, De = () => se.createComment(""), Se = (e) => e === null || typeof e != "object" && typeof e != "function", ut = Array.isArray, Rr = (e) => ut(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", st = `[ 	
\f\r]`, $e = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Mt = /-->/g, Dt = />/g, te = RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), St = /'/g, Tt = /"/g, or = /^(?:script|style|textarea|title)$/i, lr = (e) => (t, ...r) => ({ _$litType$: e, strings: t, values: r }), l = lr(1), Z = lr(2), ne = Symbol.for("lit-noChange"), P = Symbol.for("lit-nothing"), Pt = /* @__PURE__ */ new WeakMap(), re = se.createTreeWalker(se, 129);
function cr(e, t) {
  if (!ut(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Et !== void 0 ? Et.createHTML(t) : t;
}
const zr = (e, t) => {
  const r = e.length - 1, s = [];
  let a, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = $e;
  for (let o = 0; o < r; o++) {
    const c = e[o];
    let d, u, m = -1, g = 0;
    for (; g < c.length && (i.lastIndex = g, u = i.exec(c), u !== null); ) g = i.lastIndex, i === $e ? u[1] === "!--" ? i = Mt : u[1] !== void 0 ? i = Dt : u[2] !== void 0 ? (or.test(u[2]) && (a = RegExp("</" + u[2], "g")), i = te) : u[3] !== void 0 && (i = te) : i === te ? u[0] === ">" ? (i = a ?? $e, m = -1) : u[1] === void 0 ? m = -2 : (m = i.lastIndex - u[2].length, d = u[1], i = u[3] === void 0 ? te : u[3] === '"' ? Tt : St) : i === Tt || i === St ? i = te : i === Mt || i === Dt ? i = $e : (i = te, a = void 0);
    const f = i === te && e[o + 1].startsWith("/>") ? " " : "";
    n += i === $e ? c + Ir : m >= 0 ? (s.push(d), c.slice(0, m) + nr + c.slice(m) + X + f) : c + X + (m === -2 ? o : f);
  }
  return [cr(e, n + (e[r] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class Te {
  constructor({ strings: t, _$litType$: r }, s) {
    let a;
    this.parts = [];
    let n = 0, i = 0;
    const o = t.length - 1, c = this.parts, [d, u] = zr(t, r);
    if (this.el = Te.createElement(d, s), re.currentNode = this.el.content, r === 2 || r === 3) {
      const m = this.el.content.firstChild;
      m.replaceWith(...m.childNodes);
    }
    for (; (a = re.nextNode()) !== null && c.length < o; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const m of a.getAttributeNames()) if (m.endsWith(nr)) {
          const g = u[i++], f = a.getAttribute(m).split(X), y = /([.?@])?(.*)/.exec(g);
          c.push({ type: 1, index: n, name: y[2], strings: f, ctor: y[1] === "." ? jr : y[1] === "?" ? Hr : y[1] === "@" ? Lr : Qe }), a.removeAttribute(m);
        } else m.startsWith(X) && (c.push({ type: 6, index: n }), a.removeAttribute(m));
        if (or.test(a.tagName)) {
          const m = a.textContent.split(X), g = m.length - 1;
          if (g > 0) {
            a.textContent = Xe ? Xe.emptyScript : "";
            for (let f = 0; f < g; f++) a.append(m[f], De()), re.nextNode(), c.push({ type: 2, index: ++n });
            a.append(m[g], De());
          }
        }
      } else if (a.nodeType === 8) if (a.data === ir) c.push({ type: 2, index: n });
      else {
        let m = -1;
        for (; (m = a.data.indexOf(X, m + 1)) !== -1; ) c.push({ type: 7, index: n }), m += X.length - 1;
      }
      n++;
    }
  }
  static createElement(t, r) {
    const s = se.createElement("template");
    return s.innerHTML = t, s;
  }
}
function me(e, t, r = e, s) {
  var i, o;
  if (t === ne) return t;
  let a = s !== void 0 ? (i = r._$Co) == null ? void 0 : i[s] : r._$Cl;
  const n = Se(t) ? void 0 : t._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== n && ((o = a == null ? void 0 : a._$AO) == null || o.call(a, !1), n === void 0 ? a = void 0 : (a = new n(e), a._$AT(e, r, s)), s !== void 0 ? (r._$Co ?? (r._$Co = []))[s] = a : r._$Cl = a), a !== void 0 && (t = me(e, a._$AS(e, t.values), a, s)), t;
}
class Nr {
  constructor(t, r) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = r;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: r }, parts: s } = this._$AD, a = ((t == null ? void 0 : t.creationScope) ?? se).importNode(r, !0);
    re.currentNode = a;
    let n = re.nextNode(), i = 0, o = 0, c = s[0];
    for (; c !== void 0; ) {
      if (i === c.index) {
        let d;
        c.type === 2 ? d = new Ne(n, n.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(n, c.name, c.strings, this, t) : c.type === 6 && (d = new Ur(n, this, t)), this._$AV.push(d), c = s[++o];
      }
      i !== (c == null ? void 0 : c.index) && (n = re.nextNode(), i++);
    }
    return re.currentNode = se, a;
  }
  p(t) {
    let r = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, r), r += s.strings.length - 2) : s._$AI(t[r])), r++;
  }
}
class Ne {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, r, s, a) {
    this.type = 2, this._$AH = P, this._$AN = void 0, this._$AA = t, this._$AB = r, this._$AM = s, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = r.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, r = this) {
    t = me(this, t, r), Se(t) ? t === P || t == null || t === "" ? (this._$AH !== P && this._$AR(), this._$AH = P) : t !== this._$AH && t !== ne && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rr(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== P && Se(this._$AH) ? this._$AA.nextSibling.data = t : this.T(se.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: r, _$litType$: s } = t, a = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = Te.createElement(cr(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === a) this._$AH.p(r);
    else {
      const i = new Nr(a, this), o = i.u(this.options);
      i.p(r), this.T(o), this._$AH = i;
    }
  }
  _$AC(t) {
    let r = Pt.get(t.strings);
    return r === void 0 && Pt.set(t.strings, r = new Te(t)), r;
  }
  k(t) {
    ut(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let s, a = 0;
    for (const n of t) a === r.length ? r.push(s = new Ne(this.O(De()), this.O(De()), this, this.options)) : s = r[a], s._$AI(n), a++;
    a < r.length && (this._$AR(s && s._$AB.nextSibling, a), r.length = a);
  }
  _$AR(t = this._$AA.nextSibling, r) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, r); t !== this._$AB; ) {
      const a = Ct(t).nextSibling;
      Ct(t).remove(), t = a;
    }
  }
  setConnected(t) {
    var r;
    this._$AM === void 0 && (this._$Cv = t, (r = this._$AP) == null || r.call(this, t));
  }
}
class Qe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, r, s, a, n) {
    this.type = 1, this._$AH = P, this._$AN = void 0, this.element = t, this.name = r, this._$AM = a, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = P;
  }
  _$AI(t, r = this, s, a) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) t = me(this, t, r, 0), i = !Se(t) || t !== this._$AH && t !== ne, i && (this._$AH = t);
    else {
      const o = t;
      let c, d;
      for (t = n[0], c = 0; c < n.length - 1; c++) d = me(this, o[s + c], r, c), d === ne && (d = this._$AH[c]), i || (i = !Se(d) || d !== this._$AH[c]), d === P ? t = P : t !== P && (t += (d ?? "") + n[c + 1]), this._$AH[c] = d;
    }
    i && !a && this.j(t);
  }
  j(t) {
    t === P ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class jr extends Qe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === P ? void 0 : t;
  }
}
class Hr extends Qe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== P);
  }
}
class Lr extends Qe {
  constructor(t, r, s, a, n) {
    super(t, r, s, a, n), this.type = 5;
  }
  _$AI(t, r = this) {
    if ((t = me(this, t, r, 0) ?? P) === ne) return;
    const s = this._$AH, a = t === P && s !== P || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== P && (s === P || a);
    a && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var r;
    typeof this._$AH == "function" ? this._$AH.call(((r = this.options) == null ? void 0 : r.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ur {
  constructor(t, r, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    me(this, t);
  }
}
const nt = Ce.litHtmlPolyfillSupport;
nt == null || nt(Te, Ne), (Ce.litHtmlVersions ?? (Ce.litHtmlVersions = [])).push("3.3.3");
const Fr = (e, t, r) => {
  const s = (r == null ? void 0 : r.renderBefore) ?? t;
  let a = s._$litPart$;
  if (a === void 0) {
    const n = (r == null ? void 0 : r.renderBefore) ?? null;
    s._$litPart$ = a = new Ne(t.insertBefore(De(), n), n, void 0, r ?? {});
  }
  return a._$AI(e), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ae = globalThis;
let v = class extends he {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var r;
    const t = super.createRenderRoot();
    return (r = this.renderOptions).renderBefore ?? (r.renderBefore = t.firstChild), t;
  }
  update(t) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Fr(r, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return ne;
  }
};
var ar;
v._$litElement$ = !0, v.finalized = !0, (ar = ae.litElementHydrateSupport) == null || ar.call(ae, { LitElement: v });
const it = ae.litElementPolyfillSupport;
it == null || it({ LitElement: v });
(ae.litElementVersions ?? (ae.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = (e) => (t, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Br = { attribute: !0, type: String, converter: Ke, reflect: !1, hasChanged: dt }, Wr = (e = Br, t, r) => {
  const { kind: s, metadata: a } = r;
  let n = globalThis.litPropertyMetadata.get(a);
  if (n === void 0 && globalThis.litPropertyMetadata.set(a, n = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(r.name, e), s === "accessor") {
    const { name: i } = r;
    return { set(o) {
      const c = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(i, c, e, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(i, void 0, e, o), o;
    } };
  }
  if (s === "setter") {
    const { name: i } = r;
    return function(o) {
      const c = this[i];
      t.call(this, o), this.requestUpdate(i, c, e, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function p(e) {
  return (t, r) => typeof r == "object" ? Wr(e, t, r) : ((s, a, n) => {
    const i = a.hasOwnProperty(n);
    return a.constructor.createProperty(n, s), i ? Object.getOwnPropertyDescriptor(a, n) : void 0;
  })(e, t, r);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function h(e) {
  return p({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yr = (e, t, r) => (r.configurable = !0, r.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, r), r);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function dr(e, t) {
  return (r, s, a) => {
    const n = (i) => {
      var o;
      return ((o = i.renderRoot) == null ? void 0 : o.querySelector(e)) ?? null;
    };
    return Yr(r, s, { get() {
      return n(this);
    } });
  };
}
const M = b`
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

    --lucarne-success-bg: #e8f5e9;
    --lucarne-success-fg: #2e7d32;

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
function ur(e, t, r) {
  let s, a = !1;
  return e.connection.subscribeMessage(
    (n) => {
      var i, o;
      (o = (i = n.variables) == null ? void 0 : i.trigger) != null && o.to_state && r(n.variables.trigger.to_state);
    },
    { type: "subscribe_trigger", trigger: { platform: "state", entity_id: t } }
  ).then((n) => {
    a ? n() : s = n;
  }), () => {
    a = !0, s == null || s();
  };
}
function At(e) {
  return typeof e == "string" ? e : e && typeof e == "object" ? e.dateTime ?? e.date ?? "" : "";
}
function Vr(e) {
  const t = {
    start: At(e.start),
    end: At(e.end),
    summary: e.summary ?? ""
  };
  return e.description && (t.description = e.description), e.location && (t.location = e.location), e.uid && (t.uid = e.uid), e.recurrence_id && (t.recurrence_id = e.recurrence_id), e.rrule && (t.rrule = e.rrule), t;
}
async function hr(e, t, r, s) {
  const a = /* @__PURE__ */ new Set(), n = encodeURIComponent(r.toISOString()), i = encodeURIComponent(s.toISOString()), o = await Promise.all(
    t.map(
      (c) => e.callApi(
        "GET",
        `calendars/${encodeURIComponent(c)}?start=${n}&end=${i}`
      ).then((d) => [c, d.map(Vr)]).catch((d) => (console.warn(`[lucarne] GET /api/calendars/${c} failed:`, d), a.add(c), [c, []]))
    )
  );
  return { events: new Map(o), failed: a };
}
async function qr(e, t, r, s, a) {
  await e.connection.sendMessagePromise({
    type: "calendar/event/delete",
    entity_id: t,
    uid: r,
    recurrence_id: s,
    recurrence_range: a
  });
}
const Kr = 2;
function Xr(e, t) {
  var s, a;
  const r = (a = (s = e.states[t]) == null ? void 0 : s.attributes) == null ? void 0 : a.supported_features;
  return typeof r != "number" ? !1 : (r & Kr) !== 0;
}
function ot(e, t, r) {
  const s = async () => {
    var a, n;
    try {
      const i = await e.connection.sendMessagePromise({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: {},
        target: { entity_id: t },
        return_response: !0
      });
      r(((n = (a = i == null ? void 0 : i.response) == null ? void 0 : a[t]) == null ? void 0 : n.items) ?? []);
    } catch (i) {
      console.warn(`[lucarne] todo.get_items failed for ${t}:`, i), r([]);
    }
  };
  return s(), ur(e, t, () => s());
}
function Gr(e) {
  let t = e;
  for (; t; ) {
    if (t instanceof Element) {
      const a = t.tagName.toLowerCase();
      if (a === "hui-dialog-edit-card" || a === "ha-dialog") return !0;
    }
    const r = t.parentNode;
    if (r) {
      t = r;
      continue;
    }
    const s = t.getRootNode();
    t = s instanceof ShadowRoot ? s.host : null;
  }
  return !1;
}
function Jr(e) {
  let t = e.parentElement;
  for (; t && !t.style.getPropertyValue("--column-size"); )
    t = t.parentElement;
  return (t == null ? void 0 : t.parentElement) ?? null;
}
function pr(e) {
  if (!Gr(e)) return null;
  const t = Jr(e);
  if (!t) return null;
  const r = t.style.getPropertyValue("--grid-column-count"), s = () => {
    t.style.getPropertyValue("--grid-column-count") !== "1" && t.style.setProperty("--grid-column-count", "1");
  };
  s();
  const a = new MutationObserver(s);
  return a.observe(t, { attributes: !0, attributeFilter: ["style"] }), {
    uninstall() {
      a.disconnect(), r ? t.style.setProperty("--grid-column-count", r) : t.style.removeProperty("--grid-column-count");
    }
  };
}
const Ee = {
  slug: "household",
  name: "Household",
  color: "var(--primary-color)",
  avatar: null,
  todo_entity_id: "todo.lucarne_household",
  streak_counter_id: ""
}, Qr = [
  "lucarne_family_task_added",
  "lucarne_family_task_completed",
  "lucarne_family_task_deleted",
  "lucarne_family_task_metadata_updated",
  "lucarne_family_task_toggled",
  "lucarne_family_all_routines_done",
  "lucarne_family_member_updated",
  "lucarne_family_avatar_uploaded"
];
function Ot(e, t, r) {
  return e.map((s) => {
    const n = r.get(s.uid) ?? {
      item_uid: s.uid,
      member_slug: t,
      assignee_slug: "",
      type: "chore",
      recurrence: "",
      icon: "",
      source: "manual"
    };
    return {
      uid: s.uid,
      summary: s.summary,
      status: s.status,
      due: s.due ?? null,
      description: s.description ?? "",
      metadata: n
    };
  });
}
function Pe(e, t) {
  let r = !1;
  const s = [];
  let a = /* @__PURE__ */ new Map(), n = [];
  const i = /* @__PURE__ */ new Map();
  let o = /* @__PURE__ */ new Map(), c = "", d = "", u = null, m = null;
  function g() {
    if (r) return;
    const _ = /* @__PURE__ */ new Map();
    for (const T of n) {
      const L = i.get(T.todo_entity_id) ?? [];
      _.set(T.slug, Ot(L, T.slug, a));
    }
    const C = i.get("todo.lucarne_household") ?? [];
    _.set("household", Ot(C, "household", a)), t({ members: n, tasksByMember: _, streakByMember: new Map(o), resetTime: c, streakCheckTime: d, integrationError: m });
  }
  async function f() {
    var _, C;
    try {
      const T = await e.connection.sendMessagePromise({
        type: "lucarne_family/get_family"
      });
      if (r) return;
      const L = /* @__PURE__ */ new Map();
      for (const A of T.task_metadata ?? [])
        L.set(A.item_uid, A);
      a = L, c = T.reset_time ?? "", d = T.streak_check_time ?? "", n = (T.members ?? []).filter((A) => A.todo_entity_id ? !0 : (console.debug(`[lucarne] skipping member ${A.slug}: no todo_entity_id yet`), !1)), m = null, o = /* @__PURE__ */ new Map(), s.forEach((A) => A()), s.length = 0;
      for (const A of n) {
        const xr = ot(e, A.todo_entity_id, (Fe) => {
          i.set(A.todo_entity_id, Fe), g();
        });
        if (s.push(xr), A.streak_counter_id) {
          const Fe = (C = (_ = e.states) == null ? void 0 : _[A.streak_counter_id]) == null ? void 0 : C.state;
          if (Fe !== void 0) {
            const Be = parseInt(Fe, 10);
            o.set(A.slug, isNaN(Be) ? 0 : Be);
          }
          const kr = ur(e, A.streak_counter_id, (Be) => {
            const bt = parseInt(Be.state, 10);
            o.set(A.slug, isNaN(bt) ? 0 : bt), g();
          });
          s.push(kr);
        }
      }
      const $r = ot(e, "todo.lucarne_household", (A) => {
        i.set("todo.lucarne_household", A), g();
      });
      s.push($r), g();
    } catch (T) {
      console.warn("[lucarne] get_family failed — integration may not be installed:", T), r || (m = T instanceof Error ? T : new Error(String(T)), s.forEach((L) => L()), s.length = 0, n = [], a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), i.clear(), c = "", d = "", g());
    }
  }
  function y() {
    u === null && (u = setTimeout(() => {
      u = null, f();
    }, 1e3));
  }
  const k = [];
  for (const _ of Qr)
    e.connection.subscribeEvents(() => {
      y();
    }, _).then((C) => {
      r ? C() : k.push(C);
    }).catch((C) => {
      console.debug(`[lucarne] could not subscribe to ${_}:`, C);
    });
  return f(), () => {
    r = !0, u !== null && clearTimeout(u), s.forEach((_) => _()), k.forEach((_) => _());
  };
}
const $ = {
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
  tasksTitle: "Tasks",
  moreItems: (e) => `+ ${e} more`,
  timePillNow: "now",
  timePillInMinutes: (e) => `in ${e}m`,
  timePillInHours: (e) => `in ${e}h`,
  timePillTomorrow: (e) => `tomorrow ${e}`,
  errorUnavailable: "—",
  noRoutinesToday: "no routines today",
  familyReady: (e, t) => `${e}/${t} ready`
};
var Zr = Object.defineProperty, ea = Object.getOwnPropertyDescriptor, Ze = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? ea(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && Zr(t, r, a), a;
};
function Me(e) {
  return e.length === 10 ? /* @__PURE__ */ new Date(e + "T00:00:00") : new Date(e);
}
function ta(e, t, r) {
  return e.filter((s) => Me(s.end) > t).sort((s, a) => Me(s.start).getTime() - Me(a.start).getTime()).slice(0, r);
}
function ra(e, t, r) {
  const s = e.getTime() - r.getTime();
  if (e <= r && r < t) return $.timePillNow;
  if (s > 0 && s < 60 * 60 * 1e3) {
    const d = Math.round(s / 6e4);
    return $.timePillInMinutes(d);
  }
  if (s > 0 && s < 2 * 60 * 60 * 1e3) {
    const d = Math.round(s / 36e5);
    return $.timePillInHours(d);
  }
  const n = e.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (e.toDateString() === r.toDateString()) return n;
  const o = new Date(r);
  return o.setDate(r.getDate() + 1), e.toDateString() === o.toDateString() ? $.timePillTomorrow(n) : `${e.toLocaleDateString("en", { weekday: "short" })} ${n}`;
}
function aa(e) {
  return e.start.length === 10 && e.end.length === 10;
}
let fe = class extends v {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.limit = 5;
  }
  render() {
    const e = /* @__PURE__ */ new Date(), t = ta(this.events, e, this.limit);
    return t.length === 0 ? l`<div class="empty-state">${$.nothingOnCalendar}</div>` : l`
      ${t.map((r) => {
      const s = Me(r.start), a = Me(r.end), n = s <= e && e < a, i = aa(r) ? "all day" : ra(s, a, e), o = this._colorForEvent(r);
      return l`
          <div class="event-row">
            <div class="time-pill ${n ? "now" : ""}">
              ${n ? l`<span class="pulse-dot"></span>` : ""} ${i}
            </div>
            <div class="color-bar" style="background:${o}"></div>
            <div class="event-content">
              <div class="event-summary">${r.summary}</div>
              ${r.location ? l`<div class="event-secondary">${r.location}</div>` : ""}
            </div>
          </div>
        `;
    })}
    `;
  }
  _colorForEvent(e) {
    if (e.uid) {
      const t = e.uid.split("::")[0], r = this.calendarColors.get(t);
      if (r) return r;
    }
    return "var(--lucarne-color-family)";
  }
};
fe.styles = [
  M,
  b`
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
Ze([
  p({ type: Array })
], fe.prototype, "events", 2);
Ze([
  p({ type: Object })
], fe.prototype, "calendarColors", 2);
Ze([
  p({ type: Number })
], fe.prototype, "limit", 2);
fe = Ze([
  w("lucarne-agenda-strip")
], fe);
const It = Z`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`, pe = Z`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>`, xe = Z`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`, Rt = Z`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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
</svg>`, sa = Z`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M4.22 19.78l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="currentColor"/>
  <path d="M20 15h-1.26A6 6 0 1 0 8 20h12a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.7"/>
</svg>`;
Z`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="7" r="4"/>
  <path d="M20 21a8 8 0 1 0-16 0"/>
</svg>`;
Z`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"/>
</svg>`;
const zt = Z`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, Nt = {
  sunny: It,
  "clear-night": It,
  cloudy: pe,
  fog: pe,
  hail: xe,
  lightning: xe,
  "lightning-rainy": xe,
  partlycloudy: sa,
  pouring: xe,
  rainy: xe,
  snowy: Rt,
  "snowy-rainy": Rt,
  windy: pe,
  "windy-variant": pe,
  exceptional: pe
};
function jt(e) {
  return Nt[e] ?? Nt[e.toLowerCase()] ?? pe;
}
const na = {
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
function Ht(e) {
  return na[e.toLowerCase()] ?? "#8aa0b8";
}
function ia(e) {
  if (!e.length) return $.dressingTipDefault;
  const t = e[0];
  if (t.condition.toLowerCase().includes("snow"))
    return $.dressingTipBoots;
  const s = t.temperature;
  let a;
  return s < 5 ? a = $.dressingTipHeavyCoat : s < 12 ? a = $.dressingTipCoatScarf : s < 18 ? a = $.dressingTipLightJacket : s < 24 ? a = $.dressingTipTShirt : a = $.dressingTipShorts, (t.precipitation_probability ?? 0) > 50 && (a += $.dressingTipUmbrella), a;
}
var oa = Object.defineProperty, la = Object.getOwnPropertyDescriptor, ht = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? la(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && oa(t, r, a), a;
};
let Ae = class extends v {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return l`<div class="empty-state">${$.addWeatherEntity}</div>`;
    const e = this.weatherEntity.attributes, t = e.temperature, r = e.temperature_unit ?? "°C", s = this.weatherEntity.state, a = this.forecast[0], n = this.forecast[1], i = ia(this.forecast);
    return l`
      <div class="current">
        <span class="condition-icon" style="color: ${Ht(s)}">${jt(s)}</span>
        <div class="temp-group">
          <div class="current-temp">${t !== void 0 ? `${Math.round(t)}${r}` : $.errorUnavailable}</div>
          ${a ? l`<div class="high-low">
                ↑${Math.round(a.temperature)}${r}
                ${a.templow !== void 0 ? ` ↓${Math.round(a.templow)}${r}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${n ? l`
            <div class="tomorrow-row">
              <span class="tomorrow-icon" style="color: ${Ht(n.condition)}">${jt(n.condition)}</span>
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
Ae.styles = [
  M,
  b`
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
ht([
  p({ attribute: !1 })
], Ae.prototype, "weatherEntity", 2);
ht([
  p({ type: Array })
], Ae.prototype, "forecast", 2);
Ae = ht([
  w("lucarne-weather-block")
], Ae);
var ca = Object.defineProperty, da = Object.getOwnPropertyDescriptor, je = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? da(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && ca(t, r, a), a;
};
let ie = class extends v {
  constructor() {
    super(...arguments), this.items = [], this.integrationMode = !1, this.renderableTasks = [];
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
    return this.integrationMode ? this._renderIntegrationMode() : this._renderRawMode();
  }
  _renderRawMode() {
    const e = this.items.filter((a) => a.status === "needs_action"), t = e.length, r = e.slice(0, 3), s = t - r.length;
    return t === 0 ? l`
        <div class="empty-state">
          <span class="empty-icon">${zt}</span>
          ${$.allDone}
        </div>
      ` : l`
      <div class="header">
        ${$.tasksTitle}
        <span class="count-badge">${t}</span>
      </div>
      ${r.map(
      (a) => l`
          <div class="task-row">
            <span class="summary">${a.summary}</span>
            ${a.due ? l`<span class="due-chip">${this._formatDue(a.due)}</span>` : ""}
          </div>
        `
    )}
      ${s > 0 ? l`<div class="more-row" @click=${this._handleMoreClick}>
            ${$.moreItems(s)}
          </div>` : ""}
    `;
  }
  _renderIntegrationMode() {
    const e = this.renderableTasks.filter((a) => a.status === "needs_action"), t = e.length, r = e.slice(0, 3), s = t - r.length;
    return t === 0 ? l`
        <div class="empty-state">
          <span class="empty-icon">${zt}</span>
          ${$.allDone}
        </div>
      ` : l`
      <div class="header">
        ${$.tasksTitle}
        <span class="count-badge">${t}</span>
      </div>
      ${r.map(
      (a) => l`
          <div class="task-row">
            ${a.metadata.icon ? l`<span class="task-icon">${a.metadata.icon}</span>` : ""}
            <span class="summary">${a.summary}</span>
            ${a.due ? l`<span class="due-chip">${this._formatDue(a.due)}</span>` : ""}
          </div>
        `
    )}
      ${s > 0 ? l`<div class="more-row" @click=${this._handleMoreClick}>
            ${$.moreItems(s)}
          </div>` : ""}
    `;
  }
  _formatDue(e) {
    const t = e.length === 10 ? /* @__PURE__ */ new Date(e + "T00:00:00") : new Date(e);
    return isNaN(t.getTime()) ? e : t.toLocaleDateString("en", { month: "short", day: "numeric" });
  }
};
ie.styles = [
  M,
  b`
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
      .task-icon {
        font-size: 1em;
        flex-shrink: 0;
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
je([
  p({ type: Array })
], ie.prototype, "items", 2);
je([
  p({ type: String })
], ie.prototype, "todoEntityId", 2);
je([
  p({ type: Boolean })
], ie.prototype, "integrationMode", 2);
je([
  p({ attribute: !1 })
], ie.prototype, "renderableTasks", 2);
ie = je([
  w("lucarne-tasks-summary")
], ie);
var ua = Object.defineProperty, ha = Object.getOwnPropertyDescriptor, mr = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? ha(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && ua(t, r, a), a;
};
let Ge = class extends v {
  constructor() {
    super(...arguments), this.entries = [];
  }
  render() {
    return l`
      ${this.entries.map(
      (e) => l`
          <span class="pill ${e.isHome ? "home" : "away"}">
            <span class="dot"></span>
            ${e.name}
          </span>
        `
    )}
    `;
  }
};
Ge.styles = [
  M,
  b`
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
mr([
  p({ type: Array })
], Ge.prototype, "entries", 2);
Ge = mr([
  w("lucarne-presence-pills")
], Ge);
const ge = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
function pt(e) {
  if (!e || e.trim() === "") return { mode: "none" };
  const t = e.trim().split(";"), r = {};
  for (const d of t) {
    const u = d.indexOf("=");
    if (u === -1) return { mode: "unknown", raw: e };
    r[d.slice(0, u)] = d.slice(u + 1);
  }
  const s = r.FREQ;
  let a;
  if (r.INTERVAL !== void 0) {
    if (!/^[1-9]\d*$/.test(r.INTERVAL)) return { mode: "unknown", raw: e };
    a = parseInt(r.INTERVAL, 10);
  }
  const n = r.BYDAY, i = r.BYMONTHDAY, o = r.BYMONTH;
  function c(...d) {
    const u = new Set(d);
    return Object.keys(r).every((m) => u.has(m));
  }
  if (s === "DAILY" && !n && !i && !o)
    return c("FREQ", "INTERVAL") ? { mode: "daily", ...a ? { interval: a } : {} } : { mode: "unknown", raw: e };
  if (s === "WEEKLY" && n && !i && !o) {
    if (!c("FREQ", "BYDAY", "INTERVAL")) return { mode: "unknown", raw: e };
    const d = n.split(",");
    return d.every((u) => ge.includes(u)) ? { mode: "weekly", days: d, ...a ? { interval: a } : {} } : { mode: "unknown", raw: e };
  }
  if (s === "MONTHLY" && i && !n && !o)
    return c("FREQ", "BYMONTHDAY", "INTERVAL") ? /^([1-9]|[12]\d|3[01])$/.test(i) ? { mode: "monthly-date", dayOfMonth: parseInt(i, 10), ...a ? { interval: a } : {} } : { mode: "unknown", raw: e } : { mode: "unknown", raw: e };
  if (s === "MONTHLY" && n && !i && !o) {
    if (!c("FREQ", "BYDAY", "INTERVAL")) return { mode: "unknown", raw: e };
    const d = n.match(/^([+-]?\d+)([A-Z]{2})$/);
    if (!d) return { mode: "unknown", raw: e };
    const u = parseInt(d[1], 10);
    if (![1, 2, 3, 4, -1].includes(u)) return { mode: "unknown", raw: e };
    const m = d[2];
    return ge.includes(m) ? { mode: "monthly-nth", nth: u, day: m, ...a ? { interval: a } : {} } : { mode: "unknown", raw: e };
  }
  if (s === "YEARLY" && o && i && !n) {
    if (!c("FREQ", "BYMONTH", "BYMONTHDAY", "INTERVAL")) return { mode: "unknown", raw: e };
    if (!/^([1-9]|1[0-2])$/.test(o)) return { mode: "unknown", raw: e };
    if (!/^([1-9]|[12]\d|3[01])$/.test(i)) return { mode: "unknown", raw: e };
    const d = parseInt(o, 10), u = parseInt(i, 10);
    return { mode: "yearly", month: d, dayOfMonth: u, ...a ? { interval: a } : {} };
  }
  return { mode: "unknown", raw: e };
}
function F(e) {
  if (e.mode === "none") return "";
  if (e.mode === "daily") {
    let t = "FREQ=DAILY";
    return e.interval && e.interval > 1 && (t += `;INTERVAL=${e.interval}`), t;
  }
  if (e.mode === "weekly") {
    let t = `FREQ=WEEKLY;BYDAY=${e.days.join(",")}`;
    return e.interval && e.interval > 1 && (t += `;INTERVAL=${e.interval}`), t;
  }
  if (e.mode === "monthly-date") {
    let t = `FREQ=MONTHLY;BYMONTHDAY=${e.dayOfMonth}`;
    return e.interval && e.interval > 1 && (t += `;INTERVAL=${e.interval}`), t;
  }
  if (e.mode === "monthly-nth") {
    let r = `FREQ=MONTHLY;BYDAY=${`${e.nth}`}${e.day}`;
    return e.interval && e.interval > 1 && (r += `;INTERVAL=${e.interval}`), r;
  }
  if (e.mode === "yearly") {
    let t = `FREQ=YEARLY;BYMONTH=${e.month};BYMONTHDAY=${e.dayOfMonth}`;
    return e.interval && e.interval > 1 && (t += `;INTERVAL=${e.interval}`), t;
  }
  return "";
}
function fr(e) {
  const t = pt(e);
  if (t.mode === "none") return "One-off (no repeat)";
  if (t.mode === "unknown") return "Custom recurrence (not editable here)";
  const r = "interval" in t && t.interval ? t.interval : 1;
  if (t.mode === "daily")
    return r === 1 ? "Daily" : `Every ${r} days`;
  if (t.mode === "weekly") {
    const s = {
      MO: "Mon",
      TU: "Tue",
      WE: "Wed",
      TH: "Thu",
      FR: "Fri",
      SA: "Sat",
      SU: "Sun"
    }, a = t.days.map((n) => s[n]).join(", ");
    return r === 1 ? `Weekly on ${a}` : `Every ${r} weeks on ${a}`;
  }
  if (t.mode === "monthly-date") {
    const s = Lt(t.dayOfMonth);
    return r === 1 ? `Monthly on the ${t.dayOfMonth}${s}` : `Every ${r} months on the ${t.dayOfMonth}${s}`;
  }
  if (t.mode === "monthly-nth") {
    const s = pa(t.nth), a = {
      MO: "Monday",
      TU: "Tuesday",
      WE: "Wednesday",
      TH: "Thursday",
      FR: "Friday",
      SA: "Saturday",
      SU: "Sunday"
    };
    return r === 1 ? `Monthly on the ${s} ${a[t.day]}` : `Every ${r} months on the ${s} ${a[t.day]}`;
  }
  if (t.mode === "yearly") {
    const s = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ], a = Lt(t.dayOfMonth);
    return r === 1 ? `Yearly on ${s[t.month]} ${t.dayOfMonth}${a}` : `Every ${r} years on ${s[t.month]} ${t.dayOfMonth}${a}`;
  }
  return "";
}
function Lt(e) {
  if (e >= 11 && e <= 13) return "th";
  switch (e % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
function pa(e) {
  return e === -1 ? "last" : e === 1 ? "1st" : e === 2 ? "2nd" : e === 3 ? "3rd" : `${e}th`;
}
const ma = new Date(Date.UTC(1970, 0, 1));
function Ut(e) {
  return Math.floor(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()) / 864e5);
}
function fa(e, t, r) {
  const s = e.getDate();
  if (e.getDay() !== r) return !1;
  if (t > 0)
    return Math.floor((s - 1) / 7) === t - 1;
  const n = new Date(e.getFullYear(), e.getMonth() + 1, 0).getDate();
  return Math.floor((n - s) / 7) === 0;
}
const Ft = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6
};
function ga(e, t = /* @__PURE__ */ new Date()) {
  if (e.mode === "none" || e.mode === "unknown") return !1;
  const r = "interval" in e && e.interval ? e.interval : 1, s = Ut(t) - Ut(ma);
  if (e.mode === "daily")
    return s % r === 0;
  if (e.mode === "weekly") {
    const a = t.getDay();
    return e.days.some((o) => Ft[o] === a) ? r === 1 ? !0 : Math.floor(s / 7) % r === 0 : !1;
  }
  if (e.mode === "monthly-date")
    return t.getDate() !== e.dayOfMonth ? !1 : r === 1 ? !0 : ((t.getFullYear() - 1970) * 12 + t.getMonth()) % r === 0;
  if (e.mode === "monthly-nth") {
    const a = Ft[e.day];
    return fa(t, e.nth, a) ? r === 1 ? !0 : ((t.getFullYear() - 1970) * 12 + t.getMonth()) % r === 0 : !1;
  }
  return e.mode === "yearly" ? t.getMonth() + 1 !== e.month || t.getDate() !== e.dayOfMonth ? !1 : r === 1 ? !0 : (t.getFullYear() - 1970) % r === 0 : !1;
}
var va = Object.defineProperty, ya = Object.getOwnPropertyDescriptor, mt = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? ya(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && va(t, r, a), a;
};
let Oe = class extends v {
  constructor() {
    super(...arguments), this.members = [], this.tasksByMember = /* @__PURE__ */ new Map();
  }
  _handleClick() {
    this.dispatchEvent(new CustomEvent("family-ready-clicked", { bubbles: !0, composed: !0 }));
  }
  _computeReadiness() {
    let e = 0, t = 0;
    const r = /* @__PURE__ */ new Date();
    for (const s of this.members) {
      const n = (this.tasksByMember.get(s.slug) ?? []).filter(
        (i) => i.metadata.type === "routine" && ga(pt(i.metadata.recurrence), r)
      );
      n.length !== 0 && (e++, n.every((i) => i.status === "completed") && t++);
    }
    return { readyCount: t, totalWithRoutines: e };
  }
  render() {
    const { readyCount: e, totalWithRoutines: t } = this._computeReadiness();
    if (t === 0)
      return l`
        <div class="pill none" @click=${this._handleClick}>
          <span class="icon">✓</span>
          ${$.noRoutinesToday}
        </div>
      `;
    const r = e === t;
    return l`
      <div class="pill ${r ? "all-done" : ""}" @click=${this._handleClick}>
        <span class="icon">${r ? "🎉" : "⏳"}</span>
        ${$.familyReady(e, t)}
      </div>
    `;
  }
};
Oe.styles = [
  M,
  b`
      :host {
        display: inline-block;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 10px;
        border-radius: var(--lucarne-radius-lg);
        background: rgba(0, 0, 0, 0.07);
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: var(--lucarne-on-surface-muted);
        cursor: pointer;
        user-select: none;
        transition: background 0.15s;
      }
      .pill:hover {
        background: rgba(0, 0, 0, 0.12);
      }
      .pill.all-done {
        background: var(--lucarne-success-bg);
        color: var(--lucarne-success-fg);
      }
      .pill.none {
        opacity: 0.5;
      }
      .icon {
        font-size: 1.1em;
      }
    `
];
mt([
  p({ attribute: !1 })
], Oe.prototype, "members", 2);
mt([
  p({ attribute: !1 })
], Oe.prototype, "tasksByMember", 2);
Oe = mt([
  w("lucarne-family-ready-pill")
], Oe);
var _a = Object.defineProperty, ba = Object.getOwnPropertyDescriptor, de = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? ba(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && _a(t, r, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-today-card",
  name: "Lucarne Today",
  description: "Family agenda + weather + tasks + presence",
  preview: !0
});
let V = class extends v {
  constructor() {
    super(...arguments), this._calendarEvents = /* @__PURE__ */ new Map(), this._forecast = [], this._todoItems = [], this._familyState = null, this._fetchingForecast = !1, this._lastWeatherState = "";
  }
  setConfig(e) {
    if (!e.calendars || !Array.isArray(e.calendars) || e.calendars.length === 0)
      throw new Error('lucarne-today-card: "calendars" must be a non-empty array');
    for (const t of e.calendars)
      if (!t.entity || !t.color)
        throw new Error('lucarne-today-card: each calendar entry requires "entity" and "color"');
    this._config = e, this.isConnected && (this._teardownSubscriptions(), this._setupSubscriptions());
  }
  static getConfigElement() {
    return document.createElement("lucarne-today-card-editor");
  }
  static getStubConfig(e) {
    const t = Object.keys(e.states).filter((n) => n.startsWith("calendar.")).slice(0, 3), r = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], s = t.map((n, i) => ({
      entity: n,
      color: r[i] ?? "#a8d8b9"
    })), a = "weather.forecast_home" in e.states;
    return {
      type: "custom:lucarne-today-card",
      title: $.today,
      calendars: s.length ? s : [{ entity: "calendar.example", color: "#a8d8b9" }],
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
      this._previewOverrideRaf = void 0, this.isConnected && (this._previewOverride = pr(this));
    });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), this._teardownSubscriptions(), this._previewOverrideRaf !== void 0 && (cancelAnimationFrame(this._previewOverrideRaf), this._previewOverrideRaf = void 0), (e = this._previewOverride) == null || e.uninstall(), this._previewOverride = void 0;
  }
  _setupSubscriptions() {
    !this._config || !this.hass || (this._fetchCalendarEvents(), this._config.weather && this._fetchForecast(), this._calendarIntervalId = setInterval(() => {
      var e;
      this._fetchCalendarEvents(), (e = this._config) != null && e.weather && this._fetchForecast();
    }, 5 * 60 * 1e3), this._config.tasks && !this._config.household_tasks_from_integration && (this._todoUnsub = ot(this.hass, this._config.tasks, (e) => {
      this._todoItems = e;
    })), (this._config.household_tasks_from_integration || this._config.show_family_ready_pill) && (this._unsubFamily = Pe(this.hass, (e) => {
      this._familyState = e;
    })));
  }
  _teardownSubscriptions() {
    var e, t;
    clearInterval(this._calendarIntervalId), (e = this._todoUnsub) == null || e.call(this), this._todoUnsub = void 0, (t = this._unsubFamily) == null || t.call(this), this._unsubFamily = void 0, this._calendarIntervalId = void 0;
  }
  updated(e) {
    var s;
    if (super.updated(e), !e.has("hass") || !this._config) return;
    if (!e.get("hass") && this.hass && !this._calendarIntervalId) {
      this._setupSubscriptions();
      return;
    }
    const r = this._config.weather;
    if (r) {
      const a = (s = this.hass.states[r]) == null ? void 0 : s.state;
      a && a !== this._lastWeatherState && (this._lastWeatherState = a, this._fetchForecast());
    }
  }
  async _fetchCalendarEvents() {
    if (!this._config || !this.hass) return;
    const e = this._config.calendars.map((n) => n.entity), t = /* @__PURE__ */ new Date(), r = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), { events: s } = await hr(this.hass, e, t, r), a = /* @__PURE__ */ new Map();
    for (const [n, i] of s.entries())
      a.set(
        n,
        i.map((o) => ({ ...o, uid: `${n}::${o.uid ?? o.summary}` }))
      );
    this._calendarEvents = a;
  }
  async _fetchForecast() {
    var e, t, r;
    if (!(this._fetchingForecast || !((e = this._config) != null && e.weather) || !this.hass)) {
      this._fetchingForecast = !0;
      try {
        const s = await this.hass.connection.sendMessagePromise({
          type: "call_service",
          domain: "weather",
          service: "get_forecasts",
          service_data: { type: "daily" },
          target: { entity_id: this._config.weather },
          return_response: !0
        });
        this._forecast = ((r = (t = s == null ? void 0 : s.response) == null ? void 0 : t[this._config.weather]) == null ? void 0 : r.forecast) ?? [];
      } catch (s) {
        console.warn(`[lucarne] weather.get_forecasts failed for ${this._config.weather}:`, s), this._forecast = [];
      } finally {
        this._fetchingForecast = !1;
      }
    }
  }
  get _mergedEvents() {
    const e = [];
    for (const t of this._calendarEvents.values())
      e.push(...t);
    return e;
  }
  get _calendarColorMap() {
    var t;
    const e = /* @__PURE__ */ new Map();
    for (const r of ((t = this._config) == null ? void 0 : t.calendars) ?? [])
      e.set(r.entity, r.color);
    return e;
  }
  get _householdTasks() {
    var e;
    return ((e = this._familyState) == null ? void 0 : e.tasksByMember.get("household")) ?? [];
  }
  get _familyMembers() {
    var e;
    return ((e = this._familyState) == null ? void 0 : e.members) ?? [];
  }
  get _familyTasksByMember() {
    var e;
    return ((e = this._familyState) == null ? void 0 : e.tasksByMember) ?? /* @__PURE__ */ new Map();
  }
  render() {
    var i;
    if (!this._config) return l``;
    const e = this._config.weather ? (i = this.hass) == null ? void 0 : i.states[this._config.weather] : void 0, t = (this._config.presence ?? []).map((o) => {
      var c, d;
      return {
        name: o.name,
        isHome: ((d = (c = this.hass) == null ? void 0 : c.states[o.entity]) == null ? void 0 : d.state) === "on"
      };
    }), r = this._familyState !== null && this._familyState.integrationError === null, s = (this._config.show_family_ready_pill ?? !1) && r, a = (this._config.household_tasks_from_integration ?? !1) && r, n = !(this._config.household_tasks_from_integration ?? !1) && !!this._config.tasks;
    return l`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${this._config.title ?? $.today}</h2>
          <div class="header-right">
            ${t.length > 0 ? l`<lucarne-presence-pills .entries=${t}></lucarne-presence-pills>` : ""}
            ${s ? l`<lucarne-family-ready-pill
                  .members=${this._familyMembers}
                  .tasksByMember=${this._familyTasksByMember}
                ></lucarne-family-ready-pill>` : ""}
          </div>
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
                .weatherEntity=${e}
                .forecast=${this._forecast}
              ></lucarne-weather-block>
            </div>
            ${n ? l`
                  <div class="tasks-section">
                    <lucarne-tasks-summary
                      .items=${this._todoItems}
                      .todoEntityId=${this._config.tasks}
                    ></lucarne-tasks-summary>
                  </div>
                ` : ""}
            ${a ? l`
                  <div class="tasks-section">
                    <lucarne-tasks-summary
                      .integrationMode=${!0}
                      .renderableTasks=${this._householdTasks}
                      .todoEntityId=${"todo.lucarne_household"}
                    ></lucarne-tasks-summary>
                  </div>
                ` : ""}
          </div>
        </div>
      </ha-card>
    `;
  }
};
V.styles = [
  M,
  b`
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
      .header-right {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
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
de([
  p({ attribute: !1 })
], V.prototype, "hass", 2);
de([
  h()
], V.prototype, "_config", 2);
de([
  h()
], V.prototype, "_calendarEvents", 2);
de([
  h()
], V.prototype, "_forecast", 2);
de([
  h()
], V.prototype, "_todoItems", 2);
de([
  h()
], V.prototype, "_familyState", 2);
V = de([
  w("lucarne-today-card")
], V);
const gr = b`
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
  .field-inline {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--lucarne-spacing-md);
  }
  .field-inline .field-label {
    flex: 1;
  }
  .field-inline input[type='checkbox'] {
    flex-shrink: 0;
    margin: 0;
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
`, Bt = ["ha-entity-picker", "ha-textfield"], wa = 3e3;
let We;
function $a(e) {
  return new Promise((t) => setTimeout(t, e));
}
async function xa() {
  const e = window.loadCardHelpers;
  if (e)
    try {
      const a = await e(), i = (await Promise.resolve(
        a.createCardElement({ type: "entities", entities: [] })
      )).constructor;
      typeof (i == null ? void 0 : i.getConfigElement) == "function" && await Promise.resolve(i.getConfigElement());
    } catch (a) {
      console.warn("[lucarne] loadCardHelpers failed; falling back to whenDefined", a);
    }
  const t = Promise.all(
    Bt.map((a) => customElements.whenDefined(a))
  ).then(() => "ready"), r = $a(wa).then(() => "timeout");
  if (await Promise.race([t, r]) === "timeout" && !Bt.every((a) => customElements.get(a)))
    throw new Error("[lucarne] HA form elements did not register within timeout");
}
function vr() {
  return We || (We = xa().catch((e) => {
    throw We = void 0, e;
  })), We;
}
var Wt, Yt;
(function(e) {
  e.language = "language", e.system = "system", e.comma_decimal = "comma_decimal", e.decimal_comma = "decimal_comma", e.space_comma = "space_comma", e.none = "none";
})(Wt || (Wt = {})), function(e) {
  e.language = "language", e.system = "system", e.am_pm = "12", e.twenty_four = "24";
}(Yt || (Yt = {}));
var ft = function(e, t, r, s) {
  s = s || {}, r = r ?? {};
  var a = new Event(t, { bubbles: s.bubbles === void 0 || s.bubbles, cancelable: !!s.cancelable, composed: s.composed === void 0 || s.composed });
  return a.detail = r, e.dispatchEvent(a), a;
}, ka = Object.defineProperty, Ca = Object.getOwnPropertyDescriptor, et = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? Ca(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && ka(t, r, a), a;
};
let ve = class extends v {
  constructor() {
    super(...arguments), this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), vr().catch((e) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", e)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(e) {
    this._config = e;
  }
  _fire(e) {
    ft(this, "config-changed", { config: e });
  }
  _titleChanged(e) {
    const t = e.target;
    this._fire({ ...this._config, title: t.value || void 0 });
  }
  _weatherChanged(e) {
    var t;
    this._fire({ ...this._config, weather: ((t = e.detail) == null ? void 0 : t.value) ?? void 0 });
  }
  _tasksChanged(e) {
    var t;
    this._fire({ ...this._config, tasks: ((t = e.detail) == null ? void 0 : t.value) ?? void 0 });
  }
  _integrationTasksChanged(e) {
    const t = e.target.checked;
    this._fire({ ...this._config, household_tasks_from_integration: t || void 0 });
  }
  _familyPillChanged(e) {
    const t = e.target.checked;
    this._fire({ ...this._config, show_family_ready_pill: t || void 0 });
  }
  _isIntegrationAvailable() {
    var e, t;
    return !!((t = (e = this.hass) == null ? void 0 : e.states) != null && t[Ee.todo_entity_id]);
  }
  _agendaLimitChanged(e) {
    const t = e.target, r = parseInt(t.value, 10);
    this._fire({ ...this._config, agenda_limit: isNaN(r) ? void 0 : Math.min(10, Math.max(1, r)) });
  }
  _calEntityChanged(e, t) {
    var s, a;
    const r = [...((s = this._config) == null ? void 0 : s.calendars) ?? []];
    r[e] = { ...r[e], entity: ((a = t.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, calendars: r });
  }
  _calColorChanged(e, t) {
    var s;
    const r = [...((s = this._config) == null ? void 0 : s.calendars) ?? []];
    r[e] = { ...r[e], color: t.target.value }, this._fire({ ...this._config, calendars: r });
  }
  _removeCalendar(e) {
    var r;
    const t = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    t.length <= 1 || (t.splice(e, 1), this._fire({ ...this._config, calendars: t }));
  }
  _addCalendar() {
    var s, a;
    const t = Object.keys(((s = this.hass) == null ? void 0 : s.states) ?? {}).find((n) => n.startsWith("calendar.")) ?? "calendar.example", r = [
      ...((a = this._config) == null ? void 0 : a.calendars) ?? [],
      { entity: t, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  _presenceEntityChanged(e, t) {
    var s, a;
    const r = [...((s = this._config) == null ? void 0 : s.presence) ?? []];
    r[e] = { ...r[e], entity: ((a = t.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, presence: r });
  }
  _presenceNameChanged(e, t) {
    var s;
    const r = [...((s = this._config) == null ? void 0 : s.presence) ?? []];
    r[e] = { ...r[e], name: t.target.value }, this._fire({ ...this._config, presence: r });
  }
  _removePresence(e) {
    var r;
    const t = [...((r = this._config) == null ? void 0 : r.presence) ?? []];
    t.splice(e, 1), this._fire({ ...this._config, presence: t });
  }
  _addPresence() {
    var t;
    const e = [...((t = this._config) == null ? void 0 : t.presence) ?? [], { entity: "", name: "" }];
    this._fire({ ...this._config, presence: e });
  }
  render() {
    if (!this._config) return l``;
    if (!this._haReady) return l`<div class="loading">Loading editor…</div>`;
    const e = this._config.calendars ?? [], t = this._config.presence ?? [];
    return l`
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

      <div class="section-label">Lucarne Family integration</div>
      <label class="field field-inline" style="${this._isIntegrationAvailable() ? "" : "opacity:0.5;pointer-events:none"}">
        <span class="field-label">Household tasks from integration</span>
        <input
          type="checkbox"
          .checked=${this._config.household_tasks_from_integration ?? !1}
          @change=${this._integrationTasksChanged}
          ?disabled=${!this._isIntegrationAvailable()}
        />
        ${this._isIntegrationAvailable() ? "" : l`<small> — install Lucarne Family integration first</small>`}
      </label>
      <label class="field field-inline" style="${this._isIntegrationAvailable() ? "" : "opacity:0.5;pointer-events:none"}">
        <span class="field-label">Show family ready pill</span>
        <input
          type="checkbox"
          .checked=${this._config.show_family_ready_pill ?? !1}
          @change=${this._familyPillChanged}
          ?disabled=${!this._isIntegrationAvailable()}
        />
        ${this._isIntegrationAvailable() ? "" : l`<small> — install Lucarne Family integration first</small>`}
      </label>

      <div class="section-label">Calendars</div>
      ${e.map(
      (r, s) => l`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${r.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(a) => this._calEntityChanged(s, a)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${r.color}
              @input=${(a) => this._calColorChanged(s, a)}
              title="Calendar color"
            />
            <button type="button" class="remove" @click=${() => this._removeCalendar(s)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addCalendar}>+ Add calendar</button>

      <div class="section-label">Presence</div>
      ${t.map(
      (r, s) => l`
          <div class="presence-row">
            <div class="row-stack">
              <ha-entity-picker
                label="Entity"
                .hass=${this.hass}
                .value=${r.entity}
                .includeDomains=${["input_boolean"]}
                allow-custom-entity
                @value-changed=${(a) => this._presenceEntityChanged(s, a)}
              ></ha-entity-picker>
              <input
                class="text-input"
                type="text"
                placeholder="Display name"
                .value=${r.name}
                @change=${(a) => this._presenceNameChanged(s, a)}
              />
            </div>
            <button type="button" class="remove" @click=${() => this._removePresence(s)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addPresence}>+ Add person</button>
    `;
  }
};
ve.styles = [M, gr];
et([
  p({ attribute: !1 })
], ve.prototype, "hass", 2);
et([
  h()
], ve.prototype, "_config", 2);
et([
  h()
], ve.prototype, "_haReady", 2);
ve = et([
  w("lucarne-today-card-editor")
], ve);
function yr(e, t) {
  var s, a, n;
  const r = (n = (a = (s = t == null ? void 0 : t.states) == null ? void 0 : s[e.entity]) == null ? void 0 : a.attributes) == null ? void 0 : n.friendly_name;
  return typeof r == "string" && r ? r : e.entity;
}
function Vt(e, t) {
  return e.map((r) => ({ ...r, label: yr(r, t) }));
}
function qt(e, t) {
  const r = parseInt(e.split(":")[0], 10), s = parseInt(t.split(":")[0], 10), a = [];
  for (let n = r; n <= s; n++)
    a.push(n);
  return a;
}
function Ea(e, t, r) {
  const [s, a] = t.split(":").map(Number), [n, i] = r.split(":").map(Number), o = new Date(e);
  o.setHours(s, a, 0, 0);
  const c = new Date(e);
  return c.setHours(n, i, 0, 0), { bandStartMs: o.getTime(), bandEndMs: c.getTime() };
}
function Ma(e, t, r, s) {
  const a = Kt(e.start).getTime(), n = Kt(e.end).getTime(), { bandStartMs: i, bandEndMs: o } = Ea(t, r, s), c = Math.max(a, i), d = Math.min(n, o);
  return c >= d ? null : { start: new Date(c), end: new Date(d) };
}
function Kt(e) {
  return e.length === 10 && !e.includes("T") ? /* @__PURE__ */ new Date(`${e}T00:00:00`) : new Date(e);
}
function Da(e) {
  return e.start.length === 10 && !e.start.includes("T");
}
function N(e) {
  const t = e.getFullYear(), r = String(e.getMonth() + 1).padStart(2, "0"), s = String(e.getDate()).padStart(2, "0");
  return `${t}-${r}-${s}`;
}
function _r(e) {
  return e.uid ?? `${e.start}|${e.end}|${e.summary ?? ""}`;
}
function Sa(e) {
  if (e.length === 0) return [];
  const t = e.map((c, d) => ({ ...c, _idx: d }));
  t.sort((c, d) => c.start.getTime() - d.start.getTime());
  const r = [], s = new Array(e.length);
  for (const c of t) {
    const d = c.start.getTime();
    let u = r.findIndex((m) => m <= d);
    u === -1 ? (u = r.length, r.push(c.end.getTime())) : r[u] = c.end.getTime(), s[c._idx] = u;
  }
  const a = new Array(e.length), n = [];
  let i = 0, o = t[0].end.getTime();
  a[t[0]._idx] = 0, n.push(s[t[0]._idx]);
  for (let c = 1; c < t.length; c++) {
    const d = t[c];
    d.start.getTime() >= o ? (i++, n.push(0), o = d.end.getTime()) : o = Math.max(o, d.end.getTime()), a[d._idx] = i, n[i] = Math.max(n[i], s[d._idx]);
  }
  return s.map((c, d) => ({
    lane: c,
    laneCount: n[a[d]] + 1
  }));
}
function Ye(e, t) {
  const [r, s] = t.split(":").map(Number), a = new Date(e);
  return a.setHours(r, s, 0, 0), a.getTime();
}
function Ta(e, t, r, s) {
  const a = /* @__PURE__ */ new Map();
  for (const o of t)
    a.set(N(o), { allDay: [], inBand: [], earlier: [], later: [] });
  const n = t.length > 0 ? t[0] : null, i = t.length > 0 ? t[t.length - 1] : null;
  for (const o of e) {
    if (Da(o)) {
      const u = /* @__PURE__ */ new Date(o.start + "T00:00:00"), m = /* @__PURE__ */ new Date(o.end + "T00:00:00"), g = n !== null && u < n, f = i ? new Date(i) : null;
      f && f.setDate(f.getDate() + 1);
      const y = f !== null && m > f;
      for (const k of t) {
        const _ = N(k), C = a.get(_);
        if (k >= u && k < m && (C.allDay.push(o), g || y)) {
          C.allDayClipped || (C.allDayClipped = /* @__PURE__ */ new Map());
          const T = n !== null && N(k) === N(n), L = i !== null && N(k) === N(i);
          C.allDayClipped.set(_r(o), {
            left: g && T,
            right: y && L
          });
        }
      }
      continue;
    }
    const c = new Date(o.start), d = new Date(o.end);
    for (const u of t) {
      const m = N(u), g = a.get(m), f = new Date(u);
      f.setHours(0, 0, 0, 0);
      const y = new Date(u);
      if (y.setHours(23, 59, 59, 999), d <= f || c > y) continue;
      const k = Ye(u, r), _ = Ye(u, s);
      if (d.getTime() <= k)
        g.earlier.push(o);
      else if (c.getTime() >= _)
        g.later.push(o);
      else {
        const C = Ma(o, u, r, s);
        if (C) {
          const T = _ - k, L = (C.start.getTime() - k) / T * 100, _t = (C.end.getTime() - C.start.getTime()) / T * 100;
          g.inBand.push({
            event: o,
            lane: 0,
            laneCount: 1,
            topPercent: Math.max(0, Math.min(100, L)),
            heightPercent: Math.max(0, Math.min(100 - L, _t))
          });
        }
      }
    }
  }
  for (const o of t) {
    const c = N(o), d = a.get(c);
    if (d.inBand.length === 0) continue;
    const u = Ye(o, r), g = Ye(o, s) - u, f = d.inBand.map((k) => {
      const _ = u + k.topPercent / 100 * g, C = _ + k.heightPercent / 100 * g;
      return {
        event: k.event,
        start: new Date(_),
        end: new Date(C),
        lane: 0
      };
    }), y = Sa(f);
    d.inBand = d.inBand.map((k, _) => ({
      ...k,
      lane: y[_].lane,
      laneCount: y[_].laneCount
    }));
  }
  return { days: t, perDay: a };
}
function Pa(e, t) {
  const r = Math.min(t.minColWidth, t.maxColWidth), s = Math.max(t.minColWidth, t.maxColWidth), a = Math.min(t.minDays, t.maxDays), n = Math.max(t.minDays, t.maxDays), i = Math.max(0, e - t.timeColWidth);
  if (i <= 0)
    return { visibleCount: a, dayWidthPx: r };
  const o = Math.floor(i / r), c = Math.ceil(i / s), d = Math.min(n, Math.max(a, c, Math.min(o, n))), u = i / d;
  return { visibleCount: d, dayWidthPx: u };
}
function Aa(e) {
  return `syn:${e.start}|${e.end}|${e.summary ?? ""}`;
}
function Xt(e) {
  if (e !== void 0 && !(typeof e != "number" || !Number.isFinite(e)))
    return Math.max(0, Math.floor(e));
}
function Ve(e, t) {
  const r = new Date(e);
  return r.setDate(r.getDate() + t), r;
}
function Gt(e) {
  const t = new Date(e);
  return t.setHours(0, 0, 0, 0), t;
}
class Oa {
  constructor(t, r) {
    this._isConnected = !1, this._hasHass = !1, this._dayOffset = 0, this._fetchSeq = 0, this._cachedEvents = /* @__PURE__ */ new Map(), this._cachedDayKeys = /* @__PURE__ */ new Set(), this._host = t, this._opts = r, this._fetcher = r.fetcher ?? hr, this._pollIntervalMs = r.pollIntervalMs ?? 5 * 6e4, this._tickIntervalMs = r.tickIntervalMs ?? 6e4, this._panBound = r.panBoundDays ?? 90, this._visibleCount = r.visibleCount, this._bufferDaysExplicit = Xt(r.bufferDays);
    const s = (r.now ?? (() => /* @__PURE__ */ new Date()))();
    this._anchorToday = Gt(s), t.addController(this);
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
  setHass(t) {
    const r = !this._hasHass;
    this._hass = t, this._hasHass = !0, r && this._isConnected && this._fetchRange(...this._computeRange());
  }
  updateCalendars(t) {
    const r = new Set(this._opts.calendars.map((n) => n.entity)), s = new Set(t.map((n) => n.entity)), a = r.size !== s.size || [...s].some((n) => !r.has(n));
    this._opts.calendars = t, a && this._hass && this._fetchRange(...this._computeRange());
  }
  setVisibleCount(t) {
    var s, a;
    const r = this._visibleCount;
    if (this._visibleCount = t, (a = (s = this._opts).onChange) == null || a.call(s), this._host.requestUpdate(), t !== r) {
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
  setBufferDays(t) {
    var s, a;
    const r = Xt(t);
    r !== this._bufferDaysExplicit && (this._bufferDaysExplicit = r, (a = (s = this._opts).onChange) == null || a.call(s), this._host.requestUpdate());
  }
  pan(t) {
    var o, c;
    const r = -this._panBound, s = this._panBound - this._visibleCount, a = Math.max(r, Math.min(s, this._dayOffset + t));
    this._dayOffset = a, (c = (o = this._opts).onChange) == null || c.call(o), this._host.requestUpdate();
    const [n, i] = this._computeRange();
    this._rangeIsCovered(n, i) || this._fetchRange(n, i);
  }
  goToToday() {
    var a, n;
    const t = this._dayOffset === 0;
    this._dayOffset = 0, t || (n = (a = this._opts).onChange) == null || n.call(a), this._host.requestUpdate();
    const [r, s] = this._computeRange();
    this._rangeIsCovered(r, s) || this._fetchRange(r, s);
  }
  tick() {
    var s, a;
    const t = (this._opts.now ?? (() => /* @__PURE__ */ new Date()))(), r = Gt(t);
    r.getTime() !== this._anchorToday.getTime() && (this._anchorToday = r, this._dayOffset === 0 && ((a = (s = this._opts).onChange) == null || a.call(s), this._host.requestUpdate(), this._hass && this._fetchRange(...this._computeRange())));
  }
  async _poll() {
    this._hass && this._fetchRange(...this._computeRange());
  }
  // -------------------------------------------------------------------------
  // Getters
  // -------------------------------------------------------------------------
  get days() {
    return Array.from({ length: this._visibleCount }, (t, r) => {
      const s = Ve(this._anchorToday, this._dayOffset + r);
      return s.setHours(0, 0, 0, 0), s;
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
    const t = this.bufferDays, r = t * 2 + this._visibleCount;
    return Array.from({ length: r }, (s, a) => {
      const n = Ve(this._anchorToday, this._dayOffset - t + a);
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
    const t = [], r = new Date(this._cacheStart);
    for (; r < this._cacheEnd; )
      t.push(new Date(r)), r.setDate(r.getDate() + 1);
    return t;
  }
  isDayCached(t) {
    return this._cachedDayKeys.has(N(t));
  }
  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------
  /** Compute [start, end) for the current visible+buffer range. */
  _computeRange() {
    const t = this._visibleCount, r = Ve(this._anchorToday, this._dayOffset - t);
    r.setHours(0, 0, 0, 0);
    const s = Ve(this._anchorToday, this._dayOffset + 2 * t);
    return s.setHours(0, 0, 0, 0), [r, s];
  }
  _rangeIsCovered(t, r) {
    return !this._cacheStart || !this._cacheEnd ? !1 : t >= this._cacheStart && r <= this._cacheEnd;
  }
  _fetchRange(t, r) {
    var n, i;
    if (!this._hass) return;
    const s = ++this._fetchSeq, a = this._opts.calendars.map((o) => o.entity);
    (i = (n = this._opts).onFetchStart) == null || i.call(n, { start: t, end: r }), this._fetcher(this._hass, a, t, r).then(({ events: o, failed: c }) => {
      var u, m;
      if (s !== this._fetchSeq) return;
      const d = /* @__PURE__ */ new Map();
      for (const [g, f] of o.entries())
        d.set(
          g,
          f.map((y) => {
            const k = y.uid && y.uid.length > 0 ? y.uid : Aa(y);
            return { ...y, uid: `${g}::${k}` };
          })
        );
      this._cachedEvents = d, this._cachedDayKeys = /* @__PURE__ */ new Set();
      for (const g = new Date(t); g < r; g.setDate(g.getDate() + 1))
        this._cachedDayKeys.add(N(g));
      this._cacheStart = new Date(t), this._cacheEnd = new Date(r), (m = (u = this._opts).onFetchComplete) == null || m.call(u, d, c);
    }).catch((o) => {
      console.warn("[lucarne] RollingWindowController fetch failed:", o);
    });
  }
}
var Ia = Object.defineProperty, Ra = Object.getOwnPropertyDescriptor, gt = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? Ra(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && Ia(t, r, a), a;
};
let Ie = class extends v {
  constructor() {
    super(...arguments), this.calendars = [], this.visibleIds = /* @__PURE__ */ new Set();
  }
  _toggle(e) {
    const t = new Set(this.visibleIds);
    t.has(e) ? t.delete(e) : t.add(e), this.dispatchEvent(new CustomEvent("visibility-change", { detail: t, bubbles: !0, composed: !0 }));
  }
  render() {
    return l`
      ${this.calendars.map(
      (e) => l`
          <button
            class="pill ${this.visibleIds.has(e.entity) ? "visible" : "hidden"}"
            style="background: ${this.visibleIds.has(e.entity) ? e.color + "33" : "transparent"}"
            @click=${() => this._toggle(e.entity)}
            aria-pressed=${this.visibleIds.has(e.entity)}
            aria-label="${e.label}"
          >
            <span class="dot" style="background: ${e.color}"></span>
            <span class="label">${e.label}</span>
          </button>
        `
    )}
    `;
  }
};
Ie.styles = [
  M,
  b`
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
gt([
  p({ type: Array })
], Ie.prototype, "calendars", 2);
gt([
  p({ type: Object })
], Ie.prototype, "visibleIds", 2);
Ie = gt([
  w("lucarne-visibility-pills")
], Ie);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const za = { ATTRIBUTE: 1 }, Na = (e) => (...t) => ({ _$litDirective$: e, values: t });
let ja = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, r, s) {
    this._$Ct = t, this._$AM = r, this._$Ci = s;
  }
  _$AS(t, r) {
    return this.update(t, r);
  }
  update(t, r) {
    return this.render(...r);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const br = "important", Ha = " !" + br, La = Na(class extends ja {
  constructor(e) {
    var t;
    if (super(e), e.type !== za.ATTRIBUTE || e.name !== "style" || ((t = e.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(e) {
    return Object.keys(e).reduce((t, r) => {
      const s = e[r];
      return s == null ? t : t + `${r = r.includes("-") ? r : r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
    }, "");
  }
  update(e, [t]) {
    const { style: r } = e.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const s of this.ft) t[s] == null && (this.ft.delete(s), s.includes("-") ? r.removeProperty(s) : r[s] = null);
    for (const s in t) {
      const a = t[s];
      if (a != null) {
        this.ft.add(s);
        const n = typeof a == "string" && a.endsWith(Ha);
        s.includes("-") || n ? r.setProperty(s, n ? a.slice(0, -11) : a, n ? br : "") : r[s] = a;
      }
    }
    return ne;
  }
});
var Ua = Object.defineProperty, Fa = Object.getOwnPropertyDescriptor, ue = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? Fa(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && Ua(t, r, a), a;
};
function Jt(e) {
  return e.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
}
let q = class extends v {
  constructor() {
    super(...arguments), this.color = "#a8d8b9", this.lane = 0, this.laneCount = 1, this.topPercent = 0, this.heightPercent = 10;
  }
  _handleClick(e) {
    e.stopPropagation(), this.dispatchEvent(
      new CustomEvent("lucarne-event-tap", {
        detail: { event: this.event, color: this.color },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    const e = new Date(this.event.start), t = new Date(this.event.end), r = `${Jt(e)}–${Jt(t)}`, s = this.event.pending ? "0.5" : "1";
    return l`
      <div @click=${this._handleClick} style="height:100%;width:100%;overflow:hidden;opacity:${s}">
        <div class="event-summary">${this.event.summary}</div>
        <div class="event-time">${r}</div>
      </div>
    `;
  }
};
q.styles = [
  M,
  b`
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
ue([
  p({ type: Object })
], q.prototype, "event", 2);
ue([
  p({ type: String })
], q.prototype, "color", 2);
ue([
  p({ type: Number })
], q.prototype, "lane", 2);
ue([
  p({ type: Number })
], q.prototype, "laneCount", 2);
ue([
  p({ type: Number })
], q.prototype, "topPercent", 2);
ue([
  p({ type: Number })
], q.prototype, "heightPercent", 2);
q = ue([
  w("lucarne-calendar-event-block")
], q);
var Ba = Object.defineProperty, Wa = Object.getOwnPropertyDescriptor, He = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? Wa(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && Ba(t, r, a), a;
};
let oe = class extends v {
  constructor() {
    super(...arguments), this.events = [], this.label = "earlier", this.eventColors = /* @__PURE__ */ new Map(), this._open = !1;
  }
  _formatTime(e) {
    return new Date(e).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
  }
  _openPopover(e) {
    e.stopPropagation(), this._chipEl = e.currentTarget, this._open = !0;
  }
  _close() {
    this._open = !1;
  }
  _tapEvent(e, t) {
    e.stopPropagation(), this._close(), this.dispatchEvent(
      new CustomEvent("lucarne-event-tap", {
        detail: { event: t, color: this.eventColors.get(t.uid ?? "") ?? "#a8d8b9" },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    if (this.events.length === 0) return l``;
    const e = this._chipEl;
    let t = 0, r = 0;
    if (e) {
      const s = e.getBoundingClientRect();
      t = s.bottom + 4, r = s.left;
    }
    return l`
      <button class="stub-chip" @click=${this._openPopover}>
        +${this.events.length} ${this.label}
      </button>

      ${this._open ? l`
            <div class="backdrop" @click=${this._close}></div>
            <div class="mini-popover" style="top:${t}px;left:${r}px;">
              <div class="mini-title">${this.label}</div>
              ${this.events.map(
      (s) => l`
                  <div class="mini-event" @click=${(a) => this._tapEvent(a, s)}>
                    <span class="mini-event-summary">${s.summary}</span>
                    <span class="mini-event-time">${this._formatTime(s.start)}</span>
                  </div>
                `
    )}
            </div>
          ` : ""}
    `;
  }
};
oe.styles = [
  M,
  b`
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
He([
  p({ type: Array })
], oe.prototype, "events", 2);
He([
  p({ type: String })
], oe.prototype, "label", 2);
He([
  p({ type: Object })
], oe.prototype, "eventColors", 2);
He([
  h()
], oe.prototype, "_open", 2);
oe = He([
  w("lucarne-out-of-band-stub")
], oe);
var Ya = Object.defineProperty, Va = Object.getOwnPropertyDescriptor, tt = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? Va(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && Ya(t, r, a), a;
};
function qa(e) {
  return 20 + (e * 37 + 11) % 30;
}
function Ka(e) {
  return 10 + (e * 53 + 7) % 60;
}
let ye = class extends v {
  constructor() {
    super(...arguments), this.bandStart = "07:00", this.bandEnd = "21:00", this.hourHeightPx = 60;
  }
  render() {
    const [e] = this.bandStart.split(":").map(Number), [t] = this.bandEnd.split(":").map(Number), s = Math.max(1, t - e) * this.hourHeightPx;
    return l`
      <div class="sk-host" style="height:${s}px">
        ${[0, 1].map((a) => {
      const i = Ka(a) / 100 * s, o = qa(a);
      return l`
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
ye.styles = [
  M,
  b`
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
tt([
  p({ type: String })
], ye.prototype, "bandStart", 2);
tt([
  p({ type: String })
], ye.prototype, "bandEnd", 2);
tt([
  p({ type: Number })
], ye.prototype, "hourHeightPx", 2);
ye = tt([
  w("lucarne-skeleton-day-column")
], ye);
var Xa = Object.defineProperty, Ga = Object.getOwnPropertyDescriptor, W = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? Ga(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && Xa(t, r, a), a;
};
function Qt(e, t) {
  return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
let j = class extends v {
  constructor() {
    super(...arguments), this.layout = null, this.bandStart = "07:00", this.bandEnd = "21:00", this.calendars = [], this.hourHeightPx = 60, this.showCreateButton = !1, this.dayWidthPx = 0, this.bufferDays = 0, this.cachedDayKeys = /* @__PURE__ */ new Set();
  }
  get _colorMap() {
    const e = /* @__PURE__ */ new Map();
    for (const t of this.calendars) e.set(t.entity, t.color);
    return e;
  }
  _eventColor(e) {
    var r;
    const t = this._colorMap;
    if ((r = e.uid) != null && r.includes("::")) {
      const s = e.uid.split("::")[0];
      return t.get(s) ?? "#a8d8b9";
    }
    return "#a8d8b9";
  }
  _onBandClick(e, t) {
    if (!this.showCreateButton) return;
    const s = e.currentTarget.getBoundingClientRect(), [a] = this.bandStart.split(":").map(Number), [n] = this.bandEnd.split(":").map(Number), i = n - a, o = Math.max(0, Math.min(1, (e.clientY - s.top) / s.height)), c = a + o * i, d = Math.min(n - 1, Math.round(c * 2) / 2);
    this.dispatchEvent(
      new CustomEvent("lucarne-create-event-tap", {
        detail: { day: t, startHour: d },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _buildEventColorMap(e) {
    const t = /* @__PURE__ */ new Map();
    for (const r of e)
      t.set(r.uid ?? "", this._eventColor(r));
    return t;
  }
  _renderDayColumn(e, t) {
    if (!this.layout) return l``;
    const r = N(e), s = this.layout.perDay.get(r);
    if (!s) return l``;
    const a = qt(this.bandStart, this.bandEnd), i = (a.length - 1) * this.hourHeightPx, o = Qt(e, t), [c] = this.bandStart.split(":").map(Number), [d] = this.bandEnd.split(":").map(Number), u = (d - c) * 36e5;
    let m = null;
    if (o) {
      const f = new Date(e);
      f.setHours(c, 0, 0, 0);
      const y = new Date(e);
      y.setHours(d, 0, 0, 0), t >= f && t <= y && (m = (t.getTime() - f.getTime()) / u * 100);
    }
    const g = this._buildEventColorMap([...s.inBand.map((f) => f.event), ...s.earlier, ...s.later]);
    return l`
      <div class="day-col-wrapper">
        ${s.earlier.length > 0 ? l`
              <div class="stub-area-top">
                <lucarne-out-of-band-stub
                  .events=${s.earlier}
                  label="earlier"
                  .eventColors=${g}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}

        <div
          class="day-col"
          style="height:${i}px${this.showCreateButton ? "; cursor: crosshair" : ""}"
          @click=${(f) => this._onBandClick(f, e)}
        >
          ${a.slice(0, -1).map(
      (f, y) => l`
              <div
                class="hour-line"
                style="top: ${(y + 1) / (a.length - 1) * 100}%"
              ></div>
            `
    )}

          ${m !== null ? l`<div class="now-line" style="top:${m}%"></div>` : ""}

          ${s.inBand.map((f) => {
      const y = 100 / f.laneCount, k = f.lane / f.laneCount * 100, _ = this._eventColor(f.event);
      return l`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${f.topPercent}%;
                  left: calc(${k}% + 1px);
                  width: calc(${y}% - 2px);
                  height: ${f.heightPercent}%;
                  z-index: ${f.lane + 1};
                  background: ${_}cc;
                  border-left-color: ${_};
                "
                .event=${f.event}
                .color=${_}
                .lane=${f.lane}
                .laneCount=${f.laneCount}
                .topPercent=${f.topPercent}
                .heightPercent=${f.heightPercent}
              ></lucarne-calendar-event-block>
            `;
    })}
        </div>

        ${s.later.length > 0 ? l`
              <div class="stub-area-bottom">
                <lucarne-out-of-band-stub
                  .events=${s.later}
                  label="tonight"
                  .eventColors=${g}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}
      </div>
    `;
  }
  render() {
    if (!this.layout) return l`<div>Loading…</div>`;
    const e = /* @__PURE__ */ new Date(), t = qt(this.bandStart, this.bandEnd), s = (t.length - 1) * this.hourHeightPx, a = new Intl.DateTimeFormat("en-US", { weekday: "short" }), n = {
      "--lucarne-day-render-count": String(this.layout.days.length)
    };
    return this.dayWidthPx > 0 && (n["--lucarne-day-width-px"] = `${this.dayWidthPx}px`, n["--lucarne-day-baseline-px"] = `${-this.bufferDays * this.dayWidthPx}px`), l`
      <div class="grid-wrapper" style=${La(n)}>
        <!-- Time-column gutter cells (col 1): stay fixed during pan -->
        <div class="header-spacer" style="grid-row:1; grid-column:1"></div>
        <div class="allday-spacer" style="grid-row:2; grid-column:1">all-day</div>
        <div class="time-col" style="height:${s}px; grid-row:3; grid-column:1">
          ${t.map(
      (i, o) => l`
              <div
                class="hour-label"
                style="top: ${o / (t.length - 1) * 100}%"
              >
                ${i === 0 || i === 24 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
              </div>
            `
    )}
        </div>

        <!-- Row 1: day header track -->
        <div class="day-cols-track" style="grid-row:1">
          ${this.layout.days.map(
      (i, o) => l`
              <div
                class="day-header ${Qt(i, e) ? "today" : ""}"
                style="grid-column: ${o + 1}"
              >
                <div class="day-pill">
                  <span class="day-weekday">${a.format(i)}</span>
                  <span class="day-num">${i.getDate()}</span>
                </div>
              </div>
            `
    )}
        </div>

        <!-- Row 2: all-day event track (wrapped in .day-cols-clip — see CSS) -->
        <div class="day-cols-clip" style="grid-row:2">
          <div class="day-cols-track">
            ${this.layout.days.map((i, o) => {
      const c = N(i), d = this.cachedDayKeys.has(c), u = this.layout.perDay.get(c);
      return l`
                <div class="allday-cell" style="grid-column: ${o + 1}">
                  ${d ? ((u == null ? void 0 : u.allDay) ?? []).map(
        (m) => {
          var f;
          const g = (f = u == null ? void 0 : u.allDayClipped) == null ? void 0 : f.get(_r(m));
          return l`
                          <div
                            class="allday-event"
                            style="background: ${this._eventColor(m)}cc"
                            @click=${(y) => {
            y.stopPropagation(), this.dispatchEvent(
              new CustomEvent("lucarne-event-tap", {
                detail: { event: m, color: this._eventColor(m) },
                bubbles: !0,
                composed: !0
              })
            );
          }}
                          >
                            ${g != null && g.left ? l`<span class="clip-chevron">‹</span>` : ""}${m.summary}${g != null && g.right ? l`<span class="clip-chevron">›</span>` : ""}
                          </div>
                        `;
        }
      ) : l`<div class="allday-skeleton"><div class="shimmer-sweep"></div></div>`}
                </div>
              `;
    })}
          </div>
        </div>

        <!-- Row 3: time-band columns track -->
        <div class="day-cols-track" style="grid-row:3">
          ${this.layout.days.map((i, o) => {
      const c = N(i), d = this.cachedDayKeys.has(c);
      return l`
              <div style="grid-column:${o + 1}; position:relative; overflow:visible; display:flex; flex-direction:column;">
                ${d ? this._renderDayColumn(i, e) : l`<lucarne-skeleton-day-column
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
j.styles = [
  M,
  b`
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
        padding: var(--lucarne-spacing-xs) 2px;
        font-size: var(--lucarne-fs-sm);
        font-weight: 700;
        color: var(--lucarne-on-surface-muted);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        user-select: none;
        position: sticky;
        top: 0;
        z-index: 3;
        background: var(--lucarne-surface);
        /* Container query target: lets the @container rule below hide the
           weekday when the column itself becomes too narrow. inline-size
           queries the header's inline width, which equals --lucarne-day-width-px. */
        container-type: inline-size;
      }
      .day-header .day-pill {
        display: inline-flex;
        align-items: baseline;
        justify-content: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        line-height: 1.1;
        max-width: 100%;
      }
      .day-header .day-weekday {
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
      }
      .day-header .day-num {
        font-size: var(--lucarne-fs-md);
        font-weight: 700;
      }
      .day-header.today .day-pill {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }
      /* Narrow column: drop the weekday name so the day number still fits
         comfortably inside the pill. 70px ≈ enough for "30" with padding;
         below that "Sun 30" wraps or overflows. */
      @container (max-width: 70px) {
        .day-header .day-weekday {
          display: none;
        }
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
W([
  p({ type: Object })
], j.prototype, "layout", 2);
W([
  p({ type: String })
], j.prototype, "bandStart", 2);
W([
  p({ type: String })
], j.prototype, "bandEnd", 2);
W([
  p({ type: Array })
], j.prototype, "calendars", 2);
W([
  p({ type: Number })
], j.prototype, "hourHeightPx", 2);
W([
  p({ type: Boolean })
], j.prototype, "showCreateButton", 2);
W([
  p({ type: Number })
], j.prototype, "dayWidthPx", 2);
W([
  p({ type: Number })
], j.prototype, "bufferDays", 2);
W([
  p({ attribute: !1 })
], j.prototype, "cachedDayKeys", 2);
j = W([
  w("lucarne-calendar-grid")
], j);
const Ja = 500;
function Qa(e, t, r) {
  return t <= 0 ? 0 : Math.abs(r) >= Ja ? r > 0 ? Math.ceil(e / t) : Math.floor(e / t) : Math.round(e / t);
}
function Zt(e, t) {
  if (Math.abs(e) <= t) return e;
  const r = Math.abs(e) - t;
  return Math.sign(e) * (t + r * 0.33);
}
var Za = Object.defineProperty, es = Object.getOwnPropertyDescriptor, be = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? es(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && Za(t, r, a), a;
};
let J = class extends v {
  constructor() {
    super(...arguments), this.dayWidthPx = 0, this.bufferDays = 0, this.canPanBack = !0, this.canPanForward = !0, this._startX = 0, this._startY = 0, this._startTime = 0, this._isDragging = !1, this._cachedTargets = [];
  }
  /** All .day-cols-track elements inside the slotted calendar-grid's shadow root. */
  get _panTargets() {
    var t, r;
    const e = (t = this._slot) == null ? void 0 : t.assignedElements()[0];
    return e ? Array.from(
      ((r = e.shadowRoot) == null ? void 0 : r.querySelectorAll(".day-cols-track")) ?? []
    ) : [];
  }
  /** Cache targets on gesture start so pointermove does not re-query every frame. */
  _cachePanTargets() {
    this._cachedTargets = this._panTargets;
  }
  _applyRubberBand(e) {
    return e > 0 && !this.canPanBack || e < 0 && !this.canPanForward ? Zt(e, 0) : e;
  }
  /** Baseline transform in px (negative). Matches the CSS `--lucarne-day-baseline-px`. */
  _baselinePx() {
    return -this.bufferDays * this.dayWidthPx;
  }
  _setTranslate(e) {
    const t = this._baselinePx() + e;
    for (const r of this._cachedTargets)
      r.style.transition = "", r.style.transform = `translateX(${t}px)`;
  }
  /**
   * Clear inline transform on all current `.day-cols-track` elements so the
   * grid's CSS baseline (`transform: translateX(var(--lucarne-day-baseline-px))`)
   * takes over. Re-queries via `_panTargets` because Lit may have replaced
   * track nodes during a re-render.
   */
  _clearInlineTransform() {
    for (const e of this._panTargets)
      e.style.transition = "", e.style.transform = "";
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
  _snapAndCommit(e) {
    const t = this._cachedTargets;
    if (t.length === 0) {
      e !== 0 && (this._dispatchPanSnap(e), this._scheduleClearInline());
      return;
    }
    this._cancelPendingSnap();
    const r = this._baselinePx();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const d of t)
        d.style.transition = "", d.style.transform = `translateX(${r}px)`;
      e !== 0 && this._dispatchPanSnap(e), this._scheduleClearInline();
      return;
    }
    const a = getComputedStyle(this).getPropertyValue("--lucarne-pan-duration").trim() || "240ms", n = getComputedStyle(this).getPropertyValue("--lucarne-pan-easing").trim() || "cubic-bezier(0.32, 0.72, 0, 1)", i = `transform ${a} ${n}`, o = r + e * this.dayWidthPx;
    for (const d of t)
      d.style.transition = i, d.style.transform = `translateX(${o}px)`;
    const c = (d) => {
      const u = d;
      u.target === t[0] && (u.propertyName && u.propertyName !== "transform" || (this._pendingTransitionEnd = void 0, t[0].removeEventListener("transitionend", c), e !== 0 && this._dispatchPanSnap(e), this._scheduleClearInline()));
    };
    this._pendingSnapTarget = t[0], this._pendingTransitionEnd = c, t[0].addEventListener("transitionend", c);
  }
  _dispatchPanSnap(e) {
    this.dispatchEvent(
      new CustomEvent("pan-snap", {
        detail: { deltaDays: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onPointerDown(e) {
    e.pointerType === "mouse" && e.button !== 0 || this._pointerId === void 0 && (this._cancelPendingSnap(), this._pointerId = e.pointerId, this._startX = e.clientX, this._startY = e.clientY, this._startTime = performance.now(), this._isDragging = !1, this._cachePanTargets());
  }
  _onPointerMove(e) {
    if (e.pointerId !== this._pointerId) return;
    const t = e.clientX - this._startX, r = e.clientY - this._startY;
    if (!this._isDragging) {
      if (Math.abs(t) < 10 && Math.abs(r) < 10) return;
      if (Math.abs(r) > Math.abs(t)) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
        }
        this._pointerId = void 0;
        return;
      }
      this._isDragging = !0;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
      }
    }
    const s = this._applyRubberBand(t);
    this._setTranslate(s);
  }
  _onPointerUp(e) {
    if (e.pointerId === this._pointerId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
      }
      if (this._isDragging) {
        const t = e.clientX - this._startX, r = performance.now() - this._startTime, s = r > 0 ? t / r * 1e3 : 0, a = this._applyRubberBand(t);
        let n = Qa(a, this.dayWidthPx, s);
        (n > 0 && !this.canPanBack || n < 0 && !this.canPanForward) && (n = 0), this._snapAndCommit(n);
      }
      this._pointerId = void 0, this._isDragging = !1, this._cachedTargets = [];
    }
  }
  render() {
    return l`
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
J.styles = b`
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
be([
  p({ type: Number })
], J.prototype, "dayWidthPx", 2);
be([
  p({ type: Number })
], J.prototype, "bufferDays", 2);
be([
  p({ type: Boolean })
], J.prototype, "canPanBack", 2);
be([
  p({ type: Boolean })
], J.prototype, "canPanForward", 2);
be([
  dr("slot")
], J.prototype, "_slot", 2);
J = be([
  w("lucarne-calendar-day-pan")
], J);
var ts = Object.defineProperty, rs = Object.getOwnPropertyDescriptor, K = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? rs(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && ts(t, r, a), a;
};
function as(e) {
  return new Date(e).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: !0
  });
}
let U = class extends v {
  constructor() {
    super(...arguments), this.event = null, this.color = "#a8d8b9", this.calendarLabel = "", this.entityId = "", this._confirmingDelete = !1, this._deleting = !1, this._deleteError = "";
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  _isRecurring(e) {
    return !!e.rrule || !!e.recurrence_id;
  }
  /**
   * Returns true when the uid is a synthetic placeholder (no real upstream
   * uid available). The HA `calendar/event/delete` WebSocket command needs
   * a real upstream uid, so the trash button is hidden for synthetic ids.
   */
  _hasSyntheticUid(e) {
    if (!e) return !0;
    const t = e.includes("::") ? e.split("::").slice(1).join("::") : e;
    return t.startsWith("syn:") || t.startsWith("pending:") || t.length === 0;
  }
  _startDelete() {
    this._confirmingDelete = !0, this._deleteError = "";
  }
  _cancelDelete() {
    this._confirmingDelete = !1;
  }
  async _confirmDelete() {
    var t;
    if (!((t = this.event) != null && t.uid) || !this.entityId) return;
    this._deleting = !0, this._deleteError = "";
    const e = this.event.uid.includes("::") ? this.event.uid.split("::").slice(1).join("::") : this.event.uid;
    try {
      await qr(this.hass, this.entityId, e);
    } catch (r) {
      this._deleteError = r instanceof Error ? r.message : "Failed to delete event", this._deleting = !1, this._confirmingDelete = !1;
      return;
    }
    this.dispatchEvent(new CustomEvent("lucarne-event-deleted", {
      detail: { entityId: this.entityId, uid: this.event.uid },
      bubbles: !0,
      composed: !0
    })), this._deleting = !1, this._confirmingDelete = !1;
  }
  render() {
    if (!this.event) return l``;
    const e = this.event, r = e.start.length === 10 && !e.start.includes("T") ? "All day" : `${as(e.start)} – ${new Date(e.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 })}`, s = this._hasSyntheticUid(e.uid), a = !!this.entityId && !!e.uid && this.hass != null && Xr(this.hass, this.entityId) && !this._isRecurring(e) && !s, n = this._confirmingDelete ? this._confirmDelete : this._startDelete, i = this._confirmingDelete ? "Confirm delete" : "Delete event";
    return l`
      <div class="backdrop" @click=${this._close}></div>
      <div class="popover" role="dialog" aria-modal="true">
        <div class="popover-header">
          <span class="color-dot" style="background:${this.color}"></span>
          <span class="event-title">${e.summary}</span>
          ${a ? l`
                <button
                  class="icon-btn ${this._confirmingDelete ? "armed" : ""}"
                  @click=${n}
                  ?disabled=${this._deleting}
                  aria-label=${i}
                  title=${i}
                >🗑️</button>
              ` : l`<span></span>`}
          <button class="icon-btn" @click=${this._close} aria-label="Close">✕</button>
        </div>

        ${this._confirmingDelete ? l`
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
          <span class="detail-text">${r}</span>
        </div>

        ${this.calendarLabel ? l`
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

        ${e.location ? l`
              <div class="detail-row">
                <em class="detail-icon">📍</em>
                <span class="detail-text">${e.location}</span>
              </div>
            ` : ""}

        ${e.description ? l`
              <div class="detail-row">
                <em class="detail-icon">📝</em>
                <span class="detail-text">${e.description}</span>
              </div>
            ` : ""}

        ${this._deleteError ? l`<div class="error-msg">${this._deleteError}</div>` : ""}
      </div>
    `;
  }
};
U.styles = [
  M,
  b`
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
K([
  p({ attribute: !1 })
], U.prototype, "hass", 2);
K([
  p({ type: Object })
], U.prototype, "event", 2);
K([
  p({ type: String })
], U.prototype, "color", 2);
K([
  p({ type: String })
], U.prototype, "calendarLabel", 2);
K([
  p({ type: String })
], U.prototype, "entityId", 2);
K([
  h()
], U.prototype, "_confirmingDelete", 2);
K([
  h()
], U.prototype, "_deleting", 2);
K([
  h()
], U.prototype, "_deleteError", 2);
U = K([
  w("lucarne-calendar-event-popover")
], U);
var ss = Object.defineProperty, ns = Object.getOwnPropertyDescriptor, R = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? ns(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && ss(t, r, a), a;
};
function er(e, t) {
  const s = -(/* @__PURE__ */ new Date(`${e}T${t}:00`)).getTimezoneOffset(), a = s >= 0 ? "+" : "-", n = Math.floor(Math.abs(s) / 60).toString().padStart(2, "0"), i = (Math.abs(s) % 60).toString().padStart(2, "0");
  return `${e}T${t}:00${a}${n}:${i}`;
}
function tr(e) {
  return `${Math.floor(e).toString().padStart(2, "0")}:${e % 1 === 0.5 ? "30" : "00"}`;
}
function rr(e) {
  const t = e.getFullYear(), r = String(e.getMonth() + 1).padStart(2, "0"), s = String(e.getDate()).padStart(2, "0");
  return `${t}-${r}-${s}`;
}
let O = class extends v {
  constructor() {
    super(...arguments), this.day = null, this.startHour = 9, this.calendars = [], this._title = "", this._calendarEntityId = "", this._date = "", this._startTime = "", this._endTime = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
  }
  updated(e) {
    super.updated(e), (e.has("day") || e.has("startHour")) && this._initDefaults();
  }
  _initDefaults() {
    var r;
    const e = this.day ?? /* @__PURE__ */ new Date();
    this._date = rr(e), this._startTime = tr(Math.max(0, Math.min(23, this.startHour)));
    const t = Math.min(24, this.startHour + 1);
    this._endTime = tr(t < 24 ? t : 23.5), this._calendarEntityId = ((r = this.calendars[0]) == null ? void 0 : r.entity) ?? "", this._title = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
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
    const e = { summary: this._title.trim() };
    this._description.trim() && (e.description = this._description.trim()), this._location.trim() && (e.location = this._location.trim());
    let t, r;
    if (this._allDay) {
      e.start_date = this._date;
      const s = /* @__PURE__ */ new Date(`${this._date}T00:00:00`);
      s.setDate(s.getDate() + 1);
      const a = rr(s);
      e.end_date = a, t = this._date, r = a;
    } else {
      const s = er(this._date, this._startTime), a = er(this._date, this._endTime);
      e.start_date_time = s, e.end_date_time = a, t = s, r = a;
    }
    try {
      await this.hass.callService("calendar", "create_event", e, {
        entity_id: this._calendarEntityId
      });
    } catch (s) {
      this._error = s instanceof Error ? s.message : "Failed to create event", this._saving = !1;
      return;
    }
    this.dispatchEvent(
      new CustomEvent("lucarne-event-created", {
        detail: {
          entityId: this._calendarEntityId,
          event: {
            summary: this._title.trim(),
            start: t,
            end: r,
            description: this._description.trim() || void 0,
            location: this._location.trim() || void 0,
            // Synthetic pending uid: unique per optimistic create so
            // multiple pendings don't collide on the `entity::` key.
            // Replaced by the real event on the next fetch.
            uid: `${this._calendarEntityId}::pending:${t}|${r}|${this._title.trim()}`,
            pending: !0
          }
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    return this.calendars.length ? l`
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
            @input=${(e) => this._title = e.target.value}
            @keydown=${(e) => e.key === "Enter" && this._create()}
          />
        </div>

        <div class="field">
          <label for="ce-calendar">Calendar</label>
          <select
            id="ce-calendar"
            .value=${this._calendarEntityId}
            @change=${(e) => this._calendarEntityId = e.target.value}
          >
            ${this.calendars.map(
      (e) => l`<option value=${e.entity}>${e.label}</option>`
    )}
          </select>
        </div>

        <div class="field">
          <label for="ce-date">Date</label>
          <input
            id="ce-date"
            type="date"
            .value=${this._date}
            @change=${(e) => this._date = e.target.value}
          />
        </div>

        <div class="allday-row">
          <input
            id="ce-allday"
            type="checkbox"
            .checked=${this._allDay}
            @change=${(e) => this._allDay = e.target.checked}
          />
          <label for="ce-allday" style="margin:0; font-weight:400; color:var(--lucarne-on-surface)">All day</label>
        </div>

        ${this._allDay ? "" : l`
              <div class="time-row">
                <div class="field">
                  <label for="ce-start">Start</label>
                  <input
                    id="ce-start"
                    type="time"
                    .value=${this._startTime}
                    @change=${(e) => this._startTime = e.target.value}
                  />
                </div>
                <div class="field">
                  <label for="ce-end">End</label>
                  <input
                    id="ce-end"
                    type="time"
                    .value=${this._endTime}
                    @change=${(e) => this._endTime = e.target.value}
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
            @input=${(e) => this._location = e.target.value}
          />
        </div>

        <div class="field">
          <label for="ce-description">Description</label>
          <textarea
            id="ce-description"
            placeholder="Optional"
            .value=${this._description}
            @input=${(e) => this._description = e.target.value}
          ></textarea>
        </div>

        ${this._error ? l`<div class="error-msg">${this._error}</div>` : ""}

        <div class="actions">
          <button class="btn btn-cancel" @click=${this._close}>Cancel</button>
          <button class="btn btn-create" ?disabled=${this._saving} @click=${this._create}>
            ${this._saving ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    ` : l``;
  }
};
O.styles = [
  M,
  b`
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
R([
  p({ attribute: !1 })
], O.prototype, "hass", 2);
R([
  p({ type: Object })
], O.prototype, "day", 2);
R([
  p({ type: Number })
], O.prototype, "startHour", 2);
R([
  p({ type: Array })
], O.prototype, "calendars", 2);
R([
  h()
], O.prototype, "_title", 2);
R([
  h()
], O.prototype, "_calendarEntityId", 2);
R([
  h()
], O.prototype, "_date", 2);
R([
  h()
], O.prototype, "_startTime", 2);
R([
  h()
], O.prototype, "_endTime", 2);
R([
  h()
], O.prototype, "_allDay", 2);
R([
  h()
], O.prototype, "_description", 2);
R([
  h()
], O.prototype, "_location", 2);
R([
  h()
], O.prototype, "_error", 2);
R([
  h()
], O.prototype, "_saving", 2);
O = R([
  w("lucarne-create-event-popover")
], O);
var is = Object.defineProperty, os = Object.getOwnPropertyDescriptor, z = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? os(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && is(t, r, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-calendar-card",
  name: "Lucarne Calendar",
  description: "Week view calendar with per-person color, visibility pills, and create-event flow",
  preview: !0
});
let I = class extends v {
  constructor() {
    super(...arguments), this._layout = null, this._visibleIds = /* @__PURE__ */ new Set(), this._openEvent = null, this._openEventColor = "", this._openEventCalLabel = "", this._openEventEntityId = "", this._createDay = null, this._createStartHour = 9, this._creatableCalendars = [], this._dayWidthPx = 0, this._deletedUids = /* @__PURE__ */ new Set(), this._pendingEvents = [], this._lastVisibleCount = 3;
  }
  setConfig(e) {
    if (!e.calendars || !Array.isArray(e.calendars) || e.calendars.length === 0)
      throw new Error('lucarne-calendar-card: "calendars" must be a non-empty array');
    for (const s of e.calendars)
      if (!s.entity || !s.color)
        throw new Error('lucarne-calendar-card: each calendar requires "entity" and "color"');
    let t = e;
    if (e.visible_hours) {
      const s = /^\d{1,2}:\d{2}$/;
      if (!s.test(e.visible_hours.start) || !s.test(e.visible_hours.end))
        throw new Error('lucarne-calendar-card: "visible_hours" start and end must be in HH:MM format');
      const a = parseInt(e.visible_hours.start.split(":")[0], 10), n = parseInt(e.visible_hours.end.split(":")[0], 10);
      if (a < 0 || n > 24 || a >= n)
        throw new Error('lucarne-calendar-card: "visible_hours" must satisfy 0 <= start < end <= 24');
      t = {
        ...e,
        visible_hours: {
          start: `${String(a).padStart(2, "0")}:00`,
          end: `${String(n).padStart(2, "0")}:00`
        }
      };
    }
    const r = this._config;
    if (this._config = t, this._visibleIds = new Set(e.calendars.map((s) => s.entity)), this.hass && this._updateCreatableCalendars(), this._rolling)
      this._rolling.updateCalendars(t.calendars), (r == null ? void 0 : r.render_buffer_days) !== t.render_buffer_days && this._rolling.setBufferDays(t.render_buffer_days), ((r == null ? void 0 : r.min_days) !== e.min_days || (r == null ? void 0 : r.max_days) !== e.max_days || (r == null ? void 0 : r.min_col_width) !== e.min_col_width || (r == null ? void 0 : r.max_col_width) !== e.max_col_width) && this._onResize();
    else {
      const s = this._effectiveConfig();
      this._lastVisibleCount = s.minDays, this._rolling = new Oa(this, {
        calendars: t.calendars,
        visibleCount: s.minDays,
        bufferDays: t.render_buffer_days,
        onFetchComplete: (a, n) => this._onFetchComplete(a, n),
        onChange: () => this._recompute()
      });
    }
  }
  static getStubConfig(e) {
    const t = Object.keys(e.states).filter((a) => a.startsWith("calendar.")).slice(0, 3), r = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], s = t.map((a, n) => ({
      entity: a,
      color: r[n] ?? "#a8d8b9"
    }));
    return {
      type: "custom:lucarne-calendar-card",
      title: "Calendar",
      calendars: s.length ? s : [{ entity: "calendar.example", color: "#a8d8b9" }],
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
      this._previewOverrideRaf = void 0, this.isConnected && (this._previewOverride = pr(this));
    });
  }
  disconnectedCallback() {
    var e, t;
    super.disconnectedCallback(), this._previewOverrideRaf !== void 0 && (cancelAnimationFrame(this._previewOverrideRaf), this._previewOverrideRaf = void 0), (e = this._resizeObserver) == null || e.disconnect(), (t = this._previewOverride) == null || t.uninstall(), this._previewOverride = void 0;
  }
  firstUpdated() {
    !this._resizeObserver && this._gridAreaEl && (this._resizeObserver = new ResizeObserver(() => this._onResize()), this._resizeObserver.observe(this._gridAreaEl), this._onResize());
  }
  updated(e) {
    super.updated(e), !(!e.has("hass") || !this._config) && (this._rolling.setHass(this.hass), this._updateCreatableCalendars());
  }
  _effectiveConfig() {
    const e = this._config;
    return {
      minDays: e.min_days && e.min_days > 0 ? e.min_days : 3,
      maxDays: e.max_days && e.max_days > 0 ? e.max_days : 7,
      minColWidth: e.min_col_width && e.min_col_width > 0 ? e.min_col_width : 140,
      maxColWidth: e.max_col_width && e.max_col_width > 0 ? e.max_col_width : 220,
      timeColWidth: 40
    };
  }
  _onResize() {
    this._resizeFrame === void 0 && (this._resizeFrame = requestAnimationFrame(() => {
      var s;
      this._resizeFrame = void 0;
      const e = ((s = this._gridAreaEl) == null ? void 0 : s.getBoundingClientRect().width) ?? 0, { visibleCount: t, dayWidthPx: r } = Pa(e, this._effectiveConfig());
      t !== this._lastVisibleCount && (this._lastVisibleCount = t, this._rolling.setVisibleCount(t), this.style.setProperty("--lucarne-day-count", String(t))), this._dayWidthPx = r;
    }));
  }
  _recompute() {
    var n, i;
    if (!this._config) return;
    const e = [];
    for (const [o, c] of this._rolling.cachedEvents.entries())
      this._visibleIds.has(o) && e.push(...c);
    e.push(
      ...this._pendingEvents.filter((o) => {
        var d;
        const c = (d = o.uid) == null ? void 0 : d.split("::")[0];
        return c ? this._visibleIds.has(c) : !0;
      })
    );
    const t = this._deletedUids.size > 0 ? e.filter((o) => !o.uid || !this._deletedUids.has(o.uid)) : e, r = ((n = this._config.visible_hours) == null ? void 0 : n.start) ?? "07:00", s = ((i = this._config.visible_hours) == null ? void 0 : i.end) ?? "21:00", a = this._rolling.renderDays;
    this._layout = Ta(t, a, r, s);
  }
  _supportsCreate(e) {
    var r, s, a;
    const t = (a = (s = (r = this.hass) == null ? void 0 : r.states[e]) == null ? void 0 : s.attributes) == null ? void 0 : a.supported_features;
    return t !== void 0 && (t & 1) !== 0;
  }
  _updateCreatableCalendars() {
    if (!this._config || !this.hass) return;
    const e = this._config.calendars.filter((r) => this._supportsCreate(r.entity));
    e.length === this._creatableCalendars.length && e.every((r, s) => {
      var a;
      return r.entity === ((a = this._creatableCalendars[s]) == null ? void 0 : a.entity);
    }) || (this._creatableCalendars = e);
  }
  _onVisibilityChange(e) {
    this._visibleIds = e.detail, this._recompute();
  }
  _onEventTap(e) {
    var s, a;
    const { event: t, color: r } = e.detail;
    if (this._openEvent = t, this._openEventColor = r, (s = t.uid) != null && s.includes("::")) {
      const n = t.uid.split("::")[0];
      this._openEventEntityId = n;
      const i = (a = this._config) == null ? void 0 : a.calendars.find((o) => o.entity === n);
      this._openEventCalLabel = i ? yr(i, this.hass) : "";
    } else
      this._openEventEntityId = "", this._openEventCalLabel = "";
  }
  _onEventDeleted(e) {
    this._deletedUids = /* @__PURE__ */ new Set([...this._deletedUids, e.detail.uid]), this._openEvent = null, this._openEventEntityId = "", this._recompute();
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
  _onFetchComplete(e, t) {
    if (this._pendingEvents = [], this._deletedUids.size > 0) {
      const r = /* @__PURE__ */ new Set();
      for (const a of e.values())
        for (const n of a)
          n.uid && r.add(n.uid);
      const s = /* @__PURE__ */ new Set();
      for (const a of this._deletedUids) {
        const n = a.includes("::") ? a.split("::")[0] : "";
        (t.has(n) || r.has(a)) && s.add(a);
      }
      this._deletedUids = s;
    }
    this._recompute();
  }
  _closePopover() {
    this._openEvent = null;
  }
  _onCreateEventTap(e) {
    const { day: t, startHour: r } = e.detail;
    this._createDay = t, this._createStartHour = r;
  }
  _closeCreatePopover() {
    this._createDay = null;
  }
  _onEventCreated(e) {
    const { event: t } = e.detail;
    this._pendingEvents = [...this._pendingEvents, t], this._recompute(), this._closeCreatePopover();
  }
  _rangeLabel() {
    const e = this._rolling.days;
    if (e.length === 0) return "";
    const t = e[0], r = e[e.length - 1], s = (i, o) => i.toLocaleDateString("en-US", o), a = t.getMonth() === r.getMonth() && t.getFullYear() === r.getFullYear(), n = t.getFullYear() === r.getFullYear();
    return a ? `${s(t, { month: "short", day: "numeric" })} – ${s(r, { day: "numeric" })}` : n ? `${s(t, { month: "short", day: "numeric" })} – ${s(r, { month: "short", day: "numeric" })}` : `${s(t, { month: "short", day: "numeric", year: "numeric" })} – ${s(r, { month: "short", day: "numeric", year: "numeric" })}`;
  }
  render() {
    var a, n;
    if (!this._config) return l``;
    const e = ((a = this._config.visible_hours) == null ? void 0 : a.start) ?? "07:00", t = ((n = this._config.visible_hours) == null ? void 0 : n.end) ?? "21:00", r = Vt(this._config.calendars, this.hass), s = Vt(this._creatableCalendars, this.hass);
    return l`
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
            ${this._rolling.isAtToday ? "" : l`<button class="nav-btn" @click=${() => this._rolling.goToToday()} aria-label="Today">Today</button>`}
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
          <lucarne-calendar-day-pan
            .dayWidthPx=${this._dayWidthPx}
            .bufferDays=${this._rolling.bufferDays}
            .canPanBack=${this._rolling.canPanBack}
            .canPanForward=${this._rolling.canPanForward}
            @pan-snap=${(i) => this._rolling.pan(-i.detail.deltaDays)}
          >
            <lucarne-calendar-grid
              .layout=${this._layout}
              .bandStart=${e}
              .bandEnd=${t}
              .calendars=${r}
              .dayWidthPx=${this._dayWidthPx}
              .bufferDays=${this._rolling.bufferDays}
              .cachedDayKeys=${new Set(this._rolling.cachedRange.map(N))}
              .showCreateButton=${(this._config.show_create_button ?? !0) && this._creatableCalendars.length > 0}
            ></lucarne-calendar-grid>
          </lucarne-calendar-day-pan>
        </div>

        ${this._openEvent ? l`
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

        ${this._createDay !== null ? l`
              <lucarne-create-event-popover
                .hass=${this.hass}
                .day=${this._createDay}
                .startHour=${this._createStartHour}
                .calendars=${s}
                @popover-close=${this._closeCreatePopover}
                @lucarne-event-created=${this._onEventCreated}
              ></lucarne-create-event-popover>
            ` : ""}
      </ha-card>
    `;
  }
};
I.styles = [
  M,
  b`
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
z([
  p({ attribute: !1 })
], I.prototype, "hass", 2);
z([
  dr(".grid-area")
], I.prototype, "_gridAreaEl", 2);
z([
  h()
], I.prototype, "_config", 2);
z([
  h()
], I.prototype, "_layout", 2);
z([
  h()
], I.prototype, "_visibleIds", 2);
z([
  h()
], I.prototype, "_openEvent", 2);
z([
  h()
], I.prototype, "_openEventColor", 2);
z([
  h()
], I.prototype, "_openEventCalLabel", 2);
z([
  h()
], I.prototype, "_openEventEntityId", 2);
z([
  h()
], I.prototype, "_createDay", 2);
z([
  h()
], I.prototype, "_createStartHour", 2);
z([
  h()
], I.prototype, "_creatableCalendars", 2);
z([
  h()
], I.prototype, "_dayWidthPx", 2);
z([
  h()
], I.prototype, "_deletedUids", 2);
I = z([
  w("lucarne-calendar-card")
], I);
var ls = Object.defineProperty, cs = Object.getOwnPropertyDescriptor, Le = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? cs(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && ls(t, r, a), a;
};
let le = class extends v {
  constructor() {
    super(...arguments), this._haReady = !1, this._invalid = {};
  }
  connectedCallback() {
    super.connectedCallback(), vr().catch((e) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", e)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(e) {
    this._config = e;
  }
  _fire(e) {
    ft(this, "config-changed", { config: e });
  }
  _titleChanged(e) {
    const t = e.target;
    this._fire({ ...this._config, title: t.value || void 0 });
  }
  _bandStartChanged(e) {
    const t = e.target;
    this._fire({
      ...this._config,
      visible_hours: { ...this._config.visible_hours ?? { start: "07:00", end: "21:00" }, start: t.value }
    });
  }
  _bandEndChanged(e) {
    const t = e.target;
    this._fire({
      ...this._config,
      visible_hours: { ...this._config.visible_hours ?? { start: "07:00", end: "21:00" }, end: t.value }
    });
  }
  _showCreateChanged(e) {
    const t = e.target.checked;
    this._fire({ ...this._config, show_create_button: t });
  }
  _calEntityChanged(e, t) {
    var s, a;
    const r = [...((s = this._config) == null ? void 0 : s.calendars) ?? []];
    r[e] = { ...r[e], entity: ((a = t.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, calendars: r });
  }
  _calColorChanged(e, t) {
    var s;
    const r = [...((s = this._config) == null ? void 0 : s.calendars) ?? []];
    r[e] = { ...r[e], color: t.target.value }, this._fire({ ...this._config, calendars: r });
  }
  _removeCalendar(e) {
    var r;
    const t = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    t.length <= 1 || (t.splice(e, 1), this._fire({ ...this._config, calendars: t }));
  }
  _windowFieldChanged(e, t) {
    const r = t.target, s = r.value === "" ? void 0 : r.valueAsNumber, a = s !== void 0 && Number.isFinite(s) ? s : void 0, n = { ...this._config, [e]: a }, i = n.min_days ?? 3, o = n.max_days ?? 7, c = n.min_col_width ?? 140, d = n.max_col_width ?? 220;
    this._invalid = {
      days: i > o,
      cols: c > d
    }, this._fire(n);
  }
  _addCalendar() {
    var s, a;
    const t = Object.keys(((s = this.hass) == null ? void 0 : s.states) ?? {}).find((n) => n.startsWith("calendar.")) ?? "calendar.example", r = [
      ...((a = this._config) == null ? void 0 : a.calendars) ?? [],
      { entity: t, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  render() {
    var c, d;
    if (!this._config) return l``;
    if (!this._haReady) return l`<div class="loading">Loading editor…</div>`;
    const e = this._config.calendars ?? [], t = ((c = this._config.visible_hours) == null ? void 0 : c.start) ?? "07:00", r = ((d = this._config.visible_hours) == null ? void 0 : d.end) ?? "21:00", s = this._config.show_create_button ?? !0, a = this._config.min_days, n = this._config.max_days, i = this._config.min_col_width, o = this._config.max_col_width;
    return l`
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
            .value=${t}
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
          .checked=${s}
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
            @change=${(u) => this._windowFieldChanged("min_days", u)}
          />
          ${this._invalid.days ? l`<div class="editor-error">Min days must be ≤ max days</div>` : ""}
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
          ${this._invalid.days ? l`<div class="editor-error">Max days must be ≥ min days</div>` : ""}
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
          ${this._invalid.cols ? l`<div class="editor-error">Min width must be ≤ max width</div>` : ""}
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
          ${this._invalid.cols ? l`<div class="editor-error">Max width must be ≥ min width</div>` : ""}
        </label>
      </div>

      <div class="section-label">Calendars</div>
      ${e.map(
      (u, m) => l`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${u.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(g) => this._calEntityChanged(m, g)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${u.color}
              @input=${(g) => this._calColorChanged(m, g)}
              title="Calendar color"
            />
            <button type="button" class="remove" @click=${() => this._removeCalendar(m)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addCalendar}>+ Add calendar</button>
    `;
  }
};
le.styles = [M, gr];
Le([
  p({ attribute: !1 })
], le.prototype, "hass", 2);
Le([
  h()
], le.prototype, "_config", 2);
Le([
  h()
], le.prototype, "_haReady", 2);
Le([
  h()
], le.prototype, "_invalid", 2);
le = Le([
  w("lucarne-calendar-card-editor")
], le);
var ds = Object.defineProperty, us = Object.getOwnPropertyDescriptor, rt = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? us(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && ds(t, r, a), a;
};
const hs = /^(?=.*[\p{Extended_Pictographic}\p{Regional_Indicator}])[\p{Extended_Pictographic}\p{Emoji_Component}\p{Emoji_Modifier}\p{Regional_Indicator}‍️]+$/u;
let _e = class extends v {
  constructor() {
    super(...arguments), this.name = "", this.color = "#a8d8b9", this.avatar = null;
  }
  render() {
    const e = this.avatar;
    if (e && e.startsWith("/local/"))
      return l`
        <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
          <img src="${e}" alt="${this.name}" />
        </div>
      `;
    if (e && hs.test(e))
      return l`
        <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
          <span class="emoji">${e}</span>
        </div>
      `;
    const t = this.name.trim().charAt(0) || "?";
    return l`
      <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
        <span class="initial">${t}</span>
      </div>
    `;
  }
};
_e.styles = b`
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
    .initial {
      font-size: clamp(1.25rem, 2.5vw, 2rem);
      font-weight: 700;
      color: rgba(0, 0, 0, 0.7);
      line-height: 1;
      text-transform: uppercase;
      font-family: var(--primary-font-family, sans-serif);
    }
    .emoji {
      font-size: clamp(1.5rem, 3vw, 2.25rem);
      line-height: 1;
    }
  `;
rt([
  p()
], _e.prototype, "name", 2);
rt([
  p()
], _e.prototype, "color", 2);
rt([
  p()
], _e.prototype, "avatar", 2);
_e = rt([
  w("lucarne-member-avatar")
], _e);
var ps = Object.defineProperty, ms = Object.getOwnPropertyDescriptor, vt = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? ms(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && ps(t, r, a), a;
};
const fs = 500;
let Re = class extends v {
  constructor() {
    super(...arguments), this.memberColor = "#a8d8b9", this._pressTimer = null, this._longPressed = !1;
  }
  _onPointerDown(e) {
    this._longPressed = !1, this._pressTimer = setTimeout(() => {
      this._longPressed = !0, this.dispatchEvent(
        new CustomEvent("task-long-press", {
          detail: { task: this.task },
          bubbles: !0,
          composed: !0
        })
      );
    }, fs), e.currentTarget.setPointerCapture(e.pointerId);
  }
  _onPointerUp() {
    this._pressTimer !== null && (clearTimeout(this._pressTimer), this._pressTimer = null);
  }
  _onPointerCancel() {
    this._pressTimer !== null && (clearTimeout(this._pressTimer), this._pressTimer = null);
  }
  _onClick() {
    this._longPressed || this.dispatchEvent(
      new CustomEvent("task-toggle", {
        detail: { task: this.task },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    if (!this.task) return l``;
    const e = this.task.status === "completed", t = this.task.metadata.icon, r = this.task.due;
    return l`
      <div
        class="row"
        style="--member-color:${this.memberColor}"
        role="checkbox"
        aria-checked=${e}
        tabindex="0"
        @click=${this._onClick}
        @keydown=${(s) => {
      (s.key === "Enter" || s.key === " ") && !s.repeat && (s.preventDefault(), this._onClick());
    }}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
      >
        <div class="check ${e ? "done" : ""}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 5" stroke="rgba(0,0,0,0.7)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        ${t ? l`<span class="icon">${t}</span>` : ""}
        <div class="middle">
          <span class="label ${e ? "done" : ""}">${this.task.summary}</span>
        </div>
        ${r ? l`<span class="due">${this._formatDue(r)}</span>` : ""}
      </div>
    `;
  }
  _formatDue(e) {
    if (e.includes("T")) {
      const t = new Date(e);
      if (!isNaN(t.getTime()))
        return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return e;
  }
};
Re.styles = b`
    :host {
      display: block;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 44px;
      padding: 8px 4px;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.1s;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
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
      background: var(--member-color, #a8d8b9);
      border-color: var(--member-color, #a8d8b9);
    }
    .check svg {
      opacity: 0;
      transition: opacity 0.15s;
    }
    .check.done svg {
      opacity: 1;
    }
    .icon {
      font-size: 1.1rem;
      line-height: 1;
      flex-shrink: 0;
    }
    .middle {
      flex: 1;
      min-width: 0;
    }
    .label {
      font-size: clamp(0.875rem, 1.2vw, 1rem);
      color: var(--primary-text-color, #212121);
      font-family: var(--primary-font-family, sans-serif);
      transition: text-decoration 0.15s, color 0.15s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .label.done {
      text-decoration: line-through;
      color: var(--secondary-text-color, #727272);
      opacity: 0.6;
    }
    .due {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #727272);
      flex-shrink: 0;
    }
  `;
vt([
  p({ attribute: !1 })
], Re.prototype, "task", 2);
vt([
  p()
], Re.prototype, "memberColor", 2);
Re = vt([
  w("lucarne-task-row")
], Re);
var gs = Object.defineProperty, vs = Object.getOwnPropertyDescriptor, wr = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? vs(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && gs(t, r, a), a;
};
let Je = class extends v {
  constructor() {
    super(...arguments), this.streak = 0;
  }
  _milestoneClass(e) {
    return e >= 30 ? "milestone-5" : e >= 14 ? "milestone-4" : e >= 7 ? "milestone-3" : e >= 3 ? "milestone-2" : e >= 1 ? "milestone-1" : "";
  }
  render() {
    const e = isNaN(this.streak) ? 0 : this.streak, t = e > 0 ? "day streak" : "start a streak today";
    return l`
      <div class="streak-row">
        <span class="flame ${this._milestoneClass(e)}">🔥</span>
        <span class="count">${e}</span>
      </div>
      <div class="label">${t}</div>
    `;
  }
};
Je.styles = b`
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
wr([
  p({ type: Number })
], Je.prototype, "streak", 2);
Je = wr([
  w("lucarne-streak-display")
], Je);
var ys = Object.defineProperty, _s = Object.getOwnPropertyDescriptor, yt = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? _s(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && ys(t, r, a), a;
};
let ze = class extends v {
  constructor() {
    super(...arguments), this.kidSlug = "", this.active = !1, this._dots = [];
  }
  connectedCallback() {
    super.connectedCallback(), this._generateDots();
  }
  _generateDots() {
    const e = ["#f5c89c", "#b8e0d2", "#f0b8c8", "#a8d8b9", "#c8b4e0", "#f0dca0"];
    this._dots = Array.from({ length: 18 }, (t, r) => ({
      left: `${r / 17 * 90 + 5}%`,
      color: e[r % e.length],
      delay: `${(r * 0.08).toFixed(2)}s`,
      size: `${8 + Math.round(Math.random() * 6)}px`
    }));
  }
  render() {
    return this.active ? l`
      ${this._dots.map(
      (e) => l`
          <div
            class="dot"
            style="left:${e.left};background:${e.color};animation-delay:${e.delay};width:${e.size};height:${e.size}"
          ></div>
        `
    )}
    ` : l``;
  }
};
ze.styles = b`
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
yt([
  p({ attribute: "kid-slug" })
], ze.prototype, "kidSlug", 2);
yt([
  p({ type: Boolean })
], ze.prototype, "active", 2);
ze = yt([
  w("lucarne-celebration-overlay")
], ze);
var bs = Object.defineProperty, ws = Object.getOwnPropertyDescriptor, ee = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? ws(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && bs(t, r, a), a;
};
function $s(e) {
  return [...e].sort((t, r) => t.summary.localeCompare(r.summary));
}
function xs(e) {
  return [...e].sort((t, r) => t.due && r.due ? t.due.localeCompare(r.due) : t.due ? -1 : r.due ? 1 : t.summary.localeCompare(r.summary));
}
let B = class extends v {
  constructor() {
    super(...arguments), this.tasks = [], this.streak = 0, this.showRoutines = !0, this.showTasks = !0, this.showStreak = !0, this._celebrating = !1, this._celebrationTimer = null, this._lastAllRoutinesDone = null;
  }
  updated(e) {
    if (super.updated(e), !e.has("tasks")) return;
    const t = this.tasks.filter((s) => s.metadata.type === "routine");
    if (t.length === 0) return;
    const r = t.every((s) => s.status === "completed");
    if (this._lastAllRoutinesDone === null) {
      this._lastAllRoutinesDone = r;
      return;
    }
    !this._lastAllRoutinesDone && r && this._triggerCelebration(), this._lastAllRoutinesDone = r;
  }
  _triggerCelebration() {
    this._celebrating = !0, this._celebrationTimer && clearTimeout(this._celebrationTimer), this._celebrationTimer = setTimeout(() => {
      this._celebrating = !1, this._celebrationTimer = null, this.requestUpdate();
    }, 2200), this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._celebrationTimer && clearTimeout(this._celebrationTimer);
  }
  render() {
    if (!this.member) return l``;
    const e = $s(this.tasks.filter((r) => r.metadata.type === "routine")), t = xs(this.tasks.filter((r) => r.metadata.type === "chore"));
    return l`
      <div class="column" style="--member-color:${this.member.color}">
        <lucarne-celebration-overlay
          kid-slug=${this.member.slug}
          ?active=${this._celebrating}
        ></lucarne-celebration-overlay>

        <div class="header">
          <lucarne-member-avatar
            name=${this.member.name}
            color=${this.member.color}
            .avatar=${this.member.avatar}
          ></lucarne-member-avatar>
          <div class="header-row">
            <div class="member-name">${this.member.name}</div>
            <button
              class="add-task-btn"
              @click=${this._onAddTask}
              aria-label="Add task for ${this.member.name}"
            >+ Add task</button>
          </div>
        </div>

        ${this.showRoutines && e.length > 0 ? l`
              <div class="section">
                <div class="section-header">Routines</div>
                ${e.map((r) => l`
                  <lucarne-task-row
                    .task=${r}
                    .memberColor=${this.member.color}
                  ></lucarne-task-row>
                `)}
              </div>
            ` : ""}

        ${this.showTasks && t.length > 0 ? l`
              <div class="section">
                <div class="section-header">Tasks</div>
                ${t.map((r) => l`
                  <lucarne-task-row
                    .task=${r}
                    .memberColor=${this.member.color}
                  ></lucarne-task-row>
                `)}
              </div>
            ` : ""}

        ${this.showStreak ? l`
              <div class="streak-area">
                <lucarne-streak-display .streak=${this.streak}></lucarne-streak-display>
              </div>
            ` : ""}
      </div>
    `;
  }
  _onAddTask() {
    this.dispatchEvent(
      new CustomEvent("add-task-clicked", {
        detail: { memberSlug: this.member.slug },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
B.styles = b`
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
    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 8px;
    }
    .member-name {
      font-size: clamp(1rem, 1.5vw, 1.25rem);
      font-weight: 700;
      color: var(--primary-text-color, #212121);
      font-family: var(--primary-font-family, sans-serif);
      text-align: center;
      flex: 1;
    }
    .add-task-btn {
      background: none;
      border: 1px dashed rgba(0, 0, 0, 0.25);
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 0.8rem;
      color: var(--secondary-text-color, #727272);
      cursor: pointer;
      white-space: nowrap;
      min-height: 32px;
      flex-shrink: 0;
    }
    .add-task-btn:hover {
      background: rgba(0, 0, 0, 0.04);
    }
    .section {
      display: flex;
      flex-direction: column;
    }
    .section-header {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--secondary-text-color, #727272);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 6px 4px 2px;
    }
    .streak-area {
      padding-top: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.07);
      margin-top: 8px;
    }
  `;
ee([
  p({ attribute: !1 })
], B.prototype, "member", 2);
ee([
  p({ attribute: !1 })
], B.prototype, "tasks", 2);
ee([
  p({ type: Number })
], B.prototype, "streak", 2);
ee([
  p({ type: Boolean, attribute: "show-routines" })
], B.prototype, "showRoutines", 2);
ee([
  p({ type: Boolean, attribute: "show-tasks" })
], B.prototype, "showTasks", 2);
ee([
  p({ type: Boolean, attribute: "show-streak" })
], B.prototype, "showStreak", 2);
ee([
  h()
], B.prototype, "_celebrating", 2);
B = ee([
  w("lucarne-member-column")
], B);
async function ks(e, t) {
  const r = {
    member: t.member,
    summary: t.summary,
    type: t.type
  };
  t.recurrence !== void 0 && (r.recurrence = t.recurrence), t.icon !== void 0 && (r.icon = t.icon), t.due !== void 0 && (r.due = t.due), t.source !== void 0 && (r.source = t.source), t.assignee !== void 0 && (r.assignee = t.assignee), await e.callService("lucarne_family", "add_task", r);
}
async function Cs(e, t, r) {
  const s = { uid: t };
  r.type !== void 0 && (s.type = r.type), r.recurrence !== void 0 && (s.recurrence = r.recurrence), r.icon !== void 0 && (s.icon = r.icon), r.assignee !== void 0 && (s.assignee = r.assignee), await e.callService("lucarne_family", "update_task_metadata", s);
}
async function Es(e, t) {
  await e.callService("lucarne_family", "delete_task", { uid: t });
}
async function Ms(e, t, r) {
  const s = await r.arrayBuffer(), a = new Uint8Array(s);
  let n = "";
  for (const o of a)
    n += String.fromCharCode(o);
  const i = btoa(n);
  await e.callService("lucarne_family", "upload_avatar", {
    member: t,
    image_data: i,
    mime_type: r.type
  });
}
async function Ds(e, t, r) {
  await e.callService("lucarne_family", "set_member_avatar", {
    member: t,
    avatar: r
  });
}
var Ss = Object.defineProperty, Ts = Object.getOwnPropertyDescriptor, S = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? Ts(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && Ss(t, r, a), a;
};
const Ps = ["🪥", "🛏️", "🎒", "💗", "📵", "🧸", "👕", "🧹", "🧺", "🍽️", "🐕", "🌱"];
let E = class extends v {
  constructor() {
    super(...arguments), this.members = [], this._selectedMemberSlug = "", this._summary = "", this._type = "chore", this._icon = "", this._recurrenceMode = "none", this._recurrenceDays = [], this._recurrenceInterval = 1, this._recurrenceMonthDay = 1, this._recurrenceNth = 1, this._recurrenceNthDay = "MO", this._recurrenceMonth = 1, this._due = "", this._assignee = "", this._error = "", this._saving = !1;
  }
  updated(e) {
    super.updated(e), e.has("member") && this.member && (this._selectedMemberSlug = this.member.slug);
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  _buildRRule() {
    return this._recurrenceMode === "none" ? "" : this._recurrenceMode === "daily" ? F({ mode: "daily", ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {} }) : this._recurrenceMode === "weekly" ? this._recurrenceDays.length === 0 ? "" : F({
      mode: "weekly",
      days: this._recurrenceDays,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-date" ? F({
      mode: "monthly-date",
      dayOfMonth: this._recurrenceMonthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-nth" ? F({
      mode: "monthly-nth",
      nth: this._recurrenceNth,
      day: this._recurrenceNthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "yearly" ? F({
      mode: "yearly",
      month: this._recurrenceMonth,
      dayOfMonth: this._recurrenceMonthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : "";
  }
  async _submit() {
    if (!this._saving) {
      if (!this._summary.trim()) {
        this._error = "Summary is required";
        return;
      }
      if (this._summary.trim().length > 200) {
        this._error = "Summary must be 200 characters or less";
        return;
      }
      if (this._recurrenceMode === "weekly" && this._recurrenceDays.length === 0) {
        this._error = "Select at least one day for weekly recurrence";
        return;
      }
      this._saving = !0, this._error = "";
      try {
        const e = this._buildRRule(), t = this._selectedMemberSlug === "household";
        await ks(this.hass, {
          member: this._selectedMemberSlug,
          summary: this._summary.trim(),
          type: this._type,
          ...e ? { recurrence: e } : {},
          ...this._icon ? { icon: this._icon } : {},
          ...this._due ? { due: this._due } : {},
          source: "manual",
          ...t && this._assignee ? { assignee: this._assignee } : {}
        }), this._close();
      } catch (e) {
        this._error = e instanceof Error ? e.message : "Failed to add task", this._saving = !1;
      }
    }
  }
  _toggleDay(e) {
    this._recurrenceDays.includes(e) ? this._recurrenceDays = this._recurrenceDays.filter((t) => t !== e) : this._recurrenceDays = [...this._recurrenceDays, e];
  }
  render() {
    const e = this._selectedMemberSlug === "household", t = this._buildRRule(), r = t ? fr(t) : "One-off (no repeat)", s = {
      MO: "Mon",
      TU: "Tue",
      WE: "Wed",
      TH: "Thu",
      FR: "Fri",
      SA: "Sat",
      SU: "Sun"
    };
    return l`
      <div class="backdrop" @click=${this._close}></div>
      <div class="popover" role="dialog" aria-modal="true" aria-label="Add task">
        <div class="popover-header">
          <h2 class="popover-title">Add Task</h2>
          <button class="close-btn" @click=${this._close} aria-label="Cancel">✕</button>
        </div>

        <div class="field">
          <label for="at-member">Member</label>
          <select
            id="at-member"
            .value=${this._selectedMemberSlug}
            @change=${(a) => this._selectedMemberSlug = a.target.value}
          >
            ${this.members.map((a) => l`<option value=${a.slug}>${a.name}</option>`)}
          </select>
        </div>

        ${e ? l`
              <div class="field">
                <label for="at-assignee">Assignee (optional)</label>
                <select
                  id="at-assignee"
                  .value=${this._assignee}
                  @change=${(a) => this._assignee = a.target.value}
                >
                  <option value="">— None —</option>
                  ${this.members.filter((a) => a.slug !== "household").map(
      (a) => l`<option value=${a.slug}>${a.name}</option>`
    )}
                </select>
              </div>
            ` : ""}

        <div class="field">
          <label for="at-summary">Summary *</label>
          <input
            id="at-summary"
            type="text"
            placeholder="Task name"
            maxlength="200"
            .value=${this._summary}
            @input=${(a) => this._summary = a.target.value}
            @keydown=${(a) => a.key === "Enter" && this._submit()}
          />
        </div>

        <div class="field">
          <label>Type</label>
          <div class="type-row">
            <button
              class="type-btn ${this._type === "routine" ? "active" : ""}"
              @click=${() => this._type = "routine"}
            >Routine</button>
            <button
              class="type-btn ${this._type === "chore" ? "active" : ""}"
              @click=${() => this._type = "chore"}
            >Chore</button>
          </div>
        </div>

        <div class="field">
          <label>Icon</label>
          <div class="emoji-picker">
            ${Ps.map((a) => l`
              <button
                class="emoji-btn ${this._icon === a ? "selected" : ""}"
                @click=${() => this._icon = this._icon === a ? "" : a}
                title="${a}"
              >${a}</button>
            `)}
          </div>
          <input
            type="text"
            placeholder="Custom emoji"
            maxlength="8"
            .value=${this._icon}
            @input=${(a) => this._icon = a.target.value}
            style="margin-top:4px"
          />
        </div>

        <div class="field">
          <label for="at-recurrence">Recurrence</label>
          <select
            id="at-recurrence"
            .value=${this._recurrenceMode}
            @change=${(a) => this._recurrenceMode = a.target.value}
          >
            <option value="none">None (one-off)</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly-date">Monthly by date</option>
            <option value="monthly-nth">Monthly by Nth weekday</option>
            <option value="yearly">Yearly</option>
          </select>

          ${this._recurrenceMode !== "none" ? l`
                <div class="recurrence-extra">
                  ${this._recurrenceMode !== "monthly-nth" && this._recurrenceMode !== "yearly" ? l`
                        <div>
                          <label>Interval</label>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            .value=${String(this._recurrenceInterval)}
                            @change=${(a) => {
      const n = parseInt(a.target.value, 10);
      this._recurrenceInterval = isNaN(n) || n < 1 ? 1 : n;
    }}
                          />
                        </div>
                      ` : ""}

                  ${this._recurrenceMode === "weekly" ? l`
                        <div>
                          <label>Days</label>
                          <div class="days-row">
                            ${ge.map((a) => l`
                              <button
                                class="day-btn ${this._recurrenceDays.includes(a) ? "selected" : ""}"
                                @click=${() => this._toggleDay(a)}
                              >${s[a]}</button>
                            `)}
                          </div>
                        </div>
                      ` : ""}

                  ${this._recurrenceMode === "monthly-date" ? l`
                        <div>
                          <label for="at-monthday">Day of month</label>
                          <input
                            id="at-monthday"
                            type="number"
                            min="1"
                            max="31"
                            .value=${String(this._recurrenceMonthDay)}
                            @change=${(a) => {
      const n = parseInt(a.target.value, 10);
      this._recurrenceMonthDay = isNaN(n) || n < 1 ? 1 : Math.min(n, 31);
    }}
                          />
                        </div>
                      ` : ""}

                  ${this._recurrenceMode === "monthly-nth" ? l`
                        <div style="display:flex;gap:8px">
                          <div style="flex:1">
                            <label for="at-nth">Nth</label>
                            <select
                              id="at-nth"
                              .value=${String(this._recurrenceNth)}
                              @change=${(a) => this._recurrenceNth = parseInt(a.target.value, 10)}
                            >
                              <option value="1">1st</option>
                              <option value="2">2nd</option>
                              <option value="3">3rd</option>
                              <option value="4">4th</option>
                              <option value="-1">Last</option>
                            </select>
                          </div>
                          <div style="flex:1">
                            <label for="at-nthday">Day</label>
                            <select
                              id="at-nthday"
                              .value=${this._recurrenceNthDay}
                              @change=${(a) => this._recurrenceNthDay = a.target.value}
                            >
                              ${ge.map((a) => l`<option value=${a}>${s[a]}</option>`)}
                            </select>
                          </div>
                          <div style="flex:1">
                            <label for="at-nth-interval">Every N months</label>
                            <input
                              id="at-nth-interval"
                              type="number"
                              min="1"
                              max="99"
                              .value=${String(this._recurrenceInterval)}
                              @change=${(a) => {
      const n = parseInt(a.target.value, 10);
      this._recurrenceInterval = isNaN(n) || n < 1 ? 1 : n;
    }}
                            />
                          </div>
                        </div>
                      ` : ""}

                  ${this._recurrenceMode === "yearly" ? l`
                        <div style="display:flex;gap:8px">
                          <div style="flex:1">
                            <label for="at-year-month">Month</label>
                            <input
                              id="at-year-month"
                              type="number"
                              min="1"
                              max="12"
                              .value=${String(this._recurrenceMonth)}
                              @change=${(a) => {
      const n = parseInt(a.target.value, 10);
      this._recurrenceMonth = isNaN(n) || n < 1 ? 1 : Math.min(n, 12);
    }}
                            />
                          </div>
                          <div style="flex:1">
                            <label for="at-year-day">Day</label>
                            <input
                              id="at-year-day"
                              type="number"
                              min="1"
                              max="31"
                              .value=${String(this._recurrenceMonthDay)}
                              @change=${(a) => {
      const n = parseInt(a.target.value, 10);
      this._recurrenceMonthDay = isNaN(n) || n < 1 ? 1 : Math.min(n, 31);
    }}
                            />
                          </div>
                          <div style="flex:1">
                            <label for="at-year-interval">Every N years</label>
                            <input
                              id="at-year-interval"
                              type="number"
                              min="1"
                              max="99"
                              .value=${String(this._recurrenceInterval)}
                              @change=${(a) => {
      const n = parseInt(a.target.value, 10);
      this._recurrenceInterval = isNaN(n) || n < 1 ? 1 : n;
    }}
                            />
                          </div>
                        </div>
                      ` : ""}
                </div>
                <div class="recurrence-summary">${r}</div>
              ` : ""}
        </div>

        ${this._type === "chore" ? l`
              <div class="field">
                <label for="at-due">Due (optional)</label>
                <input
                  id="at-due"
                  type="datetime-local"
                  .value=${this._due}
                  @change=${(a) => this._due = a.target.value}
                />
              </div>
            ` : ""}

        ${this._error ? l`<div class="error-msg">${this._error}</div>` : ""}

        <div class="actions">
          <button class="btn btn-cancel" @click=${this._close}>Cancel</button>
          <button class="btn btn-submit" ?disabled=${this._saving} @click=${this._submit}>
            ${this._saving ? "Adding…" : "Add Task"}
          </button>
        </div>
      </div>
    `;
  }
};
E.styles = [
  M,
  b`
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
        max-height: 85vh;
        overflow-y: auto;
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
      input[type='datetime-local'],
      select,
      input[type='number'] {
        appearance: none;
        -webkit-appearance: none;
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
      input:focus, select:focus {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 1px;
      }
      .type-row {
        display: flex;
        gap: var(--lucarne-spacing-sm);
      }
      .type-btn {
        flex: 1;
        padding: 8px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: var(--lucarne-radius-sm);
        background: var(--lucarne-surface);
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        min-height: 44px;
        transition: background 0.1s;
      }
      .type-btn.active {
        background: var(--primary-color, #03a9f4);
        color: #fff;
        border-color: var(--primary-color, #03a9f4);
      }
      .emoji-picker {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 4px;
      }
      .emoji-btn {
        font-size: 1.25rem;
        padding: 4px;
        border: 1px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        background: none;
        min-width: 36px;
        min-height: 36px;
      }
      .emoji-btn.selected {
        border-color: var(--primary-color, #03a9f4);
        background: rgba(3, 169, 244, 0.1);
      }
      .recurrence-summary {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        margin-top: 4px;
        font-style: italic;
      }
      .recurrence-extra {
        margin-top: var(--lucarne-spacing-sm);
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-sm);
      }
      .days-row {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }
      .day-btn {
        padding: 4px 8px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        cursor: pointer;
        background: none;
        font-size: 0.75rem;
        min-height: 32px;
      }
      .day-btn.selected {
        background: var(--primary-color, #03a9f4);
        color: #fff;
        border-color: var(--primary-color, #03a9f4);
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
      .btn-submit {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }
      .btn-submit:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `
];
S([
  p({ attribute: !1 })
], E.prototype, "hass", 2);
S([
  p({ attribute: !1 })
], E.prototype, "member", 2);
S([
  p({ attribute: !1 })
], E.prototype, "members", 2);
S([
  h()
], E.prototype, "_selectedMemberSlug", 2);
S([
  h()
], E.prototype, "_summary", 2);
S([
  h()
], E.prototype, "_type", 2);
S([
  h()
], E.prototype, "_icon", 2);
S([
  h()
], E.prototype, "_recurrenceMode", 2);
S([
  h()
], E.prototype, "_recurrenceDays", 2);
S([
  h()
], E.prototype, "_recurrenceInterval", 2);
S([
  h()
], E.prototype, "_recurrenceMonthDay", 2);
S([
  h()
], E.prototype, "_recurrenceNth", 2);
S([
  h()
], E.prototype, "_recurrenceNthDay", 2);
S([
  h()
], E.prototype, "_recurrenceMonth", 2);
S([
  h()
], E.prototype, "_due", 2);
S([
  h()
], E.prototype, "_assignee", 2);
S([
  h()
], E.prototype, "_error", 2);
S([
  h()
], E.prototype, "_saving", 2);
E = S([
  w("lucarne-add-task-popover")
], E);
var As = Object.defineProperty, Os = Object.getOwnPropertyDescriptor, D = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? Os(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && As(t, r, a), a;
};
let x = class extends v {
  constructor() {
    super(...arguments), this.members = [], this._summary = "", this._type = "chore", this._icon = "", this._recurrenceMode = "none", this._recurrenceDays = [], this._recurrenceInterval = 1, this._recurrenceMonthDay = 1, this._recurrenceNth = 1, this._recurrenceNthDay = "MO", this._recurrenceMonth = 1, this._due = "", this._assignee = "", this._isCustomRecurrence = !1, this._rawRecurrence = "", this._error = "", this._saving = !1, this._confirmingDelete = !1;
  }
  updated(e) {
    super.updated(e), e.has("task") && this.task && this._prefill();
  }
  _prefill() {
    const e = this.task;
    this._summary = e.summary, this._type = e.metadata.type, this._icon = e.metadata.icon, this._due = e.due ?? "", this._assignee = e.metadata.assignee_slug, this._recurrenceDays = [], this._recurrenceInterval = 1, this._recurrenceMonthDay = 1, this._recurrenceNth = 1, this._recurrenceNthDay = "MO", this._recurrenceMonth = 1, this._rawRecurrence = "", this._isCustomRecurrence = !1;
    const t = pt(e.metadata.recurrence);
    t.mode === "unknown" ? (this._isCustomRecurrence = !0, this._rawRecurrence = t.raw, this._recurrenceMode = "unknown") : (this._isCustomRecurrence = !1, this._recurrenceMode = t.mode, t.mode === "daily" ? this._recurrenceInterval = t.interval ?? 1 : t.mode === "weekly" ? (this._recurrenceDays = [...t.days], this._recurrenceInterval = t.interval ?? 1) : t.mode === "monthly-date" ? (this._recurrenceMonthDay = t.dayOfMonth, this._recurrenceInterval = t.interval ?? 1) : t.mode === "monthly-nth" ? (this._recurrenceNth = t.nth, this._recurrenceNthDay = t.day, this._recurrenceInterval = t.interval ?? 1) : t.mode === "yearly" && (this._recurrenceMonth = t.month, this._recurrenceMonthDay = t.dayOfMonth, this._recurrenceInterval = t.interval ?? 1));
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  _buildRRule() {
    return this._isCustomRecurrence ? this._rawRecurrence : this._recurrenceMode === "none" ? "" : this._recurrenceMode === "daily" ? F({ mode: "daily", ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {} }) : this._recurrenceMode === "weekly" ? F({
      mode: "weekly",
      days: this._recurrenceDays,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-date" ? F({
      mode: "monthly-date",
      dayOfMonth: this._recurrenceMonthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-nth" ? F({
      mode: "monthly-nth",
      nth: this._recurrenceNth,
      day: this._recurrenceNthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "yearly" ? F({
      mode: "yearly",
      month: this._recurrenceMonth,
      dayOfMonth: this._recurrenceMonthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : "";
  }
  async _save() {
    var e;
    if (!this._saving) {
      if (!this._summary.trim()) {
        this._error = "Summary is required";
        return;
      }
      if (this._summary.trim().length > 200) {
        this._error = "Summary must be 200 characters or less";
        return;
      }
      if (this._recurrenceMode === "weekly" && !this._isCustomRecurrence && this._recurrenceDays.length === 0) {
        this._error = "Select at least one day for weekly recurrence";
        return;
      }
      if (!this._due && this.task.due) {
        this._error = "Due date cannot be cleared here — delete and recreate the task to remove it";
        return;
      }
      this._saving = !0, this._error = "";
      try {
        const t = this.task.metadata.member_slug === "household" ? "todo.lucarne_household" : ((e = this.members.find((n) => n.slug === this.task.metadata.member_slug)) == null ? void 0 : e.todo_entity_id) ?? "", r = this._summary.trim() !== this.task.summary, s = !!this._due && this._due !== (this.task.due ?? ""), a = this._type !== this.task.metadata.type || this._icon !== this.task.metadata.icon || this._buildRRule() !== this.task.metadata.recurrence || this.task.metadata.member_slug === "household" && this._assignee !== this.task.metadata.assignee_slug;
        if (r || s) {
          if (!t) throw new Error("Could not resolve todo entity for this task");
          await this.hass.callService("todo", "update_item", {
            item: this.task.uid,
            rename: this._summary.trim(),
            ...s ? { due_datetime: this._due } : {}
          }, { entity_id: t });
        }
        if (a) {
          const n = this.task.metadata.member_slug === "household";
          await Cs(this.hass, this.task.uid, {
            ...this._type !== this.task.metadata.type ? { type: this._type } : {},
            ...this._icon !== this.task.metadata.icon ? { icon: this._icon } : {},
            ...this._buildRRule() !== this.task.metadata.recurrence ? { recurrence: this._buildRRule() } : {},
            ...n && this._assignee !== this.task.metadata.assignee_slug ? { assignee: this._assignee } : {}
          });
        }
        this._close();
      } catch (t) {
        this._error = t instanceof Error ? t.message : "Failed to save", this._saving = !1;
      }
    }
  }
  async _delete() {
    if (!this._saving) {
      this._saving = !0, this._error = "";
      try {
        await Es(this.hass, this.task.uid), this._close();
      } catch (e) {
        this._error = e instanceof Error ? e.message : "Failed to delete", this._saving = !1, this._confirmingDelete = !1;
      }
    }
  }
  _toggleDay(e) {
    this._recurrenceDays.includes(e) ? this._recurrenceDays = this._recurrenceDays.filter((t) => t !== e) : this._recurrenceDays = [...this._recurrenceDays, e];
  }
  render() {
    var n;
    if (!this.task) return l``;
    const e = this.task.metadata.member_slug === "household", t = e ? "Household" : ((n = this.members.find((i) => i.slug === this.task.metadata.member_slug)) == null ? void 0 : n.name) ?? this.task.metadata.member_slug, r = this._buildRRule(), s = this._isCustomRecurrence ? "Custom recurrence (not editable here)" : fr(r), a = {
      MO: "Mon",
      TU: "Tue",
      WE: "Wed",
      TH: "Thu",
      FR: "Fri",
      SA: "Sat",
      SU: "Sun"
    };
    return l`
      <div class="backdrop" @click=${this._close}></div>
      <div class="popover" role="dialog" aria-modal="true" aria-label="Edit task">
        <div class="popover-header">
          <h2 class="popover-title">Edit Task</h2>
          <button class="close-btn" @click=${this._close} aria-label="Cancel">✕</button>
        </div>

        <div class="field">
          <label>Member</label>
          <div class="readonly-field" title="Member cannot be changed in v1">${t}</div>
          <div class="readonly-tooltip">Member cannot be changed here</div>
        </div>

        ${e ? l`
              <div class="field">
                <label for="et-assignee">Assignee (optional)</label>
                <select
                  id="et-assignee"
                  .value=${this._assignee}
                  @change=${(i) => this._assignee = i.target.value}
                >
                  <option value="">— None —</option>
                  ${this.members.filter((i) => i.slug !== "household").map(
      (i) => l`<option value=${i.slug}>${i.name}</option>`
    )}
                </select>
              </div>
            ` : ""}

        <div class="field">
          <label for="et-summary">Summary *</label>
          <input
            id="et-summary"
            type="text"
            maxlength="200"
            .value=${this._summary}
            @input=${(i) => this._summary = i.target.value}
          />
        </div>

        <div class="field">
          <label>Type</label>
          <div class="type-row">
            <button class="type-btn ${this._type === "routine" ? "active" : ""}" @click=${() => this._type = "routine"}>Routine</button>
            <button class="type-btn ${this._type === "chore" ? "active" : ""}" @click=${() => this._type = "chore"}>Chore</button>
          </div>
        </div>

        <div class="field">
          <label for="et-icon">Icon</label>
          <input
            id="et-icon"
            type="text"
            placeholder="Emoji or empty"
            maxlength="8"
            .value=${this._icon}
            @input=${(i) => this._icon = i.target.value}
          />
        </div>

        <div class="field">
          <label for="et-recurrence">Recurrence</label>
          ${this._isCustomRecurrence ? l`<div class="custom-recurrence-note">${s}</div>` : l`
                <select
                  id="et-recurrence"
                  .value=${this._recurrenceMode}
                  @change=${(i) => this._recurrenceMode = i.target.value}
                >
                  <option value="none">None (one-off)</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly-date">Monthly by date</option>
                  <option value="monthly-nth">Monthly by Nth weekday</option>
                  <option value="yearly">Yearly</option>
                </select>

                ${this._recurrenceMode !== "none" ? l`
                      <div class="recurrence-extra">
                        ${this._recurrenceMode !== "monthly-nth" && this._recurrenceMode !== "yearly" ? l`
                              <div>
                                <label>Interval</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="99"
                                  .value=${String(this._recurrenceInterval)}
                                  @change=${(i) => {
      const o = parseInt(i.target.value, 10);
      this._recurrenceInterval = isNaN(o) || o < 1 ? 1 : o;
    }}
                                />
                              </div>
                            ` : ""}

                        ${this._recurrenceMode === "weekly" ? l`
                              <div>
                                <label>Days</label>
                                <div class="days-row">
                                  ${ge.map((i) => l`
                                    <button
                                      class="day-btn ${this._recurrenceDays.includes(i) ? "selected" : ""}"
                                      @click=${() => this._toggleDay(i)}
                                    >${a[i]}</button>
                                  `)}
                                </div>
                              </div>
                            ` : ""}

                        ${this._recurrenceMode === "monthly-date" ? l`
                              <div>
                                <label>Day of month</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="31"
                                  .value=${String(this._recurrenceMonthDay)}
                                  @change=${(i) => {
      const o = parseInt(i.target.value, 10);
      this._recurrenceMonthDay = isNaN(o) || o < 1 ? 1 : Math.min(o, 31);
    }}
                                />
                              </div>
                            ` : ""}

                        ${this._recurrenceMode === "monthly-nth" ? l`
                              <div style="display:flex;gap:8px">
                                <div style="flex:1">
                                  <label>Nth</label>
                                  <select
                                    .value=${String(this._recurrenceNth)}
                                    @change=${(i) => this._recurrenceNth = parseInt(i.target.value, 10)}
                                  >
                                    <option value="1">1st</option>
                                    <option value="2">2nd</option>
                                    <option value="3">3rd</option>
                                    <option value="4">4th</option>
                                    <option value="-1">Last</option>
                                  </select>
                                </div>
                                <div style="flex:1">
                                  <label>Day</label>
                                  <select
                                    .value=${this._recurrenceNthDay}
                                    @change=${(i) => this._recurrenceNthDay = i.target.value}
                                  >
                                    ${ge.map((i) => l`<option value=${i}>${a[i]}</option>`)}
                                  </select>
                                </div>
                                <div style="flex:1">
                                  <label>Every N months</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    .value=${String(this._recurrenceInterval)}
                                    @change=${(i) => {
      const o = parseInt(i.target.value, 10);
      this._recurrenceInterval = isNaN(o) || o < 1 ? 1 : o;
    }}
                                  />
                                </div>
                              </div>
                            ` : ""}

                        ${this._recurrenceMode === "yearly" ? l`
                              <div style="display:flex;gap:8px">
                                <div style="flex:1">
                                  <label>Month</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    .value=${String(this._recurrenceMonth)}
                                    @change=${(i) => {
      const o = parseInt(i.target.value, 10);
      this._recurrenceMonth = isNaN(o) || o < 1 ? 1 : Math.min(o, 12);
    }}
                                  />
                                </div>
                                <div style="flex:1">
                                  <label>Day</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    .value=${String(this._recurrenceMonthDay)}
                                    @change=${(i) => {
      const o = parseInt(i.target.value, 10);
      this._recurrenceMonthDay = isNaN(o) || o < 1 ? 1 : Math.min(o, 31);
    }}
                                  />
                                </div>
                                <div style="flex:1">
                                  <label>Every N years</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    .value=${String(this._recurrenceInterval)}
                                    @change=${(i) => {
      const o = parseInt(i.target.value, 10);
      this._recurrenceInterval = isNaN(o) || o < 1 ? 1 : o;
    }}
                                  />
                                </div>
                              </div>
                            ` : ""}
                      </div>
                      <div class="recurrence-summary">${s}</div>
                    ` : ""}
              `}
        </div>

        <div class="field">
          <label for="et-due">Due (optional)</label>
          <input
            id="et-due"
            type="datetime-local"
            .value=${this._due}
            @change=${(i) => this._due = i.target.value}
          />
        </div>

        ${this._error ? l`<div class="error-msg">${this._error}</div>` : ""}

        <div class="actions">
          <button class="btn btn-cancel" @click=${this._close}>Cancel</button>
          <button class="btn btn-save" ?disabled=${this._saving} @click=${this._save}>
            ${this._saving ? "Saving…" : "Save"}
          </button>
        </div>

        <div class="delete-zone">
          ${this._confirmingDelete ? l`
                <div class="confirm-delete">
                  <span>Delete this task?</span>
                  <button
                    style="background:#f44336;color:#fff"
                    ?disabled=${this._saving}
                    @click=${this._delete}
                  >Yes, delete</button>
                  <button
                    style="background:rgba(0,0,0,0.06)"
                    @click=${() => this._confirmingDelete = !1}
                  >Cancel</button>
                </div>
              ` : l`
                <button class="btn btn-delete" @click=${() => this._confirmingDelete = !0}>
                  Delete Task
                </button>
              `}
        </div>
      </div>
    `;
  }
};
x.styles = [
  M,
  b`
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
        max-height: 85vh;
        overflow-y: auto;
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
      input[type='datetime-local'],
      input[type='number'],
      select {
        appearance: none;
        -webkit-appearance: none;
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
      input:focus, select:focus {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 1px;
      }
      .readonly-field {
        padding: 8px 10px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: var(--lucarne-radius-sm);
        background: rgba(0, 0, 0, 0.03);
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        min-height: 44px;
        display: flex;
        align-items: center;
        position: relative;
      }
      .readonly-tooltip {
        font-size: 0.7rem;
        color: var(--lucarne-on-surface-muted);
        margin-top: 2px;
        font-style: italic;
      }
      .type-row {
        display: flex;
        gap: var(--lucarne-spacing-sm);
      }
      .type-btn {
        flex: 1;
        padding: 8px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: var(--lucarne-radius-sm);
        background: var(--lucarne-surface);
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        min-height: 44px;
      }
      .type-btn.active {
        background: var(--primary-color, #03a9f4);
        color: #fff;
        border-color: var(--primary-color, #03a9f4);
      }
      .recurrence-summary {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        margin-top: 4px;
        font-style: italic;
      }
      .custom-recurrence-note {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        font-style: italic;
        padding: 6px 0;
      }
      .recurrence-extra {
        margin-top: var(--lucarne-spacing-sm);
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-sm);
      }
      .days-row {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }
      .day-btn {
        padding: 4px 8px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        cursor: pointer;
        background: none;
        font-size: 0.75rem;
        min-height: 32px;
      }
      .day-btn.selected {
        background: var(--primary-color, #03a9f4);
        color: #fff;
        border-color: var(--primary-color, #03a9f4);
      }
      .delete-zone {
        margin-top: var(--lucarne-spacing-md);
        padding-top: var(--lucarne-spacing-md);
        border-top: 1px solid rgba(0, 0, 0, 0.08);
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
      .btn-save {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }
      .btn-save:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .btn-delete {
        background: none;
        border: 1px solid #f44336;
        color: #f44336;
        width: 100%;
      }
      .confirm-delete {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        align-items: center;
        font-size: var(--lucarne-fs-sm);
        color: #c62828;
      }
      .confirm-delete button {
        padding: 4px 12px;
        border-radius: var(--lucarne-radius-sm);
        border: none;
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        min-height: 36px;
      }
    `
];
D([
  p({ attribute: !1 })
], x.prototype, "hass", 2);
D([
  p({ attribute: !1 })
], x.prototype, "task", 2);
D([
  p({ attribute: !1 })
], x.prototype, "members", 2);
D([
  h()
], x.prototype, "_summary", 2);
D([
  h()
], x.prototype, "_type", 2);
D([
  h()
], x.prototype, "_icon", 2);
D([
  h()
], x.prototype, "_recurrenceMode", 2);
D([
  h()
], x.prototype, "_recurrenceDays", 2);
D([
  h()
], x.prototype, "_recurrenceInterval", 2);
D([
  h()
], x.prototype, "_recurrenceMonthDay", 2);
D([
  h()
], x.prototype, "_recurrenceNth", 2);
D([
  h()
], x.prototype, "_recurrenceNthDay", 2);
D([
  h()
], x.prototype, "_recurrenceMonth", 2);
D([
  h()
], x.prototype, "_due", 2);
D([
  h()
], x.prototype, "_assignee", 2);
D([
  h()
], x.prototype, "_isCustomRecurrence", 2);
D([
  h()
], x.prototype, "_rawRecurrence", 2);
D([
  h()
], x.prototype, "_error", 2);
D([
  h()
], x.prototype, "_saving", 2);
D([
  h()
], x.prototype, "_confirmingDelete", 2);
x = D([
  w("lucarne-edit-task-popover")
], x);
var Is = Object.defineProperty, Rs = Object.getOwnPropertyDescriptor, we = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? Rs(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && Is(t, r, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-chores-card",
  name: "Lucarne Chores",
  description: "Family chore grid with streaks and celebration",
  preview: !0
});
let Q = class extends v {
  constructor() {
    super(...arguments), this._familyState = null, this._addTaskMember = null, this._editTask = null;
  }
  setConfig(e) {
    if ("kids" in e) {
      this._config = e;
      return;
    }
    if (!Array.isArray(e.members))
      throw new Error("lucarne-chores-card: members must be an array");
    this._config = e;
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
      members: []
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.hass && !this._unsubFamily && (this._unsubFamily = Pe(this.hass, (e) => {
      this._familyState = e;
    }));
  }
  updated(e) {
    super.updated(e), e.has("hass") && this.hass && !this._unsubFamily && (this._unsubFamily = Pe(this.hass, (t) => {
      this._familyState = t;
    }));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._unsubFamily) == null || e.call(this), this._unsubFamily = void 0;
  }
  _resolveMembers() {
    if (!this._config || !this._familyState) return [];
    const { members: e } = this._config, t = this._config.show_routines ?? !0, r = this._config.show_tasks ?? !0, s = /* @__PURE__ */ new Date(), a = new Date(s.getFullYear(), s.getMonth(), s.getDate(), 23, 59, 59, 999), n = [];
    for (const i of e) {
      const o = i === "household" ? Ee : this._familyState.members.find((m) => m.slug === i) ?? null;
      if (!o) continue;
      const d = (this._familyState.tasksByMember.get(i) ?? []).filter((m) => m.metadata.type === "routine" ? t : m.metadata.type === "chore" && r ? m.due === null ? !0 : (m.due.includes("T") ? new Date(m.due) : /* @__PURE__ */ new Date(m.due + "T00:00:00")) <= a : !1), u = this._familyState.streakByMember.get(i) ?? 0;
      n.push({ member: o, tasks: d, streak: u });
    }
    return n;
  }
  async _handleTaskToggle(e) {
    var a;
    const { task: t } = e.detail;
    if (!this.hass || !this._familyState) return;
    const r = t.status === "completed" ? "needs_action" : "completed", s = t.metadata.member_slug === "household" ? "todo.lucarne_household" : ((a = this._familyState.members.find((n) => n.slug === t.metadata.member_slug)) == null ? void 0 : a.todo_entity_id) ?? "";
    s && await this.hass.callService("todo", "update_item", { item: t.uid, status: r }, { entity_id: s });
  }
  _handleAddTask(e) {
    const { memberSlug: t } = e.detail;
    if (!this._familyState) return;
    const r = t === "household" ? Ee : this._familyState.members.find((s) => s.slug === t) ?? null;
    r && (this._addTaskMember = r);
  }
  _handleLongPress(e) {
    const { task: t } = e.detail;
    this._editTask = t;
  }
  render() {
    if (!this._config) return l``;
    if ("kids" in this._config)
      return l`
        <ha-card>
          <div class="error-block">
            <strong>Card upgraded</strong>
            This card was upgraded. Install the Lucarne Family integration and update your YAML.
          </div>
        </ha-card>
      `;
    const e = this._config.title ?? "Chores", t = this._config.show_routines ?? !0, r = this._config.show_tasks ?? !0, s = this._config.show_streak ?? !0;
    if (this._familyState === null)
      return l`<ha-card><div class="loading">Loading…</div></ha-card>`;
    if (this._familyState.integrationError !== null)
      return l`
        <ha-card>
          <div class="error-block">
            <strong>Lucarne Family integration not set up</strong>
            Install it in Settings → Devices &amp; Services.
          </div>
        </ha-card>
      `;
    const a = this._resolveMembers(), n = [...this._familyState.members, Ee];
    return l`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${e}</h2>
        </div>
        <div
          class="members-grid"
          @add-task-clicked=${this._handleAddTask}
          @task-toggle=${this._handleTaskToggle}
          @task-long-press=${this._handleLongPress}
        >
          ${a.map(({ member: i, tasks: o, streak: c }) => l`
            <div class="member-cell">
              <lucarne-member-column
                .member=${i}
                .tasks=${o}
                .streak=${c}
                ?show-routines=${t}
                ?show-tasks=${r}
                ?show-streak=${s}
              ></lucarne-member-column>
            </div>
          `)}
        </div>
      </ha-card>

      ${this._addTaskMember !== null ? l`
            <lucarne-add-task-popover
              .hass=${this.hass}
              .member=${this._addTaskMember}
              .members=${n}
              @popover-close=${() => {
      this._addTaskMember = null;
    }}
            ></lucarne-add-task-popover>
          ` : ""}

      ${this._editTask !== null ? l`
            <lucarne-edit-task-popover
              .hass=${this.hass}
              .task=${this._editTask}
              .members=${n}
              @popover-close=${() => {
      this._editTask = null;
    }}
            ></lucarne-edit-task-popover>
          ` : ""}
    `;
  }
};
Q.styles = [
  M,
  b`
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
      .members-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
      .member-cell {
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        position: relative;
      }
      .member-cell:last-child {
        border-right: none;
      }
      @media (max-width: 600px) {
        .members-grid {
          grid-template-columns: 1fr;
        }
        .member-cell {
          border-right: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        }
        .member-cell:last-child {
          border-bottom: none;
        }
      }
      .error-block {
        padding: var(--lucarne-spacing-xl);
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
      }
      .error-block strong {
        color: var(--lucarne-on-surface);
        font-size: var(--lucarne-fs-md);
      }
      .loading {
        padding: var(--lucarne-spacing-xl);
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        text-align: center;
      }
    `
];
we([
  p({ attribute: !1 })
], Q.prototype, "hass", 2);
we([
  h()
], Q.prototype, "_config", 2);
we([
  h()
], Q.prototype, "_familyState", 2);
we([
  h()
], Q.prototype, "_addTaskMember", 2);
we([
  h()
], Q.prototype, "_editTask", 2);
Q = we([
  w("lucarne-chores-card")
], Q);
var zs = Object.defineProperty, Ns = Object.getOwnPropertyDescriptor, Y = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? Ns(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && zs(t, r, a), a;
};
const js = 2 * 1024 * 1024, Hs = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp"]), Ls = [
  "👶",
  "🧒",
  "👧",
  "🧑",
  "👦",
  "👩",
  "👨",
  "🧓",
  "👴",
  "👵",
  "🐶",
  "🐱",
  "🐻",
  "🐼",
  "🐨",
  "🦊",
  "🦁",
  "🐯",
  "🐸",
  "🦄",
  "🌟",
  "⭐",
  "🌈",
  "🌸",
  "🌺",
  "🌻",
  "🍀",
  "🎈",
  "🎨",
  "🎯",
  "🏃",
  "⚽",
  "🎸",
  "🎤",
  "📚",
  "🎮",
  "🏆",
  "❤️",
  "💙",
  "💚"
];
let H = class extends v {
  constructor() {
    super(...arguments), this._mode = "emoji", this._selectedEmoji = null, this._selectedFile = null, this._previewUrl = null, this._error = null, this._submitting = !1;
  }
  _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }
  _selectEmoji(e) {
    this._selectedEmoji = e, this._error = null;
  }
  _onFileChange(e) {
    var s;
    const r = ((s = e.target.files) == null ? void 0 : s[0]) ?? null;
    if (this._previewUrl && URL.revokeObjectURL(this._previewUrl), this._selectedFile = null, this._previewUrl = null, this._error = null, !!r) {
      if (!Hs.has(r.type)) {
        this._error = "Only PNG, JPEG, and WebP images are accepted.";
        return;
      }
      if (r.size > js) {
        this._error = "Image must be 2 MB or smaller.";
        return;
      }
      this._selectedFile = r, this._previewUrl = URL.createObjectURL(r);
    }
  }
  async _submit() {
    if (!this._submitting) {
      if (this._error = null, this._mode === "emoji") {
        if (!this._selectedEmoji) {
          this._error = "Pick an emoji first.";
          return;
        }
        this._submitting = !0;
        try {
          await Ds(this.hass, this.memberSlug, this._selectedEmoji), this.dispatchEvent(new CustomEvent("avatar-changed", { detail: { avatar: this._selectedEmoji } })), this._close();
        } catch (e) {
          this._error = e instanceof Error ? e.message : String(e);
        } finally {
          this._submitting = !1;
        }
        return;
      }
      if (!this._selectedFile) {
        this._error = "Select an image file first.";
        return;
      }
      this._submitting = !0;
      try {
        await Ms(this.hass, this.memberSlug, this._selectedFile), this.dispatchEvent(new CustomEvent("avatar-changed")), this._close();
      } catch (e) {
        this._error = e instanceof Error ? e.message : String(e);
      } finally {
        this._submitting = !1;
      }
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._previewUrl && URL.revokeObjectURL(this._previewUrl);
  }
  render() {
    return l`
      <div class="backdrop" @click=${(e) => {
      e.target === e.currentTarget && this._close();
    }}>
        <div class="modal" @click=${(e) => e.stopPropagation()}>
          <div class="modal-header">
            <span class="modal-title">Change avatar — ${this.memberName}</span>
            <button class="close-btn" @click=${this._close}>✕</button>
          </div>

          <div class="mode-tabs">
            <button
              class="mode-tab ${this._mode === "emoji" ? "active" : ""}"
              @click=${() => {
      this._mode = "emoji", this._error = null;
    }}
            >Emoji</button>
            <button
              class="mode-tab ${this._mode === "upload" ? "active" : ""}"
              @click=${() => {
      this._mode = "upload", this._error = null;
    }}
            >Upload photo</button>
          </div>

          ${this._mode === "emoji" ? this._renderEmojiMode() : this._renderUploadMode()}

          ${this._error ? l`<div class="error-msg">${this._error}</div>` : ""}

          <div class="actions">
            <button class="btn btn-secondary" @click=${this._close}>Cancel</button>
            <button
              class="btn btn-primary"
              ?disabled=${this._submitting}
              @click=${this._submit}
            >${this._submitting ? "Saving…" : "Save"}</button>
          </div>
        </div>
      </div>
    `;
  }
  _renderEmojiMode() {
    return l`
      <div class="emoji-grid">
        ${Ls.map(
      (e) => l`
            <button
              class="emoji-btn ${this._selectedEmoji === e ? "selected" : ""}"
              @click=${() => this._selectEmoji(e)}
              title=${e}
            >${e}</button>
          `
    )}
      </div>
    `;
  }
  _renderUploadMode() {
    return l`
      <div class="upload-area">
        ${this._previewUrl ? l`<img class="preview" src=${this._previewUrl} alt="Preview" />` : ""}
        <label class="file-input-label" for="avatar-file-input">
          ${this._selectedFile ? this._selectedFile.name : "Click to choose a PNG, JPEG, or WebP (max 2 MB)"}
        </label>
        <input
          type="file"
          id="avatar-file-input"
          accept="image/png,image/jpeg,image/webp"
          @change=${this._onFileChange}
        />
      </div>
    `;
  }
};
H.styles = [
  M,
  b`
      :host {
        display: block;
      }
      .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal {
        background: var(--card-background-color, #fff);
        border-radius: var(--lucarne-radius-lg);
        padding: var(--lucarne-spacing-lg);
        width: min(400px, 90vw);
        max-height: 80vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-md);
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      }
      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .modal-title {
        font-size: var(--lucarne-fs-lg);
        font-weight: 600;
        color: var(--lucarne-on-surface);
      }
      .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        color: var(--lucarne-on-surface-muted);
        padding: 4px;
      }
      .mode-tabs {
        display: flex;
        border-bottom: 1px solid rgba(0,0,0,0.1);
      }
      .mode-tab {
        flex: 1;
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-md);
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        transition: all 0.15s;
      }
      .mode-tab.active {
        border-bottom-color: var(--primary-color);
        color: var(--primary-color);
        font-weight: 600;
      }
      .emoji-grid {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 4px;
      }
      .emoji-btn {
        background: none;
        border: 1px solid transparent;
        border-radius: var(--lucarne-radius-sm);
        font-size: 1.4rem;
        cursor: pointer;
        padding: 4px;
        text-align: center;
        transition: background 0.1s;
      }
      .emoji-btn:hover {
        background: rgba(0,0,0,0.05);
      }
      .emoji-btn.selected {
        border-color: var(--primary-color);
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
      }
      .upload-area {
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-sm);
      }
      .file-input-label {
        display: block;
        padding: var(--lucarne-spacing-md);
        border: 2px dashed rgba(0,0,0,0.2);
        border-radius: var(--lucarne-radius-md);
        text-align: center;
        cursor: pointer;
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        transition: border-color 0.15s;
      }
      .file-input-label:hover {
        border-color: var(--primary-color);
      }
      input[type='file'] {
        display: none;
      }
      .preview {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 50%;
        border: 2px solid var(--primary-color);
        align-self: center;
      }
      .error-msg {
        color: var(--error-color, #b00020);
        font-size: var(--lucarne-fs-sm);
        padding: var(--lucarne-spacing-xs) 0;
      }
      .actions {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        justify-content: flex-end;
        margin-top: var(--lucarne-spacing-xs);
      }
      .btn {
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-lg);
        border-radius: var(--lucarne-radius-sm);
        border: none;
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        font-weight: 500;
        transition: opacity 0.15s;
      }
      .btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .btn-primary {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .btn-secondary {
        background: transparent;
        border: 1px solid rgba(0,0,0,0.2);
        color: var(--lucarne-on-surface);
      }
    `
];
Y([
  p({ attribute: !1 })
], H.prototype, "hass", 2);
Y([
  p()
], H.prototype, "memberSlug", 2);
Y([
  p()
], H.prototype, "memberName", 2);
Y([
  h()
], H.prototype, "_mode", 2);
Y([
  h()
], H.prototype, "_selectedEmoji", 2);
Y([
  h()
], H.prototype, "_selectedFile", 2);
Y([
  h()
], H.prototype, "_previewUrl", 2);
Y([
  h()
], H.prototype, "_error", 2);
Y([
  h()
], H.prototype, "_submitting", 2);
H = Y([
  w("lucarne-avatar-upload-modal")
], H);
var Us = Object.defineProperty, Fs = Object.getOwnPropertyDescriptor, Ue = (e, t, r, s) => {
  for (var a = s > 1 ? void 0 : s ? Fs(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (s ? i(t, r, a) : i(a)) || a);
  return s && a && Us(t, r, a), a;
};
let ce = class extends v {
  constructor() {
    super(...arguments), this._familyState = null, this._avatarModalMember = null;
  }
  setConfig(e) {
    this._config = e;
  }
  connectedCallback() {
    super.connectedCallback(), this.hass && !this._unsubFamily && (this._unsubFamily = Pe(this.hass, (e) => {
      this._familyState = e;
    }));
  }
  updated(e) {
    super.updated(e), e.has("hass") && this.hass && !this._unsubFamily && (this._unsubFamily = Pe(this.hass, (t) => {
      this._familyState = t;
    }));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._unsubFamily) == null || e.call(this), this._unsubFamily = void 0;
  }
  _fire(e) {
    const t = { ...e };
    delete t.kids, Array.isArray(t.members) || (t.members = []), ft(this, "config-changed", { config: t });
  }
  _titleChanged(e) {
    const t = e.target.value;
    this._fire({ ...this._config, title: t || void 0 });
  }
  _memberToggled(e, t) {
    var s;
    const r = [...((s = this._config) == null ? void 0 : s.members) ?? []];
    if (t)
      r.includes(e) || r.push(e);
    else {
      const a = r.indexOf(e);
      a >= 0 && r.splice(a, 1);
    }
    this._fire({ ...this._config, members: r });
  }
  _toggleChanged(e, t) {
    const r = t.target.checked;
    this._fire({ ...this._config, [e]: r });
  }
  render() {
    if (!this._config) return l``;
    if (this._familyState !== null && this._familyState.integrationError !== null)
      return l`
        <div class="error-block">
          Install the Lucarne Family integration first.
          <a href="/config/integrations/dashboard#search=lucarne" target="_blank"
            >Open Integrations</a
          >
        </div>
      `;
    if (this._familyState === null)
      return l`<div class="loading">Loading members…</div>`;
    const e = [...this._familyState.members, Ee], t = this._config.members ?? [];
    return l`
      <div class="section-label">General</div>
      <input
        id="ed-title"
        type="text"
        placeholder="Card title (default: Chores)"
        .value=${this._config.title ?? ""}
        @change=${this._titleChanged}
      />

      <div class="section-label">Members</div>
      ${e.map(
      (r) => l`
          <div class="member-row">
            <input
              type="checkbox"
              id="member-${r.slug}"
              .checked=${t.includes(r.slug)}
              @change=${(s) => this._memberToggled(r.slug, s.target.checked)}
            />
            <div class="member-avatar">
              ${r.avatar && r.avatar.startsWith("/local/") ? l`<img src=${r.avatar} alt=${r.name} style="width:100%;height:100%;object-fit:cover;" />` : l`${r.avatar ?? r.name[0]}`}
            </div>
            <label for="member-${r.slug}">${r.name}</label>
            ${r.slug !== "household" ? l`<button
                  class="change-avatar-btn"
                  @click=${() => {
        this._avatarModalMember = r;
      }}
                >Change</button>` : ""}
          </div>
        `
    )}

      ${this._avatarModalMember ? l`<lucarne-avatar-upload-modal
            .hass=${this.hass}
            .memberSlug=${this._avatarModalMember.slug}
            .memberName=${this._avatarModalMember.name}
            @close=${() => {
      this._avatarModalMember = null;
    }}
            @avatar-changed=${() => {
      this._avatarModalMember = null;
    }}
          ></lucarne-avatar-upload-modal>` : ""}

      <div class="section-label">Display</div>
      ${[
      ["show_routines", "Show routines"],
      ["show_tasks", "Show tasks"],
      ["show_streak", "Show streak"]
    ].map(
      ([r, s]) => l`
          <div class="toggle-row">
            <input
              type="checkbox"
              id="ed-${r}"
              .checked=${this._config[r] ?? !0}
              @change=${(a) => this._toggleChanged(r, a)}
            />
            <label for="ed-${r}">${s}</label>
          </div>
        `
    )}
    `;
  }
};
ce.styles = [
  M,
  b`
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
      .member-row,
      .toggle-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        padding: var(--lucarne-spacing-xs) 0;
      }
      .member-row label,
      .toggle-row label {
        font-size: var(--lucarne-fs-md);
        color: var(--lucarne-on-surface);
        cursor: pointer;
        flex: 1;
      }
      .member-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid rgba(0,0,0,0.1);
        flex-shrink: 0;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.05);
        overflow: hidden;
      }
      .change-avatar-btn {
        background: none;
        border: 1px solid rgba(0,0,0,0.15);
        border-radius: var(--lucarne-radius-sm);
        padding: 2px 8px;
        font-size: var(--lucarne-fs-xs, 0.75rem);
        cursor: pointer;
        color: var(--lucarne-on-surface-muted);
        flex-shrink: 0;
      }
      .change-avatar-btn:hover {
        background: rgba(0,0,0,0.05);
      }
      input[type='checkbox'] {
        width: 18px;
        height: 18px;
        cursor: pointer;
        flex-shrink: 0;
      }
      input[type='text'] {
        width: 100%;
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-md);
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: var(--lucarne-radius-sm);
        font-size: var(--lucarne-fs-md);
        box-sizing: border-box;
      }
      .loading {
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        text-align: center;
        padding: var(--lucarne-spacing-lg);
      }
      .error-block {
        padding: var(--lucarne-spacing-md);
        color: var(--lucarne-on-surface);
        font-size: var(--lucarne-fs-sm);
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-xs);
      }
      .error-block a {
        color: var(--primary-color);
      }
    `
];
Ue([
  p({ attribute: !1 })
], ce.prototype, "hass", 2);
Ue([
  h()
], ce.prototype, "_config", 2);
Ue([
  h()
], ce.prototype, "_familyState", 2);
Ue([
  h()
], ce.prototype, "_avatarModalMember", 2);
ce = Ue([
  w("lucarne-chores-card-editor")
], ce);
//# sourceMappingURL=ha-lucarne.js.map
