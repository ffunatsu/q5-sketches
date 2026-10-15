// node_modules/squint-cljs/src/squint/core.js
function __toFn(x) {
  if (x == null || typeof x === "function") return x;
  if (typeof x === "string") return (coll, d) => get(coll, x, d);
  switch (typeConst(x)) {
    case MAP_TYPE:
    case ARRAY_TYPE:
    case OBJECT_TYPE:
    case SET_TYPE:
      return (k, d) => get(x, k, d);
    case INSTANCE_TYPE:
      if (x[ILookup__lookup] !== void 0) return (k, d) => get(x, k, d);
  }
  return x;
}
var MAP_TYPE = 1;
var ARRAY_TYPE = 2;
var OBJECT_TYPE = 3;
var LIST_TYPE = 4;
var SET_TYPE = 5;
var LAZY_ITERABLE_TYPE = 6;
var INSTANCE_TYPE = 7;
var TYPE_TAG = /* @__PURE__ */ Symbol.for("squint.core/type");
var EDUCTION = /* @__PURE__ */ Symbol.for("squint.core/eduction");
// @__NO_SIDE_EFFECTS__
function defclass(c) {
  return c;
}
function isObj(coll) {
  return coll.constructor === Object;
}
function isVectorArray(x) {
  return Array.isArray(x) && x[TYPE_TAG] !== LIST_TYPE;
}
function typeConst(obj) {
  if (obj == null) {
    return void 0;
  }
  if (isObj(obj)) {
    return OBJECT_TYPE;
  }
  if (obj instanceof Map) return MAP_TYPE;
  if (obj instanceof Set) return SET_TYPE;
  const tag = obj[TYPE_TAG];
  if (tag !== void 0) return tag;
  if (isVectorArray(obj)) return ARRAY_TYPE;
  if (typeof obj === "object") return INSTANCE_TYPE;
  return void 0;
}
var _STAR_print_newline_STAR_ = { val: false };
var _STAR_print_fn_STAR_ = { val: (s) => console.log(s) };
function print(...args) {
  _STAR_print_fn_STAR_.val(args.map((v) => toEDN(v, void 0, false)).join(" "));
}
function println(...args) {
  print(...args);
  if (_STAR_print_newline_STAR_.val) _STAR_print_fn_STAR_.val("\n");
}
function get(coll, key, otherwise = void 0) {
  if (coll == null) {
    return otherwise;
  }
  let v;
  if (isObj(coll)) {
    v = coll[key];
    if (v === void 0) {
      return otherwise;
    } else {
      return v;
    }
  }
  let g;
  switch (typeConst(coll)) {
    case SET_TYPE:
      if (coll.has(key)) v = key;
      break;
    case MAP_TYPE:
      v = coll.get(key);
      break;
    case ARRAY_TYPE:
      v = coll[key];
      break;
    default:
      if (coll[ILookup__lookup] !== void 0) {
        v = coll[ILookup__lookup](coll, key, otherwise);
        return v === void 0 ? otherwise : v;
      }
      g = coll["get"];
      if (typeof g === "function") {
        try {
          v = coll.get(key);
          break;
        } catch (e) {
        }
      }
      v = coll[key];
      break;
  }
  return v !== void 0 ? v : otherwise;
}
var MAP_ENTRY = /* @__PURE__ */ Symbol.for("squint.core/map-entry");
function tagMapEntry(e) {
  e[MAP_ENTRY] = true;
  return e;
}
function iterable(x) {
  if (x === null || x === void 0) {
    return [];
  }
  if (x[Symbol.iterator]) {
    return x;
  }
  if (x[ISeqable__seq] !== void 0) return iterable(x[ISeqable__seq](x));
  if (isObj(x)) return Object.entries(x).map(tagMapEntry);
  throw new TypeError(`${x} is not iterable`);
}
var IIterable = /* @__PURE__ */ Symbol.for("squint.core/IIterable");
function _iterator(coll) {
  return coll[Symbol.iterator]();
}
var es6_iterator = _iterator;
var CHUNK_SIZE = 32;
var LazyIterable = /* @__PURE__ */ defclass(
  class LazyIterable2 {
    constructor(step) {
      this[TYPE_TAG] = LAZY_ITERABLE_TYPE;
      this[IIterable] = true;
      this.step = step;
      this.realized = false;
      this.chunk = null;
      this._rest = null;
    }
    force() {
      if (!this.realized) {
        this.realized = true;
        const r = this.step();
        this.step = null;
        if (r !== null && r !== void 0) {
          this.chunk = r[0];
          this._rest = new LazyIterable2(r[1]);
        }
      }
      return this;
    }
    [Symbol.iterator]() {
      let cell = this;
      let i = 0;
      return {
        next() {
          for (; ; ) {
            cell.force();
            const ch = cell.chunk;
            if (ch === null) return { value: void 0, done: true };
            if (i < ch.length) return { value: ch[i++], done: false };
            cell = cell._rest;
            i = 0;
          }
        },
        [Symbol.iterator]() {
          return this;
        }
      };
    }
    // Mirrors Array.prototype.indexOf so lazy seqs support (.indexOf coll x):
    // reference equality, returns -1 when absent. Unlike cljs.core, not by value.
    indexOf(x, fromIndex = 0) {
      let i = 0;
      for (const v of this) {
        if (i >= fromIndex && v === x) return i;
        i++;
      }
      return -1;
    }
  }
);
function unchunkedSteps(iter) {
  const step = () => {
    const r = iter.next();
    return r.done ? null : [[r.value], step];
  };
  return step;
}
function lazy(f) {
  return new LazyIterable(unchunkedSteps(f()));
}
function chunkCells(coll) {
  if (coll instanceof LazyIterable) return coll;
  if (Array.isArray(coll)) {
    const step = (pos) => () => {
      if (pos >= coll.length) return null;
      const end = Math.min(pos + CHUNK_SIZE, coll.length);
      return [coll.slice(pos, end), step(end)];
    };
    return new LazyIterable(step(0));
  }
  return new LazyIterable(unchunkedSteps(es6_iterator(iterable(coll))));
}
function chunkCursor(coll) {
  if (coll instanceof LazyIterable) {
    let cell = coll;
    return () => {
      if (cell === null) return null;
      cell.force();
      const ch = cell.chunk;
      cell = ch === null ? null : cell._rest;
      return ch;
    };
  }
  const it = es6_iterator(iterable(coll));
  return () => {
    const b = [];
    for (let i = 0; i < CHUNK_SIZE; i++) {
      const r = it.next();
      if (r.done) break;
      b.push(r.value);
    }
    return b.length === 0 ? null : b;
  };
}
function mapChunks(coll, xf) {
  const src = chunkCells(coll);
  const step = (cell, base) => () => {
    let c = cell;
    let b = base;
    for (; ; ) {
      c.force();
      const ch = c.chunk;
      if (ch === null) return null;
      const out = xf(ch, b);
      const rest = c._rest;
      b += ch.length;
      if (out.length !== 0) return [out, step(rest, b)];
      c = rest;
    }
  };
  return new LazyIterable(step(src, 0));
}
function map(f, ...colls) {
  f = __toFn(f);
  switch (colls.length) {
    case 0:
      return (rf) => {
        return (...args) => {
          switch (args.length) {
            case 0: {
              return rf();
            }
            case 1: {
              return rf(args[0]);
            }
            case 2: {
              return rf(args[0], f(args[1]));
            }
            default: {
              return rf(args[0], f(...args.slice(1)));
            }
          }
        };
      };
    case 1:
      return mapChunks(colls[0], (ch) => {
        const out = new Array(ch.length);
        for (let i = 0; i < ch.length; i++) out[i] = f(ch[i]);
        return out;
      });
    default: {
      const iters = colls.map((coll) => es6_iterator(iterable(coll)));
      return lazy(function* () {
        while (true) {
          const args = [];
          for (const i of iters) {
            const nextVal = i.next();
            if (nextVal.done) {
              return;
            }
            args.push(nextVal.value);
          }
          yield f(...args);
        }
      });
    }
  }
}
var ISeqable__seq = /* @__PURE__ */ Symbol.for("squint.core/-seq");
var ILookup__lookup = /* @__PURE__ */ Symbol.for("squint.core/-lookup");
var M3_C1 = 3432918353 | 0;
var M3_C2 = 461845907 | 0;
var IWriter = { __sym: /* @__PURE__ */ Symbol.for("squint.core/IWriter") };
var IWriter__write = /* @__PURE__ */ Symbol.for("squint.core/-write");
var IPrintWithWriter__pr_writer = /* @__PURE__ */ Symbol.for("squint.core/-pr-writer");
var IRecord = { __sym: /* @__PURE__ */ Symbol.for("squint.core/IRecord") };
function mapv(...args) {
  if (args.length === 2) {
    const [_f, coll] = args;
    const f = __toFn(_f);
    const iter = iterable(coll);
    if (Array.isArray(iter)) {
      const ret = new Array(iter.length);
      for (var i = 0; i < iter.length; i++) {
        ret[i] = f(iter[i]);
      }
      return ret;
    } else {
      const ret = [];
      const next = chunkCursor(iter);
      let ch;
      while ((ch = next()) !== null) {
        for (let i2 = 0; i2 < ch.length; i2++) ret.push(f(ch[i2]));
      }
      return ret;
    }
  }
  return [...map(...args)];
}
var UUID = class {
  constructor(uuid) {
    this.uuid = uuid;
  }
  toString() {
    return this.uuid;
  }
};
function toEDN(value, seen = /* @__PURE__ */ new WeakSet(), readably = true) {
  if (value == null) return "nil";
  if (typeof value === "number") {
    if (value === Infinity) return "##Inf";
    if (value === -Infinity) return "##-Inf";
    if (Number.isNaN(value)) return "##NaN";
    return String(value);
  }
  if (typeof value === "boolean") return String(value);
  if (typeof value === "string") return readably ? JSON.stringify(value) : value;
  if (typeof value === "bigint") return `${value}N`;
  if (typeof value === "object") {
    if (value instanceof UUID) return readably ? `#uuid "${value.uuid}"` : value.uuid;
    if (seen.has(value)) return "#object[circular]";
    seen.add(value);
    const T = value[EDUCTION] !== void 0 ? LIST_TYPE : typeConst(value);
    let keys, result;
    switch (T) {
      case ARRAY_TYPE:
        result = `[${value.map((v) => toEDN(v, seen, readably)).join(" ")}]`;
        break;
      case SET_TYPE:
        result = `#{${Array.from(value).map((v) => toEDN(v, seen, readably)).join(" ")}}`;
        break;
      case MAP_TYPE:
        result = `#js/Map {${Array.from(value.entries()).map(([k, v]) => `${toEDN(k, seen, readably)} ${toEDN(v, seen, readably)}`).join(", ")}}`;
        break;
      case LAZY_ITERABLE_TYPE:
      case LIST_TYPE:
        result = `(${mapv((v) => `${toEDN(v, seen, readably)}`, value).join(", ")})`;
        break;
      default:
        if (value[IPrintWithWriter__pr_writer] !== void 0) {
          let buf = "";
          const writer = { [IWriter__write]: (_w, s) => buf += s, [IWriter.__sym]: true };
          value[IPrintWithWriter__pr_writer](value, writer, { readably });
          result = buf;
          break;
        }
        if (value[IRecord.__sym] !== void 0) {
          keys = Object.keys(value);
          result = `#${value.constructor.name}{${keys.map((k) => `:${k} ${toEDN(value[k], seen, readably)}`).join(", ")}}`;
          break;
        }
        if (value.constructor && value.constructor !== Object) {
          seen.delete(value);
          return `#<${value.constructor.name}>`;
        }
        keys = Object.keys(value);
        result = `{${keys.map((k) => `:${k} ${toEDN(value[k], seen, readably)}`).join(", ")}}`;
    }
    seen.delete(value);
    return result;
  }
  return `#object[${value.constructor.name}]`;
}

// hello.mjs
println("hello");
