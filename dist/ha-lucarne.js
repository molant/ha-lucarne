/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const je = globalThis, nt = je.ShadowRoot && (je.ShadyCSS === void 0 || je.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, st = Symbol(), gt = /* @__PURE__ */ new WeakMap();
let Qt = class {
  constructor(e, r, n) {
    if (this._$cssResult$ = !0, n !== st) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = r;
  }
  get styleSheet() {
    let e = this.o;
    const r = this.t;
    if (nt && e === void 0) {
      const n = r !== void 0 && r.length === 1;
      n && (e = gt.get(r)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && gt.set(r, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const yr = (t) => new Qt(typeof t == "string" ? t : t + "", void 0, st), b = (t, ...e) => {
  const r = t.length === 1 ? t[0] : e.reduce((n, a, s) => n + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[s + 1], t[0]);
  return new Qt(r, t, st);
}, _r = (t, e) => {
  if (nt) t.adoptedStyleSheets = e.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of e) {
    const n = document.createElement("style"), a = je.litNonce;
    a !== void 0 && n.setAttribute("nonce", a), n.textContent = r.cssText, t.appendChild(n);
  }
}, vt = nt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let r = "";
  for (const n of e.cssRules) r += n.cssText;
  return yr(r);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: br, defineProperty: wr, getOwnPropertyDescriptor: xr, getOwnPropertyNames: $r, getOwnPropertySymbols: kr, getPrototypeOf: Cr } = Object, q = globalThis, yt = q.trustedTypes, Er = yt ? yt.emptyScript : "", Ze = q.reactiveElementPolyfillSupport, we = (t, e) => t, Fe = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Er : null;
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
} }, it = (t, e) => !br(t, e), _t = { attribute: !0, type: String, converter: Fe, reflect: !1, useDefault: !1, hasChanged: it };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), q.litPropertyMetadata ?? (q.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let oe = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, r = _t) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(e, r), !r.noAccessor) {
      const n = Symbol(), a = this.getPropertyDescriptor(e, n, r);
      a !== void 0 && wr(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, r, n) {
    const { get: a, set: s } = xr(this.prototype, e) ?? { get() {
      return this[r];
    }, set(i) {
      this[r] = i;
    } };
    return { get: a, set(i) {
      const o = a == null ? void 0 : a.call(this);
      s == null || s.call(this, i), this.requestUpdate(e, o, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? _t;
  }
  static _$Ei() {
    if (this.hasOwnProperty(we("elementProperties"))) return;
    const e = Cr(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(we("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(we("properties"))) {
      const r = this.properties, n = [...$r(r), ...kr(r)];
      for (const a of n) this.createProperty(a, r[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const r = litPropertyMetadata.get(e);
      if (r !== void 0) for (const [n, a] of r) this.elementProperties.set(n, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, n] of this.elementProperties) {
      const a = this._$Eu(r, n);
      a !== void 0 && this._$Eh.set(a, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const r = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const a of n) r.unshift(vt(a));
    } else e !== void 0 && r.push(vt(e));
    return r;
  }
  static _$Eu(e, r) {
    const n = r.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const n of r.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return _r(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((r) => {
      var n;
      return (n = r.hostConnected) == null ? void 0 : n.call(r);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((r) => {
      var n;
      return (n = r.hostDisconnected) == null ? void 0 : n.call(r);
    });
  }
  attributeChangedCallback(e, r, n) {
    this._$AK(e, n);
  }
  _$ET(e, r) {
    var s;
    const n = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, n);
    if (a !== void 0 && n.reflect === !0) {
      const i = (((s = n.converter) == null ? void 0 : s.toAttribute) !== void 0 ? n.converter : Fe).toAttribute(r, n.type);
      this._$Em = e, i == null ? this.removeAttribute(a) : this.setAttribute(a, i), this._$Em = null;
    }
  }
  _$AK(e, r) {
    var s, i;
    const n = this.constructor, a = n._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const o = n.getPropertyOptions(a), c = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((s = o.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? o.converter : Fe;
      this._$Em = a;
      const d = c.fromAttribute(r, o.type);
      this[a] = d ?? ((i = this._$Ej) == null ? void 0 : i.get(a)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, r, n, a = !1, s) {
    var i;
    if (e !== void 0) {
      const o = this.constructor;
      if (a === !1 && (s = this[e]), n ?? (n = o.getPropertyOptions(e)), !((n.hasChanged ?? it)(s, r) || n.useDefault && n.reflect && s === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(o._$Eu(e, n)))) return;
      this.C(e, r, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, r, { useDefault: n, reflect: a, wrapped: s }, i) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, i ?? r ?? this[e]), s !== !0 || i !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (r = void 0), this._$AL.set(e, r)), a === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
    let e = !1;
    const r = this._$AL;
    try {
      e = this.shouldUpdate(r), e ? (this.willUpdate(r), (n = this._$EO) == null || n.forEach((a) => {
        var s;
        return (s = a.hostUpdate) == null ? void 0 : s.call(a);
      }), this.update(r)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
    }
    e && this._$AE(r);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var r;
    (r = this._$EO) == null || r.forEach((n) => {
      var a;
      return (a = n.hostUpdated) == null ? void 0 : a.call(n);
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
oe.elementStyles = [], oe.shadowRootOptions = { mode: "open" }, oe[we("elementProperties")] = /* @__PURE__ */ new Map(), oe[we("finalized")] = /* @__PURE__ */ new Map(), Ze == null || Ze({ ReactiveElement: oe }), (q.reactiveElementVersions ?? (q.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe = globalThis, bt = (t) => t, Be = xe.trustedTypes, wt = Be ? Be.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Gt = "$lit$", V = `lit$${Math.random().toFixed(9).slice(2)}$`, Jt = "?" + V, Dr = `<${Jt}>`, re = document, ke = () => re.createComment(""), Ce = (t) => t === null || typeof t != "object" && typeof t != "function", ot = Array.isArray, Mr = (t) => ot(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", et = `[ 	
\f\r]`, _e = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, xt = /-->/g, $t = />/g, Z = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), kt = /'/g, Ct = /"/g, Zt = /^(?:script|style|textarea|title)$/i, er = (t) => (e, ...r) => ({ _$litType$: t, strings: e, values: r }), l = er(1), G = er(2), ae = Symbol.for("lit-noChange"), P = Symbol.for("lit-nothing"), Et = /* @__PURE__ */ new WeakMap(), ee = re.createTreeWalker(re, 129);
function tr(t, e) {
  if (!ot(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return wt !== void 0 ? wt.createHTML(e) : e;
}
const Sr = (t, e) => {
  const r = t.length - 1, n = [];
  let a, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = _e;
  for (let o = 0; o < r; o++) {
    const c = t[o];
    let d, u, m = -1, g = 0;
    for (; g < c.length && (i.lastIndex = g, u = i.exec(c), u !== null); ) g = i.lastIndex, i === _e ? u[1] === "!--" ? i = xt : u[1] !== void 0 ? i = $t : u[2] !== void 0 ? (Zt.test(u[2]) && (a = RegExp("</" + u[2], "g")), i = Z) : u[3] !== void 0 && (i = Z) : i === Z ? u[0] === ">" ? (i = a ?? _e, m = -1) : u[1] === void 0 ? m = -2 : (m = i.lastIndex - u[2].length, d = u[1], i = u[3] === void 0 ? Z : u[3] === '"' ? Ct : kt) : i === Ct || i === kt ? i = Z : i === xt || i === $t ? i = _e : (i = Z, a = void 0);
    const f = i === Z && t[o + 1].startsWith("/>") ? " " : "";
    s += i === _e ? c + Dr : m >= 0 ? (n.push(d), c.slice(0, m) + Gt + c.slice(m) + V + f) : c + V + (m === -2 ? o : f);
  }
  return [tr(t, s + (t[r] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class Ee {
  constructor({ strings: e, _$litType$: r }, n) {
    let a;
    this.parts = [];
    let s = 0, i = 0;
    const o = e.length - 1, c = this.parts, [d, u] = Sr(e, r);
    if (this.el = Ee.createElement(d, n), ee.currentNode = this.el.content, r === 2 || r === 3) {
      const m = this.el.content.firstChild;
      m.replaceWith(...m.childNodes);
    }
    for (; (a = ee.nextNode()) !== null && c.length < o; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const m of a.getAttributeNames()) if (m.endsWith(Gt)) {
          const g = u[i++], f = a.getAttribute(m).split(V), v = /([.?@])?(.*)/.exec(g);
          c.push({ type: 1, index: s, name: v[2], strings: f, ctor: v[1] === "." ? Pr : v[1] === "?" ? Ar : v[1] === "@" ? Or : qe }), a.removeAttribute(m);
        } else m.startsWith(V) && (c.push({ type: 6, index: s }), a.removeAttribute(m));
        if (Zt.test(a.tagName)) {
          const m = a.textContent.split(V), g = m.length - 1;
          if (g > 0) {
            a.textContent = Be ? Be.emptyScript : "";
            for (let f = 0; f < g; f++) a.append(m[f], ke()), ee.nextNode(), c.push({ type: 2, index: ++s });
            a.append(m[g], ke());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Jt) c.push({ type: 2, index: s });
      else {
        let m = -1;
        for (; (m = a.data.indexOf(V, m + 1)) !== -1; ) c.push({ type: 7, index: s }), m += V.length - 1;
      }
      s++;
    }
  }
  static createElement(e, r) {
    const n = re.createElement("template");
    return n.innerHTML = e, n;
  }
}
function ce(t, e, r = t, n) {
  var i, o;
  if (e === ae) return e;
  let a = n !== void 0 ? (i = r._$Co) == null ? void 0 : i[n] : r._$Cl;
  const s = Ce(e) ? void 0 : e._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== s && ((o = a == null ? void 0 : a._$AO) == null || o.call(a, !1), s === void 0 ? a = void 0 : (a = new s(t), a._$AT(t, r, n)), n !== void 0 ? (r._$Co ?? (r._$Co = []))[n] = a : r._$Cl = a), a !== void 0 && (e = ce(t, a._$AS(t, e.values), a, n)), e;
}
class Tr {
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
    const { el: { content: r }, parts: n } = this._$AD, a = ((e == null ? void 0 : e.creationScope) ?? re).importNode(r, !0);
    ee.currentNode = a;
    let s = ee.nextNode(), i = 0, o = 0, c = n[0];
    for (; c !== void 0; ) {
      if (i === c.index) {
        let d;
        c.type === 2 ? d = new Ae(s, s.nextSibling, this, e) : c.type === 1 ? d = new c.ctor(s, c.name, c.strings, this, e) : c.type === 6 && (d = new Ir(s, this, e)), this._$AV.push(d), c = n[++o];
      }
      i !== (c == null ? void 0 : c.index) && (s = ee.nextNode(), i++);
    }
    return ee.currentNode = re, a;
  }
  p(e) {
    let r = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, r), r += n.strings.length - 2) : n._$AI(e[r])), r++;
  }
}
class Ae {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, r, n, a) {
    this.type = 2, this._$AH = P, this._$AN = void 0, this._$AA = e, this._$AB = r, this._$AM = n, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
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
    e = ce(this, e, r), Ce(e) ? e === P || e == null || e === "" ? (this._$AH !== P && this._$AR(), this._$AH = P) : e !== this._$AH && e !== ae && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Mr(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== P && Ce(this._$AH) ? this._$AA.nextSibling.data = e : this.T(re.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: r, _$litType$: n } = e, a = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ee.createElement(tr(n.h, n.h[0]), this.options)), n);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === a) this._$AH.p(r);
    else {
      const i = new Tr(a, this), o = i.u(this.options);
      i.p(r), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let r = Et.get(e.strings);
    return r === void 0 && Et.set(e.strings, r = new Ee(e)), r;
  }
  k(e) {
    ot(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let n, a = 0;
    for (const s of e) a === r.length ? r.push(n = new Ae(this.O(ke()), this.O(ke()), this, this.options)) : n = r[a], n._$AI(s), a++;
    a < r.length && (this._$AR(n && n._$AB.nextSibling, a), r.length = a);
  }
  _$AR(e = this._$AA.nextSibling, r) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, r); e !== this._$AB; ) {
      const a = bt(e).nextSibling;
      bt(e).remove(), e = a;
    }
  }
  setConnected(e) {
    var r;
    this._$AM === void 0 && (this._$Cv = e, (r = this._$AP) == null || r.call(this, e));
  }
}
class qe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, r, n, a, s) {
    this.type = 1, this._$AH = P, this._$AN = void 0, this.element = e, this.name = r, this._$AM = a, this.options = s, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = P;
  }
  _$AI(e, r = this, n, a) {
    const s = this.strings;
    let i = !1;
    if (s === void 0) e = ce(this, e, r, 0), i = !Ce(e) || e !== this._$AH && e !== ae, i && (this._$AH = e);
    else {
      const o = e;
      let c, d;
      for (e = s[0], c = 0; c < s.length - 1; c++) d = ce(this, o[n + c], r, c), d === ae && (d = this._$AH[c]), i || (i = !Ce(d) || d !== this._$AH[c]), d === P ? e = P : e !== P && (e += (d ?? "") + s[c + 1]), this._$AH[c] = d;
    }
    i && !a && this.j(e);
  }
  j(e) {
    e === P ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pr extends qe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === P ? void 0 : e;
  }
}
class Ar extends qe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== P);
  }
}
class Or extends qe {
  constructor(e, r, n, a, s) {
    super(e, r, n, a, s), this.type = 5;
  }
  _$AI(e, r = this) {
    if ((e = ce(this, e, r, 0) ?? P) === ae) return;
    const n = this._$AH, a = e === P && n !== P || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, s = e !== P && (n === P || a);
    a && this.element.removeEventListener(this.name, this, n), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var r;
    typeof this._$AH == "function" ? this._$AH.call(((r = this.options) == null ? void 0 : r.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ir {
  constructor(e, r, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ce(this, e);
  }
}
const tt = xe.litHtmlPolyfillSupport;
tt == null || tt(Ee, Ae), (xe.litHtmlVersions ?? (xe.litHtmlVersions = [])).push("3.3.3");
const Rr = (t, e, r) => {
  const n = (r == null ? void 0 : r.renderBefore) ?? e;
  let a = n._$litPart$;
  if (a === void 0) {
    const s = (r == null ? void 0 : r.renderBefore) ?? null;
    n._$litPart$ = a = new Ae(e.insertBefore(ke(), s), s, void 0, r ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis;
let y = class extends oe {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Rr(r, this.renderRoot, this.renderOptions);
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
    return ae;
  }
};
var Xt;
y._$litElement$ = !0, y.finalized = !0, (Xt = te.litElementHydrateSupport) == null || Xt.call(te, { LitElement: y });
const rt = te.litElementPolyfillSupport;
rt == null || rt({ LitElement: y });
(te.litElementVersions ?? (te.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = (t) => (e, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nr = { attribute: !0, type: String, converter: Fe, reflect: !1, hasChanged: it }, zr = (t = Nr, e, r) => {
  const { kind: n, metadata: a } = r;
  let s = globalThis.litPropertyMetadata.get(a);
  if (s === void 0 && globalThis.litPropertyMetadata.set(a, s = /* @__PURE__ */ new Map()), n === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(r.name, t), n === "accessor") {
    const { name: i } = r;
    return { set(o) {
      const c = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(i, c, t, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(i, void 0, t, o), o;
    } };
  }
  if (n === "setter") {
    const { name: i } = r;
    return function(o) {
      const c = this[i];
      e.call(this, o), this.requestUpdate(i, c, t, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function p(t) {
  return (e, r) => typeof r == "object" ? zr(t, e, r) : ((n, a, s) => {
    const i = a.hasOwnProperty(s);
    return a.constructor.createProperty(s, n), i ? Object.getOwnPropertyDescriptor(a, s) : void 0;
  })(t, e, r);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function h(t) {
  return p({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Hr = (t, e, r) => (r.configurable = !0, r.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, r), r);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function rr(t, e) {
  return (r, n, a) => {
    const s = (i) => {
      var o;
      return ((o = i.renderRoot) == null ? void 0 : o.querySelector(t)) ?? null;
    };
    return Hr(r, n, { get() {
      return s(this);
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
function ar(t, e, r) {
  let n, a = !1;
  return t.connection.subscribeMessage(
    (s) => {
      var i, o;
      (o = (i = s.variables) == null ? void 0 : i.trigger) != null && o.to_state && r(s.variables.trigger.to_state);
    },
    { type: "subscribe_trigger", trigger: { platform: "state", entity_id: e } }
  ).then((s) => {
    a ? s() : n = s;
  }), () => {
    a = !0, n == null || n();
  };
}
function Dt(t) {
  return typeof t == "string" ? t : t && typeof t == "object" ? t.dateTime ?? t.date ?? "" : "";
}
function Lr(t) {
  const e = {
    start: Dt(t.start),
    end: Dt(t.end),
    summary: t.summary ?? ""
  };
  return t.description && (e.description = t.description), t.location && (e.location = t.location), t.uid && (e.uid = t.uid), t.recurrence_id && (e.recurrence_id = t.recurrence_id), t.rrule && (e.rrule = t.rrule), e;
}
async function nr(t, e, r, n) {
  const a = /* @__PURE__ */ new Set(), s = encodeURIComponent(r.toISOString()), i = encodeURIComponent(n.toISOString()), o = await Promise.all(
    e.map(
      (c) => t.callApi(
        "GET",
        `calendars/${encodeURIComponent(c)}?start=${s}&end=${i}`
      ).then((d) => [c, d.map(Lr)]).catch((d) => (console.warn(`[lucarne] GET /api/calendars/${c} failed:`, d), a.add(c), [c, []]))
    )
  );
  return { events: new Map(o), failed: a };
}
async function jr(t, e, r, n, a) {
  await t.connection.sendMessagePromise({
    type: "calendar/event/delete",
    entity_id: e,
    uid: r,
    recurrence_id: n,
    recurrence_range: a
  });
}
const Ur = 2;
function Fr(t, e) {
  var n, a;
  const r = (a = (n = t.states[e]) == null ? void 0 : n.attributes) == null ? void 0 : a.supported_features;
  return typeof r != "number" ? !1 : (r & Ur) !== 0;
}
function at(t, e, r) {
  const n = async () => {
    var a, s;
    try {
      const i = await t.connection.sendMessagePromise({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: {},
        target: { entity_id: e },
        return_response: !0
      });
      r(((s = (a = i == null ? void 0 : i.response) == null ? void 0 : a[e]) == null ? void 0 : s.items) ?? []);
    } catch (i) {
      console.warn(`[lucarne] todo.get_items failed for ${e}:`, i), r([]);
    }
  };
  return n(), ar(t, e, () => n());
}
function Br(t) {
  let e = t;
  for (; e; ) {
    if (e instanceof Element) {
      const a = e.tagName.toLowerCase();
      if (a === "hui-dialog-edit-card" || a === "ha-dialog") return !0;
    }
    const r = e.parentNode;
    if (r) {
      e = r;
      continue;
    }
    const n = e.getRootNode();
    e = n instanceof ShadowRoot ? n.host : null;
  }
  return !1;
}
function Wr(t) {
  let e = t.parentElement;
  for (; e && !e.style.getPropertyValue("--column-size"); )
    e = e.parentElement;
  return (e == null ? void 0 : e.parentElement) ?? null;
}
function sr(t) {
  if (!Br(t)) return null;
  const e = Wr(t);
  if (!e) return null;
  const r = e.style.getPropertyValue("--grid-column-count"), n = () => {
    e.style.getPropertyValue("--grid-column-count") !== "1" && e.style.setProperty("--grid-column-count", "1");
  };
  n();
  const a = new MutationObserver(n);
  return a.observe(e, { attributes: !0, attributeFilter: ["style"] }), {
    uninstall() {
      a.disconnect(), r ? e.style.setProperty("--grid-column-count", r) : e.style.removeProperty("--grid-column-count");
    }
  };
}
const D = {
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
var Yr = Object.defineProperty, Vr = Object.getOwnPropertyDescriptor, Ke = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Vr(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && Yr(e, r, a), a;
};
function $e(t) {
  return t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
}
function qr(t, e, r) {
  return t.filter((n) => $e(n.end) > e).sort((n, a) => $e(n.start).getTime() - $e(a.start).getTime()).slice(0, r);
}
function Kr(t, e, r) {
  const n = t.getTime() - r.getTime();
  if (t <= r && r < e) return D.timePillNow;
  if (n > 0 && n < 60 * 60 * 1e3) {
    const d = Math.round(n / 6e4);
    return D.timePillInMinutes(d);
  }
  if (n > 0 && n < 2 * 60 * 60 * 1e3) {
    const d = Math.round(n / 36e5);
    return D.timePillInHours(d);
  }
  const s = t.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (t.toDateString() === r.toDateString()) return s;
  const o = new Date(r);
  return o.setDate(r.getDate() + 1), t.toDateString() === o.toDateString() ? D.timePillTomorrow(s) : `${t.toLocaleDateString("en", { weekday: "short" })} ${s}`;
}
function Xr(t) {
  return t.start.length === 10 && t.end.length === 10;
}
let de = class extends y {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.limit = 5;
  }
  render() {
    const t = /* @__PURE__ */ new Date(), e = qr(this.events, t, this.limit);
    return e.length === 0 ? l`<div class="empty-state">${D.nothingOnCalendar}</div>` : l`
      ${e.map((r) => {
      const n = $e(r.start), a = $e(r.end), s = n <= t && t < a, i = Xr(r) ? "all day" : Kr(n, a, t), o = this._colorForEvent(r);
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
  _colorForEvent(t) {
    if (t.uid) {
      const e = t.uid.split("::")[0], r = this.calendarColors.get(e);
      if (r) return r;
    }
    return "var(--lucarne-color-family)";
  }
};
de.styles = [
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
Ke([
  p({ type: Array })
], de.prototype, "events", 2);
Ke([
  p({ type: Object })
], de.prototype, "calendarColors", 2);
Ke([
  p({ type: Number })
], de.prototype, "limit", 2);
de = Ke([
  w("lucarne-agenda-strip")
], de);
const Mt = G`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`, le = G`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>`, be = G`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`, St = G`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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
</svg>`, Qr = G`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M4.22 19.78l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="currentColor"/>
  <path d="M20 15h-1.26A6 6 0 1 0 8 20h12a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.7"/>
</svg>`;
G`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="7" r="4"/>
  <path d="M20 21a8 8 0 1 0-16 0"/>
</svg>`;
G`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"/>
</svg>`;
const Gr = G`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, Tt = {
  sunny: Mt,
  "clear-night": Mt,
  cloudy: le,
  fog: le,
  hail: be,
  lightning: be,
  "lightning-rainy": be,
  partlycloudy: Qr,
  pouring: be,
  rainy: be,
  snowy: St,
  "snowy-rainy": St,
  windy: le,
  "windy-variant": le,
  exceptional: le
};
function Pt(t) {
  return Tt[t] ?? Tt[t.toLowerCase()] ?? le;
}
const Jr = {
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
function At(t) {
  return Jr[t.toLowerCase()] ?? "#8aa0b8";
}
function Zr(t) {
  if (!t.length) return D.dressingTipDefault;
  const e = t[0];
  if (e.condition.toLowerCase().includes("snow"))
    return D.dressingTipBoots;
  const n = e.temperature;
  let a;
  return n < 5 ? a = D.dressingTipHeavyCoat : n < 12 ? a = D.dressingTipCoatScarf : n < 18 ? a = D.dressingTipLightJacket : n < 24 ? a = D.dressingTipTShirt : a = D.dressingTipShorts, (e.precipitation_probability ?? 0) > 50 && (a += D.dressingTipUmbrella), a;
}
var ea = Object.defineProperty, ta = Object.getOwnPropertyDescriptor, lt = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? ta(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && ea(e, r, a), a;
};
let De = class extends y {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return l`<div class="empty-state">${D.addWeatherEntity}</div>`;
    const t = this.weatherEntity.attributes, e = t.temperature, r = t.temperature_unit ?? "°C", n = this.weatherEntity.state, a = this.forecast[0], s = this.forecast[1], i = Zr(this.forecast);
    return l`
      <div class="current">
        <span class="condition-icon" style="color: ${At(n)}">${Pt(n)}</span>
        <div class="temp-group">
          <div class="current-temp">${e !== void 0 ? `${Math.round(e)}${r}` : D.errorUnavailable}</div>
          ${a ? l`<div class="high-low">
                ↑${Math.round(a.temperature)}${r}
                ${a.templow !== void 0 ? ` ↓${Math.round(a.templow)}${r}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${s ? l`
            <div class="tomorrow-row">
              <span class="tomorrow-icon" style="color: ${At(s.condition)}">${Pt(s.condition)}</span>
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
De.styles = [
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
lt([
  p({ attribute: !1 })
], De.prototype, "weatherEntity", 2);
lt([
  p({ type: Array })
], De.prototype, "forecast", 2);
De = lt([
  w("lucarne-weather-block")
], De);
var ra = Object.defineProperty, aa = Object.getOwnPropertyDescriptor, ct = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? aa(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && ra(e, r, a), a;
};
let Me = class extends y {
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
    const t = this.items.filter((a) => a.status === "needs_action"), e = t.length, r = t.slice(0, 3), n = e - r.length;
    return e === 0 ? l`
        <div class="empty-state">
          <span class="empty-icon">${Gr}</span>
          ${D.allDone}
        </div>
      ` : l`
      <div class="header">
        ${D.tasksTitle}
        <span class="count-badge">${e}</span>
      </div>
      ${r.map(
      (a) => l`
          <div class="task-row">
            <span class="summary">${a.summary}</span>
            ${a.due ? l`<span class="due-chip">${this._formatDue(a.due)}</span>` : ""}
          </div>
        `
    )}
      ${n > 0 ? l`<div class="more-row" @click=${this._handleMoreClick}>
            ${D.moreItems(n)}
          </div>` : ""}
    `;
  }
  _formatDue(t) {
    const e = t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
    return isNaN(e.getTime()) ? t : e.toLocaleDateString("en", { month: "short", day: "numeric" });
  }
};
Me.styles = [
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
ct([
  p({ type: Array })
], Me.prototype, "items", 2);
ct([
  p({ type: String })
], Me.prototype, "todoEntityId", 2);
Me = ct([
  w("lucarne-tasks-summary")
], Me);
var na = Object.defineProperty, sa = Object.getOwnPropertyDescriptor, ir = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? sa(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && na(e, r, a), a;
};
let We = class extends y {
  constructor() {
    super(...arguments), this.entries = [];
  }
  render() {
    return l`
      ${this.entries.map(
      (t) => l`
          <span class="pill ${t.isHome ? "home" : "away"}">
            <span class="dot"></span>
            ${t.name}
          </span>
        `
    )}
    `;
  }
};
We.styles = [
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
ir([
  p({ type: Array })
], We.prototype, "entries", 2);
We = ir([
  w("lucarne-presence-pills")
], We);
var ia = Object.defineProperty, oa = Object.getOwnPropertyDescriptor, ge = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? oa(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && ia(e, r, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-today-card",
  name: "Lucarne Today",
  description: "Family agenda + weather + tasks + presence",
  preview: !0
});
let K = class extends y {
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
    const e = Object.keys(t.states).filter((s) => s.startsWith("calendar.")).slice(0, 3), r = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], n = e.map((s, i) => ({
      entity: s,
      color: r[i] ?? "#a8d8b9"
    })), a = "weather.forecast_home" in t.states;
    return {
      type: "custom:lucarne-today-card",
      title: D.today,
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
      this._previewOverrideRaf = void 0, this.isConnected && (this._previewOverride = sr(this));
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
    }, 5 * 60 * 1e3), this._config.tasks && (this._todoUnsub = at(this.hass, this._config.tasks, (t) => {
      this._todoItems = t;
    })));
  }
  _teardownSubscriptions() {
    var t;
    clearInterval(this._calendarIntervalId), (t = this._todoUnsub) == null || t.call(this), this._todoUnsub = void 0, this._calendarIntervalId = void 0;
  }
  updated(t) {
    var n;
    if (super.updated(t), !t.has("hass") || !this._config) return;
    if (!t.get("hass") && this.hass && !this._calendarIntervalId) {
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
    const t = this._config.calendars.map((s) => s.entity), e = /* @__PURE__ */ new Date(), r = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), { events: n } = await nr(this.hass, t, e, r), a = /* @__PURE__ */ new Map();
    for (const [s, i] of n.entries())
      a.set(
        s,
        i.map((o) => ({ ...o, uid: `${s}::${o.uid ?? o.summary}` }))
      );
    this._calendarEvents = a;
  }
  async _fetchForecast() {
    var t, e, r;
    if (!(this._fetchingForecast || !((t = this._config) != null && t.weather) || !this.hass)) {
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
        this._forecast = ((r = (e = n == null ? void 0 : n.response) == null ? void 0 : e[this._config.weather]) == null ? void 0 : r.forecast) ?? [];
      } catch (n) {
        console.warn(`[lucarne] weather.get_forecasts failed for ${this._config.weather}:`, n), this._forecast = [];
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
    if (!this._config) return l``;
    const t = this._config.weather ? (r = this.hass) == null ? void 0 : r.states[this._config.weather] : void 0, e = (this._config.presence ?? []).map((n) => {
      var a, s;
      return {
        name: n.name,
        isHome: ((s = (a = this.hass) == null ? void 0 : a.states[n.entity]) == null ? void 0 : s.state) === "on"
      };
    });
    return l`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${this._config.title ?? D.today}</h2>
          ${e.length > 0 ? l`<lucarne-presence-pills .entries=${e}></lucarne-presence-pills>` : ""}
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
            ${this._config.tasks ? l`
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
K.styles = [
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
ge([
  p({ attribute: !1 })
], K.prototype, "hass", 2);
ge([
  h()
], K.prototype, "_config", 2);
ge([
  h()
], K.prototype, "_calendarEvents", 2);
ge([
  h()
], K.prototype, "_forecast", 2);
ge([
  h()
], K.prototype, "_todoItems", 2);
K = ge([
  w("lucarne-today-card")
], K);
const or = b`
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
`, Ot = ["ha-entity-picker", "ha-textfield"], la = 3e3;
let ze;
function ca(t) {
  return new Promise((e) => setTimeout(e, t));
}
async function da() {
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
    Ot.map((a) => customElements.whenDefined(a))
  ).then(() => "ready"), r = ca(la).then(() => "timeout");
  if (await Promise.race([e, r]) === "timeout" && !Ot.every((a) => customElements.get(a)))
    throw new Error("[lucarne] HA form elements did not register within timeout");
}
function lr() {
  return ze || (ze = da().catch((t) => {
    throw ze = void 0, t;
  })), ze;
}
var It, Rt;
(function(t) {
  t.language = "language", t.system = "system", t.comma_decimal = "comma_decimal", t.decimal_comma = "decimal_comma", t.space_comma = "space_comma", t.none = "none";
})(It || (It = {})), function(t) {
  t.language = "language", t.system = "system", t.am_pm = "12", t.twenty_four = "24";
}(Rt || (Rt = {}));
var dt = function(t, e, r, n) {
  n = n || {}, r = r ?? {};
  var a = new Event(e, { bubbles: n.bubbles === void 0 || n.bubbles, cancelable: !!n.cancelable, composed: n.composed === void 0 || n.composed });
  return a.detail = r, t.dispatchEvent(a), a;
}, ua = Object.defineProperty, ha = Object.getOwnPropertyDescriptor, Xe = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? ha(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && ua(e, r, a), a;
};
let ue = class extends y {
  constructor() {
    super(...arguments), this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), lr().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    dt(this, "config-changed", { config: t });
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
    var n, a;
    const r = [...((n = this._config) == null ? void 0 : n.calendars) ?? []];
    r[t] = { ...r[t], entity: ((a = e.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, calendars: r });
  }
  _calColorChanged(t, e) {
    var n;
    const r = [...((n = this._config) == null ? void 0 : n.calendars) ?? []];
    r[t] = { ...r[t], color: e.target.value }, this._fire({ ...this._config, calendars: r });
  }
  _removeCalendar(t) {
    var r;
    const e = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, calendars: e }));
  }
  _addCalendar() {
    var n, a;
    const e = Object.keys(((n = this.hass) == null ? void 0 : n.states) ?? {}).find((s) => s.startsWith("calendar.")) ?? "calendar.example", r = [
      ...((a = this._config) == null ? void 0 : a.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  _presenceEntityChanged(t, e) {
    var n, a;
    const r = [...((n = this._config) == null ? void 0 : n.presence) ?? []];
    r[t] = { ...r[t], entity: ((a = e.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, presence: r });
  }
  _presenceNameChanged(t, e) {
    var n;
    const r = [...((n = this._config) == null ? void 0 : n.presence) ?? []];
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
    if (!this._config) return l``;
    if (!this._haReady) return l`<div class="loading">Loading editor…</div>`;
    const t = this._config.calendars ?? [], e = this._config.presence ?? [];
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

      <div class="section-label">Calendars</div>
      ${t.map(
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
      ${e.map(
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
ue.styles = [M, or];
Xe([
  p({ attribute: !1 })
], ue.prototype, "hass", 2);
Xe([
  h()
], ue.prototype, "_config", 2);
Xe([
  h()
], ue.prototype, "_haReady", 2);
ue = Xe([
  w("lucarne-today-card-editor")
], ue);
function cr(t, e) {
  var n, a, s;
  const r = (s = (a = (n = e == null ? void 0 : e.states) == null ? void 0 : n[t.entity]) == null ? void 0 : a.attributes) == null ? void 0 : s.friendly_name;
  return typeof r == "string" && r ? r : t.entity;
}
function Nt(t, e) {
  return t.map((r) => ({ ...r, label: cr(r, e) }));
}
function zt(t, e) {
  const r = parseInt(t.split(":")[0], 10), n = parseInt(e.split(":")[0], 10), a = [];
  for (let s = r; s <= n; s++)
    a.push(s);
  return a;
}
function pa(t, e, r) {
  const [n, a] = e.split(":").map(Number), [s, i] = r.split(":").map(Number), o = new Date(t);
  o.setHours(n, a, 0, 0);
  const c = new Date(t);
  return c.setHours(s, i, 0, 0), { bandStartMs: o.getTime(), bandEndMs: c.getTime() };
}
function ma(t, e, r, n) {
  const a = Ht(t.start).getTime(), s = Ht(t.end).getTime(), { bandStartMs: i, bandEndMs: o } = pa(e, r, n), c = Math.max(a, i), d = Math.min(s, o);
  return c >= d ? null : { start: new Date(c), end: new Date(d) };
}
function Ht(t) {
  return t.length === 10 && !t.includes("T") ? /* @__PURE__ */ new Date(`${t}T00:00:00`) : new Date(t);
}
function fa(t) {
  return t.start.length === 10 && !t.start.includes("T");
}
function z(t) {
  const e = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), n = String(t.getDate()).padStart(2, "0");
  return `${e}-${r}-${n}`;
}
function dr(t) {
  return t.uid ?? `${t.start}|${t.end}|${t.summary ?? ""}`;
}
function ga(t) {
  if (t.length === 0) return [];
  const e = t.map((c, d) => ({ ...c, _idx: d }));
  e.sort((c, d) => c.start.getTime() - d.start.getTime());
  const r = [], n = new Array(t.length);
  for (const c of e) {
    const d = c.start.getTime();
    let u = r.findIndex((m) => m <= d);
    u === -1 ? (u = r.length, r.push(c.end.getTime())) : r[u] = c.end.getTime(), n[c._idx] = u;
  }
  const a = new Array(t.length), s = [];
  let i = 0, o = e[0].end.getTime();
  a[e[0]._idx] = 0, s.push(n[e[0]._idx]);
  for (let c = 1; c < e.length; c++) {
    const d = e[c];
    d.start.getTime() >= o ? (i++, s.push(0), o = d.end.getTime()) : o = Math.max(o, d.end.getTime()), a[d._idx] = i, s[i] = Math.max(s[i], n[d._idx]);
  }
  return n.map((c, d) => ({
    lane: c,
    laneCount: s[a[d]] + 1
  }));
}
function He(t, e) {
  const [r, n] = e.split(":").map(Number), a = new Date(t);
  return a.setHours(r, n, 0, 0), a.getTime();
}
function va(t, e, r, n) {
  const a = /* @__PURE__ */ new Map();
  for (const o of e)
    a.set(z(o), { allDay: [], inBand: [], earlier: [], later: [] });
  const s = e.length > 0 ? e[0] : null, i = e.length > 0 ? e[e.length - 1] : null;
  for (const o of t) {
    if (fa(o)) {
      const u = /* @__PURE__ */ new Date(o.start + "T00:00:00"), m = /* @__PURE__ */ new Date(o.end + "T00:00:00"), g = s !== null && u < s, f = i ? new Date(i) : null;
      f && f.setDate(f.getDate() + 1);
      const v = f !== null && m > f;
      for (const $ of e) {
        const _ = z($), k = a.get(_);
        if ($ >= u && $ < m && (k.allDay.push(o), g || v)) {
          k.allDayClipped || (k.allDayClipped = /* @__PURE__ */ new Map());
          const T = s !== null && z($) === z(s), L = i !== null && z($) === z(i);
          k.allDayClipped.set(dr(o), {
            left: g && T,
            right: v && L
          });
        }
      }
      continue;
    }
    const c = new Date(o.start), d = new Date(o.end);
    for (const u of e) {
      const m = z(u), g = a.get(m), f = new Date(u);
      f.setHours(0, 0, 0, 0);
      const v = new Date(u);
      if (v.setHours(23, 59, 59, 999), d <= f || c > v) continue;
      const $ = He(u, r), _ = He(u, n);
      if (d.getTime() <= $)
        g.earlier.push(o);
      else if (c.getTime() >= _)
        g.later.push(o);
      else {
        const k = ma(o, u, r, n);
        if (k) {
          const T = _ - $, L = (k.start.getTime() - $) / T * 100, mt = (k.end.getTime() - k.start.getTime()) / T * 100;
          g.inBand.push({
            event: o,
            lane: 0,
            laneCount: 1,
            topPercent: Math.max(0, Math.min(100, L)),
            heightPercent: Math.max(0, Math.min(100 - L, mt))
          });
        }
      }
    }
  }
  for (const o of e) {
    const c = z(o), d = a.get(c);
    if (d.inBand.length === 0) continue;
    const u = He(o, r), g = He(o, n) - u, f = d.inBand.map(($) => {
      const _ = u + $.topPercent / 100 * g, k = _ + $.heightPercent / 100 * g;
      return {
        event: $.event,
        start: new Date(_),
        end: new Date(k),
        lane: 0
      };
    }), v = ga(f);
    d.inBand = d.inBand.map(($, _) => ({
      ...$,
      lane: v[_].lane,
      laneCount: v[_].laneCount
    }));
  }
  return { days: e, perDay: a };
}
function ya(t, e) {
  const r = Math.min(e.minColWidth, e.maxColWidth), n = Math.max(e.minColWidth, e.maxColWidth), a = Math.min(e.minDays, e.maxDays), s = Math.max(e.minDays, e.maxDays), i = Math.max(0, t - e.timeColWidth);
  if (i <= 0)
    return { visibleCount: a, dayWidthPx: r };
  const o = Math.floor(i / r), c = Math.ceil(i / n), d = Math.min(s, Math.max(a, c, Math.min(o, s))), u = i / d;
  return { visibleCount: d, dayWidthPx: u };
}
function _a(t) {
  return `syn:${t.start}|${t.end}|${t.summary ?? ""}`;
}
function Lt(t) {
  if (t !== void 0 && !(typeof t != "number" || !Number.isFinite(t)))
    return Math.max(0, Math.floor(t));
}
function Le(t, e) {
  const r = new Date(t);
  return r.setDate(r.getDate() + e), r;
}
function jt(t) {
  const e = new Date(t);
  return e.setHours(0, 0, 0, 0), e;
}
class ba {
  constructor(e, r) {
    this._isConnected = !1, this._hasHass = !1, this._dayOffset = 0, this._fetchSeq = 0, this._cachedEvents = /* @__PURE__ */ new Map(), this._cachedDayKeys = /* @__PURE__ */ new Set(), this._host = e, this._opts = r, this._fetcher = r.fetcher ?? nr, this._pollIntervalMs = r.pollIntervalMs ?? 5 * 6e4, this._tickIntervalMs = r.tickIntervalMs ?? 6e4, this._panBound = r.panBoundDays ?? 90, this._visibleCount = r.visibleCount, this._bufferDaysExplicit = Lt(r.bufferDays);
    const n = (r.now ?? (() => /* @__PURE__ */ new Date()))();
    this._anchorToday = jt(n), e.addController(this);
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
    const r = !this._hasHass;
    this._hass = e, this._hasHass = !0, r && this._isConnected && this._fetchRange(...this._computeRange());
  }
  updateCalendars(e) {
    const r = new Set(this._opts.calendars.map((s) => s.entity)), n = new Set(e.map((s) => s.entity)), a = r.size !== n.size || [...n].some((s) => !r.has(s));
    this._opts.calendars = e, a && this._hass && this._fetchRange(...this._computeRange());
  }
  setVisibleCount(e) {
    var n, a;
    const r = this._visibleCount;
    if (this._visibleCount = e, (a = (n = this._opts).onChange) == null || a.call(n), this._host.requestUpdate(), e !== r) {
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
  setBufferDays(e) {
    var n, a;
    const r = Lt(e);
    r !== this._bufferDaysExplicit && (this._bufferDaysExplicit = r, (a = (n = this._opts).onChange) == null || a.call(n), this._host.requestUpdate());
  }
  pan(e) {
    var o, c;
    const r = -this._panBound, n = this._panBound - this._visibleCount, a = Math.max(r, Math.min(n, this._dayOffset + e));
    this._dayOffset = a, (c = (o = this._opts).onChange) == null || c.call(o), this._host.requestUpdate();
    const [s, i] = this._computeRange();
    this._rangeIsCovered(s, i) || this._fetchRange(s, i);
  }
  goToToday() {
    var a, s;
    const e = this._dayOffset === 0;
    this._dayOffset = 0, e || (s = (a = this._opts).onChange) == null || s.call(a), this._host.requestUpdate();
    const [r, n] = this._computeRange();
    this._rangeIsCovered(r, n) || this._fetchRange(r, n);
  }
  tick() {
    var n, a;
    const e = (this._opts.now ?? (() => /* @__PURE__ */ new Date()))(), r = jt(e);
    r.getTime() !== this._anchorToday.getTime() && (this._anchorToday = r, this._dayOffset === 0 && ((a = (n = this._opts).onChange) == null || a.call(n), this._host.requestUpdate(), this._hass && this._fetchRange(...this._computeRange())));
  }
  async _poll() {
    this._hass && this._fetchRange(...this._computeRange());
  }
  // -------------------------------------------------------------------------
  // Getters
  // -------------------------------------------------------------------------
  get days() {
    return Array.from({ length: this._visibleCount }, (e, r) => {
      const n = Le(this._anchorToday, this._dayOffset + r);
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
    const e = this.bufferDays, r = e * 2 + this._visibleCount;
    return Array.from({ length: r }, (n, a) => {
      const s = Le(this._anchorToday, this._dayOffset - e + a);
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
    const e = [], r = new Date(this._cacheStart);
    for (; r < this._cacheEnd; )
      e.push(new Date(r)), r.setDate(r.getDate() + 1);
    return e;
  }
  isDayCached(e) {
    return this._cachedDayKeys.has(z(e));
  }
  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------
  /** Compute [start, end) for the current visible+buffer range. */
  _computeRange() {
    const e = this._visibleCount, r = Le(this._anchorToday, this._dayOffset - e);
    r.setHours(0, 0, 0, 0);
    const n = Le(this._anchorToday, this._dayOffset + 2 * e);
    return n.setHours(0, 0, 0, 0), [r, n];
  }
  _rangeIsCovered(e, r) {
    return !this._cacheStart || !this._cacheEnd ? !1 : e >= this._cacheStart && r <= this._cacheEnd;
  }
  _fetchRange(e, r) {
    var s, i;
    if (!this._hass) return;
    const n = ++this._fetchSeq, a = this._opts.calendars.map((o) => o.entity);
    (i = (s = this._opts).onFetchStart) == null || i.call(s, { start: e, end: r }), this._fetcher(this._hass, a, e, r).then(({ events: o, failed: c }) => {
      var u, m;
      if (n !== this._fetchSeq) return;
      const d = /* @__PURE__ */ new Map();
      for (const [g, f] of o.entries())
        d.set(
          g,
          f.map((v) => {
            const $ = v.uid && v.uid.length > 0 ? v.uid : _a(v);
            return { ...v, uid: `${g}::${$}` };
          })
        );
      this._cachedEvents = d, this._cachedDayKeys = /* @__PURE__ */ new Set();
      for (const g = new Date(e); g < r; g.setDate(g.getDate() + 1))
        this._cachedDayKeys.add(z(g));
      this._cacheStart = new Date(e), this._cacheEnd = new Date(r), (m = (u = this._opts).onFetchComplete) == null || m.call(u, d, c);
    }).catch((o) => {
      console.warn("[lucarne] RollingWindowController fetch failed:", o);
    });
  }
}
var wa = Object.defineProperty, xa = Object.getOwnPropertyDescriptor, ut = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? xa(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && wa(e, r, a), a;
};
let Se = class extends y {
  constructor() {
    super(...arguments), this.calendars = [], this.visibleIds = /* @__PURE__ */ new Set();
  }
  _toggle(t) {
    const e = new Set(this.visibleIds);
    e.has(t) ? e.delete(t) : e.add(t), this.dispatchEvent(new CustomEvent("visibility-change", { detail: e, bubbles: !0, composed: !0 }));
  }
  render() {
    return l`
      ${this.calendars.map(
      (t) => l`
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
Se.styles = [
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
ut([
  p({ type: Array })
], Se.prototype, "calendars", 2);
ut([
  p({ type: Object })
], Se.prototype, "visibleIds", 2);
Se = ut([
  w("lucarne-visibility-pills")
], Se);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $a = { ATTRIBUTE: 1 }, ka = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Ca = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, r, n) {
    this._$Ct = e, this._$AM = r, this._$Ci = n;
  }
  _$AS(e, r) {
    return this.update(e, r);
  }
  update(e, r) {
    return this.render(...r);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ur = "important", Ea = " !" + ur, Da = ka(class extends Ca {
  constructor(t) {
    var e;
    if (super(t), t.type !== $a.ATTRIBUTE || t.name !== "style" || ((e = t.strings) == null ? void 0 : e.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return Object.keys(t).reduce((e, r) => {
      const n = t[r];
      return n == null ? e : e + `${r = r.includes("-") ? r : r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${n};`;
    }, "");
  }
  update(t, [e]) {
    const { style: r } = t.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(e)), this.render(e);
    for (const n of this.ft) e[n] == null && (this.ft.delete(n), n.includes("-") ? r.removeProperty(n) : r[n] = null);
    for (const n in e) {
      const a = e[n];
      if (a != null) {
        this.ft.add(n);
        const s = typeof a == "string" && a.endsWith(Ea);
        n.includes("-") || s ? r.setProperty(n, s ? a.slice(0, -11) : a, s ? ur : "") : r[n] = a;
      }
    }
    return ae;
  }
});
var Ma = Object.defineProperty, Sa = Object.getOwnPropertyDescriptor, ie = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Sa(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && Ma(e, r, a), a;
};
function Ut(t) {
  return t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
}
let W = class extends y {
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
    const t = new Date(this.event.start), e = new Date(this.event.end), r = `${Ut(t)}–${Ut(e)}`, n = this.event.pending ? "0.5" : "1";
    return l`
      <div @click=${this._handleClick} style="height:100%;width:100%;overflow:hidden;opacity:${n}">
        <div class="event-summary">${this.event.summary}</div>
        <div class="event-time">${r}</div>
      </div>
    `;
  }
};
W.styles = [
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
ie([
  p({ type: Object })
], W.prototype, "event", 2);
ie([
  p({ type: String })
], W.prototype, "color", 2);
ie([
  p({ type: Number })
], W.prototype, "lane", 2);
ie([
  p({ type: Number })
], W.prototype, "laneCount", 2);
ie([
  p({ type: Number })
], W.prototype, "topPercent", 2);
ie([
  p({ type: Number })
], W.prototype, "heightPercent", 2);
W = ie([
  w("lucarne-calendar-event-block")
], W);
var Ta = Object.defineProperty, Pa = Object.getOwnPropertyDescriptor, Oe = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Pa(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && Ta(e, r, a), a;
};
let ne = class extends y {
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
    if (this.events.length === 0) return l``;
    const t = this._chipEl;
    let e = 0, r = 0;
    if (t) {
      const n = t.getBoundingClientRect();
      e = n.bottom + 4, r = n.left;
    }
    return l`
      <button class="stub-chip" @click=${this._openPopover}>
        +${this.events.length} ${this.label}
      </button>

      ${this._open ? l`
            <div class="backdrop" @click=${this._close}></div>
            <div class="mini-popover" style="top:${e}px;left:${r}px;">
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
ne.styles = [
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
Oe([
  p({ type: Array })
], ne.prototype, "events", 2);
Oe([
  p({ type: String })
], ne.prototype, "label", 2);
Oe([
  p({ type: Object })
], ne.prototype, "eventColors", 2);
Oe([
  h()
], ne.prototype, "_open", 2);
ne = Oe([
  w("lucarne-out-of-band-stub")
], ne);
var Aa = Object.defineProperty, Oa = Object.getOwnPropertyDescriptor, Qe = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Oa(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && Aa(e, r, a), a;
};
function Ia(t) {
  return 20 + (t * 37 + 11) % 30;
}
function Ra(t) {
  return 10 + (t * 53 + 7) % 60;
}
let he = class extends y {
  constructor() {
    super(...arguments), this.bandStart = "07:00", this.bandEnd = "21:00", this.hourHeightPx = 60;
  }
  render() {
    const [t] = this.bandStart.split(":").map(Number), [e] = this.bandEnd.split(":").map(Number), n = Math.max(1, e - t) * this.hourHeightPx;
    return l`
      <div class="sk-host" style="height:${n}px">
        ${[0, 1].map((a) => {
      const i = Ra(a) / 100 * n, o = Ia(a);
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
he.styles = [
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
Qe([
  p({ type: String })
], he.prototype, "bandStart", 2);
Qe([
  p({ type: String })
], he.prototype, "bandEnd", 2);
Qe([
  p({ type: Number })
], he.prototype, "hourHeightPx", 2);
he = Qe([
  w("lucarne-skeleton-day-column")
], he);
var Na = Object.defineProperty, za = Object.getOwnPropertyDescriptor, B = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? za(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && Na(e, r, a), a;
};
function Ft(t, e) {
  return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
}
let H = class extends y {
  constructor() {
    super(...arguments), this.layout = null, this.bandStart = "07:00", this.bandEnd = "21:00", this.calendars = [], this.hourHeightPx = 60, this.showCreateButton = !1, this.dayWidthPx = 0, this.bufferDays = 0, this.cachedDayKeys = /* @__PURE__ */ new Set();
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
      const n = t.uid.split("::")[0];
      return e.get(n) ?? "#a8d8b9";
    }
    return "#a8d8b9";
  }
  _onBandClick(t, e) {
    if (!this.showCreateButton) return;
    const n = t.currentTarget.getBoundingClientRect(), [a] = this.bandStart.split(":").map(Number), [s] = this.bandEnd.split(":").map(Number), i = s - a, o = Math.max(0, Math.min(1, (t.clientY - n.top) / n.height)), c = a + o * i, d = Math.min(s - 1, Math.round(c * 2) / 2);
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
    if (!this.layout) return l``;
    const r = z(t), n = this.layout.perDay.get(r);
    if (!n) return l``;
    const a = zt(this.bandStart, this.bandEnd), i = (a.length - 1) * this.hourHeightPx, o = Ft(t, e), [c] = this.bandStart.split(":").map(Number), [d] = this.bandEnd.split(":").map(Number), u = (d - c) * 36e5;
    let m = null;
    if (o) {
      const f = new Date(t);
      f.setHours(c, 0, 0, 0);
      const v = new Date(t);
      v.setHours(d, 0, 0, 0), e >= f && e <= v && (m = (e.getTime() - f.getTime()) / u * 100);
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
          @click=${(f) => this._onBandClick(f, t)}
        >
          ${a.slice(0, -1).map(
      (f, v) => l`
              <div
                class="hour-line"
                style="top: ${(v + 1) / (a.length - 1) * 100}%"
              ></div>
            `
    )}

          ${m !== null ? l`<div class="now-line" style="top:${m}%"></div>` : ""}

          ${n.inBand.map((f) => {
      const v = 100 / f.laneCount, $ = f.lane / f.laneCount * 100, _ = this._eventColor(f.event);
      return l`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${f.topPercent}%;
                  left: calc(${$}% + 1px);
                  width: calc(${v}% - 2px);
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
    const t = /* @__PURE__ */ new Date(), e = zt(this.bandStart, this.bandEnd), n = (e.length - 1) * this.hourHeightPx, a = new Intl.DateTimeFormat("en-US", { weekday: "short" }), s = {
      "--lucarne-day-render-count": String(this.layout.days.length)
    };
    return this.dayWidthPx > 0 && (s["--lucarne-day-width-px"] = `${this.dayWidthPx}px`, s["--lucarne-day-baseline-px"] = `${-this.bufferDays * this.dayWidthPx}px`), l`
      <div class="grid-wrapper" style=${Da(s)}>
        <!-- Time-column gutter cells (col 1): stay fixed during pan -->
        <div class="header-spacer" style="grid-row:1; grid-column:1"></div>
        <div class="allday-spacer" style="grid-row:2; grid-column:1">all-day</div>
        <div class="time-col" style="height:${n}px; grid-row:3; grid-column:1">
          ${e.map(
      (i, o) => l`
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
      (i, o) => l`
              <div
                class="day-header ${Ft(i, t) ? "today" : ""}"
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
      const c = z(i), d = this.cachedDayKeys.has(c), u = this.layout.perDay.get(c);
      return l`
                <div class="allday-cell" style="grid-column: ${o + 1}">
                  ${d ? ((u == null ? void 0 : u.allDay) ?? []).map(
        (m) => {
          var f;
          const g = (f = u == null ? void 0 : u.allDayClipped) == null ? void 0 : f.get(dr(m));
          return l`
                          <div
                            class="allday-event"
                            style="background: ${this._eventColor(m)}cc"
                            @click=${(v) => {
            v.stopPropagation(), this.dispatchEvent(
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
      const c = z(i), d = this.cachedDayKeys.has(c);
      return l`
              <div style="grid-column:${o + 1}; position:relative; overflow:visible; display:flex; flex-direction:column;">
                ${d ? this._renderDayColumn(i, t) : l`<lucarne-skeleton-day-column
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
H.styles = [
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
B([
  p({ type: Object })
], H.prototype, "layout", 2);
B([
  p({ type: String })
], H.prototype, "bandStart", 2);
B([
  p({ type: String })
], H.prototype, "bandEnd", 2);
B([
  p({ type: Array })
], H.prototype, "calendars", 2);
B([
  p({ type: Number })
], H.prototype, "hourHeightPx", 2);
B([
  p({ type: Boolean })
], H.prototype, "showCreateButton", 2);
B([
  p({ type: Number })
], H.prototype, "dayWidthPx", 2);
B([
  p({ type: Number })
], H.prototype, "bufferDays", 2);
B([
  p({ attribute: !1 })
], H.prototype, "cachedDayKeys", 2);
H = B([
  w("lucarne-calendar-grid")
], H);
const Ha = 500;
function La(t, e, r) {
  return e <= 0 ? 0 : Math.abs(r) >= Ha ? r > 0 ? Math.ceil(t / e) : Math.floor(t / e) : Math.round(t / e);
}
function Bt(t, e) {
  if (Math.abs(t) <= e) return t;
  const r = Math.abs(t) - e;
  return Math.sign(t) * (e + r * 0.33);
}
var ja = Object.defineProperty, Ua = Object.getOwnPropertyDescriptor, ve = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Ua(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && ja(e, r, a), a;
};
let X = class extends y {
  constructor() {
    super(...arguments), this.dayWidthPx = 0, this.bufferDays = 0, this.canPanBack = !0, this.canPanForward = !0, this._startX = 0, this._startY = 0, this._startTime = 0, this._isDragging = !1, this._cachedTargets = [];
  }
  /** All .day-cols-track elements inside the slotted calendar-grid's shadow root. */
  get _panTargets() {
    var e, r;
    const t = (e = this._slot) == null ? void 0 : e.assignedElements()[0];
    return t ? Array.from(
      ((r = t.shadowRoot) == null ? void 0 : r.querySelectorAll(".day-cols-track")) ?? []
    ) : [];
  }
  /** Cache targets on gesture start so pointermove does not re-query every frame. */
  _cachePanTargets() {
    this._cachedTargets = this._panTargets;
  }
  _applyRubberBand(t) {
    return t > 0 && !this.canPanBack || t < 0 && !this.canPanForward ? Bt(t, 0) : t;
  }
  /** Baseline transform in px (negative). Matches the CSS `--lucarne-day-baseline-px`. */
  _baselinePx() {
    return -this.bufferDays * this.dayWidthPx;
  }
  _setTranslate(t) {
    const e = this._baselinePx() + t;
    for (const r of this._cachedTargets)
      r.style.transition = "", r.style.transform = `translateX(${e}px)`;
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
    const r = this._baselinePx();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const d of e)
        d.style.transition = "", d.style.transform = `translateX(${r}px)`;
      t !== 0 && this._dispatchPanSnap(t), this._scheduleClearInline();
      return;
    }
    const a = getComputedStyle(this).getPropertyValue("--lucarne-pan-duration").trim() || "240ms", s = getComputedStyle(this).getPropertyValue("--lucarne-pan-easing").trim() || "cubic-bezier(0.32, 0.72, 0, 1)", i = `transform ${a} ${s}`, o = r + t * this.dayWidthPx;
    for (const d of e)
      d.style.transition = i, d.style.transform = `translateX(${o}px)`;
    const c = (d) => {
      const u = d;
      u.target === e[0] && (u.propertyName && u.propertyName !== "transform" || (this._pendingTransitionEnd = void 0, e[0].removeEventListener("transitionend", c), t !== 0 && this._dispatchPanSnap(t), this._scheduleClearInline()));
    };
    this._pendingSnapTarget = e[0], this._pendingTransitionEnd = c, e[0].addEventListener("transitionend", c);
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
    const e = t.clientX - this._startX, r = t.clientY - this._startY;
    if (!this._isDragging) {
      if (Math.abs(e) < 10 && Math.abs(r) < 10) return;
      if (Math.abs(r) > Math.abs(e)) {
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
    const n = this._applyRubberBand(e);
    this._setTranslate(n);
  }
  _onPointerUp(t) {
    if (t.pointerId === this._pointerId) {
      try {
        t.currentTarget.releasePointerCapture(t.pointerId);
      } catch {
      }
      if (this._isDragging) {
        const e = t.clientX - this._startX, r = performance.now() - this._startTime, n = r > 0 ? e / r * 1e3 : 0, a = this._applyRubberBand(e);
        let s = La(a, this.dayWidthPx, n);
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
X.styles = b`
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
ve([
  p({ type: Number })
], X.prototype, "dayWidthPx", 2);
ve([
  p({ type: Number })
], X.prototype, "bufferDays", 2);
ve([
  p({ type: Boolean })
], X.prototype, "canPanBack", 2);
ve([
  p({ type: Boolean })
], X.prototype, "canPanForward", 2);
ve([
  rr("slot")
], X.prototype, "_slot", 2);
X = ve([
  w("lucarne-calendar-day-pan")
], X);
var Fa = Object.defineProperty, Ba = Object.getOwnPropertyDescriptor, Y = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Ba(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && Fa(e, r, a), a;
};
function Wa(t) {
  return new Date(t).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: !0
  });
}
let j = class extends y {
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
      await jr(this.hass, this.entityId, t);
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
    const t = this.event, r = t.start.length === 10 && !t.start.includes("T") ? "All day" : `${Wa(t.start)} – ${new Date(t.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 })}`, n = this._hasSyntheticUid(t.uid), a = !!this.entityId && !!t.uid && this.hass != null && Fr(this.hass, this.entityId) && !this._isRecurring(t) && !n, s = this._confirmingDelete ? this._confirmDelete : this._startDelete, i = this._confirmingDelete ? "Confirm delete" : "Delete event";
    return l`
      <div class="backdrop" @click=${this._close}></div>
      <div class="popover" role="dialog" aria-modal="true">
        <div class="popover-header">
          <span class="color-dot" style="background:${this.color}"></span>
          <span class="event-title">${t.summary}</span>
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

        ${t.location ? l`
              <div class="detail-row">
                <em class="detail-icon">📍</em>
                <span class="detail-text">${t.location}</span>
              </div>
            ` : ""}

        ${t.description ? l`
              <div class="detail-row">
                <em class="detail-icon">📝</em>
                <span class="detail-text">${t.description}</span>
              </div>
            ` : ""}

        ${this._deleteError ? l`<div class="error-msg">${this._deleteError}</div>` : ""}
      </div>
    `;
  }
};
j.styles = [
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
Y([
  p({ attribute: !1 })
], j.prototype, "hass", 2);
Y([
  p({ type: Object })
], j.prototype, "event", 2);
Y([
  p({ type: String })
], j.prototype, "color", 2);
Y([
  p({ type: String })
], j.prototype, "calendarLabel", 2);
Y([
  p({ type: String })
], j.prototype, "entityId", 2);
Y([
  h()
], j.prototype, "_confirmingDelete", 2);
Y([
  h()
], j.prototype, "_deleting", 2);
Y([
  h()
], j.prototype, "_deleteError", 2);
j = Y([
  w("lucarne-calendar-event-popover")
], j);
var Ya = Object.defineProperty, Va = Object.getOwnPropertyDescriptor, R = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Va(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && Ya(e, r, a), a;
};
function Wt(t, e) {
  const n = -(/* @__PURE__ */ new Date(`${t}T${e}:00`)).getTimezoneOffset(), a = n >= 0 ? "+" : "-", s = Math.floor(Math.abs(n) / 60).toString().padStart(2, "0"), i = (Math.abs(n) % 60).toString().padStart(2, "0");
  return `${t}T${e}:00${a}${s}:${i}`;
}
function Yt(t) {
  return `${Math.floor(t).toString().padStart(2, "0")}:${t % 1 === 0.5 ? "30" : "00"}`;
}
function Vt(t) {
  const e = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), n = String(t.getDate()).padStart(2, "0");
  return `${e}-${r}-${n}`;
}
let O = class extends y {
  constructor() {
    super(...arguments), this.day = null, this.startHour = 9, this.calendars = [], this._title = "", this._calendarEntityId = "", this._date = "", this._startTime = "", this._endTime = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
  }
  updated(t) {
    super.updated(t), (t.has("day") || t.has("startHour")) && this._initDefaults();
  }
  _initDefaults() {
    var r;
    const t = this.day ?? /* @__PURE__ */ new Date();
    this._date = Vt(t), this._startTime = Yt(Math.max(0, Math.min(23, this.startHour)));
    const e = Math.min(24, this.startHour + 1);
    this._endTime = Yt(e < 24 ? e : 23.5), this._calendarEntityId = ((r = this.calendars[0]) == null ? void 0 : r.entity) ?? "", this._title = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
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
      const n = /* @__PURE__ */ new Date(`${this._date}T00:00:00`);
      n.setDate(n.getDate() + 1);
      const a = Vt(n);
      t.end_date = a, e = this._date, r = a;
    } else {
      const n = Wt(this._date, this._startTime), a = Wt(this._date, this._endTime);
      t.start_date_time = n, t.end_date_time = a, e = n, r = a;
    }
    try {
      await this.hass.callService("calendar", "create_event", t, {
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
            start: e,
            end: r,
            description: this._description.trim() || void 0,
            location: this._location.trim() || void 0,
            // Synthetic pending uid: unique per optimistic create so
            // multiple pendings don't collide on the `entity::` key.
            // Replaced by the real event on the next fetch.
            uid: `${this._calendarEntityId}::pending:${e}|${r}|${this._title.trim()}`,
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
      (t) => l`<option value=${t.entity}>${t.label}</option>`
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

        ${this._allDay ? "" : l`
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
var qa = Object.defineProperty, Ka = Object.getOwnPropertyDescriptor, N = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Ka(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && qa(e, r, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-calendar-card",
  name: "Lucarne Calendar",
  description: "Week view calendar with per-person color, visibility pills, and create-event flow",
  preview: !0
});
let I = class extends y {
  constructor() {
    super(...arguments), this._layout = null, this._visibleIds = /* @__PURE__ */ new Set(), this._openEvent = null, this._openEventColor = "", this._openEventCalLabel = "", this._openEventEntityId = "", this._createDay = null, this._createStartHour = 9, this._creatableCalendars = [], this._dayWidthPx = 0, this._deletedUids = /* @__PURE__ */ new Set(), this._pendingEvents = [], this._lastVisibleCount = 3;
  }
  setConfig(t) {
    if (!t.calendars || !Array.isArray(t.calendars) || t.calendars.length === 0)
      throw new Error('lucarne-calendar-card: "calendars" must be a non-empty array');
    for (const n of t.calendars)
      if (!n.entity || !n.color)
        throw new Error('lucarne-calendar-card: each calendar requires "entity" and "color"');
    let e = t;
    if (t.visible_hours) {
      const n = /^\d{1,2}:\d{2}$/;
      if (!n.test(t.visible_hours.start) || !n.test(t.visible_hours.end))
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
    const r = this._config;
    if (this._config = e, this._visibleIds = new Set(t.calendars.map((n) => n.entity)), this.hass && this._updateCreatableCalendars(), this._rolling)
      this._rolling.updateCalendars(e.calendars), (r == null ? void 0 : r.render_buffer_days) !== e.render_buffer_days && this._rolling.setBufferDays(e.render_buffer_days), ((r == null ? void 0 : r.min_days) !== t.min_days || (r == null ? void 0 : r.max_days) !== t.max_days || (r == null ? void 0 : r.min_col_width) !== t.min_col_width || (r == null ? void 0 : r.max_col_width) !== t.max_col_width) && this._onResize();
    else {
      const n = this._effectiveConfig();
      this._lastVisibleCount = n.minDays, this._rolling = new ba(this, {
        calendars: e.calendars,
        visibleCount: n.minDays,
        bufferDays: e.render_buffer_days,
        onFetchComplete: (a, s) => this._onFetchComplete(a, s),
        onChange: () => this._recompute()
      });
    }
  }
  static getStubConfig(t) {
    const e = Object.keys(t.states).filter((a) => a.startsWith("calendar.")).slice(0, 3), r = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], n = e.map((a, s) => ({
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
      this._previewOverrideRaf = void 0, this.isConnected && (this._previewOverride = sr(this));
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
      var n;
      this._resizeFrame = void 0;
      const t = ((n = this._gridAreaEl) == null ? void 0 : n.getBoundingClientRect().width) ?? 0, { visibleCount: e, dayWidthPx: r } = ya(t, this._effectiveConfig());
      e !== this._lastVisibleCount && (this._lastVisibleCount = e, this._rolling.setVisibleCount(e), this.style.setProperty("--lucarne-day-count", String(e))), this._dayWidthPx = r;
    }));
  }
  _recompute() {
    var s, i;
    if (!this._config) return;
    const t = [];
    for (const [o, c] of this._rolling.cachedEvents.entries())
      this._visibleIds.has(o) && t.push(...c);
    t.push(
      ...this._pendingEvents.filter((o) => {
        var d;
        const c = (d = o.uid) == null ? void 0 : d.split("::")[0];
        return c ? this._visibleIds.has(c) : !0;
      })
    );
    const e = this._deletedUids.size > 0 ? t.filter((o) => !o.uid || !this._deletedUids.has(o.uid)) : t, r = ((s = this._config.visible_hours) == null ? void 0 : s.start) ?? "07:00", n = ((i = this._config.visible_hours) == null ? void 0 : i.end) ?? "21:00", a = this._rolling.renderDays;
    this._layout = va(e, a, r, n);
  }
  _supportsCreate(t) {
    var r, n, a;
    const e = (a = (n = (r = this.hass) == null ? void 0 : r.states[t]) == null ? void 0 : n.attributes) == null ? void 0 : a.supported_features;
    return e !== void 0 && (e & 1) !== 0;
  }
  _updateCreatableCalendars() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.filter((r) => this._supportsCreate(r.entity));
    t.length === this._creatableCalendars.length && t.every((r, n) => {
      var a;
      return r.entity === ((a = this._creatableCalendars[n]) == null ? void 0 : a.entity);
    }) || (this._creatableCalendars = t);
  }
  _onVisibilityChange(t) {
    this._visibleIds = t.detail, this._recompute();
  }
  _onEventTap(t) {
    var n, a;
    const { event: e, color: r } = t.detail;
    if (this._openEvent = e, this._openEventColor = r, (n = e.uid) != null && n.includes("::")) {
      const s = e.uid.split("::")[0];
      this._openEventEntityId = s;
      const i = (a = this._config) == null ? void 0 : a.calendars.find((o) => o.entity === s);
      this._openEventCalLabel = i ? cr(i, this.hass) : "";
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
      const r = /* @__PURE__ */ new Set();
      for (const a of t.values())
        for (const s of a)
          s.uid && r.add(s.uid);
      const n = /* @__PURE__ */ new Set();
      for (const a of this._deletedUids) {
        const s = a.includes("::") ? a.split("::")[0] : "";
        (e.has(s) || r.has(a)) && n.add(a);
      }
      this._deletedUids = n;
    }
    this._recompute();
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
  _rangeLabel() {
    const t = this._rolling.days;
    if (t.length === 0) return "";
    const e = t[0], r = t[t.length - 1], n = (i, o) => i.toLocaleDateString("en-US", o), a = e.getMonth() === r.getMonth() && e.getFullYear() === r.getFullYear(), s = e.getFullYear() === r.getFullYear();
    return a ? `${n(e, { month: "short", day: "numeric" })} – ${n(r, { day: "numeric" })}` : s ? `${n(e, { month: "short", day: "numeric" })} – ${n(r, { month: "short", day: "numeric" })}` : `${n(e, { month: "short", day: "numeric", year: "numeric" })} – ${n(r, { month: "short", day: "numeric", year: "numeric" })}`;
  }
  render() {
    var a, s;
    if (!this._config) return l``;
    const t = ((a = this._config.visible_hours) == null ? void 0 : a.start) ?? "07:00", e = ((s = this._config.visible_hours) == null ? void 0 : s.end) ?? "21:00", r = Nt(this._config.calendars, this.hass), n = Nt(this._creatableCalendars, this.hass);
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
              .bandStart=${t}
              .bandEnd=${e}
              .calendars=${r}
              .dayWidthPx=${this._dayWidthPx}
              .bufferDays=${this._rolling.bufferDays}
              .cachedDayKeys=${new Set(this._rolling.cachedRange.map(z))}
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
N([
  p({ attribute: !1 })
], I.prototype, "hass", 2);
N([
  rr(".grid-area")
], I.prototype, "_gridAreaEl", 2);
N([
  h()
], I.prototype, "_config", 2);
N([
  h()
], I.prototype, "_layout", 2);
N([
  h()
], I.prototype, "_visibleIds", 2);
N([
  h()
], I.prototype, "_openEvent", 2);
N([
  h()
], I.prototype, "_openEventColor", 2);
N([
  h()
], I.prototype, "_openEventCalLabel", 2);
N([
  h()
], I.prototype, "_openEventEntityId", 2);
N([
  h()
], I.prototype, "_createDay", 2);
N([
  h()
], I.prototype, "_createStartHour", 2);
N([
  h()
], I.prototype, "_creatableCalendars", 2);
N([
  h()
], I.prototype, "_dayWidthPx", 2);
N([
  h()
], I.prototype, "_deletedUids", 2);
I = N([
  w("lucarne-calendar-card")
], I);
var Xa = Object.defineProperty, Qa = Object.getOwnPropertyDescriptor, Ie = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Qa(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && Xa(e, r, a), a;
};
let se = class extends y {
  constructor() {
    super(...arguments), this._haReady = !1, this._invalid = {};
  }
  connectedCallback() {
    super.connectedCallback(), lr().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    dt(this, "config-changed", { config: t });
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
    var n, a;
    const r = [...((n = this._config) == null ? void 0 : n.calendars) ?? []];
    r[t] = { ...r[t], entity: ((a = e.detail) == null ? void 0 : a.value) ?? "" }, this._fire({ ...this._config, calendars: r });
  }
  _calColorChanged(t, e) {
    var n;
    const r = [...((n = this._config) == null ? void 0 : n.calendars) ?? []];
    r[t] = { ...r[t], color: e.target.value }, this._fire({ ...this._config, calendars: r });
  }
  _removeCalendar(t) {
    var r;
    const e = [...((r = this._config) == null ? void 0 : r.calendars) ?? []];
    e.length <= 1 || (e.splice(t, 1), this._fire({ ...this._config, calendars: e }));
  }
  _windowFieldChanged(t, e) {
    const r = e.target, n = r.value === "" ? void 0 : r.valueAsNumber, a = n !== void 0 && Number.isFinite(n) ? n : void 0, s = { ...this._config, [t]: a }, i = s.min_days ?? 3, o = s.max_days ?? 7, c = s.min_col_width ?? 140, d = s.max_col_width ?? 220;
    this._invalid = {
      days: i > o,
      cols: c > d
    }, this._fire(s);
  }
  _addCalendar() {
    var n, a;
    const e = Object.keys(((n = this.hass) == null ? void 0 : n.states) ?? {}).find((s) => s.startsWith("calendar.")) ?? "calendar.example", r = [
      ...((a = this._config) == null ? void 0 : a.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  render() {
    var c, d;
    if (!this._config) return l``;
    if (!this._haReady) return l`<div class="loading">Loading editor…</div>`;
    const t = this._config.calendars ?? [], e = ((c = this._config.visible_hours) == null ? void 0 : c.start) ?? "07:00", r = ((d = this._config.visible_hours) == null ? void 0 : d.end) ?? "21:00", n = this._config.show_create_button ?? !0, a = this._config.min_days, s = this._config.max_days, i = this._config.min_col_width, o = this._config.max_col_width;
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
      ${t.map(
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
se.styles = [M, or];
Ie([
  p({ attribute: !1 })
], se.prototype, "hass", 2);
Ie([
  h()
], se.prototype, "_config", 2);
Ie([
  h()
], se.prototype, "_haReady", 2);
Ie([
  h()
], se.prototype, "_invalid", 2);
se = Ie([
  w("lucarne-calendar-card-editor")
], se);
const Ue = {
  slug: "household",
  name: "Household",
  color: "var(--primary-color)",
  avatar: null,
  todo_entity_id: "todo.lucarne_household",
  streak_counter_id: ""
}, Ga = [
  "lucarne_family_task_added",
  "lucarne_family_task_completed",
  "lucarne_family_task_deleted",
  "lucarne_family_task_metadata_updated",
  "lucarne_family_task_toggled",
  "lucarne_family_all_routines_done"
];
function qt(t, e, r) {
  return t.map((n) => {
    const s = r.get(n.uid) ?? {
      item_uid: n.uid,
      member_slug: e,
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
function Ye(t, e) {
  let r = !1;
  const n = [];
  let a = /* @__PURE__ */ new Map(), s = [];
  const i = /* @__PURE__ */ new Map();
  let o = /* @__PURE__ */ new Map(), c = "", d = "", u = null, m = null;
  function g() {
    if (r) return;
    const _ = /* @__PURE__ */ new Map();
    for (const T of s) {
      const L = i.get(T.todo_entity_id) ?? [];
      _.set(T.slug, qt(L, T.slug, a));
    }
    const k = i.get("todo.lucarne_household") ?? [];
    _.set("household", qt(k, "household", a)), e({ members: s, tasksByMember: _, streakByMember: new Map(o), resetTime: c, streakCheckTime: d, integrationError: m });
  }
  async function f() {
    var _, k;
    try {
      const T = await t.connection.sendMessagePromise({
        type: "lucarne_family/get_family"
      });
      if (r) return;
      const L = /* @__PURE__ */ new Map();
      for (const A of T.task_metadata ?? [])
        L.set(A.item_uid, A);
      a = L, c = T.reset_time ?? "", d = T.streak_check_time ?? "", s = (T.members ?? []).filter((A) => A.todo_entity_id ? !0 : (console.debug(`[lucarne] skipping member ${A.slug}: no todo_entity_id yet`), !1)), m = null, o = /* @__PURE__ */ new Map(), n.forEach((A) => A()), n.length = 0;
      for (const A of s) {
        const gr = at(t, A.todo_entity_id, (Re) => {
          i.set(A.todo_entity_id, Re), g();
        });
        if (n.push(gr), A.streak_counter_id) {
          const Re = (k = (_ = t.states) == null ? void 0 : _[A.streak_counter_id]) == null ? void 0 : k.state;
          if (Re !== void 0) {
            const Ne = parseInt(Re, 10);
            o.set(A.slug, isNaN(Ne) ? 0 : Ne);
          }
          const vr = ar(t, A.streak_counter_id, (Ne) => {
            const ft = parseInt(Ne.state, 10);
            o.set(A.slug, isNaN(ft) ? 0 : ft), g();
          });
          n.push(vr);
        }
      }
      const fr = at(t, "todo.lucarne_household", (A) => {
        i.set("todo.lucarne_household", A), g();
      });
      n.push(fr), g();
    } catch (T) {
      console.warn("[lucarne] get_family failed — integration may not be installed:", T), r || (m = T instanceof Error ? T : new Error(String(T)), n.forEach((L) => L()), n.length = 0, s = [], a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), i.clear(), c = "", d = "", g());
    }
  }
  function v() {
    u === null && (u = setTimeout(() => {
      u = null, f();
    }, 1e3));
  }
  const $ = [];
  for (const _ of Ga)
    t.connection.subscribeEvents(() => {
      v();
    }, _).then((k) => {
      r ? k() : $.push(k);
    }).catch((k) => {
      console.debug(`[lucarne] could not subscribe to ${_}:`, k);
    });
  return f(), () => {
    r = !0, u !== null && clearTimeout(u), n.forEach((_) => _()), $.forEach((_) => _());
  };
}
var Ja = Object.defineProperty, Za = Object.getOwnPropertyDescriptor, Ge = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Za(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && Ja(e, r, a), a;
};
const en = new RegExp("^\\p{Emoji}+$", "u");
let pe = class extends y {
  constructor() {
    super(...arguments), this.name = "", this.color = "#a8d8b9", this.avatar = null;
  }
  render() {
    const t = this.avatar;
    if (t && t.startsWith("/local/"))
      return l`
        <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
          <img src="${t}" alt="${this.name}" />
        </div>
      `;
    if (t && en.test(t))
      return l`
        <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
          <span class="emoji">${t}</span>
        </div>
      `;
    const e = this.name.trim().charAt(0) || "?";
    return l`
      <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
        <span class="initial">${e}</span>
      </div>
    `;
  }
};
pe.styles = b`
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
Ge([
  p()
], pe.prototype, "name", 2);
Ge([
  p()
], pe.prototype, "color", 2);
Ge([
  p()
], pe.prototype, "avatar", 2);
pe = Ge([
  w("lucarne-member-avatar")
], pe);
var tn = Object.defineProperty, rn = Object.getOwnPropertyDescriptor, ht = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? rn(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && tn(e, r, a), a;
};
const an = 500;
let Te = class extends y {
  constructor() {
    super(...arguments), this.memberColor = "#a8d8b9", this._pressTimer = null, this._longPressed = !1;
  }
  _onPointerDown(t) {
    this._longPressed = !1, this._pressTimer = setTimeout(() => {
      this._longPressed = !0, this.dispatchEvent(
        new CustomEvent("task-long-press", {
          detail: { task: this.task },
          bubbles: !0,
          composed: !0
        })
      );
    }, an), t.currentTarget.setPointerCapture(t.pointerId);
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
    const t = this.task.status === "completed", e = this.task.metadata.icon, r = this.task.due;
    return l`
      <div
        class="row"
        style="--member-color:${this.memberColor}"
        role="checkbox"
        aria-checked=${t}
        tabindex="0"
        @click=${this._onClick}
        @keydown=${(n) => {
      (n.key === "Enter" || n.key === " ") && !n.repeat && (n.preventDefault(), this._onClick());
    }}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
      >
        <div class="check ${t ? "done" : ""}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 5" stroke="rgba(0,0,0,0.7)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        ${e ? l`<span class="icon">${e}</span>` : ""}
        <div class="middle">
          <span class="label ${t ? "done" : ""}">${this.task.summary}</span>
        </div>
        ${r ? l`<span class="due">${this._formatDue(r)}</span>` : ""}
      </div>
    `;
  }
  _formatDue(t) {
    if (t.includes("T")) {
      const e = new Date(t);
      if (!isNaN(e.getTime()))
        return e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return t;
  }
};
Te.styles = b`
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
ht([
  p({ attribute: !1 })
], Te.prototype, "task", 2);
ht([
  p()
], Te.prototype, "memberColor", 2);
Te = ht([
  w("lucarne-task-row")
], Te);
var nn = Object.defineProperty, sn = Object.getOwnPropertyDescriptor, hr = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? sn(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && nn(e, r, a), a;
};
let Ve = class extends y {
  constructor() {
    super(...arguments), this.streak = 0;
  }
  _milestoneClass(t) {
    return t >= 30 ? "milestone-5" : t >= 14 ? "milestone-4" : t >= 7 ? "milestone-3" : t >= 3 ? "milestone-2" : t >= 1 ? "milestone-1" : "";
  }
  render() {
    const t = isNaN(this.streak) ? 0 : this.streak, e = t > 0 ? "day streak" : "start a streak today";
    return l`
      <div class="streak-row">
        <span class="flame ${this._milestoneClass(t)}">🔥</span>
        <span class="count">${t}</span>
      </div>
      <div class="label">${e}</div>
    `;
  }
};
Ve.styles = b`
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
hr([
  p({ type: Number })
], Ve.prototype, "streak", 2);
Ve = hr([
  w("lucarne-streak-display")
], Ve);
var on = Object.defineProperty, ln = Object.getOwnPropertyDescriptor, pt = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? ln(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && on(e, r, a), a;
};
let Pe = class extends y {
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
    return this.active ? l`
      ${this._dots.map(
      (t) => l`
          <div
            class="dot"
            style="left:${t.left};background:${t.color};animation-delay:${t.delay};width:${t.size};height:${t.size}"
          ></div>
        `
    )}
    ` : l``;
  }
};
Pe.styles = b`
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
pt([
  p({ attribute: "kid-slug" })
], Pe.prototype, "kidSlug", 2);
pt([
  p({ type: Boolean })
], Pe.prototype, "active", 2);
Pe = pt([
  w("lucarne-celebration-overlay")
], Pe);
var cn = Object.defineProperty, dn = Object.getOwnPropertyDescriptor, J = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? dn(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && cn(e, r, a), a;
};
function un(t) {
  return [...t].sort((e, r) => e.summary.localeCompare(r.summary));
}
function hn(t) {
  return [...t].sort((e, r) => e.due && r.due ? e.due.localeCompare(r.due) : e.due ? -1 : r.due ? 1 : e.summary.localeCompare(r.summary));
}
let F = class extends y {
  constructor() {
    super(...arguments), this.tasks = [], this.streak = 0, this.showRoutines = !0, this.showTasks = !0, this.showStreak = !0, this._celebrating = !1, this._celebrationTimer = null, this._lastAllRoutinesDone = null;
  }
  updated(t) {
    if (super.updated(t), !t.has("tasks")) return;
    const e = this.tasks.filter((n) => n.metadata.type === "routine");
    if (e.length === 0) return;
    const r = e.every((n) => n.status === "completed");
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
    const t = un(this.tasks.filter((r) => r.metadata.type === "routine")), e = hn(this.tasks.filter((r) => r.metadata.type === "chore"));
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

        ${this.showRoutines && t.length > 0 ? l`
              <div class="section">
                <div class="section-header">Routines</div>
                ${t.map((r) => l`
                  <lucarne-task-row
                    .task=${r}
                    .memberColor=${this.member.color}
                  ></lucarne-task-row>
                `)}
              </div>
            ` : ""}

        ${this.showTasks && e.length > 0 ? l`
              <div class="section">
                <div class="section-header">Tasks</div>
                ${e.map((r) => l`
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
F.styles = b`
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
J([
  p({ attribute: !1 })
], F.prototype, "member", 2);
J([
  p({ attribute: !1 })
], F.prototype, "tasks", 2);
J([
  p({ type: Number })
], F.prototype, "streak", 2);
J([
  p({ type: Boolean, attribute: "show-routines" })
], F.prototype, "showRoutines", 2);
J([
  p({ type: Boolean, attribute: "show-tasks" })
], F.prototype, "showTasks", 2);
J([
  p({ type: Boolean, attribute: "show-streak" })
], F.prototype, "showStreak", 2);
J([
  h()
], F.prototype, "_celebrating", 2);
F = J([
  w("lucarne-member-column")
], F);
async function pn(t, e) {
  const r = {
    member: e.member,
    summary: e.summary,
    type: e.type
  };
  e.recurrence !== void 0 && (r.recurrence = e.recurrence), e.icon !== void 0 && (r.icon = e.icon), e.due !== void 0 && (r.due = e.due), e.source !== void 0 && (r.source = e.source), e.assignee !== void 0 && (r.assignee = e.assignee), await t.callService("lucarne_family", "add_task", r);
}
async function mn(t, e, r) {
  const n = { uid: e };
  r.type !== void 0 && (n.type = r.type), r.recurrence !== void 0 && (n.recurrence = r.recurrence), r.icon !== void 0 && (n.icon = r.icon), r.assignee !== void 0 && (n.assignee = r.assignee), await t.callService("lucarne_family", "update_task_metadata", n);
}
async function fn(t, e) {
  await t.callService("lucarne_family", "delete_task", { uid: e });
}
const me = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
function pr(t) {
  if (!t || t.trim() === "") return { mode: "none" };
  const e = t.trim().split(";"), r = {};
  for (const d of e) {
    const u = d.indexOf("=");
    if (u === -1) return { mode: "unknown", raw: t };
    r[d.slice(0, u)] = d.slice(u + 1);
  }
  const n = r.FREQ;
  let a;
  if (r.INTERVAL !== void 0) {
    if (!/^[1-9]\d*$/.test(r.INTERVAL)) return { mode: "unknown", raw: t };
    a = parseInt(r.INTERVAL, 10);
  }
  const s = r.BYDAY, i = r.BYMONTHDAY, o = r.BYMONTH;
  function c(...d) {
    const u = new Set(d);
    return Object.keys(r).every((m) => u.has(m));
  }
  if (n === "DAILY" && !s && !i && !o)
    return c("FREQ", "INTERVAL") ? { mode: "daily", ...a ? { interval: a } : {} } : { mode: "unknown", raw: t };
  if (n === "WEEKLY" && s && !i && !o) {
    if (!c("FREQ", "BYDAY", "INTERVAL")) return { mode: "unknown", raw: t };
    const d = s.split(",");
    return d.every((u) => me.includes(u)) ? { mode: "weekly", days: d, ...a ? { interval: a } : {} } : { mode: "unknown", raw: t };
  }
  if (n === "MONTHLY" && i && !s && !o)
    return c("FREQ", "BYMONTHDAY", "INTERVAL") ? /^([1-9]|[12]\d|3[01])$/.test(i) ? { mode: "monthly-date", dayOfMonth: parseInt(i, 10), ...a ? { interval: a } : {} } : { mode: "unknown", raw: t } : { mode: "unknown", raw: t };
  if (n === "MONTHLY" && s && !i && !o) {
    if (!c("FREQ", "BYDAY", "INTERVAL")) return { mode: "unknown", raw: t };
    const d = s.match(/^([+-]?\d+)([A-Z]{2})$/);
    if (!d) return { mode: "unknown", raw: t };
    const u = parseInt(d[1], 10);
    if (![1, 2, 3, 4, -1].includes(u)) return { mode: "unknown", raw: t };
    const m = d[2];
    return me.includes(m) ? { mode: "monthly-nth", nth: u, day: m, ...a ? { interval: a } : {} } : { mode: "unknown", raw: t };
  }
  if (n === "YEARLY" && o && i && !s) {
    if (!c("FREQ", "BYMONTH", "BYMONTHDAY", "INTERVAL")) return { mode: "unknown", raw: t };
    if (!/^([1-9]|1[0-2])$/.test(o)) return { mode: "unknown", raw: t };
    if (!/^([1-9]|[12]\d|3[01])$/.test(i)) return { mode: "unknown", raw: t };
    const d = parseInt(o, 10), u = parseInt(i, 10);
    return { mode: "yearly", month: d, dayOfMonth: u, ...a ? { interval: a } : {} };
  }
  return { mode: "unknown", raw: t };
}
function U(t) {
  if (t.mode === "none") return "";
  if (t.mode === "daily") {
    let e = "FREQ=DAILY";
    return t.interval && t.interval > 1 && (e += `;INTERVAL=${t.interval}`), e;
  }
  if (t.mode === "weekly") {
    let e = `FREQ=WEEKLY;BYDAY=${t.days.join(",")}`;
    return t.interval && t.interval > 1 && (e += `;INTERVAL=${t.interval}`), e;
  }
  if (t.mode === "monthly-date") {
    let e = `FREQ=MONTHLY;BYMONTHDAY=${t.dayOfMonth}`;
    return t.interval && t.interval > 1 && (e += `;INTERVAL=${t.interval}`), e;
  }
  if (t.mode === "monthly-nth") {
    let r = `FREQ=MONTHLY;BYDAY=${`${t.nth}`}${t.day}`;
    return t.interval && t.interval > 1 && (r += `;INTERVAL=${t.interval}`), r;
  }
  if (t.mode === "yearly") {
    let e = `FREQ=YEARLY;BYMONTH=${t.month};BYMONTHDAY=${t.dayOfMonth}`;
    return t.interval && t.interval > 1 && (e += `;INTERVAL=${t.interval}`), e;
  }
  return "";
}
function mr(t) {
  const e = pr(t);
  if (e.mode === "none") return "One-off (no repeat)";
  if (e.mode === "unknown") return "Custom recurrence (not editable here)";
  const r = "interval" in e && e.interval ? e.interval : 1;
  if (e.mode === "daily")
    return r === 1 ? "Daily" : `Every ${r} days`;
  if (e.mode === "weekly") {
    const n = {
      MO: "Mon",
      TU: "Tue",
      WE: "Wed",
      TH: "Thu",
      FR: "Fri",
      SA: "Sat",
      SU: "Sun"
    }, a = e.days.map((s) => n[s]).join(", ");
    return r === 1 ? `Weekly on ${a}` : `Every ${r} weeks on ${a}`;
  }
  if (e.mode === "monthly-date") {
    const n = Kt(e.dayOfMonth);
    return r === 1 ? `Monthly on the ${e.dayOfMonth}${n}` : `Every ${r} months on the ${e.dayOfMonth}${n}`;
  }
  if (e.mode === "monthly-nth") {
    const n = gn(e.nth), a = {
      MO: "Monday",
      TU: "Tuesday",
      WE: "Wednesday",
      TH: "Thursday",
      FR: "Friday",
      SA: "Saturday",
      SU: "Sunday"
    };
    return r === 1 ? `Monthly on the ${n} ${a[e.day]}` : `Every ${r} months on the ${n} ${a[e.day]}`;
  }
  if (e.mode === "yearly") {
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
    ], a = Kt(e.dayOfMonth);
    return r === 1 ? `Yearly on ${n[e.month]} ${e.dayOfMonth}${a}` : `Every ${r} years on ${n[e.month]} ${e.dayOfMonth}${a}`;
  }
  return "";
}
function Kt(t) {
  if (t >= 11 && t <= 13) return "th";
  switch (t % 10) {
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
function gn(t) {
  return t === -1 ? "last" : t === 1 ? "1st" : t === 2 ? "2nd" : t === 3 ? "3rd" : `${t}th`;
}
var vn = Object.defineProperty, yn = Object.getOwnPropertyDescriptor, S = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? yn(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && vn(e, r, a), a;
};
const _n = ["🪥", "🛏️", "🎒", "💗", "📵", "🧸", "👕", "🧹", "🧺", "🍽️", "🐕", "🌱"];
let C = class extends y {
  constructor() {
    super(...arguments), this.members = [], this._selectedMemberSlug = "", this._summary = "", this._type = "chore", this._icon = "", this._recurrenceMode = "none", this._recurrenceDays = [], this._recurrenceInterval = 1, this._recurrenceMonthDay = 1, this._recurrenceNth = 1, this._recurrenceNthDay = "MO", this._recurrenceMonth = 1, this._due = "", this._assignee = "", this._error = "", this._saving = !1;
  }
  updated(t) {
    super.updated(t), t.has("member") && this.member && (this._selectedMemberSlug = this.member.slug);
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  _buildRRule() {
    return this._recurrenceMode === "none" ? "" : this._recurrenceMode === "daily" ? U({ mode: "daily", ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {} }) : this._recurrenceMode === "weekly" ? this._recurrenceDays.length === 0 ? "" : U({
      mode: "weekly",
      days: this._recurrenceDays,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-date" ? U({
      mode: "monthly-date",
      dayOfMonth: this._recurrenceMonthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-nth" ? U({
      mode: "monthly-nth",
      nth: this._recurrenceNth,
      day: this._recurrenceNthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "yearly" ? U({
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
        const t = this._buildRRule(), e = this._selectedMemberSlug === "household";
        await pn(this.hass, {
          member: this._selectedMemberSlug,
          summary: this._summary.trim(),
          type: this._type,
          ...t ? { recurrence: t } : {},
          ...this._icon ? { icon: this._icon } : {},
          ...this._due ? { due: this._due } : {},
          source: "manual",
          ...e && this._assignee ? { assignee: this._assignee } : {}
        }), this._close();
      } catch (t) {
        this._error = t instanceof Error ? t.message : "Failed to add task", this._saving = !1;
      }
    }
  }
  _toggleDay(t) {
    this._recurrenceDays.includes(t) ? this._recurrenceDays = this._recurrenceDays.filter((e) => e !== t) : this._recurrenceDays = [...this._recurrenceDays, t];
  }
  render() {
    const t = this._selectedMemberSlug === "household", e = this._buildRRule(), r = e ? mr(e) : "One-off (no repeat)", n = {
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

        ${t ? l`
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
            ${_n.map((a) => l`
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
                            ${me.map((a) => l`
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
                              ${me.map((a) => l`<option value=${a}>${n[a]}</option>`)}
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
C.styles = [
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
], C.prototype, "hass", 2);
S([
  p({ attribute: !1 })
], C.prototype, "member", 2);
S([
  p({ attribute: !1 })
], C.prototype, "members", 2);
S([
  h()
], C.prototype, "_selectedMemberSlug", 2);
S([
  h()
], C.prototype, "_summary", 2);
S([
  h()
], C.prototype, "_type", 2);
S([
  h()
], C.prototype, "_icon", 2);
S([
  h()
], C.prototype, "_recurrenceMode", 2);
S([
  h()
], C.prototype, "_recurrenceDays", 2);
S([
  h()
], C.prototype, "_recurrenceInterval", 2);
S([
  h()
], C.prototype, "_recurrenceMonthDay", 2);
S([
  h()
], C.prototype, "_recurrenceNth", 2);
S([
  h()
], C.prototype, "_recurrenceNthDay", 2);
S([
  h()
], C.prototype, "_recurrenceMonth", 2);
S([
  h()
], C.prototype, "_due", 2);
S([
  h()
], C.prototype, "_assignee", 2);
S([
  h()
], C.prototype, "_error", 2);
S([
  h()
], C.prototype, "_saving", 2);
C = S([
  w("lucarne-add-task-popover")
], C);
var bn = Object.defineProperty, wn = Object.getOwnPropertyDescriptor, E = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? wn(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && bn(e, r, a), a;
};
let x = class extends y {
  constructor() {
    super(...arguments), this.members = [], this._summary = "", this._type = "chore", this._icon = "", this._recurrenceMode = "none", this._recurrenceDays = [], this._recurrenceInterval = 1, this._recurrenceMonthDay = 1, this._recurrenceNth = 1, this._recurrenceNthDay = "MO", this._recurrenceMonth = 1, this._due = "", this._assignee = "", this._isCustomRecurrence = !1, this._rawRecurrence = "", this._error = "", this._saving = !1, this._confirmingDelete = !1;
  }
  updated(t) {
    super.updated(t), t.has("task") && this.task && this._prefill();
  }
  _prefill() {
    const t = this.task;
    this._summary = t.summary, this._type = t.metadata.type, this._icon = t.metadata.icon, this._due = t.due ?? "", this._assignee = t.metadata.assignee_slug, this._recurrenceDays = [], this._recurrenceInterval = 1, this._recurrenceMonthDay = 1, this._recurrenceNth = 1, this._recurrenceNthDay = "MO", this._recurrenceMonth = 1, this._rawRecurrence = "", this._isCustomRecurrence = !1;
    const e = pr(t.metadata.recurrence);
    e.mode === "unknown" ? (this._isCustomRecurrence = !0, this._rawRecurrence = e.raw, this._recurrenceMode = "unknown") : (this._isCustomRecurrence = !1, this._recurrenceMode = e.mode, e.mode === "daily" ? this._recurrenceInterval = e.interval ?? 1 : e.mode === "weekly" ? (this._recurrenceDays = [...e.days], this._recurrenceInterval = e.interval ?? 1) : e.mode === "monthly-date" ? (this._recurrenceMonthDay = e.dayOfMonth, this._recurrenceInterval = e.interval ?? 1) : e.mode === "monthly-nth" ? (this._recurrenceNth = e.nth, this._recurrenceNthDay = e.day, this._recurrenceInterval = e.interval ?? 1) : e.mode === "yearly" && (this._recurrenceMonth = e.month, this._recurrenceMonthDay = e.dayOfMonth, this._recurrenceInterval = e.interval ?? 1));
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  _buildRRule() {
    return this._isCustomRecurrence ? this._rawRecurrence : this._recurrenceMode === "none" ? "" : this._recurrenceMode === "daily" ? U({ mode: "daily", ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {} }) : this._recurrenceMode === "weekly" ? U({
      mode: "weekly",
      days: this._recurrenceDays,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-date" ? U({
      mode: "monthly-date",
      dayOfMonth: this._recurrenceMonthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-nth" ? U({
      mode: "monthly-nth",
      nth: this._recurrenceNth,
      day: this._recurrenceNthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "yearly" ? U({
      mode: "yearly",
      month: this._recurrenceMonth,
      dayOfMonth: this._recurrenceMonthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : "";
  }
  async _save() {
    var t;
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
        const e = this.task.metadata.member_slug === "household" ? "todo.lucarne_household" : ((t = this.members.find((s) => s.slug === this.task.metadata.member_slug)) == null ? void 0 : t.todo_entity_id) ?? "", r = this._summary.trim() !== this.task.summary, n = !!this._due && this._due !== (this.task.due ?? ""), a = this._type !== this.task.metadata.type || this._icon !== this.task.metadata.icon || this._buildRRule() !== this.task.metadata.recurrence || this.task.metadata.member_slug === "household" && this._assignee !== this.task.metadata.assignee_slug;
        if (r || n) {
          if (!e) throw new Error("Could not resolve todo entity for this task");
          await this.hass.callService("todo", "update_item", {
            item: this.task.uid,
            rename: this._summary.trim(),
            ...n ? { due_datetime: this._due } : {}
          }, { entity_id: e });
        }
        if (a) {
          const s = this.task.metadata.member_slug === "household";
          await mn(this.hass, this.task.uid, {
            ...this._type !== this.task.metadata.type ? { type: this._type } : {},
            ...this._icon !== this.task.metadata.icon ? { icon: this._icon } : {},
            ...this._buildRRule() !== this.task.metadata.recurrence ? { recurrence: this._buildRRule() } : {},
            ...s && this._assignee !== this.task.metadata.assignee_slug ? { assignee: this._assignee } : {}
          });
        }
        this._close();
      } catch (e) {
        this._error = e instanceof Error ? e.message : "Failed to save", this._saving = !1;
      }
    }
  }
  async _delete() {
    if (!this._saving) {
      this._saving = !0, this._error = "";
      try {
        await fn(this.hass, this.task.uid), this._close();
      } catch (t) {
        this._error = t instanceof Error ? t.message : "Failed to delete", this._saving = !1, this._confirmingDelete = !1;
      }
    }
  }
  _toggleDay(t) {
    this._recurrenceDays.includes(t) ? this._recurrenceDays = this._recurrenceDays.filter((e) => e !== t) : this._recurrenceDays = [...this._recurrenceDays, t];
  }
  render() {
    var s;
    if (!this.task) return l``;
    const t = this.task.metadata.member_slug === "household", e = t ? "Household" : ((s = this.members.find((i) => i.slug === this.task.metadata.member_slug)) == null ? void 0 : s.name) ?? this.task.metadata.member_slug, r = this._buildRRule(), n = this._isCustomRecurrence ? "Custom recurrence (not editable here)" : mr(r), a = {
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
          <div class="readonly-field" title="Member cannot be changed in v1">${e}</div>
          <div class="readonly-tooltip">Member cannot be changed here</div>
        </div>

        ${t ? l`
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
                                  ${me.map((i) => l`
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
                                    ${me.map((i) => l`<option value=${i}>${a[i]}</option>`)}
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
E([
  p({ attribute: !1 })
], x.prototype, "hass", 2);
E([
  p({ attribute: !1 })
], x.prototype, "task", 2);
E([
  p({ attribute: !1 })
], x.prototype, "members", 2);
E([
  h()
], x.prototype, "_summary", 2);
E([
  h()
], x.prototype, "_type", 2);
E([
  h()
], x.prototype, "_icon", 2);
E([
  h()
], x.prototype, "_recurrenceMode", 2);
E([
  h()
], x.prototype, "_recurrenceDays", 2);
E([
  h()
], x.prototype, "_recurrenceInterval", 2);
E([
  h()
], x.prototype, "_recurrenceMonthDay", 2);
E([
  h()
], x.prototype, "_recurrenceNth", 2);
E([
  h()
], x.prototype, "_recurrenceNthDay", 2);
E([
  h()
], x.prototype, "_recurrenceMonth", 2);
E([
  h()
], x.prototype, "_due", 2);
E([
  h()
], x.prototype, "_assignee", 2);
E([
  h()
], x.prototype, "_isCustomRecurrence", 2);
E([
  h()
], x.prototype, "_rawRecurrence", 2);
E([
  h()
], x.prototype, "_error", 2);
E([
  h()
], x.prototype, "_saving", 2);
E([
  h()
], x.prototype, "_confirmingDelete", 2);
x = E([
  w("lucarne-edit-task-popover")
], x);
var xn = Object.defineProperty, $n = Object.getOwnPropertyDescriptor, ye = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? $n(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && xn(e, r, a), a;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-chores-card",
  name: "Lucarne Chores",
  description: "Family chore grid with streaks and celebration",
  preview: !0
});
let Q = class extends y {
  constructor() {
    super(...arguments), this._familyState = null, this._addTaskMember = null, this._editTask = null;
  }
  setConfig(t) {
    if ("kids" in t) {
      this._config = t;
      return;
    }
    if (!Array.isArray(t.members))
      throw new Error("lucarne-chores-card: members must be an array");
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
      members: []
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.hass && !this._unsubFamily && (this._unsubFamily = Ye(this.hass, (t) => {
      this._familyState = t;
    }));
  }
  updated(t) {
    super.updated(t), t.has("hass") && this.hass && !this._unsubFamily && (this._unsubFamily = Ye(this.hass, (e) => {
      this._familyState = e;
    }));
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._unsubFamily) == null || t.call(this), this._unsubFamily = void 0;
  }
  _resolveMembers() {
    if (!this._config || !this._familyState) return [];
    const { members: t } = this._config, e = this._config.show_routines ?? !0, r = this._config.show_tasks ?? !0, n = /* @__PURE__ */ new Date(), a = new Date(n.getFullYear(), n.getMonth(), n.getDate(), 23, 59, 59, 999), s = [];
    for (const i of t) {
      const o = i === "household" ? Ue : this._familyState.members.find((m) => m.slug === i) ?? null;
      if (!o) continue;
      const d = (this._familyState.tasksByMember.get(i) ?? []).filter((m) => m.metadata.type === "routine" ? e : m.metadata.type === "chore" && r ? m.due === null ? !0 : (m.due.includes("T") ? new Date(m.due) : /* @__PURE__ */ new Date(m.due + "T00:00:00")) <= a : !1), u = this._familyState.streakByMember.get(i) ?? 0;
      s.push({ member: o, tasks: d, streak: u });
    }
    return s;
  }
  async _handleTaskToggle(t) {
    var a;
    const { task: e } = t.detail;
    if (!this.hass || !this._familyState) return;
    const r = e.status === "completed" ? "needs_action" : "completed", n = e.metadata.member_slug === "household" ? "todo.lucarne_household" : ((a = this._familyState.members.find((s) => s.slug === e.metadata.member_slug)) == null ? void 0 : a.todo_entity_id) ?? "";
    n && await this.hass.callService("todo", "update_item", { item: e.uid, status: r }, { entity_id: n });
  }
  _handleAddTask(t) {
    const { memberSlug: e } = t.detail;
    if (!this._familyState) return;
    const r = e === "household" ? Ue : this._familyState.members.find((n) => n.slug === e) ?? null;
    r && (this._addTaskMember = r);
  }
  _handleLongPress(t) {
    const { task: e } = t.detail;
    this._editTask = e;
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
    const t = this._config.title ?? "Chores", e = this._config.show_routines ?? !0, r = this._config.show_tasks ?? !0, n = this._config.show_streak ?? !0;
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
    const a = this._resolveMembers(), s = [...this._familyState.members, Ue];
    return l`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${t}</h2>
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
                ?show-routines=${e}
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
ye([
  p({ attribute: !1 })
], Q.prototype, "hass", 2);
ye([
  h()
], Q.prototype, "_config", 2);
ye([
  h()
], Q.prototype, "_familyState", 2);
ye([
  h()
], Q.prototype, "_addTaskMember", 2);
ye([
  h()
], Q.prototype, "_editTask", 2);
Q = ye([
  w("lucarne-chores-card")
], Q);
var kn = Object.defineProperty, Cn = Object.getOwnPropertyDescriptor, Je = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? Cn(e, r) : e, s = t.length - 1, i; s >= 0; s--)
    (i = t[s]) && (a = (n ? i(e, r, a) : i(a)) || a);
  return n && a && kn(e, r, a), a;
};
let fe = class extends y {
  constructor() {
    super(...arguments), this._familyState = null;
  }
  setConfig(t) {
    this._config = t;
  }
  connectedCallback() {
    super.connectedCallback(), this.hass && !this._unsubFamily && (this._unsubFamily = Ye(this.hass, (t) => {
      this._familyState = t;
    }));
  }
  updated(t) {
    super.updated(t), t.has("hass") && this.hass && !this._unsubFamily && (this._unsubFamily = Ye(this.hass, (e) => {
      this._familyState = e;
    }));
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._unsubFamily) == null || t.call(this), this._unsubFamily = void 0;
  }
  _fire(t) {
    const e = { ...t };
    delete e.kids, Array.isArray(e.members) || (e.members = []), dt(this, "config-changed", { config: e });
  }
  _titleChanged(t) {
    const e = t.target.value;
    this._fire({ ...this._config, title: e || void 0 });
  }
  _memberToggled(t, e) {
    var n;
    const r = [...((n = this._config) == null ? void 0 : n.members) ?? []];
    if (e)
      r.includes(t) || r.push(t);
    else {
      const a = r.indexOf(t);
      a >= 0 && r.splice(a, 1);
    }
    this._fire({ ...this._config, members: r });
  }
  _toggleChanged(t, e) {
    const r = e.target.checked;
    this._fire({ ...this._config, [t]: r });
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
    const t = [...this._familyState.members, Ue], e = this._config.members ?? [];
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
      ${t.map(
      (r) => l`
          <div class="member-row">
            <input
              type="checkbox"
              id="member-${r.slug}"
              .checked=${e.includes(r.slug)}
              @change=${(n) => this._memberToggled(r.slug, n.target.checked)}
            />
            <label for="member-${r.slug}">${r.name}</label>
          </div>
        `
    )}

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
fe.styles = [
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
Je([
  p({ attribute: !1 })
], fe.prototype, "hass", 2);
Je([
  h()
], fe.prototype, "_config", 2);
Je([
  h()
], fe.prototype, "_familyState", 2);
fe = Je([
  w("lucarne-chores-card-editor")
], fe);
//# sourceMappingURL=ha-lucarne.js.map
