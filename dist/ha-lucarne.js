/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ke = globalThis, dt = Ke.ShadowRoot && (Ke.ShadyCSS === void 0 || Ke.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ut = Symbol(), xt = /* @__PURE__ */ new WeakMap();
let ir = class {
  constructor(t, r, n) {
    if (this._$cssResult$ = !0, n !== ut) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = r;
  }
  get styleSheet() {
    let t = this.o;
    const r = this.t;
    if (dt && t === void 0) {
      const n = r !== void 0 && r.length === 1;
      n && (t = xt.get(r)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && xt.set(r, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Sr = (e) => new ir(typeof e == "string" ? e : e + "", void 0, ut), b = (e, ...t) => {
  const r = e.length === 1 ? e[0] : t.reduce((n, a, s) => n + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + e[s + 1], e[0]);
  return new ir(r, e, ut);
}, Mr = (e, t) => {
  if (dt) e.adoptedStyleSheets = t.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of t) {
    const n = document.createElement("style"), a = Ke.litNonce;
    a !== void 0 && n.setAttribute("nonce", a), n.textContent = r.cssText, e.appendChild(n);
  }
}, kt = dt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let r = "";
  for (const n of t.cssRules) r += n.cssText;
  return Sr(r);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Tr, defineProperty: Pr, getOwnPropertyDescriptor: Or, getOwnPropertyNames: Ar, getOwnPropertySymbols: Ir, getPrototypeOf: Rr } = Object, G = globalThis, Ct = G.trustedTypes, zr = Ct ? Ct.emptyScript : "", nt = G.reactiveElementPolyfillSupport, Ee = (e, t) => e, Ge = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? zr : null;
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
} }, ht = (e, t) => !Tr(e, t), Et = { attribute: !0, type: String, converter: Ge, reflect: !1, useDefault: !1, hasChanged: ht };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), G.litPropertyMetadata ?? (G.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let pe = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, r = Et) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(t, r), !r.noAccessor) {
      const n = Symbol(), a = this.getPropertyDescriptor(t, n, r);
      a !== void 0 && Pr(this.prototype, t, a);
    }
  }
  static getPropertyDescriptor(t, r, n) {
    const { get: a, set: s } = Or(this.prototype, t) ?? { get() {
      return this[r];
    }, set(i) {
      this[r] = i;
    } };
    return { get: a, set(i) {
      const o = a == null ? void 0 : a.call(this);
      s == null || s.call(this, i), this.requestUpdate(t, o, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Et;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ee("elementProperties"))) return;
    const t = Rr(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ee("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ee("properties"))) {
      const r = this.properties, n = [...Ar(r), ...Ir(r)];
      for (const a of n) this.createProperty(a, r[a]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const r = litPropertyMetadata.get(t);
      if (r !== void 0) for (const [n, a] of r) this.elementProperties.set(n, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, n] of this.elementProperties) {
      const a = this._$Eu(r, n);
      a !== void 0 && this._$Eh.set(a, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const r = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const a of n) r.unshift(kt(a));
    } else t !== void 0 && r.push(kt(t));
    return r;
  }
  static _$Eu(t, r) {
    const n = r.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const n of r.keys()) this.hasOwnProperty(n) && (t.set(n, this[n]), delete this[n]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Mr(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((r) => {
      var n;
      return (n = r.hostConnected) == null ? void 0 : n.call(r);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((r) => {
      var n;
      return (n = r.hostDisconnected) == null ? void 0 : n.call(r);
    });
  }
  attributeChangedCallback(t, r, n) {
    this._$AK(t, n);
  }
  _$ET(t, r) {
    var s;
    const n = this.constructor.elementProperties.get(t), a = this.constructor._$Eu(t, n);
    if (a !== void 0 && n.reflect === !0) {
      const i = (((s = n.converter) == null ? void 0 : s.toAttribute) !== void 0 ? n.converter : Ge).toAttribute(r, n.type);
      this._$Em = t, i == null ? this.removeAttribute(a) : this.setAttribute(a, i), this._$Em = null;
    }
  }
  _$AK(t, r) {
    var s, i;
    const n = this.constructor, a = n._$Eh.get(t);
    if (a !== void 0 && this._$Em !== a) {
      const o = n.getPropertyOptions(a), c = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((s = o.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? o.converter : Ge;
      this._$Em = a;
      const d = c.fromAttribute(r, o.type);
      this[a] = d ?? ((i = this._$Ej) == null ? void 0 : i.get(a)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, r, n, a = !1, s) {
    var i;
    if (t !== void 0) {
      const o = this.constructor;
      if (a === !1 && (s = this[t]), n ?? (n = o.getPropertyOptions(t)), !((n.hasChanged ?? ht)(s, r) || n.useDefault && n.reflect && s === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(o._$Eu(t, n)))) return;
      this.C(t, r, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, r, { useDefault: n, reflect: a, wrapped: s }, i) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, i ?? r ?? this[t]), s !== !0 || i !== void 0) || (this._$AL.has(t) || (this.hasUpdated || n || (r = void 0), this._$AL.set(t, r)), a === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var n;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [s, i] of this._$Ep) this[s] = i;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [s, i] of a) {
        const { wrapped: o } = i, c = this[s];
        o !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, i, c);
      }
    }
    let t = !1;
    const r = this._$AL;
    try {
      t = this.shouldUpdate(r), t ? (this.willUpdate(r), (n = this._$EO) == null || n.forEach((a) => {
        var s;
        return (s = a.hostUpdate) == null ? void 0 : s.call(a);
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
    (r = this._$EO) == null || r.forEach((n) => {
      var a;
      return (a = n.hostUpdated) == null ? void 0 : a.call(n);
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
pe.elementStyles = [], pe.shadowRootOptions = { mode: "open" }, pe[Ee("elementProperties")] = /* @__PURE__ */ new Map(), pe[Ee("finalized")] = /* @__PURE__ */ new Map(), nt == null || nt({ ReactiveElement: pe }), (G.reactiveElementVersions ?? (G.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const De = globalThis, Dt = (e) => e, Je = De.trustedTypes, St = Je ? Je.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, or = "$lit$", X = `lit$${Math.random().toFixed(9).slice(2)}$`, lr = "?" + X, Nr = `<${lr}>`, ie = document, Te = () => ie.createComment(""), Pe = (e) => e === null || typeof e != "object" && typeof e != "function", pt = Array.isArray, jr = (e) => pt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", st = `[ 	
\f\r]`, ke = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Mt = /-->/g, Tt = />/g, ae = RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Pt = /'/g, Ot = /"/g, cr = /^(?:script|style|textarea|title)$/i, dr = (e) => (t, ...r) => ({ _$litType$: e, strings: t, values: r }), l = dr(1), te = dr(2), oe = Symbol.for("lit-noChange"), P = Symbol.for("lit-nothing"), At = /* @__PURE__ */ new WeakMap(), ne = ie.createTreeWalker(ie, 129);
function ur(e, t) {
  if (!pt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return St !== void 0 ? St.createHTML(t) : t;
}
const Lr = (e, t) => {
  const r = e.length - 1, n = [];
  let a, s = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = ke;
  for (let o = 0; o < r; o++) {
    const c = e[o];
    let d, u, m = -1, g = 0;
    for (; g < c.length && (i.lastIndex = g, u = i.exec(c), u !== null); ) g = i.lastIndex, i === ke ? u[1] === "!--" ? i = Mt : u[1] !== void 0 ? i = Tt : u[2] !== void 0 ? (cr.test(u[2]) && (a = RegExp("</" + u[2], "g")), i = ae) : u[3] !== void 0 && (i = ae) : i === ae ? u[0] === ">" ? (i = a ?? ke, m = -1) : u[1] === void 0 ? m = -2 : (m = i.lastIndex - u[2].length, d = u[1], i = u[3] === void 0 ? ae : u[3] === '"' ? Ot : Pt) : i === Ot || i === Pt ? i = ae : i === Mt || i === Tt ? i = ke : (i = ae, a = void 0);
    const f = i === ae && e[o + 1].startsWith("/>") ? " " : "";
    s += i === ke ? c + Nr : m >= 0 ? (n.push(d), c.slice(0, m) + or + c.slice(m) + X + f) : c + X + (m === -2 ? o : f);
  }
  return [ur(e, s + (e[r] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class Oe {
  constructor({ strings: t, _$litType$: r }, n) {
    let a;
    this.parts = [];
    let s = 0, i = 0;
    const o = t.length - 1, c = this.parts, [d, u] = Lr(t, r);
    if (this.el = Oe.createElement(d, n), ne.currentNode = this.el.content, r === 2 || r === 3) {
      const m = this.el.content.firstChild;
      m.replaceWith(...m.childNodes);
    }
    for (; (a = ne.nextNode()) !== null && c.length < o; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const m of a.getAttributeNames()) if (m.endsWith(or)) {
          const g = u[i++], f = a.getAttribute(m).split(X), _ = /([.?@])?(.*)/.exec(g);
          c.push({ type: 1, index: s, name: _[2], strings: f, ctor: _[1] === "." ? Ur : _[1] === "?" ? Fr : _[1] === "@" ? Br : et }), a.removeAttribute(m);
        } else m.startsWith(X) && (c.push({ type: 6, index: s }), a.removeAttribute(m));
        if (cr.test(a.tagName)) {
          const m = a.textContent.split(X), g = m.length - 1;
          if (g > 0) {
            a.textContent = Je ? Je.emptyScript : "";
            for (let f = 0; f < g; f++) a.append(m[f], Te()), ne.nextNode(), c.push({ type: 2, index: ++s });
            a.append(m[g], Te());
          }
        }
      } else if (a.nodeType === 8) if (a.data === lr) c.push({ type: 2, index: s });
      else {
        let m = -1;
        for (; (m = a.data.indexOf(X, m + 1)) !== -1; ) c.push({ type: 7, index: s }), m += X.length - 1;
      }
      s++;
    }
  }
  static createElement(t, r) {
    const n = ie.createElement("template");
    return n.innerHTML = t, n;
  }
}
function fe(e, t, r = e, n) {
  var i, o;
  if (t === oe) return t;
  let a = n !== void 0 ? (i = r._$Co) == null ? void 0 : i[n] : r._$Cl;
  const s = Pe(t) ? void 0 : t._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== s && ((o = a == null ? void 0 : a._$AO) == null || o.call(a, !1), s === void 0 ? a = void 0 : (a = new s(e), a._$AT(e, r, n)), n !== void 0 ? (r._$Co ?? (r._$Co = []))[n] = a : r._$Cl = a), a !== void 0 && (t = fe(e, a._$AS(e, t.values), a, n)), t;
}
class Hr {
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
    const { el: { content: r }, parts: n } = this._$AD, a = ((t == null ? void 0 : t.creationScope) ?? ie).importNode(r, !0);
    ne.currentNode = a;
    let s = ne.nextNode(), i = 0, o = 0, c = n[0];
    for (; c !== void 0; ) {
      if (i === c.index) {
        let d;
        c.type === 2 ? d = new Le(s, s.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(s, c.name, c.strings, this, t) : c.type === 6 && (d = new Wr(s, this, t)), this._$AV.push(d), c = n[++o];
      }
      i !== (c == null ? void 0 : c.index) && (s = ne.nextNode(), i++);
    }
    return ne.currentNode = ie, a;
  }
  p(t) {
    let r = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, r), r += n.strings.length - 2) : n._$AI(t[r])), r++;
  }
}
class Le {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, r, n, a) {
    this.type = 2, this._$AH = P, this._$AN = void 0, this._$AA = t, this._$AB = r, this._$AM = n, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
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
    t = fe(this, t, r), Pe(t) ? t === P || t == null || t === "" ? (this._$AH !== P && this._$AR(), this._$AH = P) : t !== this._$AH && t !== oe && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : jr(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== P && Pe(this._$AH) ? this._$AA.nextSibling.data = t : this.T(ie.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var s;
    const { values: r, _$litType$: n } = t, a = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = Oe.createElement(ur(n.h, n.h[0]), this.options)), n);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === a) this._$AH.p(r);
    else {
      const i = new Hr(a, this), o = i.u(this.options);
      i.p(r), this.T(o), this._$AH = i;
    }
  }
  _$AC(t) {
    let r = At.get(t.strings);
    return r === void 0 && At.set(t.strings, r = new Oe(t)), r;
  }
  k(t) {
    pt(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let n, a = 0;
    for (const s of t) a === r.length ? r.push(n = new Le(this.O(Te()), this.O(Te()), this, this.options)) : n = r[a], n._$AI(s), a++;
    a < r.length && (this._$AR(n && n._$AB.nextSibling, a), r.length = a);
  }
  _$AR(t = this._$AA.nextSibling, r) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, r); t !== this._$AB; ) {
      const a = Dt(t).nextSibling;
      Dt(t).remove(), t = a;
    }
  }
  setConnected(t) {
    var r;
    this._$AM === void 0 && (this._$Cv = t, (r = this._$AP) == null || r.call(this, t));
  }
}
class et {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, r, n, a, s) {
    this.type = 1, this._$AH = P, this._$AN = void 0, this.element = t, this.name = r, this._$AM = a, this.options = s, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = P;
  }
  _$AI(t, r = this, n, a) {
    const s = this.strings;
    let i = !1;
    if (s === void 0) t = fe(this, t, r, 0), i = !Pe(t) || t !== this._$AH && t !== oe, i && (this._$AH = t);
    else {
      const o = t;
      let c, d;
      for (t = s[0], c = 0; c < s.length - 1; c++) d = fe(this, o[n + c], r, c), d === oe && (d = this._$AH[c]), i || (i = !Pe(d) || d !== this._$AH[c]), d === P ? t = P : t !== P && (t += (d ?? "") + s[c + 1]), this._$AH[c] = d;
    }
    i && !a && this.j(t);
  }
  j(t) {
    t === P ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ur extends et {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === P ? void 0 : t;
  }
}
class Fr extends et {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== P);
  }
}
class Br extends et {
  constructor(t, r, n, a, s) {
    super(t, r, n, a, s), this.type = 5;
  }
  _$AI(t, r = this) {
    if ((t = fe(this, t, r, 0) ?? P) === oe) return;
    const n = this._$AH, a = t === P && n !== P || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, s = t !== P && (n === P || a);
    a && this.element.removeEventListener(this.name, this, n), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var r;
    typeof this._$AH == "function" ? this._$AH.call(((r = this.options) == null ? void 0 : r.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Wr {
  constructor(t, r, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    fe(this, t);
  }
}
const it = De.litHtmlPolyfillSupport;
it == null || it(Oe, Le), (De.litHtmlVersions ?? (De.litHtmlVersions = [])).push("3.3.3");
const Yr = (e, t, r) => {
  const n = (r == null ? void 0 : r.renderBefore) ?? t;
  let a = n._$litPart$;
  if (a === void 0) {
    const s = (r == null ? void 0 : r.renderBefore) ?? null;
    n._$litPart$ = a = new Le(t.insertBefore(Te(), s), s, void 0, r ?? {});
  }
  return a._$AI(e), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = globalThis;
let v = class extends pe {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Yr(r, this.renderRoot, this.renderOptions);
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
    return oe;
  }
};
var sr;
v._$litElement$ = !0, v.finalized = !0, (sr = se.litElementHydrateSupport) == null || sr.call(se, { LitElement: v });
const ot = se.litElementPolyfillSupport;
ot == null || ot({ LitElement: v });
(se.litElementVersions ?? (se.litElementVersions = [])).push("4.2.2");
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
const Vr = { attribute: !0, type: String, converter: Ge, reflect: !1, hasChanged: ht }, qr = (e = Vr, t, r) => {
  const { kind: n, metadata: a } = r;
  let s = globalThis.litPropertyMetadata.get(a);
  if (s === void 0 && globalThis.litPropertyMetadata.set(a, s = /* @__PURE__ */ new Map()), n === "setter" && ((e = Object.create(e)).wrapped = !0), s.set(r.name, e), n === "accessor") {
    const { name: i } = r;
    return { set(o) {
      const c = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(i, c, e, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(i, void 0, e, o), o;
    } };
  }
  if (n === "setter") {
    const { name: i } = r;
    return function(o) {
      const c = this[i];
      t.call(this, o), this.requestUpdate(i, c, e, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function p(e) {
  return (t, r) => typeof r == "object" ? qr(e, t, r) : ((n, a, s) => {
    const i = a.hasOwnProperty(s);
    return a.constructor.createProperty(s, n), i ? Object.getOwnPropertyDescriptor(a, s) : void 0;
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
const Kr = (e, t, r) => (r.configurable = !0, r.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, r), r);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function hr(e, t) {
  return (r, n, a) => {
    const s = (i) => {
      var o;
      return ((o = i.renderRoot) == null ? void 0 : o.querySelector(e)) ?? null;
    };
    return Kr(r, n, { get() {
      return s(this);
    } });
  };
}
const D = b`
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
function pr(e, t, r) {
  let n, a = !1;
  return e.connection.subscribeMessage(
    (s) => {
      var i, o;
      (o = (i = s.variables) == null ? void 0 : i.trigger) != null && o.to_state && r(s.variables.trigger.to_state);
    },
    { type: "subscribe_trigger", trigger: { platform: "state", entity_id: t } }
  ).then((s) => {
    a ? s() : n = s;
  }), () => {
    a = !0, n == null || n();
  };
}
function It(e) {
  return typeof e == "string" ? e : e && typeof e == "object" ? e.dateTime ?? e.date ?? "" : "";
}
function Xr(e) {
  const t = {
    start: It(e.start),
    end: It(e.end),
    summary: e.summary ?? ""
  };
  return e.description && (t.description = e.description), e.location && (t.location = e.location), e.uid && (t.uid = e.uid), e.recurrence_id && (t.recurrence_id = e.recurrence_id), e.rrule && (t.rrule = e.rrule), t;
}
async function mr(e, t, r, n) {
  const a = /* @__PURE__ */ new Set(), s = encodeURIComponent(r.toISOString()), i = encodeURIComponent(n.toISOString()), o = await Promise.all(
    t.map(
      (c) => e.callApi(
        "GET",
        `calendars/${encodeURIComponent(c)}?start=${s}&end=${i}`
      ).then((d) => [c, d.map(Xr)]).catch((d) => (console.warn(`[lucarne] GET /api/calendars/${c} failed:`, d), a.add(c), [c, []]))
    )
  );
  return { events: new Map(o), failed: a };
}
async function Gr(e, t, r, n, a) {
  await e.connection.sendMessagePromise({
    type: "calendar/event/delete",
    entity_id: t,
    uid: r,
    recurrence_id: n,
    recurrence_range: a
  });
}
const Jr = 2;
function Qr(e, t) {
  var n, a;
  const r = (a = (n = e.states[t]) == null ? void 0 : n.attributes) == null ? void 0 : a.supported_features;
  return typeof r != "number" ? !1 : (r & Jr) !== 0;
}
function ct(e, t, r) {
  const n = async () => {
    var a, s;
    try {
      const i = await e.connection.sendMessagePromise({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: {},
        target: { entity_id: t },
        return_response: !0
      });
      r(((s = (a = i == null ? void 0 : i.response) == null ? void 0 : a[t]) == null ? void 0 : s.items) ?? []);
    } catch (i) {
      console.warn(`[lucarne] todo.get_items failed for ${t}:`, i), r([]);
    }
  };
  return n(), pr(e, t, () => n());
}
function Zr(e) {
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
    const n = t.getRootNode();
    t = n instanceof ShadowRoot ? n.host : null;
  }
  return !1;
}
function ea(e) {
  let t = e.parentElement;
  for (; t && !t.style.getPropertyValue("--column-size"); )
    t = t.parentElement;
  return (t == null ? void 0 : t.parentElement) ?? null;
}
function fr(e) {
  if (!Zr(e)) return null;
  const t = ea(e);
  if (!t) return null;
  const r = t.style.getPropertyValue("--grid-column-count"), n = () => {
    t.style.getPropertyValue("--grid-column-count") !== "1" && t.style.setProperty("--grid-column-count", "1");
  };
  n();
  const a = new MutationObserver(n);
  return a.observe(t, { attributes: !0, attributeFilter: ["style"] }), {
    uninstall() {
      a.disconnect(), r ? t.style.setProperty("--grid-column-count", r) : t.style.removeProperty("--grid-column-count");
    }
  };
}
const Se = {
  slug: "household",
  name: "Household",
  color: "var(--primary-color)",
  avatar: null,
  todo_entity_id: "todo.lucarne_household",
  streak_counter_id: ""
}, ta = [
  "lucarne_family_task_added",
  "lucarne_family_task_completed",
  "lucarne_family_task_deleted",
  "lucarne_family_task_metadata_updated",
  "lucarne_family_task_toggled",
  "lucarne_family_all_routines_done",
  "lucarne_family_member_updated",
  "lucarne_family_avatar_uploaded"
];
function Rt(e, t, r) {
  return e.map((n) => {
    const s = r.get(n.uid) ?? {
      item_uid: n.uid,
      member_slug: t,
      assignee_slug: "",
      type: "chore",
      recurrence: "",
      icon: "",
      source: "manual"
    };
    return {
      uid: n.uid,
      summary: n.summary,
      status: n.status,
      due: n.due ?? null,
      description: n.description ?? "",
      metadata: s
    };
  });
}
function Ae(e, t) {
  let r = !1;
  const n = [];
  let a = /* @__PURE__ */ new Map(), s = [];
  const i = /* @__PURE__ */ new Map();
  let o = /* @__PURE__ */ new Map(), c = "", d = "", u = null, m = null;
  function g() {
    if (r) return;
    const y = /* @__PURE__ */ new Map();
    for (const T of s) {
      const H = i.get(T.todo_entity_id) ?? [];
      y.set(T.slug, Rt(H, T.slug, a));
    }
    const C = i.get("todo.lucarne_household") ?? [];
    y.set("household", Rt(C, "household", a)), t({ members: s, tasksByMember: y, streakByMember: new Map(o), resetTime: c, streakCheckTime: d, integrationError: m });
  }
  async function f() {
    var y, C;
    try {
      const T = await e.connection.sendMessagePromise({
        type: "lucarne_family/get_family"
      });
      if (r) return;
      const H = /* @__PURE__ */ new Map();
      for (const O of T.task_metadata ?? [])
        H.set(O.item_uid, O);
      a = H, c = T.reset_time ?? "", d = T.streak_check_time ?? "", s = (T.members ?? []).filter((O) => O.todo_entity_id ? !0 : (console.debug(`[lucarne] skipping member ${O.slug}: no todo_entity_id yet`), !1)), m = null, o = /* @__PURE__ */ new Map(), n.forEach((O) => O()), n.length = 0;
      for (const O of s) {
        const Er = ct(e, O.todo_entity_id, (Be) => {
          i.set(O.todo_entity_id, Be), g();
        });
        if (n.push(Er), O.streak_counter_id) {
          const Be = (C = (y = e.states) == null ? void 0 : y[O.streak_counter_id]) == null ? void 0 : C.state;
          if (Be !== void 0) {
            const We = parseInt(Be, 10);
            o.set(O.slug, isNaN(We) ? 0 : We);
          }
          const Dr = pr(e, O.streak_counter_id, (We) => {
            const $t = parseInt(We.state, 10);
            o.set(O.slug, isNaN($t) ? 0 : $t), g();
          });
          n.push(Dr);
        }
      }
      const Cr = ct(e, "todo.lucarne_household", (O) => {
        i.set("todo.lucarne_household", O), g();
      });
      n.push(Cr), g();
    } catch (T) {
      console.warn("[lucarne] get_family failed — integration may not be installed:", T), r || (m = T instanceof Error ? T : new Error(String(T)), n.forEach((H) => H()), n.length = 0, s = [], a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), i.clear(), c = "", d = "", g());
    }
  }
  function _() {
    u === null && (u = setTimeout(() => {
      u = null, f();
    }, 1e3));
  }
  const x = [];
  for (const y of ta)
    e.connection.subscribeEvents(() => {
      _();
    }, y).then((C) => {
      r ? C() : x.push(C);
    }).catch((C) => {
      console.debug(`[lucarne] could not subscribe to ${y}:`, C);
    });
  return f(), () => {
    r = !0, u !== null && clearTimeout(u), n.forEach((y) => y()), x.forEach((y) => y());
  };
}
const k = {
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
var ra = Object.defineProperty, aa = Object.getOwnPropertyDescriptor, tt = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? aa(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && ra(t, r, a), a;
};
function Me(e) {
  return e.length === 10 ? /* @__PURE__ */ new Date(e + "T00:00:00") : new Date(e);
}
function na(e, t, r) {
  return e.filter((n) => Me(n.end) > t).sort((n, a) => Me(n.start).getTime() - Me(a.start).getTime()).slice(0, r);
}
function sa(e, t, r) {
  const n = e.getTime() - r.getTime();
  if (e <= r && r < t) return k.timePillNow;
  if (n > 0 && n < 60 * 60 * 1e3) {
    const d = Math.round(n / 6e4);
    return k.timePillInMinutes(d);
  }
  if (n > 0 && n < 2 * 60 * 60 * 1e3) {
    const d = Math.round(n / 36e5);
    return k.timePillInHours(d);
  }
  const s = e.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (e.toDateString() === r.toDateString()) return s;
  const o = new Date(r);
  return o.setDate(r.getDate() + 1), e.toDateString() === o.toDateString() ? k.timePillTomorrow(s) : `${e.toLocaleDateString("en", { weekday: "short" })} ${s}`;
}
function ia(e) {
  return e.start.length === 10 && e.end.length === 10;
}
let ge = class extends v {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.limit = 5;
  }
  render() {
    const e = /* @__PURE__ */ new Date(), t = na(this.events, e, this.limit);
    return t.length === 0 ? l`<div class="empty-state">${k.nothingOnCalendar}</div>` : l`
      ${t.map((r) => {
      const n = Me(r.start), a = Me(r.end), s = n <= e && e < a, i = ia(r) ? "all day" : sa(n, a, e), o = this._colorForEvent(r);
      return l`
          <div class="event-row">
            <div class="time-pill ${s ? "now" : ""}">
              ${s ? l`<span class="pulse-dot"></span>` : ""} ${i}
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
ge.styles = [
  D,
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
tt([
  p({ type: Array })
], ge.prototype, "events", 2);
tt([
  p({ type: Object })
], ge.prototype, "calendarColors", 2);
tt([
  p({ type: Number })
], ge.prototype, "limit", 2);
ge = tt([
  w("lucarne-agenda-strip")
], ge);
const zt = te`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`, me = te`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>`, Ce = te`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`, Nt = te`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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
</svg>`, oa = te`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M4.22 19.78l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="currentColor"/>
  <path d="M20 15h-1.26A6 6 0 1 0 8 20h12a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.7"/>
</svg>`;
te`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="7" r="4"/>
  <path d="M20 21a8 8 0 1 0-16 0"/>
</svg>`;
te`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"/>
</svg>`;
const la = te`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, jt = {
  sunny: zt,
  "clear-night": zt,
  cloudy: me,
  fog: me,
  hail: Ce,
  lightning: Ce,
  "lightning-rainy": Ce,
  partlycloudy: oa,
  pouring: Ce,
  rainy: Ce,
  snowy: Nt,
  "snowy-rainy": Nt,
  windy: me,
  "windy-variant": me,
  exceptional: me
};
function Lt(e) {
  return jt[e] ?? jt[e.toLowerCase()] ?? me;
}
const ca = {
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
  return ca[e.toLowerCase()] ?? "#8aa0b8";
}
function da(e) {
  if (!e.length) return k.dressingTipDefault;
  const t = e[0];
  if (t.condition.toLowerCase().includes("snow"))
    return k.dressingTipBoots;
  const n = t.temperature;
  let a;
  return n < 5 ? a = k.dressingTipHeavyCoat : n < 12 ? a = k.dressingTipCoatScarf : n < 18 ? a = k.dressingTipLightJacket : n < 24 ? a = k.dressingTipTShirt : a = k.dressingTipShorts, (t.precipitation_probability ?? 0) > 50 && (a += k.dressingTipUmbrella), a;
}
var ua = Object.defineProperty, ha = Object.getOwnPropertyDescriptor, mt = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? ha(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && ua(t, r, a), a;
};
let Ie = class extends v {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return l`<div class="empty-state">${k.addWeatherEntity}</div>`;
    const e = this.weatherEntity.attributes, t = e.temperature, r = e.temperature_unit ?? "°C", n = this.weatherEntity.state, a = this.forecast[0], s = this.forecast[1], i = da(this.forecast);
    return l`
      <div class="current">
        <span class="condition-icon" style="color: ${Ht(n)}">${Lt(n)}</span>
        <div class="temp-group">
          <div class="current-temp">${t !== void 0 ? `${Math.round(t)}${r}` : k.errorUnavailable}</div>
          ${a ? l`<div class="high-low">
                ↑${Math.round(a.temperature)}${r}
                ${a.templow !== void 0 ? ` ↓${Math.round(a.templow)}${r}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${s ? l`
            <div class="tomorrow-row">
              <span class="tomorrow-icon" style="color: ${Ht(s.condition)}">${Lt(s.condition)}</span>
              <span>Tomorrow ↑${Math.round(s.temperature)}${r}${s.templow !== void 0 ? ` ↓${Math.round(s.templow)}${r}` : ""}</span>
            </div>
          ` : ""}
      <div class="dressing-tip">
        <span class="dressing-label">Wear:</span>
        ${i}
      </div>
    `;
  }
};
Ie.styles = [
  D,
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
mt([
  p({ attribute: !1 })
], Ie.prototype, "weatherEntity", 2);
mt([
  p({ type: Array })
], Ie.prototype, "forecast", 2);
Ie = mt([
  w("lucarne-weather-block")
], Ie);
var pa = Object.defineProperty, ma = Object.getOwnPropertyDescriptor, ft = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? ma(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && pa(t, r, a), a;
};
const fa = 500;
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
    }, fa), e.currentTarget.setPointerCapture(e.pointerId);
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
        @keydown=${(n) => {
      (n.key === "Enter" || n.key === " ") && !n.repeat && (n.preventDefault(), this._onClick());
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
      return isNaN(t.getTime()) ? e : t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (e.length === 10) {
      const t = /* @__PURE__ */ new Date(e + "T00:00:00");
      if (!isNaN(t.getTime()))
        return t.toLocaleDateString("en", { month: "short", day: "numeric" });
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
ft([
  p({ attribute: !1 })
], Re.prototype, "task", 2);
ft([
  p()
], Re.prototype, "memberColor", 2);
Re = ft([
  w("lucarne-task-row")
], Re);
var ga = Object.defineProperty, va = Object.getOwnPropertyDescriptor, be = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? va(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && ga(t, r, a), a;
};
const gr = "household";
function _a(e) {
  return {
    uid: e.uid,
    summary: e.summary,
    status: e.status,
    due: e.due ?? null,
    description: e.description ?? "",
    metadata: {
      item_uid: e.uid,
      member_slug: gr,
      assignee_slug: "",
      type: "chore",
      recurrence: "",
      icon: "",
      source: "manual"
    }
  };
}
let J = class extends v {
  constructor() {
    super(...arguments), this.items = [], this.integrationMode = !1, this.renderableTasks = [], this.members = [];
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
    const t = (this.integrationMode ? this.renderableTasks : this.items.map(_a)).filter((s) => s.status === "needs_action"), r = t.length, n = t.slice(0, 3), a = r - n.length;
    return r === 0 ? l`
        <div class="empty-state">
          <span class="empty-icon">${la}</span>
          ${k.allDone}
        </div>
      ` : l`
      <div class="header">
        ${k.tasksTitle}
        <span class="count-badge">${r}</span>
      </div>
      ${n.map((s) => this._renderTaskLine(s))}
      ${a > 0 ? l`<div class="more-row" @click=${this._handleMoreClick}>
            ${k.moreItems(a)}
          </div>` : ""}
    `;
  }
  _renderTaskLine(e) {
    const t = this._ownerFor(e);
    return l`
      <div class="task-line">
        ${t ? this._renderOwnerAvatar(t) : ""}
        <lucarne-task-row
          .task=${e}
          .memberColor=${(t == null ? void 0 : t.color) ?? "var(--primary-color)"}
        ></lucarne-task-row>
      </div>
    `;
  }
  _renderOwnerAvatar(e) {
    const t = e.avatar;
    if (t && t.startsWith("/local/"))
      return l`
        <div class="owner-avatar" style="background:${e.color}" title="${e.name}">
          <img src="${t}" alt="${e.name}" />
        </div>
      `;
    if (t)
      return l`
        <div class="owner-avatar" style="background:${e.color}" title="${e.name}">
          <span>${t}</span>
        </div>
      `;
    const r = e.name.trim().charAt(0) || "?";
    return l`
      <div class="owner-avatar" style="background:${e.color}" title="${e.name}">
        <span class="initial">${r}</span>
      </div>
    `;
  }
  _ownerFor(e) {
    if (!this.integrationMode) return null;
    const t = e.metadata.member_slug;
    return !t || t === gr ? null : this.members.find((r) => r.slug === t) ?? null;
  }
};
J.styles = [
  D,
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
      .task-line {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
      }
      .task-line + .task-line {
        border-top: 1px solid rgba(0, 0, 0, 0.05);
      }
      .task-line lucarne-task-row {
        flex: 1;
        min-width: 0;
      }
      .owner-avatar {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        font-size: 14px;
        line-height: 1;
        color: rgba(0, 0, 0, 0.75);
      }
      .owner-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .owner-avatar .initial {
        font-weight: 700;
        text-transform: uppercase;
        font-family: var(--primary-font-family, sans-serif);
        font-size: 12px;
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
be([
  p({ type: Array })
], J.prototype, "items", 2);
be([
  p({ type: String })
], J.prototype, "todoEntityId", 2);
be([
  p({ type: Boolean })
], J.prototype, "integrationMode", 2);
be([
  p({ attribute: !1 })
], J.prototype, "renderableTasks", 2);
be([
  p({ attribute: !1 })
], J.prototype, "members", 2);
J = be([
  w("lucarne-tasks-summary")
], J);
var ya = Object.defineProperty, ba = Object.getOwnPropertyDescriptor, vr = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? ba(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && ya(t, r, a), a;
};
let Qe = class extends v {
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
Qe.styles = [
  D,
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
vr([
  p({ type: Array })
], Qe.prototype, "entries", 2);
Qe = vr([
  w("lucarne-presence-pills")
], Qe);
const ve = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
function gt(e) {
  if (!e || e.trim() === "") return { mode: "none" };
  const t = e.trim().split(";"), r = {};
  for (const d of t) {
    const u = d.indexOf("=");
    if (u === -1) return { mode: "unknown", raw: e };
    r[d.slice(0, u)] = d.slice(u + 1);
  }
  const n = r.FREQ;
  let a;
  if (r.INTERVAL !== void 0) {
    if (!/^[1-9]\d*$/.test(r.INTERVAL)) return { mode: "unknown", raw: e };
    a = parseInt(r.INTERVAL, 10);
  }
  const s = r.BYDAY, i = r.BYMONTHDAY, o = r.BYMONTH;
  function c(...d) {
    const u = new Set(d);
    return Object.keys(r).every((m) => u.has(m));
  }
  if (n === "DAILY" && !s && !i && !o)
    return c("FREQ", "INTERVAL") ? { mode: "daily", ...a ? { interval: a } : {} } : { mode: "unknown", raw: e };
  if (n === "WEEKLY" && s && !i && !o) {
    if (!c("FREQ", "BYDAY", "INTERVAL")) return { mode: "unknown", raw: e };
    const d = s.split(",");
    return d.every((u) => ve.includes(u)) ? { mode: "weekly", days: d, ...a ? { interval: a } : {} } : { mode: "unknown", raw: e };
  }
  if (n === "MONTHLY" && i && !s && !o)
    return c("FREQ", "BYMONTHDAY", "INTERVAL") ? /^([1-9]|[12]\d|3[01])$/.test(i) ? { mode: "monthly-date", dayOfMonth: parseInt(i, 10), ...a ? { interval: a } : {} } : { mode: "unknown", raw: e } : { mode: "unknown", raw: e };
  if (n === "MONTHLY" && s && !i && !o) {
    if (!c("FREQ", "BYDAY", "INTERVAL")) return { mode: "unknown", raw: e };
    const d = s.match(/^([+-]?\d+)([A-Z]{2})$/);
    if (!d) return { mode: "unknown", raw: e };
    const u = parseInt(d[1], 10);
    if (![1, 2, 3, 4, -1].includes(u)) return { mode: "unknown", raw: e };
    const m = d[2];
    return ve.includes(m) ? { mode: "monthly-nth", nth: u, day: m, ...a ? { interval: a } : {} } : { mode: "unknown", raw: e };
  }
  if (n === "YEARLY" && o && i && !s) {
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
function _r(e) {
  const t = gt(e);
  if (t.mode === "none") return "One-off (no repeat)";
  if (t.mode === "unknown") return "Custom recurrence (not editable here)";
  const r = "interval" in t && t.interval ? t.interval : 1;
  if (t.mode === "daily")
    return r === 1 ? "Daily" : `Every ${r} days`;
  if (t.mode === "weekly") {
    const n = {
      MO: "Mon",
      TU: "Tue",
      WE: "Wed",
      TH: "Thu",
      FR: "Fri",
      SA: "Sat",
      SU: "Sun"
    }, a = t.days.map((s) => n[s]).join(", ");
    return r === 1 ? `Weekly on ${a}` : `Every ${r} weeks on ${a}`;
  }
  if (t.mode === "monthly-date") {
    const n = Ut(t.dayOfMonth);
    return r === 1 ? `Monthly on the ${t.dayOfMonth}${n}` : `Every ${r} months on the ${t.dayOfMonth}${n}`;
  }
  if (t.mode === "monthly-nth") {
    const n = wa(t.nth), a = {
      MO: "Monday",
      TU: "Tuesday",
      WE: "Wednesday",
      TH: "Thursday",
      FR: "Friday",
      SA: "Saturday",
      SU: "Sunday"
    };
    return r === 1 ? `Monthly on the ${n} ${a[t.day]}` : `Every ${r} months on the ${n} ${a[t.day]}`;
  }
  if (t.mode === "yearly") {
    const n = [
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
    ], a = Ut(t.dayOfMonth);
    return r === 1 ? `Yearly on ${n[t.month]} ${t.dayOfMonth}${a}` : `Every ${r} years on ${n[t.month]} ${t.dayOfMonth}${a}`;
  }
  return "";
}
function Ut(e) {
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
function wa(e) {
  return e === -1 ? "last" : e === 1 ? "1st" : e === 2 ? "2nd" : e === 3 ? "3rd" : `${e}th`;
}
const $a = new Date(Date.UTC(1970, 0, 1));
function Ft(e) {
  return Math.floor(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()) / 864e5);
}
function xa(e, t, r) {
  const n = e.getDate();
  if (e.getDay() !== r) return !1;
  if (t > 0)
    return Math.floor((n - 1) / 7) === t - 1;
  const s = new Date(e.getFullYear(), e.getMonth() + 1, 0).getDate();
  return Math.floor((s - n) / 7) === 0;
}
const Bt = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6
};
function ka(e, t = /* @__PURE__ */ new Date()) {
  if (e.mode === "none" || e.mode === "unknown") return !1;
  const r = "interval" in e && e.interval ? e.interval : 1, n = Ft(t) - Ft($a);
  if (e.mode === "daily")
    return n % r === 0;
  if (e.mode === "weekly") {
    const a = t.getDay();
    return e.days.some((o) => Bt[o] === a) ? r === 1 ? !0 : Math.floor(n / 7) % r === 0 : !1;
  }
  if (e.mode === "monthly-date")
    return t.getDate() !== e.dayOfMonth ? !1 : r === 1 ? !0 : ((t.getFullYear() - 1970) * 12 + t.getMonth()) % r === 0;
  if (e.mode === "monthly-nth") {
    const a = Bt[e.day];
    return xa(t, e.nth, a) ? r === 1 ? !0 : ((t.getFullYear() - 1970) * 12 + t.getMonth()) % r === 0 : !1;
  }
  return e.mode === "yearly" ? t.getMonth() + 1 !== e.month || t.getDate() !== e.dayOfMonth ? !1 : r === 1 ? !0 : (t.getFullYear() - 1970) % r === 0 : !1;
}
var Ca = Object.defineProperty, Ea = Object.getOwnPropertyDescriptor, vt = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Ea(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Ca(t, r, a), a;
};
let ze = class extends v {
  constructor() {
    super(...arguments), this.members = [], this.tasksByMember = /* @__PURE__ */ new Map();
  }
  _handleClick() {
    this.dispatchEvent(new CustomEvent("family-ready-clicked", { bubbles: !0, composed: !0 }));
  }
  _computeReadiness() {
    let e = 0, t = 0;
    const r = /* @__PURE__ */ new Date();
    for (const n of this.members) {
      const s = (this.tasksByMember.get(n.slug) ?? []).filter(
        (i) => i.metadata.type === "routine" && ka(gt(i.metadata.recurrence), r)
      );
      s.length !== 0 && (e++, s.every((i) => i.status === "completed") && t++);
    }
    return { readyCount: t, totalWithRoutines: e };
  }
  render() {
    const { readyCount: e, totalWithRoutines: t } = this._computeReadiness();
    if (t === 0)
      return l`
        <div class="pill none" @click=${this._handleClick}>
          <span class="icon">✓</span>
          ${k.noRoutinesToday}
        </div>
      `;
    const r = e === t;
    return l`
      <div class="pill ${r ? "all-done" : ""}" @click=${this._handleClick}>
        <span class="icon">${r ? "🎉" : "⏳"}</span>
        ${k.familyReady(e, t)}
      </div>
    `;
  }
};
ze.styles = [
  D,
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
vt([
  p({ attribute: !1 })
], ze.prototype, "members", 2);
vt([
  p({ attribute: !1 })
], ze.prototype, "tasksByMember", 2);
ze = vt([
  w("lucarne-family-ready-pill")
], ze);
var Da = Object.defineProperty, Sa = Object.getOwnPropertyDescriptor, ue = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Sa(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Da(t, r, a), a;
};
const Wt = ["calendar", "weather", "tasks"];
function Xe(e) {
  const t = /* @__PURE__ */ new Set(), r = [];
  for (const n of e ?? [])
    Wt.includes(n) && !t.has(n) && (t.add(n), r.push(n));
  for (const n of Wt)
    t.has(n) || r.push(n);
  return r;
}
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
    const t = Object.keys(e.states).filter((s) => s.startsWith("calendar.")).slice(0, 3), r = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], n = t.map((s, i) => ({
      entity: s,
      color: r[i] ?? "#a8d8b9"
    })), a = "weather.forecast_home" in e.states;
    return {
      type: "custom:lucarne-today-card",
      title: k.today,
      calendars: n.length ? n : [{ entity: "calendar.example", color: "#a8d8b9" }],
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
      this._previewOverrideRaf = void 0, this.isConnected && (this._previewOverride = fr(this));
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
    }, 5 * 60 * 1e3), this._config.tasks && !this._config.household_tasks_from_integration && (this._todoUnsub = ct(this.hass, this._config.tasks, (e) => {
      this._todoItems = e;
    })), (this._config.household_tasks_from_integration || this._config.show_family_ready_pill) && (this._unsubFamily = Ae(this.hass, (e) => {
      this._familyState = e;
    })));
  }
  _teardownSubscriptions() {
    var e, t;
    clearInterval(this._calendarIntervalId), (e = this._todoUnsub) == null || e.call(this), this._todoUnsub = void 0, (t = this._unsubFamily) == null || t.call(this), this._unsubFamily = void 0, this._calendarIntervalId = void 0;
  }
  updated(e) {
    var n;
    if (super.updated(e), !e.has("hass") || !this._config) return;
    if (!e.get("hass") && this.hass && !this._calendarIntervalId) {
      this._setupSubscriptions();
      return;
    }
    const r = this._config.weather;
    if (r) {
      const a = (n = this.hass.states[r]) == null ? void 0 : n.state;
      a && a !== this._lastWeatherState && (this._lastWeatherState = a, this._fetchForecast());
    }
  }
  async _fetchCalendarEvents() {
    if (!this._config || !this.hass) return;
    const e = this._config.calendars.map((s) => s.entity), t = /* @__PURE__ */ new Date(), r = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), { events: n } = await mr(this.hass, e, t, r), a = /* @__PURE__ */ new Map();
    for (const [s, i] of n.entries())
      a.set(
        s,
        i.map((o) => ({ ...o, uid: `${s}::${o.uid ?? o.summary}` }))
      );
    this._calendarEvents = a;
  }
  async _fetchForecast() {
    var e, t, r;
    if (!(this._fetchingForecast || !((e = this._config) != null && e.weather) || !this.hass)) {
      this._fetchingForecast = !0;
      try {
        const n = await this.hass.connection.sendMessagePromise({
          type: "call_service",
          domain: "weather",
          service: "get_forecasts",
          service_data: { type: "daily" },
          target: { entity_id: this._config.weather },
          return_response: !0
        });
        this._forecast = ((r = (t = n == null ? void 0 : n.response) == null ? void 0 : t[this._config.weather]) == null ? void 0 : r.forecast) ?? [];
      } catch (n) {
        console.warn(`[lucarne] weather.get_forecasts failed for ${this._config.weather}:`, n), this._forecast = [];
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
  async _handleTaskToggle(e) {
    const { task: t } = e.detail;
    if (!this.hass) return;
    const r = t.status === "completed" ? "needs_action" : "completed", n = this._resolveTaskEntityId(t);
    n && await this.hass.callService(
      "todo",
      "update_item",
      { item: t.uid, status: r },
      { entity_id: n }
    );
  }
  _handleTaskLongPress(e) {
    const { task: t } = e.detail, r = this._resolveTaskEntityId(t);
    r && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: r },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _resolveTaskEntityId(e) {
    var t, r;
    if ((t = this._config) != null && t.household_tasks_from_integration && this._familyState) {
      const n = e.metadata.member_slug;
      if (n === "household") return "todo.lucarne_household";
      const a = this._familyState.members.find((s) => s.slug === n);
      return a != null && a.todo_entity_id ? a.todo_entity_id : void 0;
    }
    return (r = this._config) == null ? void 0 : r.tasks;
  }
  _renderCalendarSection() {
    var e;
    return l`
      <div class="section section-calendar" data-section="calendar">
        <lucarne-agenda-strip
          .events=${this._mergedEvents}
          .calendarColors=${this._calendarColorMap}
          .limit=${((e = this._config) == null ? void 0 : e.agenda_limit) ?? 5}
        ></lucarne-agenda-strip>
      </div>
    `;
  }
  _renderWeatherSection() {
    var t, r;
    const e = (t = this._config) != null && t.weather ? (r = this.hass) == null ? void 0 : r.states[this._config.weather] : void 0;
    return l`
      <div class="section section-weather" data-section="weather">
        <lucarne-weather-block
          .weatherEntity=${e}
          .forecast=${this._forecast}
        ></lucarne-weather-block>
      </div>
    `;
  }
  _renderTasksSection(e, t) {
    var r;
    return !e && !t ? "" : l`
      <div
        class="section section-tasks"
        data-section="tasks"
        @task-toggle=${this._handleTaskToggle}
        @task-long-press=${this._handleTaskLongPress}
      >
        ${e ? l`
              <lucarne-tasks-summary
                .items=${this._todoItems}
                .todoEntityId=${(r = this._config) == null ? void 0 : r.tasks}
              ></lucarne-tasks-summary>
            ` : ""}
        ${t ? l`
              <lucarne-tasks-summary
                .integrationMode=${!0}
                .renderableTasks=${this._householdTasks}
                .members=${this._familyMembers}
                .todoEntityId=${"todo.lucarne_household"}
              ></lucarne-tasks-summary>
            ` : ""}
      </div>
    `;
  }
  render() {
    if (!this._config) return l``;
    const e = (this._config.presence ?? []).map((i) => {
      var o, c;
      return {
        name: i.name,
        isHome: ((c = (o = this.hass) == null ? void 0 : o.states[i.entity]) == null ? void 0 : c.state) === "on"
      };
    }), t = this._familyState !== null && this._familyState.integrationError === null, r = (this._config.show_family_ready_pill ?? !1) && t, n = (this._config.household_tasks_from_integration ?? !1) && t, a = !(this._config.household_tasks_from_integration ?? !1) && !!this._config.tasks, s = Xe(this._config.section_order);
    return l`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${this._config.title ?? k.today}</h2>
          <div class="header-right">
            ${e.length > 0 ? l`<lucarne-presence-pills .entries=${e}></lucarne-presence-pills>` : ""}
            ${r ? l`<lucarne-family-ready-pill
                  .members=${this._familyMembers}
                  .tasksByMember=${this._familyTasksByMember}
                ></lucarne-family-ready-pill>` : ""}
          </div>
        </div>
        <div class="card-body">
          ${s.map((i) => {
      switch (i) {
        case "calendar":
          return this._renderCalendarSection();
        case "weather":
          return this._renderWeatherSection();
        case "tasks":
          return this._renderTasksSection(a, n);
      }
    })}
        </div>
      </ha-card>
    `;
  }
};
V.styles = [
  D,
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
        display: flex;
        flex-direction: column;
      }
      .section + .section {
        border-top: 1px solid rgba(0, 0, 0, 0.07);
      }
    `
];
ue([
  p({ attribute: !1 })
], V.prototype, "hass", 2);
ue([
  h()
], V.prototype, "_config", 2);
ue([
  h()
], V.prototype, "_calendarEvents", 2);
ue([
  h()
], V.prototype, "_forecast", 2);
ue([
  h()
], V.prototype, "_todoItems", 2);
ue([
  h()
], V.prototype, "_familyState", 2);
V = ue([
  w("lucarne-today-card")
], V);
const yr = b`
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
`, Yt = ["ha-entity-picker", "ha-textfield"], Ma = 3e3;
let Ye;
function Ta(e) {
  return new Promise((t) => setTimeout(t, e));
}
async function Pa() {
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
    Yt.map((a) => customElements.whenDefined(a))
  ).then(() => "ready"), r = Ta(Ma).then(() => "timeout");
  if (await Promise.race([t, r]) === "timeout" && !Yt.every((a) => customElements.get(a)))
    throw new Error("[lucarne] HA form elements did not register within timeout");
}
function br() {
  return Ye || (Ye = Pa().catch((e) => {
    throw Ye = void 0, e;
  })), Ye;
}
var Vt, qt;
(function(e) {
  e.language = "language", e.system = "system", e.comma_decimal = "comma_decimal", e.decimal_comma = "decimal_comma", e.space_comma = "space_comma", e.none = "none";
})(Vt || (Vt = {})), function(e) {
  e.language = "language", e.system = "system", e.am_pm = "12", e.twenty_four = "24";
}(qt || (qt = {}));
var _t = function(e, t, r, n) {
  n = n || {}, r = r ?? {};
  var a = new Event(t, { bubbles: n.bubbles === void 0 || n.bubbles, cancelable: !!n.cancelable, composed: n.composed === void 0 || n.composed });
  return a.detail = r, e.dispatchEvent(a), a;
}, Oa = Object.defineProperty, Aa = Object.getOwnPropertyDescriptor, we = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Aa(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Oa(t, r, a), a;
};
const lt = {
  calendar: "Calendar",
  weather: "Weather",
  tasks: "Tasks"
}, Ia = b`
  .section-order-list {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    border-radius: var(--lucarne-radius-md);
    overflow: hidden;
  }
  .section-order-row {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: var(--lucarne-spacing-sm);
    padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-md);
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }
  .section-order-row + .section-order-row {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
  }
  .section-order-row.dragging {
    opacity: 0.5;
  }
  .section-order-row.drag-over {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
  }
  .grab-handle {
    cursor: grab;
    color: var(--lucarne-on-surface-muted);
    font-size: 1.2em;
    line-height: 1;
    user-select: none;
    padding: 0 var(--lucarne-spacing-xs);
  }
  .grab-handle:active {
    cursor: grabbing;
  }
  .section-label-cell {
    font-size: var(--lucarne-fs-md);
    color: var(--lucarne-on-surface);
  }
  .move-btn {
    background: none;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));
    border-radius: var(--lucarne-radius-sm);
    padding: 2px 8px;
    font-size: 0.9em;
    color: var(--lucarne-on-surface-muted);
    cursor: pointer;
    min-width: 28px;
  }
  .move-btn:hover:not(:disabled) {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
  }
  .move-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;
let Q = class extends v {
  constructor() {
    super(...arguments), this._dragIndex = null, this._dragOverIndex = null, this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), br().catch((e) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", e)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(e) {
    this._config = e;
  }
  _fire(e) {
    _t(this, "config-changed", { config: e });
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
    return !!((t = (e = this.hass) == null ? void 0 : e.states) != null && t[Se.todo_entity_id]);
  }
  _agendaLimitChanged(e) {
    const t = e.target, r = parseInt(t.value, 10);
    this._fire({ ...this._config, agenda_limit: isNaN(r) ? void 0 : Math.min(10, Math.max(1, r)) });
  }
  _calEntityChanged(e, t) {
    var n, a;
    const r = [...((n = this._config) == null ? void 0 : n.calendars) ?? []];
    r[e] = { ...r[e], entity: ((a = t.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, calendars: r });
  }
  _calColorChanged(e, t) {
    var n;
    const r = [...((n = this._config) == null ? void 0 : n.calendars) ?? []];
    r[e] = { ...r[e], color: t.target.value }, this._fire({ ...this._config, calendars: r });
  }
  _removeCalendar(e) {
    var r;
    const t = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    t.length <= 1 || (t.splice(e, 1), this._fire({ ...this._config, calendars: t }));
  }
  _addCalendar() {
    var n, a;
    const t = Object.keys(((n = this.hass) == null ? void 0 : n.states) ?? {}).find((s) => s.startsWith("calendar.")) ?? "calendar.example", r = [
      ...((a = this._config) == null ? void 0 : a.calendars) ?? [],
      { entity: t, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  _presenceEntityChanged(e, t) {
    var n, a;
    const r = [...((n = this._config) == null ? void 0 : n.presence) ?? []];
    r[e] = { ...r[e], entity: ((a = t.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, presence: r });
  }
  _presenceNameChanged(e, t) {
    var n;
    const r = [...((n = this._config) == null ? void 0 : n.presence) ?? []];
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
  _commitSectionOrder(e) {
    this._fire({ ...this._config, section_order: e });
  }
  _moveSection(e, t) {
    var s;
    const r = Xe((s = this._config) == null ? void 0 : s.section_order), n = e + t;
    if (n < 0 || n >= r.length) return;
    const a = [...r];
    [a[e], a[n]] = [a[n], a[e]], this._commitSectionOrder(a);
  }
  _onDragStart(e, t) {
    this._dragIndex = e, t.dataTransfer && (t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", String(e)));
  }
  _onDragOver(e, t) {
    this._dragIndex === null || this._dragIndex === e || (t.preventDefault(), t.dataTransfer && (t.dataTransfer.dropEffect = "move"), this._dragOverIndex !== e && (this._dragOverIndex = e));
  }
  _onDrop(e, t) {
    var i;
    t.preventDefault();
    const r = this._dragIndex;
    if (this._dragIndex = null, this._dragOverIndex = null, r === null || r === e) return;
    const a = [...Xe((i = this._config) == null ? void 0 : i.section_order)], [s] = a.splice(r, 1);
    a.splice(e, 0, s), this._commitSectionOrder(a);
  }
  _onDragEnd() {
    this._dragIndex = null, this._dragOverIndex = null;
  }
  _renderSectionOrder() {
    var t;
    const e = Xe((t = this._config) == null ? void 0 : t.section_order);
    return l`
      <div class="section-label">Section order</div>
      <div class="section-order-list" role="list" aria-label="Card sections (drag to reorder)">
        ${e.map(
      (r, n) => l`
            <div
              class="section-order-row ${this._dragIndex === n ? "dragging" : ""} ${this._dragOverIndex === n ? "drag-over" : ""}"
              role="listitem"
              draggable="true"
              data-section=${r}
              data-index=${n}
              @dragstart=${(a) => this._onDragStart(n, a)}
              @dragover=${(a) => this._onDragOver(n, a)}
              @drop=${(a) => this._onDrop(n, a)}
              @dragend=${this._onDragEnd}
            >
              <span class="grab-handle" aria-hidden="true">≡</span>
              <span class="section-label-cell">${lt[r]}</span>
              <button
                type="button"
                class="move-btn"
                aria-label="Move ${lt[r]} up"
                ?disabled=${n === 0}
                @click=${() => this._moveSection(n, -1)}
              >↑</button>
              <button
                type="button"
                class="move-btn"
                aria-label="Move ${lt[r]} down"
                ?disabled=${n === e.length - 1}
                @click=${() => this._moveSection(n, 1)}
              >↓</button>
            </div>
          `
    )}
      </div>
    `;
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

      ${this._renderSectionOrder()}

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
      (r, n) => l`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${r.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(a) => this._calEntityChanged(n, a)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${r.color}
              @input=${(a) => this._calColorChanged(n, a)}
              title="Calendar color"
            />
            <button type="button" class="remove" @click=${() => this._removeCalendar(n)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addCalendar}>+ Add calendar</button>

      <div class="section-label">Presence</div>
      ${t.map(
      (r, n) => l`
          <div class="presence-row">
            <div class="row-stack">
              <ha-entity-picker
                label="Entity"
                .hass=${this.hass}
                .value=${r.entity}
                .includeDomains=${["input_boolean"]}
                allow-custom-entity
                @value-changed=${(a) => this._presenceEntityChanged(n, a)}
              ></ha-entity-picker>
              <input
                class="text-input"
                type="text"
                placeholder="Display name"
                .value=${r.name}
                @change=${(a) => this._presenceNameChanged(n, a)}
              />
            </div>
            <button type="button" class="remove" @click=${() => this._removePresence(n)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addPresence}>+ Add person</button>
    `;
  }
};
Q.styles = [D, yr, Ia];
we([
  h()
], Q.prototype, "_dragIndex", 2);
we([
  h()
], Q.prototype, "_dragOverIndex", 2);
we([
  p({ attribute: !1 })
], Q.prototype, "hass", 2);
we([
  h()
], Q.prototype, "_config", 2);
we([
  h()
], Q.prototype, "_haReady", 2);
Q = we([
  w("lucarne-today-card-editor")
], Q);
function wr(e, t) {
  var n, a, s;
  const r = (s = (a = (n = t == null ? void 0 : t.states) == null ? void 0 : n[e.entity]) == null ? void 0 : a.attributes) == null ? void 0 : s.friendly_name;
  return typeof r == "string" && r ? r : e.entity;
}
function Kt(e, t) {
  return e.map((r) => ({ ...r, label: wr(r, t) }));
}
function Xt(e, t) {
  const r = parseInt(e.split(":")[0], 10), n = parseInt(t.split(":")[0], 10), a = [];
  for (let s = r; s <= n; s++)
    a.push(s);
  return a;
}
function Ra(e, t, r) {
  const [n, a] = t.split(":").map(Number), [s, i] = r.split(":").map(Number), o = new Date(e);
  o.setHours(n, a, 0, 0);
  const c = new Date(e);
  return c.setHours(s, i, 0, 0), { bandStartMs: o.getTime(), bandEndMs: c.getTime() };
}
function za(e, t, r, n) {
  const a = Gt(e.start).getTime(), s = Gt(e.end).getTime(), { bandStartMs: i, bandEndMs: o } = Ra(t, r, n), c = Math.max(a, i), d = Math.min(s, o);
  return c >= d ? null : { start: new Date(c), end: new Date(d) };
}
function Gt(e) {
  return e.length === 10 && !e.includes("T") ? /* @__PURE__ */ new Date(`${e}T00:00:00`) : new Date(e);
}
function Na(e) {
  return e.start.length === 10 && !e.start.includes("T");
}
function N(e) {
  const t = e.getFullYear(), r = String(e.getMonth() + 1).padStart(2, "0"), n = String(e.getDate()).padStart(2, "0");
  return `${t}-${r}-${n}`;
}
function $r(e) {
  return e.uid ?? `${e.start}|${e.end}|${e.summary ?? ""}`;
}
function ja(e) {
  if (e.length === 0) return [];
  const t = e.map((c, d) => ({ ...c, _idx: d }));
  t.sort((c, d) => c.start.getTime() - d.start.getTime());
  const r = [], n = new Array(e.length);
  for (const c of t) {
    const d = c.start.getTime();
    let u = r.findIndex((m) => m <= d);
    u === -1 ? (u = r.length, r.push(c.end.getTime())) : r[u] = c.end.getTime(), n[c._idx] = u;
  }
  const a = new Array(e.length), s = [];
  let i = 0, o = t[0].end.getTime();
  a[t[0]._idx] = 0, s.push(n[t[0]._idx]);
  for (let c = 1; c < t.length; c++) {
    const d = t[c];
    d.start.getTime() >= o ? (i++, s.push(0), o = d.end.getTime()) : o = Math.max(o, d.end.getTime()), a[d._idx] = i, s[i] = Math.max(s[i], n[d._idx]);
  }
  return n.map((c, d) => ({
    lane: c,
    laneCount: s[a[d]] + 1
  }));
}
function Ve(e, t) {
  const [r, n] = t.split(":").map(Number), a = new Date(e);
  return a.setHours(r, n, 0, 0), a.getTime();
}
function La(e, t, r, n) {
  const a = /* @__PURE__ */ new Map();
  for (const o of t)
    a.set(N(o), { allDay: [], inBand: [], earlier: [], later: [] });
  const s = t.length > 0 ? t[0] : null, i = t.length > 0 ? t[t.length - 1] : null;
  for (const o of e) {
    if (Na(o)) {
      const u = /* @__PURE__ */ new Date(o.start + "T00:00:00"), m = /* @__PURE__ */ new Date(o.end + "T00:00:00"), g = s !== null && u < s, f = i ? new Date(i) : null;
      f && f.setDate(f.getDate() + 1);
      const _ = f !== null && m > f;
      for (const x of t) {
        const y = N(x), C = a.get(y);
        if (x >= u && x < m && (C.allDay.push(o), g || _)) {
          C.allDayClipped || (C.allDayClipped = /* @__PURE__ */ new Map());
          const T = s !== null && N(x) === N(s), H = i !== null && N(x) === N(i);
          C.allDayClipped.set($r(o), {
            left: g && T,
            right: _ && H
          });
        }
      }
      continue;
    }
    const c = new Date(o.start), d = new Date(o.end);
    for (const u of t) {
      const m = N(u), g = a.get(m), f = new Date(u);
      f.setHours(0, 0, 0, 0);
      const _ = new Date(u);
      if (_.setHours(23, 59, 59, 999), d <= f || c > _) continue;
      const x = Ve(u, r), y = Ve(u, n);
      if (d.getTime() <= x)
        g.earlier.push(o);
      else if (c.getTime() >= y)
        g.later.push(o);
      else {
        const C = za(o, u, r, n);
        if (C) {
          const T = y - x, H = (C.start.getTime() - x) / T * 100, wt = (C.end.getTime() - C.start.getTime()) / T * 100;
          g.inBand.push({
            event: o,
            lane: 0,
            laneCount: 1,
            topPercent: Math.max(0, Math.min(100, H)),
            heightPercent: Math.max(0, Math.min(100 - H, wt))
          });
        }
      }
    }
  }
  for (const o of t) {
    const c = N(o), d = a.get(c);
    if (d.inBand.length === 0) continue;
    const u = Ve(o, r), g = Ve(o, n) - u, f = d.inBand.map((x) => {
      const y = u + x.topPercent / 100 * g, C = y + x.heightPercent / 100 * g;
      return {
        event: x.event,
        start: new Date(y),
        end: new Date(C),
        lane: 0
      };
    }), _ = ja(f);
    d.inBand = d.inBand.map((x, y) => ({
      ...x,
      lane: _[y].lane,
      laneCount: _[y].laneCount
    }));
  }
  return { days: t, perDay: a };
}
function Ha(e, t) {
  const r = Math.min(t.minColWidth, t.maxColWidth), n = Math.max(t.minColWidth, t.maxColWidth), a = Math.min(t.minDays, t.maxDays), s = Math.max(t.minDays, t.maxDays), i = Math.max(0, e - t.timeColWidth);
  if (i <= 0)
    return { visibleCount: a, dayWidthPx: r };
  const o = Math.floor(i / r), c = Math.ceil(i / n), d = Math.min(s, Math.max(a, c, Math.min(o, s))), u = i / d;
  return { visibleCount: d, dayWidthPx: u };
}
function Ua(e) {
  return `syn:${e.start}|${e.end}|${e.summary ?? ""}`;
}
function Jt(e) {
  if (e !== void 0 && !(typeof e != "number" || !Number.isFinite(e)))
    return Math.max(0, Math.floor(e));
}
function qe(e, t) {
  const r = new Date(e);
  return r.setDate(r.getDate() + t), r;
}
function Qt(e) {
  const t = new Date(e);
  return t.setHours(0, 0, 0, 0), t;
}
class Fa {
  constructor(t, r) {
    this._isConnected = !1, this._hasHass = !1, this._dayOffset = 0, this._fetchSeq = 0, this._cachedEvents = /* @__PURE__ */ new Map(), this._cachedDayKeys = /* @__PURE__ */ new Set(), this._host = t, this._opts = r, this._fetcher = r.fetcher ?? mr, this._pollIntervalMs = r.pollIntervalMs ?? 5 * 6e4, this._tickIntervalMs = r.tickIntervalMs ?? 6e4, this._panBound = r.panBoundDays ?? 90, this._visibleCount = r.visibleCount, this._bufferDaysExplicit = Jt(r.bufferDays);
    const n = (r.now ?? (() => /* @__PURE__ */ new Date()))();
    this._anchorToday = Qt(n), t.addController(this);
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
    const r = new Set(this._opts.calendars.map((s) => s.entity)), n = new Set(t.map((s) => s.entity)), a = r.size !== n.size || [...n].some((s) => !r.has(s));
    this._opts.calendars = t, a && this._hass && this._fetchRange(...this._computeRange());
  }
  setVisibleCount(t) {
    var n, a;
    const r = this._visibleCount;
    if (this._visibleCount = t, (a = (n = this._opts).onChange) == null || a.call(n), this._host.requestUpdate(), t !== r) {
      const [s, i] = this._computeRange();
      this._rangeIsCovered(s, i) || this._fetchRange(s, i);
    }
  }
  /**
   * Set the off-screen render buffer (days drawn on each side of the visible
   * window). Pass `undefined` to revert to the default (matches visibleCount).
   * Non-finite or non-numeric input is coerced to `undefined` (default) so
   * bad YAML config doesn't blank the grid.
   */
  setBufferDays(t) {
    var n, a;
    const r = Jt(t);
    r !== this._bufferDaysExplicit && (this._bufferDaysExplicit = r, (a = (n = this._opts).onChange) == null || a.call(n), this._host.requestUpdate());
  }
  pan(t) {
    var o, c;
    const r = -this._panBound, n = this._panBound - this._visibleCount, a = Math.max(r, Math.min(n, this._dayOffset + t));
    this._dayOffset = a, (c = (o = this._opts).onChange) == null || c.call(o), this._host.requestUpdate();
    const [s, i] = this._computeRange();
    this._rangeIsCovered(s, i) || this._fetchRange(s, i);
  }
  goToToday() {
    var a, s;
    const t = this._dayOffset === 0;
    this._dayOffset = 0, t || (s = (a = this._opts).onChange) == null || s.call(a), this._host.requestUpdate();
    const [r, n] = this._computeRange();
    this._rangeIsCovered(r, n) || this._fetchRange(r, n);
  }
  tick() {
    var n, a;
    const t = (this._opts.now ?? (() => /* @__PURE__ */ new Date()))(), r = Qt(t);
    r.getTime() !== this._anchorToday.getTime() && (this._anchorToday = r, this._dayOffset === 0 && ((a = (n = this._opts).onChange) == null || a.call(n), this._host.requestUpdate(), this._hass && this._fetchRange(...this._computeRange())));
  }
  async _poll() {
    this._hass && this._fetchRange(...this._computeRange());
  }
  // -------------------------------------------------------------------------
  // Getters
  // -------------------------------------------------------------------------
  get days() {
    return Array.from({ length: this._visibleCount }, (t, r) => {
      const n = qe(this._anchorToday, this._dayOffset + r);
      return n.setHours(0, 0, 0, 0), n;
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
    return Array.from({ length: r }, (n, a) => {
      const s = qe(this._anchorToday, this._dayOffset - t + a);
      return s.setHours(0, 0, 0, 0), s;
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
    const t = this._visibleCount, r = qe(this._anchorToday, this._dayOffset - t);
    r.setHours(0, 0, 0, 0);
    const n = qe(this._anchorToday, this._dayOffset + 2 * t);
    return n.setHours(0, 0, 0, 0), [r, n];
  }
  _rangeIsCovered(t, r) {
    return !this._cacheStart || !this._cacheEnd ? !1 : t >= this._cacheStart && r <= this._cacheEnd;
  }
  _fetchRange(t, r) {
    var s, i;
    if (!this._hass) return;
    const n = ++this._fetchSeq, a = this._opts.calendars.map((o) => o.entity);
    (i = (s = this._opts).onFetchStart) == null || i.call(s, { start: t, end: r }), this._fetcher(this._hass, a, t, r).then(({ events: o, failed: c }) => {
      var u, m;
      if (n !== this._fetchSeq) return;
      const d = /* @__PURE__ */ new Map();
      for (const [g, f] of o.entries())
        d.set(
          g,
          f.map((_) => {
            const x = _.uid && _.uid.length > 0 ? _.uid : Ua(_);
            return { ..._, uid: `${g}::${x}` };
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
var Ba = Object.defineProperty, Wa = Object.getOwnPropertyDescriptor, yt = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Wa(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Ba(t, r, a), a;
};
let Ne = class extends v {
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
Ne.styles = [
  D,
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
yt([
  p({ type: Array })
], Ne.prototype, "calendars", 2);
yt([
  p({ type: Object })
], Ne.prototype, "visibleIds", 2);
Ne = yt([
  w("lucarne-visibility-pills")
], Ne);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ya = { ATTRIBUTE: 1 }, Va = (e) => (...t) => ({ _$litDirective$: e, values: t });
let qa = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, r, n) {
    this._$Ct = t, this._$AM = r, this._$Ci = n;
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
const xr = "important", Ka = " !" + xr, Xa = Va(class extends qa {
  constructor(e) {
    var t;
    if (super(e), e.type !== Ya.ATTRIBUTE || e.name !== "style" || ((t = e.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(e) {
    return Object.keys(e).reduce((t, r) => {
      const n = e[r];
      return n == null ? t : t + `${r = r.includes("-") ? r : r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${n};`;
    }, "");
  }
  update(e, [t]) {
    const { style: r } = e.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const n of this.ft) t[n] == null && (this.ft.delete(n), n.includes("-") ? r.removeProperty(n) : r[n] = null);
    for (const n in t) {
      const a = t[n];
      if (a != null) {
        this.ft.add(n);
        const s = typeof a == "string" && a.endsWith(Ka);
        n.includes("-") || s ? r.setProperty(n, s ? a.slice(0, -11) : a, s ? xr : "") : r[n] = a;
      }
    }
    return oe;
  }
});
var Ga = Object.defineProperty, Ja = Object.getOwnPropertyDescriptor, he = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Ja(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Ga(t, r, a), a;
};
function Zt(e) {
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
    const e = new Date(this.event.start), t = new Date(this.event.end), r = `${Zt(e)}–${Zt(t)}`, n = this.event.pending ? "0.5" : "1";
    return l`
      <div @click=${this._handleClick} style="height:100%;width:100%;overflow:hidden;opacity:${n}">
        <div class="event-summary">${this.event.summary}</div>
        <div class="event-time">${r}</div>
      </div>
    `;
  }
};
q.styles = [
  D,
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
he([
  p({ type: Object })
], q.prototype, "event", 2);
he([
  p({ type: String })
], q.prototype, "color", 2);
he([
  p({ type: Number })
], q.prototype, "lane", 2);
he([
  p({ type: Number })
], q.prototype, "laneCount", 2);
he([
  p({ type: Number })
], q.prototype, "topPercent", 2);
he([
  p({ type: Number })
], q.prototype, "heightPercent", 2);
q = he([
  w("lucarne-calendar-event-block")
], q);
var Qa = Object.defineProperty, Za = Object.getOwnPropertyDescriptor, He = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Za(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Qa(t, r, a), a;
};
let le = class extends v {
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
      const n = e.getBoundingClientRect();
      t = n.bottom + 4, r = n.left;
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
      (n) => l`
                  <div class="mini-event" @click=${(a) => this._tapEvent(a, n)}>
                    <span class="mini-event-summary">${n.summary}</span>
                    <span class="mini-event-time">${this._formatTime(n.start)}</span>
                  </div>
                `
    )}
            </div>
          ` : ""}
    `;
  }
};
le.styles = [
  D,
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
], le.prototype, "events", 2);
He([
  p({ type: String })
], le.prototype, "label", 2);
He([
  p({ type: Object })
], le.prototype, "eventColors", 2);
He([
  h()
], le.prototype, "_open", 2);
le = He([
  w("lucarne-out-of-band-stub")
], le);
var en = Object.defineProperty, tn = Object.getOwnPropertyDescriptor, rt = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? tn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && en(t, r, a), a;
};
function rn(e) {
  return 20 + (e * 37 + 11) % 30;
}
function an(e) {
  return 10 + (e * 53 + 7) % 60;
}
let _e = class extends v {
  constructor() {
    super(...arguments), this.bandStart = "07:00", this.bandEnd = "21:00", this.hourHeightPx = 60;
  }
  render() {
    const [e] = this.bandStart.split(":").map(Number), [t] = this.bandEnd.split(":").map(Number), n = Math.max(1, t - e) * this.hourHeightPx;
    return l`
      <div class="sk-host" style="height:${n}px">
        ${[0, 1].map((a) => {
      const i = an(a) / 100 * n, o = rn(a);
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
_e.styles = [
  D,
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
rt([
  p({ type: String })
], _e.prototype, "bandStart", 2);
rt([
  p({ type: String })
], _e.prototype, "bandEnd", 2);
rt([
  p({ type: Number })
], _e.prototype, "hourHeightPx", 2);
_e = rt([
  w("lucarne-skeleton-day-column")
], _e);
var nn = Object.defineProperty, sn = Object.getOwnPropertyDescriptor, W = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? sn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && nn(t, r, a), a;
};
function er(e, t) {
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
      const n = e.uid.split("::")[0];
      return t.get(n) ?? "#a8d8b9";
    }
    return "#a8d8b9";
  }
  _onBandClick(e, t) {
    if (!this.showCreateButton) return;
    const n = e.currentTarget.getBoundingClientRect(), [a] = this.bandStart.split(":").map(Number), [s] = this.bandEnd.split(":").map(Number), i = s - a, o = Math.max(0, Math.min(1, (e.clientY - n.top) / n.height)), c = a + o * i, d = Math.min(s - 1, Math.round(c * 2) / 2);
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
    const r = N(e), n = this.layout.perDay.get(r);
    if (!n) return l``;
    const a = Xt(this.bandStart, this.bandEnd), i = (a.length - 1) * this.hourHeightPx, o = er(e, t), [c] = this.bandStart.split(":").map(Number), [d] = this.bandEnd.split(":").map(Number), u = (d - c) * 36e5;
    let m = null;
    if (o) {
      const f = new Date(e);
      f.setHours(c, 0, 0, 0);
      const _ = new Date(e);
      _.setHours(d, 0, 0, 0), t >= f && t <= _ && (m = (t.getTime() - f.getTime()) / u * 100);
    }
    const g = this._buildEventColorMap([...n.inBand.map((f) => f.event), ...n.earlier, ...n.later]);
    return l`
      <div class="day-col-wrapper">
        ${n.earlier.length > 0 ? l`
              <div class="stub-area-top">
                <lucarne-out-of-band-stub
                  .events=${n.earlier}
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
      (f, _) => l`
              <div
                class="hour-line"
                style="top: ${(_ + 1) / (a.length - 1) * 100}%"
              ></div>
            `
    )}

          ${m !== null ? l`<div class="now-line" style="top:${m}%"></div>` : ""}

          ${n.inBand.map((f) => {
      const _ = 100 / f.laneCount, x = f.lane / f.laneCount * 100, y = this._eventColor(f.event);
      return l`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${f.topPercent}%;
                  left: calc(${x}% + 1px);
                  width: calc(${_}% - 2px);
                  height: ${f.heightPercent}%;
                  z-index: ${f.lane + 1};
                  background: ${y}cc;
                  border-left-color: ${y};
                "
                .event=${f.event}
                .color=${y}
                .lane=${f.lane}
                .laneCount=${f.laneCount}
                .topPercent=${f.topPercent}
                .heightPercent=${f.heightPercent}
              ></lucarne-calendar-event-block>
            `;
    })}
        </div>

        ${n.later.length > 0 ? l`
              <div class="stub-area-bottom">
                <lucarne-out-of-band-stub
                  .events=${n.later}
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
    const e = /* @__PURE__ */ new Date(), t = Xt(this.bandStart, this.bandEnd), n = (t.length - 1) * this.hourHeightPx, a = new Intl.DateTimeFormat("en-US", { weekday: "short" }), s = {
      "--lucarne-day-render-count": String(this.layout.days.length)
    };
    return this.dayWidthPx > 0 && (s["--lucarne-day-width-px"] = `${this.dayWidthPx}px`, s["--lucarne-day-baseline-px"] = `${-this.bufferDays * this.dayWidthPx}px`), l`
      <div class="grid-wrapper" style=${Xa(s)}>
        <!-- Time-column gutter cells (col 1): stay fixed during pan -->
        <div class="header-spacer" style="grid-row:1; grid-column:1"></div>
        <div class="allday-spacer" style="grid-row:2; grid-column:1">all-day</div>
        <div class="time-col" style="height:${n}px; grid-row:3; grid-column:1">
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
                class="day-header ${er(i, e) ? "today" : ""}"
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
          const g = (f = u == null ? void 0 : u.allDayClipped) == null ? void 0 : f.get($r(m));
          return l`
                          <div
                            class="allday-event"
                            style="background: ${this._eventColor(m)}cc"
                            @click=${(_) => {
            _.stopPropagation(), this.dispatchEvent(
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
  D,
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
const on = 500;
function ln(e, t, r) {
  return t <= 0 ? 0 : Math.abs(r) >= on ? r > 0 ? Math.ceil(e / t) : Math.floor(e / t) : Math.round(e / t);
}
function tr(e, t) {
  if (Math.abs(e) <= t) return e;
  const r = Math.abs(e) - t;
  return Math.sign(e) * (t + r * 0.33);
}
var cn = Object.defineProperty, dn = Object.getOwnPropertyDescriptor, $e = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? dn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && cn(t, r, a), a;
};
let Z = class extends v {
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
    return e > 0 && !this.canPanBack || e < 0 && !this.canPanForward ? tr(e, 0) : e;
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
    const a = getComputedStyle(this).getPropertyValue("--lucarne-pan-duration").trim() || "240ms", s = getComputedStyle(this).getPropertyValue("--lucarne-pan-easing").trim() || "cubic-bezier(0.32, 0.72, 0, 1)", i = `transform ${a} ${s}`, o = r + e * this.dayWidthPx;
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
    const n = this._applyRubberBand(t);
    this._setTranslate(n);
  }
  _onPointerUp(e) {
    if (e.pointerId === this._pointerId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
      }
      if (this._isDragging) {
        const t = e.clientX - this._startX, r = performance.now() - this._startTime, n = r > 0 ? t / r * 1e3 : 0, a = this._applyRubberBand(t);
        let s = ln(a, this.dayWidthPx, n);
        (s > 0 && !this.canPanBack || s < 0 && !this.canPanForward) && (s = 0), this._snapAndCommit(s);
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
Z.styles = b`
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
$e([
  p({ type: Number })
], Z.prototype, "dayWidthPx", 2);
$e([
  p({ type: Number })
], Z.prototype, "bufferDays", 2);
$e([
  p({ type: Boolean })
], Z.prototype, "canPanBack", 2);
$e([
  p({ type: Boolean })
], Z.prototype, "canPanForward", 2);
$e([
  hr("slot")
], Z.prototype, "_slot", 2);
Z = $e([
  w("lucarne-calendar-day-pan")
], Z);
var un = Object.defineProperty, hn = Object.getOwnPropertyDescriptor, K = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? hn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && un(t, r, a), a;
};
function pn(e) {
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
      await Gr(this.hass, this.entityId, e);
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
    const e = this.event, r = e.start.length === 10 && !e.start.includes("T") ? "All day" : `${pn(e.start)} – ${new Date(e.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 })}`, n = this._hasSyntheticUid(e.uid), a = !!this.entityId && !!e.uid && this.hass != null && Qr(this.hass, this.entityId) && !this._isRecurring(e) && !n, s = this._confirmingDelete ? this._confirmDelete : this._startDelete, i = this._confirmingDelete ? "Confirm delete" : "Delete event";
    return l`
      <div class="backdrop" @click=${this._close}></div>
      <div class="popover" role="dialog" aria-modal="true">
        <div class="popover-header">
          <span class="color-dot" style="background:${this.color}"></span>
          <span class="event-title">${e.summary}</span>
          ${a ? l`
                <button
                  class="icon-btn ${this._confirmingDelete ? "armed" : ""}"
                  @click=${s}
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
  D,
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
var mn = Object.defineProperty, fn = Object.getOwnPropertyDescriptor, R = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? fn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && mn(t, r, a), a;
};
function rr(e, t) {
  const n = -(/* @__PURE__ */ new Date(`${e}T${t}:00`)).getTimezoneOffset(), a = n >= 0 ? "+" : "-", s = Math.floor(Math.abs(n) / 60).toString().padStart(2, "0"), i = (Math.abs(n) % 60).toString().padStart(2, "0");
  return `${e}T${t}:00${a}${s}:${i}`;
}
function ar(e) {
  return `${Math.floor(e).toString().padStart(2, "0")}:${e % 1 === 0.5 ? "30" : "00"}`;
}
function nr(e) {
  const t = e.getFullYear(), r = String(e.getMonth() + 1).padStart(2, "0"), n = String(e.getDate()).padStart(2, "0");
  return `${t}-${r}-${n}`;
}
let A = class extends v {
  constructor() {
    super(...arguments), this.day = null, this.startHour = 9, this.calendars = [], this._title = "", this._calendarEntityId = "", this._date = "", this._startTime = "", this._endTime = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
  }
  updated(e) {
    super.updated(e), (e.has("day") || e.has("startHour")) && this._initDefaults();
  }
  _initDefaults() {
    var r;
    const e = this.day ?? /* @__PURE__ */ new Date();
    this._date = nr(e), this._startTime = ar(Math.max(0, Math.min(23, this.startHour)));
    const t = Math.min(24, this.startHour + 1);
    this._endTime = ar(t < 24 ? t : 23.5), this._calendarEntityId = ((r = this.calendars[0]) == null ? void 0 : r.entity) ?? "", this._title = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
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
      const n = /* @__PURE__ */ new Date(`${this._date}T00:00:00`);
      n.setDate(n.getDate() + 1);
      const a = nr(n);
      e.end_date = a, t = this._date, r = a;
    } else {
      const n = rr(this._date, this._startTime), a = rr(this._date, this._endTime);
      e.start_date_time = n, e.end_date_time = a, t = n, r = a;
    }
    try {
      await this.hass.callService("calendar", "create_event", e, {
        entity_id: this._calendarEntityId
      });
    } catch (n) {
      this._error = n instanceof Error ? n.message : "Failed to create event", this._saving = !1;
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
A.styles = [
  D,
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
], A.prototype, "hass", 2);
R([
  p({ type: Object })
], A.prototype, "day", 2);
R([
  p({ type: Number })
], A.prototype, "startHour", 2);
R([
  p({ type: Array })
], A.prototype, "calendars", 2);
R([
  h()
], A.prototype, "_title", 2);
R([
  h()
], A.prototype, "_calendarEntityId", 2);
R([
  h()
], A.prototype, "_date", 2);
R([
  h()
], A.prototype, "_startTime", 2);
R([
  h()
], A.prototype, "_endTime", 2);
R([
  h()
], A.prototype, "_allDay", 2);
R([
  h()
], A.prototype, "_description", 2);
R([
  h()
], A.prototype, "_location", 2);
R([
  h()
], A.prototype, "_error", 2);
R([
  h()
], A.prototype, "_saving", 2);
A = R([
  w("lucarne-create-event-popover")
], A);
var gn = Object.defineProperty, vn = Object.getOwnPropertyDescriptor, z = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? vn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && gn(t, r, a), a;
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
    for (const n of e.calendars)
      if (!n.entity || !n.color)
        throw new Error('lucarne-calendar-card: each calendar requires "entity" and "color"');
    let t = e;
    if (e.visible_hours) {
      const n = /^\d{1,2}:\d{2}$/;
      if (!n.test(e.visible_hours.start) || !n.test(e.visible_hours.end))
        throw new Error('lucarne-calendar-card: "visible_hours" start and end must be in HH:MM format');
      const a = parseInt(e.visible_hours.start.split(":")[0], 10), s = parseInt(e.visible_hours.end.split(":")[0], 10);
      if (a < 0 || s > 24 || a >= s)
        throw new Error('lucarne-calendar-card: "visible_hours" must satisfy 0 <= start < end <= 24');
      t = {
        ...e,
        visible_hours: {
          start: `${String(a).padStart(2, "0")}:00`,
          end: `${String(s).padStart(2, "0")}:00`
        }
      };
    }
    const r = this._config;
    if (this._config = t, this._visibleIds = new Set(e.calendars.map((n) => n.entity)), this.hass && this._updateCreatableCalendars(), this._rolling)
      this._rolling.updateCalendars(t.calendars), (r == null ? void 0 : r.render_buffer_days) !== t.render_buffer_days && this._rolling.setBufferDays(t.render_buffer_days), ((r == null ? void 0 : r.min_days) !== e.min_days || (r == null ? void 0 : r.max_days) !== e.max_days || (r == null ? void 0 : r.min_col_width) !== e.min_col_width || (r == null ? void 0 : r.max_col_width) !== e.max_col_width) && this._onResize();
    else {
      const n = this._effectiveConfig();
      this._lastVisibleCount = n.minDays, this._rolling = new Fa(this, {
        calendars: t.calendars,
        visibleCount: n.minDays,
        bufferDays: t.render_buffer_days,
        onFetchComplete: (a, s) => this._onFetchComplete(a, s),
        onChange: () => this._recompute()
      });
    }
  }
  static getStubConfig(e) {
    const t = Object.keys(e.states).filter((a) => a.startsWith("calendar.")).slice(0, 3), r = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], n = t.map((a, s) => ({
      entity: a,
      color: r[s] ?? "#a8d8b9"
    }));
    return {
      type: "custom:lucarne-calendar-card",
      title: "Calendar",
      calendars: n.length ? n : [{ entity: "calendar.example", color: "#a8d8b9" }],
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
      this._previewOverrideRaf = void 0, this.isConnected && (this._previewOverride = fr(this));
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
      var n;
      this._resizeFrame = void 0;
      const e = ((n = this._gridAreaEl) == null ? void 0 : n.getBoundingClientRect().width) ?? 0, { visibleCount: t, dayWidthPx: r } = Ha(e, this._effectiveConfig());
      t !== this._lastVisibleCount && (this._lastVisibleCount = t, this._rolling.setVisibleCount(t), this.style.setProperty("--lucarne-day-count", String(t))), this._dayWidthPx = r;
    }));
  }
  _recompute() {
    var s, i;
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
    const t = this._deletedUids.size > 0 ? e.filter((o) => !o.uid || !this._deletedUids.has(o.uid)) : e, r = ((s = this._config.visible_hours) == null ? void 0 : s.start) ?? "07:00", n = ((i = this._config.visible_hours) == null ? void 0 : i.end) ?? "21:00", a = this._rolling.renderDays;
    this._layout = La(t, a, r, n);
  }
  _supportsCreate(e) {
    var r, n, a;
    const t = (a = (n = (r = this.hass) == null ? void 0 : r.states[e]) == null ? void 0 : n.attributes) == null ? void 0 : a.supported_features;
    return t !== void 0 && (t & 1) !== 0;
  }
  _updateCreatableCalendars() {
    if (!this._config || !this.hass) return;
    const e = this._config.calendars.filter((r) => this._supportsCreate(r.entity));
    e.length === this._creatableCalendars.length && e.every((r, n) => {
      var a;
      return r.entity === ((a = this._creatableCalendars[n]) == null ? void 0 : a.entity);
    }) || (this._creatableCalendars = e);
  }
  _onVisibilityChange(e) {
    this._visibleIds = e.detail, this._recompute();
  }
  _onEventTap(e) {
    var n, a;
    const { event: t, color: r } = e.detail;
    if (this._openEvent = t, this._openEventColor = r, (n = t.uid) != null && n.includes("::")) {
      const s = t.uid.split("::")[0];
      this._openEventEntityId = s;
      const i = (a = this._config) == null ? void 0 : a.calendars.find((o) => o.entity === s);
      this._openEventCalLabel = i ? wr(i, this.hass) : "";
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
        for (const s of a)
          s.uid && r.add(s.uid);
      const n = /* @__PURE__ */ new Set();
      for (const a of this._deletedUids) {
        const s = a.includes("::") ? a.split("::")[0] : "";
        (t.has(s) || r.has(a)) && n.add(a);
      }
      this._deletedUids = n;
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
    const t = e[0], r = e[e.length - 1], n = (i, o) => i.toLocaleDateString("en-US", o), a = t.getMonth() === r.getMonth() && t.getFullYear() === r.getFullYear(), s = t.getFullYear() === r.getFullYear();
    return a ? `${n(t, { month: "short", day: "numeric" })} – ${n(r, { day: "numeric" })}` : s ? `${n(t, { month: "short", day: "numeric" })} – ${n(r, { month: "short", day: "numeric" })}` : `${n(t, { month: "short", day: "numeric", year: "numeric" })} – ${n(r, { month: "short", day: "numeric", year: "numeric" })}`;
  }
  render() {
    var a, s;
    if (!this._config) return l``;
    const e = ((a = this._config.visible_hours) == null ? void 0 : a.start) ?? "07:00", t = ((s = this._config.visible_hours) == null ? void 0 : s.end) ?? "21:00", r = Kt(this._config.calendars, this.hass), n = Kt(this._creatableCalendars, this.hass);
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
                .calendars=${n}
                @popover-close=${this._closeCreatePopover}
                @lucarne-event-created=${this._onEventCreated}
              ></lucarne-create-event-popover>
            ` : ""}
      </ha-card>
    `;
  }
};
I.styles = [
  D,
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
  hr(".grid-area")
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
var _n = Object.defineProperty, yn = Object.getOwnPropertyDescriptor, Ue = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? yn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && _n(t, r, a), a;
};
let ce = class extends v {
  constructor() {
    super(...arguments), this._haReady = !1, this._invalid = {};
  }
  connectedCallback() {
    super.connectedCallback(), br().catch((e) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", e)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(e) {
    this._config = e;
  }
  _fire(e) {
    _t(this, "config-changed", { config: e });
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
    var n, a;
    const r = [...((n = this._config) == null ? void 0 : n.calendars) ?? []];
    r[e] = { ...r[e], entity: ((a = t.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, calendars: r });
  }
  _calColorChanged(e, t) {
    var n;
    const r = [...((n = this._config) == null ? void 0 : n.calendars) ?? []];
    r[e] = { ...r[e], color: t.target.value }, this._fire({ ...this._config, calendars: r });
  }
  _removeCalendar(e) {
    var r;
    const t = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    t.length <= 1 || (t.splice(e, 1), this._fire({ ...this._config, calendars: t }));
  }
  _windowFieldChanged(e, t) {
    const r = t.target, n = r.value === "" ? void 0 : r.valueAsNumber, a = n !== void 0 && Number.isFinite(n) ? n : void 0, s = { ...this._config, [e]: a }, i = s.min_days ?? 3, o = s.max_days ?? 7, c = s.min_col_width ?? 140, d = s.max_col_width ?? 220;
    this._invalid = {
      days: i > o,
      cols: c > d
    }, this._fire(s);
  }
  _addCalendar() {
    var n, a;
    const t = Object.keys(((n = this.hass) == null ? void 0 : n.states) ?? {}).find((s) => s.startsWith("calendar.")) ?? "calendar.example", r = [
      ...((a = this._config) == null ? void 0 : a.calendars) ?? [],
      { entity: t, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  render() {
    var c, d;
    if (!this._config) return l``;
    if (!this._haReady) return l`<div class="loading">Loading editor…</div>`;
    const e = this._config.calendars ?? [], t = ((c = this._config.visible_hours) == null ? void 0 : c.start) ?? "07:00", r = ((d = this._config.visible_hours) == null ? void 0 : d.end) ?? "21:00", n = this._config.show_create_button ?? !0, a = this._config.min_days, s = this._config.max_days, i = this._config.min_col_width, o = this._config.max_col_width;
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
          .checked=${n}
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
            .value=${s !== void 0 ? String(s) : ""}
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
ce.styles = [D, yr];
Ue([
  p({ attribute: !1 })
], ce.prototype, "hass", 2);
Ue([
  h()
], ce.prototype, "_config", 2);
Ue([
  h()
], ce.prototype, "_haReady", 2);
Ue([
  h()
], ce.prototype, "_invalid", 2);
ce = Ue([
  w("lucarne-calendar-card-editor")
], ce);
var bn = Object.defineProperty, wn = Object.getOwnPropertyDescriptor, at = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? wn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && bn(t, r, a), a;
};
const $n = /^(?=.*[\p{Extended_Pictographic}\p{Regional_Indicator}])[\p{Extended_Pictographic}\p{Emoji_Component}\p{Emoji_Modifier}\p{Regional_Indicator}‍️]+$/u;
let ye = class extends v {
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
    if (e && $n.test(e))
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
ye.styles = b`
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
at([
  p()
], ye.prototype, "name", 2);
at([
  p()
], ye.prototype, "color", 2);
at([
  p()
], ye.prototype, "avatar", 2);
ye = at([
  w("lucarne-member-avatar")
], ye);
var xn = Object.defineProperty, kn = Object.getOwnPropertyDescriptor, kr = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? kn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && xn(t, r, a), a;
};
let Ze = class extends v {
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
Ze.styles = b`
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
kr([
  p({ type: Number })
], Ze.prototype, "streak", 2);
Ze = kr([
  w("lucarne-streak-display")
], Ze);
var Cn = Object.defineProperty, En = Object.getOwnPropertyDescriptor, bt = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? En(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Cn(t, r, a), a;
};
let je = class extends v {
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
je.styles = b`
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
bt([
  p({ attribute: "kid-slug" })
], je.prototype, "kidSlug", 2);
bt([
  p({ type: Boolean })
], je.prototype, "active", 2);
je = bt([
  w("lucarne-celebration-overlay")
], je);
var Dn = Object.defineProperty, Sn = Object.getOwnPropertyDescriptor, re = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Sn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Dn(t, r, a), a;
};
function Mn(e) {
  return [...e].sort((t, r) => t.summary.localeCompare(r.summary));
}
function Tn(e) {
  return [...e].sort((t, r) => t.due && r.due ? t.due.localeCompare(r.due) : t.due ? -1 : r.due ? 1 : t.summary.localeCompare(r.summary));
}
let B = class extends v {
  constructor() {
    super(...arguments), this.tasks = [], this.streak = 0, this.showRoutines = !0, this.showTasks = !0, this.showStreak = !0, this._celebrating = !1, this._celebrationTimer = null, this._lastAllRoutinesDone = null;
  }
  updated(e) {
    if (super.updated(e), !e.has("tasks")) return;
    const t = this.tasks.filter((n) => n.metadata.type === "routine");
    if (t.length === 0) return;
    const r = t.every((n) => n.status === "completed");
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
    const e = Mn(this.tasks.filter((r) => r.metadata.type === "routine")), t = Tn(this.tasks.filter((r) => r.metadata.type === "chore"));
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
re([
  p({ attribute: !1 })
], B.prototype, "member", 2);
re([
  p({ attribute: !1 })
], B.prototype, "tasks", 2);
re([
  p({ type: Number })
], B.prototype, "streak", 2);
re([
  p({ type: Boolean, attribute: "show-routines" })
], B.prototype, "showRoutines", 2);
re([
  p({ type: Boolean, attribute: "show-tasks" })
], B.prototype, "showTasks", 2);
re([
  p({ type: Boolean, attribute: "show-streak" })
], B.prototype, "showStreak", 2);
re([
  h()
], B.prototype, "_celebrating", 2);
B = re([
  w("lucarne-member-column")
], B);
async function Pn(e, t) {
  const r = {
    member: t.member,
    summary: t.summary,
    type: t.type
  };
  t.recurrence !== void 0 && (r.recurrence = t.recurrence), t.icon !== void 0 && (r.icon = t.icon), t.due !== void 0 && (r.due = t.due), t.source !== void 0 && (r.source = t.source), t.assignee !== void 0 && (r.assignee = t.assignee), await e.callService("lucarne_family", "add_task", r);
}
async function On(e, t, r) {
  const n = { uid: t };
  r.type !== void 0 && (n.type = r.type), r.recurrence !== void 0 && (n.recurrence = r.recurrence), r.icon !== void 0 && (n.icon = r.icon), r.assignee !== void 0 && (n.assignee = r.assignee), await e.callService("lucarne_family", "update_task_metadata", n);
}
async function An(e, t) {
  await e.callService("lucarne_family", "delete_task", { uid: t });
}
async function In(e, t, r) {
  const n = await r.arrayBuffer(), a = new Uint8Array(n);
  let s = "";
  for (const o of a)
    s += String.fromCharCode(o);
  const i = btoa(s);
  await e.callService("lucarne_family", "upload_avatar", {
    member: t,
    image_data: i,
    mime_type: r.type
  });
}
async function Rn(e, t, r) {
  await e.callService("lucarne_family", "set_member_avatar", {
    member: t,
    avatar: r
  });
}
var zn = Object.defineProperty, Nn = Object.getOwnPropertyDescriptor, M = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Nn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && zn(t, r, a), a;
};
const jn = ["🪥", "🛏️", "🎒", "💗", "📵", "🧸", "👕", "🧹", "🧺", "🍽️", "🐕", "🌱"];
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
        await Pn(this.hass, {
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
    const e = this._selectedMemberSlug === "household", t = this._buildRRule(), r = t ? _r(t) : "One-off (no repeat)", n = {
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
            ${jn.map((a) => l`
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
      const s = parseInt(a.target.value, 10);
      this._recurrenceInterval = isNaN(s) || s < 1 ? 1 : s;
    }}
                          />
                        </div>
                      ` : ""}

                  ${this._recurrenceMode === "weekly" ? l`
                        <div>
                          <label>Days</label>
                          <div class="days-row">
                            ${ve.map((a) => l`
                              <button
                                class="day-btn ${this._recurrenceDays.includes(a) ? "selected" : ""}"
                                @click=${() => this._toggleDay(a)}
                              >${n[a]}</button>
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
      const s = parseInt(a.target.value, 10);
      this._recurrenceMonthDay = isNaN(s) || s < 1 ? 1 : Math.min(s, 31);
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
                              ${ve.map((a) => l`<option value=${a}>${n[a]}</option>`)}
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
      const s = parseInt(a.target.value, 10);
      this._recurrenceInterval = isNaN(s) || s < 1 ? 1 : s;
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
      const s = parseInt(a.target.value, 10);
      this._recurrenceMonth = isNaN(s) || s < 1 ? 1 : Math.min(s, 12);
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
      const s = parseInt(a.target.value, 10);
      this._recurrenceMonthDay = isNaN(s) || s < 1 ? 1 : Math.min(s, 31);
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
      const s = parseInt(a.target.value, 10);
      this._recurrenceInterval = isNaN(s) || s < 1 ? 1 : s;
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
  D,
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
M([
  p({ attribute: !1 })
], E.prototype, "hass", 2);
M([
  p({ attribute: !1 })
], E.prototype, "member", 2);
M([
  p({ attribute: !1 })
], E.prototype, "members", 2);
M([
  h()
], E.prototype, "_selectedMemberSlug", 2);
M([
  h()
], E.prototype, "_summary", 2);
M([
  h()
], E.prototype, "_type", 2);
M([
  h()
], E.prototype, "_icon", 2);
M([
  h()
], E.prototype, "_recurrenceMode", 2);
M([
  h()
], E.prototype, "_recurrenceDays", 2);
M([
  h()
], E.prototype, "_recurrenceInterval", 2);
M([
  h()
], E.prototype, "_recurrenceMonthDay", 2);
M([
  h()
], E.prototype, "_recurrenceNth", 2);
M([
  h()
], E.prototype, "_recurrenceNthDay", 2);
M([
  h()
], E.prototype, "_recurrenceMonth", 2);
M([
  h()
], E.prototype, "_due", 2);
M([
  h()
], E.prototype, "_assignee", 2);
M([
  h()
], E.prototype, "_error", 2);
M([
  h()
], E.prototype, "_saving", 2);
E = M([
  w("lucarne-add-task-popover")
], E);
var Ln = Object.defineProperty, Hn = Object.getOwnPropertyDescriptor, S = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Hn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Ln(t, r, a), a;
};
let $ = class extends v {
  constructor() {
    super(...arguments), this.members = [], this._summary = "", this._type = "chore", this._icon = "", this._recurrenceMode = "none", this._recurrenceDays = [], this._recurrenceInterval = 1, this._recurrenceMonthDay = 1, this._recurrenceNth = 1, this._recurrenceNthDay = "MO", this._recurrenceMonth = 1, this._due = "", this._assignee = "", this._isCustomRecurrence = !1, this._rawRecurrence = "", this._error = "", this._saving = !1, this._confirmingDelete = !1;
  }
  updated(e) {
    super.updated(e), e.has("task") && this.task && this._prefill();
  }
  _prefill() {
    const e = this.task;
    this._summary = e.summary, this._type = e.metadata.type, this._icon = e.metadata.icon, this._due = e.due ?? "", this._assignee = e.metadata.assignee_slug, this._recurrenceDays = [], this._recurrenceInterval = 1, this._recurrenceMonthDay = 1, this._recurrenceNth = 1, this._recurrenceNthDay = "MO", this._recurrenceMonth = 1, this._rawRecurrence = "", this._isCustomRecurrence = !1;
    const t = gt(e.metadata.recurrence);
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
        const t = this.task.metadata.member_slug === "household" ? "todo.lucarne_household" : ((e = this.members.find((s) => s.slug === this.task.metadata.member_slug)) == null ? void 0 : e.todo_entity_id) ?? "", r = this._summary.trim() !== this.task.summary, n = !!this._due && this._due !== (this.task.due ?? ""), a = this._type !== this.task.metadata.type || this._icon !== this.task.metadata.icon || this._buildRRule() !== this.task.metadata.recurrence || this.task.metadata.member_slug === "household" && this._assignee !== this.task.metadata.assignee_slug;
        if (r || n) {
          if (!t) throw new Error("Could not resolve todo entity for this task");
          await this.hass.callService("todo", "update_item", {
            item: this.task.uid,
            rename: this._summary.trim(),
            ...n ? { due_datetime: this._due } : {}
          }, { entity_id: t });
        }
        if (a) {
          const s = this.task.metadata.member_slug === "household";
          await On(this.hass, this.task.uid, {
            ...this._type !== this.task.metadata.type ? { type: this._type } : {},
            ...this._icon !== this.task.metadata.icon ? { icon: this._icon } : {},
            ...this._buildRRule() !== this.task.metadata.recurrence ? { recurrence: this._buildRRule() } : {},
            ...s && this._assignee !== this.task.metadata.assignee_slug ? { assignee: this._assignee } : {}
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
        await An(this.hass, this.task.uid), this._close();
      } catch (e) {
        this._error = e instanceof Error ? e.message : "Failed to delete", this._saving = !1, this._confirmingDelete = !1;
      }
    }
  }
  _toggleDay(e) {
    this._recurrenceDays.includes(e) ? this._recurrenceDays = this._recurrenceDays.filter((t) => t !== e) : this._recurrenceDays = [...this._recurrenceDays, e];
  }
  render() {
    var s;
    if (!this.task) return l``;
    const e = this.task.metadata.member_slug === "household", t = e ? "Household" : ((s = this.members.find((i) => i.slug === this.task.metadata.member_slug)) == null ? void 0 : s.name) ?? this.task.metadata.member_slug, r = this._buildRRule(), n = this._isCustomRecurrence ? "Custom recurrence (not editable here)" : _r(r), a = {
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
          ${this._isCustomRecurrence ? l`<div class="custom-recurrence-note">${n}</div>` : l`
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
                                  ${ve.map((i) => l`
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
                                    ${ve.map((i) => l`<option value=${i}>${a[i]}</option>`)}
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
                      <div class="recurrence-summary">${n}</div>
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
$.styles = [
  D,
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
S([
  p({ attribute: !1 })
], $.prototype, "hass", 2);
S([
  p({ attribute: !1 })
], $.prototype, "task", 2);
S([
  p({ attribute: !1 })
], $.prototype, "members", 2);
S([
  h()
], $.prototype, "_summary", 2);
S([
  h()
], $.prototype, "_type", 2);
S([
  h()
], $.prototype, "_icon", 2);
S([
  h()
], $.prototype, "_recurrenceMode", 2);
S([
  h()
], $.prototype, "_recurrenceDays", 2);
S([
  h()
], $.prototype, "_recurrenceInterval", 2);
S([
  h()
], $.prototype, "_recurrenceMonthDay", 2);
S([
  h()
], $.prototype, "_recurrenceNth", 2);
S([
  h()
], $.prototype, "_recurrenceNthDay", 2);
S([
  h()
], $.prototype, "_recurrenceMonth", 2);
S([
  h()
], $.prototype, "_due", 2);
S([
  h()
], $.prototype, "_assignee", 2);
S([
  h()
], $.prototype, "_isCustomRecurrence", 2);
S([
  h()
], $.prototype, "_rawRecurrence", 2);
S([
  h()
], $.prototype, "_error", 2);
S([
  h()
], $.prototype, "_saving", 2);
S([
  h()
], $.prototype, "_confirmingDelete", 2);
$ = S([
  w("lucarne-edit-task-popover")
], $);
var Un = Object.defineProperty, Fn = Object.getOwnPropertyDescriptor, xe = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Fn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Un(t, r, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-chores-card",
  name: "Lucarne Chores",
  description: "Family chore grid with streaks and celebration",
  preview: !0
});
let ee = class extends v {
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
    super.connectedCallback(), this.hass && !this._unsubFamily && (this._unsubFamily = Ae(this.hass, (e) => {
      this._familyState = e;
    }));
  }
  updated(e) {
    super.updated(e), e.has("hass") && this.hass && !this._unsubFamily && (this._unsubFamily = Ae(this.hass, (t) => {
      this._familyState = t;
    }));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._unsubFamily) == null || e.call(this), this._unsubFamily = void 0;
  }
  _resolveMembers() {
    if (!this._config || !this._familyState) return [];
    const { members: e } = this._config, t = this._config.show_routines ?? !0, r = this._config.show_tasks ?? !0, n = /* @__PURE__ */ new Date(), a = new Date(n.getFullYear(), n.getMonth(), n.getDate(), 23, 59, 59, 999), s = [];
    for (const i of e) {
      const o = i === "household" ? Se : this._familyState.members.find((m) => m.slug === i) ?? null;
      if (!o) continue;
      const d = (this._familyState.tasksByMember.get(i) ?? []).filter((m) => m.metadata.type === "routine" ? t : m.metadata.type === "chore" && r ? m.due === null ? !0 : (m.due.includes("T") ? new Date(m.due) : /* @__PURE__ */ new Date(m.due + "T00:00:00")) <= a : !1), u = this._familyState.streakByMember.get(i) ?? 0;
      s.push({ member: o, tasks: d, streak: u });
    }
    return s;
  }
  async _handleTaskToggle(e) {
    var a;
    const { task: t } = e.detail;
    if (!this.hass || !this._familyState) return;
    const r = t.status === "completed" ? "needs_action" : "completed", n = t.metadata.member_slug === "household" ? "todo.lucarne_household" : ((a = this._familyState.members.find((s) => s.slug === t.metadata.member_slug)) == null ? void 0 : a.todo_entity_id) ?? "";
    n && await this.hass.callService("todo", "update_item", { item: t.uid, status: r }, { entity_id: n });
  }
  _handleAddTask(e) {
    const { memberSlug: t } = e.detail;
    if (!this._familyState) return;
    const r = t === "household" ? Se : this._familyState.members.find((n) => n.slug === t) ?? null;
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
    const e = this._config.title ?? "Chores", t = this._config.show_routines ?? !0, r = this._config.show_tasks ?? !0, n = this._config.show_streak ?? !0;
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
    const a = this._resolveMembers(), s = [...this._familyState.members, Se];
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
                ?show-streak=${n}
              ></lucarne-member-column>
            </div>
          `)}
        </div>
      </ha-card>

      ${this._addTaskMember !== null ? l`
            <lucarne-add-task-popover
              .hass=${this.hass}
              .member=${this._addTaskMember}
              .members=${s}
              @popover-close=${() => {
      this._addTaskMember = null;
    }}
            ></lucarne-add-task-popover>
          ` : ""}

      ${this._editTask !== null ? l`
            <lucarne-edit-task-popover
              .hass=${this.hass}
              .task=${this._editTask}
              .members=${s}
              @popover-close=${() => {
      this._editTask = null;
    }}
            ></lucarne-edit-task-popover>
          ` : ""}
    `;
  }
};
ee.styles = [
  D,
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
xe([
  p({ attribute: !1 })
], ee.prototype, "hass", 2);
xe([
  h()
], ee.prototype, "_config", 2);
xe([
  h()
], ee.prototype, "_familyState", 2);
xe([
  h()
], ee.prototype, "_addTaskMember", 2);
xe([
  h()
], ee.prototype, "_editTask", 2);
ee = xe([
  w("lucarne-chores-card")
], ee);
var Bn = Object.defineProperty, Wn = Object.getOwnPropertyDescriptor, Y = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Wn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Bn(t, r, a), a;
};
const Yn = 2 * 1024 * 1024, Vn = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp"]), qn = [
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
let L = class extends v {
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
    var n;
    const r = ((n = e.target.files) == null ? void 0 : n[0]) ?? null;
    if (this._previewUrl && URL.revokeObjectURL(this._previewUrl), this._selectedFile = null, this._previewUrl = null, this._error = null, !!r) {
      if (!Vn.has(r.type)) {
        this._error = "Only PNG, JPEG, and WebP images are accepted.";
        return;
      }
      if (r.size > Yn) {
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
          await Rn(this.hass, this.memberSlug, this._selectedEmoji), this.dispatchEvent(new CustomEvent("avatar-changed", { detail: { avatar: this._selectedEmoji } })), this._close();
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
        await In(this.hass, this.memberSlug, this._selectedFile), this.dispatchEvent(new CustomEvent("avatar-changed")), this._close();
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
        ${qn.map(
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
L.styles = [
  D,
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
], L.prototype, "hass", 2);
Y([
  p()
], L.prototype, "memberSlug", 2);
Y([
  p()
], L.prototype, "memberName", 2);
Y([
  h()
], L.prototype, "_mode", 2);
Y([
  h()
], L.prototype, "_selectedEmoji", 2);
Y([
  h()
], L.prototype, "_selectedFile", 2);
Y([
  h()
], L.prototype, "_previewUrl", 2);
Y([
  h()
], L.prototype, "_error", 2);
Y([
  h()
], L.prototype, "_submitting", 2);
L = Y([
  w("lucarne-avatar-upload-modal")
], L);
var Kn = Object.defineProperty, Xn = Object.getOwnPropertyDescriptor, Fe = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Xn(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (a = (n ? i(t, r, a) : i(a)) || a);
  return n && a && Kn(t, r, a), a;
};
let de = class extends v {
  constructor() {
    super(...arguments), this._familyState = null, this._avatarModalMember = null;
  }
  setConfig(e) {
    this._config = e;
  }
  connectedCallback() {
    super.connectedCallback(), this.hass && !this._unsubFamily && (this._unsubFamily = Ae(this.hass, (e) => {
      this._familyState = e;
    }));
  }
  updated(e) {
    super.updated(e), e.has("hass") && this.hass && !this._unsubFamily && (this._unsubFamily = Ae(this.hass, (t) => {
      this._familyState = t;
    }));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._unsubFamily) == null || e.call(this), this._unsubFamily = void 0;
  }
  _fire(e) {
    const t = { ...e };
    delete t.kids, Array.isArray(t.members) || (t.members = []), _t(this, "config-changed", { config: t });
  }
  _titleChanged(e) {
    const t = e.target.value;
    this._fire({ ...this._config, title: t || void 0 });
  }
  _memberToggled(e, t) {
    var n;
    const r = [...((n = this._config) == null ? void 0 : n.members) ?? []];
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
    const e = [...this._familyState.members, Se], t = this._config.members ?? [];
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
              @change=${(n) => this._memberToggled(r.slug, n.target.checked)}
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
      ([r, n]) => l`
          <div class="toggle-row">
            <input
              type="checkbox"
              id="ed-${r}"
              .checked=${this._config[r] ?? !0}
              @change=${(a) => this._toggleChanged(r, a)}
            />
            <label for="ed-${r}">${n}</label>
          </div>
        `
    )}
    `;
  }
};
de.styles = [
  D,
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
Fe([
  p({ attribute: !1 })
], de.prototype, "hass", 2);
Fe([
  h()
], de.prototype, "_config", 2);
Fe([
  h()
], de.prototype, "_familyState", 2);
Fe([
  h()
], de.prototype, "_avatarModalMember", 2);
de = Fe([
  w("lucarne-chores-card-editor")
], de);
//# sourceMappingURL=ha-lucarne.js.map
