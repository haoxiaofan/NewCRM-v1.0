/**
 * 整理：胡尐睿丶
 * 联系：hooray@hoorayos.com
 */

/**
 * ie6 png透明修正
 * DD_belatedPNG.fix('.png_bg');
 * DD_belatedPNG.fixPng( someNode );
 * http://www.dillerdesign.com/experiment/DD_belatedPNG/
 */
if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
    var DD_belatedPNG = {
        ns: "DD_belatedPNG",
        imgSize: {},
        delay: 10,
        nodesFixed: 0,
        createVmlNameSpace: function () {
            if (document.namespaces && !document.namespaces[this.ns]) {
                document.namespaces.add(this.ns, "urn:schemas-microsoft-com:vml");
            }
        },
        createVmlStyleSheet: function () {
            var b, a;
            b = document.createElement("style");
            b.setAttribute("media", "screen");
            document.documentElement.firstChild.insertBefore(b, document.documentElement.firstChild.firstChild);
            if (b.styleSheet) {
                b = b.styleSheet;
                b.addRule(this.ns + "\\:*", "{behavior:url(#default#VML)}");
                b.addRule(this.ns + "\\:shape", "position:absolute;");
                b.addRule("img." + this.ns + "_sizeFinder", "behavior:none; border:none; position:absolute; z-index:-1; top:-10000px; visibility:hidden;");
                this.screenStyleSheet = b;
                a = document.createElement("style");
                a.setAttribute("media", "print");
                document.documentElement.firstChild.insertBefore(a, document.documentElement.firstChild.firstChild);
                a = a.styleSheet;
                a.addRule(this.ns + "\\:*", "{display: none !important;}");
                a.addRule("img." + this.ns + "_sizeFinder", "{display: none !important;}");
            }
        },
        readPropertyChange: function () {
            var b, c, a;
            b = event.srcElement;
            if (!b.vmlInitiated) {
                return;
            }
            if (event.propertyName.search("background") != -1 || event.propertyName.search("border") != -1) {
                DD_belatedPNG.applyVML(b);
            }
            if (event.propertyName == "style.display") {
                c = (b.currentStyle.display == "none") ? "none" : "block";
                for (a in b.vml) {
                    if (b.vml.hasOwnProperty(a)) {
                        b.vml[a].shape.style.display = c;
                    }
                }
            }
            if (event.propertyName.search("filter") != -1) {
                DD_belatedPNG.vmlOpacity(b);
            }
        },
        vmlOpacity: function (b) {
            if (b.currentStyle.filter.search("lpha") != -1) {
                var a = b.currentStyle.filter;
                a = parseInt(a.substring(a.lastIndexOf("=") + 1, a.lastIndexOf(")")), 10) / 100;
                b.vml.color.shape.style.filter = b.currentStyle.filter;
                b.vml.image.fill.opacity = a;
            }
        },
        handlePseudoHover: function (a) {
            setTimeout(function () {
                DD_belatedPNG.applyVML(a);
            },
                1);
        },
        fix: function (a) {
            if (this.screenStyleSheet) {
                var c, b;
                c = a.split(",");
                for (b = 0; b < c.length; b++) {
                    this.screenStyleSheet.addRule(c[b], "behavior:expression(DD_belatedPNG.fixPng(this))");
                }
            }
        },
        applyVML: function (a) {
            a.runtimeStyle.cssText = "";
            this.vmlFill(a);
            this.vmlOffsets(a);
            this.vmlOpacity(a);
            if (a.isImg) {
                this.copyImageBorders(a);
            }
        },
        attachHandlers: function (i) {
            var d, c, g, e, b, f;
            d = this;
            c = {
                resize: "vmlOffsets",
                move: "vmlOffsets"
            };
            if (i.nodeName == "A") {
                e = {
                    mouseleave: "handlePseudoHover",
                    mouseenter: "handlePseudoHover",
                    focus: "handlePseudoHover",
                    blur: "handlePseudoHover"
                };
                for (b in e) {
                    if (e.hasOwnProperty(b)) {
                        c[b] = e[b];
                    }
                }
            }
            for (f in c) {
                if (c.hasOwnProperty(f)) {
                    g = function () {
                        d[c[f]](i);
                    };
                    i.attachEvent("on" + f, g);
                }
            }
            i.attachEvent("onpropertychange", this.readPropertyChange);
        },
        giveLayout: function (a) {
            a.style.zoom = 1;
            if (a.currentStyle.position == "static") {
                a.style.position = "relative";
            }
        },
        copyImageBorders: function (b) {
            var c, a;
            c = {
                borderStyle: true,
                borderWidth: true,
                borderColor: true
            };
            for (a in c) {
                if (c.hasOwnProperty(a)) {
                    b.vml.color.shape.style[a] = b.currentStyle[a];
                }
            }
        },
        vmlFill: function (e) {
            if (!e.currentStyle) {
                return;
            } else {
                var d, f, g, b, a, c;
                d = e.currentStyle;
            }
            for (b in e.vml) {
                if (e.vml.hasOwnProperty(b)) {
                    e.vml[b].shape.style.zIndex = d.zIndex;
                }
            }
            e.runtimeStyle.backgroundColor = "";
            e.runtimeStyle.backgroundImage = "";
            f = true;
            if (d.backgroundImage != "none" || e.isImg) {
                if (!e.isImg) {
                    e.vmlBg = d.backgroundImage;
                    e.vmlBg = e.vmlBg.substr(5, e.vmlBg.lastIndexOf('")') - 5);
                } else {
                    e.vmlBg = e.src;
                }
                g = this;
                if (!g.imgSize[e.vmlBg]) {
                    a = document.createElement("img");
                    g.imgSize[e.vmlBg] = a;
                    a.className = g.ns + "_sizeFinder";
                    a.runtimeStyle.cssText = "behavior:none; position:absolute; left:-10000px; top:-10000px; border:none; margin:0; padding:0;";
                    c = function () {
                        this.width = this.offsetWidth;
                        this.height = this.offsetHeight;
                        g.vmlOffsets(e);
                    };
                    a.attachEvent("onload", c);
                    a.src = e.vmlBg;
                    a.removeAttribute("width");
                    a.removeAttribute("height");
                    document.body.insertBefore(a, document.body.firstChild);
                }
                e.vml.image.fill.src = e.vmlBg;
                f = false;
            }
            e.vml.image.fill.on = !f;
            e.vml.image.fill.color = "none";
            e.vml.color.shape.style.backgroundColor = d.backgroundColor;
            e.runtimeStyle.backgroundImage = "none";
            e.runtimeStyle.backgroundColor = "transparent";
        },
        vmlOffsets: function (d) {
            var h, n, a, e, g, m, f, l, j, i, k;
            h = d.currentStyle;
            n = {
                W: d.clientWidth + 1,
                H: d.clientHeight + 1,
                w: this.imgSize[d.vmlBg].width,
                h: this.imgSize[d.vmlBg].height,
                L: d.offsetLeft,
                T: d.offsetTop,
                bLW: d.clientLeft,
                bTW: d.clientTop
            };
            a = (n.L + n.bLW == 1) ? 1 : 0;
            e = function (b, p, q, c, s, u) {
                b.coordsize = c + "," + s;
                b.coordorigin = u + "," + u;
                b.path = "m0,0l" + c + ",0l" + c + "," + s + "l0," + s + " xe";
                b.style.width = c + "px";
                b.style.height = s + "px";
                b.style.left = p + "px";
                b.style.top = q + "px";
            };
            e(d.vml.color.shape, (n.L + (d.isImg ? 0 : n.bLW)), (n.T + (d.isImg ? 0 : n.bTW)), (n.W - 1), (n.H - 1), 0);
            e(d.vml.image.shape, (n.L + n.bLW), (n.T + n.bTW), (n.W), (n.H), 1);
            g = {
                X: 0,
                Y: 0
            };
            if (d.isImg) {
                g.X = parseInt(h.paddingLeft, 10) + 1;
                g.Y = parseInt(h.paddingTop, 10) + 1;
            } else {
                for (j in g) {
                    if (g.hasOwnProperty(j)) {
                        this.figurePercentage(g, n, j, h["backgroundPosition" + j]);
                    }
                }
            }
            d.vml.image.fill.position = (g.X / n.W) + "," + (g.Y / n.H);
            m = h.backgroundRepeat;
            f = {
                T: 1,
                R: n.W + a,
                B: n.H,
                L: 1 + a
            };
            l = {
                X: {
                    b1: "L",
                    b2: "R",
                    d: "W"
                },
                Y: {
                    b1: "T",
                    b2: "B",
                    d: "H"
                }
            };
            if (m != "repeat" || d.isImg) {
                i = {
                    T: (g.Y),
                    R: (g.X + n.w),
                    B: (g.Y + n.h),
                    L: (g.X)
                };
                if (m.search("repeat-") != -1) {
                    k = m.split("repeat-")[1].toUpperCase();
                    i[l[k].b1] = 1;
                    i[l[k].b2] = n[l[k].d];
                }
                if (i.B > n.H) {
                    i.B = n.H;
                }
                d.vml.image.shape.style.clip = "rect(" + i.T + "px " + (i.R + a) + "px " + i.B + "px " + (i.L + a) + "px)";
            } else {
                d.vml.image.shape.style.clip = "rect(" + f.T + "px " + f.R + "px " + f.B + "px " + f.L + "px)";
            }
        },
        figurePercentage: function (d, c, f, a) {
            var b, e;
            e = true;
            b = (f == "X");
            switch (a) {
                case "left":
                case "top":
                    d[f] = 0;
                    break;
                case "center":
                    d[f] = 0.5;
                    break;
                case "right":
                case "bottom":
                    d[f] = 1;
                    break;
                default:
                    if (a.search("%") != -1) {
                        d[f] = parseInt(a, 10) / 100;
                    } else {
                        e = false;
                    }
            }
            d[f] = Math.ceil(e ? ((c[b ? "W" : "H"] * d[f]) - (c[b ? "w" : "h"] * d[f])) : parseInt(a, 10));
            if (d[f] % 2 === 0) {
                d[f]++;
            }
            return d[f];
        },
        fixPng: function (c) {
            c.style.behavior = "none";
            var g, b, f, a, d;
            if (c.nodeName == "BODY" || c.nodeName == "TD" || c.nodeName == "TR") {
                return;
            }
            c.isImg = false;
            if (c.nodeName == "IMG") {
                if (c.src.toLowerCase().search(/\.png$/) != -1) {
                    c.isImg = true;
                    c.style.visibility = "hidden";
                } else {
                    return;
                }
            } else {
                if (c.currentStyle.backgroundImage.toLowerCase().search(".png") == -1) {
                    return;
                }
            }
            g = DD_belatedPNG;
            c.vml = {
                color: {},
                image: {}
            };
            b = {
                shape: {},
                fill: {}
            };
            for (a in c.vml) {
                if (c.vml.hasOwnProperty(a)) {
                    for (d in b) {
                        if (b.hasOwnProperty(d)) {
                            f = g.ns + ":" + d;
                            c.vml[a][d] = document.createElement(f);
                        }
                    }
                    c.vml[a].shape.stroked = false;
                    c.vml[a].shape.appendChild(c.vml[a].fill);
                    c.parentNode.insertBefore(c.vml[a].shape, c);
                }
            }
            c.vml.image.shape.fillcolor = "none";
            c.vml.image.fill.type = "tile";
            c.vml.color.fill.on = false;
            g.attachHandlers(c);
            g.giveLayout(c);
            g.giveLayout(c.offsetParent);
            c.vmlInitiated = true;
            g.applyVML(c);
        }
    };
    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch (r) { }
    DD_belatedPNG.createVmlNameSpace();
    DD_belatedPNG.createVmlStyleSheet();
}

/**
 * SWFObject v2.2
 * http://code.google.com/p/swfobject/
 * swfobject.embedSWF("test.swf", "myContent", "300", "120", "9.0.0", "expressInstall.swf");
 */
var swfobject = function () {
    var D = "undefined",
        r = "object",
        S = "Shockwave Flash",
        W = "ShockwaveFlash.ShockwaveFlash",
        q = "application/x-shockwave-flash",
        R = "SWFObjectExprInst",
        x = "onreadystatechange",
        O = window,
        j = document,
        t = navigator,
        T = false,
        U = [h],
        o = [],
        N = [],
        I = [],
        l,
        Q,
        E,
        B,
        J = false,
        a = false,
        n,
        G,
        m = true,
        M = function () {
            var aa = typeof j.getElementById != D && typeof j.getElementsByTagName != D && typeof j.createElement != D,
                ah = t.userAgent.toLowerCase(),
                Y = t.platform.toLowerCase(),
                ae = Y ? /win/.test(Y) : /win/.test(ah),
                ac = Y ? /mac/.test(Y) : /mac/.test(ah),
                af = /webkit/.test(ah) ? parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false,
                X = !+"\v1",
                ag = [0, 0, 0],
                ab = null;
            if (typeof t.plugins != D && typeof t.plugins[S] == r) {
                ab = t.plugins[S].description;
                if (ab && !(typeof t.mimeTypes != D && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin)) {
                    T = true;
                    X = false;
                    ab = ab.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                    ag[0] = parseInt(ab.replace(/^(.*)\..*$/, "$1"), 10);
                    ag[1] = parseInt(ab.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                    ag[2] = /[a-zA-Z]/.test(ab) ? parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
                }
            } else {
                if (typeof O.ActiveXObject != D) {
                    try {
                        var ad = new ActiveXObject(W);
                        if (ad) {
                            ab = ad.GetVariable("$version");
                            if (ab) {
                                X = true;
                                ab = ab.split(" ")[1].split(",");
                                ag = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)];
                            }
                        }
                    } catch (Z) { }
                }
            }
            return {
                w3: aa,
                pv: ag,
                wk: af,
                ie: X,
                win: ae,
                mac: ac
            };
        }(),
        k = function () {
            if (!M.w3) {
                return;
            }
            if ((typeof j.readyState != D && j.readyState == "complete") || (typeof j.readyState == D && (j.getElementsByTagName("body")[0] || j.body))) {
                f();
            }
            if (!J) {
                if (typeof j.addEventListener != D) {
                    j.addEventListener("DOMContentLoaded", f, false);
                }
                if (M.ie && M.win) {
                    j.attachEvent(x,
                        function () {
                            if (j.readyState == "complete") {
                                j.detachEvent(x, arguments.callee);
                                f();
                            }
                        });
                    if (O == top) {
                        (function () {
                            if (J) {
                                return;
                            }
                            try {
                                j.documentElement.doScroll("left");
                            } catch (X) {
                                setTimeout(arguments.callee, 0);
                                return;
                            }
                            f();
                        })();
                    }
                }
                if (M.wk) {
                    (function () {
                        if (J) {
                            return;
                        }
                        if (!/loaded|complete/.test(j.readyState)) {
                            setTimeout(arguments.callee, 0);
                            return;
                        }
                        f();
                    })();
                }
                s(f);
            }
        }();
    function f() {
        if (J) {
            return;
        }
        try {
            var Z = j.getElementsByTagName("body")[0].appendChild(C("span"));
            Z.parentNode.removeChild(Z);
        } catch (aa) {
            return;
        }
        J = true;
        var X = U.length;
        for (var Y = 0; Y < X; Y++) {
            U[Y]();
        }
    }
    function K(X) {
        if (J) {
            X();
        } else {
            U[U.length] = X;
        }
    }
    function s(Y) {
        if (typeof O.addEventListener != D) {
            O.addEventListener("load", Y, false);
        } else {
            if (typeof j.addEventListener != D) {
                j.addEventListener("load", Y, false);
            } else {
                if (typeof O.attachEvent != D) {
                    i(O, "onload", Y);
                } else {
                    if (typeof O.onload == "function") {
                        var X = O.onload;
                        O.onload = function () {
                            X();
                            Y();
                        };
                    } else {
                        O.onload = Y;
                    }
                }
            }
        }
    }
    function h() {
        if (T) {
            V();
        } else {
            H();
        }
    }
    function V() {
        var X = j.getElementsByTagName("body")[0];
        var aa = C(r);
        aa.setAttribute("type", q);
        var Z = X.appendChild(aa);
        if (Z) {
            var Y = 0; (function () {
                if (typeof Z.GetVariable != D) {
                    var ab = Z.GetVariable("$version");
                    if (ab) {
                        ab = ab.split(" ")[1].split(",");
                        M.pv = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)];
                    }
                } else {
                    if (Y < 10) {
                        Y++;
                        setTimeout(arguments.callee, 10);
                        return;
                    }
                }
                X.removeChild(aa);
                Z = null;
                H();
            })();
        } else {
            H();
        }
    }
    function H() {
        var ag = o.length;
        if (ag > 0) {
            for (var af = 0; af < ag; af++) {
                var Y = o[af].id;
                var ab = o[af].callbackFn;
                var aa = {
                    success: false,
                    id: Y
                };
                if (M.pv[0] > 0) {
                    var ae = c(Y);
                    if (ae) {
                        if (F(o[af].swfVersion) && !(M.wk && M.wk < 312)) {
                            w(Y, true);
                            if (ab) {
                                aa.success = true;
                                aa.ref = z(Y);
                                ab(aa);
                            }
                        } else {
                            if (o[af].expressInstall && A()) {
                                var ai = {};
                                ai.data = o[af].expressInstall;
                                ai.width = ae.getAttribute("width") || "0";
                                ai.height = ae.getAttribute("height") || "0";
                                if (ae.getAttribute("class")) {
                                    ai.styleclass = ae.getAttribute("class");
                                }
                                if (ae.getAttribute("align")) {
                                    ai.align = ae.getAttribute("align");
                                }
                                var ah = {};
                                var X = ae.getElementsByTagName("param");
                                var ac = X.length;
                                for (var ad = 0; ad < ac; ad++) {
                                    if (X[ad].getAttribute("name").toLowerCase() != "movie") {
                                        ah[X[ad].getAttribute("name")] = X[ad].getAttribute("value");
                                    }
                                }
                                P(ai, ah, Y, ab);
                            } else {
                                p(ae);
                                if (ab) {
                                    ab(aa);
                                }
                            }
                        }
                    }
                } else {
                    w(Y, true);
                    if (ab) {
                        var Z = z(Y);
                        if (Z && typeof Z.SetVariable != D) {
                            aa.success = true;
                            aa.ref = Z;
                        }
                        ab(aa);
                    }
                }
            }
        }
    }
    function z(aa) {
        var X = null;
        var Y = c(aa);
        if (Y && Y.nodeName == "OBJECT") {
            if (typeof Y.SetVariable != D) {
                X = Y;
            } else {
                var Z = Y.getElementsByTagName(r)[0];
                if (Z) {
                    X = Z;
                }
            }
        }
        return X;
    }
    function A() {
        return !a && F("6.0.65") && (M.win || M.mac) && !(M.wk && M.wk < 312);
    }
    function P(aa, ab, X, Z) {
        a = true;
        E = Z || null;
        B = {
            success: false,
            id: X
        };
        var ae = c(X);
        if (ae) {
            if (ae.nodeName == "OBJECT") {
                l = g(ae);
                Q = null;
            } else {
                l = ae;
                Q = X;
            }
            aa.id = R;
            if (typeof aa.width == D || (!/%$/.test(aa.width) && parseInt(aa.width, 10) < 310)) {
                aa.width = "310";
            }
            if (typeof aa.height == D || (!/%$/.test(aa.height) && parseInt(aa.height, 10) < 137)) {
                aa.height = "137";
            }
            j.title = j.title.slice(0, 47) + " - Flash Player Installation";
            var ad = M.ie && M.win ? "ActiveX" : "PlugIn",
                ac = "MMredirectURL=" + O.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + ad + "&MMdoctitle=" + j.title;
            if (typeof ab.flashvars != D) {
                ab.flashvars += "&" + ac;
            } else {
                ab.flashvars = ac;
            }
            if (M.ie && M.win && ae.readyState != 4) {
                var Y = C("div");
                X += "SWFObjectNew";
                Y.setAttribute("id", X);
                ae.parentNode.insertBefore(Y, ae);
                ae.style.display = "none"; (function () {
                    if (ae.readyState == 4) {
                        ae.parentNode.removeChild(ae);
                    } else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            }
            u(aa, ab, X);
        }
    }
    function p(Y) {
        if (M.ie && M.win && Y.readyState != 4) {
            var X = C("div");
            Y.parentNode.insertBefore(X, Y);
            X.parentNode.replaceChild(g(Y), X);
            Y.style.display = "none"; (function () {
                if (Y.readyState == 4) {
                    Y.parentNode.removeChild(Y);
                } else {
                    setTimeout(arguments.callee, 10);
                }
            })();
        } else {
            Y.parentNode.replaceChild(g(Y), Y);
        }
    }
    function g(ab) {
        var aa = C("div");
        if (M.win && M.ie) {
            aa.innerHTML = ab.innerHTML;
        } else {
            var Y = ab.getElementsByTagName(r)[0];
            if (Y) {
                var ad = Y.childNodes;
                if (ad) {
                    var X = ad.length;
                    for (var Z = 0; Z < X; Z++) {
                        if (!(ad[Z].nodeType == 1 && ad[Z].nodeName == "PARAM") && !(ad[Z].nodeType == 8)) {
                            aa.appendChild(ad[Z].cloneNode(true));
                        }
                    }
                }
            }
        }
        return aa;
    }
    function u(ai, ag, Y) {
        var X, aa = c(Y);
        if (M.wk && M.wk < 312) {
            return X;
        }
        if (aa) {
            if (typeof ai.id == D) {
                ai.id = Y;
            }
            if (M.ie && M.win) {
                var ah = "";
                for (var ae in ai) {
                    if (ai[ae] != Object.prototype[ae]) {
                        if (ae.toLowerCase() == "data") {
                            ag.movie = ai[ae];
                        } else {
                            if (ae.toLowerCase() == "styleclass") {
                                ah += ' class="' + ai[ae] + '"';
                            } else {
                                if (ae.toLowerCase() != "classid") {
                                    ah += " " + ae + '="' + ai[ae] + '"';
                                }
                            }
                        }
                    }
                }
                var af = "";
                for (var ad in ag) {
                    if (ag[ad] != Object.prototype[ad]) {
                        af += '<param name="' + ad + '" value="' + ag[ad] + '" />';
                    }
                }
                aa.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + ah + ">" + af + "</object>";
                N[N.length] = ai.id;
                X = c(ai.id);
            } else {
                var Z = C(r);
                Z.setAttribute("type", q);
                for (var ac in ai) {
                    if (ai[ac] != Object.prototype[ac]) {
                        if (ac.toLowerCase() == "styleclass") {
                            Z.setAttribute("class", ai[ac]);
                        } else {
                            if (ac.toLowerCase() != "classid") {
                                Z.setAttribute(ac, ai[ac]);
                            }
                        }
                    }
                }
                for (var ab in ag) {
                    if (ag[ab] != Object.prototype[ab] && ab.toLowerCase() != "movie") {
                        e(Z, ab, ag[ab]);
                    }
                }
                aa.parentNode.replaceChild(Z, aa);
                X = Z;
            }
        }
        return X;
    }
    function e(Z, X, Y) {
        var aa = C("param");
        aa.setAttribute("name", X);
        aa.setAttribute("value", Y);
        Z.appendChild(aa);
    }
    function y(Y) {
        var X = c(Y);
        if (X && X.nodeName == "OBJECT") {
            if (M.ie && M.win) {
                X.style.display = "none"; (function () {
                    if (X.readyState == 4) {
                        b(Y);
                    } else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            } else {
                X.parentNode.removeChild(X);
            }
        }
    }
    function b(Z) {
        var Y = c(Z);
        if (Y) {
            for (var X in Y) {
                if (typeof Y[X] == "function") {
                    Y[X] = null;
                }
            }
            Y.parentNode.removeChild(Y);
        }
    }
    function c(Z) {
        var X = null;
        try {
            X = j.getElementById(Z);
        } catch (Y) { }
        return X;
    }
    function C(X) {
        return j.createElement(X);
    }
    function i(Z, X, Y) {
        Z.attachEvent(X, Y);
        I[I.length] = [Z, X, Y];
    }
    function F(Z) {
        var Y = M.pv,
            X = Z.split(".");
        X[0] = parseInt(X[0], 10);
        X[1] = parseInt(X[1], 10) || 0;
        X[2] = parseInt(X[2], 10) || 0;
        return (Y[0] > X[0] || (Y[0] == X[0] && Y[1] > X[1]) || (Y[0] == X[0] && Y[1] == X[1] && Y[2] >= X[2])) ? true : false;
    }
    function v(ac, Y, ad, ab) {
        if (M.ie && M.mac) {
            return;
        }
        var aa = j.getElementsByTagName("head")[0];
        if (!aa) {
            return;
        }
        var X = (ad && typeof ad == "string") ? ad : "screen";
        if (ab) {
            n = null;
            G = null;
        }
        if (!n || G != X) {
            var Z = C("style");
            Z.setAttribute("type", "text/css");
            Z.setAttribute("media", X);
            n = aa.appendChild(Z);
            if (M.ie && M.win && typeof j.styleSheets != D && j.styleSheets.length > 0) {
                n = j.styleSheets[j.styleSheets.length - 1];
            }
            G = X;
        }
        if (M.ie && M.win) {
            if (n && typeof n.addRule == r) {
                n.addRule(ac, Y);
            }
        } else {
            if (n && typeof j.createTextNode != D) {
                n.appendChild(j.createTextNode(ac + " {" + Y + "}"));
            }
        }
    }
    function w(Z, X) {
        if (!m) {
            return;
        }
        var Y = X ? "visible" : "hidden";
        if (J && c(Z)) {
            c(Z).style.visibility = Y;
        } else {
            v("#" + Z, "visibility:" + Y);
        }
    }
    function L(Y) {
        var Z = /[\\\"<>\.;]/;
        var X = Z.exec(Y) != null;
        return X && typeof encodeURIComponent != D ? encodeURIComponent(Y) : Y;
    }
    var d = function () {
        if (M.ie && M.win) {
            window.attachEvent("onunload",
                function () {
                    var ac = I.length;
                    for (var ab = 0; ab < ac; ab++) {
                        I[ab][0].detachEvent(I[ab][1], I[ab][2]);
                    }
                    var Z = N.length;
                    for (var aa = 0; aa < Z; aa++) {
                        y(N[aa]);
                    }
                    for (var Y in M) {
                        M[Y] = null;
                    }
                    M = null;
                    for (var X in swfobject) {
                        swfobject[X] = null;
                    }
                    swfobject = null;
                });
        }
    }();
    return {
        registerObject: function (ab, X, aa, Z) {
            if (M.w3 && ab && X) {
                var Y = {};
                Y.id = ab;
                Y.swfVersion = X;
                Y.expressInstall = aa;
                Y.callbackFn = Z;
                o[o.length] = Y;
                w(ab, false);
            } else {
                if (Z) {
                    Z({
                        success: false,
                        id: ab
                    });
                }
            }
        },
        getObjectById: function (X) {
            if (M.w3) {
                return z(X);
            }
        },
        embedSWF: function (ab, ah, ae, ag, Y, aa, Z, ad, af, ac) {
            var X = {
                success: false,
                id: ah
            };
            if (M.w3 && !(M.wk && M.wk < 312) && ab && ah && ae && ag && Y) {
                w(ah, false);
                K(function () {
                    ae += "";
                    ag += "";
                    var aj = {};
                    if (af && typeof af === r) {
                        for (var al in af) {
                            aj[al] = af[al];
                        }
                    }
                    aj.data = ab;
                    aj.width = ae;
                    aj.height = ag;
                    var am = {};
                    if (ad && typeof ad === r) {
                        for (var ak in ad) {
                            am[ak] = ad[ak];
                        }
                    }
                    if (Z && typeof Z === r) {
                        for (var ai in Z) {
                            if (typeof am.flashvars != D) {
                                am.flashvars += "&" + ai + "=" + Z[ai];
                            } else {
                                am.flashvars = ai + "=" + Z[ai];
                            }
                        }
                    }
                    if (F(Y)) {
                        var an = u(aj, am, ah);
                        if (aj.id == ah) {
                            w(ah, true);
                        }
                        X.success = true;
                        X.ref = an;
                    } else {
                        if (aa && A()) {
                            aj.data = aa;
                            P(aj, am, ah, ac);
                            return;
                        } else {
                            w(ah, true);
                        }
                    }
                    if (ac) {
                        ac(X);
                    }
                });
            } else {
                if (ac) {
                    ac(X);
                }
            }
        },
        switchOffAutoHideShow: function () {
            m = false;
        },
        ua: M,
        getFlashPlayerVersion: function () {
            return {
                major: M.pv[0],
                minor: M.pv[1],
                release: M.pv[2]
            };
        },
        hasFlashPlayerVersion: F,
        createSWF: function (Z, Y, X) {
            if (M.w3) {
                return u(Z, Y, X);
            } else {
                return undefined;
            }
        },
        showExpressInstall: function (Z, aa, X, Y) {
            if (M.w3 && A()) {
                P(Z, aa, X, Y);
            }
        },
        removeSWF: function (X) {
            if (M.w3) {
                y(X);
            }
        },
        createCSS: function (aa, Z, Y, X) {
            if (M.w3) {
                v(aa, Z, Y, X);
            }
        },
        addDomLoadEvent: K,
        addLoadEvent: s,
        getQueryParamValue: function (aa) {
            var Z = j.location.search || j.location.hash;
            if (Z) {
                if (/\?/.test(Z)) {
                    Z = Z.split("?")[1];
                }
                if (aa == null) {
                    return L(Z);
                }
                var Y = Z.split("&");
                for (var X = 0; X < Y.length; X++) {
                    if (Y[X].substring(0, Y[X].indexOf("=")) == aa) {
                        return L(Y[X].substring((Y[X].indexOf("=") + 1)));
                    }
                }
            }
            return "";
        },
        expressInstallCallback: function () {
            if (a) {
                var X = c(R);
                if (X && l) {
                    X.parentNode.replaceChild(l, X);
                    if (Q) {
                        w(Q, true);
                        if (M.ie && M.win) {
                            l.style.display = "block";
                        }
                    }
                    if (E) {
                        E(B);
                    }
                }
                a = false;
            }
        }
    };
}();

/**
 * jQuery JSON plugin 2.4.0
 * https://code.google.com/p/jquery-json/
 */
(function ($) {
    var escape = /["\\\x00-\x1f\x7f-\x9f]/g,
        meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        hasOwn = Object.prototype.hasOwnProperty;
    $.toJSON = typeof JSON === "object" && JSON.stringify ? JSON.stringify : function (o) {
        if (o === null) {
            return "null";
        }
        var pairs, k, name, val, type = $.type(o);
        if (type === "undefined") {
            return undefined;
        }
        if (type === "number" || type === "boolean") {
            return String(o);
        }
        if (type === "string") {
            return $.quoteString(o);
        }
        if (typeof o.toJSON === "function") {
            return $.toJSON(o.toJSON());
        }
        if (type === "date") {
            var month = o.getUTCMonth() + 1,
                day = o.getUTCDate(),
                year = o.getUTCFullYear(),
                hours = o.getUTCHours(),
                minutes = o.getUTCMinutes(),
                seconds = o.getUTCSeconds(),
                milli = o.getUTCMilliseconds();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            if (milli < 100) {
                milli = "0" + milli;
            }
            if (milli < 10) {
                milli = "0" + milli;
            }
            return '"' + year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + "." + milli + 'Z"';
        }
        pairs = [];
        if ($.isArray(o)) {
            for (k = 0; k < o.length; k++) {
                pairs.push($.toJSON(o[k]) || "null");
            }
            return "[" + pairs.join(",") + "]";
        }
        if (typeof o === "object") {
            for (k in o) {
                if (hasOwn.call(o, k)) {
                    type = typeof k;
                    if (type === "number") {
                        name = '"' + k + '"';
                    } else {
                        if (type === "string") {
                            name = $.quoteString(k);
                        } else {
                            continue;
                        }
                    }
                    type = typeof o[k];
                    if (type !== "function" && type !== "undefined") {
                        val = $.toJSON(o[k]);
                        pairs.push(name + ":" + val);
                    }
                }
            }
            return "{" + pairs.join(",") + "}";
        }
    };
    $.evalJSON = typeof JSON === "object" && JSON.parse ? JSON.parse : function (str) {
        return eval("(" + str + ")");
    };
    $.secureEvalJSON = typeof JSON === "object" && JSON.parse ? JSON.parse : function (str) {
        var filtered = str.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "");
        if (/^[\],:{}\s]*$/.test(filtered)) {
            return eval("(" + str + ")");
        }
        throw new SyntaxError("Error parsing JSON, source is not valid.");
    };
    $.quoteString = function (str) {
        if (str.match(escape)) {
            return '"' + str.replace(escape,
                function (a) {
                    var c = meta[a];
                    if (typeof c === "string") {
                        return c;
                    }
                    c = a.charCodeAt();
                    return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                }) + '"';
        }
        return '"' + str + '"';
    };
}(jQuery));

/**
 * zClip :: jQuery ZeroClipboard v1.1.1
 * http://steamdev.com/zclip
 */
(function (a) {
    a.fn.zclip = function (c) {
        if (typeof c == "object" && !c.length) {
            var b = a.extend({
                path: "ZeroClipboard.swf",
                copy: null,
                beforeCopy: null,
                afterCopy: null,
                clickAfter: true,
                setHandCursor: true,
                setCSSEffects: true
            },
                c);
            return this.each(function () {
                var e = a(this);
                if (e.is(":visible") && (typeof b.copy == "string" || a.isFunction(b.copy))) {
                    ZeroClipboard.setMoviePath(b.path);
                    var d = new ZeroClipboard.Client();
                    if (a.isFunction(b.copy)) {
                        e.bind("zClip_copy", b.copy);
                    }
                    if (a.isFunction(b.beforeCopy)) {
                        e.bind("zClip_beforeCopy", b.beforeCopy);
                    }
                    if (a.isFunction(b.afterCopy)) {
                        e.bind("zClip_afterCopy", b.afterCopy);
                    }
                    d.setHandCursor(b.setHandCursor);
                    d.setCSSEffects(b.setCSSEffects);
                    d.addEventListener("mouseOver",
                        function (f) {
                            e.trigger("mouseenter");
                        });
                    d.addEventListener("mouseOut",
                        function (f) {
                            e.trigger("mouseleave");
                        });
                    d.addEventListener("mouseDown",
                        function (f) {
                            e.trigger("mousedown");
                            if (!a.isFunction(b.copy)) {
                                d.setText(b.copy);
                            } else {
                                d.setText(e.triggerHandler("zClip_copy"));
                            }
                            if (a.isFunction(b.beforeCopy)) {
                                e.trigger("zClip_beforeCopy");
                            }
                        });
                    d.addEventListener("complete",
                        function (f, g) {
                            if (a.isFunction(b.afterCopy)) {
                                e.trigger("zClip_afterCopy");
                            } else {
                                if (g.length > 500) {
                                    g = g.substr(0, 500) + "...\n\n(" + (g.length - 500) + " characters not shown)";
                                }
                                e.removeClass("hover");
                                alert("Copied text to clipboard:\n\n " + g);
                            }
                            if (b.clickAfter) {
                                e.trigger("click");
                            }
                        });
                    d.glue(e[0], e.parent()[0]);
                    a(window).bind("load resize",
                        function () {
                            d.reposition();
                        });
                }
            });
        } else {
            if (typeof c == "string") {
                return this.each(function () {
                    var f = a(this);
                    c = c.toLowerCase();
                    var e = f.data("zclipId");
                    var d = a("#" + e + ".zclip");
                    if (c == "remove") {
                        d.remove();
                        f.removeClass("active hover");
                    } else {
                        if (c == "hide") {
                            d.hide();
                            f.removeClass("active hover");
                        } else {
                            if (c == "show") {
                                d.show();
                            }
                        }
                    }
                });
            }
        }
    };
})(jQuery);
var ZeroClipboard = {
    version: "1.0.7",
    clients: {},
    moviePath: "ZeroClipboard.swf",
    nextId: 1,
    $: function (a) {
        if (typeof (a) == "string") {
            a = document.getElementById(a);
        }
        if (!a.addClass) {
            a.hide = function () {
                this.style.display = "none";
            };
            a.show = function () {
                this.style.display = "";
            };
            a.addClass = function (b) {
                this.removeClass(b);
                this.className += " " + b;
            };
            a.removeClass = function (d) {
                var e = this.className.split(/\s+/);
                var b = -1;
                for (var c = 0; c < e.length; c++) {
                    if (e[c] == d) {
                        b = c;
                        c = e.length;
                    }
                }
                if (b > -1) {
                    e.splice(b, 1);
                    this.className = e.join(" ");
                }
                return this;
            };
            a.hasClass = function (b) {
                return !!this.className.match(new RegExp("\\s*" + b + "\\s*"));
            };
        }
        return a;
    },
    setMoviePath: function (a) {
        this.moviePath = a;
    },
    dispatch: function (d, b, c) {
        var a = this.clients[d];
        if (a) {
            a.receiveEvent(b, c);
        }
    },
    register: function (b, a) {
        this.clients[b] = a;
    },
    getDOMObjectPosition: function (c, a) {
        var b = {
            left: 0,
            top: 0,
            width: c.width ? c.width : c.offsetWidth,
            height: c.height ? c.height : c.offsetHeight
        };
        if (c && (c != a)) {
            b.left += c.offsetLeft;
            b.top += c.offsetTop;
        }
        return b;
    },
    Client: function (a) {
        this.handlers = {};
        this.id = ZeroClipboard.nextId++;
        this.movieId = "ZeroClipboardMovie_" + this.id;
        ZeroClipboard.register(this.id, this);
        if (a) {
            this.glue(a);
        }
    }
};
ZeroClipboard.Client.prototype = {
    id: 0,
    ready: false,
    movie: null,
    clipText: "",
    handCursorEnabled: true,
    cssEffects: true,
    handlers: null,
    glue: function (d, b, e) {
        this.domElement = ZeroClipboard.$(d);
        var f = 99;
        if (this.domElement.style.zIndex) {
            f = parseInt(this.domElement.style.zIndex, 10) + 1;
        }
        if (typeof (b) == "string") {
            b = ZeroClipboard.$(b);
        } else {
            if (typeof (b) == "undefined") {
                b = document.getElementsByTagName("body")[0];
            }
        }
        var c = ZeroClipboard.getDOMObjectPosition(this.domElement, b);
        this.div = document.createElement("div");
        this.div.className = "zclip";
        this.div.id = "zclip-" + this.movieId;
        $(this.domElement).data("zclipId", "zclip-" + this.movieId);
        var a = this.div.style;
        a.position = "absolute";
        a.left = "" + c.left + "px";
        a.top = "" + c.top + "px";
        a.width = "" + c.width + "px";
        a.height = "" + c.height + "px";
        a.zIndex = f;
        if (typeof (e) == "object") {
            for (addedStyle in e) {
                a[addedStyle] = e[addedStyle];
            }
        }
        b.appendChild(this.div);
        this.div.innerHTML = this.getHTML(c.width, c.height);
    },
    getHTML: function (d, a) {
        var c = "";
        var b = "id=" + this.id + "&width=" + d + "&height=" + a;
        if (navigator.userAgent.match(/MSIE/)) {
            var e = location.href.match(/^https/i) ? "https://" : "http://";
            c += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + e + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + d + '" height="' + a + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + b + '"/><param name="wmode" value="transparent"/></object>';
        } else {
            c += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + d + '" height="' + a + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + b + '" wmode="transparent" />';
        }
        return c;
    },
    hide: function () {
        if (this.div) {
            this.div.style.left = "-2000px";
        }
    },
    show: function () {
        this.reposition();
    },
    destroy: function () {
        if (this.domElement && this.div) {
            this.hide();
            this.div.innerHTML = "";
            var a = document.getElementsByTagName("body")[0];
            try {
                a.removeChild(this.div);
            } catch (b) { }
            this.domElement = null;
            this.div = null;
        }
    },
    reposition: function (c) {
        if (c) {
            this.domElement = ZeroClipboard.$(c);
            if (!this.domElement) {
                this.hide();
            }
        }
        if (this.domElement && this.div) {
            var b = ZeroClipboard.getDOMObjectPosition(this.domElement);
            var a = this.div.style;
            a.left = "" + b.left + "px";
            a.top = "" + b.top + "px";
        }
    },
    setText: function (a) {
        this.clipText = a;
        if (this.ready) {
            this.movie.setText(a);
        }
    },
    addEventListener: function (a, b) {
        a = a.toString().toLowerCase().replace(/^on/, "");
        if (!this.handlers[a]) {
            this.handlers[a] = [];
        }
        this.handlers[a].push(b);
    },
    setHandCursor: function (a) {
        this.handCursorEnabled = a;
        if (this.ready) {
            this.movie.setHandCursor(a);
        }
    },
    setCSSEffects: function (a) {
        this.cssEffects = !!a;
    },
    receiveEvent: function (d, f) {
        d = d.toString().toLowerCase().replace(/^on/, "");
        switch (d) {
            case "load":
                this.movie = document.getElementById(this.movieId);
                if (!this.movie) {
                    var c = this;
                    setTimeout(function () {
                        c.receiveEvent("load", null);
                    },
                        1);
                    return;
                }
                if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                    var c = this;
                    setTimeout(function () {
                        c.receiveEvent("load", null);
                    },
                        100);
                    this.ready = true;
                    return;
                }
                this.ready = true;
                try {
                    this.movie.setText(this.clipText);
                } catch (h) { }
                try {
                    this.movie.setHandCursor(this.handCursorEnabled);
                } catch (h) { }
                break;
            case "mouseover":
                if (this.domElement && this.cssEffects) {
                    this.domElement.addClass("hover");
                    if (this.recoverActive) {
                        this.domElement.addClass("active");
                    }
                }
                break;
            case "mouseout":
                if (this.domElement && this.cssEffects) {
                    this.recoverActive = false;
                    if (this.domElement.hasClass("active")) {
                        this.domElement.removeClass("active");
                        this.recoverActive = true;
                    }
                    this.domElement.removeClass("hover");
                }
                break;
            case "mousedown":
                if (this.domElement && this.cssEffects) {
                    this.domElement.addClass("active");
                }
                break;
            case "mouseup":
                if (this.domElement && this.cssEffects) {
                    this.domElement.removeClass("active");
                    this.recoverActive = false;
                }
                break;
        }
        if (this.handlers[d]) {
            for (var b = 0,
                a = this.handlers[d].length; b < a; b++) {
                var g = this.handlers[d][b];
                if (typeof (g) == "function") {
                    g(this, f);
                } else {
                    if ((typeof (g) == "object") && (g.length == 2)) {
                        g[0][g[1]](this, f);
                    } else {
                        if (typeof (g) == "string") {
                            window[g](this, f);
                        }
                    }
                }
            }
        }
    }
};

/**
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 * t: current time, b: begInnIng value, c: change In value, d: duration
 */
jQuery.easing["jswing"] = jQuery.easing["swing"];
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function (e, f, a, h, g) {
        return jQuery.easing[jQuery.easing.def](e, f, a, h, g);
    },
    easeInQuad: function (e, f, a, h, g) {
        return h * (f /= g) * f + a;
    },
    easeOutQuad: function (e, f, a, h, g) {
        return -h * (f /= g) * (f - 2) + a;
    },
    easeInOutQuad: function (e, f, a, h, g) {
        if ((f /= g / 2) < 1) {
            return h / 2 * f * f + a;
        }
        return -h / 2 * ((--f) * (f - 2) - 1) + a;
    },
    easeInCubic: function (e, f, a, h, g) {
        return h * (f /= g) * f * f + a;
    },
    easeOutCubic: function (e, f, a, h, g) {
        return h * ((f = f / g - 1) * f * f + 1) + a;
    },
    easeInOutCubic: function (e, f, a, h, g) {
        if ((f /= g / 2) < 1) {
            return h / 2 * f * f * f + a;
        }
        return h / 2 * ((f -= 2) * f * f + 2) + a;
    },
    easeInQuart: function (e, f, a, h, g) {
        return h * (f /= g) * f * f * f + a;
    },
    easeOutQuart: function (e, f, a, h, g) {
        return -h * ((f = f / g - 1) * f * f * f - 1) + a;
    },
    easeInOutQuart: function (e, f, a, h, g) {
        if ((f /= g / 2) < 1) {
            return h / 2 * f * f * f * f + a;
        }
        return -h / 2 * ((f -= 2) * f * f * f - 2) + a;
    },
    easeInQuint: function (e, f, a, h, g) {
        return h * (f /= g) * f * f * f * f + a;
    },
    easeOutQuint: function (e, f, a, h, g) {
        return h * ((f = f / g - 1) * f * f * f * f + 1) + a;
    },
    easeInOutQuint: function (e, f, a, h, g) {
        if ((f /= g / 2) < 1) {
            return h / 2 * f * f * f * f * f + a;
        }
        return h / 2 * ((f -= 2) * f * f * f * f + 2) + a;
    },
    easeInSine: function (e, f, a, h, g) {
        return -h * Math.cos(f / g * (Math.PI / 2)) + h + a;
    },
    easeOutSine: function (e, f, a, h, g) {
        return h * Math.sin(f / g * (Math.PI / 2)) + a;
    },
    easeInOutSine: function (e, f, a, h, g) {
        return -h / 2 * (Math.cos(Math.PI * f / g) - 1) + a;
    },
    easeInExpo: function (e, f, a, h, g) {
        return (f == 0) ? a : h * Math.pow(2, 10 * (f / g - 1)) + a;
    },
    easeOutExpo: function (e, f, a, h, g) {
        return (f == g) ? a + h : h * (-Math.pow(2, -10 * f / g) + 1) + a;
    },
    easeInOutExpo: function (e, f, a, h, g) {
        if (f == 0) {
            return a;
        }
        if (f == g) {
            return a + h;
        }
        if ((f /= g / 2) < 1) {
            return h / 2 * Math.pow(2, 10 * (f - 1)) + a;
        }
        return h / 2 * (-Math.pow(2, -10 * --f) + 2) + a;
    },
    easeInCirc: function (e, f, a, h, g) {
        return -h * (Math.sqrt(1 - (f /= g) * f) - 1) + a;
    },
    easeOutCirc: function (e, f, a, h, g) {
        return h * Math.sqrt(1 - (f = f / g - 1) * f) + a;
    },
    easeInOutCirc: function (e, f, a, h, g) {
        if ((f /= g / 2) < 1) {
            return -h / 2 * (Math.sqrt(1 - f * f) - 1) + a;
        }
        return h / 2 * (Math.sqrt(1 - (f -= 2) * f) + 1) + a;
    },
    easeInElastic: function (f, h, e, l, k) {
        var i = 1.70158;
        var j = 0;
        var g = l;
        if (h == 0) {
            return e;
        }
        if ((h /= k) == 1) {
            return e + l;
        }
        if (!j) {
            j = k * 0.3;
        }
        if (g < Math.abs(l)) {
            g = l;
            var i = j / 4;
        } else {
            var i = j / (2 * Math.PI) * Math.asin(l / g);
        }
        return -(g * Math.pow(2, 10 * (h -= 1)) * Math.sin((h * k - i) * (2 * Math.PI) / j)) + e;
    },
    easeOutElastic: function (f, h, e, l, k) {
        var i = 1.70158;
        var j = 0;
        var g = l;
        if (h == 0) {
            return e;
        }
        if ((h /= k) == 1) {
            return e + l;
        }
        if (!j) {
            j = k * 0.3;
        }
        if (g < Math.abs(l)) {
            g = l;
            var i = j / 4;
        } else {
            var i = j / (2 * Math.PI) * Math.asin(l / g);
        }
        return g * Math.pow(2, -10 * h) * Math.sin((h * k - i) * (2 * Math.PI) / j) + l + e;
    },
    easeInOutElastic: function (f, h, e, l, k) {
        var i = 1.70158;
        var j = 0;
        var g = l;
        if (h == 0) {
            return e;
        }
        if ((h /= k / 2) == 2) {
            return e + l;
        }
        if (!j) {
            j = k * (0.3 * 1.5);
        }
        if (g < Math.abs(l)) {
            g = l;
            var i = j / 4;
        } else {
            var i = j / (2 * Math.PI) * Math.asin(l / g);
        }
        if (h < 1) {
            return -0.5 * (g * Math.pow(2, 10 * (h -= 1)) * Math.sin((h * k - i) * (2 * Math.PI) / j)) + e;
        }
        return g * Math.pow(2, -10 * (h -= 1)) * Math.sin((h * k - i) * (2 * Math.PI) / j) * 0.5 + l + e;
    },
    easeInBack: function (e, f, a, i, h, g) {
        if (g == undefined) {
            g = 1.70158;
        }
        return i * (f /= h) * f * ((g + 1) * f - g) + a;
    },
    easeOutBack: function (e, f, a, i, h, g) {
        if (g == undefined) {
            g = 1.70158;
        }
        return i * ((f = f / h - 1) * f * ((g + 1) * f + g) + 1) + a;
    },
    easeInOutBack: function (e, f, a, i, h, g) {
        if (g == undefined) {
            g = 1.70158;
        }
        if ((f /= h / 2) < 1) {
            return i / 2 * (f * f * (((g *= (1.525)) + 1) * f - g)) + a;
        }
        return i / 2 * ((f -= 2) * f * (((g *= (1.525)) + 1) * f + g) + 2) + a;
    },
    easeInBounce: function (e, f, a, h, g) {
        return h - jQuery.easing.easeOutBounce(e, g - f, 0, h, g) + a;
    },
    easeOutBounce: function (e, f, a, h, g) {
        if ((f /= g) < (1 / 2.75)) {
            return h * (7.5625 * f * f) + a;
        } else {
            if (f < (2 / 2.75)) {
                return h * (7.5625 * (f -= (1.5 / 2.75)) * f + 0.75) + a;
            } else {
                if (f < (2.5 / 2.75)) {
                    return h * (7.5625 * (f -= (2.25 / 2.75)) * f + 0.9375) + a;
                } else {
                    return h * (7.5625 * (f -= (2.625 / 2.75)) * f + 0.984375) + a;
                }
            }
        }
    },
    easeInOutBounce: function (e, f, a, h, g) {
        if (f < g / 2) {
            return jQuery.easing.easeInBounce(e, f * 2, 0, h, g) * 0.5 + a;
        }
        return jQuery.easing.easeOutBounce(e, f * 2 - g, 0, h, g) * 0.5 + h * 0.5 + a;
    }
});

/**
 * jQuery Cookie v1.4.1
 * https://github.com/carhartl/jquery-cookie
 * $.cookie('the_cookie'); //读取Cookie值
 * $.cookie('the_cookie', 'the_value'); //设置cookie的值
 * $.cookie('the_cookie', 'the_value', {expires: 7, path: '/', domain: 'jquery.com', secure: true, raw: true});
 * expires：有效期，以天数为单位
 * path：默认情况，只有设置cookie的网页才能读取该cookie
 * domain：创建cookie的网页所拥有的域名
 * secure：如果为true，cookie的传输需要使用安全协议（HTTPS）
 * raw：读取和写入的时候自动进行编码，要关闭这功能设置为true即可
 */
!
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? a(require("jquery")) : a(jQuery);
    }(function (a) {
        function c(a) {
            return h.raw ? a : encodeURIComponent(a);
        }
        function d(a) {
            return h.raw ? a : decodeURIComponent(a);
        }
        function e(a) {
            return c(h.json ? JSON.stringify(a) : String(a));
        }
        function f(a) {
            0 === a.indexOf('"') && (a = a.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
            try {
                return a = decodeURIComponent(a.replace(b, " ")),
                    h.json ? JSON.parse(a) : a;
            } catch (c) { }
        }
        function g(b, c) {
            var d = h.raw ? b : f(b);
            return a.isFunction(c) ? c(d) : d;
        }
        var b = /\+/g,
            h = a.cookie = function (b, f, i) {
                if (arguments.length > 1 && !a.isFunction(f)) {
                    if (i = a.extend({},
                        h.defaults, i), "number" == typeof i.expires) {
                        var j = i.expires,
                            k = i.expires = new Date;
                        k.setTime(+k + 864e5 * j);
                    }
                    return document.cookie = [c(b), "=", e(f), i.expires ? "; expires=" + i.expires.toUTCString() : "", i.path ? "; path=" + i.path : "", i.domain ? "; domain=" + i.domain : "", i.secure ? "; secure" : ""].join("");
                }
                for (var l = b ? void 0 : {},
                    m = document.cookie ? document.cookie.split("; ") : [], n = 0, o = m.length; o > n; n++) {
                    var p = m[n].split("="),
                        q = d(p.shift()),
                        r = p.join("=");
                    if (b && b === q) {
                        l = g(r, f);
                        break;
                    }
                    b || void 0 === (r = g(r)) || (l[q] = r);
                }
                return l;
            };
        h.defaults = {},
            a.removeCookie = function (b, c) {
                return void 0 === a.cookie(b) ? !1 : (a.cookie(b, "", a.extend({},
                    c, {
                        expires: -1
                    })), !a.cookie(b));
            };
    });

/**
 * 快捷键 mousetrap v1.4.6
 * http://craig.is/killing/mice
 */
(function (J, r, f) {
    function s(a, b, d) {
        a.addEventListener ? a.addEventListener(b, d, !1) : a.attachEvent("on" + b, d);
    }
    function A(a) {
        if ("keypress" == a.type) {
            var b = String.fromCharCode(a.which);
            a.shiftKey || (b = b.toLowerCase());
            return b;
        }
        return h[a.which] ? h[a.which] : B[a.which] ? B[a.which] : String.fromCharCode(a.which).toLowerCase();
    }
    function t(a) {
        a = a || {};
        var b = !1,
            d;
        for (d in n) a[d] ? b = !0 : n[d] = 0;
        b || (u = !1);
    }
    function C(a, b, d, c, e, v) {
        var g, k, f = [],
            h = d.type;
        if (!l[a]) return [];
        "keyup" == h && w(a) && (b = [a]);
        for (g = 0; g < l[a].length; ++g) if (k = l[a][g], !(!c && k.seq && n[k.seq] != k.level || h != k.action || ("keypress" != h || d.metaKey || d.ctrlKey) && b.sort().join(",") !== k.modifiers.sort().join(","))) {
            var m = c && k.seq == c && k.level == v; (!c && k.combo == e || m) && l[a].splice(g, 1);
            f.push(k);
        }
        return f;
    }
    function K(a) {
        var b = [];
        a.shiftKey && b.push("shift");
        a.altKey && b.push("alt");
        a.ctrlKey && b.push("ctrl");
        a.metaKey && b.push("meta");
        return b;
    }
    function x(a, b, d, c) {
        m.stopCallback(b, b.target || b.srcElement, d, c) || !1 !== a(b, d) || (b.preventDefault ? b.preventDefault() : b.returnValue = !1, b.stopPropagation ? b.stopPropagation() : b.cancelBubble = !0);
    }
    function y(a) {
        "number" !== typeof a.which && (a.which = a.keyCode);
        var b = A(a);
        b && ("keyup" == a.type && z === b ? z = !1 : m.handleKey(b, K(a), a));
    }
    function w(a) {
        return "shift" == a || "ctrl" == a || "alt" == a || "meta" == a;
    }
    function L(a, b, d, c) {
        function e(b) {
            return function () {
                u = b; ++n[a];
                clearTimeout(D);
                D = setTimeout(t, 1E3);
            };
        }
        function v(b) {
            x(d, b, a);
            "keyup" !== c && (z = A(b));
            setTimeout(t, 10);
        }
        for (var g = n[a] = 0; g < b.length; ++g) {
            var f = g + 1 === b.length ? v : e(c || E(b[g + 1]).action);
            F(b[g], f, c, a, g);
        }
    }
    function E(a, b) {
        var d, c, e, f = [];
        d = "+" === a ? ["+"] : a.split("+");
        for (e = 0; e < d.length; ++e) c = d[e],
            G[c] && (c = G[c]),
            b && "keypress" != b && H[c] && (c = H[c], f.push("shift")),
            w(c) && f.push(c);
        d = c;
        e = b;
        if (!e) {
            if (!p) {
                p = {};
                for (var g in h) 95 < g && 112 > g || h.hasOwnProperty(g) && (p[h[g]] = g);
            }
            e = p[d] ? "keydown" : "keypress";
        }
        "keypress" == e && f.length && (e = "keydown");
        return {
            key: c,
            modifiers: f,
            action: e
        };
    }
    function F(a, b, d, c, e) {
        q[a + ":" + d] = b;
        a = a.replace(/\s+/g, " ");
        var f = a.split(" ");
        1 < f.length ? L(a, f, b, d) : (d = E(a, d), l[d.key] = l[d.key] || [], C(d.key, d.modifiers, {
            type: d.action
        },
            c, a, e), l[d.key][c ? "unshift" : "push"]({
                callback: b,
                modifiers: d.modifiers,
                action: d.action,
                seq: c,
                level: e,
                combo: a
            }));
    }
    var h = {
        8: "backspace",
        9: "tab",
        13: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        20: "capslock",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "ins",
        46: "del",
        91: "meta",
        93: "meta",
        224: "meta"
    },
        B = {
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'"
        },
        H = {
            "~": "`",
            "!": "1",
            "@": "2",
            "#": "3",
            $: "4",
            "%": "5",
            "^": "6",
            "&": "7",
            "*": "8",
            "(": "9",
            ")": "0",
            _: "-",
            "+": "=",
            ":": ";",
            '"': "'",
            "<": ",",
            ">": ".",
            "?": "/",
            "|": "\\"
        },
        G = {
            option: "alt",
            command: "meta",
            "return": "enter",
            escape: "esc",
            mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
        },
        p,
        l = {},
        q = {},
        n = {},
        D,
        z = !1,
        I = !1,
        u = !1;
    for (f = 1; 20 > f; ++f) h[111 + f] = "f" + f;
    for (f = 0; 9 >= f; ++f) h[f + 96] = f;
    s(r, "keypress", y);
    s(r, "keydown", y);
    s(r, "keyup", y);
    var m = {
        bind: function (a, b, d) {
            a = a instanceof Array ? a : [a];
            for (var c = 0; c < a.length; ++c) F(a[c], b, d);
            return this;
        },
        unbind: function (a, b) {
            return m.bind(a,
                function () { },
                b);
        },
        trigger: function (a, b) {
            if (q[a + ":" + b]) q[a + ":" + b]({},
                a);
            return this;
        },
        reset: function () {
            l = {};
            q = {};
            return this;
        },
        stopCallback: function (a, b) {
            return -1 < (" " + b.className + " ").indexOf(" mousetrap ") ? !1 : "INPUT" == b.tagName || "SELECT" == b.tagName || "TEXTAREA" == b.tagName || b.isContentEditable;
        },
        handleKey: function (a, b, d) {
            var c = C(a, b, d),
                e;
            b = {};
            var f = 0,
                g = !1;
            for (e = 0; e < c.length; ++e) c[e].seq && (f = Math.max(f, c[e].level));
            for (e = 0; e < c.length; ++e) c[e].seq ? c[e].level == f && (g = !0, b[c[e].seq] = 1, x(c[e].callback, d, c[e].combo, c[e].seq)) : g || x(c[e].callback, d, c[e].combo);
            c = "keypress" == d.type && I;
            d.type != u || w(a) || c || t(b);
            I = g && "keydown" == d.type;
        }
    };
    J.Mousetrap = m;
    "function" === typeof define && define.amd && define(m);
})(window, document);

/**
 * jquery.mousewheel 3.1.12
 * https://github.com/brandonaaron/jquery-mousewheel/
 */
!
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery);
    }(function (a) {
        function b(b) {
            var g = b || window.event,
                h = i.call(arguments, 1),
                j = 0,
                l = 0,
                m = 0,
                n = 0,
                o = 0,
                p = 0;
            if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) {
                if (1 === g.deltaMode) {
                    var q = a.data(this, "mousewheel-line-height");
                    j *= q,
                        m *= q,
                        l *= q;
                } else if (2 === g.deltaMode) {
                    var r = a.data(this, "mousewheel-page-height");
                    j *= r,
                        m *= r,
                        l *= r;
                }
                if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) {
                    var s = this.getBoundingClientRect();
                    o = b.clientX - s.left,
                        p = b.clientY - s.top;
                }
                return b.deltaX = l,
                    b.deltaY = m,
                    b.deltaFactor = f,
                    b.offsetX = o,
                    b.offsetY = p,
                    b.deltaMode = 0,
                    h.unshift(b, j, l, m),
                    e && clearTimeout(e),
                    e = setTimeout(c, 200),
                    (a.event.dispatch || a.event.handle).apply(this, h);
            }
        }
        function c() {
            f = null;
        }
        function d(a, b) {
            return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0;
        }
        var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
            h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
            i = Array.prototype.slice;
        if (a.event.fixHooks) for (var j = g.length; j;) a.event.fixHooks[g[--j]] = a.event.mouseHooks;
        var k = a.event.special.mousewheel = {
            version: "3.1.12",
            setup: function () {
                if (this.addEventListener) for (var c = h.length; c;) this.addEventListener(h[--c], b, !1);
                else this.onmousewheel = b;
                a.data(this, "mousewheel-line-height", k.getLineHeight(this)),
                    a.data(this, "mousewheel-page-height", k.getPageHeight(this));
            },
            teardown: function () {
                if (this.removeEventListener) for (var c = h.length; c;) this.removeEventListener(h[--c], b, !1);
                else this.onmousewheel = null;
                a.removeData(this, "mousewheel-line-height"),
                    a.removeData(this, "mousewheel-page-height");
            },
            getLineHeight: function (b) {
                var c = a(b),
                    d = c["offsetParent" in a.fn ? "offsetParent" : "parent"]();
                return d.length || (d = a("body")),
                    parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16;
            },
            getPageHeight: function (b) {
                return a(b).height();
            },
            settings: {
                adjustOldDeltas: !0,
                normalizeOffset: !0
            }
        };
        a.fn.extend({
            mousewheel: function (a) {
                return a ? this.bind("mousewheel", a) : this.trigger("mousewheel");
            },
            unmousewheel: function (a) {
                return this.unbind("mousewheel", a);
            }
        });
    });

/**
 * 分页插件 jquery_pagination 修改版
 * http://hooray.github.com/jquery.pagination/
 */
(function ($) {
    $.PaginationCalculator = function (maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts;
    };
    $.extend($.PaginationCalculator.prototype, {
        numPages: function () {
            return Math.ceil(this.maxentries / this.opts.items_per_page);
        },
        getInterval: function (current_page) {
            var ne_half = Math.floor(this.opts.num_display_entries / 2);
            var np = this.numPages();
            var upper_limit = np - this.opts.num_display_entries;
            var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
            var end = current_page > ne_half ? Math.min(current_page + ne_half + (this.opts.num_display_entries % 2), np) : Math.min(this.opts.num_display_entries, np);
            return {
                start: start,
                end: end
            };
        }
    });
    $.PaginationRenderers = {};
    $.PaginationRenderers.defaultRenderer = function (maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts;
        this.pc = new $.PaginationCalculator(maxentries, opts);
    };
    $.extend($.PaginationRenderers.defaultRenderer.prototype, {
        createLink: function (page_id, current_page, appendopts) {
            var lnk, np = this.pc.numPages();
            page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1);
            appendopts = $.extend({
                text: page_id + 1,
                classes: ""
            },
                appendopts || {});
            if (page_id == current_page) {
                if (isNaN(appendopts.text)) {
                    lnk = $("<li class='disabled'><a>" + appendopts.text + "</a></li>");
                } else {
                    lnk = $("<li class='active'><a>" + appendopts.text + "</a></li>");
                }
            } else {
                lnk = $("<li><a href='" + this.opts.link_to.replace(/__id__/, page_id) + "'>" + appendopts.text + "</a></li>");
            }
            if (appendopts.classes) {
                lnk.addClass(appendopts.classes);
            }
            lnk.data("page_id", page_id);
            return lnk;
        },
        appendRange: function (container, current_page, start, end, opts) {
            var i;
            for (i = start; i < end; i++) {
                this.createLink(i, current_page, opts).appendTo(container);
            }
        },
        getLinks: function (current_page, eventHandler) {
            current_page = parseInt(current_page);
            var begin, end, interval = this.pc.getInterval(current_page),
                np = this.pc.numPages(),
                fragment = $("<ul></ul>");
            if (this.opts.prev_text && (current_page > 0 || this.opts.prev_show_always)) {
                fragment.append(this.createLink(current_page - 1, current_page, {
                    text: this.opts.prev_text,
                    classes: "prev"
                }));
            }
            if (interval.start > 0 && this.opts.num_edge_entries > 0) {
                end = Math.min(this.opts.num_edge_entries, interval.start);
                this.appendRange(fragment, current_page, 0, end, {
                    classes: "sp"
                });
                if (this.opts.num_edge_entries < interval.start && this.opts.ellipse_text) {
                    $("<li class='disabled'><a>" + this.opts.ellipse_text + "</a></li>").appendTo(fragment);
                }
            }
            this.appendRange(fragment, current_page, interval.start, interval.end);
            if (interval.end < np && this.opts.num_edge_entries > 0) {
                if (np - this.opts.num_edge_entries > interval.end && this.opts.ellipse_text) {
                    $("<li class='disabled'><a>" + this.opts.ellipse_text + "</a></li>").appendTo(fragment);
                }
                begin = Math.max(np - this.opts.num_edge_entries, interval.end);
                this.appendRange(fragment, current_page, begin, np, {
                    classes: "ep"
                });
            }
            if (this.opts.next_text && (current_page < np - 1 || this.opts.next_show_always)) {
                fragment.append(this.createLink(current_page + 1, current_page, {
                    text: this.opts.next_text,
                    classes: "next"
                }));
            }
            $("li:not(.disabled, .active) a", fragment).click(eventHandler);
            return fragment;
        }
    });
    $.fn.pagination = function (maxentries, opts) {

        opts = $.extend({
            items_per_page: 10,
            num_display_entries: 11,
            current_page: 0,
            num_edge_entries: 0,
            link_to: "javascript:;",
            prev_text: "Prev",
            next_text: "Next",
            ellipse_text: "...",
            prev_show_always: true,
            next_show_always: true,
            renderer: "defaultRenderer",
            load_first_page: false,
            callback: function () {
                return false;
            }
        },
            opts || {});
        var containers = this,
            renderer, links, current_page;
        function paginationClickHandler(evt) {
            var links, new_current_page = $(evt.target).parent().data("page_id"),
                continuePropagation = selectPage(new_current_page);
            if (!continuePropagation) {
                evt.stopPropagation();
            }
            return continuePropagation;
        }
        function selectPage(new_current_page) {
            containers.data("current_page", new_current_page);
            links = renderer.getLinks(new_current_page, paginationClickHandler);
            containers.empty();
            links.appendTo(containers);
            var continuePropagation = opts.callback(new_current_page, containers);
            return continuePropagation;
        }
        current_page = opts.current_page;
        containers.data("current_page", current_page);
        maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;
        if (!$.PaginationRenderers[opts.renderer]) {
            throw new ReferenceError("Pagination renderer '" + opts.renderer + "' was not found in jQuery.PaginationRenderers object.");
        }
        renderer = new $.PaginationRenderers[opts.renderer](maxentries, opts);
        var pc = new $.PaginationCalculator(maxentries, opts);
        var np = pc.numPages();
        containers.off("setPage").on("setPage", {
            numPages: np
        },
            function (evt, page_id) {
                if (page_id >= 0 && page_id < evt.data.numPages) {
                    selectPage(page_id);
                    return false;
                }
            });
        containers.off("prevPage").on("prevPage",
            function (evt) {
                var current_page = $(this).data("current_page");
                if (current_page > 0) {
                    selectPage(current_page - 1);
                }
                return false;
            });
        containers.off("nextPage").on("nextPage", {
            numPages: np
        },
            function (evt) {
                var current_page = $(this).data("current_page");
                if (current_page < evt.data.numPages - 1) {
                    selectPage(current_page + 1);
                }
                return false;
            });
        containers.off("currentPage").on("currentPage",
            function () {
                var current_page = $(this).data("current_page");
                selectPage(current_page);
                return false;
            });
        links = renderer.getLinks(current_page, paginationClickHandler);
        containers.empty();
        links.appendTo(containers);
        if (opts.load_first_page) {
            opts.callback(current_page, containers);
        }
    };
})(jQuery);

/**
 * 腾讯UED提示信息
 * ZENG.msgbox.show("服务器繁忙，请稍后再试。", 1, 2000);
 * ZENG.msgbox.show("设置成功！", 4, 2000);
 * ZENG.msgbox.show("数据拉取失败", 5, 2000);
 * ZENG.msgbox.show("正在加载中，请稍后...", 6,8000);
 */
window.ZENG = window.ZENG || {};
ZENG.dom = {
    getById: function (id) {
        return document.getElementById(id);
    }, get: function (e) {
        return (typeof (e) == "string") ? document.getElementById(e) : e;
    }, createElementIn: function (tagName, elem, insertFirst, attrs) {
        var _e = (elem = ZENG.dom.get(elem) || document.body).ownerDocument.createElement(tagName || "div"), k;
        if (typeof (attrs) == 'object') {
            for (k in attrs) {
                if (k == "class") {
                    _e.className = attrs[k];
                } else if (k == "style") {
                    _e.style.cssText = attrs[k];
                } else {
                    _e[k] = attrs[k];
                }
            }
        }
        insertFirst ? elem.insertBefore(_e, elem.firstChild) : elem.appendChild(_e);
        return _e;
    }, getStyle: function (el, property) {
        el = ZENG.dom.get(el);
        if (!el || el.nodeType == 9) {
            return null;
        }
        var w3cMode = document.defaultView && document.defaultView.getComputedStyle, computed = !w3cMode ? null : document.defaultView.getComputedStyle(el, ''), value = "";
        switch (property) {
            case "float":
                property = w3cMode ? "cssFloat" : "styleFloat";
                break;
            case "opacity":
                if (!w3cMode) {
                    var val = 100;
                    try {
                        val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                    } catch (e) {
                        try {
                            val = el.filters('alpha').opacity;
                        } catch (e) {
                        }
                    }
                    return val / 100;
                } else {
                    return parseFloat((computed || el.style)[property]);
                }
                break;
            case "backgroundPositionX":
                if (w3cMode) {
                    property = "backgroundPosition";
                    return ((computed || el.style)[property]).split(" ")[0];
                }
                break;
            case "backgroundPositionY":
                if (w3cMode) {
                    property = "backgroundPosition";
                    return ((computed || el.style)[property]).split(" ")[1];
                }
                break;
        }
        if (w3cMode) {
            return (computed || el.style)[property];
        } else {
            return (el.currentStyle[property] || el.style[property]);
        }
    }, setStyle: function (el, properties, value) {
        if (!(el = ZENG.dom.get(el)) || el.nodeType != 1) {
            return false;
        }
        var tmp, bRtn = true, w3cMode = (tmp = document.defaultView) && tmp.getComputedStyle, rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;
        if (typeof (properties) == 'string') {
            tmp = properties;
            properties = {};
            properties[tmp] = value;
        }
        for (var prop in properties) {
            value = properties[prop];
            if (prop == 'float') {
                prop = w3cMode ? "cssFloat" : "styleFloat";
            } else if (prop == 'opacity') {
                if (!w3cMode) {
                    prop = 'filter';
                    value = value >= 1 ? '' : ('alpha(opacity=' + Math.round(value * 100) + ')');
                }
            } else if (prop == 'backgroundPositionX' || prop == 'backgroundPositionY') {
                tmp = prop.slice(-1) == 'X' ? 'Y' : 'X';
                if (w3cMode) {
                    var v = ZENG.dom.getStyle(el, "backgroundPosition" + tmp);
                    prop = 'backgroundPosition';
                    typeof (value) == 'number' && (value = value + 'px');
                    value = tmp == 'Y' ? (value + " " + (v || "top")) : ((v || 'left') + " " + value);
                }
            }
            if (typeof el.style[prop] != "undefined") {
                el.style[prop] = value + (typeof value === "number" && !rexclude.test(prop) ? 'px' : '');
                bRtn = bRtn && true;
            } else {
                bRtn = bRtn && false;
            }
        }
        return bRtn;
    }, getScrollTop: function (doc) {
        var _doc = doc || document;
        return Math.max(_doc.documentElement.scrollTop, _doc.body.scrollTop);
    }, getClientHeight: function (doc) {
        var _doc = doc || document;
        return _doc.compatMode == "CSS1Compat" ? _doc.documentElement.clientHeight : _doc.body.clientHeight;
    }
};
ZENG.string = {
    RegExps: { trim: /^\s+|\s+$/g, ltrim: /^\s+/, rtrim: /\s+$/, nl2br: /\n/g, s2nb: /[\x20]{2}/g, URIencode: /[\x09\x0A\x0D\x20\x21-\x29\x2B\x2C\x2F\x3A-\x3F\x5B-\x5E\x60\x7B-\x7E]/g, escHTML: { re_amp: /&/g, re_lt: /</g, re_gt: />/g, re_apos: /\x27/g, re_quot: /\x22/g }, escString: { bsls: /\\/g, sls: /\//g, nl: /\n/g, rt: /\r/g, tab: /\t/g }, restXHTML: { re_amp: /&amp;/g, re_lt: /&lt;/g, re_gt: /&gt;/g, re_apos: /&(?:apos|#0?39);/g, re_quot: /&quot;/g }, write: /\{(\d{1,2})(?:\:([xodQqb]))?\}/g, isURL: /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i, cut: /[\x00-\xFF]/, getRealLen: { r0: /[^\x00-\xFF]/g, r1: /[\x00-\xFF]/g }, format: /\{([\d\w\.]+)\}/g }, commonReplace: function (s, p, r) {
        return s.replace(p, r);
    }, format: function (str) {
        var args = Array.prototype.slice.call(arguments), v;
        str = String(args.shift());
        if (args.length == 1 && typeof (args[0]) == 'object') {
            args = args[0];
        }
        ZENG.string.RegExps.format.lastIndex = 0;
        return str.replace(ZENG.string.RegExps.format, function (m, n) {
            v = ZENG.object.route(args, n);
            return v === undefined ? m : v;
        });
    }
};
ZENG.object = {
    routeRE: /([\d\w_]+)/g,
    route: function (obj, path) {
        obj = obj || {};
        path = String(path);
        var r = ZENG.object.routeRE, m;
        r.lastIndex = 0;
        while ((m = r.exec(path)) !== null) {
            obj = obj[m[0]];
            if (obj === undefined || obj === null) {
                break;
            }
        }
        return obj;
    }
};
var ua = ZENG.userAgent = {}, agent = navigator.userAgent;
ua.ie = 9 - ((agent.indexOf('Trident/5.0') > -1) ? 0 : 1) - (window.XDomainRequest ? 0 : 1) - (window.XMLHttpRequest ? 0 : 1);

if (typeof (ZENG.msgbox) == 'undefined') {
    ZENG.msgbox = {};
}
ZENG.msgbox._timer = null;
ZENG.msgbox.loadingAnimationPath = ZENG.msgbox.loadingAnimationPath || ("loading.gif");
ZENG.msgbox.show = function (msgHtml, type, timeout, opts) {
    if (typeof (opts) == 'number') {
        opts = { topPosition: opts };
    }
    opts = opts || {};
    var _s = ZENG.msgbox,
        template = '<span class="zeng_msgbox_layer zeng_msgbox_layer_{layerStyle}" style="display:none;z-index:10000;" id="mode_tips_v2"><span class="gtl_ico_{type}"></span>{loadIcon}{msgHtml}<span class="gtl_end"></span></span>', loading = '<span class="gtl_ico_loading"></span>', typeClass = [0, 0, 0, 0, "succ", "fail", "clear"], mBox, tips;
    _s._loadCss && _s._loadCss(opts.cssPath);
    mBox = ZENG.dom.get("q_Msgbox") || ZENG.dom.createElementIn("div", document.body, false, { className: "zeng_msgbox_layer_wrap" });
    mBox.id = "q_Msgbox";
    mBox.style.display = "";
    mBox.innerHTML = ZENG.string.format(template, { type: typeClass[type] || "hits", msgHtml: msgHtml || "", loadIcon: type == 6 ? loading : "", layerStyle: type == 6 ? 'loading' : "normal" });
    _s._setPosition(mBox, timeout, opts.topPosition);
};
ZENG.msgbox._setPosition = function (tips, timeout, topPosition) {
    timeout = timeout || 5000;
    var _s = ZENG.msgbox, bt = ZENG.dom.getScrollTop(), ch = ZENG.dom.getClientHeight(), t = Math.floor(ch / 2) - 40;
    ZENG.dom.setStyle(tips, "top", ((document.compatMode == "BackCompat" || ZENG.userAgent.ie < 7) ? bt : 0) + ((typeof (topPosition) == "number") ? topPosition : t) + "px");
    clearTimeout(_s._timer);
    tips.firstChild.style.display = "";

    timeout && (_s._timer = setTimeout(_s.hide, timeout));
};
ZENG.msgbox.hide = function (timeout) {
    var _s = ZENG.msgbox;
    if (timeout) {
        clearTimeout(_s._timer);
        _s._timer = setTimeout(_s._hide, timeout);
    } else {
        _s._hide();
    }
};
ZENG.msgbox._hide = function () {
    var _mBox = ZENG.dom.get("q_Msgbox"), _s = ZENG.msgbox;
    clearTimeout(_s._timer);
    if (_mBox) {
        var _tips = _mBox.firstChild;
        ZENG.dom.setStyle(_mBox, "display", "none");
    }
};

if (typeof define === "function") {
    // AMD. Register as an anonymous module.
    module.exports = ZENG;
} else {
    window.ZENG = ZENG;
}

ZENG.msgbox.info = function (msg, timeout) {
    ZENG.msgbox.show(msg, 1, timeout || 2000);
};
ZENG.msgbox.success = function (msg, timeout) {
    ZENG.msgbox.show(msg, 4, timeout || 2000);
};
ZENG.msgbox.fail = function (msg, timeout) {
    ZENG.msgbox.show(msg, 5, timeout || 2000);
};
ZENG.msgbox.loading = function (msg) {
    ZENG.msgbox.show(msg, 6, 10000);
};
ZENG.msgbox.close = function () {
    ZENG.msgbox._hide()
};

/**
 * 全屏插件
 * http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/
 */
(function () {
    var d = {
        supportsFullScreen: false,
        isFullScreen: function () {
            return false;
        },
        requestFullScreen: function () { },
        cancelFullScreen: function () { },
        fullScreenEventName: "",
        prefix: ""
    },
        c = "webkit moz o ms khtml".split(" ");
    if (typeof document.cancelFullScreen != "undefined") {
        d.supportsFullScreen = true;
    } else {
        for (var b = 0,
            a = c.length; b < a; b++) {
            d.prefix = c[b];
            if (typeof document[d.prefix + "CancelFullScreen"] != "undefined") {
                d.supportsFullScreen = true;
                break;
            }
        }
    }
    if (d.supportsFullScreen) {
        d.fullScreenEventName = d.prefix + "fullscreenchange";
        d.isFullScreen = function () {
            switch (this.prefix) {
                case "":
                    return document.fullScreen;
                case "webkit":
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + "FullScreen"];
            }
        };
        d.requestFullScreen = function (e) {
            return (this.prefix === "") ? e.requestFullScreen() : e[this.prefix + "RequestFullScreen"]();
        };
        d.cancelFullScreen = function (e) {
            return (this.prefix === "") ? document.cancelFullScreen() : document[this.prefix + "CancelFullScreen"]();
        };
    }
    if (typeof jQuery != "undefined") {
        jQuery.fn.requestFullScreen = function () {
            return this.each(function () {
                if (d.supportsFullScreen) {
                    d.requestFullScreen(this);
                }
            });
        };
    }
    window.fullScreenApi = d;
})();

/**
 * artTemplate 3.0 - Template Engine
 * https://github.com/aui/artTemplate
 */
!
    function () {
        function a(a) {
            return a.replace(t, "").replace(u, ",").replace(v, "").replace(w, "").replace(x, "").split(y);
        }
        function b(a) {
            return "'" + a.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'";
        }
        function c(c, d) {
            function e(a) {
                return m += a.split(/\n/).length - 1,
                    k && (a = a.replace(/\s+/g, " ").replace(/<!--[\w\W]*?-->/g, "")),
                    a && (a = s[1] + b(a) + s[2] + "\n"),
                    a;
            }
            function f(b) {
                var c = m;
                if (j ? b = j(b, d) : g && (b = b.replace(/\n/g,
                    function () {
                        return m++,
                            "$line=" + m + ";";
                })), 0 === b.indexOf("=")) {
                    var e = l && !/^=[=#]/.test(b);
                    if (b = b.replace(/^=[=#]?|[\s;]*$/g, ""), e) {
                        var f = b.replace(/\s*\([^\)]+\)/, "");
                        n[f] || /^(include|print)$/.test(f) || (b = "$escape(" + b + ")");
                    } else b = "$string(" + b + ")";
                    b = s[1] + b + s[2];
                }
                return g && (b = "$line=" + c + ";" + b),
                    r(a(b),
                        function (a) {
                            if (a && !p[a]) {
                                var b;
                                b = "print" === a ? u : "include" === a ? v : n[a] ? "$utils." + a : o[a] ? "$helpers." + a : "$data." + a,
                                    w += a + "=" + b + ",",
                                    p[a] = !0;
                            }
                        }),
                    b + "\n";
            }
            var g = d.debug,
                h = d.openTag,
                i = d.closeTag,
                j = d.parser,
                k = d.compress,
                l = d.escape,
                m = 1,
                p = {
                    $data: 1,
                    $filename: 1,
                    $utils: 1,
                    $helpers: 1,
                    $out: 1,
                    $line: 1
                },
                q = "".trim,
                s = q ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"],
                t = q ? "$out+=text;return $out;" : "$out.push(text);",
                u = "function(){var text=''.concat.apply('',arguments);" + t + "}",
                v = "function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);" + t + "}",
                w = "'use strict';var $utils=this,$helpers=$utils.$helpers," + (g ? "$line=0," : ""),
                x = s[0],
                y = "return new String(" + s[3] + ");";
            r(c.split(h),
                function (a) {
                    a = a.split(i);
                    var b = a[0],
                        c = a[1];
                    1 === a.length ? x += e(b) : (x += f(b), c && (x += e(c)));
                });
            var z = w + x + y;
            g && (z = "try{" + z + "}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:" + b(c) + ".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");
            try {
                var A = new Function("$data", "$filename", z);
                return A.prototype = n,
                    A;
            } catch (B) {
                throw B.temp = "function anonymous($data,$filename) {" + z + "}",
                B;
            }
        }
        var d = function (a, b) {
            return "string" == typeof b ? q(b, {
                filename: a
            }) : g(a, b);
        };
        d.version = "3.0.0",
            d.config = function (a, b) {
                e[a] = b;
            };
        var e = d.defaults = {
            openTag: "<%",
            closeTag: "%>",
            escape: !0,
            cache: !0,
            compress: !1,
            parser: null
        },
            f = d.cache = {};
        d.render = function (a, b) {
            return q(a, b);
        };
        var g = d.renderFile = function (a, b) {
            var c = d.get(a) || p({
                filename: a,
                name: "Render Error",
                message: "Template not found"
            });
            return b ? c(b) : c;
        };
        d.get = function (a) {
            var b;
            if (f[a]) b = f[a];
            else if ("object" == typeof document) {
                var c = document.getElementById(a);
                if (c) {
                    var d = (c.value || c.innerHTML).replace(/^\s*|\s*$/g, "");
                    b = q(d, {
                        filename: a
                    });
                }
            }
            return b;
        };
        var h = function (a, b) {
            return "string" != typeof a && (b = typeof a, "number" === b ? a += "" : a = "function" === b ? h(a.call(a)) : ""),
                a;
        },
            i = {
                "<": "&#60;",
                ">": "&#62;",
                '"': "&#34;",
                "'": "&#39;",
                "&": "&#38;"
            },
            j = function (a) {
                return i[a];
            },
            k = function (a) {
                return h(a).replace(/&(?![\w#]+;)|[<>"']/g, j);
            },
            l = Array.isArray ||
                function (a) {
                    return "[object Array]" === {}.toString.call(a);
                },
            m = function (a, b) {
                var c, d;
                if (l(a)) for (c = 0, d = a.length; d > c; c++) b.call(a, a[c], c, a);
                else for (c in a) b.call(a, a[c], c);
            },
            n = d.utils = {
                $helpers: {},
                $include: g,
                $string: h,
                $escape: k,
                $each: m
            };
        d.helper = function (a, b) {
            o[a] = b;
        };
        var o = d.helpers = n.$helpers;
        d.onerror = function (a) {
            var b = "Template Error\n\n";
            for (var c in a) b += "<" + c + ">\n" + a[c] + "\n\n";
            "object" == typeof console && console.error(b);
        };
        var p = function (a) {
            return d.onerror(a),
                function () {
                    return "{Template Error}";
                };
        },
            q = d.compile = function (a, b) {
                function d(c) {
                    try {
                        return new i(c, h) + "";
                    } catch (d) {
                        return b.debug ? p(d)() : (b.debug = !0, q(a, b)(c));
                    }
                }
                b = b || {};
                for (var g in e) void 0 === b[g] && (b[g] = e[g]);
                var h = b.filename;
                try {
                    var i = c(a, b);
                } catch (j) {
                    return j.filename = h || "anonymous",
                        j.name = "Syntax Error",
                        p(j);
                }
                return d.prototype = i.prototype,
                    d.toString = function () {
                        return i.toString();
                    },
                    h && b.cache && (f[h] = d),
                    d;
            },
            r = n.$each,
            s = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",
            t = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,
            u = /[^\w$]+/g,
            v = new RegExp(["\\b" + s.replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g"),
            w = /^\d[^,]*|,\d[^,]*/g,
            x = /^,+|,+$/g,
            y = /^$|,+/;
        "function" == typeof define ? define(function () {
            return d;
        }) : "undefined" != typeof exports ? module.exports = d : this.template = d;
    }();

//https://github.com/h5bp/html5-boilerplate
(function () {
    var method;
    var noop = function () { };
    var methods = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd", "timeStamp", "trace", "warn"];
    var length = methods.length;
    var console = (window.console = window.console || {});
    while (length--) {
        method = methods[length];
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

