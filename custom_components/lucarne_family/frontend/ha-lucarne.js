/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zt = globalThis, gr = zt.ShadowRoot && (zt.ShadyCSS === void 0 || zt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, vr = Symbol(), Nr = /* @__PURE__ */ new WeakMap();
let Ha = class {
  constructor(e, r, a) {
    if (this._$cssResult$ = !0, a !== vr) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = r;
  }
  get styleSheet() {
    let e = this.o;
    const r = this.t;
    if (gr && e === void 0) {
      const a = r !== void 0 && r.length === 1;
      a && (e = Nr.get(r)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && Nr.set(r, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ba = (t) => new Ha(typeof t == "string" ? t : t + "", void 0, vr), M = (t, ...e) => {
  const r = t.length === 1 ? t[0] : e.reduce((a, i, n) => a + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + t[n + 1], t[0]);
  return new Ha(r, t, vr);
}, Ci = (t, e) => {
  if (gr) t.adoptedStyleSheets = e.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of e) {
    const a = document.createElement("style"), i = zt.litNonce;
    i !== void 0 && a.setAttribute("nonce", i), a.textContent = r.cssText, t.appendChild(a);
  }
}, zr = gr ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let r = "";
  for (const a of e.cssRules) r += a.cssText;
  return Ba(r);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Di, defineProperty: Mi, getOwnPropertyDescriptor: Ei, getOwnPropertyNames: Si, getOwnPropertySymbols: Ti, getPrototypeOf: Ai } = Object, $e = globalThis, Lr = $e.trustedTypes, Oi = Lr ? Lr.emptyScript : "", Zt = $e.reactiveElementPolyfillSupport, ut = (t, e) => t, Lt = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Oi : null;
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
} }, yr = (t, e) => !Di(t, e), Hr = { attribute: !0, type: String, converter: Lt, reflect: !1, useDefault: !1, hasChanged: yr };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $e.litPropertyMetadata ?? ($e.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let We = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, r = Hr) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(e, r), !r.noAccessor) {
      const a = Symbol(), i = this.getPropertyDescriptor(e, a, r);
      i !== void 0 && Mi(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, r, a) {
    const { get: i, set: n } = Ei(this.prototype, e) ?? { get() {
      return this[r];
    }, set(s) {
      this[r] = s;
    } };
    return { get: i, set(s) {
      const o = i == null ? void 0 : i.call(this);
      n == null || n.call(this, s), this.requestUpdate(e, o, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Hr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ut("elementProperties"))) return;
    const e = Ai(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ut("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ut("properties"))) {
      const r = this.properties, a = [...Si(r), ...Ti(r)];
      for (const i of a) this.createProperty(i, r[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const r = litPropertyMetadata.get(e);
      if (r !== void 0) for (const [a, i] of r) this.elementProperties.set(a, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, a] of this.elementProperties) {
      const i = this._$Eu(r, a);
      i !== void 0 && this._$Eh.set(i, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const r = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const i of a) r.unshift(zr(i));
    } else e !== void 0 && r.push(zr(e));
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
    return Ci(e, this.constructor.elementStyles), e;
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
    const a = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, a);
    if (i !== void 0 && a.reflect === !0) {
      const s = (((n = a.converter) == null ? void 0 : n.toAttribute) !== void 0 ? a.converter : Lt).toAttribute(r, a.type);
      this._$Em = e, s == null ? this.removeAttribute(i) : this.setAttribute(i, s), this._$Em = null;
    }
  }
  _$AK(e, r) {
    var n, s;
    const a = this.constructor, i = a._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const o = a.getPropertyOptions(i), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : Lt;
      this._$Em = i;
      const d = l.fromAttribute(r, o.type);
      this[i] = d ?? ((s = this._$Ej) == null ? void 0 : s.get(i)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, r, a, i = !1, n) {
    var s;
    if (e !== void 0) {
      const o = this.constructor;
      if (i === !1 && (n = this[e]), a ?? (a = o.getPropertyOptions(e)), !((a.hasChanged ?? yr)(n, r) || a.useDefault && a.reflect && n === ((s = this._$Ej) == null ? void 0 : s.get(e)) && !this.hasAttribute(o._$Eu(e, a)))) return;
      this.C(e, r, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, r, { useDefault: a, reflect: i, wrapped: n }, s) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, s ?? r ?? this[e]), n !== !0 || s !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (r = void 0), this._$AL.set(e, r)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [n, s] of this._$Ep) this[n] = s;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, s] of i) {
        const { wrapped: o } = s, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, s, l);
      }
    }
    let e = !1;
    const r = this._$AL;
    try {
      e = this.shouldUpdate(r), e ? (this.willUpdate(r), (a = this._$EO) == null || a.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(r)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(r);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var r;
    (r = this._$EO) == null || r.forEach((a) => {
      var i;
      return (i = a.hostUpdated) == null ? void 0 : i.call(a);
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
We.elementStyles = [], We.shadowRootOptions = { mode: "open" }, We[ut("elementProperties")] = /* @__PURE__ */ new Map(), We[ut("finalized")] = /* @__PURE__ */ new Map(), Zt == null || Zt({ ReactiveElement: We }), ($e.reactiveElementVersions ?? ($e.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt = globalThis, Br = (t) => t, Ht = pt.trustedTypes, jr = Ht ? Ht.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, ja = "$lit$", _e = `lit$${Math.random().toFixed(9).slice(2)}$`, Ua = "?" + _e, Pi = `<${Ua}>`, Ie = document, gt = () => Ie.createComment(""), vt = (t) => t === null || typeof t != "object" && typeof t != "function", br = Array.isArray, Ii = (t) => br(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Jt = `[ 	
\f\r]`, st = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ur = /-->/g, Fr = />/g, Se = RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Wr = /'/g, Yr = /"/g, Fa = /^(?:script|style|textarea|title)$/i, Wa = (t) => (e, ...r) => ({ _$litType$: t, strings: e, values: r }), u = Wa(1), ne = Wa(2), Re = Symbol.for("lit-noChange"), B = Symbol.for("lit-nothing"), Vr = /* @__PURE__ */ new WeakMap(), Oe = Ie.createTreeWalker(Ie, 129);
function Ya(t, e) {
  if (!br(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return jr !== void 0 ? jr.createHTML(e) : e;
}
const Ri = (t, e) => {
  const r = t.length - 1, a = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", s = st;
  for (let o = 0; o < r; o++) {
    const l = t[o];
    let d, c, h = -1, p = 0;
    for (; p < l.length && (s.lastIndex = p, c = s.exec(l), c !== null); ) p = s.lastIndex, s === st ? c[1] === "!--" ? s = Ur : c[1] !== void 0 ? s = Fr : c[2] !== void 0 ? (Fa.test(c[2]) && (i = RegExp("</" + c[2], "g")), s = Se) : c[3] !== void 0 && (s = Se) : s === Se ? c[0] === ">" ? (s = i ?? st, h = -1) : c[1] === void 0 ? h = -2 : (h = s.lastIndex - c[2].length, d = c[1], s = c[3] === void 0 ? Se : c[3] === '"' ? Yr : Wr) : s === Yr || s === Wr ? s = Se : s === Ur || s === Fr ? s = st : (s = Se, i = void 0);
    const f = s === Se && t[o + 1].startsWith("/>") ? " " : "";
    n += s === st ? l + Pi : h >= 0 ? (a.push(d), l.slice(0, h) + ja + l.slice(h) + _e + f) : l + _e + (h === -2 ? o : f);
  }
  return [Ya(t, n + (t[r] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class yt {
  constructor({ strings: e, _$litType$: r }, a) {
    let i;
    this.parts = [];
    let n = 0, s = 0;
    const o = e.length - 1, l = this.parts, [d, c] = Ri(e, r);
    if (this.el = yt.createElement(d, a), Oe.currentNode = this.el.content, r === 2 || r === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = Oe.nextNode()) !== null && l.length < o; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(ja)) {
          const p = c[s++], f = i.getAttribute(h).split(_e), y = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: n, name: y[2], strings: f, ctor: y[1] === "." ? zi : y[1] === "?" ? Li : y[1] === "@" ? Hi : Ft }), i.removeAttribute(h);
        } else h.startsWith(_e) && (l.push({ type: 6, index: n }), i.removeAttribute(h));
        if (Fa.test(i.tagName)) {
          const h = i.textContent.split(_e), p = h.length - 1;
          if (p > 0) {
            i.textContent = Ht ? Ht.emptyScript : "";
            for (let f = 0; f < p; f++) i.append(h[f], gt()), Oe.nextNode(), l.push({ type: 2, index: ++n });
            i.append(h[p], gt());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ua) l.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(_e, h + 1)) !== -1; ) l.push({ type: 7, index: n }), h += _e.length - 1;
      }
      n++;
    }
  }
  static createElement(e, r) {
    const a = Ie.createElement("template");
    return a.innerHTML = e, a;
  }
}
function Qe(t, e, r = t, a) {
  var s, o;
  if (e === Re) return e;
  let i = a !== void 0 ? (s = r._$Co) == null ? void 0 : s[a] : r._$Cl;
  const n = vt(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((o = i == null ? void 0 : i._$AO) == null || o.call(i, !1), n === void 0 ? i = void 0 : (i = new n(t), i._$AT(t, r, a)), a !== void 0 ? (r._$Co ?? (r._$Co = []))[a] = i : r._$Cl = i), i !== void 0 && (e = Qe(t, i._$AS(t, e.values), i, a)), e;
}
class Ni {
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
    const { el: { content: r }, parts: a } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? Ie).importNode(r, !0);
    Oe.currentNode = i;
    let n = Oe.nextNode(), s = 0, o = 0, l = a[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let d;
        l.type === 2 ? d = new Dt(n, n.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (d = new Bi(n, this, e)), this._$AV.push(d), l = a[++o];
      }
      s !== (l == null ? void 0 : l.index) && (n = Oe.nextNode(), s++);
    }
    return Oe.currentNode = Ie, i;
  }
  p(e) {
    let r = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, r), r += a.strings.length - 2) : a._$AI(e[r])), r++;
  }
}
class Dt {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, r, a, i) {
    this.type = 2, this._$AH = B, this._$AN = void 0, this._$AA = e, this._$AB = r, this._$AM = a, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    e = Qe(this, e, r), vt(e) ? e === B || e == null || e === "" ? (this._$AH !== B && this._$AR(), this._$AH = B) : e !== this._$AH && e !== Re && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ii(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== B && vt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Ie.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: r, _$litType$: a } = e, i = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = yt.createElement(Ya(a.h, a.h[0]), this.options)), a);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(r);
    else {
      const s = new Ni(i, this), o = s.u(this.options);
      s.p(r), this.T(o), this._$AH = s;
    }
  }
  _$AC(e) {
    let r = Vr.get(e.strings);
    return r === void 0 && Vr.set(e.strings, r = new yt(e)), r;
  }
  k(e) {
    br(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let a, i = 0;
    for (const n of e) i === r.length ? r.push(a = new Dt(this.O(gt()), this.O(gt()), this, this.options)) : a = r[i], a._$AI(n), i++;
    i < r.length && (this._$AR(a && a._$AB.nextSibling, i), r.length = i);
  }
  _$AR(e = this._$AA.nextSibling, r) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, r); e !== this._$AB; ) {
      const i = Br(e).nextSibling;
      Br(e).remove(), e = i;
    }
  }
  setConnected(e) {
    var r;
    this._$AM === void 0 && (this._$Cv = e, (r = this._$AP) == null || r.call(this, e));
  }
}
class Ft {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, r, a, i, n) {
    this.type = 1, this._$AH = B, this._$AN = void 0, this.element = e, this.name = r, this._$AM = i, this.options = n, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = B;
  }
  _$AI(e, r = this, a, i) {
    const n = this.strings;
    let s = !1;
    if (n === void 0) e = Qe(this, e, r, 0), s = !vt(e) || e !== this._$AH && e !== Re, s && (this._$AH = e);
    else {
      const o = e;
      let l, d;
      for (e = n[0], l = 0; l < n.length - 1; l++) d = Qe(this, o[a + l], r, l), d === Re && (d = this._$AH[l]), s || (s = !vt(d) || d !== this._$AH[l]), d === B ? e = B : e !== B && (e += (d ?? "") + n[l + 1]), this._$AH[l] = d;
    }
    s && !i && this.j(e);
  }
  j(e) {
    e === B ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class zi extends Ft {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === B ? void 0 : e;
  }
}
class Li extends Ft {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== B);
  }
}
class Hi extends Ft {
  constructor(e, r, a, i, n) {
    super(e, r, a, i, n), this.type = 5;
  }
  _$AI(e, r = this) {
    if ((e = Qe(this, e, r, 0) ?? B) === Re) return;
    const a = this._$AH, i = e === B && a !== B || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, n = e !== B && (a === B || i);
    i && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var r;
    typeof this._$AH == "function" ? this._$AH.call(((r = this.options) == null ? void 0 : r.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Bi {
  constructor(e, r, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Qe(this, e);
  }
}
const er = pt.litHtmlPolyfillSupport;
er == null || er(yt, Dt), (pt.litHtmlVersions ?? (pt.litHtmlVersions = [])).push("3.3.3");
const ji = (t, e, r) => {
  const a = (r == null ? void 0 : r.renderBefore) ?? e;
  let i = a._$litPart$;
  if (i === void 0) {
    const n = (r == null ? void 0 : r.renderBefore) ?? null;
    a._$litPart$ = i = new Dt(e.insertBefore(gt(), n), n, void 0, r ?? {});
  }
  return i._$AI(t), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pe = globalThis;
let D = class extends We {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ji(r, this.renderRoot, this.renderOptions);
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
    return Re;
  }
};
var La;
D._$litElement$ = !0, D.finalized = !0, (La = Pe.litElementHydrateSupport) == null || La.call(Pe, { LitElement: D });
const tr = Pe.litElementPolyfillSupport;
tr == null || tr({ LitElement: D });
(Pe.litElementVersions ?? (Pe.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = (t) => (e, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ui = { attribute: !0, type: String, converter: Lt, reflect: !1, hasChanged: yr }, Fi = (t = Ui, e, r) => {
  const { kind: a, metadata: i } = r;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(r.name, t), a === "accessor") {
    const { name: s } = r;
    return { set(o) {
      const l = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(s, l, t, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(s, void 0, t, o), o;
    } };
  }
  if (a === "setter") {
    const { name: s } = r;
    return function(o) {
      const l = this[s];
      e.call(this, o), this.requestUpdate(s, l, t, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function g(t) {
  return (e, r) => typeof r == "object" ? Fi(t, e, r) : ((a, i, n) => {
    const s = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, a), s ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(t, e, r);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(t) {
  return g({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wi = (t, e, r) => (r.configurable = !0, r.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, r), r);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _r(t, e) {
  return (r, a, i) => {
    const n = (s) => {
      var o;
      return ((o = s.renderRoot) == null ? void 0 : o.querySelector(t)) ?? null;
    };
    return Wi(r, a, { get() {
      return n(this);
    } });
  };
}
const N = M`
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

    /* Constant fill height shared by the Today + Calendar cards so they line up
       side by side. The 240px offset (header/pills/chrome) leaves slightly more
       vertical room than the cards' previous 280px so the iPad space is used. */
    --lucarne-card-fill-height: calc(100vh - 240px);
  }

  @supports (height: 100dvh) {
    :host {
      --lucarne-card-fill-height: calc(100dvh - 240px);
    }
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --lucarne-skeleton-base: rgba(255, 255, 255, 0.08);
      --lucarne-skeleton-highlight: rgba(255, 255, 255, 0.16);
    }
  }
`;
function Va(t, e, r) {
  let a, i = !1;
  return t.connection.subscribeMessage(
    (n) => {
      var s, o;
      (o = (s = n.variables) == null ? void 0 : s.trigger) != null && o.to_state && r(n.variables.trigger.to_state);
    },
    { type: "subscribe_trigger", trigger: { platform: "state", entity_id: e } }
  ).then((n) => {
    i ? n() : a = n;
  }), () => {
    i = !0, a == null || a();
  };
}
function Xr(t) {
  return typeof t == "string" ? t : t && typeof t == "object" ? t.dateTime ?? t.date ?? "" : "";
}
function Yi(t) {
  const e = {
    start: Xr(t.start),
    end: Xr(t.end),
    summary: t.summary ?? ""
  };
  return t.description && (e.description = t.description), t.location && (e.location = t.location), t.uid && (e.uid = t.uid), t.recurrence_id && (e.recurrence_id = t.recurrence_id), t.rrule && (e.rrule = t.rrule), e;
}
async function Xa(t, e, r, a) {
  const i = /* @__PURE__ */ new Set(), n = encodeURIComponent(r.toISOString()), s = encodeURIComponent(a.toISOString()), o = await Promise.all(
    e.map(
      (l) => t.callApi(
        "GET",
        `calendars/${encodeURIComponent(l)}?start=${n}&end=${s}`
      ).then((d) => [l, d.map(Yi)]).catch((d) => (console.warn(`[lucarne] GET /api/calendars/${l} failed:`, d), i.add(l), [l, []]))
    )
  );
  return { events: new Map(o), failed: i };
}
async function Vi(t, e, r, a, i) {
  await t.connection.sendMessagePromise({
    type: "calendar/event/delete",
    entity_id: e,
    uid: r,
    recurrence_id: a,
    recurrence_range: i
  });
}
const Xi = 2;
function qi(t, e) {
  var a, i;
  const r = (i = (a = t.states[e]) == null ? void 0 : a.attributes) == null ? void 0 : i.supported_features;
  return typeof r != "number" ? !1 : (r & Xi) !== 0;
}
function nr(t, e, r) {
  const a = async () => {
    var i, n;
    try {
      const s = await t.connection.sendMessagePromise({
        type: "call_service",
        domain: "todo",
        service: "get_items",
        service_data: {},
        target: { entity_id: e },
        return_response: !0
      });
      r(((n = (i = s == null ? void 0 : s.response) == null ? void 0 : i[e]) == null ? void 0 : n.items) ?? []);
    } catch (s) {
      console.warn(`[lucarne] todo.get_items failed for ${e}:`, s), r([]);
    }
  };
  return a(), Va(t, e, () => a());
}
function Gi(t) {
  let e = t;
  for (; e; ) {
    if (e instanceof Element) {
      const i = e.tagName.toLowerCase();
      if (i === "hui-dialog-edit-card" || i === "ha-dialog") return !0;
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
function Ki(t) {
  let e = t.parentElement;
  for (; e && !e.style.getPropertyValue("--column-size"); )
    e = e.parentElement;
  return (e == null ? void 0 : e.parentElement) ?? null;
}
function qa(t) {
  if (!Gi(t)) return null;
  const e = Ki(t);
  if (!e) return null;
  const r = e.style.getPropertyValue("--grid-column-count"), a = () => {
    e.style.getPropertyValue("--grid-column-count") !== "1" && e.style.setProperty("--grid-column-count", "1");
  };
  a();
  const i = new MutationObserver(a);
  return i.observe(e, { attributes: !0, attributeFilter: ["style"] }), {
    uninstall() {
      i.disconnect(), r ? e.style.setProperty("--grid-column-count", r) : e.style.removeProperty("--grid-column-count");
    }
  };
}
const mt = {
  slug: "household",
  name: "Household",
  color: "var(--primary-color)",
  avatar: null,
  todo_entity_id: "todo.lucarne_household",
  streak_counter_id: ""
}, Qi = [
  "lucarne_family_task_added",
  "lucarne_family_task_completed",
  "lucarne_family_task_deleted",
  "lucarne_family_task_metadata_updated",
  "lucarne_family_task_toggled",
  "lucarne_family_all_routines_done",
  "lucarne_family_member_updated",
  "lucarne_family_avatar_uploaded"
];
function qr(t, e, r) {
  return t.map((a) => {
    const n = r.get(a.uid) ?? {
      item_uid: a.uid,
      member_slug: e,
      assignee_slug: "",
      type: "chore",
      recurrence: "",
      icon: "",
      source: "manual",
      time_of_day: "anytime"
    };
    return {
      uid: a.uid,
      summary: a.summary,
      status: a.status,
      due: a.due ?? null,
      description: a.description ?? "",
      metadata: n
    };
  });
}
function bt(t, e) {
  let r = !1;
  const a = [];
  let i = /* @__PURE__ */ new Map(), n = [];
  const s = /* @__PURE__ */ new Map();
  let o = /* @__PURE__ */ new Map(), l = "", d = "", c = null, h = null;
  function p() {
    if (r) return;
    const b = /* @__PURE__ */ new Map();
    for (const x of n) {
      const k = s.get(x.todo_entity_id) ?? [];
      b.set(x.slug, qr(k, x.slug, i));
    }
    const w = s.get("todo.lucarne_household") ?? [];
    b.set("household", qr(w, "household", i)), e({
      members: n,
      tasksByMember: b,
      streakByMember: new Map(o),
      taskMetadataByUid: new Map(i),
      resetTime: l,
      streakCheckTime: d,
      integrationError: h
    });
  }
  async function f() {
    var b, w;
    try {
      const x = await t.connection.sendMessagePromise({
        type: "lucarne_family/get_family"
      });
      if (r) return;
      const k = /* @__PURE__ */ new Map();
      for (const m of x.task_metadata ?? [])
        k.set(m.item_uid, m);
      i = k, l = x.reset_time ?? "", d = x.streak_check_time ?? "", n = (x.members ?? []).filter((m) => m.todo_entity_id ? !0 : (console.debug(`[lucarne] skipping member ${m.slug}: no todo_entity_id yet`), !1)), h = null, o = /* @__PURE__ */ new Map(), a.forEach((m) => m()), a.length = 0;
      for (const m of n) {
        const C = nr(t, m.todo_entity_id, (S) => {
          s.set(m.todo_entity_id, S), p();
        });
        if (a.push(C), m.streak_counter_id) {
          const S = (w = (b = t.states) == null ? void 0 : b[m.streak_counter_id]) == null ? void 0 : w.state;
          if (S !== void 0) {
            const X = parseInt(S, 10);
            o.set(m.slug, isNaN(X) ? 0 : X);
          }
          const V = Va(t, m.streak_counter_id, (X) => {
            const se = parseInt(X.state, 10);
            o.set(m.slug, isNaN(se) ? 0 : se), p();
          });
          a.push(V);
        }
      }
      const F = nr(t, "todo.lucarne_household", (m) => {
        s.set("todo.lucarne_household", m), p();
      });
      a.push(F), p();
    } catch (x) {
      console.debug("[lucarne] get_family failed — integration may not be installed:", x), r || (h = x instanceof Error ? x : new Error(String(x)), a.forEach((k) => k()), a.length = 0, n = [], i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s.clear(), l = "", d = "", p());
    }
  }
  function y() {
    c === null && (c = setTimeout(() => {
      c = null, f();
    }, 1e3));
  }
  const _ = [];
  for (const b of Qi)
    t.connection.subscribeEvents(() => {
      y();
    }, b).then((w) => {
      r ? w() : _.push(w);
    }).catch((w) => {
      console.debug(`[lucarne] could not subscribe to ${b}:`, w);
    });
  return f(), () => {
    r = !0, c !== null && clearTimeout(c), a.forEach((b) => b()), _.forEach((b) => b());
  };
}
const P = {
  today: "Today",
  nothingOnCalendar: "Nothing on the calendar today",
  allDone: "All done!",
  allDoneForNow: "All done for now!",
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
  timePillNow: "now",
  timePillInMinutes: (t) => `in ${t}m`,
  timePillInHours: (t) => `in ${t}h`,
  timePillTomorrow: (t) => `tomorrow ${t}`,
  errorUnavailable: "—",
  noRoutinesToday: "no routines today",
  familyReady: (t, e) => `${t}/${e} ready`
};
var Zi = Object.defineProperty, Ji = Object.getOwnPropertyDescriptor, Wt = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? Ji(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Zi(e, r, i), i;
};
function Ve(t) {
  return t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
}
function en(t, e, r) {
  const a = new Date(e);
  return a.setHours(0, 0, 0, 0), a.setDate(a.getDate() + r), t.filter((i) => Ve(i.end) > e && Ve(i.start) < a).sort((i, n) => Ve(i.start).getTime() - Ve(n.start).getTime());
}
function tn(t, e, r) {
  const a = t.getTime() - r.getTime();
  if (t <= r && r < e) return P.timePillNow;
  if (a > 0 && a < 60 * 60 * 1e3) {
    const d = Math.round(a / 6e4);
    return P.timePillInMinutes(d);
  }
  if (a > 0 && a < 2 * 60 * 60 * 1e3) {
    const d = Math.round(a / 36e5);
    return P.timePillInHours(d);
  }
  const n = t.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: !1 });
  if (t.toDateString() === r.toDateString()) return n;
  const o = new Date(r);
  return o.setDate(r.getDate() + 1), t.toDateString() === o.toDateString() ? P.timePillTomorrow(n) : `${t.toLocaleDateString("en", { weekday: "short" })} ${n}`;
}
function rn(t) {
  return t.start.length === 10 && t.end.length === 10;
}
let Ze = class extends D {
  constructor() {
    super(...arguments), this.events = [], this.calendarColors = /* @__PURE__ */ new Map(), this.windowDays = 1;
  }
  render() {
    const t = /* @__PURE__ */ new Date(), e = en(this.events, t, this.windowDays);
    return e.length === 0 ? u`<div class="empty-state">${P.nothingOnCalendar}</div>` : u`
      ${e.map((r) => {
      const a = Ve(r.start), i = Ve(r.end), n = a <= t && t < i, s = rn(r) ? "all day" : tn(a, i, t), o = this._colorForEvent(r);
      return u`
          <div class="event-row">
            <div class="time-pill ${n ? "now" : ""}">
              ${n ? u`<span class="pulse-dot"></span>` : ""} ${s}
            </div>
            <div class="color-bar" style="background:${o}"></div>
            <div class="event-content">
              <div class="event-summary">${r.summary}</div>
              ${r.location ? u`<div class="event-secondary">${r.location}</div>` : ""}
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
Ze.styles = [
  N,
  M`
      :host {
        display: block;
        padding: var(--lucarne-spacing-md) var(--lucarne-spacing-lg);
        container-type: inline-size;
        /* A long today-list scrolls within the section instead of stretching
           the card. The host card can tune the cap via --lucarne-agenda-max-height. */
        max-height: var(--lucarne-agenda-max-height, 360px);
        overflow-y: auto;
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
Wt([
  g({ type: Array })
], Ze.prototype, "events", 2);
Wt([
  g({ type: Object })
], Ze.prototype, "calendarColors", 2);
Wt([
  g({ type: Number })
], Ze.prototype, "windowDays", 2);
Ze = Wt([
  E("lucarne-agenda-strip")
], Ze);
const Gr = ne`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`, Ye = ne`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>`, ot = ne`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
  <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`, Kr = ne`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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
</svg>`, an = ne`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M4.22 19.78l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="currentColor"/>
  <path d="M20 15h-1.26A6 6 0 1 0 8 20h12a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.7"/>
</svg>`;
ne`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="7" r="4"/>
  <path d="M20 21a8 8 0 1 0-16 0"/>
</svg>`;
ne`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"/>
</svg>`;
const Qr = ne`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`, nn = ne`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z"/>
</svg>`, sn = ne`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z"/>
</svg>`, on = ne`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z"/>
</svg>`, Zr = {
  sunny: Gr,
  "clear-night": Gr,
  cloudy: Ye,
  fog: Ye,
  hail: ot,
  lightning: ot,
  "lightning-rainy": ot,
  partlycloudy: an,
  pouring: ot,
  rainy: ot,
  snowy: Kr,
  "snowy-rainy": Kr,
  windy: Ye,
  "windy-variant": Ye,
  exceptional: Ye
};
function Jr(t) {
  return Zr[t] ?? Zr[t.toLowerCase()] ?? Ye;
}
const ln = {
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
function ea(t) {
  return ln[t.toLowerCase()] ?? "#8aa0b8";
}
function cn(t) {
  if (!t.length) return P.dressingTipDefault;
  const e = t[0];
  if (e.condition.toLowerCase().includes("snow"))
    return P.dressingTipBoots;
  const a = e.temperature;
  let i;
  return a < 5 ? i = P.dressingTipHeavyCoat : a < 12 ? i = P.dressingTipCoatScarf : a < 18 ? i = P.dressingTipLightJacket : a < 24 ? i = P.dressingTipTShirt : i = P.dressingTipShorts, (e.precipitation_probability ?? 0) > 50 && (i += P.dressingTipUmbrella), i;
}
var dn = Object.defineProperty, hn = Object.getOwnPropertyDescriptor, wr = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? hn(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && dn(e, r, i), i;
};
let _t = class extends D {
  constructor() {
    super(...arguments), this.forecast = [];
  }
  render() {
    if (!this.weatherEntity)
      return u`<div class="empty-state">${P.addWeatherEntity}</div>`;
    const t = this.weatherEntity.attributes, e = t.temperature, r = t.temperature_unit ?? "°C", a = this.weatherEntity.state, i = this.forecast[0], n = this.forecast[1], s = cn(this.forecast);
    return u`
      <div class="current">
        <span class="condition-icon" style="color: ${ea(a)}">${Jr(a)}</span>
        <div class="temp-group">
          <div class="current-temp">${e !== void 0 ? `${Math.round(e)}${r}` : P.errorUnavailable}</div>
          ${i ? u`<div class="high-low">
                ↑${Math.round(i.temperature)}${r}
                ${i.templow !== void 0 ? ` ↓${Math.round(i.templow)}${r}` : ""}
              </div>` : ""}
        </div>
      </div>
      ${n ? u`
            <div class="tomorrow-row">
              <span class="tomorrow-icon" style="color: ${ea(n.condition)}">${Jr(n.condition)}</span>
              <span>Tomorrow ↑${Math.round(n.temperature)}${r}${n.templow !== void 0 ? ` ↓${Math.round(n.templow)}${r}` : ""}</span>
            </div>
          ` : ""}
      <div class="dressing-tip">
        <span class="dressing-label">Wear:</span>
        ${s}
      </div>
    `;
  }
};
_t.styles = [
  N,
  M`
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
wr([
  g({ attribute: !1 })
], _t.prototype, "weatherEntity", 2);
wr([
  g({ type: Array })
], _t.prototype, "forecast", 2);
_t = wr([
  E("lucarne-weather-block")
], _t);
var un = Object.defineProperty, pn = Object.getOwnPropertyDescriptor, Yt = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? pn(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && un(e, r, i), i;
};
const Ga = /^(?=.*[\p{Extended_Pictographic}\p{Regional_Indicator}])[\p{Extended_Pictographic}\p{Emoji_Component}\p{Emoji_Modifier}\p{Regional_Indicator}‍️]+$/u;
let Je = class extends D {
  constructor() {
    super(...arguments), this.name = "", this.color = "#a8d8b9", this.avatar = null;
  }
  render() {
    const t = this.avatar;
    if (t && t.startsWith("/local/"))
      return u`
        <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
          <img src="${t}" alt="${this.name}" />
        </div>
      `;
    if (t && Ga.test(t))
      return u`
        <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
          <span class="emoji">${t}</span>
        </div>
      `;
    const e = this.name.trim().charAt(0) || "?";
    return u`
      <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
        <span class="initial">${e}</span>
      </div>
    `;
  }
};
Je.styles = M`
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
Yt([
  g()
], Je.prototype, "name", 2);
Yt([
  g()
], Je.prototype, "color", 2);
Yt([
  g()
], Je.prototype, "avatar", 2);
Je = Yt([
  E("lucarne-member-avatar")
], Je);
var mn = Object.defineProperty, fn = Object.getOwnPropertyDescriptor, Vt = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? fn(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && mn(e, r, i), i;
};
const gn = 500;
let et = class extends D {
  constructor() {
    super(...arguments), this.memberColor = "#a8d8b9", this.compact = !1, this._pressTimer = null, this._longPressed = !1;
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
    }, gn), t.currentTarget.setPointerCapture(t.pointerId);
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
    if (!this.task) return u``;
    const t = this.task.status === "completed", e = this.task.metadata.icon, r = this.task.due;
    return u`
      <div
        class="row"
        style="--member-color:${this.memberColor}"
        role="checkbox"
        aria-checked=${t}
        tabindex="0"
        @click=${this._onClick}
        @keydown=${(a) => {
      (a.key === "Enter" || a.key === " ") && !a.repeat && (a.preventDefault(), this._onClick());
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
        ${e ? u`<span class="icon">${e}</span>` : ""}
        <div class="middle">
          <span class="label ${t ? "done" : ""}">${this.task.summary}</span>
        </div>
        ${r ? u`<span class="due">${this._formatDue(r)}</span>` : ""}
      </div>
    `;
  }
  _formatDue(t) {
    if (t.includes("T")) {
      const e = new Date(t);
      return isNaN(e.getTime()) ? t : e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (t.length === 10) {
      const e = /* @__PURE__ */ new Date(t + "T00:00:00");
      if (!isNaN(e.getTime()))
        return e.toLocaleDateString("en", { month: "short", day: "numeric" });
    }
    return t;
  }
};
et.styles = M`
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
    /* compact tightens visual spacing while preserving the 44px hit area —
       per a11y guidelines the interactive role="checkbox" must keep that
       minimum touch target. Density comes from the smaller circle + gap. */
    :host([compact]) .row {
      gap: 8px;
      padding: 4px 2px;
    }
    .row:hover,
    .row:active {
      background: rgba(0, 0, 0, 0.04);
    }
    .check {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, border-color 0.15s;
    }
    :host([compact]) .check {
      width: 20px;
      height: 20px;
      border-width: 2px;
    }
    :host([compact]) .check svg {
      width: 12px;
      height: 12px;
    }
    .check.done {
      background: var(--member-color, #a8d8b9);
      border-color: var(--member-color, #a8d8b9);
    }
    .check svg {
      width: 14px;
      height: 14px;
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
      font-size: clamp(0.95rem, 1.2vw, 1.05rem);
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
Vt([
  g({ attribute: !1 })
], et.prototype, "task", 2);
Vt([
  g()
], et.prototype, "memberColor", 2);
Vt([
  g({ type: Boolean, reflect: !0 })
], et.prototype, "compact", 2);
et = Vt([
  E("lucarne-task-row")
], et);
var vn = Object.defineProperty, yn = Object.getOwnPropertyDescriptor, De = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? yn(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && vn(e, r, i), i;
};
const Ka = "household";
function rr(t) {
  return t.length === 10 ? /* @__PURE__ */ new Date(t + "T00:00:00") : new Date(t);
}
function bn(t, e) {
  const r = new Date(e);
  r.setHours(0, 0, 0, 0);
  const a = new Date(r);
  a.setDate(a.getDate() + 1);
  const i = new Date(r);
  i.setDate(i.getDate() + 4);
  const n = (s) => {
    if (!s.due) return 3;
    const o = rr(s.due);
    return o < r ? 0 : o < a ? 1 : o < i ? 2 : 4;
  };
  return [...t].sort((s, o) => {
    const l = n(s), d = n(o);
    if (l !== d) return l - d;
    if (l === 3) return s.summary.localeCompare(o.summary);
    const c = s.due ? rr(s.due).getTime() : 0, h = o.due ? rr(o.due).getTime() : 0;
    return c !== h ? c - h : s.summary.localeCompare(o.summary);
  });
}
function _n(t) {
  return {
    uid: t.uid,
    summary: t.summary,
    status: t.status,
    due: t.due ?? null,
    description: t.description ?? "",
    metadata: {
      item_uid: t.uid,
      member_slug: Ka,
      assignee_slug: "",
      type: "chore",
      recurrence: "",
      icon: "",
      source: "manual"
    }
  };
}
let de = class extends D {
  constructor() {
    super(...arguments), this.items = [], this.integrationMode = !1, this.renderableTasks = [], this.members = [], this.limit = 5, this.refillOnComplete = !1, this._admitted = /* @__PURE__ */ new Set(), this._windowKey = "";
  }
  /**
   * Resolve which active tasks to show. In refill mode the window is just the
   * first `limit` by priority. In no-refill mode each completion permanently
   * burns a slot (never refilled); new tasks only fill slots that were never
   * occupied. Mutates _admitted, so call once per render.
   */
  _resolveVisible(t) {
    const e = /* @__PURE__ */ new Date(), r = bn(
      t.filter((h) => h.status === "needs_action"),
      e
    ), a = r.length;
    if (this.refillOnComplete)
      return this._admitted.clear(), this._windowKey = "", { visible: r.slice(0, this.limit), totalActive: a };
    const i = `${this.todoEntityId ?? ""}#${this.limit}`;
    i !== this._windowKey && (this._windowKey = i, this._admitted = /* @__PURE__ */ new Set());
    const n = new Set(r.map((h) => h.uid)), s = [...this._admitted].filter(
      (h) => !n.has(h) && t.some((p) => p.uid === h && p.status === "completed")
    ).length, o = Math.max(0, this.limit - s), l = r.filter((h) => this._admitted.has(h.uid));
    let d = o - l.length;
    for (const h of r) {
      if (d <= 0) break;
      this._admitted.has(h.uid) || (this._admitted.add(h.uid), d--);
    }
    return { visible: r.filter((h) => this._admitted.has(h.uid)), totalActive: a };
  }
  render() {
    const t = this.integrationMode ? this.renderableTasks : this.items.map(_n), { visible: e, totalActive: r } = this._resolveVisible(t);
    return r === 0 ? u`
        <div class="empty-state">
          <span class="empty-icon">${Qr}</span>
          ${P.allDone}
        </div>
      ` : e.length === 0 ? u`
        <div class="empty-state">
          <span class="empty-icon">${Qr}</span>
          ${P.allDoneForNow}
        </div>
      ` : u`
      <div class="header">
        ${P.tasksTitle}
        <span class="count-badge">${r}</span>
      </div>
      <div class="task-list">${e.map((a) => this._renderTaskLine(a))}</div>
    `;
  }
  _renderTaskLine(t) {
    const e = this._ownerFor(t);
    return u`
      <div class="task-line">
        ${e ? this._renderOwnerAvatar(e) : ""}
        <lucarne-task-row
          compact
          .task=${t}
          .memberColor=${(e == null ? void 0 : e.color) ?? "var(--primary-color)"}
        ></lucarne-task-row>
      </div>
    `;
  }
  _renderOwnerAvatar(t) {
    const e = t.avatar;
    if (e && e.startsWith("/local/"))
      return u`
        <div class="owner-avatar" style="background:${t.color}" title="${t.name}">
          <img src="${e}" alt="${t.name}" />
        </div>
      `;
    if (e && Ga.test(e))
      return u`
        <div class="owner-avatar" style="background:${t.color}" title="${t.name}">
          <span>${e}</span>
        </div>
      `;
    const r = t.name.trim().charAt(0) || "?";
    return u`
      <div class="owner-avatar" style="background:${t.color}" title="${t.name}">
        <span class="initial">${r}</span>
      </div>
    `;
  }
  _ownerFor(t) {
    if (!this.integrationMode) return null;
    const e = t.metadata.member_slug;
    return !e || e === Ka ? null : this.members.find((r) => r.slug === e) ?? null;
  }
};
de.styles = [
  N,
  M`
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
      .task-list {
        display: flex;
        flex-direction: column;
        /* Cap the visible rows and scroll the rest; the host card can tune the
           cap via --lucarne-tasks-max-height. */
        max-height: var(--lucarne-tasks-max-height, none);
        overflow-y: auto;
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
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        font-size: 13px;
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
        font-size: 11px;
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
De([
  g({ type: Array })
], de.prototype, "items", 2);
De([
  g({ type: String })
], de.prototype, "todoEntityId", 2);
De([
  g({ type: Boolean })
], de.prototype, "integrationMode", 2);
De([
  g({ attribute: !1 })
], de.prototype, "renderableTasks", 2);
De([
  g({ attribute: !1 })
], de.prototype, "members", 2);
De([
  g({ type: Number })
], de.prototype, "limit", 2);
De([
  g({ type: Boolean })
], de.prototype, "refillOnComplete", 2);
de = De([
  E("lucarne-tasks-summary")
], de);
var wn = Object.defineProperty, xn = Object.getOwnPropertyDescriptor, Qa = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? xn(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && wn(e, r, i), i;
};
let Bt = class extends D {
  constructor() {
    super(...arguments), this.entries = [];
  }
  render() {
    return u`
      ${this.entries.map(
      (t) => u`
          <span class="pill ${t.isHome ? "home" : "away"}">
            <span class="dot"></span>
            ${t.name}
          </span>
        `
    )}
    `;
  }
};
Bt.styles = [
  N,
  M`
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
Qa([
  g({ type: Array })
], Bt.prototype, "entries", 2);
Bt = Qa([
  E("lucarne-presence-pills")
], Bt);
const tt = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
function xr(t) {
  if (!t || t.trim() === "") return { mode: "none" };
  const e = t.trim().split(";"), r = {};
  for (const d of e) {
    const c = d.indexOf("=");
    if (c === -1) return { mode: "unknown", raw: t };
    r[d.slice(0, c)] = d.slice(c + 1);
  }
  const a = r.FREQ;
  let i;
  if (r.INTERVAL !== void 0) {
    if (!/^[1-9]\d*$/.test(r.INTERVAL)) return { mode: "unknown", raw: t };
    i = parseInt(r.INTERVAL, 10);
  }
  const n = r.BYDAY, s = r.BYMONTHDAY, o = r.BYMONTH;
  function l(...d) {
    const c = new Set(d);
    return Object.keys(r).every((h) => c.has(h));
  }
  if (a === "DAILY" && !n && !s && !o)
    return l("FREQ", "INTERVAL") ? { mode: "daily", ...i ? { interval: i } : {} } : { mode: "unknown", raw: t };
  if (a === "WEEKLY" && n && !s && !o) {
    if (!l("FREQ", "BYDAY", "INTERVAL")) return { mode: "unknown", raw: t };
    const d = n.split(",");
    return d.every((c) => tt.includes(c)) ? { mode: "weekly", days: d, ...i ? { interval: i } : {} } : { mode: "unknown", raw: t };
  }
  if (a === "MONTHLY" && s && !n && !o)
    return l("FREQ", "BYMONTHDAY", "INTERVAL") ? /^([1-9]|[12]\d|3[01])$/.test(s) ? { mode: "monthly-date", dayOfMonth: parseInt(s, 10), ...i ? { interval: i } : {} } : { mode: "unknown", raw: t } : { mode: "unknown", raw: t };
  if (a === "MONTHLY" && n && !s && !o) {
    if (!l("FREQ", "BYDAY", "INTERVAL")) return { mode: "unknown", raw: t };
    const d = n.match(/^([+-]?\d+)([A-Z]{2})$/);
    if (!d) return { mode: "unknown", raw: t };
    const c = parseInt(d[1], 10);
    if (![1, 2, 3, 4, -1].includes(c)) return { mode: "unknown", raw: t };
    const h = d[2];
    return tt.includes(h) ? { mode: "monthly-nth", nth: c, day: h, ...i ? { interval: i } : {} } : { mode: "unknown", raw: t };
  }
  if (a === "YEARLY" && o && s && !n) {
    if (!l("FREQ", "BYMONTH", "BYMONTHDAY", "INTERVAL")) return { mode: "unknown", raw: t };
    if (!/^([1-9]|1[0-2])$/.test(o)) return { mode: "unknown", raw: t };
    if (!/^([1-9]|[12]\d|3[01])$/.test(s)) return { mode: "unknown", raw: t };
    const d = parseInt(o, 10), c = parseInt(s, 10);
    return { mode: "yearly", month: d, dayOfMonth: c, ...i ? { interval: i } : {} };
  }
  return { mode: "unknown", raw: t };
}
function le(t) {
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
function Za(t) {
  const e = xr(t);
  if (e.mode === "none") return "One-off (no repeat)";
  if (e.mode === "unknown") return "Custom recurrence (not editable here)";
  const r = "interval" in e && e.interval ? e.interval : 1;
  if (e.mode === "daily")
    return r === 1 ? "Daily" : `Every ${r} days`;
  if (e.mode === "weekly") {
    const a = {
      MO: "Mon",
      TU: "Tue",
      WE: "Wed",
      TH: "Thu",
      FR: "Fri",
      SA: "Sat",
      SU: "Sun"
    }, i = e.days.map((n) => a[n]).join(", ");
    return r === 1 ? `Weekly on ${i}` : `Every ${r} weeks on ${i}`;
  }
  if (e.mode === "monthly-date") {
    const a = ta(e.dayOfMonth);
    return r === 1 ? `Monthly on the ${e.dayOfMonth}${a}` : `Every ${r} months on the ${e.dayOfMonth}${a}`;
  }
  if (e.mode === "monthly-nth") {
    const a = $n(e.nth), i = {
      MO: "Monday",
      TU: "Tuesday",
      WE: "Wednesday",
      TH: "Thursday",
      FR: "Friday",
      SA: "Saturday",
      SU: "Sunday"
    };
    return r === 1 ? `Monthly on the ${a} ${i[e.day]}` : `Every ${r} months on the ${a} ${i[e.day]}`;
  }
  if (e.mode === "yearly") {
    const a = [
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
    ], i = ta(e.dayOfMonth);
    return r === 1 ? `Yearly on ${a[e.month]} ${e.dayOfMonth}${i}` : `Every ${r} years on ${a[e.month]} ${e.dayOfMonth}${i}`;
  }
  return "";
}
function ta(t) {
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
function $n(t) {
  return t === -1 ? "last" : t === 1 ? "1st" : t === 2 ? "2nd" : t === 3 ? "3rd" : `${t}th`;
}
const kn = new Date(Date.UTC(1970, 0, 1));
function ra(t) {
  return Math.floor(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()) / 864e5);
}
function Cn(t, e, r) {
  const a = t.getDate();
  if (t.getDay() !== r) return !1;
  if (e > 0)
    return Math.floor((a - 1) / 7) === e - 1;
  const n = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  return Math.floor((n - a) / 7) === 0;
}
const aa = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6
};
function Dn(t, e = /* @__PURE__ */ new Date()) {
  if (t.mode === "none" || t.mode === "unknown") return !1;
  const r = "interval" in t && t.interval ? t.interval : 1, a = ra(e) - ra(kn);
  if (t.mode === "daily")
    return a % r === 0;
  if (t.mode === "weekly") {
    const i = e.getDay();
    return t.days.some((o) => aa[o] === i) ? r === 1 ? !0 : Math.floor(a / 7) % r === 0 : !1;
  }
  if (t.mode === "monthly-date")
    return e.getDate() !== t.dayOfMonth ? !1 : r === 1 ? !0 : ((e.getFullYear() - 1970) * 12 + e.getMonth()) % r === 0;
  if (t.mode === "monthly-nth") {
    const i = aa[t.day];
    return Cn(e, t.nth, i) ? r === 1 ? !0 : ((e.getFullYear() - 1970) * 12 + e.getMonth()) % r === 0 : !1;
  }
  return t.mode === "yearly" ? e.getMonth() + 1 !== t.month || e.getDate() !== t.dayOfMonth ? !1 : r === 1 ? !0 : (e.getFullYear() - 1970) % r === 0 : !1;
}
var Mn = Object.defineProperty, En = Object.getOwnPropertyDescriptor, $r = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? En(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Mn(e, r, i), i;
};
let wt = class extends D {
  constructor() {
    super(...arguments), this.members = [], this.tasksByMember = /* @__PURE__ */ new Map();
  }
  _handleClick() {
    this.dispatchEvent(new CustomEvent("family-ready-clicked", { bubbles: !0, composed: !0 }));
  }
  _computeReadiness() {
    let t = 0, e = 0;
    const r = /* @__PURE__ */ new Date();
    for (const a of this.members) {
      const n = (this.tasksByMember.get(a.slug) ?? []).filter(
        (s) => s.metadata.type === "routine" && Dn(xr(s.metadata.recurrence), r)
      );
      n.length !== 0 && (t++, n.every((s) => s.status === "completed") && e++);
    }
    return { readyCount: e, totalWithRoutines: t };
  }
  render() {
    const { readyCount: t, totalWithRoutines: e } = this._computeReadiness();
    if (e === 0)
      return u`
        <div class="pill none" @click=${this._handleClick}>
          <span class="icon">✓</span>
          ${P.noRoutinesToday}
        </div>
      `;
    const r = t === e;
    return u`
      <div class="pill ${r ? "all-done" : ""}" @click=${this._handleClick}>
        <span class="icon">${r ? "🎉" : "⏳"}</span>
        ${P.familyReady(t, e)}
      </div>
    `;
  }
};
wt.styles = [
  N,
  M`
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
$r([
  g({ attribute: !1 })
], wt.prototype, "members", 2);
$r([
  g({ attribute: !1 })
], wt.prototype, "tasksByMember", 2);
wt = $r([
  E("lucarne-family-ready-pill")
], wt);
var Sn = Object.defineProperty, Tn = Object.getOwnPropertyDescriptor, je = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? Tn(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Sn(e, r, i), i;
};
const ia = ["calendar", "weather", "tasks"];
function Ja(t) {
  const e = /* @__PURE__ */ new Set(), r = [];
  for (const a of t ?? [])
    ia.includes(a) && !e.has(a) && (e.add(a), r.push(a));
  for (const a of ia)
    e.has(a) || r.push(a);
  return r;
}
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-today-card",
  name: "Lucarne Today",
  description: "Family agenda + weather + tasks + presence",
  preview: !0
});
let me = class extends D {
  constructor() {
    super(...arguments), this._calendarEvents = /* @__PURE__ */ new Map(), this._forecast = [], this._todoItems = [], this._familyState = null, this._fetchingForecast = !1, this._lastWeatherState = "";
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
    const e = Object.keys(t.states).filter((n) => n.startsWith("calendar.")).slice(0, 3), r = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], a = e.map((n, s) => ({
      entity: n,
      color: r[s] ?? "#a8d8b9"
    })), i = "weather.forecast_home" in t.states;
    return {
      type: "custom:lucarne-today-card",
      title: P.today,
      calendars: a.length ? a : [{ entity: "calendar.example", color: "#a8d8b9" }],
      weather: i ? "weather.forecast_home" : void 0
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
      this._previewOverrideRaf = void 0, this.isConnected && (this._previewOverride = qa(this));
    });
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this._teardownSubscriptions(), this._previewOverrideRaf !== void 0 && (cancelAnimationFrame(this._previewOverrideRaf), this._previewOverrideRaf = void 0), (t = this._previewOverride) == null || t.uninstall(), this._previewOverride = void 0;
  }
  _setupSubscriptions() {
    if (!this._config || !this.hass) return;
    this._fetchCalendarEvents(), this._config.weather && this._fetchForecast(), this._calendarIntervalId = setInterval(() => {
      var e;
      this._fetchCalendarEvents(), (e = this._config) != null && e.weather && this._fetchForecast();
    }, 5 * 60 * 1e3), this._config.tasks && !this._config.household_tasks_from_integration && (this._todoUnsub = nr(this.hass, this._config.tasks, (e) => {
      this._todoItems = e;
    })), (this._config.household_tasks_from_integration || this._config.show_family_ready_pill || !!this._config.tasks) && (this._unsubFamily = bt(this.hass, (e) => {
      this._familyState = e;
    }));
  }
  _teardownSubscriptions() {
    var t, e;
    clearInterval(this._calendarIntervalId), (t = this._todoUnsub) == null || t.call(this), this._todoUnsub = void 0, (e = this._unsubFamily) == null || e.call(this), this._unsubFamily = void 0, this._calendarIntervalId = void 0;
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
      const i = (a = this.hass.states[r]) == null ? void 0 : a.state;
      i && i !== this._lastWeatherState && (this._lastWeatherState = i, this._fetchForecast());
    }
  }
  async _fetchCalendarEvents() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.map((n) => n.entity), e = /* @__PURE__ */ new Date(), r = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), { events: a } = await Xa(this.hass, t, e, r), i = /* @__PURE__ */ new Map();
    for (const [n, s] of a.entries())
      i.set(
        n,
        s.map((o) => ({ ...o, uid: `${n}::${o.uid ?? o.summary}` }))
      );
    this._calendarEvents = i;
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
  get _householdTasks() {
    var t;
    return ((t = this._familyState) == null ? void 0 : t.tasksByMember.get("household")) ?? [];
  }
  get _familyMembers() {
    var t;
    return ((t = this._familyState) == null ? void 0 : t.members) ?? [];
  }
  get _familyTasksByMember() {
    var t;
    return ((t = this._familyState) == null ? void 0 : t.tasksByMember) ?? /* @__PURE__ */ new Map();
  }
  /**
   * Raw todo items enriched with integration metadata when available so they
   * render the same emoji + owner avatar as in chores card. Falls back to the
   * member whose `todo_entity_id` matches the configured raw entity, so even
   * tasks added through HA's todo UI (without an integration tag) still pick
   * up the right owner.
   */
  get _enrichedRawTasks() {
    var r, a, i, n;
    if (!((r = this._config) != null && r.tasks)) return [];
    const t = ((a = this._familyState) == null ? void 0 : a.taskMetadataByUid) ?? /* @__PURE__ */ new Map(), e = ((n = (i = this._familyState) == null ? void 0 : i.members.find((s) => s.todo_entity_id === this._config.tasks)) == null ? void 0 : n.slug) ?? "";
    return this._todoItems.map((s) => {
      const l = t.get(s.uid) ?? {
        item_uid: s.uid,
        member_slug: e,
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
        metadata: l
      };
    });
  }
  async _handleTaskToggle(t) {
    const { task: e } = t.detail;
    if (!this.hass) return;
    const r = e.status === "completed" ? "needs_action" : "completed", a = this._resolveTaskEntityId(e);
    a && await this.hass.callService(
      "todo",
      "update_item",
      { item: e.uid, status: r },
      { entity_id: a }
    );
  }
  _handleTaskLongPress(t) {
    const { task: e } = t.detail, r = this._resolveTaskEntityId(e);
    r && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: r },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _resolveTaskEntityId(t) {
    var e, r;
    if ((e = this._config) != null && e.household_tasks_from_integration && this._familyState) {
      const a = t.metadata.member_slug;
      if (a === "household") return "todo.lucarne_household";
      const i = this._familyState.members.find((n) => n.slug === a);
      return i != null && i.todo_entity_id ? i.todo_entity_id : void 0;
    }
    return (r = this._config) == null ? void 0 : r.tasks;
  }
  _renderCalendarSection() {
    var t;
    return u`
      <div class="section section-calendar" data-section="calendar">
        <lucarne-agenda-strip
          .events=${this._mergedEvents}
          .calendarColors=${this._calendarColorMap}
          .windowDays=${(t = this._config) != null && t.agenda_show_tomorrow ? 2 : 1}
        ></lucarne-agenda-strip>
      </div>
    `;
  }
  _renderWeatherSection() {
    var e, r;
    const t = (e = this._config) != null && e.weather ? (r = this.hass) == null ? void 0 : r.states[this._config.weather] : void 0;
    return u`
      <div class="section section-weather" data-section="weather">
        <lucarne-weather-block
          .weatherEntity=${t}
          .forecast=${this._forecast}
        ></lucarne-weather-block>
      </div>
    `;
  }
  _renderTasksSection(t, e) {
    var i, n, s;
    if (!t && !e) return "";
    const r = e ? this._householdTasks : this._enrichedRawTasks, a = e ? "todo.lucarne_household" : (i = this._config) == null ? void 0 : i.tasks;
    return u`
      <div
        class="section section-tasks"
        data-section="tasks"
        @task-toggle=${this._handleTaskToggle}
        @task-long-press=${this._handleTaskLongPress}
      >
        <lucarne-tasks-summary
          .integrationMode=${!0}
          .renderableTasks=${r}
          .members=${this._familyMembers}
          .todoEntityId=${a}
          .limit=${((n = this._config) == null ? void 0 : n.max_tasks) ?? 5}
          .refillOnComplete=${((s = this._config) == null ? void 0 : s.refill_tasks_on_complete) ?? !1}
        ></lucarne-tasks-summary>
      </div>
    `;
  }
  render() {
    if (!this._config) return u``;
    const t = (this._config.presence ?? []).map((s) => {
      var o, l;
      return {
        name: s.name,
        isHome: ((l = (o = this.hass) == null ? void 0 : o.states[s.entity]) == null ? void 0 : l.state) === "on"
      };
    }), e = this._familyState !== null && this._familyState.integrationError === null, r = (this._config.show_family_ready_pill ?? !1) && e, a = (this._config.household_tasks_from_integration ?? !1) && e, i = !(this._config.household_tasks_from_integration ?? !1) && !!this._config.tasks, n = Ja(this._config.section_order);
    return u`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${this._config.title ?? P.today}</h2>
          <div class="header-right">
            ${t.length > 0 ? u`<lucarne-presence-pills .entries=${t}></lucarne-presence-pills>` : ""}
            ${r ? u`<lucarne-family-ready-pill
                  .members=${this._familyMembers}
                  .tasksByMember=${this._familyTasksByMember}
                ></lucarne-family-ready-pill>` : ""}
          </div>
        </div>
        <div class="card-body">
          ${n.map((s) => {
      switch (s) {
        case "calendar":
          return this._renderCalendarSection();
        case "weather":
          return this._renderWeatherSection();
        case "tasks":
          return this._renderTasksSection(i, a);
      }
    })}
        </div>
      </ha-card>
    `;
  }
};
me.styles = [
  N,
  M`
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
        /* Match the calendar card's scroll-area height so the two line up. */
        min-height: var(--lucarne-card-fill-height);
      }
      .section + .section {
        border-top: 1px solid rgba(0, 0, 0, 0.07);
      }
      /* Tasks absorb any vertical slack so the card fills to the shared height
         with the list at the bottom rather than a blank gap. */
      .section-tasks {
        flex: 1 1 auto;
        min-height: 0;
      }
    `
];
je([
  g({ attribute: !1 })
], me.prototype, "hass", 2);
je([
  v()
], me.prototype, "_config", 2);
je([
  v()
], me.prototype, "_calendarEvents", 2);
je([
  v()
], me.prototype, "_forecast", 2);
je([
  v()
], me.prototype, "_todoItems", 2);
je([
  v()
], me.prototype, "_familyState", 2);
me = je([
  E("lucarne-today-card")
], me);
const ei = M`
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
  /* Custom checkbox: the native control follows the OS color-scheme and renders
     as a black box on a light HA theme when the OS is dark. Render it ourselves
     from theme tokens so it matches the card surface + accent. (Same treatment
     the chores editor applies to its own checkboxes.) */
  input[type='checkbox'] {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    margin: 0;
    flex-shrink: 0;
    position: relative;
    cursor: pointer;
    border: 2px solid var(--lucarne-on-surface-muted, #727272);
    border-radius: 4px;
    background: var(--lucarne-surface, var(--ha-card-background, #fff));
  }
  input[type='checkbox']:checked {
    background: var(--primary-color, #03a9f4);
    border-color: var(--primary-color, #03a9f4);
  }
  input[type='checkbox']:checked::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 1px;
    width: 4px;
    height: 8px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  input[type='checkbox']:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 1px;
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
`, na = ["ha-entity-picker", "ha-textfield"], An = 3e3;
let Ot;
function On(t) {
  return new Promise((e) => setTimeout(e, t));
}
async function Pn() {
  const t = window.loadCardHelpers;
  if (t)
    try {
      const i = await t(), s = (await Promise.resolve(
        i.createCardElement({ type: "entities", entities: [] })
      )).constructor;
      typeof (s == null ? void 0 : s.getConfigElement) == "function" && await Promise.resolve(s.getConfigElement());
    } catch (i) {
      console.warn("[lucarne] loadCardHelpers failed; falling back to whenDefined", i);
    }
  const e = Promise.all(
    na.map((i) => customElements.whenDefined(i))
  ).then(() => "ready"), r = On(An).then(() => "timeout");
  if (await Promise.race([e, r]) === "timeout" && !na.every((i) => customElements.get(i)))
    throw new Error("[lucarne] HA form elements did not register within timeout");
}
function ti() {
  return Ot || (Ot = Pn().catch((t) => {
    throw Ot = void 0, t;
  })), Ot;
}
var sa, oa;
(function(t) {
  t.language = "language", t.system = "system", t.comma_decimal = "comma_decimal", t.decimal_comma = "decimal_comma", t.space_comma = "space_comma", t.none = "none";
})(sa || (sa = {})), function(t) {
  t.language = "language", t.system = "system", t.am_pm = "12", t.twenty_four = "24";
}(oa || (oa = {}));
var kr = function(t, e, r, a) {
  a = a || {}, r = r ?? {};
  var i = new Event(e, { bubbles: a.bubbles === void 0 || a.bubbles, cancelable: !!a.cancelable, composed: a.composed === void 0 || a.composed });
  return i.detail = r, t.dispatchEvent(i), i;
}, In = Object.defineProperty, Rn = Object.getOwnPropertyDescriptor, Mt = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? Rn(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && In(e, r, i), i;
};
let Ne = class extends D {
  constructor() {
    super(...arguments), this.items = [], this.label = "Reorderable list", this._dragIndex = null, this._dragOverIndex = null;
  }
  _emitReorder(t, e) {
    const r = this.items.length;
    if (t === e || t < 0 || e < 0 || t >= r || e >= r) return;
    const a = this.items.map((n) => n.key), [i] = a.splice(t, 1);
    a.splice(e, 0, i), this.dispatchEvent(
      new CustomEvent("reorder", {
        detail: { from: t, to: e, order: a },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onDragStart(t, e) {
    this._dragIndex = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(t)));
  }
  _onDragOver(t, e) {
    this._dragIndex === null || this._dragIndex === t || (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move"), this._dragOverIndex !== t && (this._dragOverIndex = t));
  }
  _onDrop(t, e) {
    e.preventDefault();
    const r = this._dragIndex;
    this._dragIndex = null, this._dragOverIndex = null, r !== null && this._emitReorder(r, t);
  }
  _onDragEnd() {
    this._dragIndex = null, this._dragOverIndex = null;
  }
  render() {
    return u`
      <div class="reorder-list" role="list" aria-label=${this.label}>
        ${this.items.map((t, e) => u`
          <div
            class="reorder-row ${this._dragIndex === e ? "dragging" : ""} ${this._dragOverIndex === e ? "drag-over" : ""}"
            role="listitem"
            data-key=${t.key}
            draggable="true"
            @dragstart=${(r) => this._onDragStart(e, r)}
            @dragover=${(r) => this._onDragOver(e, r)}
            @drop=${(r) => this._onDrop(e, r)}
            @dragend=${this._onDragEnd}
          >
            <span class="grab-handle" aria-hidden="true" title="Drag to reorder">≡</span>
            <div class="reorder-content"><slot name=${t.key}></slot></div>
            <button
              class="move-btn move-up-btn"
              type="button"
              aria-label="Move ${t.label ?? "item"} up"
              ?disabled=${e === 0}
              @click=${() => this._emitReorder(e, e - 1)}
            >↑</button>
            <button
              class="move-btn move-down-btn"
              type="button"
              aria-label="Move ${t.label ?? "item"} down"
              ?disabled=${e === this.items.length - 1}
              @click=${() => this._emitReorder(e, e + 1)}
            >↓</button>
          </div>
        `)}
      </div>
    `;
  }
};
Ne.styles = M`
    .reorder-list {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: var(--lucarne-radius-md, 12px);
      overflow: hidden;
    }
    .reorder-row {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      align-items: center;
      gap: var(--lucarne-spacing-sm, 8px);
      padding: var(--lucarne-spacing-sm, 8px) var(--lucarne-spacing-md, 12px);
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .reorder-row + .reorder-row {
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }
    .reorder-row.dragging {
      opacity: 0.5;
    }
    .reorder-row.drag-over {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .grab-handle {
      cursor: grab;
      color: var(--lucarne-on-surface-muted, #727272);
      font-size: 1.2em;
      line-height: 1;
      user-select: none;
      padding: 0 var(--lucarne-spacing-xs, 4px);
    }
    .grab-handle:active {
      cursor: grabbing;
    }
    .reorder-content {
      min-width: 0;
    }
    .move-btn {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));
      border-radius: var(--lucarne-radius-sm, 8px);
      padding: 2px 8px;
      font-size: 0.9em;
      color: var(--lucarne-on-surface-muted, #727272);
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
Mt([
  g({ attribute: !1 })
], Ne.prototype, "items", 2);
Mt([
  g()
], Ne.prototype, "label", 2);
Mt([
  v()
], Ne.prototype, "_dragIndex", 2);
Mt([
  v()
], Ne.prototype, "_dragOverIndex", 2);
Ne = Mt([
  E("lucarne-reorder-list")
], Ne);
var Nn = Object.defineProperty, zn = Object.getOwnPropertyDescriptor, Xt = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? zn(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Nn(e, r, i), i;
};
const la = {
  calendar: "Calendar",
  weather: "Weather",
  tasks: "Tasks"
}, Ln = M`
  .section-label-cell {
    font-size: var(--lucarne-fs-md);
    color: var(--lucarne-on-surface);
  }
`;
let rt = class extends D {
  constructor() {
    super(...arguments), this._haReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), ti().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    kr(this, "config-changed", { config: t });
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
  _integrationTasksChanged(t) {
    const e = t.target.checked;
    this._fire({ ...this._config, household_tasks_from_integration: e || void 0 });
  }
  _familyPillChanged(t) {
    const e = t.target.checked;
    this._fire({ ...this._config, show_family_ready_pill: e || void 0 });
  }
  _isIntegrationAvailable() {
    var t, e;
    return !!((e = (t = this.hass) == null ? void 0 : t.states) != null && e[mt.todo_entity_id]);
  }
  _agendaShowTomorrowChanged(t) {
    const e = t.target.checked;
    this._fire({ ...this._config, agenda_show_tomorrow: e || void 0 });
  }
  _maxTasksChanged(t) {
    const e = t.target, r = parseInt(e.value, 10);
    this._fire({ ...this._config, max_tasks: isNaN(r) ? void 0 : Math.max(1, r) });
  }
  _refillTasksChanged(t) {
    const e = t.target.checked;
    this._fire({ ...this._config, refill_tasks_on_complete: e || void 0 });
  }
  _calEntityChanged(t, e) {
    var a, i;
    const r = [...((a = this._config) == null ? void 0 : a.calendars) ?? []];
    r[t] = { ...r[t], entity: ((i = e.detail) == null ? void 0 : i.value) ?? "" }, this._fire({ ...this._config, calendars: r });
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
    var a, i;
    const e = Object.keys(((a = this.hass) == null ? void 0 : a.states) ?? {}).find((n) => n.startsWith("calendar.")) ?? "calendar.example", r = [
      ...((i = this._config) == null ? void 0 : i.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  _presenceEntityChanged(t, e) {
    var a, i;
    const r = [...((a = this._config) == null ? void 0 : a.presence) ?? []];
    r[t] = { ...r[t], entity: ((i = e.detail) == null ? void 0 : i.value) ?? "" }, this._fire({ ...this._config, presence: r });
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
  _commitSectionOrder(t) {
    this._fire({ ...this._config, section_order: t });
  }
  _renderSectionOrder() {
    var r;
    const t = Ja((r = this._config) == null ? void 0 : r.section_order), e = t.map((a) => ({ key: a, label: la[a] }));
    return u`
      <div class="section-label">Section order</div>
      <lucarne-reorder-list
        label="Card sections (drag to reorder)"
        .items=${e}
        @reorder=${(a) => this._commitSectionOrder(a.detail.order)}
      >
        ${t.map(
      (a) => u`<span slot=${a} class="section-label-cell">${la[a]}</span>`
    )}
      </lucarne-reorder-list>
    `;
  }
  render() {
    if (!this._config) return u``;
    if (!this._haReady) return u`<div class="loading">Loading editor…</div>`;
    const t = this._config.calendars ?? [], e = this._config.presence ?? [];
    return u`
      <label class="field">
        <span class="field-label">Card title</span>
        <input
          class="text-input"
          type="text"
          .value=${this._config.title ?? ""}
          @change=${this._titleChanged}
        />
      </label>
      <label class="field field-inline">
        <span class="field-label">Also show tomorrow in agenda</span>
        <input
          type="checkbox"
          .checked=${this._config.agenda_show_tomorrow ?? !1}
          @change=${this._agendaShowTomorrowChanged}
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

      <label class="field">
        <span class="field-label">Max tasks to show</span>
        <input
          class="text-input"
          type="number"
          min="1"
          .value=${String(this._config.max_tasks ?? 5)}
          @change=${this._maxTasksChanged}
        />
      </label>
      <label class="field field-inline">
        <span class="field-label">Show a new task when one is completed</span>
        <input
          type="checkbox"
          .checked=${this._config.refill_tasks_on_complete ?? !1}
          @change=${this._refillTasksChanged}
        />
      </label>

      <div class="section-label">Lucarne Family integration</div>
      <label class="field field-inline" style="${this._isIntegrationAvailable() ? "" : "opacity:0.5;pointer-events:none"}">
        <span class="field-label">Household tasks from integration</span>
        <input
          type="checkbox"
          .checked=${this._config.household_tasks_from_integration ?? !1}
          @change=${this._integrationTasksChanged}
          ?disabled=${!this._isIntegrationAvailable()}
        />
        ${this._isIntegrationAvailable() ? "" : u`<small> — install Lucarne Family integration first</small>`}
      </label>
      <label class="field field-inline" style="${this._isIntegrationAvailable() ? "" : "opacity:0.5;pointer-events:none"}">
        <span class="field-label">Show family ready pill</span>
        <input
          type="checkbox"
          .checked=${this._config.show_family_ready_pill ?? !1}
          @change=${this._familyPillChanged}
          ?disabled=${!this._isIntegrationAvailable()}
        />
        ${this._isIntegrationAvailable() ? "" : u`<small> — install Lucarne Family integration first</small>`}
      </label>

      <div class="section-label">Calendars</div>
      ${t.map(
      (r, a) => u`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${r.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(i) => this._calEntityChanged(a, i)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${r.color}
              @input=${(i) => this._calColorChanged(a, i)}
              title="Calendar color"
            />
            <button type="button" class="remove" @click=${() => this._removeCalendar(a)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addCalendar}>+ Add calendar</button>

      <div class="section-label">Presence</div>
      ${e.map(
      (r, a) => u`
          <div class="presence-row">
            <div class="row-stack">
              <ha-entity-picker
                label="Entity"
                .hass=${this.hass}
                .value=${r.entity}
                .includeDomains=${["input_boolean"]}
                allow-custom-entity
                @value-changed=${(i) => this._presenceEntityChanged(a, i)}
              ></ha-entity-picker>
              <input
                class="text-input"
                type="text"
                placeholder="Display name"
                .value=${r.name}
                @change=${(i) => this._presenceNameChanged(a, i)}
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
rt.styles = [N, ei, Ln];
Xt([
  g({ attribute: !1 })
], rt.prototype, "hass", 2);
Xt([
  v()
], rt.prototype, "_config", 2);
Xt([
  v()
], rt.prototype, "_haReady", 2);
rt = Xt([
  E("lucarne-today-card-editor")
], rt);
function ri(t, e) {
  var a, i, n;
  const r = (n = (i = (a = e == null ? void 0 : e.states) == null ? void 0 : a[t.entity]) == null ? void 0 : i.attributes) == null ? void 0 : n.friendly_name;
  return typeof r == "string" && r ? r : t.entity;
}
function ca(t, e) {
  return t.map((r) => ({ ...r, label: ri(r, e) }));
}
function da(t, e) {
  const r = parseInt(t.split(":")[0], 10), a = parseInt(e.split(":")[0], 10), i = [];
  for (let n = r; n <= a; n++)
    i.push(n);
  return i;
}
function Hn(t, e, r) {
  const [a, i] = e.split(":").map(Number), [n, s] = r.split(":").map(Number), o = new Date(t);
  o.setHours(a, i, 0, 0);
  const l = new Date(t);
  return l.setHours(n, s, 0, 0), { bandStartMs: o.getTime(), bandEndMs: l.getTime() };
}
function Bn(t, e, r, a) {
  const i = ha(t.start).getTime(), n = ha(t.end).getTime(), { bandStartMs: s, bandEndMs: o } = Hn(e, r, a), l = Math.max(i, s), d = Math.min(n, o);
  return l >= d ? null : { start: new Date(l), end: new Date(d) };
}
function ha(t) {
  return t.length === 10 && !t.includes("T") ? /* @__PURE__ */ new Date(`${t}T00:00:00`) : new Date(t);
}
function jn(t) {
  return t.start.length === 10 && !t.start.includes("T");
}
function K(t) {
  const e = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return `${e}-${r}-${a}`;
}
function ai(t) {
  return t.uid ?? `${t.start}|${t.end}|${t.summary ?? ""}`;
}
function Un(t) {
  if (t.length === 0) return [];
  const e = t.map((l, d) => ({ ...l, _idx: d }));
  e.sort((l, d) => l.start.getTime() - d.start.getTime());
  const r = [], a = new Array(t.length);
  for (const l of e) {
    const d = l.start.getTime();
    let c = r.findIndex((h) => h <= d);
    c === -1 ? (c = r.length, r.push(l.end.getTime())) : r[c] = l.end.getTime(), a[l._idx] = c;
  }
  const i = new Array(t.length), n = [];
  let s = 0, o = e[0].end.getTime();
  i[e[0]._idx] = 0, n.push(a[e[0]._idx]);
  for (let l = 1; l < e.length; l++) {
    const d = e[l];
    d.start.getTime() >= o ? (s++, n.push(0), o = d.end.getTime()) : o = Math.max(o, d.end.getTime()), i[d._idx] = s, n[s] = Math.max(n[s], a[d._idx]);
  }
  return a.map((l, d) => ({
    lane: l,
    laneCount: n[i[d]] + 1
  }));
}
function Pt(t, e) {
  const [r, a] = e.split(":").map(Number), i = new Date(t);
  return i.setHours(r, a, 0, 0), i.getTime();
}
function Fn(t, e, r, a) {
  const i = /* @__PURE__ */ new Map();
  for (const o of e)
    i.set(K(o), { allDay: [], inBand: [], earlier: [], later: [] });
  const n = e.length > 0 ? e[0] : null, s = e.length > 0 ? e[e.length - 1] : null;
  for (const o of t) {
    if (jn(o)) {
      const c = /* @__PURE__ */ new Date(o.start + "T00:00:00"), h = /* @__PURE__ */ new Date(o.end + "T00:00:00"), p = n !== null && c < n, f = s ? new Date(s) : null;
      f && f.setDate(f.getDate() + 1);
      const y = f !== null && h > f;
      for (const _ of e) {
        const b = K(_), w = i.get(b);
        if (_ >= c && _ < h && (w.allDay.push(o), p || y)) {
          w.allDayClipped || (w.allDayClipped = /* @__PURE__ */ new Map());
          const x = n !== null && K(_) === K(n), k = s !== null && K(_) === K(s);
          w.allDayClipped.set(ai(o), {
            left: p && x,
            right: y && k
          });
        }
      }
      continue;
    }
    const l = new Date(o.start), d = new Date(o.end);
    for (const c of e) {
      const h = K(c), p = i.get(h), f = new Date(c);
      f.setHours(0, 0, 0, 0);
      const y = new Date(c);
      if (y.setHours(23, 59, 59, 999), d <= f || l > y) continue;
      const _ = Pt(c, r), b = Pt(c, a);
      if (d.getTime() <= _)
        p.earlier.push(o);
      else if (l.getTime() >= b)
        p.later.push(o);
      else {
        const w = Bn(o, c, r, a);
        if (w) {
          const x = b - _, k = (w.start.getTime() - _) / x * 100, Z = (w.end.getTime() - w.start.getTime()) / x * 100;
          p.inBand.push({
            event: o,
            lane: 0,
            laneCount: 1,
            topPercent: Math.max(0, Math.min(100, k)),
            heightPercent: Math.max(0, Math.min(100 - k, Z))
          });
        }
      }
    }
  }
  for (const o of e) {
    const l = K(o), d = i.get(l);
    if (d.inBand.length === 0) continue;
    const c = Pt(o, r), p = Pt(o, a) - c, f = d.inBand.map((_) => {
      const b = c + _.topPercent / 100 * p, w = b + _.heightPercent / 100 * p;
      return {
        event: _.event,
        start: new Date(b),
        end: new Date(w),
        lane: 0
      };
    }), y = Un(f);
    d.inBand = d.inBand.map((_, b) => ({
      ..._,
      lane: y[b].lane,
      laneCount: y[b].laneCount
    }));
  }
  return { days: e, perDay: i };
}
function Wn(t, e) {
  const r = Math.min(e.minColWidth, e.maxColWidth), a = Math.max(e.minColWidth, e.maxColWidth), i = Math.min(e.minDays, e.maxDays), n = Math.max(e.minDays, e.maxDays), s = Math.max(0, t - e.timeColWidth);
  if (s <= 0)
    return { visibleCount: i, dayWidthPx: r };
  const o = Math.floor(s / r), l = Math.ceil(s / a), d = Math.min(n, Math.max(i, l, Math.min(o, n))), c = s / d;
  return { visibleCount: d, dayWidthPx: c };
}
function Yn(t) {
  return `syn:${t.start}|${t.end}|${t.summary ?? ""}`;
}
function ua(t) {
  if (t !== void 0 && !(typeof t != "number" || !Number.isFinite(t)))
    return Math.max(0, Math.floor(t));
}
function It(t, e) {
  const r = new Date(t);
  return r.setDate(r.getDate() + e), r;
}
function pa(t) {
  const e = new Date(t);
  return e.setHours(0, 0, 0, 0), e;
}
class Vn {
  constructor(e, r) {
    this._isConnected = !1, this._hasHass = !1, this._dayOffset = 0, this._fetchSeq = 0, this._cachedEvents = /* @__PURE__ */ new Map(), this._cachedDayKeys = /* @__PURE__ */ new Set(), this._host = e, this._opts = r, this._fetcher = r.fetcher ?? Xa, this._pollIntervalMs = r.pollIntervalMs ?? 5 * 6e4, this._tickIntervalMs = r.tickIntervalMs ?? 6e4, this._panBound = r.panBoundDays ?? 90, this._visibleCount = r.visibleCount, this._bufferDaysExplicit = ua(r.bufferDays);
    const a = (r.now ?? (() => /* @__PURE__ */ new Date()))();
    this._anchorToday = pa(a), e.addController(this);
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
    const r = new Set(this._opts.calendars.map((n) => n.entity)), a = new Set(e.map((n) => n.entity)), i = r.size !== a.size || [...a].some((n) => !r.has(n));
    this._opts.calendars = e, i && this._hass && this._fetchRange(...this._computeRange());
  }
  setVisibleCount(e) {
    var a, i;
    const r = this._visibleCount;
    if (this._visibleCount = e, (i = (a = this._opts).onChange) == null || i.call(a), this._host.requestUpdate(), e !== r) {
      const [n, s] = this._computeRange();
      this._rangeIsCovered(n, s) || this._fetchRange(n, s);
    }
  }
  /**
   * Set the off-screen render buffer (days drawn on each side of the visible
   * window). Pass `undefined` to revert to the default (matches visibleCount).
   * Non-finite or non-numeric input is coerced to `undefined` (default) so
   * bad YAML config doesn't blank the grid.
   */
  setBufferDays(e) {
    var a, i;
    const r = ua(e);
    r !== this._bufferDaysExplicit && (this._bufferDaysExplicit = r, (i = (a = this._opts).onChange) == null || i.call(a), this._host.requestUpdate());
  }
  pan(e) {
    var o, l;
    const r = -this._panBound, a = this._panBound - this._visibleCount, i = Math.max(r, Math.min(a, this._dayOffset + e));
    this._dayOffset = i, (l = (o = this._opts).onChange) == null || l.call(o), this._host.requestUpdate();
    const [n, s] = this._computeRange();
    this._rangeIsCovered(n, s) || this._fetchRange(n, s);
  }
  goToToday() {
    var i, n;
    const e = this._dayOffset === 0;
    this._dayOffset = 0, e || (n = (i = this._opts).onChange) == null || n.call(i), this._host.requestUpdate();
    const [r, a] = this._computeRange();
    this._rangeIsCovered(r, a) || this._fetchRange(r, a);
  }
  tick() {
    var a, i;
    const e = (this._opts.now ?? (() => /* @__PURE__ */ new Date()))(), r = pa(e);
    r.getTime() !== this._anchorToday.getTime() && (this._anchorToday = r, this._dayOffset === 0 && ((i = (a = this._opts).onChange) == null || i.call(a), this._host.requestUpdate(), this._hass && this._fetchRange(...this._computeRange())));
  }
  async _poll() {
    this._hass && this._fetchRange(...this._computeRange());
  }
  // -------------------------------------------------------------------------
  // Getters
  // -------------------------------------------------------------------------
  get days() {
    return Array.from({ length: this._visibleCount }, (e, r) => {
      const a = It(this._anchorToday, this._dayOffset + r);
      return a.setHours(0, 0, 0, 0), a;
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
    return Array.from({ length: r }, (a, i) => {
      const n = It(this._anchorToday, this._dayOffset - e + i);
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
    const e = [], r = new Date(this._cacheStart);
    for (; r < this._cacheEnd; )
      e.push(new Date(r)), r.setDate(r.getDate() + 1);
    return e;
  }
  isDayCached(e) {
    return this._cachedDayKeys.has(K(e));
  }
  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------
  /** Compute [start, end) for the current visible+buffer range. */
  _computeRange() {
    const e = this._visibleCount, r = It(this._anchorToday, this._dayOffset - e);
    r.setHours(0, 0, 0, 0);
    const a = It(this._anchorToday, this._dayOffset + 2 * e);
    return a.setHours(0, 0, 0, 0), [r, a];
  }
  _rangeIsCovered(e, r) {
    return !this._cacheStart || !this._cacheEnd ? !1 : e >= this._cacheStart && r <= this._cacheEnd;
  }
  _fetchRange(e, r) {
    var n, s;
    if (!this._hass) return;
    const a = ++this._fetchSeq, i = this._opts.calendars.map((o) => o.entity);
    (s = (n = this._opts).onFetchStart) == null || s.call(n, { start: e, end: r }), this._fetcher(this._hass, i, e, r).then(({ events: o, failed: l }) => {
      var c, h;
      if (a !== this._fetchSeq) return;
      const d = /* @__PURE__ */ new Map();
      for (const [p, f] of o.entries())
        d.set(
          p,
          f.map((y) => {
            const _ = y.uid && y.uid.length > 0 ? y.uid : Yn(y);
            return { ...y, uid: `${p}::${_}` };
          })
        );
      this._cachedEvents = d, this._cachedDayKeys = /* @__PURE__ */ new Set();
      for (const p = new Date(e); p < r; p.setDate(p.getDate() + 1))
        this._cachedDayKeys.add(K(p));
      this._cacheStart = new Date(e), this._cacheEnd = new Date(r), (h = (c = this._opts).onFetchComplete) == null || h.call(c, d, l);
    }).catch((o) => {
      console.warn("[lucarne] RollingWindowController fetch failed:", o);
    });
  }
}
var Xn = Object.defineProperty, qn = Object.getOwnPropertyDescriptor, Cr = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? qn(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Xn(e, r, i), i;
};
let xt = class extends D {
  constructor() {
    super(...arguments), this.calendars = [], this.visibleIds = /* @__PURE__ */ new Set();
  }
  _toggle(t) {
    const e = new Set(this.visibleIds);
    e.has(t) ? e.delete(t) : e.add(t), this.dispatchEvent(new CustomEvent("visibility-change", { detail: e, bubbles: !0, composed: !0 }));
  }
  render() {
    return u`
      ${this.calendars.map(
      (t) => u`
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
xt.styles = [
  N,
  M`
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
Cr([
  g({ type: Array })
], xt.prototype, "calendars", 2);
Cr([
  g({ type: Object })
], xt.prototype, "visibleIds", 2);
xt = Cr([
  E("lucarne-visibility-pills")
], xt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gn = { ATTRIBUTE: 1 }, Kn = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Qn = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, r, a) {
    this._$Ct = e, this._$AM = r, this._$Ci = a;
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
const ii = "important", Zn = " !" + ii, Jn = Kn(class extends Qn {
  constructor(t) {
    var e;
    if (super(t), t.type !== Gn.ATTRIBUTE || t.name !== "style" || ((e = t.strings) == null ? void 0 : e.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return Object.keys(t).reduce((e, r) => {
      const a = t[r];
      return a == null ? e : e + `${r = r.includes("-") ? r : r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${a};`;
    }, "");
  }
  update(t, [e]) {
    const { style: r } = t.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(e)), this.render(e);
    for (const a of this.ft) e[a] == null && (this.ft.delete(a), a.includes("-") ? r.removeProperty(a) : r[a] = null);
    for (const a in e) {
      const i = e[a];
      if (i != null) {
        this.ft.add(a);
        const n = typeof i == "string" && i.endsWith(Zn);
        a.includes("-") || n ? r.setProperty(a, n ? i.slice(0, -11) : i, n ? ii : "") : r[a] = i;
      }
    }
    return Re;
  }
});
var es = Object.defineProperty, ts = Object.getOwnPropertyDescriptor, Ue = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? ts(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && es(e, r, i), i;
};
function ma(t) {
  return t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 });
}
let fe = class extends D {
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
    const t = new Date(this.event.start), e = new Date(this.event.end), r = `${ma(t)}–${ma(e)}`, a = this.event.pending ? "0.5" : "1";
    return u`
      <div @click=${this._handleClick} style="height:100%;width:100%;overflow:hidden;opacity:${a}">
        <div class="event-summary">${this.event.summary}</div>
        <div class="event-time">${r}</div>
      </div>
    `;
  }
};
fe.styles = [
  N,
  M`
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
Ue([
  g({ type: Object })
], fe.prototype, "event", 2);
Ue([
  g({ type: String })
], fe.prototype, "color", 2);
Ue([
  g({ type: Number })
], fe.prototype, "lane", 2);
Ue([
  g({ type: Number })
], fe.prototype, "laneCount", 2);
Ue([
  g({ type: Number })
], fe.prototype, "topPercent", 2);
Ue([
  g({ type: Number })
], fe.prototype, "heightPercent", 2);
fe = Ue([
  E("lucarne-calendar-event-block")
], fe);
var rs = Object.defineProperty, as = Object.getOwnPropertyDescriptor, Et = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? as(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && rs(e, r, i), i;
};
let ze = class extends D {
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
    if (this.events.length === 0) return u``;
    const t = this._chipEl;
    let e = 0, r = 0;
    if (t) {
      const a = t.getBoundingClientRect();
      e = a.bottom + 4, r = a.left;
    }
    return u`
      <button class="stub-chip" @click=${this._openPopover}>
        +${this.events.length} ${this.label}
      </button>

      ${this._open ? u`
            <div class="backdrop" @click=${this._close}></div>
            <div class="mini-popover" style="top:${e}px;left:${r}px;">
              <div class="mini-title">${this.label}</div>
              ${this.events.map(
      (a) => u`
                  <div class="mini-event" @click=${(i) => this._tapEvent(i, a)}>
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
ze.styles = [
  N,
  M`
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
Et([
  g({ type: Array })
], ze.prototype, "events", 2);
Et([
  g({ type: String })
], ze.prototype, "label", 2);
Et([
  g({ type: Object })
], ze.prototype, "eventColors", 2);
Et([
  v()
], ze.prototype, "_open", 2);
ze = Et([
  E("lucarne-out-of-band-stub")
], ze);
var is = Object.defineProperty, ns = Object.getOwnPropertyDescriptor, qt = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? ns(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && is(e, r, i), i;
};
function ss(t) {
  return 20 + (t * 37 + 11) % 30;
}
function os(t) {
  return 10 + (t * 53 + 7) % 60;
}
let at = class extends D {
  constructor() {
    super(...arguments), this.bandStart = "07:00", this.bandEnd = "21:00", this.hourHeightPx = 60;
  }
  render() {
    const [t] = this.bandStart.split(":").map(Number), [e] = this.bandEnd.split(":").map(Number), a = Math.max(1, e - t) * this.hourHeightPx;
    return u`
      <div class="sk-host" style="height:${a}px">
        ${[0, 1].map((i) => {
      const s = os(i) / 100 * a, o = ss(i);
      return u`
            <div
              class="fake-event"
              style="top: ${s}px; height: ${o}px;"
            >
              <div class="shimmer-sweep"></div>
            </div>
          `;
    })}
      </div>
    `;
  }
};
at.styles = [
  N,
  M`
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
qt([
  g({ type: String })
], at.prototype, "bandStart", 2);
qt([
  g({ type: String })
], at.prototype, "bandEnd", 2);
qt([
  g({ type: Number })
], at.prototype, "hourHeightPx", 2);
at = qt([
  E("lucarne-skeleton-day-column")
], at);
var ls = Object.defineProperty, cs = Object.getOwnPropertyDescriptor, ue = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? cs(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && ls(e, r, i), i;
};
function fa(t, e) {
  return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
}
let ee = class extends D {
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
      const a = t.uid.split("::")[0];
      return e.get(a) ?? "#a8d8b9";
    }
    return "#a8d8b9";
  }
  _onBandClick(t, e) {
    if (!this.showCreateButton) return;
    const a = t.currentTarget.getBoundingClientRect(), [i] = this.bandStart.split(":").map(Number), [n] = this.bandEnd.split(":").map(Number), s = n - i, o = Math.max(0, Math.min(1, (t.clientY - a.top) / a.height)), l = i + o * s, d = Math.min(n - 1, Math.round(l * 2) / 2);
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
    if (!this.layout) return u``;
    const r = K(t), a = this.layout.perDay.get(r);
    if (!a) return u``;
    const i = da(this.bandStart, this.bandEnd), s = (i.length - 1) * this.hourHeightPx, o = fa(t, e), [l] = this.bandStart.split(":").map(Number), [d] = this.bandEnd.split(":").map(Number), c = (d - l) * 36e5;
    let h = null;
    if (o) {
      const f = new Date(t);
      f.setHours(l, 0, 0, 0);
      const y = new Date(t);
      y.setHours(d, 0, 0, 0), e >= f && e <= y && (h = (e.getTime() - f.getTime()) / c * 100);
    }
    const p = this._buildEventColorMap([...a.inBand.map((f) => f.event), ...a.earlier, ...a.later]);
    return u`
      <div class="day-col-wrapper">
        ${a.earlier.length > 0 ? u`
              <div class="stub-area-top">
                <lucarne-out-of-band-stub
                  .events=${a.earlier}
                  label="earlier"
                  .eventColors=${p}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}

        <div
          class="day-col"
          style="height:${s}px${this.showCreateButton ? "; cursor: crosshair" : ""}"
          @click=${(f) => this._onBandClick(f, t)}
        >
          ${i.slice(0, -1).map(
      (f, y) => u`
              <div
                class="hour-line"
                style="top: ${(y + 1) / (i.length - 1) * 100}%"
              ></div>
            `
    )}

          ${h !== null ? u`<div class="now-line" style="top:${h}%"></div>` : ""}

          ${a.inBand.map((f) => {
      const y = 100 / f.laneCount, _ = f.lane / f.laneCount * 100, b = this._eventColor(f.event);
      return u`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${f.topPercent}%;
                  left: calc(${_}% + 1px);
                  width: calc(${y}% - 2px);
                  height: ${f.heightPercent}%;
                  z-index: ${f.lane + 1};
                  background: ${b}cc;
                  border-left-color: ${b};
                "
                .event=${f.event}
                .color=${b}
                .lane=${f.lane}
                .laneCount=${f.laneCount}
                .topPercent=${f.topPercent}
                .heightPercent=${f.heightPercent}
              ></lucarne-calendar-event-block>
            `;
    })}
        </div>

        ${a.later.length > 0 ? u`
              <div class="stub-area-bottom">
                <lucarne-out-of-band-stub
                  .events=${a.later}
                  label="tonight"
                  .eventColors=${p}
                ></lucarne-out-of-band-stub>
              </div>
            ` : ""}
      </div>
    `;
  }
  render() {
    if (!this.layout) return u`<div>Loading…</div>`;
    const t = /* @__PURE__ */ new Date(), e = da(this.bandStart, this.bandEnd), a = (e.length - 1) * this.hourHeightPx, i = new Intl.DateTimeFormat("en-US", { weekday: "short" }), n = {
      "--lucarne-day-render-count": String(this.layout.days.length)
    };
    return this.dayWidthPx > 0 && (n["--lucarne-day-width-px"] = `${this.dayWidthPx}px`, n["--lucarne-day-baseline-px"] = `${-this.bufferDays * this.dayWidthPx}px`), u`
      <div class="grid-wrapper" style=${Jn(n)}>
        <!-- Time-column gutter cells (col 1): stay fixed during pan -->
        <div class="header-spacer" style="grid-row:1; grid-column:1"></div>
        <div class="allday-spacer" style="grid-row:2; grid-column:1">all-day</div>
        <div class="time-col" style="height:${a}px; grid-row:3; grid-column:1">
          ${e.map(
      (s, o) => u`
              <div
                class="hour-label"
                style="top: ${o / (e.length - 1) * 100}%"
              >
                ${s === 0 || s === 24 ? "12 AM" : s < 12 ? `${s} AM` : s === 12 ? "12 PM" : `${s - 12} PM`}
              </div>
            `
    )}
        </div>

        <!-- Row 1: day header track -->
        <div class="day-cols-track" style="grid-row:1">
          ${this.layout.days.map(
      (s, o) => u`
              <div
                class="day-header ${fa(s, t) ? "today" : ""}"
                style="grid-column: ${o + 1}"
              >
                <div class="day-pill">
                  <span class="day-weekday">${i.format(s)}</span>
                  <span class="day-num">${s.getDate()}</span>
                </div>
              </div>
            `
    )}
        </div>

        <!-- Row 2: all-day event track (wrapped in .day-cols-clip — see CSS) -->
        <div class="day-cols-clip" style="grid-row:2">
          <div class="day-cols-track">
            ${this.layout.days.map((s, o) => {
      const l = K(s), d = this.cachedDayKeys.has(l), c = this.layout.perDay.get(l);
      return u`
                <div class="allday-cell" style="grid-column: ${o + 1}">
                  ${d ? ((c == null ? void 0 : c.allDay) ?? []).map(
        (h) => {
          var f;
          const p = (f = c == null ? void 0 : c.allDayClipped) == null ? void 0 : f.get(ai(h));
          return u`
                          <div
                            class="allday-event"
                            style="background: ${this._eventColor(h)}cc"
                            @click=${(y) => {
            y.stopPropagation(), this.dispatchEvent(
              new CustomEvent("lucarne-event-tap", {
                detail: { event: h, color: this._eventColor(h) },
                bubbles: !0,
                composed: !0
              })
            );
          }}
                          >
                            ${p != null && p.left ? u`<span class="clip-chevron">‹</span>` : ""}${h.summary}${p != null && p.right ? u`<span class="clip-chevron">›</span>` : ""}
                          </div>
                        `;
        }
      ) : u`<div class="allday-skeleton"><div class="shimmer-sweep"></div></div>`}
                </div>
              `;
    })}
          </div>
        </div>

        <!-- Row 3: time-band columns track -->
        <div class="day-cols-track" style="grid-row:3">
          ${this.layout.days.map((s, o) => {
      const l = K(s), d = this.cachedDayKeys.has(l);
      return u`
              <div style="grid-column:${o + 1}; position:relative; overflow:visible; display:flex; flex-direction:column;">
                ${d ? this._renderDayColumn(s, t) : u`<lucarne-skeleton-day-column
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
ee.styles = [
  N,
  M`
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
ue([
  g({ type: Object })
], ee.prototype, "layout", 2);
ue([
  g({ type: String })
], ee.prototype, "bandStart", 2);
ue([
  g({ type: String })
], ee.prototype, "bandEnd", 2);
ue([
  g({ type: Array })
], ee.prototype, "calendars", 2);
ue([
  g({ type: Number })
], ee.prototype, "hourHeightPx", 2);
ue([
  g({ type: Boolean })
], ee.prototype, "showCreateButton", 2);
ue([
  g({ type: Number })
], ee.prototype, "dayWidthPx", 2);
ue([
  g({ type: Number })
], ee.prototype, "bufferDays", 2);
ue([
  g({ attribute: !1 })
], ee.prototype, "cachedDayKeys", 2);
ee = ue([
  E("lucarne-calendar-grid")
], ee);
const ds = 500;
function hs(t, e, r) {
  return e <= 0 ? 0 : Math.abs(r) >= ds ? r > 0 ? Math.ceil(t / e) : Math.floor(t / e) : Math.round(t / e);
}
function ga(t, e) {
  if (Math.abs(t) <= e) return t;
  const r = Math.abs(t) - e;
  return Math.sign(t) * (e + r * 0.33);
}
var us = Object.defineProperty, ps = Object.getOwnPropertyDescriptor, it = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? ps(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && us(e, r, i), i;
};
let ke = class extends D {
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
    return t > 0 && !this.canPanBack || t < 0 && !this.canPanForward ? ga(t, 0) : t;
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
    const i = getComputedStyle(this).getPropertyValue("--lucarne-pan-duration").trim() || "240ms", n = getComputedStyle(this).getPropertyValue("--lucarne-pan-easing").trim() || "cubic-bezier(0.32, 0.72, 0, 1)", s = `transform ${i} ${n}`, o = r + t * this.dayWidthPx;
    for (const d of e)
      d.style.transition = s, d.style.transform = `translateX(${o}px)`;
    const l = (d) => {
      const c = d;
      c.target === e[0] && (c.propertyName && c.propertyName !== "transform" || (this._pendingTransitionEnd = void 0, e[0].removeEventListener("transitionend", l), t !== 0 && this._dispatchPanSnap(t), this._scheduleClearInline()));
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
        const e = t.clientX - this._startX, r = performance.now() - this._startTime, a = r > 0 ? e / r * 1e3 : 0, i = this._applyRubberBand(e);
        let n = hs(i, this.dayWidthPx, a);
        (n > 0 && !this.canPanBack || n < 0 && !this.canPanForward) && (n = 0), this._snapAndCommit(n);
      }
      this._pointerId = void 0, this._isDragging = !1, this._cachedTargets = [];
    }
  }
  render() {
    return u`
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
ke.styles = M`
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
it([
  g({ type: Number })
], ke.prototype, "dayWidthPx", 2);
it([
  g({ type: Number })
], ke.prototype, "bufferDays", 2);
it([
  g({ type: Boolean })
], ke.prototype, "canPanBack", 2);
it([
  g({ type: Boolean })
], ke.prototype, "canPanForward", 2);
it([
  _r("slot")
], ke.prototype, "_slot", 2);
ke = it([
  E("lucarne-calendar-day-pan")
], ke);
var ms = Object.defineProperty, fs = Object.getOwnPropertyDescriptor, ge = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? fs(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && ms(e, r, i), i;
};
function gs(t) {
  return new Date(t).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: !0
  });
}
let ae = class extends D {
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
      await Vi(this.hass, this.entityId, t);
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
    if (!this.event) return u``;
    const t = this.event, r = t.start.length === 10 && !t.start.includes("T") ? "All day" : `${gs(t.start)} – ${new Date(t.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0 })}`, a = this._hasSyntheticUid(t.uid), i = !!this.entityId && !!t.uid && this.hass != null && qi(this.hass, this.entityId) && !this._isRecurring(t) && !a, n = this._confirmingDelete ? this._confirmDelete : this._startDelete, s = this._confirmingDelete ? "Confirm delete" : "Delete event";
    return u`
      <div class="backdrop" @click=${this._close}></div>
      <div class="popover" role="dialog" aria-modal="true">
        <div class="popover-header">
          <span class="color-dot" style="background:${this.color}"></span>
          <span class="event-title">${t.summary}</span>
          ${i ? u`
                <button
                  class="icon-btn ${this._confirmingDelete ? "armed" : ""}"
                  @click=${n}
                  ?disabled=${this._deleting}
                  aria-label=${s}
                  title=${s}
                >🗑️</button>
              ` : u`<span></span>`}
          <button class="icon-btn" @click=${this._close} aria-label="Close">✕</button>
        </div>

        ${this._confirmingDelete ? u`
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

        ${this.calendarLabel ? u`
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

        ${t.location ? u`
              <div class="detail-row">
                <em class="detail-icon">📍</em>
                <span class="detail-text">${t.location}</span>
              </div>
            ` : ""}

        ${t.description ? u`
              <div class="detail-row">
                <em class="detail-icon">📝</em>
                <span class="detail-text">${t.description}</span>
              </div>
            ` : ""}

        ${this._deleteError ? u`<div class="error-msg">${this._deleteError}</div>` : ""}
      </div>
    `;
  }
};
ae.styles = [
  N,
  M`
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
ge([
  g({ attribute: !1 })
], ae.prototype, "hass", 2);
ge([
  g({ type: Object })
], ae.prototype, "event", 2);
ge([
  g({ type: String })
], ae.prototype, "color", 2);
ge([
  g({ type: String })
], ae.prototype, "calendarLabel", 2);
ge([
  g({ type: String })
], ae.prototype, "entityId", 2);
ge([
  v()
], ae.prototype, "_confirmingDelete", 2);
ge([
  v()
], ae.prototype, "_deleting", 2);
ge([
  v()
], ae.prototype, "_deleteError", 2);
ae = ge([
  E("lucarne-calendar-event-popover")
], ae);
var vs = Object.defineProperty, ys = Object.getOwnPropertyDescriptor, W = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? ys(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && vs(e, r, i), i;
};
function va(t, e) {
  const a = -(/* @__PURE__ */ new Date(`${t}T${e}:00`)).getTimezoneOffset(), i = a >= 0 ? "+" : "-", n = Math.floor(Math.abs(a) / 60).toString().padStart(2, "0"), s = (Math.abs(a) % 60).toString().padStart(2, "0");
  return `${t}T${e}:00${i}${n}:${s}`;
}
function ya(t) {
  return `${Math.floor(t).toString().padStart(2, "0")}:${t % 1 === 0.5 ? "30" : "00"}`;
}
function ba(t) {
  const e = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return `${e}-${r}-${a}`;
}
let j = class extends D {
  constructor() {
    super(...arguments), this.day = null, this.startHour = 9, this.calendars = [], this._title = "", this._calendarEntityId = "", this._date = "", this._startTime = "", this._endTime = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
  }
  updated(t) {
    super.updated(t), (t.has("day") || t.has("startHour")) && this._initDefaults();
  }
  _initDefaults() {
    var r;
    const t = this.day ?? /* @__PURE__ */ new Date();
    this._date = ba(t), this._startTime = ya(Math.max(0, Math.min(23, this.startHour)));
    const e = Math.min(24, this.startHour + 1);
    this._endTime = ya(e < 24 ? e : 23.5), this._calendarEntityId = ((r = this.calendars[0]) == null ? void 0 : r.entity) ?? "", this._title = "", this._allDay = !1, this._description = "", this._location = "", this._error = "", this._saving = !1;
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
      const i = ba(a);
      t.end_date = i, e = this._date, r = i;
    } else {
      const a = va(this._date, this._startTime), i = va(this._date, this._endTime);
      t.start_date_time = a, t.end_date_time = i, e = a, r = i;
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
    return this.calendars.length ? u`
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
      (t) => u`<option value=${t.entity}>${t.label}</option>`
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

        ${this._allDay ? "" : u`
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

        ${this._error ? u`<div class="error-msg">${this._error}</div>` : ""}

        <div class="actions">
          <button class="btn btn-cancel" @click=${this._close}>Cancel</button>
          <button class="btn btn-create" ?disabled=${this._saving} @click=${this._create}>
            ${this._saving ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    ` : u``;
  }
};
j.styles = [
  N,
  M`
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
W([
  g({ attribute: !1 })
], j.prototype, "hass", 2);
W([
  g({ type: Object })
], j.prototype, "day", 2);
W([
  g({ type: Number })
], j.prototype, "startHour", 2);
W([
  g({ type: Array })
], j.prototype, "calendars", 2);
W([
  v()
], j.prototype, "_title", 2);
W([
  v()
], j.prototype, "_calendarEntityId", 2);
W([
  v()
], j.prototype, "_date", 2);
W([
  v()
], j.prototype, "_startTime", 2);
W([
  v()
], j.prototype, "_endTime", 2);
W([
  v()
], j.prototype, "_allDay", 2);
W([
  v()
], j.prototype, "_description", 2);
W([
  v()
], j.prototype, "_location", 2);
W([
  v()
], j.prototype, "_error", 2);
W([
  v()
], j.prototype, "_saving", 2);
j = W([
  E("lucarne-create-event-popover")
], j);
var bs = Object.defineProperty, _s = Object.getOwnPropertyDescriptor, Y = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? _s(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && bs(e, r, i), i;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-calendar-card",
  name: "Lucarne Calendar",
  description: "Week view calendar with per-person color, visibility pills, and create-event flow",
  preview: !0
});
let U = class extends D {
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
      const i = parseInt(t.visible_hours.start.split(":")[0], 10), n = parseInt(t.visible_hours.end.split(":")[0], 10);
      if (i < 0 || n > 24 || i >= n)
        throw new Error('lucarne-calendar-card: "visible_hours" must satisfy 0 <= start < end <= 24');
      e = {
        ...t,
        visible_hours: {
          start: `${String(i).padStart(2, "0")}:00`,
          end: `${String(n).padStart(2, "0")}:00`
        }
      };
    }
    const r = this._config;
    if (this._config = e, this._visibleIds = new Set(t.calendars.map((a) => a.entity)), this.hass && this._updateCreatableCalendars(), this._rolling)
      this._rolling.updateCalendars(e.calendars), (r == null ? void 0 : r.render_buffer_days) !== e.render_buffer_days && this._rolling.setBufferDays(e.render_buffer_days), ((r == null ? void 0 : r.min_days) !== t.min_days || (r == null ? void 0 : r.max_days) !== t.max_days || (r == null ? void 0 : r.min_col_width) !== t.min_col_width || (r == null ? void 0 : r.max_col_width) !== t.max_col_width) && this._onResize();
    else {
      const a = this._effectiveConfig();
      this._lastVisibleCount = a.minDays, this._rolling = new Vn(this, {
        calendars: e.calendars,
        visibleCount: a.minDays,
        bufferDays: e.render_buffer_days,
        onFetchComplete: (i, n) => this._onFetchComplete(i, n),
        onChange: () => this._recompute()
      });
    }
  }
  static getStubConfig(t) {
    const e = Object.keys(t.states).filter((i) => i.startsWith("calendar.")).slice(0, 3), r = ["#a8d8b9", "#a8c5e8", "#c8b4e0"], a = e.map((i, n) => ({
      entity: i,
      color: r[n] ?? "#a8d8b9"
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
    super.connectedCallback(), this._previewOverrideRaf = requestAnimationFrame(() => {
      this._previewOverrideRaf = void 0, this.isConnected && (this._previewOverride = qa(this));
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
      var a;
      this._resizeFrame = void 0;
      const t = ((a = this._gridAreaEl) == null ? void 0 : a.getBoundingClientRect().width) ?? 0, { visibleCount: e, dayWidthPx: r } = Wn(t, this._effectiveConfig());
      e !== this._lastVisibleCount && (this._lastVisibleCount = e, this._rolling.setVisibleCount(e), this.style.setProperty("--lucarne-day-count", String(e))), this._dayWidthPx = r;
    }));
  }
  _recompute() {
    var n, s;
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
    const e = this._deletedUids.size > 0 ? t.filter((o) => !o.uid || !this._deletedUids.has(o.uid)) : t, r = ((n = this._config.visible_hours) == null ? void 0 : n.start) ?? "07:00", a = ((s = this._config.visible_hours) == null ? void 0 : s.end) ?? "21:00", i = this._rolling.renderDays;
    this._layout = Fn(e, i, r, a);
  }
  _supportsCreate(t) {
    var r, a, i;
    const e = (i = (a = (r = this.hass) == null ? void 0 : r.states[t]) == null ? void 0 : a.attributes) == null ? void 0 : i.supported_features;
    return e !== void 0 && (e & 1) !== 0;
  }
  _updateCreatableCalendars() {
    if (!this._config || !this.hass) return;
    const t = this._config.calendars.filter((r) => this._supportsCreate(r.entity));
    t.length === this._creatableCalendars.length && t.every((r, a) => {
      var i;
      return r.entity === ((i = this._creatableCalendars[a]) == null ? void 0 : i.entity);
    }) || (this._creatableCalendars = t);
  }
  _onVisibilityChange(t) {
    this._visibleIds = t.detail, this._recompute();
  }
  _onEventTap(t) {
    var a, i;
    const { event: e, color: r } = t.detail;
    if (this._openEvent = e, this._openEventColor = r, (a = e.uid) != null && a.includes("::")) {
      const n = e.uid.split("::")[0];
      this._openEventEntityId = n;
      const s = (i = this._config) == null ? void 0 : i.calendars.find((o) => o.entity === n);
      this._openEventCalLabel = s ? ri(s, this.hass) : "";
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
      for (const i of t.values())
        for (const n of i)
          n.uid && r.add(n.uid);
      const a = /* @__PURE__ */ new Set();
      for (const i of this._deletedUids) {
        const n = i.includes("::") ? i.split("::")[0] : "";
        (e.has(n) || r.has(i)) && a.add(i);
      }
      this._deletedUids = a;
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
    const e = t[0], r = t[t.length - 1], a = (s, o) => s.toLocaleDateString("en-US", o), i = e.getMonth() === r.getMonth() && e.getFullYear() === r.getFullYear(), n = e.getFullYear() === r.getFullYear();
    return i ? `${a(e, { month: "short", day: "numeric" })} – ${a(r, { day: "numeric" })}` : n ? `${a(e, { month: "short", day: "numeric" })} – ${a(r, { month: "short", day: "numeric" })}` : `${a(e, { month: "short", day: "numeric", year: "numeric" })} – ${a(r, { month: "short", day: "numeric", year: "numeric" })}`;
  }
  render() {
    var i, n;
    if (!this._config) return u``;
    const t = ((i = this._config.visible_hours) == null ? void 0 : i.start) ?? "07:00", e = ((n = this._config.visible_hours) == null ? void 0 : n.end) ?? "21:00", r = ca(this._config.calendars, this.hass), a = ca(this._creatableCalendars, this.hass);
    return u`
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
            ${this._rolling.isAtToday ? "" : u`<button class="nav-btn" @click=${() => this._rolling.goToToday()} aria-label="Today">Today</button>`}
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
            @pan-snap=${(s) => this._rolling.pan(-s.detail.deltaDays)}
          >
            <lucarne-calendar-grid
              .layout=${this._layout}
              .bandStart=${t}
              .bandEnd=${e}
              .calendars=${r}
              .dayWidthPx=${this._dayWidthPx}
              .bufferDays=${this._rolling.bufferDays}
              .cachedDayKeys=${new Set(this._rolling.cachedRange.map(K))}
              .showCreateButton=${(this._config.show_create_button ?? !0) && this._creatableCalendars.length > 0}
            ></lucarne-calendar-grid>
          </lucarne-calendar-day-pan>
        </div>

        ${this._openEvent ? u`
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

        ${this._createDay !== null ? u`
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
U.styles = [
  N,
  M`
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
        /* Shared constant so the Today card matches this card's height exactly. */
        min-height: var(--lucarne-card-fill-height);
        max-height: var(--lucarne-card-fill-height);
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
      }
    `
];
Y([
  g({ attribute: !1 })
], U.prototype, "hass", 2);
Y([
  _r(".grid-area")
], U.prototype, "_gridAreaEl", 2);
Y([
  v()
], U.prototype, "_config", 2);
Y([
  v()
], U.prototype, "_layout", 2);
Y([
  v()
], U.prototype, "_visibleIds", 2);
Y([
  v()
], U.prototype, "_openEvent", 2);
Y([
  v()
], U.prototype, "_openEventColor", 2);
Y([
  v()
], U.prototype, "_openEventCalLabel", 2);
Y([
  v()
], U.prototype, "_openEventEntityId", 2);
Y([
  v()
], U.prototype, "_createDay", 2);
Y([
  v()
], U.prototype, "_createStartHour", 2);
Y([
  v()
], U.prototype, "_creatableCalendars", 2);
Y([
  v()
], U.prototype, "_dayWidthPx", 2);
Y([
  v()
], U.prototype, "_deletedUids", 2);
U = Y([
  E("lucarne-calendar-card")
], U);
var ws = Object.defineProperty, xs = Object.getOwnPropertyDescriptor, St = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? xs(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && ws(e, r, i), i;
};
let Le = class extends D {
  constructor() {
    super(...arguments), this._haReady = !1, this._invalid = {};
  }
  connectedCallback() {
    super.connectedCallback(), ti().catch((t) => console.warn("[lucarne] HA editor elements load failed; rendering anyway", t)).then(() => {
      this._haReady = !0;
    });
  }
  setConfig(t) {
    this._config = t;
  }
  _fire(t) {
    kr(this, "config-changed", { config: t });
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
    var a, i;
    const r = [...((a = this._config) == null ? void 0 : a.calendars) ?? []];
    r[t] = { ...r[t], entity: ((i = e.detail) == null ? void 0 : i.value) ?? "" }, this._fire({ ...this._config, calendars: r });
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
  _windowFieldChanged(t, e) {
    const r = e.target, a = r.value === "" ? void 0 : r.valueAsNumber, i = a !== void 0 && Number.isFinite(a) ? a : void 0, n = { ...this._config, [t]: i }, s = n.min_days ?? 3, o = n.max_days ?? 7, l = n.min_col_width ?? 140, d = n.max_col_width ?? 220;
    this._invalid = {
      days: s > o,
      cols: l > d
    }, this._fire(n);
  }
  _addCalendar() {
    var a, i;
    const e = Object.keys(((a = this.hass) == null ? void 0 : a.states) ?? {}).find((n) => n.startsWith("calendar.")) ?? "calendar.example", r = [
      ...((i = this._config) == null ? void 0 : i.calendars) ?? [],
      { entity: e, color: "#a8d8b9" }
    ];
    this._fire({ ...this._config, calendars: r });
  }
  render() {
    var l, d;
    if (!this._config) return u``;
    if (!this._haReady) return u`<div class="loading">Loading editor…</div>`;
    const t = this._config.calendars ?? [], e = ((l = this._config.visible_hours) == null ? void 0 : l.start) ?? "07:00", r = ((d = this._config.visible_hours) == null ? void 0 : d.end) ?? "21:00", a = this._config.show_create_button ?? !0, i = this._config.min_days, n = this._config.max_days, s = this._config.min_col_width, o = this._config.max_col_width;
    return u`
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
            .value=${i !== void 0 ? String(i) : ""}
            placeholder="3"
            @change=${(c) => this._windowFieldChanged("min_days", c)}
          />
          ${this._invalid.days ? u`<div class="editor-error">Min days must be ≤ max days</div>` : ""}
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
            @change=${(c) => this._windowFieldChanged("max_days", c)}
          />
          ${this._invalid.days ? u`<div class="editor-error">Max days must be ≥ min days</div>` : ""}
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
            .value=${s !== void 0 ? String(s) : ""}
            placeholder="140"
            @change=${(c) => this._windowFieldChanged("min_col_width", c)}
          />
          ${this._invalid.cols ? u`<div class="editor-error">Min width must be ≤ max width</div>` : ""}
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
            @change=${(c) => this._windowFieldChanged("max_col_width", c)}
          />
          ${this._invalid.cols ? u`<div class="editor-error">Max width must be ≥ min width</div>` : ""}
        </label>
      </div>

      <div class="section-label">Calendars</div>
      ${t.map(
      (c, h) => u`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${c.entity}
              .includeDomains=${["calendar"]}
              allow-custom-entity
              @value-changed=${(p) => this._calEntityChanged(h, p)}
            ></ha-entity-picker>
            <input
              type="color"
              class="cal-color"
              .value=${c.color}
              @input=${(p) => this._calColorChanged(h, p)}
              title="Calendar color"
            />
            <button type="button" class="remove" @click=${() => this._removeCalendar(h)} title="Remove">✕</button>
          </div>
        `
    )}
      <button type="button" class="add" @click=${this._addCalendar}>+ Add calendar</button>
    `;
  }
};
Le.styles = [N, ei];
St([
  g({ attribute: !1 })
], Le.prototype, "hass", 2);
St([
  v()
], Le.prototype, "_config", 2);
St([
  v()
], Le.prototype, "_haReady", 2);
St([
  v()
], Le.prototype, "_invalid", 2);
Le = St([
  E("lucarne-calendar-card-editor")
], Le);
const $s = [
  "anytime",
  "morning",
  "afternoon",
  "night"
];
function ni(t) {
  return typeof t == "string" && $s.includes(t) ? t : "anytime";
}
var ks = Object.defineProperty, Cs = Object.getOwnPropertyDescriptor, si = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? Cs(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && ks(e, r, i), i;
};
let jt = class extends D {
  constructor() {
    super(...arguments), this.streak = 0;
  }
  _milestoneClass(t) {
    return t >= 30 ? "milestone-5" : t >= 14 ? "milestone-4" : t >= 7 ? "milestone-3" : t >= 3 ? "milestone-2" : t >= 1 ? "milestone-1" : "";
  }
  render() {
    const t = isNaN(this.streak) ? 0 : this.streak, e = t > 0 ? "day streak" : "start a streak today";
    return u`
      <div class="streak-row">
        <span class="flame ${this._milestoneClass(t)}">🔥</span>
        <span class="count">${t}</span>
      </div>
      <div class="label">${e}</div>
    `;
  }
};
jt.styles = M`
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
si([
  g({ type: Number })
], jt.prototype, "streak", 2);
jt = si([
  E("lucarne-streak-display")
], jt);
var Ds = Object.defineProperty, Ms = Object.getOwnPropertyDescriptor, Dr = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? Ms(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Ds(e, r, i), i;
};
let $t = class extends D {
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
    return this.active ? u`
      ${this._dots.map(
      (t) => u`
          <div
            class="dot"
            style="left:${t.left};background:${t.color};animation-delay:${t.delay};width:${t.size};height:${t.size}"
          ></div>
        `
    )}
    ` : u``;
  }
};
$t.styles = M`
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
Dr([
  g({ attribute: "kid-slug" })
], $t.prototype, "kidSlug", 2);
Dr([
  g({ type: Boolean })
], $t.prototype, "active", 2);
$t = Dr([
  E("lucarne-celebration-overlay")
], $t);
var Es = Object.defineProperty, Ss = Object.getOwnPropertyDescriptor, ve = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? Ss(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Es(e, r, i), i;
};
const Ts = ["morning", "afternoon", "night", "anytime"], As = {
  morning: "Morning",
  afternoon: "Afternoon",
  night: "Night",
  anytime: "Anytime"
}, _a = {
  morning: nn,
  afternoon: sn,
  night: on
};
function Os(t, e) {
  return t.due && e.due ? t.due.localeCompare(e.due) : t.due ? -1 : e.due ? 1 : t.summary.localeCompare(e.summary);
}
function Ps(t) {
  const e = t.filter((a) => a.metadata.type === "routine").sort((a, i) => a.summary.localeCompare(i.summary)), r = t.filter((a) => a.metadata.type === "chore").sort(Os);
  return [...e, ...r];
}
function Is(t) {
  const e = /* @__PURE__ */ new Map();
  for (const a of t) {
    const i = ni(a.metadata.time_of_day), n = e.get(i) ?? [];
    n.push(a), e.set(i, n);
  }
  const r = [];
  for (const a of Ts) {
    const i = e.get(a);
    !i || i.length === 0 || r.push({ bucket: a, tasks: Ps(i) });
  }
  return r;
}
let ie = class extends D {
  constructor() {
    super(...arguments), this.tasks = [], this.streak = 0, this.showRoutines = !0, this.showTasks = !0, this.showStreak = !0, this.hideName = !1, this._celebrating = !1, this._celebrationTimer = null, this._lastAllRoutinesDone = null;
  }
  updated(t) {
    if (super.updated(t), !t.has("tasks")) return;
    const e = this.tasks.filter((a) => a.metadata.type === "routine");
    if (e.length === 0) return;
    const r = e.every((a) => a.status === "completed");
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
    if (!this.member) return u``;
    const t = this.tasks.filter((r) => r.metadata.type === "routine" ? this.showRoutines : r.metadata.type === "chore" ? this.showTasks : !1), e = Is(t);
    return u`
      <div class="column" style="--member-color:${this.member.color}">
        <lucarne-celebration-overlay
          kid-slug=${this.member.slug}
          ?active=${this._celebrating}
        ></lucarne-celebration-overlay>

        <button
          class="add-task-btn"
          @click=${this._onAddTask}
          aria-label="Add task for ${this.member.name}"
        ><span aria-hidden="true">+</span></button>

        <div class="header">
          <lucarne-member-avatar
            name=${this.member.name}
            color=${this.member.color}
            .avatar=${this.member.avatar}
          ></lucarne-member-avatar>
          ${this.hideName ? "" : u`<div class="member-name">${this.member.name}</div>`}
        </div>

        <div class="lists">
          ${e.map(({ bucket: r, tasks: a }) => u`
            <div class="section">
              <div class="section-header">
                ${_a[r] ? u`<span class="section-icon">${_a[r]}</span>` : ""}
                ${As[r]}
              </div>
              ${a.map((i) => u`
                <lucarne-task-row
                  .task=${i}
                  .memberColor=${this.member.color}
                ></lucarne-task-row>
              `)}
            </div>
          `)}
        </div>

        ${this.showStreak ? u`
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
ie.styles = M`
    :host {
      display: block;
      position: relative;
      height: 100%;
    }
    .column {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px 12px;
      position: relative;
      height: 100%;
      box-sizing: border-box;
    }
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      margin-bottom: 8px;
      flex: 0 0 auto;
    }
    .member-name {
      font-size: clamp(1rem, 1.5vw, 1.25rem);
      font-weight: 700;
      color: var(--primary-text-color, #212121);
      font-family: var(--primary-font-family, sans-serif);
      text-align: center;
    }
    .add-task-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 2;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: 1px dashed rgba(0, 0, 0, 0.25);
      border-radius: 50%;
      font-size: 1.35rem;
      line-height: 1;
      color: var(--secondary-text-color, #727272);
      cursor: pointer;
    }
    .add-task-btn:hover {
      background: rgba(0, 0, 0, 0.04);
    }
    /* Scrollable list region: flex:1 pushes the streak to the bottom of every
       column (so streaks align across equal-height columns), and the cap makes
       an overlong list scroll internally instead of stretching the card. */
    .lists {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      max-height: var(--lucarne-chores-list-max-height, 420px);
    }
    .section {
      display: flex;
      flex-direction: column;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--secondary-text-color, #727272);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 6px 4px 2px;
    }
    .section-icon {
      display: inline-flex;
      flex-shrink: 0;
    }
    .section-icon svg {
      width: 14px;
      height: 14px;
    }
    .streak-area {
      padding-top: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.07);
      margin-top: 8px;
      flex: 0 0 auto;
    }
  `;
ve([
  g({ attribute: !1 })
], ie.prototype, "member", 2);
ve([
  g({ attribute: !1 })
], ie.prototype, "tasks", 2);
ve([
  g({ type: Number })
], ie.prototype, "streak", 2);
ve([
  g({ type: Boolean, attribute: "show-routines" })
], ie.prototype, "showRoutines", 2);
ve([
  g({ type: Boolean, attribute: "show-tasks" })
], ie.prototype, "showTasks", 2);
ve([
  g({ type: Boolean, attribute: "show-streak" })
], ie.prototype, "showStreak", 2);
ve([
  g({ type: Boolean, attribute: "hide-name" })
], ie.prototype, "hideName", 2);
ve([
  v()
], ie.prototype, "_celebrating", 2);
ie = ve([
  E("lucarne-member-column")
], ie);
async function Rs(t, e) {
  const r = {
    member: e.member,
    summary: e.summary,
    type: e.type
  };
  e.recurrence !== void 0 && (r.recurrence = e.recurrence), e.icon !== void 0 && (r.icon = e.icon), e.due !== void 0 && (r.due = e.due), e.source !== void 0 && (r.source = e.source), e.assignee !== void 0 && (r.assignee = e.assignee), e.time_of_day !== void 0 && (r.time_of_day = e.time_of_day), await t.callService("lucarne_family", "add_task", r);
}
async function Ns(t, e, r) {
  const a = { uid: e };
  r.type !== void 0 && (a.type = r.type), r.recurrence !== void 0 && (a.recurrence = r.recurrence), r.icon !== void 0 && (a.icon = r.icon), r.assignee !== void 0 && (a.assignee = r.assignee), r.time_of_day !== void 0 && (a.time_of_day = r.time_of_day), await t.callService("lucarne_family", "update_task_metadata", a);
}
async function zs(t, e) {
  await t.callService("lucarne_family", "delete_task", { uid: e });
}
async function Ls(t, e, r) {
  const a = await r.arrayBuffer(), i = new Uint8Array(a);
  let n = "";
  for (const o of i)
    n += String.fromCharCode(o);
  const s = btoa(n);
  await t.callService("lucarne_family", "upload_avatar", {
    member: e,
    image_data: s,
    mime_type: r.type
  });
}
async function Hs(t, e, r) {
  await t.callService("lucarne_family", "set_member_avatar", {
    member: e,
    avatar: r
  });
}
var Bs = Object.defineProperty, js = Object.getOwnPropertyDescriptor, L = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? js(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Bs(e, r, i), i;
};
const Us = ["🪥", "🛏️", "🎒", "💗", "📵", "🧸", "👕", "🧹", "🧺", "🍽️", "🐕", "🌱"];
let R = class extends D {
  constructor() {
    super(...arguments), this.members = [], this._selectedMemberSlug = "", this._summary = "", this._type = "chore", this._icon = "", this._recurrenceMode = "none", this._recurrenceDays = [], this._recurrenceInterval = 1, this._recurrenceMonthDay = 1, this._recurrenceNth = 1, this._recurrenceNthDay = "MO", this._recurrenceMonth = 1, this._due = "", this._timeOfDay = "anytime", this._error = "", this._saving = !1;
  }
  updated(t) {
    super.updated(t), t.has("member") && this.member && (this._selectedMemberSlug = this.member.slug);
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  _buildRRule() {
    return this._recurrenceMode === "none" ? "" : this._recurrenceMode === "daily" ? le({ mode: "daily", ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {} }) : this._recurrenceMode === "weekly" ? this._recurrenceDays.length === 0 ? "" : le({
      mode: "weekly",
      days: this._recurrenceDays,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-date" ? le({
      mode: "monthly-date",
      dayOfMonth: this._recurrenceMonthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-nth" ? le({
      mode: "monthly-nth",
      nth: this._recurrenceNth,
      day: this._recurrenceNthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "yearly" ? le({
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
      if (this._type === "routine" && this._recurrenceMode === "weekly" && this._recurrenceDays.length === 0) {
        this._error = "Select at least one day for weekly recurrence";
        return;
      }
      this._saving = !0, this._error = "";
      try {
        const t = this._type === "routine" ? this._buildRRule() : "", e = this._type === "chore" ? this._due : "";
        await Rs(this.hass, {
          member: this._selectedMemberSlug,
          summary: this._summary.trim(),
          type: this._type,
          ...t ? { recurrence: t } : {},
          ...this._icon ? { icon: this._icon } : {},
          ...e ? { due: e } : {},
          time_of_day: this._timeOfDay,
          source: "manual"
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
    const t = this._buildRRule(), e = t ? Za(t) : "One-off (no repeat)", r = {
      MO: "Mon",
      TU: "Tue",
      WE: "Wed",
      TH: "Thu",
      FR: "Fri",
      SA: "Sat",
      SU: "Sun"
    };
    return u`
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
            ${this.members.map((a) => u`<option value=${a.slug}>${a.name}</option>`)}
          </select>
        </div>

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
          <label for="at-type">Type</label>
          <select
            id="at-type"
            .value=${this._type}
            @change=${(a) => this._type = a.target.value}
          >
            <option value="routine">Routine</option>
            <option value="chore">Chore</option>
          </select>
        </div>

        <div class="field">
          <label for="at-time-of-day">Time of day</label>
          <select
            id="at-time-of-day"
            .value=${this._timeOfDay}
            @change=${(a) => this._timeOfDay = a.target.value}
          >
            <option value="anytime">Anytime</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="night">Night</option>
          </select>
        </div>

        <div class="field">
          <label>Icon</label>
          <div class="emoji-picker">
            ${Us.map((a) => u`
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

        ${this._type === "routine" ? u`
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

          ${this._recurrenceMode !== "none" ? u`
                <div class="recurrence-extra">
                  ${this._recurrenceMode !== "monthly-nth" && this._recurrenceMode !== "yearly" ? u`
                        <div>
                          <label>Interval</label>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            .value=${String(this._recurrenceInterval)}
                            @change=${(a) => {
      const i = parseInt(a.target.value, 10);
      this._recurrenceInterval = isNaN(i) || i < 1 ? 1 : i;
    }}
                          />
                        </div>
                      ` : ""}

                  ${this._recurrenceMode === "weekly" ? u`
                        <div>
                          <label>Days</label>
                          <div class="days-row">
                            ${tt.map((a) => u`
                              <button
                                class="day-btn ${this._recurrenceDays.includes(a) ? "selected" : ""}"
                                @click=${() => this._toggleDay(a)}
                              >${r[a]}</button>
                            `)}
                          </div>
                        </div>
                      ` : ""}

                  ${this._recurrenceMode === "monthly-date" ? u`
                        <div>
                          <label for="at-monthday">Day of month</label>
                          <input
                            id="at-monthday"
                            type="number"
                            min="1"
                            max="31"
                            .value=${String(this._recurrenceMonthDay)}
                            @change=${(a) => {
      const i = parseInt(a.target.value, 10);
      this._recurrenceMonthDay = isNaN(i) || i < 1 ? 1 : Math.min(i, 31);
    }}
                          />
                        </div>
                      ` : ""}

                  ${this._recurrenceMode === "monthly-nth" ? u`
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
                              ${tt.map((a) => u`<option value=${a}>${r[a]}</option>`)}
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
      const i = parseInt(a.target.value, 10);
      this._recurrenceInterval = isNaN(i) || i < 1 ? 1 : i;
    }}
                            />
                          </div>
                        </div>
                      ` : ""}

                  ${this._recurrenceMode === "yearly" ? u`
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
      const i = parseInt(a.target.value, 10);
      this._recurrenceMonth = isNaN(i) || i < 1 ? 1 : Math.min(i, 12);
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
      const i = parseInt(a.target.value, 10);
      this._recurrenceMonthDay = isNaN(i) || i < 1 ? 1 : Math.min(i, 31);
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
      const i = parseInt(a.target.value, 10);
      this._recurrenceInterval = isNaN(i) || i < 1 ? 1 : i;
    }}
                            />
                          </div>
                        </div>
                      ` : ""}
                </div>
                <div class="recurrence-summary">${e}</div>
              ` : ""}
        </div>
        ` : ""}

        ${this._type === "chore" ? u`
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

        ${this._error ? u`<div class="error-msg">${this._error}</div>` : ""}

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
R.styles = [
  N,
  M`
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
L([
  g({ attribute: !1 })
], R.prototype, "hass", 2);
L([
  g({ attribute: !1 })
], R.prototype, "member", 2);
L([
  g({ attribute: !1 })
], R.prototype, "members", 2);
L([
  v()
], R.prototype, "_selectedMemberSlug", 2);
L([
  v()
], R.prototype, "_summary", 2);
L([
  v()
], R.prototype, "_type", 2);
L([
  v()
], R.prototype, "_icon", 2);
L([
  v()
], R.prototype, "_recurrenceMode", 2);
L([
  v()
], R.prototype, "_recurrenceDays", 2);
L([
  v()
], R.prototype, "_recurrenceInterval", 2);
L([
  v()
], R.prototype, "_recurrenceMonthDay", 2);
L([
  v()
], R.prototype, "_recurrenceNth", 2);
L([
  v()
], R.prototype, "_recurrenceNthDay", 2);
L([
  v()
], R.prototype, "_recurrenceMonth", 2);
L([
  v()
], R.prototype, "_due", 2);
L([
  v()
], R.prototype, "_timeOfDay", 2);
L([
  v()
], R.prototype, "_error", 2);
L([
  v()
], R.prototype, "_saving", 2);
R = L([
  E("lucarne-add-task-popover")
], R);
var Fs = Object.defineProperty, Ws = Object.getOwnPropertyDescriptor, I = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? Ws(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Fs(e, r, i), i;
};
let O = class extends D {
  constructor() {
    super(...arguments), this.members = [], this._summary = "", this._type = "chore", this._icon = "", this._recurrenceMode = "none", this._recurrenceDays = [], this._recurrenceInterval = 1, this._recurrenceMonthDay = 1, this._recurrenceNth = 1, this._recurrenceNthDay = "MO", this._recurrenceMonth = 1, this._due = "", this._assignee = "", this._timeOfDay = "anytime", this._isCustomRecurrence = !1, this._rawRecurrence = "", this._error = "", this._saving = !1, this._confirmingDelete = !1;
  }
  updated(t) {
    super.updated(t), t.has("task") && this.task && this._prefill();
  }
  _prefill() {
    const t = this.task;
    this._summary = t.summary, this._type = t.metadata.type, this._icon = t.metadata.icon, this._due = t.due ?? "", this._assignee = t.metadata.assignee_slug, this._timeOfDay = ni(t.metadata.time_of_day), this._recurrenceDays = [], this._recurrenceInterval = 1, this._recurrenceMonthDay = 1, this._recurrenceNth = 1, this._recurrenceNthDay = "MO", this._recurrenceMonth = 1, this._rawRecurrence = "", this._isCustomRecurrence = !1;
    const e = xr(t.metadata.recurrence);
    e.mode === "unknown" ? (this._isCustomRecurrence = !0, this._rawRecurrence = e.raw, this._recurrenceMode = "unknown") : (this._isCustomRecurrence = !1, this._recurrenceMode = e.mode, e.mode === "daily" ? this._recurrenceInterval = e.interval ?? 1 : e.mode === "weekly" ? (this._recurrenceDays = [...e.days], this._recurrenceInterval = e.interval ?? 1) : e.mode === "monthly-date" ? (this._recurrenceMonthDay = e.dayOfMonth, this._recurrenceInterval = e.interval ?? 1) : e.mode === "monthly-nth" ? (this._recurrenceNth = e.nth, this._recurrenceNthDay = e.day, this._recurrenceInterval = e.interval ?? 1) : e.mode === "yearly" && (this._recurrenceMonth = e.month, this._recurrenceMonthDay = e.dayOfMonth, this._recurrenceInterval = e.interval ?? 1));
  }
  _close() {
    this.dispatchEvent(new CustomEvent("popover-close", { bubbles: !0, composed: !0 }));
  }
  _buildRRule() {
    return this._isCustomRecurrence ? this._rawRecurrence : this._recurrenceMode === "none" ? "" : this._recurrenceMode === "daily" ? le({ mode: "daily", ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {} }) : this._recurrenceMode === "weekly" ? le({
      mode: "weekly",
      days: this._recurrenceDays,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-date" ? le({
      mode: "monthly-date",
      dayOfMonth: this._recurrenceMonthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "monthly-nth" ? le({
      mode: "monthly-nth",
      nth: this._recurrenceNth,
      day: this._recurrenceNthDay,
      ...this._recurrenceInterval > 1 ? { interval: this._recurrenceInterval } : {}
    }) : this._recurrenceMode === "yearly" ? le({
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
        const e = this.task.metadata.member_slug === "household" ? "todo.lucarne_household" : ((t = this.members.find((n) => n.slug === this.task.metadata.member_slug)) == null ? void 0 : t.todo_entity_id) ?? "", r = this._summary.trim() !== this.task.summary, a = !!this._due && this._due !== (this.task.due ?? ""), i = this._type !== this.task.metadata.type || this._icon !== this.task.metadata.icon || this._buildRRule() !== this.task.metadata.recurrence || this._timeOfDay !== (this.task.metadata.time_of_day ?? "anytime") || this.task.metadata.member_slug === "household" && this._assignee !== this.task.metadata.assignee_slug;
        if (r || a) {
          if (!e) throw new Error("Could not resolve todo entity for this task");
          await this.hass.callService("todo", "update_item", {
            item: this.task.uid,
            rename: this._summary.trim(),
            ...a ? { due_datetime: this._due } : {}
          }, { entity_id: e });
        }
        if (i) {
          const n = this.task.metadata.member_slug === "household";
          await Ns(this.hass, this.task.uid, {
            ...this._type !== this.task.metadata.type ? { type: this._type } : {},
            ...this._icon !== this.task.metadata.icon ? { icon: this._icon } : {},
            ...this._buildRRule() !== this.task.metadata.recurrence ? { recurrence: this._buildRRule() } : {},
            ...this._timeOfDay !== (this.task.metadata.time_of_day ?? "anytime") ? { time_of_day: this._timeOfDay } : {},
            ...n && this._assignee !== this.task.metadata.assignee_slug ? { assignee: this._assignee } : {}
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
        await zs(this.hass, this.task.uid), this._close();
      } catch (t) {
        this._error = t instanceof Error ? t.message : "Failed to delete", this._saving = !1, this._confirmingDelete = !1;
      }
    }
  }
  _toggleDay(t) {
    this._recurrenceDays.includes(t) ? this._recurrenceDays = this._recurrenceDays.filter((e) => e !== t) : this._recurrenceDays = [...this._recurrenceDays, t];
  }
  render() {
    var n;
    if (!this.task) return u``;
    const t = this.task.metadata.member_slug === "household", e = t ? "Household" : ((n = this.members.find((s) => s.slug === this.task.metadata.member_slug)) == null ? void 0 : n.name) ?? this.task.metadata.member_slug, r = this._buildRRule(), a = this._isCustomRecurrence ? "Custom recurrence (not editable here)" : Za(r), i = {
      MO: "Mon",
      TU: "Tue",
      WE: "Wed",
      TH: "Thu",
      FR: "Fri",
      SA: "Sat",
      SU: "Sun"
    };
    return u`
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

        ${t ? u`
              <div class="field">
                <label for="et-assignee">Assignee (optional)</label>
                <select
                  id="et-assignee"
                  .value=${this._assignee}
                  @change=${(s) => this._assignee = s.target.value}
                >
                  <option value="">— None —</option>
                  ${this.members.filter((s) => s.slug !== "household").map(
      (s) => u`<option value=${s.slug}>${s.name}</option>`
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
            @input=${(s) => this._summary = s.target.value}
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
          <label for="et-time-of-day">Time of day</label>
          <select
            id="et-time-of-day"
            .value=${this._timeOfDay}
            @change=${(s) => this._timeOfDay = s.target.value}
          >
            <option value="anytime">Anytime</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="night">Night</option>
          </select>
        </div>

        <div class="field">
          <label for="et-icon">Icon</label>
          <input
            id="et-icon"
            type="text"
            placeholder="Emoji or empty"
            maxlength="8"
            .value=${this._icon}
            @input=${(s) => this._icon = s.target.value}
          />
        </div>

        <div class="field">
          <label for="et-recurrence">Recurrence</label>
          ${this._isCustomRecurrence ? u`<div class="custom-recurrence-note">${a}</div>` : u`
                <select
                  id="et-recurrence"
                  .value=${this._recurrenceMode}
                  @change=${(s) => this._recurrenceMode = s.target.value}
                >
                  <option value="none">None (one-off)</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly-date">Monthly by date</option>
                  <option value="monthly-nth">Monthly by Nth weekday</option>
                  <option value="yearly">Yearly</option>
                </select>

                ${this._recurrenceMode !== "none" ? u`
                      <div class="recurrence-extra">
                        ${this._recurrenceMode !== "monthly-nth" && this._recurrenceMode !== "yearly" ? u`
                              <div>
                                <label>Interval</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="99"
                                  .value=${String(this._recurrenceInterval)}
                                  @change=${(s) => {
      const o = parseInt(s.target.value, 10);
      this._recurrenceInterval = isNaN(o) || o < 1 ? 1 : o;
    }}
                                />
                              </div>
                            ` : ""}

                        ${this._recurrenceMode === "weekly" ? u`
                              <div>
                                <label>Days</label>
                                <div class="days-row">
                                  ${tt.map((s) => u`
                                    <button
                                      class="day-btn ${this._recurrenceDays.includes(s) ? "selected" : ""}"
                                      @click=${() => this._toggleDay(s)}
                                    >${i[s]}</button>
                                  `)}
                                </div>
                              </div>
                            ` : ""}

                        ${this._recurrenceMode === "monthly-date" ? u`
                              <div>
                                <label>Day of month</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="31"
                                  .value=${String(this._recurrenceMonthDay)}
                                  @change=${(s) => {
      const o = parseInt(s.target.value, 10);
      this._recurrenceMonthDay = isNaN(o) || o < 1 ? 1 : Math.min(o, 31);
    }}
                                />
                              </div>
                            ` : ""}

                        ${this._recurrenceMode === "monthly-nth" ? u`
                              <div style="display:flex;gap:8px">
                                <div style="flex:1">
                                  <label>Nth</label>
                                  <select
                                    .value=${String(this._recurrenceNth)}
                                    @change=${(s) => this._recurrenceNth = parseInt(s.target.value, 10)}
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
                                    @change=${(s) => this._recurrenceNthDay = s.target.value}
                                  >
                                    ${tt.map((s) => u`<option value=${s}>${i[s]}</option>`)}
                                  </select>
                                </div>
                                <div style="flex:1">
                                  <label>Every N months</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    .value=${String(this._recurrenceInterval)}
                                    @change=${(s) => {
      const o = parseInt(s.target.value, 10);
      this._recurrenceInterval = isNaN(o) || o < 1 ? 1 : o;
    }}
                                  />
                                </div>
                              </div>
                            ` : ""}

                        ${this._recurrenceMode === "yearly" ? u`
                              <div style="display:flex;gap:8px">
                                <div style="flex:1">
                                  <label>Month</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    .value=${String(this._recurrenceMonth)}
                                    @change=${(s) => {
      const o = parseInt(s.target.value, 10);
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
                                    @change=${(s) => {
      const o = parseInt(s.target.value, 10);
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
                                    @change=${(s) => {
      const o = parseInt(s.target.value, 10);
      this._recurrenceInterval = isNaN(o) || o < 1 ? 1 : o;
    }}
                                  />
                                </div>
                              </div>
                            ` : ""}
                      </div>
                      <div class="recurrence-summary">${a}</div>
                    ` : ""}
              `}
        </div>

        <div class="field">
          <label for="et-due">Due (optional)</label>
          <input
            id="et-due"
            type="datetime-local"
            .value=${this._due}
            @change=${(s) => this._due = s.target.value}
          />
        </div>

        ${this._error ? u`<div class="error-msg">${this._error}</div>` : ""}

        <div class="actions">
          <button class="btn btn-cancel" @click=${this._close}>Cancel</button>
          <button class="btn btn-save" ?disabled=${this._saving} @click=${this._save}>
            ${this._saving ? "Saving…" : "Save"}
          </button>
        </div>

        <div class="delete-zone">
          ${this._confirmingDelete ? u`
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
              ` : u`
                <button class="btn btn-delete" @click=${() => this._confirmingDelete = !0}>
                  Delete Task
                </button>
              `}
        </div>
      </div>
    `;
  }
};
O.styles = [
  N,
  M`
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
I([
  g({ attribute: !1 })
], O.prototype, "hass", 2);
I([
  g({ attribute: !1 })
], O.prototype, "task", 2);
I([
  g({ attribute: !1 })
], O.prototype, "members", 2);
I([
  v()
], O.prototype, "_summary", 2);
I([
  v()
], O.prototype, "_type", 2);
I([
  v()
], O.prototype, "_icon", 2);
I([
  v()
], O.prototype, "_recurrenceMode", 2);
I([
  v()
], O.prototype, "_recurrenceDays", 2);
I([
  v()
], O.prototype, "_recurrenceInterval", 2);
I([
  v()
], O.prototype, "_recurrenceMonthDay", 2);
I([
  v()
], O.prototype, "_recurrenceNth", 2);
I([
  v()
], O.prototype, "_recurrenceNthDay", 2);
I([
  v()
], O.prototype, "_recurrenceMonth", 2);
I([
  v()
], O.prototype, "_due", 2);
I([
  v()
], O.prototype, "_assignee", 2);
I([
  v()
], O.prototype, "_timeOfDay", 2);
I([
  v()
], O.prototype, "_isCustomRecurrence", 2);
I([
  v()
], O.prototype, "_rawRecurrence", 2);
I([
  v()
], O.prototype, "_error", 2);
I([
  v()
], O.prototype, "_saving", 2);
I([
  v()
], O.prototype, "_confirmingDelete", 2);
O = I([
  E("lucarne-edit-task-popover")
], O);
var Ys = Object.defineProperty, Vs = Object.getOwnPropertyDescriptor, nt = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? Vs(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Ys(e, r, i), i;
};
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lucarne-chores-card",
  name: "Lucarne Chores",
  description: "Family chore grid with streaks and celebration",
  preview: !0
});
let Ce = class extends D {
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
    super.connectedCallback(), this.hass && !this._unsubFamily && (this._unsubFamily = bt(this.hass, (t) => {
      this._familyState = t;
    }));
  }
  updated(t) {
    super.updated(t), t.has("hass") && this.hass && !this._unsubFamily && (this._unsubFamily = bt(this.hass, (e) => {
      this._familyState = e;
    }));
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._unsubFamily) == null || t.call(this), this._unsubFamily = void 0;
  }
  _resolveMembers() {
    if (!this._config || !this._familyState) return [];
    const { members: t } = this._config, e = new Set(this._config.hidden_members ?? []), r = this._config.show_routines ?? !0, a = this._config.show_tasks ?? !0, i = /* @__PURE__ */ new Date(), n = new Date(i.getFullYear(), i.getMonth(), i.getDate(), 23, 59, 59, 999), s = [];
    for (const o of t) {
      if (e.has(o)) continue;
      const l = o === "household" ? mt : this._familyState.members.find((p) => p.slug === o) ?? null;
      if (!l) continue;
      const c = (this._familyState.tasksByMember.get(o) ?? []).filter((p) => p.metadata.type === "routine" ? r : p.metadata.type === "chore" && a ? p.due === null ? !0 : (p.due.includes("T") ? new Date(p.due) : /* @__PURE__ */ new Date(p.due + "T00:00:00")) <= n : !1), h = this._familyState.streakByMember.get(o) ?? 0;
      s.push({ member: l, tasks: c, streak: h });
    }
    return s;
  }
  async _handleTaskToggle(t) {
    var i;
    const { task: e } = t.detail;
    if (!this.hass || !this._familyState) return;
    const r = e.status === "completed" ? "needs_action" : "completed", a = e.metadata.member_slug === "household" ? "todo.lucarne_household" : ((i = this._familyState.members.find((n) => n.slug === e.metadata.member_slug)) == null ? void 0 : i.todo_entity_id) ?? "";
    a && await this.hass.callService("todo", "update_item", { item: e.uid, status: r }, { entity_id: a });
  }
  _handleAddTask(t) {
    const { memberSlug: e } = t.detail;
    if (!this._familyState) return;
    const r = e === "household" ? mt : this._familyState.members.find((a) => a.slug === e) ?? null;
    r && (this._addTaskMember = r);
  }
  _handleLongPress(t) {
    const { task: e } = t.detail;
    this._editTask = e;
  }
  render() {
    if (!this._config) return u``;
    if ("kids" in this._config)
      return u`
        <ha-card>
          <div class="error-block">
            <strong>Card upgraded</strong>
            This card was upgraded. Install the Lucarne Family integration and update your YAML.
          </div>
        </ha-card>
      `;
    const t = this._config.title ?? "Chores", e = this._config.show_routines ?? !0, r = this._config.show_tasks ?? !0, a = this._config.show_streak ?? !0, i = this._config.hide_names ?? !1;
    if (this._familyState === null)
      return u`<ha-card><div class="loading">Loading…</div></ha-card>`;
    if (this._familyState.integrationError !== null)
      return u`
        <ha-card>
          <div class="error-block">
            <strong>Lucarne Family integration not set up</strong>
            Install it in Settings → Devices &amp; Services.
          </div>
        </ha-card>
      `;
    const n = this._resolveMembers(), s = [...this._familyState.members, mt];
    return u`
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
          ${n.map(({ member: o, tasks: l, streak: d }) => u`
            <div class="member-cell">
              <lucarne-member-column
                .member=${o}
                .tasks=${l}
                .streak=${d}
                ?show-routines=${e}
                ?show-tasks=${r}
                ?show-streak=${a}
                ?hide-name=${i}
              ></lucarne-member-column>
            </div>
          `)}
        </div>
      </ha-card>

      ${this._addTaskMember !== null ? u`
            <lucarne-add-task-popover
              .hass=${this.hass}
              .member=${this._addTaskMember}
              .members=${s}
              @popover-close=${() => {
      this._addTaskMember = null;
    }}
            ></lucarne-add-task-popover>
          ` : ""}

      ${this._editTask !== null ? u`
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
Ce.styles = [
  N,
  M`
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
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x proximity;
      }
      .member-cell {
        display: flex;
        flex: 1 0 220px;
        min-width: 220px;
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        position: relative;
        scroll-snap-align: start;
      }
      .member-cell:last-child {
        border-right: none;
      }
      /* Stretch the column to the cell so equal-height columns pin their
         streaks to the same baseline (see member-column .lists/.streak-area). */
      .member-cell lucarne-member-column {
        flex: 1 1 auto;
        min-width: 0;
      }
      @media (max-width: 600px) {
        .members-grid {
          flex-direction: column;
          overflow-x: visible;
          overflow-y: visible;
          scroll-snap-type: none;
        }
        .member-cell {
          flex: 1 1 auto;
          min-width: 0;
          width: 100%;
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
nt([
  g({ attribute: !1 })
], Ce.prototype, "hass", 2);
nt([
  v()
], Ce.prototype, "_config", 2);
nt([
  v()
], Ce.prototype, "_familyState", 2);
nt([
  v()
], Ce.prototype, "_addTaskMember", 2);
nt([
  v()
], Ce.prototype, "_editTask", 2);
Ce = nt([
  E("lucarne-chores-card")
], Ce);
/*!
 * Cropper.js v1.6.2
 * https://fengyuanchen.github.io/cropperjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2024-04-21T07:43:05.335Z
 */
function wa(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(t);
    e && (a = a.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), r.push.apply(r, a);
  }
  return r;
}
function oi(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? wa(Object(r), !0).forEach(function(a) {
      Ks(t, a, r[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : wa(Object(r)).forEach(function(a) {
      Object.defineProperty(t, a, Object.getOwnPropertyDescriptor(r, a));
    });
  }
  return t;
}
function Xs(t, e) {
  if (typeof t != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var a = r.call(t, e);
    if (typeof a != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
function li(t) {
  var e = Xs(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function sr(t) {
  "@babel/helpers - typeof";
  return sr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, sr(t);
}
function qs(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function xa(t, e) {
  for (var r = 0; r < e.length; r++) {
    var a = e[r];
    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(t, li(a.key), a);
  }
}
function Gs(t, e, r) {
  return e && xa(t.prototype, e), r && xa(t, r), Object.defineProperty(t, "prototype", {
    writable: !1
  }), t;
}
function Ks(t, e, r) {
  return e = li(e), e in t ? Object.defineProperty(t, e, {
    value: r,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = r, t;
}
function ci(t) {
  return Qs(t) || Zs(t) || Js(t) || eo();
}
function Qs(t) {
  if (Array.isArray(t)) return or(t);
}
function Zs(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Js(t, e) {
  if (t) {
    if (typeof t == "string") return or(t, e);
    var r = Object.prototype.toString.call(t).slice(8, -1);
    if (r === "Object" && t.constructor && (r = t.constructor.name), r === "Map" || r === "Set") return Array.from(t);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return or(t, e);
  }
}
function or(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var r = 0, a = new Array(e); r < e; r++) a[r] = t[r];
  return a;
}
function eo() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
var Gt = typeof window < "u" && typeof window.document < "u", he = Gt ? window : {}, Mr = Gt && he.document.documentElement ? "ontouchstart" in he.document.documentElement : !1, Er = Gt ? "PointerEvent" in he : !1, T = "cropper", Sr = "all", di = "crop", hi = "move", ui = "zoom", Te = "e", Ae = "w", Fe = "s", be = "n", lt = "ne", ct = "nw", dt = "se", ht = "sw", lr = "".concat(T, "-crop"), $a = "".concat(T, "-disabled"), Q = "".concat(T, "-hidden"), ka = "".concat(T, "-hide"), to = "".concat(T, "-invisible"), Ut = "".concat(T, "-modal"), cr = "".concat(T, "-move"), kt = "".concat(T, "Action"), Rt = "".concat(T, "Preview"), Tr = "crop", pi = "move", mi = "none", dr = "crop", hr = "cropend", ur = "cropmove", pr = "cropstart", Ca = "dblclick", ro = Mr ? "touchstart" : "mousedown", ao = Mr ? "touchmove" : "mousemove", io = Mr ? "touchend touchcancel" : "mouseup", Da = Er ? "pointerdown" : ro, Ma = Er ? "pointermove" : ao, Ea = Er ? "pointerup pointercancel" : io, Sa = "ready", Ta = "resize", Aa = "wheel", mr = "zoom", Oa = "image/jpeg", no = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/, so = /^data:/, oo = /^data:image\/jpeg;base64,/, lo = /^img|canvas$/i, fi = 200, gi = 100, Pa = {
  // Define the view mode of the cropper
  viewMode: 0,
  // 0, 1, 2, 3
  // Define the dragging mode of the cropper
  dragMode: Tr,
  // 'crop', 'move' or 'none'
  // Define the initial aspect ratio of the crop box
  initialAspectRatio: NaN,
  // Define the aspect ratio of the crop box
  aspectRatio: NaN,
  // An object with the previous cropping result data
  data: null,
  // A selector for adding extra containers to preview
  preview: "",
  // Re-render the cropper when resize the window
  responsive: !0,
  // Restore the cropped area after resize the window
  restore: !0,
  // Check if the current image is a cross-origin image
  checkCrossOrigin: !0,
  // Check the current image's Exif Orientation information
  checkOrientation: !0,
  // Show the black modal
  modal: !0,
  // Show the dashed lines for guiding
  guides: !0,
  // Show the center indicator for guiding
  center: !0,
  // Show the white modal to highlight the crop box
  highlight: !0,
  // Show the grid background
  background: !0,
  // Enable to crop the image automatically when initialize
  autoCrop: !0,
  // Define the percentage of automatic cropping area when initializes
  autoCropArea: 0.8,
  // Enable to move the image
  movable: !0,
  // Enable to rotate the image
  rotatable: !0,
  // Enable to scale the image
  scalable: !0,
  // Enable to zoom the image
  zoomable: !0,
  // Enable to zoom the image by dragging touch
  zoomOnTouch: !0,
  // Enable to zoom the image by wheeling mouse
  zoomOnWheel: !0,
  // Define zoom ratio when zoom the image by wheeling mouse
  wheelZoomRatio: 0.1,
  // Enable to move the crop box
  cropBoxMovable: !0,
  // Enable to resize the crop box
  cropBoxResizable: !0,
  // Toggle drag mode between "crop" and "move" when click twice on the cropper
  toggleDragModeOnDblclick: !0,
  // Size limitation
  minCanvasWidth: 0,
  minCanvasHeight: 0,
  minCropBoxWidth: 0,
  minCropBoxHeight: 0,
  minContainerWidth: fi,
  minContainerHeight: gi,
  // Shortcuts of events
  ready: null,
  cropstart: null,
  cropmove: null,
  cropend: null,
  crop: null,
  zoom: null
}, co = '<div class="cropper-container" touch-action="none"><div class="cropper-wrap-box"><div class="cropper-canvas"></div></div><div class="cropper-drag-box"></div><div class="cropper-crop-box"><span class="cropper-view-box"></span><span class="cropper-dashed dashed-h"></span><span class="cropper-dashed dashed-v"></span><span class="cropper-center"></span><span class="cropper-face"></span><span class="cropper-line line-e" data-cropper-action="e"></span><span class="cropper-line line-n" data-cropper-action="n"></span><span class="cropper-line line-w" data-cropper-action="w"></span><span class="cropper-line line-s" data-cropper-action="s"></span><span class="cropper-point point-e" data-cropper-action="e"></span><span class="cropper-point point-n" data-cropper-action="n"></span><span class="cropper-point point-w" data-cropper-action="w"></span><span class="cropper-point point-s" data-cropper-action="s"></span><span class="cropper-point point-ne" data-cropper-action="ne"></span><span class="cropper-point point-nw" data-cropper-action="nw"></span><span class="cropper-point point-sw" data-cropper-action="sw"></span><span class="cropper-point point-se" data-cropper-action="se"></span></div></div>', ho = Number.isNaN || he.isNaN;
function $(t) {
  return typeof t == "number" && !ho(t);
}
var Ia = function(e) {
  return e > 0 && e < 1 / 0;
};
function ar(t) {
  return typeof t > "u";
}
function He(t) {
  return sr(t) === "object" && t !== null;
}
var uo = Object.prototype.hasOwnProperty;
function Xe(t) {
  if (!He(t))
    return !1;
  try {
    var e = t.constructor, r = e.prototype;
    return e && r && uo.call(r, "isPrototypeOf");
  } catch {
    return !1;
  }
}
function G(t) {
  return typeof t == "function";
}
var po = Array.prototype.slice;
function vi(t) {
  return Array.from ? Array.from(t) : po.call(t);
}
function z(t, e) {
  return t && G(e) && (Array.isArray(t) || $(t.length) ? vi(t).forEach(function(r, a) {
    e.call(t, r, a, t);
  }) : He(t) && Object.keys(t).forEach(function(r) {
    e.call(t, t[r], r, t);
  })), t;
}
var A = Object.assign || function(e) {
  for (var r = arguments.length, a = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++)
    a[i - 1] = arguments[i];
  return He(e) && a.length > 0 && a.forEach(function(n) {
    He(n) && Object.keys(n).forEach(function(s) {
      e[s] = n[s];
    });
  }), e;
}, mo = /\.\d*(?:0|9){12}\d*$/;
function Ge(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1e11;
  return mo.test(t) ? Math.round(t * e) / e : t;
}
var fo = /^width|height|left|top|marginLeft|marginTop$/;
function we(t, e) {
  var r = t.style;
  z(e, function(a, i) {
    fo.test(i) && $(a) && (a = "".concat(a, "px")), r[i] = a;
  });
}
function go(t, e) {
  return t.classList ? t.classList.contains(e) : t.className.indexOf(e) > -1;
}
function H(t, e) {
  if (e) {
    if ($(t.length)) {
      z(t, function(a) {
        H(a, e);
      });
      return;
    }
    if (t.classList) {
      t.classList.add(e);
      return;
    }
    var r = t.className.trim();
    r ? r.indexOf(e) < 0 && (t.className = "".concat(r, " ").concat(e)) : t.className = e;
  }
}
function ce(t, e) {
  if (e) {
    if ($(t.length)) {
      z(t, function(r) {
        ce(r, e);
      });
      return;
    }
    if (t.classList) {
      t.classList.remove(e);
      return;
    }
    t.className.indexOf(e) >= 0 && (t.className = t.className.replace(e, ""));
  }
}
function qe(t, e, r) {
  if (e) {
    if ($(t.length)) {
      z(t, function(a) {
        qe(a, e, r);
      });
      return;
    }
    r ? H(t, e) : ce(t, e);
  }
}
var vo = /([a-z\d])([A-Z])/g;
function Ar(t) {
  return t.replace(vo, "$1-$2").toLowerCase();
}
function fr(t, e) {
  return He(t[e]) ? t[e] : t.dataset ? t.dataset[e] : t.getAttribute("data-".concat(Ar(e)));
}
function Ct(t, e, r) {
  He(r) ? t[e] = r : t.dataset ? t.dataset[e] = r : t.setAttribute("data-".concat(Ar(e)), r);
}
function yo(t, e) {
  if (He(t[e]))
    try {
      delete t[e];
    } catch {
      t[e] = void 0;
    }
  else if (t.dataset)
    try {
      delete t.dataset[e];
    } catch {
      t.dataset[e] = void 0;
    }
  else
    t.removeAttribute("data-".concat(Ar(e)));
}
var yi = /\s\s*/, bi = function() {
  var t = !1;
  if (Gt) {
    var e = !1, r = function() {
    }, a = Object.defineProperty({}, "once", {
      get: function() {
        return t = !0, e;
      },
      /**
       * This setter can fix a `TypeError` in strict mode
       * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
       * @param {boolean} value - The value to set
       */
      set: function(n) {
        e = n;
      }
    });
    he.addEventListener("test", r, a), he.removeEventListener("test", r, a);
  }
  return t;
}();
function re(t, e, r) {
  var a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, i = r;
  e.trim().split(yi).forEach(function(n) {
    if (!bi) {
      var s = t.listeners;
      s && s[n] && s[n][r] && (i = s[n][r], delete s[n][r], Object.keys(s[n]).length === 0 && delete s[n], Object.keys(s).length === 0 && delete t.listeners);
    }
    t.removeEventListener(n, i, a);
  });
}
function J(t, e, r) {
  var a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, i = r;
  e.trim().split(yi).forEach(function(n) {
    if (a.once && !bi) {
      var s = t.listeners, o = s === void 0 ? {} : s;
      i = function() {
        delete o[n][r], t.removeEventListener(n, i, a);
        for (var d = arguments.length, c = new Array(d), h = 0; h < d; h++)
          c[h] = arguments[h];
        r.apply(t, c);
      }, o[n] || (o[n] = {}), o[n][r] && t.removeEventListener(n, o[n][r], a), o[n][r] = i, t.listeners = o;
    }
    t.addEventListener(n, i, a);
  });
}
function Ke(t, e, r) {
  var a;
  return G(Event) && G(CustomEvent) ? a = new CustomEvent(e, {
    detail: r,
    bubbles: !0,
    cancelable: !0
  }) : (a = document.createEvent("CustomEvent"), a.initCustomEvent(e, !0, !0, r)), t.dispatchEvent(a);
}
function _i(t) {
  var e = t.getBoundingClientRect();
  return {
    left: e.left + (window.pageXOffset - document.documentElement.clientLeft),
    top: e.top + (window.pageYOffset - document.documentElement.clientTop)
  };
}
var ir = he.location, bo = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;
function Ra(t) {
  var e = t.match(bo);
  return e !== null && (e[1] !== ir.protocol || e[2] !== ir.hostname || e[3] !== ir.port);
}
function Na(t) {
  var e = "timestamp=".concat((/* @__PURE__ */ new Date()).getTime());
  return t + (t.indexOf("?") === -1 ? "?" : "&") + e;
}
function ft(t) {
  var e = t.rotate, r = t.scaleX, a = t.scaleY, i = t.translateX, n = t.translateY, s = [];
  $(i) && i !== 0 && s.push("translateX(".concat(i, "px)")), $(n) && n !== 0 && s.push("translateY(".concat(n, "px)")), $(e) && e !== 0 && s.push("rotate(".concat(e, "deg)")), $(r) && r !== 1 && s.push("scaleX(".concat(r, ")")), $(a) && a !== 1 && s.push("scaleY(".concat(a, ")"));
  var o = s.length ? s.join(" ") : "none";
  return {
    WebkitTransform: o,
    msTransform: o,
    transform: o
  };
}
function _o(t) {
  var e = oi({}, t), r = 0;
  return z(t, function(a, i) {
    delete e[i], z(e, function(n) {
      var s = Math.abs(a.startX - n.startX), o = Math.abs(a.startY - n.startY), l = Math.abs(a.endX - n.endX), d = Math.abs(a.endY - n.endY), c = Math.sqrt(s * s + o * o), h = Math.sqrt(l * l + d * d), p = (h - c) / c;
      Math.abs(p) > Math.abs(r) && (r = p);
    });
  }), r;
}
function Nt(t, e) {
  var r = t.pageX, a = t.pageY, i = {
    endX: r,
    endY: a
  };
  return e ? i : oi({
    startX: r,
    startY: a
  }, i);
}
function wo(t) {
  var e = 0, r = 0, a = 0;
  return z(t, function(i) {
    var n = i.startX, s = i.startY;
    e += n, r += s, a += 1;
  }), e /= a, r /= a, {
    pageX: e,
    pageY: r
  };
}
function xe(t) {
  var e = t.aspectRatio, r = t.height, a = t.width, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "contain", n = Ia(a), s = Ia(r);
  if (n && s) {
    var o = r * e;
    i === "contain" && o > a || i === "cover" && o < a ? r = a / e : a = r * e;
  } else n ? r = a / e : s && (a = r * e);
  return {
    width: a,
    height: r
  };
}
function xo(t) {
  var e = t.width, r = t.height, a = t.degree;
  if (a = Math.abs(a) % 180, a === 90)
    return {
      width: r,
      height: e
    };
  var i = a % 90 * Math.PI / 180, n = Math.sin(i), s = Math.cos(i), o = e * s + r * n, l = e * n + r * s;
  return a > 90 ? {
    width: l,
    height: o
  } : {
    width: o,
    height: l
  };
}
function $o(t, e, r, a) {
  var i = e.aspectRatio, n = e.naturalWidth, s = e.naturalHeight, o = e.rotate, l = o === void 0 ? 0 : o, d = e.scaleX, c = d === void 0 ? 1 : d, h = e.scaleY, p = h === void 0 ? 1 : h, f = r.aspectRatio, y = r.naturalWidth, _ = r.naturalHeight, b = a.fillColor, w = b === void 0 ? "transparent" : b, x = a.imageSmoothingEnabled, k = x === void 0 ? !0 : x, Z = a.imageSmoothingQuality, F = Z === void 0 ? "low" : Z, m = a.maxWidth, C = m === void 0 ? 1 / 0 : m, S = a.maxHeight, V = S === void 0 ? 1 / 0 : S, X = a.minWidth, se = X === void 0 ? 0 : X, Me = a.minHeight, ye = Me === void 0 ? 0 : Me, oe = document.createElement("canvas"), q = oe.getContext("2d"), Ee = xe({
    aspectRatio: f,
    width: C,
    height: V
  }), At = xe({
    aspectRatio: f,
    width: se,
    height: ye
  }, "cover"), Kt = Math.min(Ee.width, Math.max(At.width, y)), Qt = Math.min(Ee.height, Math.max(At.height, _)), Or = xe({
    aspectRatio: i,
    width: C,
    height: V
  }), Pr = xe({
    aspectRatio: i,
    width: se,
    height: ye
  }, "cover"), Ir = Math.min(Or.width, Math.max(Pr.width, n)), Rr = Math.min(Or.height, Math.max(Pr.height, s)), $i = [-Ir / 2, -Rr / 2, Ir, Rr];
  return oe.width = Ge(Kt), oe.height = Ge(Qt), q.fillStyle = w, q.fillRect(0, 0, Kt, Qt), q.save(), q.translate(Kt / 2, Qt / 2), q.rotate(l * Math.PI / 180), q.scale(c, p), q.imageSmoothingEnabled = k, q.imageSmoothingQuality = F, q.drawImage.apply(q, [t].concat(ci($i.map(function(ki) {
    return Math.floor(Ge(ki));
  })))), q.restore(), oe;
}
var wi = String.fromCharCode;
function ko(t, e, r) {
  var a = "";
  r += e;
  for (var i = e; i < r; i += 1)
    a += wi(t.getUint8(i));
  return a;
}
var Co = /^data:.*,/;
function Do(t) {
  var e = t.replace(Co, ""), r = atob(e), a = new ArrayBuffer(r.length), i = new Uint8Array(a);
  return z(i, function(n, s) {
    i[s] = r.charCodeAt(s);
  }), a;
}
function Mo(t, e) {
  for (var r = [], a = 8192, i = new Uint8Array(t); i.length > 0; )
    r.push(wi.apply(null, vi(i.subarray(0, a)))), i = i.subarray(a);
  return "data:".concat(e, ";base64,").concat(btoa(r.join("")));
}
function Eo(t) {
  var e = new DataView(t), r;
  try {
    var a, i, n;
    if (e.getUint8(0) === 255 && e.getUint8(1) === 216)
      for (var s = e.byteLength, o = 2; o + 1 < s; ) {
        if (e.getUint8(o) === 255 && e.getUint8(o + 1) === 225) {
          i = o;
          break;
        }
        o += 1;
      }
    if (i) {
      var l = i + 4, d = i + 10;
      if (ko(e, l, 4) === "Exif") {
        var c = e.getUint16(d);
        if (a = c === 18761, (a || c === 19789) && e.getUint16(d + 2, a) === 42) {
          var h = e.getUint32(d + 4, a);
          h >= 8 && (n = d + h);
        }
      }
    }
    if (n) {
      var p = e.getUint16(n, a), f, y;
      for (y = 0; y < p; y += 1)
        if (f = n + y * 12 + 2, e.getUint16(f, a) === 274) {
          f += 8, r = e.getUint16(f, a), e.setUint16(f, 1, a);
          break;
        }
    }
  } catch {
    r = 1;
  }
  return r;
}
function So(t) {
  var e = 0, r = 1, a = 1;
  switch (t) {
    case 2:
      r = -1;
      break;
    case 3:
      e = -180;
      break;
    case 4:
      a = -1;
      break;
    case 5:
      e = 90, a = -1;
      break;
    case 6:
      e = 90;
      break;
    case 7:
      e = 90, r = -1;
      break;
    case 8:
      e = -90;
      break;
  }
  return {
    rotate: e,
    scaleX: r,
    scaleY: a
  };
}
var To = {
  render: function() {
    this.initContainer(), this.initCanvas(), this.initCropBox(), this.renderCanvas(), this.cropped && this.renderCropBox();
  },
  initContainer: function() {
    var e = this.element, r = this.options, a = this.container, i = this.cropper, n = Number(r.minContainerWidth), s = Number(r.minContainerHeight);
    H(i, Q), ce(e, Q);
    var o = {
      width: Math.max(a.offsetWidth, n >= 0 ? n : fi),
      height: Math.max(a.offsetHeight, s >= 0 ? s : gi)
    };
    this.containerData = o, we(i, {
      width: o.width,
      height: o.height
    }), H(e, Q), ce(i, Q);
  },
  // Canvas (image wrapper)
  initCanvas: function() {
    var e = this.containerData, r = this.imageData, a = this.options.viewMode, i = Math.abs(r.rotate) % 180 === 90, n = i ? r.naturalHeight : r.naturalWidth, s = i ? r.naturalWidth : r.naturalHeight, o = n / s, l = e.width, d = e.height;
    e.height * o > e.width ? a === 3 ? l = e.height * o : d = e.width / o : a === 3 ? d = e.width / o : l = e.height * o;
    var c = {
      aspectRatio: o,
      naturalWidth: n,
      naturalHeight: s,
      width: l,
      height: d
    };
    this.canvasData = c, this.limited = a === 1 || a === 2, this.limitCanvas(!0, !0), c.width = Math.min(Math.max(c.width, c.minWidth), c.maxWidth), c.height = Math.min(Math.max(c.height, c.minHeight), c.maxHeight), c.left = (e.width - c.width) / 2, c.top = (e.height - c.height) / 2, c.oldLeft = c.left, c.oldTop = c.top, this.initialCanvasData = A({}, c);
  },
  limitCanvas: function(e, r) {
    var a = this.options, i = this.containerData, n = this.canvasData, s = this.cropBoxData, o = a.viewMode, l = n.aspectRatio, d = this.cropped && s;
    if (e) {
      var c = Number(a.minCanvasWidth) || 0, h = Number(a.minCanvasHeight) || 0;
      o > 1 ? (c = Math.max(c, i.width), h = Math.max(h, i.height), o === 3 && (h * l > c ? c = h * l : h = c / l)) : o > 0 && (c ? c = Math.max(c, d ? s.width : 0) : h ? h = Math.max(h, d ? s.height : 0) : d && (c = s.width, h = s.height, h * l > c ? c = h * l : h = c / l));
      var p = xe({
        aspectRatio: l,
        width: c,
        height: h
      });
      c = p.width, h = p.height, n.minWidth = c, n.minHeight = h, n.maxWidth = 1 / 0, n.maxHeight = 1 / 0;
    }
    if (r)
      if (o > (d ? 0 : 1)) {
        var f = i.width - n.width, y = i.height - n.height;
        n.minLeft = Math.min(0, f), n.minTop = Math.min(0, y), n.maxLeft = Math.max(0, f), n.maxTop = Math.max(0, y), d && this.limited && (n.minLeft = Math.min(s.left, s.left + (s.width - n.width)), n.minTop = Math.min(s.top, s.top + (s.height - n.height)), n.maxLeft = s.left, n.maxTop = s.top, o === 2 && (n.width >= i.width && (n.minLeft = Math.min(0, f), n.maxLeft = Math.max(0, f)), n.height >= i.height && (n.minTop = Math.min(0, y), n.maxTop = Math.max(0, y))));
      } else
        n.minLeft = -n.width, n.minTop = -n.height, n.maxLeft = i.width, n.maxTop = i.height;
  },
  renderCanvas: function(e, r) {
    var a = this.canvasData, i = this.imageData;
    if (r) {
      var n = xo({
        width: i.naturalWidth * Math.abs(i.scaleX || 1),
        height: i.naturalHeight * Math.abs(i.scaleY || 1),
        degree: i.rotate || 0
      }), s = n.width, o = n.height, l = a.width * (s / a.naturalWidth), d = a.height * (o / a.naturalHeight);
      a.left -= (l - a.width) / 2, a.top -= (d - a.height) / 2, a.width = l, a.height = d, a.aspectRatio = s / o, a.naturalWidth = s, a.naturalHeight = o, this.limitCanvas(!0, !1);
    }
    (a.width > a.maxWidth || a.width < a.minWidth) && (a.left = a.oldLeft), (a.height > a.maxHeight || a.height < a.minHeight) && (a.top = a.oldTop), a.width = Math.min(Math.max(a.width, a.minWidth), a.maxWidth), a.height = Math.min(Math.max(a.height, a.minHeight), a.maxHeight), this.limitCanvas(!1, !0), a.left = Math.min(Math.max(a.left, a.minLeft), a.maxLeft), a.top = Math.min(Math.max(a.top, a.minTop), a.maxTop), a.oldLeft = a.left, a.oldTop = a.top, we(this.canvas, A({
      width: a.width,
      height: a.height
    }, ft({
      translateX: a.left,
      translateY: a.top
    }))), this.renderImage(e), this.cropped && this.limited && this.limitCropBox(!0, !0);
  },
  renderImage: function(e) {
    var r = this.canvasData, a = this.imageData, i = a.naturalWidth * (r.width / r.naturalWidth), n = a.naturalHeight * (r.height / r.naturalHeight);
    A(a, {
      width: i,
      height: n,
      left: (r.width - i) / 2,
      top: (r.height - n) / 2
    }), we(this.image, A({
      width: a.width,
      height: a.height
    }, ft(A({
      translateX: a.left,
      translateY: a.top
    }, a)))), e && this.output();
  },
  initCropBox: function() {
    var e = this.options, r = this.canvasData, a = e.aspectRatio || e.initialAspectRatio, i = Number(e.autoCropArea) || 0.8, n = {
      width: r.width,
      height: r.height
    };
    a && (r.height * a > r.width ? n.height = n.width / a : n.width = n.height * a), this.cropBoxData = n, this.limitCropBox(!0, !0), n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth), n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight), n.width = Math.max(n.minWidth, n.width * i), n.height = Math.max(n.minHeight, n.height * i), n.left = r.left + (r.width - n.width) / 2, n.top = r.top + (r.height - n.height) / 2, n.oldLeft = n.left, n.oldTop = n.top, this.initialCropBoxData = A({}, n);
  },
  limitCropBox: function(e, r) {
    var a = this.options, i = this.containerData, n = this.canvasData, s = this.cropBoxData, o = this.limited, l = a.aspectRatio;
    if (e) {
      var d = Number(a.minCropBoxWidth) || 0, c = Number(a.minCropBoxHeight) || 0, h = o ? Math.min(i.width, n.width, n.width + n.left, i.width - n.left) : i.width, p = o ? Math.min(i.height, n.height, n.height + n.top, i.height - n.top) : i.height;
      d = Math.min(d, i.width), c = Math.min(c, i.height), l && (d && c ? c * l > d ? c = d / l : d = c * l : d ? c = d / l : c && (d = c * l), p * l > h ? p = h / l : h = p * l), s.minWidth = Math.min(d, h), s.minHeight = Math.min(c, p), s.maxWidth = h, s.maxHeight = p;
    }
    r && (o ? (s.minLeft = Math.max(0, n.left), s.minTop = Math.max(0, n.top), s.maxLeft = Math.min(i.width, n.left + n.width) - s.width, s.maxTop = Math.min(i.height, n.top + n.height) - s.height) : (s.minLeft = 0, s.minTop = 0, s.maxLeft = i.width - s.width, s.maxTop = i.height - s.height));
  },
  renderCropBox: function() {
    var e = this.options, r = this.containerData, a = this.cropBoxData;
    (a.width > a.maxWidth || a.width < a.minWidth) && (a.left = a.oldLeft), (a.height > a.maxHeight || a.height < a.minHeight) && (a.top = a.oldTop), a.width = Math.min(Math.max(a.width, a.minWidth), a.maxWidth), a.height = Math.min(Math.max(a.height, a.minHeight), a.maxHeight), this.limitCropBox(!1, !0), a.left = Math.min(Math.max(a.left, a.minLeft), a.maxLeft), a.top = Math.min(Math.max(a.top, a.minTop), a.maxTop), a.oldLeft = a.left, a.oldTop = a.top, e.movable && e.cropBoxMovable && Ct(this.face, kt, a.width >= r.width && a.height >= r.height ? hi : Sr), we(this.cropBox, A({
      width: a.width,
      height: a.height
    }, ft({
      translateX: a.left,
      translateY: a.top
    }))), this.cropped && this.limited && this.limitCanvas(!0, !0), this.disabled || this.output();
  },
  output: function() {
    this.preview(), Ke(this.element, dr, this.getData());
  }
}, Ao = {
  initPreview: function() {
    var e = this.element, r = this.crossOrigin, a = this.options.preview, i = r ? this.crossOriginUrl : this.url, n = e.alt || "The image to preview", s = document.createElement("img");
    if (r && (s.crossOrigin = r), s.src = i, s.alt = n, this.viewBox.appendChild(s), this.viewBoxImage = s, !!a) {
      var o = a;
      typeof a == "string" ? o = e.ownerDocument.querySelectorAll(a) : a.querySelector && (o = [a]), this.previews = o, z(o, function(l) {
        var d = document.createElement("img");
        Ct(l, Rt, {
          width: l.offsetWidth,
          height: l.offsetHeight,
          html: l.innerHTML
        }), r && (d.crossOrigin = r), d.src = i, d.alt = n, d.style.cssText = 'display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;"', l.innerHTML = "", l.appendChild(d);
      });
    }
  },
  resetPreview: function() {
    z(this.previews, function(e) {
      var r = fr(e, Rt);
      we(e, {
        width: r.width,
        height: r.height
      }), e.innerHTML = r.html, yo(e, Rt);
    });
  },
  preview: function() {
    var e = this.imageData, r = this.canvasData, a = this.cropBoxData, i = a.width, n = a.height, s = e.width, o = e.height, l = a.left - r.left - e.left, d = a.top - r.top - e.top;
    !this.cropped || this.disabled || (we(this.viewBoxImage, A({
      width: s,
      height: o
    }, ft(A({
      translateX: -l,
      translateY: -d
    }, e)))), z(this.previews, function(c) {
      var h = fr(c, Rt), p = h.width, f = h.height, y = p, _ = f, b = 1;
      i && (b = p / i, _ = n * b), n && _ > f && (b = f / n, y = i * b, _ = f), we(c, {
        width: y,
        height: _
      }), we(c.getElementsByTagName("img")[0], A({
        width: s * b,
        height: o * b
      }, ft(A({
        translateX: -l * b,
        translateY: -d * b
      }, e))));
    }));
  }
}, Oo = {
  bind: function() {
    var e = this.element, r = this.options, a = this.cropper;
    G(r.cropstart) && J(e, pr, r.cropstart), G(r.cropmove) && J(e, ur, r.cropmove), G(r.cropend) && J(e, hr, r.cropend), G(r.crop) && J(e, dr, r.crop), G(r.zoom) && J(e, mr, r.zoom), J(a, Da, this.onCropStart = this.cropStart.bind(this)), r.zoomable && r.zoomOnWheel && J(a, Aa, this.onWheel = this.wheel.bind(this), {
      passive: !1,
      capture: !0
    }), r.toggleDragModeOnDblclick && J(a, Ca, this.onDblclick = this.dblclick.bind(this)), J(e.ownerDocument, Ma, this.onCropMove = this.cropMove.bind(this)), J(e.ownerDocument, Ea, this.onCropEnd = this.cropEnd.bind(this)), r.responsive && J(window, Ta, this.onResize = this.resize.bind(this));
  },
  unbind: function() {
    var e = this.element, r = this.options, a = this.cropper;
    G(r.cropstart) && re(e, pr, r.cropstart), G(r.cropmove) && re(e, ur, r.cropmove), G(r.cropend) && re(e, hr, r.cropend), G(r.crop) && re(e, dr, r.crop), G(r.zoom) && re(e, mr, r.zoom), re(a, Da, this.onCropStart), r.zoomable && r.zoomOnWheel && re(a, Aa, this.onWheel, {
      passive: !1,
      capture: !0
    }), r.toggleDragModeOnDblclick && re(a, Ca, this.onDblclick), re(e.ownerDocument, Ma, this.onCropMove), re(e.ownerDocument, Ea, this.onCropEnd), r.responsive && re(window, Ta, this.onResize);
  }
}, Po = {
  resize: function() {
    if (!this.disabled) {
      var e = this.options, r = this.container, a = this.containerData, i = r.offsetWidth / a.width, n = r.offsetHeight / a.height, s = Math.abs(i - 1) > Math.abs(n - 1) ? i : n;
      if (s !== 1) {
        var o, l;
        e.restore && (o = this.getCanvasData(), l = this.getCropBoxData()), this.render(), e.restore && (this.setCanvasData(z(o, function(d, c) {
          o[c] = d * s;
        })), this.setCropBoxData(z(l, function(d, c) {
          l[c] = d * s;
        })));
      }
    }
  },
  dblclick: function() {
    this.disabled || this.options.dragMode === mi || this.setDragMode(go(this.dragBox, lr) ? pi : Tr);
  },
  wheel: function(e) {
    var r = this, a = Number(this.options.wheelZoomRatio) || 0.1, i = 1;
    this.disabled || (e.preventDefault(), !this.wheeling && (this.wheeling = !0, setTimeout(function() {
      r.wheeling = !1;
    }, 50), e.deltaY ? i = e.deltaY > 0 ? 1 : -1 : e.wheelDelta ? i = -e.wheelDelta / 120 : e.detail && (i = e.detail > 0 ? 1 : -1), this.zoom(-i * a, e)));
  },
  cropStart: function(e) {
    var r = e.buttons, a = e.button;
    if (!(this.disabled || (e.type === "mousedown" || e.type === "pointerdown" && e.pointerType === "mouse") && // No primary button (Usually the left button)
    ($(r) && r !== 1 || $(a) && a !== 0 || e.ctrlKey))) {
      var i = this.options, n = this.pointers, s;
      e.changedTouches ? z(e.changedTouches, function(o) {
        n[o.identifier] = Nt(o);
      }) : n[e.pointerId || 0] = Nt(e), Object.keys(n).length > 1 && i.zoomable && i.zoomOnTouch ? s = ui : s = fr(e.target, kt), no.test(s) && Ke(this.element, pr, {
        originalEvent: e,
        action: s
      }) !== !1 && (e.preventDefault(), this.action = s, this.cropping = !1, s === di && (this.cropping = !0, H(this.dragBox, Ut)));
    }
  },
  cropMove: function(e) {
    var r = this.action;
    if (!(this.disabled || !r)) {
      var a = this.pointers;
      e.preventDefault(), Ke(this.element, ur, {
        originalEvent: e,
        action: r
      }) !== !1 && (e.changedTouches ? z(e.changedTouches, function(i) {
        A(a[i.identifier] || {}, Nt(i, !0));
      }) : A(a[e.pointerId || 0] || {}, Nt(e, !0)), this.change(e));
    }
  },
  cropEnd: function(e) {
    if (!this.disabled) {
      var r = this.action, a = this.pointers;
      e.changedTouches ? z(e.changedTouches, function(i) {
        delete a[i.identifier];
      }) : delete a[e.pointerId || 0], r && (e.preventDefault(), Object.keys(a).length || (this.action = ""), this.cropping && (this.cropping = !1, qe(this.dragBox, Ut, this.cropped && this.options.modal)), Ke(this.element, hr, {
        originalEvent: e,
        action: r
      }));
    }
  }
}, Io = {
  change: function(e) {
    var r = this.options, a = this.canvasData, i = this.containerData, n = this.cropBoxData, s = this.pointers, o = this.action, l = r.aspectRatio, d = n.left, c = n.top, h = n.width, p = n.height, f = d + h, y = c + p, _ = 0, b = 0, w = i.width, x = i.height, k = !0, Z;
    !l && e.shiftKey && (l = h && p ? h / p : 1), this.limited && (_ = n.minLeft, b = n.minTop, w = _ + Math.min(i.width, a.width, a.left + a.width), x = b + Math.min(i.height, a.height, a.top + a.height));
    var F = s[Object.keys(s)[0]], m = {
      x: F.endX - F.startX,
      y: F.endY - F.startY
    }, C = function(V) {
      switch (V) {
        case Te:
          f + m.x > w && (m.x = w - f);
          break;
        case Ae:
          d + m.x < _ && (m.x = _ - d);
          break;
        case be:
          c + m.y < b && (m.y = b - c);
          break;
        case Fe:
          y + m.y > x && (m.y = x - y);
          break;
      }
    };
    switch (o) {
      case Sr:
        d += m.x, c += m.y;
        break;
      case Te:
        if (m.x >= 0 && (f >= w || l && (c <= b || y >= x))) {
          k = !1;
          break;
        }
        C(Te), h += m.x, h < 0 && (o = Ae, h = -h, d -= h), l && (p = h / l, c += (n.height - p) / 2);
        break;
      case be:
        if (m.y <= 0 && (c <= b || l && (d <= _ || f >= w))) {
          k = !1;
          break;
        }
        C(be), p -= m.y, c += m.y, p < 0 && (o = Fe, p = -p, c -= p), l && (h = p * l, d += (n.width - h) / 2);
        break;
      case Ae:
        if (m.x <= 0 && (d <= _ || l && (c <= b || y >= x))) {
          k = !1;
          break;
        }
        C(Ae), h -= m.x, d += m.x, h < 0 && (o = Te, h = -h, d -= h), l && (p = h / l, c += (n.height - p) / 2);
        break;
      case Fe:
        if (m.y >= 0 && (y >= x || l && (d <= _ || f >= w))) {
          k = !1;
          break;
        }
        C(Fe), p += m.y, p < 0 && (o = be, p = -p, c -= p), l && (h = p * l, d += (n.width - h) / 2);
        break;
      case lt:
        if (l) {
          if (m.y <= 0 && (c <= b || f >= w)) {
            k = !1;
            break;
          }
          C(be), p -= m.y, c += m.y, h = p * l;
        } else
          C(be), C(Te), m.x >= 0 ? f < w ? h += m.x : m.y <= 0 && c <= b && (k = !1) : h += m.x, m.y <= 0 ? c > b && (p -= m.y, c += m.y) : (p -= m.y, c += m.y);
        h < 0 && p < 0 ? (o = ht, p = -p, h = -h, c -= p, d -= h) : h < 0 ? (o = ct, h = -h, d -= h) : p < 0 && (o = dt, p = -p, c -= p);
        break;
      case ct:
        if (l) {
          if (m.y <= 0 && (c <= b || d <= _)) {
            k = !1;
            break;
          }
          C(be), p -= m.y, c += m.y, h = p * l, d += n.width - h;
        } else
          C(be), C(Ae), m.x <= 0 ? d > _ ? (h -= m.x, d += m.x) : m.y <= 0 && c <= b && (k = !1) : (h -= m.x, d += m.x), m.y <= 0 ? c > b && (p -= m.y, c += m.y) : (p -= m.y, c += m.y);
        h < 0 && p < 0 ? (o = dt, p = -p, h = -h, c -= p, d -= h) : h < 0 ? (o = lt, h = -h, d -= h) : p < 0 && (o = ht, p = -p, c -= p);
        break;
      case ht:
        if (l) {
          if (m.x <= 0 && (d <= _ || y >= x)) {
            k = !1;
            break;
          }
          C(Ae), h -= m.x, d += m.x, p = h / l;
        } else
          C(Fe), C(Ae), m.x <= 0 ? d > _ ? (h -= m.x, d += m.x) : m.y >= 0 && y >= x && (k = !1) : (h -= m.x, d += m.x), m.y >= 0 ? y < x && (p += m.y) : p += m.y;
        h < 0 && p < 0 ? (o = lt, p = -p, h = -h, c -= p, d -= h) : h < 0 ? (o = dt, h = -h, d -= h) : p < 0 && (o = ct, p = -p, c -= p);
        break;
      case dt:
        if (l) {
          if (m.x >= 0 && (f >= w || y >= x)) {
            k = !1;
            break;
          }
          C(Te), h += m.x, p = h / l;
        } else
          C(Fe), C(Te), m.x >= 0 ? f < w ? h += m.x : m.y >= 0 && y >= x && (k = !1) : h += m.x, m.y >= 0 ? y < x && (p += m.y) : p += m.y;
        h < 0 && p < 0 ? (o = ct, p = -p, h = -h, c -= p, d -= h) : h < 0 ? (o = ht, h = -h, d -= h) : p < 0 && (o = lt, p = -p, c -= p);
        break;
      case hi:
        this.move(m.x, m.y), k = !1;
        break;
      case ui:
        this.zoom(_o(s), e), k = !1;
        break;
      case di:
        if (!m.x || !m.y) {
          k = !1;
          break;
        }
        Z = _i(this.cropper), d = F.startX - Z.left, c = F.startY - Z.top, h = n.minWidth, p = n.minHeight, m.x > 0 ? o = m.y > 0 ? dt : lt : m.x < 0 && (d -= h, o = m.y > 0 ? ht : ct), m.y < 0 && (c -= p), this.cropped || (ce(this.cropBox, Q), this.cropped = !0, this.limited && this.limitCropBox(!0, !0));
        break;
    }
    k && (n.width = h, n.height = p, n.left = d, n.top = c, this.action = o, this.renderCropBox()), z(s, function(S) {
      S.startX = S.endX, S.startY = S.endY;
    });
  }
}, Ro = {
  // Show the crop box manually
  crop: function() {
    return this.ready && !this.cropped && !this.disabled && (this.cropped = !0, this.limitCropBox(!0, !0), this.options.modal && H(this.dragBox, Ut), ce(this.cropBox, Q), this.setCropBoxData(this.initialCropBoxData)), this;
  },
  // Reset the image and crop box to their initial states
  reset: function() {
    return this.ready && !this.disabled && (this.imageData = A({}, this.initialImageData), this.canvasData = A({}, this.initialCanvasData), this.cropBoxData = A({}, this.initialCropBoxData), this.renderCanvas(), this.cropped && this.renderCropBox()), this;
  },
  // Clear the crop box
  clear: function() {
    return this.cropped && !this.disabled && (A(this.cropBoxData, {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    }), this.cropped = !1, this.renderCropBox(), this.limitCanvas(!0, !0), this.renderCanvas(), ce(this.dragBox, Ut), H(this.cropBox, Q)), this;
  },
  /**
   * Replace the image's src and rebuild the cropper
   * @param {string} url - The new URL.
   * @param {boolean} [hasSameSize] - Indicate if the new image has the same size as the old one.
   * @returns {Cropper} this
   */
  replace: function(e) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    return !this.disabled && e && (this.isImg && (this.element.src = e), r ? (this.url = e, this.image.src = e, this.ready && (this.viewBoxImage.src = e, z(this.previews, function(a) {
      a.getElementsByTagName("img")[0].src = e;
    }))) : (this.isImg && (this.replaced = !0), this.options.data = null, this.uncreate(), this.load(e))), this;
  },
  // Enable (unfreeze) the cropper
  enable: function() {
    return this.ready && this.disabled && (this.disabled = !1, ce(this.cropper, $a)), this;
  },
  // Disable (freeze) the cropper
  disable: function() {
    return this.ready && !this.disabled && (this.disabled = !0, H(this.cropper, $a)), this;
  },
  /**
   * Destroy the cropper and remove the instance from the image
   * @returns {Cropper} this
   */
  destroy: function() {
    var e = this.element;
    return e[T] ? (e[T] = void 0, this.isImg && this.replaced && (e.src = this.originalUrl), this.uncreate(), this) : this;
  },
  /**
   * Move the canvas with relative offsets
   * @param {number} offsetX - The relative offset distance on the x-axis.
   * @param {number} [offsetY=offsetX] - The relative offset distance on the y-axis.
   * @returns {Cropper} this
   */
  move: function(e) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, a = this.canvasData, i = a.left, n = a.top;
    return this.moveTo(ar(e) ? e : i + Number(e), ar(r) ? r : n + Number(r));
  },
  /**
   * Move the canvas to an absolute point
   * @param {number} x - The x-axis coordinate.
   * @param {number} [y=x] - The y-axis coordinate.
   * @returns {Cropper} this
   */
  moveTo: function(e) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, a = this.canvasData, i = !1;
    return e = Number(e), r = Number(r), this.ready && !this.disabled && this.options.movable && ($(e) && (a.left = e, i = !0), $(r) && (a.top = r, i = !0), i && this.renderCanvas(!0)), this;
  },
  /**
   * Zoom the canvas with a relative ratio
   * @param {number} ratio - The target ratio.
   * @param {Event} _originalEvent - The original event if any.
   * @returns {Cropper} this
   */
  zoom: function(e, r) {
    var a = this.canvasData;
    return e = Number(e), e < 0 ? e = 1 / (1 - e) : e = 1 + e, this.zoomTo(a.width * e / a.naturalWidth, null, r);
  },
  /**
   * Zoom the canvas to an absolute ratio
   * @param {number} ratio - The target ratio.
   * @param {Object} pivot - The zoom pivot point coordinate.
   * @param {Event} _originalEvent - The original event if any.
   * @returns {Cropper} this
   */
  zoomTo: function(e, r, a) {
    var i = this.options, n = this.canvasData, s = n.width, o = n.height, l = n.naturalWidth, d = n.naturalHeight;
    if (e = Number(e), e >= 0 && this.ready && !this.disabled && i.zoomable) {
      var c = l * e, h = d * e;
      if (Ke(this.element, mr, {
        ratio: e,
        oldRatio: s / l,
        originalEvent: a
      }) === !1)
        return this;
      if (a) {
        var p = this.pointers, f = _i(this.cropper), y = p && Object.keys(p).length ? wo(p) : {
          pageX: a.pageX,
          pageY: a.pageY
        };
        n.left -= (c - s) * ((y.pageX - f.left - n.left) / s), n.top -= (h - o) * ((y.pageY - f.top - n.top) / o);
      } else Xe(r) && $(r.x) && $(r.y) ? (n.left -= (c - s) * ((r.x - n.left) / s), n.top -= (h - o) * ((r.y - n.top) / o)) : (n.left -= (c - s) / 2, n.top -= (h - o) / 2);
      n.width = c, n.height = h, this.renderCanvas(!0);
    }
    return this;
  },
  /**
   * Rotate the canvas with a relative degree
   * @param {number} degree - The rotate degree.
   * @returns {Cropper} this
   */
  rotate: function(e) {
    return this.rotateTo((this.imageData.rotate || 0) + Number(e));
  },
  /**
   * Rotate the canvas to an absolute degree
   * @param {number} degree - The rotate degree.
   * @returns {Cropper} this
   */
  rotateTo: function(e) {
    return e = Number(e), $(e) && this.ready && !this.disabled && this.options.rotatable && (this.imageData.rotate = e % 360, this.renderCanvas(!0, !0)), this;
  },
  /**
   * Scale the image on the x-axis.
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @returns {Cropper} this
   */
  scaleX: function(e) {
    var r = this.imageData.scaleY;
    return this.scale(e, $(r) ? r : 1);
  },
  /**
   * Scale the image on the y-axis.
   * @param {number} scaleY - The scale ratio on the y-axis.
   * @returns {Cropper} this
   */
  scaleY: function(e) {
    var r = this.imageData.scaleX;
    return this.scale($(r) ? r : 1, e);
  },
  /**
   * Scale the image
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
   * @returns {Cropper} this
   */
  scale: function(e) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, a = this.imageData, i = !1;
    return e = Number(e), r = Number(r), this.ready && !this.disabled && this.options.scalable && ($(e) && (a.scaleX = e, i = !0), $(r) && (a.scaleY = r, i = !0), i && this.renderCanvas(!0, !0)), this;
  },
  /**
   * Get the cropped area position and size data (base on the original image)
   * @param {boolean} [rounded=false] - Indicate if round the data values or not.
   * @returns {Object} The result cropped data.
   */
  getData: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1, r = this.options, a = this.imageData, i = this.canvasData, n = this.cropBoxData, s;
    if (this.ready && this.cropped) {
      s = {
        x: n.left - i.left,
        y: n.top - i.top,
        width: n.width,
        height: n.height
      };
      var o = a.width / a.naturalWidth;
      if (z(s, function(c, h) {
        s[h] = c / o;
      }), e) {
        var l = Math.round(s.y + s.height), d = Math.round(s.x + s.width);
        s.x = Math.round(s.x), s.y = Math.round(s.y), s.width = d - s.x, s.height = l - s.y;
      }
    } else
      s = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    return r.rotatable && (s.rotate = a.rotate || 0), r.scalable && (s.scaleX = a.scaleX || 1, s.scaleY = a.scaleY || 1), s;
  },
  /**
   * Set the cropped area position and size with new data
   * @param {Object} data - The new data.
   * @returns {Cropper} this
   */
  setData: function(e) {
    var r = this.options, a = this.imageData, i = this.canvasData, n = {};
    if (this.ready && !this.disabled && Xe(e)) {
      var s = !1;
      r.rotatable && $(e.rotate) && e.rotate !== a.rotate && (a.rotate = e.rotate, s = !0), r.scalable && ($(e.scaleX) && e.scaleX !== a.scaleX && (a.scaleX = e.scaleX, s = !0), $(e.scaleY) && e.scaleY !== a.scaleY && (a.scaleY = e.scaleY, s = !0)), s && this.renderCanvas(!0, !0);
      var o = a.width / a.naturalWidth;
      $(e.x) && (n.left = e.x * o + i.left), $(e.y) && (n.top = e.y * o + i.top), $(e.width) && (n.width = e.width * o), $(e.height) && (n.height = e.height * o), this.setCropBoxData(n);
    }
    return this;
  },
  /**
   * Get the container size data.
   * @returns {Object} The result container data.
   */
  getContainerData: function() {
    return this.ready ? A({}, this.containerData) : {};
  },
  /**
   * Get the image position and size data.
   * @returns {Object} The result image data.
   */
  getImageData: function() {
    return this.sized ? A({}, this.imageData) : {};
  },
  /**
   * Get the canvas position and size data.
   * @returns {Object} The result canvas data.
   */
  getCanvasData: function() {
    var e = this.canvasData, r = {};
    return this.ready && z(["left", "top", "width", "height", "naturalWidth", "naturalHeight"], function(a) {
      r[a] = e[a];
    }), r;
  },
  /**
   * Set the canvas position and size with new data.
   * @param {Object} data - The new canvas data.
   * @returns {Cropper} this
   */
  setCanvasData: function(e) {
    var r = this.canvasData, a = r.aspectRatio;
    return this.ready && !this.disabled && Xe(e) && ($(e.left) && (r.left = e.left), $(e.top) && (r.top = e.top), $(e.width) ? (r.width = e.width, r.height = e.width / a) : $(e.height) && (r.height = e.height, r.width = e.height * a), this.renderCanvas(!0)), this;
  },
  /**
   * Get the crop box position and size data.
   * @returns {Object} The result crop box data.
   */
  getCropBoxData: function() {
    var e = this.cropBoxData, r;
    return this.ready && this.cropped && (r = {
      left: e.left,
      top: e.top,
      width: e.width,
      height: e.height
    }), r || {};
  },
  /**
   * Set the crop box position and size with new data.
   * @param {Object} data - The new crop box data.
   * @returns {Cropper} this
   */
  setCropBoxData: function(e) {
    var r = this.cropBoxData, a = this.options.aspectRatio, i, n;
    return this.ready && this.cropped && !this.disabled && Xe(e) && ($(e.left) && (r.left = e.left), $(e.top) && (r.top = e.top), $(e.width) && e.width !== r.width && (i = !0, r.width = e.width), $(e.height) && e.height !== r.height && (n = !0, r.height = e.height), a && (i ? r.height = r.width / a : n && (r.width = r.height * a)), this.renderCropBox()), this;
  },
  /**
   * Get a canvas drawn the cropped image.
   * @param {Object} [options={}] - The config options.
   * @returns {HTMLCanvasElement} - The result canvas.
   */
  getCroppedCanvas: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!this.ready || !window.HTMLCanvasElement)
      return null;
    var r = this.canvasData, a = $o(this.image, this.imageData, r, e);
    if (!this.cropped)
      return a;
    var i = this.getData(e.rounded), n = i.x, s = i.y, o = i.width, l = i.height, d = a.width / Math.floor(r.naturalWidth);
    d !== 1 && (n *= d, s *= d, o *= d, l *= d);
    var c = o / l, h = xe({
      aspectRatio: c,
      width: e.maxWidth || 1 / 0,
      height: e.maxHeight || 1 / 0
    }), p = xe({
      aspectRatio: c,
      width: e.minWidth || 0,
      height: e.minHeight || 0
    }, "cover"), f = xe({
      aspectRatio: c,
      width: e.width || (d !== 1 ? a.width : o),
      height: e.height || (d !== 1 ? a.height : l)
    }), y = f.width, _ = f.height;
    y = Math.min(h.width, Math.max(p.width, y)), _ = Math.min(h.height, Math.max(p.height, _));
    var b = document.createElement("canvas"), w = b.getContext("2d");
    b.width = Ge(y), b.height = Ge(_), w.fillStyle = e.fillColor || "transparent", w.fillRect(0, 0, y, _);
    var x = e.imageSmoothingEnabled, k = x === void 0 ? !0 : x, Z = e.imageSmoothingQuality;
    w.imageSmoothingEnabled = k, Z && (w.imageSmoothingQuality = Z);
    var F = a.width, m = a.height, C = n, S = s, V, X, se, Me, ye, oe;
    C <= -o || C > F ? (C = 0, V = 0, se = 0, ye = 0) : C <= 0 ? (se = -C, C = 0, V = Math.min(F, o + C), ye = V) : C <= F && (se = 0, V = Math.min(o, F - C), ye = V), V <= 0 || S <= -l || S > m ? (S = 0, X = 0, Me = 0, oe = 0) : S <= 0 ? (Me = -S, S = 0, X = Math.min(m, l + S), oe = X) : S <= m && (Me = 0, X = Math.min(l, m - S), oe = X);
    var q = [C, S, V, X];
    if (ye > 0 && oe > 0) {
      var Ee = y / o;
      q.push(se * Ee, Me * Ee, ye * Ee, oe * Ee);
    }
    return w.drawImage.apply(w, [a].concat(ci(q.map(function(At) {
      return Math.floor(Ge(At));
    })))), b;
  },
  /**
   * Change the aspect ratio of the crop box.
   * @param {number} aspectRatio - The new aspect ratio.
   * @returns {Cropper} this
   */
  setAspectRatio: function(e) {
    var r = this.options;
    return !this.disabled && !ar(e) && (r.aspectRatio = Math.max(0, e) || NaN, this.ready && (this.initCropBox(), this.cropped && this.renderCropBox())), this;
  },
  /**
   * Change the drag mode.
   * @param {string} mode - The new drag mode.
   * @returns {Cropper} this
   */
  setDragMode: function(e) {
    var r = this.options, a = this.dragBox, i = this.face;
    if (this.ready && !this.disabled) {
      var n = e === Tr, s = r.movable && e === pi;
      e = n || s ? e : mi, r.dragMode = e, Ct(a, kt, e), qe(a, lr, n), qe(a, cr, s), r.cropBoxMovable || (Ct(i, kt, e), qe(i, lr, n), qe(i, cr, s));
    }
    return this;
  }
}, No = he.Cropper, xi = /* @__PURE__ */ function() {
  function t(e) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (qs(this, t), !e || !lo.test(e.tagName))
      throw new Error("The first argument is required and must be an <img> or <canvas> element.");
    this.element = e, this.options = A({}, Pa, Xe(r) && r), this.cropped = !1, this.disabled = !1, this.pointers = {}, this.ready = !1, this.reloading = !1, this.replaced = !1, this.sized = !1, this.sizing = !1, this.init();
  }
  return Gs(t, [{
    key: "init",
    value: function() {
      var r = this.element, a = r.tagName.toLowerCase(), i;
      if (!r[T]) {
        if (r[T] = this, a === "img") {
          if (this.isImg = !0, i = r.getAttribute("src") || "", this.originalUrl = i, !i)
            return;
          i = r.src;
        } else a === "canvas" && window.HTMLCanvasElement && (i = r.toDataURL());
        this.load(i);
      }
    }
  }, {
    key: "load",
    value: function(r) {
      var a = this;
      if (r) {
        this.url = r, this.imageData = {};
        var i = this.element, n = this.options;
        if (!n.rotatable && !n.scalable && (n.checkOrientation = !1), !n.checkOrientation || !window.ArrayBuffer) {
          this.clone();
          return;
        }
        if (so.test(r)) {
          oo.test(r) ? this.read(Do(r)) : this.clone();
          return;
        }
        var s = new XMLHttpRequest(), o = this.clone.bind(this);
        this.reloading = !0, this.xhr = s, s.onabort = o, s.onerror = o, s.ontimeout = o, s.onprogress = function() {
          s.getResponseHeader("content-type") !== Oa && s.abort();
        }, s.onload = function() {
          a.read(s.response);
        }, s.onloadend = function() {
          a.reloading = !1, a.xhr = null;
        }, n.checkCrossOrigin && Ra(r) && i.crossOrigin && (r = Na(r)), s.open("GET", r, !0), s.responseType = "arraybuffer", s.withCredentials = i.crossOrigin === "use-credentials", s.send();
      }
    }
  }, {
    key: "read",
    value: function(r) {
      var a = this.options, i = this.imageData, n = Eo(r), s = 0, o = 1, l = 1;
      if (n > 1) {
        this.url = Mo(r, Oa);
        var d = So(n);
        s = d.rotate, o = d.scaleX, l = d.scaleY;
      }
      a.rotatable && (i.rotate = s), a.scalable && (i.scaleX = o, i.scaleY = l), this.clone();
    }
  }, {
    key: "clone",
    value: function() {
      var r = this.element, a = this.url, i = r.crossOrigin, n = a;
      this.options.checkCrossOrigin && Ra(a) && (i || (i = "anonymous"), n = Na(a)), this.crossOrigin = i, this.crossOriginUrl = n;
      var s = document.createElement("img");
      i && (s.crossOrigin = i), s.src = n || a, s.alt = r.alt || "The image to crop", this.image = s, s.onload = this.start.bind(this), s.onerror = this.stop.bind(this), H(s, ka), r.parentNode.insertBefore(s, r.nextSibling);
    }
  }, {
    key: "start",
    value: function() {
      var r = this, a = this.image;
      a.onload = null, a.onerror = null, this.sizing = !0;
      var i = he.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(he.navigator.userAgent), n = function(d, c) {
        A(r.imageData, {
          naturalWidth: d,
          naturalHeight: c,
          aspectRatio: d / c
        }), r.initialImageData = A({}, r.imageData), r.sizing = !1, r.sized = !0, r.build();
      };
      if (a.naturalWidth && !i) {
        n(a.naturalWidth, a.naturalHeight);
        return;
      }
      var s = document.createElement("img"), o = document.body || document.documentElement;
      this.sizingImage = s, s.onload = function() {
        n(s.width, s.height), i || o.removeChild(s);
      }, s.src = a.src, i || (s.style.cssText = "left:0;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:0;position:absolute;top:0;z-index:-1;", o.appendChild(s));
    }
  }, {
    key: "stop",
    value: function() {
      var r = this.image;
      r.onload = null, r.onerror = null, r.parentNode.removeChild(r), this.image = null;
    }
  }, {
    key: "build",
    value: function() {
      if (!(!this.sized || this.ready)) {
        var r = this.element, a = this.options, i = this.image, n = r.parentNode, s = document.createElement("div");
        s.innerHTML = co;
        var o = s.querySelector(".".concat(T, "-container")), l = o.querySelector(".".concat(T, "-canvas")), d = o.querySelector(".".concat(T, "-drag-box")), c = o.querySelector(".".concat(T, "-crop-box")), h = c.querySelector(".".concat(T, "-face"));
        this.container = n, this.cropper = o, this.canvas = l, this.dragBox = d, this.cropBox = c, this.viewBox = o.querySelector(".".concat(T, "-view-box")), this.face = h, l.appendChild(i), H(r, Q), n.insertBefore(o, r.nextSibling), ce(i, ka), this.initPreview(), this.bind(), a.initialAspectRatio = Math.max(0, a.initialAspectRatio) || NaN, a.aspectRatio = Math.max(0, a.aspectRatio) || NaN, a.viewMode = Math.max(0, Math.min(3, Math.round(a.viewMode))) || 0, H(c, Q), a.guides || H(c.getElementsByClassName("".concat(T, "-dashed")), Q), a.center || H(c.getElementsByClassName("".concat(T, "-center")), Q), a.background && H(o, "".concat(T, "-bg")), a.highlight || H(h, to), a.cropBoxMovable && (H(h, cr), Ct(h, kt, Sr)), a.cropBoxResizable || (H(c.getElementsByClassName("".concat(T, "-line")), Q), H(c.getElementsByClassName("".concat(T, "-point")), Q)), this.render(), this.ready = !0, this.setDragMode(a.dragMode), a.autoCrop && this.crop(), this.setData(a.data), G(a.ready) && J(r, Sa, a.ready, {
          once: !0
        }), Ke(r, Sa);
      }
    }
  }, {
    key: "unbuild",
    value: function() {
      if (this.ready) {
        this.ready = !1, this.unbind(), this.resetPreview();
        var r = this.cropper.parentNode;
        r && r.removeChild(this.cropper), ce(this.element, Q);
      }
    }
  }, {
    key: "uncreate",
    value: function() {
      this.ready ? (this.unbuild(), this.ready = !1, this.cropped = !1) : this.sizing ? (this.sizingImage.onload = null, this.sizing = !1, this.sized = !1) : this.reloading ? (this.xhr.onabort = null, this.xhr.abort()) : this.image && this.stop();
    }
    /**
     * Get the no conflict cropper class.
     * @returns {Cropper} The cropper class.
     */
  }], [{
    key: "noConflict",
    value: function() {
      return window.Cropper = No, t;
    }
    /**
     * Change the default options.
     * @param {Object} options - The new default options.
     */
  }, {
    key: "setDefaults",
    value: function(r) {
      A(Pa, Xe(r) && r);
    }
  }]);
}();
A(xi.prototype, To, Ao, Oo, Po, Io, Ro);
const zo = `
.cropper-container {
  direction: ltr;
  font-size: 0;
  line-height: 0;
  position: relative;
  -ms-touch-action: none;
      touch-action: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
.cropper-container img {
  backface-visibility: hidden;
  display: block;
  height: 100%;
  image-orientation: 0deg;
  max-height: none !important;
  max-width: none !important;
  min-height: 0 !important;
  min-width: 0 !important;
  width: 100%;
}
.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.cropper-wrap-box,
.cropper-canvas {
  overflow: hidden;
}
.cropper-drag-box {
  background-color: #fff;
  opacity: 0;
}
.cropper-modal {
  background-color: #000;
  opacity: 0.5;
}
.cropper-view-box {
  display: block;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
  overflow: hidden;
  width: 100%;
}
.cropper-dashed {
  border: 0 dashed #eee;
  display: block;
  opacity: 0.5;
  position: absolute;
}
.cropper-dashed.dashed-h {
  border-bottom-width: 1px;
  border-top-width: 1px;
  height: calc(100% / 3);
  left: 0;
  top: calc(100% / 3);
  width: 100%;
}
.cropper-dashed.dashed-v {
  border-left-width: 1px;
  border-right-width: 1px;
  height: 100%;
  left: calc(100% / 3);
  top: 0;
  width: calc(100% / 3);
}
.cropper-center {
  display: block;
  height: 0;
  left: 50%;
  opacity: 0.75;
  position: absolute;
  top: 50%;
  width: 0;
}
.cropper-center::before,
.cropper-center::after {
  background-color: #eee;
  content: ' ';
  display: block;
  position: absolute;
}
.cropper-center::before {
  height: 1px;
  left: -3px;
  top: 0;
  width: 7px;
}
.cropper-center::after {
  height: 7px;
  left: 0;
  top: -3px;
  width: 1px;
}
.cropper-face,
.cropper-line,
.cropper-point {
  display: block;
  height: 100%;
  opacity: 0.1;
  position: absolute;
  width: 100%;
}
.cropper-face {
  background-color: #fff;
  left: 0;
  top: 0;
}
.cropper-line {
  background-color: #39f;
}
.cropper-line.line-e {
  cursor: ew-resize;
  right: -3px;
  top: 0;
  width: 5px;
}
.cropper-line.line-n {
  cursor: ns-resize;
  height: 5px;
  left: 0;
  top: -3px;
}
.cropper-line.line-w {
  cursor: ew-resize;
  left: -3px;
  top: 0;
  width: 5px;
}
.cropper-line.line-s {
  bottom: -3px;
  cursor: ns-resize;
  height: 5px;
  left: 0;
}
.cropper-point {
  background-color: #39f;
  height: 5px;
  opacity: 0.75;
  width: 5px;
}
.cropper-point.point-e {
  cursor: ew-resize;
  margin-top: -3px;
  right: -3px;
  top: 50%;
}
.cropper-point.point-n {
  cursor: ns-resize;
  left: 50%;
  margin-left: -3px;
  top: -3px;
}
.cropper-point.point-w {
  cursor: ew-resize;
  left: -3px;
  margin-top: -3px;
  top: 50%;
}
.cropper-point.point-s {
  bottom: -3px;
  cursor: s-resize;
  left: 50%;
  margin-left: -3px;
}
.cropper-point.point-ne {
  cursor: nesw-resize;
  right: -3px;
  top: -3px;
}
.cropper-point.point-nw {
  cursor: nwse-resize;
  left: -3px;
  top: -3px;
}
.cropper-point.point-sw {
  bottom: -3px;
  cursor: nesw-resize;
  left: -3px;
}
.cropper-point.point-se {
  bottom: -3px;
  cursor: nwse-resize;
  height: 20px;
  opacity: 1;
  right: -3px;
  width: 20px;
}
@media (min-width: 768px) {
  .cropper-point.point-se {
    height: 15px;
    width: 15px;
  }
}
@media (min-width: 992px) {
  .cropper-point.point-se {
    height: 10px;
    width: 10px;
  }
}
@media (min-width: 1200px) {
  .cropper-point.point-se {
    height: 5px;
    opacity: 0.75;
    width: 5px;
  }
}
.cropper-point.point-se::before {
  background-color: #39f;
  bottom: -50%;
  content: ' ';
  display: block;
  height: 200%;
  opacity: 0;
  position: absolute;
  right: -50%;
  width: 200%;
}
.cropper-invisible {
  opacity: 0;
}
.cropper-bg {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
}
.cropper-hide {
  display: block;
  height: 0;
  position: absolute;
  width: 0;
}
.cropper-hidden {
  display: none !important;
}
.cropper-move {
  cursor: move;
}
.cropper-crop {
  cursor: crosshair;
}
.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
`;
var Lo = Object.defineProperty, Ho = Object.getOwnPropertyDescriptor, pe = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? Ho(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Lo(e, r, i), i;
};
const Bo = 2 * 1024 * 1024, jo = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp"]), za = 512, Uo = [
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
let te = class extends D {
  constructor() {
    super(...arguments), this._mode = "emoji", this._selectedEmoji = null, this._sourceUrl = null, this._error = null, this._submitting = !1, this._cropper = null;
  }
  _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }
  _selectEmoji(t) {
    this._selectedEmoji = t, this._error = null;
  }
  _onFileChange(t) {
    var a;
    const e = t.target, r = (a = e.files) == null ? void 0 : a[0];
    if (e.value = "", !!r) {
      if (!jo.has(r.type)) {
        this._error = "Only PNG, JPEG, and WebP images are accepted.";
        return;
      }
      if (r.size > Bo) {
        this._error = "Image must be 2 MB or smaller.";
        return;
      }
      this._error = null, this._setSource(URL.createObjectURL(r));
    }
  }
  _setSource(t) {
    this._cropper && (this._cropper.destroy(), this._cropper = null), this._sourceUrl && URL.revokeObjectURL(this._sourceUrl), this._sourceUrl = t;
  }
  _onCropImageLoad() {
    const t = this._cropImage;
    t && (this._cropper && this._cropper.destroy(), this._cropper = new xi(t, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: "move",
      autoCropArea: 0.9,
      background: !1,
      cropBoxResizable: !0,
      cropBoxMovable: !0,
      toggleDragModeOnDblclick: !1,
      guides: !1,
      center: !1
    }));
  }
  _clearPickedImage() {
    this._setSource(null), this._error = null;
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
          await Hs(this.hass, this.memberSlug, this._selectedEmoji), this.dispatchEvent(
            new CustomEvent("avatar-changed", { detail: { avatar: this._selectedEmoji } })
          ), this._close();
        } catch (t) {
          this._error = t instanceof Error ? t.message : String(t);
        } finally {
          this._submitting = !1;
        }
        return;
      }
      if (!this._sourceUrl || !this._cropper) {
        this._error = "Pick an image first.";
        return;
      }
      this._submitting = !0;
      try {
        const t = await this._getCroppedFile();
        await Ls(this.hass, this.memberSlug, t), this.dispatchEvent(new CustomEvent("avatar-changed")), this._close();
      } catch (t) {
        this._error = t instanceof Error ? t.message : String(t);
      } finally {
        this._submitting = !1;
      }
    }
  }
  _getCroppedFile() {
    return new Promise((t, e) => {
      if (!this._cropper) {
        e(new Error("Cropper not initialized"));
        return;
      }
      const r = this._cropper.getCroppedCanvas({
        width: za,
        height: za,
        imageSmoothingQuality: "high"
      });
      if (!r) {
        e(new Error("Failed to crop image"));
        return;
      }
      r.toBlob(
        (a) => {
          if (!a) {
            e(new Error("Failed to encode cropped image"));
            return;
          }
          t(new File([a], "avatar.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.9
      );
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._setSource(null);
  }
  render() {
    return u`
      <div class="backdrop" @click=${(t) => {
      t.target === t.currentTarget && this._close();
    }}>
        <div class="modal" @click=${(t) => t.stopPropagation()}>
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

          ${this._error ? u`<div class="error-msg">${this._error}</div>` : ""}

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
    return u`
      <div class="emoji-grid">
        ${Uo.map(
      (t) => u`
            <button
              class="emoji-btn ${this._selectedEmoji === t ? "selected" : ""}"
              @click=${() => this._selectEmoji(t)}
              title=${t}
            >${t}</button>
          `
    )}
      </div>
    `;
  }
  _renderUploadMode() {
    return this._sourceUrl ? u`
        <div class="upload-area">
          <div class="crop-stage">
            <img
              id="crop-image"
              src=${this._sourceUrl}
              alt="Crop preview"
              @load=${this._onCropImageLoad}
            />
          </div>
          <div class="crop-actions">
            <button class="link-btn" @click=${this._clearPickedImage}>Choose different image</button>
            <span class="crop-hint">Drag to position · drag corners to resize</span>
          </div>
        </div>
      ` : u`
      <div class="upload-area">
        <div class="picker">
          <button type="button" class="picker-button" @click=${this._openFilePicker}>Add picture</button>
          <span>Click the button above to choose an image.</span>
          <span>Supports PNG, JPEG, or WebP (max 2 MB).</span>
        </div>
        <input
          type="file"
          id="avatar-file-input"
          accept="image/png,image/jpeg,image/webp"
          @change=${this._onFileChange}
        />
      </div>
    `;
  }
  _openFilePicker() {
    const t = this.renderRoot.querySelector("#avatar-file-input");
    t == null || t.click();
  }
};
te.styles = [
  N,
  Ba(zo),
  M`
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
        width: min(420px, 92vw);
        max-height: 90vh;
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
      .picker {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        padding: var(--lucarne-spacing-lg);
        border: 2px dashed rgba(0,0,0,0.18);
        border-radius: var(--lucarne-radius-md);
        text-align: center;
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
      }
      .picker-button {
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-lg);
        border-radius: 999px;
        border: 1px solid var(--primary-color);
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
        color: var(--primary-color);
        font-weight: 600;
        cursor: pointer;
      }
      input[type='file'] {
        display: none;
      }
      .crop-stage {
        position: relative;
        width: 100%;
        /* cropperjs needs a fixed-size container so it can compute layout. */
        height: 320px;
        background: #000;
        border-radius: var(--lucarne-radius-md);
        overflow: hidden;
      }
      .crop-stage img {
        display: block;
        max-width: 100%;
      }
      /* Round preview overlay so the user sees how the avatar will look. */
      .crop-stage .cropper-view-box,
      .crop-stage .cropper-face {
        border-radius: 50%;
      }
      .crop-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
      }
      .crop-hint {
        font-size: var(--lucarne-fs-xs);
        color: var(--lucarne-on-surface-muted);
      }
      .link-btn {
        background: none;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        padding: 0;
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
pe([
  g({ attribute: !1 })
], te.prototype, "hass", 2);
pe([
  g()
], te.prototype, "memberSlug", 2);
pe([
  g()
], te.prototype, "memberName", 2);
pe([
  v()
], te.prototype, "_mode", 2);
pe([
  v()
], te.prototype, "_selectedEmoji", 2);
pe([
  v()
], te.prototype, "_sourceUrl", 2);
pe([
  v()
], te.prototype, "_error", 2);
pe([
  v()
], te.prototype, "_submitting", 2);
pe([
  _r("#crop-image")
], te.prototype, "_cropImage", 2);
te = pe([
  E("lucarne-avatar-upload-modal")
], te);
var Fo = Object.defineProperty, Wo = Object.getOwnPropertyDescriptor, Tt = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? Wo(e, r) : e, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (i = (a ? s(e, r, i) : s(i)) || i);
  return a && i && Fo(e, r, i), i;
};
let Be = class extends D {
  constructor() {
    super(...arguments), this._familyState = null, this._avatarModalMember = null;
  }
  setConfig(t) {
    this._config = t;
  }
  connectedCallback() {
    super.connectedCallback(), this.hass && !this._unsubFamily && (this._unsubFamily = bt(this.hass, (t) => {
      this._familyState = t;
    }));
  }
  updated(t) {
    super.updated(t), t.has("hass") && this.hass && !this._unsubFamily && (this._unsubFamily = bt(this.hass, (e) => {
      this._familyState = e;
    }));
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._unsubFamily) == null || t.call(this), this._unsubFamily = void 0;
  }
  _fire(t) {
    const e = { ...t };
    delete e.kids, Array.isArray(e.members) || (e.members = []), kr(this, "config-changed", { config: e });
  }
  /**
   * Resolve the editor's unified members list from config + family state.
   *
   * `members` is the full display order (visible AND hidden); a member not yet
   * placed is appended (in family order) and treated as hidden-by-default. The
   * card renders `members` minus `hidden`, so a hidden member keeps its slot.
   */
  _membersModel() {
    var o, l, d;
    const t = [...((o = this._familyState) == null ? void 0 : o.members) ?? [], mt], e = new Map(t.map((c) => [c.slug, c])), r = ((l = this._config) == null ? void 0 : l.members) ?? [], a = new Set(r), i = [
      ...r.filter((c) => e.has(c)),
      ...t.filter((c) => !a.has(c.slug)).map((c) => c.slug)
    ], n = new Set(((d = this._config) == null ? void 0 : d.hidden_members) ?? []), s = /* @__PURE__ */ new Set();
    for (const c of i)
      (n.has(c) || !a.has(c)) && s.add(c);
    return { ordered: i.map((c) => e.get(c)), hidden: s };
  }
  /** Persist the full order + hidden set (omitting hidden_members when empty). */
  _commitMembers(t, e) {
    const r = { ...this._config };
    r.members = t, e.size ? r.hidden_members = [...e] : delete r.hidden_members, this._fire(r);
  }
  _titleChanged(t) {
    const e = t.target.value;
    this._fire({ ...this._config, title: e || void 0 });
  }
  _toggleVisibility(t) {
    const { ordered: e, hidden: r } = this._membersModel(), a = new Set(r);
    a.has(t) ? a.delete(t) : a.add(t), this._commitMembers(e.map((i) => i.slug), a);
  }
  // Reorder never changes a member's hidden state, so a hidden member can be
  // dragged into any slot and still stay off the card.
  _onMembersReorder(t) {
    const { hidden: e } = this._membersModel();
    this._commitMembers(t, e);
  }
  _toggleChanged(t, e) {
    const r = e.target.checked;
    this._fire({ ...this._config, [t]: r });
  }
  _renderMemberContent(t, e) {
    return u`
      <div class="member-content ${e ? "hidden-member" : ""}" slot=${t.slug} data-slug=${t.slug}>
        <div class="member-avatar">
          ${t.avatar && t.avatar.startsWith("/local/") ? u`<img src=${t.avatar} alt=${t.name} style="width:100%;height:100%;object-fit:cover;" />` : u`${t.avatar ?? t.name[0]}`}
        </div>
        <span class="member-name">${t.name}</span>
        <button
          class="icon-btn visibility-btn"
          type="button"
          aria-label="${e ? "Show" : "Hide"} ${t.name} on the card"
          title="${e ? "Show on card" : "Hide from card"}"
          @click=${() => this._toggleVisibility(t.slug)}
        >
          <ha-icon icon=${e ? "mdi:eye-off-outline" : "mdi:eye-outline"}></ha-icon>
        </button>
        ${t.slug !== "household" ? u`<button
              class="icon-btn change-avatar-btn"
              type="button"
              title="Edit avatar"
              aria-label="Edit avatar for ${t.name}"
              @click=${() => {
      this._avatarModalMember = t;
    }}
            >
              <ha-icon icon="mdi:pencil-outline"></ha-icon>
            </button>` : ""}
      </div>
    `;
  }
  render() {
    if (!this._config) return u``;
    if (this._familyState !== null && this._familyState.integrationError !== null)
      return u`
        <div class="error-block">
          Install the Lucarne Family integration first.
          <a href="/config/integrations/dashboard#search=lucarne" target="_blank"
            >Open Integrations</a
          >
        </div>
      `;
    if (this._familyState === null)
      return u`<div class="loading">Loading members…</div>`;
    const { ordered: t, hidden: e } = this._membersModel(), r = t.map((a) => ({ key: a.slug, label: a.name }));
    return u`
      <div class="section-label">General</div>
      <input
        id="ed-title"
        type="text"
        placeholder="Card title (default: Chores)"
        .value=${this._config.title ?? ""}
        @change=${this._titleChanged}
      />

      <div class="section-label">Members</div>
      <lucarne-reorder-list
        label="Members (drag to reorder, eye to show or hide)"
        .items=${r}
        @reorder=${(a) => this._onMembersReorder(a.detail.order)}
      >
        ${t.map((a) => this._renderMemberContent(a, e.has(a.slug)))}
      </lucarne-reorder-list>

      ${this._avatarModalMember ? u`<lucarne-avatar-upload-modal
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
      ["show_streak", "Show streak"],
      ["hide_names", "Hide names"]
    ].map(
      ([a, i]) => u`
          <div class="toggle-row">
            <input
              type="checkbox"
              id="ed-${a}"
              .checked=${this._config[a] ?? a !== "hide_names"}
              @change=${(n) => this._toggleChanged(a, n)}
            />
            <label for="ed-${a}">${i}</label>
          </div>
        `
    )}
    `;
  }
};
Be.styles = [
  N,
  M`
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
      /* Row content rendered inside the shared <lucarne-reorder-list>. */
      .member-content {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        min-width: 0;
      }
      .member-content.hidden-member .member-avatar,
      .member-content.hidden-member .member-name {
        opacity: 0.45;
      }
      .member-name {
        flex: 1;
        min-width: 0;
        font-size: var(--lucarne-fs-md);
        color: var(--lucarne-on-surface);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .member-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
      .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: var(--lucarne-on-surface-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--lucarne-radius-sm);
        flex-shrink: 0;
      }
      .icon-btn:hover {
        background: rgba(0, 0, 0, 0.05);
        color: var(--lucarne-on-surface);
      }
      .icon-btn ha-icon {
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }
      .toggle-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        padding: var(--lucarne-spacing-xs) 0;
      }
      .toggle-row label {
        font-size: var(--lucarne-fs-md);
        color: var(--lucarne-on-surface);
        cursor: pointer;
        flex: 1;
      }
      /* Custom checkbox: the native control follows the OS color-scheme and
         renders as a black box on a light HA theme when the OS is dark. Render
         it ourselves from theme tokens so it matches the card surface + accent. */
      input[type='checkbox'] {
        appearance: none;
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        margin: 0;
        flex-shrink: 0;
        position: relative;
        cursor: pointer;
        border: 2px solid var(--lucarne-on-surface-muted, #727272);
        border-radius: 4px;
        background: var(--lucarne-surface, var(--ha-card-background, #fff));
      }
      input[type='checkbox']:checked {
        background: var(--primary-color, #03a9f4);
        border-color: var(--primary-color, #03a9f4);
      }
      input[type='checkbox']:checked::after {
        content: '';
        position: absolute;
        left: 4px;
        top: 1px;
        width: 4px;
        height: 8px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
      input[type='checkbox']:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 1px;
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
Tt([
  g({ attribute: !1 })
], Be.prototype, "hass", 2);
Tt([
  v()
], Be.prototype, "_config", 2);
Tt([
  v()
], Be.prototype, "_familyState", 2);
Tt([
  v()
], Be.prototype, "_avatarModalMember", 2);
Be = Tt([
  E("lucarne-chores-card-editor")
], Be);
