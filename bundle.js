(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * A fast javascript implementation of simplex noise by Jonas Wagner
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 *
 *
 * Copyright (C) 2016 Jonas Wagner
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
(function() {
'use strict';

var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
var F3 = 1.0 / 3.0;
var G3 = 1.0 / 6.0;
var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

function SimplexNoise(random) {
  if (!random) random = Math.random;
  this.p = buildPermutationTable(random);
  this.perm = new Uint8Array(512);
  this.permMod12 = new Uint8Array(512);
  for (var i = 0; i < 512; i++) {
    this.perm[i] = this.p[i & 255];
    this.permMod12[i] = this.perm[i] % 12;
  }

}
SimplexNoise.prototype = {
    grad3: new Float32Array([1, 1, 0,
                            -1, 1, 0,
                            1, -1, 0,

                            -1, -1, 0,
                            1, 0, 1,
                            -1, 0, 1,

                            1, 0, -1,
                            -1, 0, -1,
                            0, 1, 1,

                            0, -1, 1,
                            0, 1, -1,
                            0, -1, -1]),
    grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
                            0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
                            1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,
                            -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
                            1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,
                            -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
                            1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,
                            -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
    noise2D: function(xin, yin) {
        var permMod12 = this.permMod12;
        var perm = this.perm;
        var grad3 = this.grad3;
        var n0 = 0; // Noise contributions from the three corners
        var n1 = 0;
        var n2 = 0;
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin) * F2; // Hairy factor for 2D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var t = (i + j) * G2;
        var X0 = i - t; // Unskew the cell origin back to (x,y) space
        var Y0 = j - t;
        var x0 = xin - X0; // The x,y distances from the cell origin
        var y0 = yin - Y0;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
          i1 = 1;
          j1 = 0;
        } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
        else {
          i1 = 0;
          j1 = 1;
        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        var y1 = y0 - j1 + G2;
        var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
        var y2 = y0 - 1.0 + 2.0 * G2;
        // Work out the hashed gradient indices of the three simplex corners
        var ii = i & 255;
        var jj = j & 255;
        // Calculate the contribution from the three corners
        var t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
          var gi0 = permMod12[ii + perm[jj]] * 3;
          t0 *= t0;
          n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
        }
        var t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
          var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
          t1 *= t1;
          n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
        }
        var t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
          var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
          t2 *= t2;
          n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70.0 * (n0 + n1 + n2);
      },
    // 3D simplex noise
    noise3D: function(xin, yin, zin) {
        var permMod12 = this.permMod12;
        var perm = this.perm;
        var grad3 = this.grad3;
        var n0, n1, n2, n3; // Noise contributions from the four corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var k = Math.floor(zin + s);
        var t = (i + j + k) * G3;
        var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
        var Y0 = j - t;
        var Z0 = k - t;
        var x0 = xin - X0; // The x,y,z distances from the cell origin
        var y0 = yin - Y0;
        var z0 = zin - Z0;
        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if (x0 >= y0) {
          if (y0 >= z0) {
            i1 = 1;
            j1 = 0;
            k1 = 0;
            i2 = 1;
            j2 = 1;
            k2 = 0;
          } // X Y Z order
          else if (x0 >= z0) {
            i1 = 1;
            j1 = 0;
            k1 = 0;
            i2 = 1;
            j2 = 0;
            k2 = 1;
          } // X Z Y order
          else {
            i1 = 0;
            j1 = 0;
            k1 = 1;
            i2 = 1;
            j2 = 0;
            k2 = 1;
          } // Z X Y order
        }
        else { // x0<y0
          if (y0 < z0) {
            i1 = 0;
            j1 = 0;
            k1 = 1;
            i2 = 0;
            j2 = 1;
            k2 = 1;
          } // Z Y X order
          else if (x0 < z0) {
            i1 = 0;
            j1 = 1;
            k1 = 0;
            i2 = 0;
            j2 = 1;
            k2 = 1;
          } // Y Z X order
          else {
            i1 = 0;
            j1 = 1;
            k1 = 0;
            i2 = 1;
            j2 = 1;
            k2 = 0;
          } // Y X Z order
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
        var y1 = y0 - j1 + G3;
        var z1 = z0 - k1 + G3;
        var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
        var y2 = y0 - j2 + 2.0 * G3;
        var z2 = z0 - k2 + 2.0 * G3;
        var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
        var y3 = y0 - 1.0 + 3.0 * G3;
        var z3 = z0 - 1.0 + 3.0 * G3;
        // Work out the hashed gradient indices of the four simplex corners
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        // Calculate the contribution from the four corners
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
          var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
          t0 *= t0;
          n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
          var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
          t1 *= t1;
          n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
          var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
          t2 *= t2;
          n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
          var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
          t3 *= t3;
          n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to stay just inside [-1,1]
        return 32.0 * (n0 + n1 + n2 + n3);
      },
    // 4D simplex noise, better simplex rank ordering method 2012-03-09
    noise4D: function(x, y, z, w) {
        var permMod12 = this.permMod12;
        var perm = this.perm;
        var grad4 = this.grad4;

        var n0, n1, n2, n3, n4; // Noise contributions from the five corners
        // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
        var s = (x + y + z + w) * F4; // Factor for 4D skewing
        var i = Math.floor(x + s);
        var j = Math.floor(y + s);
        var k = Math.floor(z + s);
        var l = Math.floor(w + s);
        var t = (i + j + k + l) * G4; // Factor for 4D unskewing
        var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
        var Y0 = j - t;
        var Z0 = k - t;
        var W0 = l - t;
        var x0 = x - X0; // The x,y,z,w distances from the cell origin
        var y0 = y - Y0;
        var z0 = z - Z0;
        var w0 = w - W0;
        // For the 4D case, the simplex is a 4D shape I won't even try to describe.
        // To find out which of the 24 possible simplices we're in, we need to
        // determine the magnitude ordering of x0, y0, z0 and w0.
        // Six pair-wise comparisons are performed between each possible pair
        // of the four coordinates, and the results are used to rank the numbers.
        var rankx = 0;
        var ranky = 0;
        var rankz = 0;
        var rankw = 0;
        if (x0 > y0) rankx++;
        else ranky++;
        if (x0 > z0) rankx++;
        else rankz++;
        if (x0 > w0) rankx++;
        else rankw++;
        if (y0 > z0) ranky++;
        else rankz++;
        if (y0 > w0) ranky++;
        else rankw++;
        if (z0 > w0) rankz++;
        else rankw++;
        var i1, j1, k1, l1; // The integer offsets for the second simplex corner
        var i2, j2, k2, l2; // The integer offsets for the third simplex corner
        var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
        // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
        // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
        // impossible. Only the 24 indices which have non-zero entries make any sense.
        // We use a thresholding to set the coordinates in turn from the largest magnitude.
        // Rank 3 denotes the largest coordinate.
        i1 = rankx >= 3 ? 1 : 0;
        j1 = ranky >= 3 ? 1 : 0;
        k1 = rankz >= 3 ? 1 : 0;
        l1 = rankw >= 3 ? 1 : 0;
        // Rank 2 denotes the second largest coordinate.
        i2 = rankx >= 2 ? 1 : 0;
        j2 = ranky >= 2 ? 1 : 0;
        k2 = rankz >= 2 ? 1 : 0;
        l2 = rankw >= 2 ? 1 : 0;
        // Rank 1 denotes the second smallest coordinate.
        i3 = rankx >= 1 ? 1 : 0;
        j3 = ranky >= 1 ? 1 : 0;
        k3 = rankz >= 1 ? 1 : 0;
        l3 = rankw >= 1 ? 1 : 0;
        // The fifth corner has all coordinate offsets = 1, so no need to compute that.
        var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
        var y1 = y0 - j1 + G4;
        var z1 = z0 - k1 + G4;
        var w1 = w0 - l1 + G4;
        var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
        var y2 = y0 - j2 + 2.0 * G4;
        var z2 = z0 - k2 + 2.0 * G4;
        var w2 = w0 - l2 + 2.0 * G4;
        var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
        var y3 = y0 - j3 + 3.0 * G4;
        var z3 = z0 - k3 + 3.0 * G4;
        var w3 = w0 - l3 + 3.0 * G4;
        var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
        var y4 = y0 - 1.0 + 4.0 * G4;
        var z4 = z0 - 1.0 + 4.0 * G4;
        var w4 = w0 - 1.0 + 4.0 * G4;
        // Work out the hashed gradient indices of the five simplex corners
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        var ll = l & 255;
        // Calculate the contribution from the five corners
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        if (t0 < 0) n0 = 0.0;
        else {
          var gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
          t0 *= t0;
          n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        if (t1 < 0) n1 = 0.0;
        else {
          var gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
          t1 *= t1;
          n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        if (t2 < 0) n2 = 0.0;
        else {
          var gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
          t2 *= t2;
          n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        if (t3 < 0) n3 = 0.0;
        else {
          var gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
          t3 *= t3;
          n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
        }
        var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
        if (t4 < 0) n4 = 0.0;
        else {
          var gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
          t4 *= t4;
          n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
        }
        // Sum up and scale the result to cover the range [-1,1]
        return 27.0 * (n0 + n1 + n2 + n3 + n4);
      }
  };

function buildPermutationTable(random) {
  var i;
  var p = new Uint8Array(256);
  for (i = 0; i < 256; i++) {
    p[i] = i;
  }
  for (i = 0; i < 255; i++) {
    var r = i + 1 + ~~(random() * (255 - i));
    var aux = p[i];
    p[i] = p[r];
    p[r] = aux;
  }
  return p;
}
SimplexNoise._buildPermutationTable = buildPermutationTable;

// amd
if (typeof define !== 'undefined' && define.amd) define(function() {return SimplexNoise;});
// common js
if (typeof exports !== 'undefined') exports.SimplexNoise = SimplexNoise;
// browser
else if (typeof window !== 'undefined') window.SimplexNoise = SimplexNoise;
// nodejs
if (typeof module !== 'undefined') {
  module.exports = SimplexNoise;
}

})();

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundClouds_1 = require("../effects/BackgroundClouds");
var ForegroundWater_1 = require("../effects/ForegroundWater");
var WalkableArea_1 = require("../physics/WalkableArea");
var BackgroundController = /** @class */ (function () {
    function BackgroundController() {
    }
    Object.defineProperty(BackgroundController.prototype, "ground", {
        get: function () {
            return this._ground;
        },
        enumerable: true,
        configurable: true
    });
    BackgroundController.prototype.preload = function () {
        this._floof = new BackgroundClouds_1.BackgroundClouds(this.game);
        this._sploosh = new ForegroundWater_1.ForegroundWater(this.game);
        this._ground = new WalkableArea_1.WalkableArea(this.game);
        this.game.load.image("GameBackground1", "../assets/world/bright_sky.png");
        this.game.load.image("GameBackground2", "../assets/world/skyline.png");
        this._floof.preloadClouds();
        this._sploosh.preloadMoist();
        this._ground.preload();
    };
    BackgroundController.prototype.create = function () {
        //game.add.tileSprite(0, 0, 1920, 1920, 'background');
        this._background = this.game.add.tileSprite(0, 200, 6400, 1280, "GameBackground1");
        this._background.scale = new Phaser.Point(1, 1);
        this._background.anchor = new Phaser.Point(0.5, 0.5);
        this._background.alpha = 0.9;
        this.game.world.setBounds(0, 0, 6400, 1920);
        this._skyline = this.game.add.tileSprite(0, 200, 6400, 820, "GameBackground2");
        this._skyline.scale = new Phaser.Point(0.36, 0.36);
        this.game.stage.backgroundColor = '#022968';
        this._floof.createClouds();
        //  this._sploosh.createMoist();
        this._ground.create();
    };
    BackgroundController.prototype.update = function () {
        this._floof.moveClouds();
        //  this._sploosh.updateMoist();
        //this._background.angle += 0.001;
    };
    return BackgroundController;
}());
exports.BackgroundController = BackgroundController;

},{"../effects/BackgroundClouds":3,"../effects/ForegroundWater":4,"../physics/WalkableArea":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundClouds = /** @class */ (function () {
    function BackgroundClouds(game) {
        this._numberOfClouds = 5;
        this._fileType = ".png";
        this.game = game;
    }
    BackgroundClouds.prototype.preloadClouds = function () {
        for (var i = 0; i < this._numberOfClouds; i++) {
            var textureID = "BGCloud" + i;
            var texturePath = "../assets/world/cloud" + i + this._fileType;
            this.game.load.image(textureID, texturePath);
            console.log("Currently Loading:", textureID, "from", texturePath);
        }
        console.log("Finished Pre-Loading Images!");
    };
    BackgroundClouds.prototype.createClouds = function () {
        this._clouds = [];
        for (var i = 0; i < this._numberOfClouds; i++) {
            this._clouds[i] = this.game.add.sprite(300, Math.random() * 25, "BGCloud" + i); // X, Y, Textur ID
            this._clouds[i].position.x += (i * 400); // Avgör startposition Sidled
            this._clouds[i].position.y += Math.random() * 100; // Avgör start position Höjdled
            this._clouds[i].scale = new Phaser.Point(0.75, 0.75); // Styr storleken, dvs Skalan
            this._clouds[i].alpha = 0.25;
            this._clouds[i].velocity = 1 + Math.random() * 4; // Styr hastigheten på molnen
        }
        console.log("Clouds:", this._clouds);
    };
    BackgroundClouds.prototype.moveClouds = function () {
        var offScreenOffset = 1000;
        for (var i = 0; i < this._clouds.length; i++) {
            var singleCloud = this._clouds[i]; // Ta en instans av ett moln i loopen
            singleCloud.position.x += 0.125 * singleCloud.velocity; // LÄgg till Hastigheten på molnets X position för att flytta det i sidled.
            if (singleCloud.position.x > 6400) {
                singleCloud.position.x = -offScreenOffset;
            }
        }
    };
    return BackgroundClouds;
}());
exports.BackgroundClouds = BackgroundClouds;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ForegroundWater = /** @class */ (function () {
    function ForegroundWater(game) {
        this._waterPosY = 512;
        this._waterWidth = 512;
        this.game = game;
    }
    ForegroundWater.prototype.preloadMoist = function () {
        this.game.load.image("MurkyWater", "../assets/water/murky_water.png");
        this.game.load.image("MurkyWaterMask", "../assets/water/murky_water_mask.png");
    };
    ForegroundWater.prototype.createMoist = function () {
        this._water = [];
        for (var i = 0; i < 1; i++) {
            this._water[i] = this.game.add.sprite(0, 0, "MurkyWater"); // X, Y, Textur ID
            this._water[i].position.x = i * this._waterWidth; // Avgör startposition Sidled
            this._water[i].position.y = this._waterPosY; // Avgör start position Höjdled
            this._water[i].alpha = 0.76;
        }
    };
    ForegroundWater.prototype.updateMoist = function () {
        //  this._water[1].position.x += Math.sin(Date.now());
    };
    return ForegroundWater;
}());
exports.ForegroundWater = ForegroundWater;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MainMenu_1 = require("./states/MainMenu");
var GameRound_1 = require("./states/GameRound");
var WormsRemake = /** @class */ (function () {
    function WormsRemake() {
        this.game = new Phaser.Game(1600 /*Width*/, 900 /*Height*/, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });
        this.game.state.add("MainMenu", MainMenu_1.MainMenu);
        this.game.state.add("GameRound", GameRound_1.GameRound);
    }
    WormsRemake.prototype.preload = function () {
    };
    // called when the game is created
    WormsRemake.prototype.create = function () {
        this.game.state.start("MainMenu");
    };
    // Called every "frame", counting the number of ticks per second would give you the famous "FPS", Frames Per Second
    WormsRemake.prototype.update = function () {
    };
    WormsRemake.prototype.render = function () {
    };
    return WormsRemake;
}());
exports.WormsRemake = WormsRemake;
var remake = new WormsRemake();

},{"./states/GameRound":10,"./states/MainMenu":11}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimplexNoise = require('simplex-noise');
var simplex = new SimplexNoise(Math.random);
var WalkableArea = /** @class */ (function () {
    function WalkableArea(game) {
        this._blockSize = 32;
        this._scale = 1;
        this.game = game;
    }
    Object.defineProperty(WalkableArea.prototype, "size", {
        get: function () {
            return this._blockSize;
        },
        enumerable: true,
        configurable: true
    });
    WalkableArea.prototype.preload = function () {
        //this.game.load.image("IronPlate","../assets/materials/rusty_iron.png");
        this.game.load.image("IronPlate", "../assets/materials/rock.png");
    };
    WalkableArea.prototype.create = function () {
        //  this.game.physics.enable( [ sprite1, sprite2 ], Phaser.Physics.ARCADE);
        this.ground = this.game.add.group();
        var height = 40;
        var width = 200;
        var noiseArray = [];
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                if (!noiseArray[y]) {
                    noiseArray[y] = [];
                }
                var nx = x / width - 0.5;
                var ny = y / height - 0.5;
                noiseArray[y][x] = simplex.noise2D(nx, ny);
            }
        }
        console.log("noiseArray:", noiseArray);
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                console.log("Val:", noiseArray[y][x]);
                if (noiseArray[y][x] > 0.15) {
                    var a = -500 + (x * this.size);
                    var b = 600 + (y * this.size);
                    var groundBlock = this.game.add.sprite(a, b, 'IronPlate');
                    //groundBlock.scale = this._scale;
                    groundBlock.position.setTo(a, b);
                    console.log(a, b);
                    this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
                    groundBlock.body.immovable = true;
                    groundBlock.body.allowGravity = false;
                    this.ground.add(groundBlock);
                }
            }
        }
        //  console.log( value );
        /*  for(let x = 0; x < this.game.width * 4; x += this.size ) {
             // Add the ground blocks, enable physics on each, make them immovable
             let groundBlock = this.game.add.sprite(x, this.game.height - this.size, 'IronPlate');
             //groundBlock.scale = this._scale;
             this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
             groundBlock.body.immovable = true;
             groundBlock.body.allowGravity = false;
             this.ground.add(groundBlock);
         }*/
    };
    return WalkableArea;
}());
exports.WalkableArea = WalkableArea;

},{"simplex-noise":1}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerModel_1 = require("./PlayerModel");
var PlayerView_1 = require("./PlayerView");
var PlayerController = /** @class */ (function () {
    function PlayerController(playerPicture, game) {
        this.game = game;
        //this.game.load.image("Player",playerPicture);
        game.load.spritesheet('Player', playerPicture, 32, 32, 2);
        this._model = new PlayerModel_1.PlayerModel();
        this._view = new PlayerView_1.PlayerView(playerPicture, game);
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.CONTROL
        ]);
    }
    PlayerController.prototype.update = function () {
        if (this.activeWeapon == undefined) {
            //console.log("Weapon is invalid!");
            return;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
            this.activeWeapon.shoot();
        }
        var AimUp = this.game.input.keyboard.isDown(Phaser.Keyboard.UP);
        var AimDown = this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN);
        //  console.log("Vinkel och Riktnigt.", this.activeWeapon.sprite.angle, this.sprite.scale.x );
        if (AimUp && this.activeWeapon.sprite.angle < 90) {
            //  console.log("Aiming Up");
            this.activeWeapon.sprite.angle += 1.25;
        }
        else if (AimDown && this.activeWeapon.sprite.angle > -35) {
            //console.log("Aiming Down");
            this.activeWeapon.sprite.angle -= 1.25;
        }
    };
    Object.defineProperty(PlayerController.prototype, "activeWeapon", {
        get: function () {
            return this._activeWeapon;
        },
        set: function (weapon) {
            this._activeWeapon = weapon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayerController.prototype, "sprite", {
        get: function () {
            return this.view.playerSprite;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayerController.prototype, "position", {
        // Get the world position of the player sprite.
        get: function () {
            if (!this.view.playerSprite) {
                console.error("Tried to get position of a non existing PlayerSprite.");
                return;
            }
            return this.view.playerSprite.position;
        },
        // Force change the position of the player sprite.
        set: function (position) {
            if (!this.view.playerSprite) {
                console.error("Tried to set position of a non existing PlayerSprite.");
                return;
            }
            this._position = position;
            this.view.playerSprite.position = this._position;
        },
        enumerable: true,
        configurable: true
    });
    PlayerController.prototype.createPlayer = function () {
        // Create our display object
        this.view.createPlayerSprite();
    };
    Object.defineProperty(PlayerController.prototype, "view", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayerController.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    return PlayerController;
}());
exports.PlayerController = PlayerController;

},{"./PlayerModel":8,"./PlayerView":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerModel = /** @class */ (function () {
    function PlayerModel() {
        this._health = 100;
    }
    Object.defineProperty(PlayerModel.prototype, "health", {
        get: function () {
            return this._health;
        },
        set: function (healthPoints) {
            this._health = healthPoints;
        },
        enumerable: true,
        configurable: true
    });
    return PlayerModel;
}());
exports.PlayerModel = PlayerModel;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerView = /** @class */ (function () {
    function PlayerView(playerImage, game) {
        this._image = playerImage;
        this.game = game;
    }
    Object.defineProperty(PlayerView.prototype, "playerSprite", {
        get: function () {
            return this._sprite;
        },
        enumerable: true,
        configurable: true
    });
    PlayerView.prototype.createPlayerSprite = function () {
        this._sprite = this.game.add.sprite(300, 100, 'Player');
        this._sprite.animations.add('walk');
        this.game.physics.enable(this._sprite, Phaser.Physics.ARCADE);
        this._sprite.body.collideWorldBounds = true;
    };
    return PlayerView;
}());
exports.PlayerView = PlayerView;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundController_1 = require("../controller/BackgroundController");
var PlayerController_1 = require("../player/PlayerController");
var Weapons_1 = require("../weapons/Weapons");
var GameRound = /** @class */ (function () {
    function GameRound() {
        this.Gravity = 1300;
        this.MaxSpeed = 200;
        this.Drag = 600;
        this.JumpSpeed = -500;
        this.Acceleration = 500;
        this._pointingRight = false;
    }
    GameRound.prototype.preload = function () {
        this.background = new BackgroundController_1.BackgroundController();
        this.background.game = this.game;
        this.background.preload();
        this._testPlayer = new PlayerController_1.PlayerController("../../assets/player/worm1_spritesheet.png", this.game);
        this._weps = new Weapons_1.Weapons(this.game);
        this._weps.addStandardWeapons();
    };
    GameRound.prototype.create = function () {
        this.background.create();
        this._testPlayer.createPlayer();
        this.player = this._testPlayer.sprite;
        this.game.camera.follow(this.player);
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.DOWN
        ]);
        // Set player minimum and maximum movement speed
        this.player.body.maxVelocity.setTo(this.MaxSpeed, this.MaxSpeed * 10); // x, y
        // Add drag to the player that slows them down when they are not accelerating
        this.player.body.drag.setTo(this.Drag, 0); // x, y
        // Since we're jumping we need gravity
        this.game.physics.arcade.gravity.y = this.Gravity;
        var wep = this._weps.weapons[0];
        wep.owner = this.player;
        wep.controller = this._testPlayer;
        wep.createWeaponSprite();
        this._testPlayer.activeWeapon = wep;
    };
    Object.defineProperty(GameRound.prototype, "player", {
        get: function () {
            return this._player;
        },
        set: function (p) {
            this._player = p;
        },
        enumerable: true,
        configurable: true
    });
    GameRound.prototype.update = function () {
        this.background.update();
        // Update collisions
        this._testPlayer.activeWeapon.update();
        this.game.physics.arcade.collide(this._testPlayer.sprite, this.background.ground.ground);
        if (this._testPlayer != undefined) {
            this._testPlayer.update();
        }
        if (this.leftInputIsActive()) {
            // If the LEFT key is down, set the player velocity to move left
            this.player.body.acceleration.x = -this.Acceleration;
            this.player.animations.play('walk', 6, false, false);
            if (this._pointingRight) {
                this.player.anchor.setTo(0.5, 0.5);
                this.player.scale.x = 1;
                this._pointingRight = false;
            }
        }
        else if (this.rightInputIsActive()) {
            // If the RIGHT key is down, set the player velocity to move right
            this.player.animations.play('walk', 6, false, false);
            if (!this._pointingRight) {
                this.player.anchor.setTo(0.5, 0.5);
                this.player.scale.x = -1;
                this._pointingRight = true;
            }
            this.player.body.acceleration.x = this.Acceleration;
        }
        else {
            this.player.body.acceleration.x = 0;
        }
        // Set a variable that is true when the player is touching the ground
        var onTheGround = this.player.body.touching.down;
        if (onTheGround && this.upInputIsActive()) {
            // Jump when the player is touching the ground and the up arrow is pressed
            this.player.body.velocity.y = this.JumpSpeed;
        }
    };
    GameRound.prototype.leftInputIsActive = function () {
        return this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    };
    GameRound.prototype.rightInputIsActive = function () {
        return this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    };
    GameRound.prototype.upInputIsActive = function () {
        return this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    };
    Object.defineProperty(GameRound.prototype, "background", {
        get: function () {
            return this._backgroundController;
        },
        set: function (bg) {
            this._backgroundController = bg;
        },
        enumerable: true,
        configurable: true
    });
    return GameRound;
}());
exports.GameRound = GameRound;

},{"../controller/BackgroundController":2,"../player/PlayerController":7,"../weapons/Weapons":15}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MenuButton_1 = require("../utils/MenuButton");
var MainMenu = /** @class */ (function () {
    function MainMenu() {
    }
    MainMenu.prototype.preload = function () {
        this.game.load.image("MenuBackground", "../assets/heja_sverige.jpg");
        this.game.load.image("MenuLogo", "../assets/menu/menu_logo.png");
        this.game.load.image("MenuButton", "../assets/menu/button1.png");
    };
    MainMenu.prototype.createButtons = function () {
        var button1 = new MenuButton_1.MenuButton(this.game, // Game REference
        this.game.width / 2, // X Position
        300, // Y position
        "MenuButton", // TExture ID
        function () {
            this.game.state.start("GameRound");
        }.bind(this), "Nytt Spel" // Knapptext
        );
        var button2 = new MenuButton_1.MenuButton(this.game, // Game REference
        this.game.width / 2, // X Position
        500, // Y position
        "MenuButton", // TExture ID
        function () {
            alert("Settings!");
        }, "Inställningar" // Knapptext
        );
        var button3 = new MenuButton_1.MenuButton(this.game, // Game REference
        this.game.width / 2, // X Position
        700, // Y position
        "MenuButton", // TExture ID
        function () {
            alert("Credots!");
        }, "Credits" // Knapptext
        );
    };
    MainMenu.prototype.update = function () {
    };
    MainMenu.prototype.create = function () {
        this._background = this.game.add.sprite(0, 0, "MenuBackground");
        this._background.scale.setTo(0.5, 0.5);
        this._background.alpha = 0.75;
        this._logo = this.game.add.sprite(this.game.width / 2, 100, "MenuLogo");
        this._logo.anchor.setTo(0.5, 0.5);
        this.createButtons();
    };
    return MainMenu;
}());
exports.MainMenu = MainMenu;

},{"../utils/MenuButton":12}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MenuButton = /** @class */ (function () {
    function MenuButton(game, x, y, textureId, callback, buttonText) {
        // ACtual button
        var width = 1179;
        var height = 368;
        this._button = game.add.button(x - width / 2, y - height / 2, textureId, callback, this, 0, 0, 0);
        this._button.scale = new Phaser.Point(1, 1);
        // Text Label
        this._button.alpha = 0.6;
        var textSettings = {
            fontSize: 32,
            font: "Arial Black",
            anchor: 0.5,
            padding: new Phaser.Point(1, 1)
        };
        this._buttonText = game.add.text(x, y, buttonText, textSettings);
        this._buttonText.anchor.setTo(0.5, 0.5);
    }
    return MenuButton;
}());
exports.MenuButton = MenuButton;

},{}],13:[function(require,module,exports){
module.exports={
  "displayName" : "RPG-7",
  "ID": "RPG7",
  "displayImage" :  "../../assets/weapons/rpg7.png",
  "soundEffect" :  "../../assets/sound/rpg_shoot.mp3",
  "minDamage": 45,
  "maxDamage": 100,
  "launchForce": 1500,
  "projectileImage": "../../assets/weapons/rpg_rocket.png",
  "radius": 100,
  "numberOfShots": 1,
  "delayBetweenShots": 0,
  "shootcallback": "",
  "bounciness": 0.5,
  "maxBounces": 3,
  "impactSound" : "",
  "explosionSound" : ""
}

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Weapon = /** @class */ (function () {
    function Weapon(config, game) {
        this._numberOfBounces = 0;
        this.game = game;
        this.parseWeaponConfig(config);
        // Preload image
        this.game.load.image(this.ID, this.displayImage);
        this.game.load.image("WeaponCrosshair", this.crosshairTexture);
        this.game.load.image(this.ID + "Football", config.projectileImage);
        this.game.load.audio(this.ID + "Shoot", config.soundEffect);
        // Initialize our projectile array
        this._projectiles = [];
    }
    Weapon.prototype.parseWeaponConfig = function (config) {
        this.ID = config.ID;
        this.displayName = config.displayName;
        this.displayImage = config.displayImage;
        this.soundEffect = config.soundEffect;
        this.minDamage = config.minDamage;
        this.maxDamage = config.maxDamage;
        this.radius = config.radius;
        this.launchForce = config.launchForce;
        this.numberOfShots = config.numberOfShots;
        this.delayBetweenShots = config.delayBetweenShots;
        this.shootcallback = config.shootcallback;
        this.crosshairTexture = (config.crosshairTexture != undefined) ? config.crosshairTexture : "../../assets/ui/scope.png";
        this.bounciness = config.bounciness;
        this.maxBounces = config.maxBounces;
    };
    Object.defineProperty(Weapon.prototype, "controller", {
        get: function () {
            return this._controller;
        },
        set: function (ctrl) {
            this._controller = ctrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weapon.prototype, "owner", {
        set: function (player) {
            this._owner = player;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weapon.prototype, "sprite", {
        get: function () {
            return this._sprite;
        },
        enumerable: true,
        configurable: true
    });
    Weapon.prototype.createWeaponSprite = function () {
        this._sprite = this._owner.addChild(this.game.make.sprite(0, 0, this.ID));
        this._sprite.position.x = 0;
        this._sprite.position.y = 2;
        this._sprite.anchor.setTo(0.5, 0.5);
        this._crosshair = this._sprite.addChild(this.game.make.sprite(-100, 0, "WeaponCrosshair"));
        this._crosshair.scale.x = 0.1;
        this._crosshair.scale.y = 0.1;
        this._crosshair.anchor.setTo(0.5, 0.5);
        this._shootSound = this.game.add.audio(this.ID + "Shoot");
    };
    Weapon.prototype.update = function () {
        var groundCollection = this.game.state.getCurrentState().background.ground.ground;
        for (var i = 0; i < this._projectiles.length; i++) {
            this.game.physics.arcade.collide(this._projectiles[i], groundCollection, this.onCollide.bind(this));
        }
    };
    Weapon.prototype.onCollide = function (obj1, obj2) {
        this._numberOfBounces++;
        obj1.body.velocity.setTo(obj1.body.velocity.x * 0.75, obj1.body.velocity.y * 0.75);
        if (this._numberOfBounces >= this.maxBounces) {
            this.Explode(obj1, obj2);
        }
        console.log(this._numberOfBounces);
    };
    Weapon.prototype.Explode = function (obj1, obj2) {
        obj1.kill();
        setTimeout(function () {
            this.game.camera.follow(this._owner);
        }.bind(this), 3500);
    };
    Weapon.prototype.reload = function () {
        this._hasFired = false;
    };
    Weapon.prototype.shoot = function () {
        if (this._hasFired) {
            return;
        }
        var football = this.game.add.sprite(this._owner.position.x, this._owner.position.y, this.ID + "Football");
        this._projectiles.push(football);
        // Activate the physics system for this object
        this.game.physics.enable(football, Phaser.Physics.ARCADE);
        // Configure the physics settings
        football.body.allowGravity = true;
        football.body.bounce.set(this.bounciness);
        football.body.collideWorldBounds = true;
        // Play our shoot sound
        this._shootSound.play();
        // Delay in seconds
        var autoDeleteDelay = 5;
        // Create a local variable so we can pass the reference to our anonymous timeout function.
        var player = this._owner;
        var self = this;
        // Create an anonymous function for cleaning up the projectile in case it goes outside the map.
        var deletionTimer = setTimeout(function () {
            this.kill();
            this.game.camera.follow(player);
            self.reload();
        }.bind(football), autoDeleteDelay * 1000);
        // Make the camera follow the projectile
        this.game.camera.follow(football);
        // Since our crosshair is a child of the player object we can not extrapolate
        // the launch angle by subtracting the player position from the crosshair position.
        // to fix this we rotate the vector using sine and cosine
        // but first we need to convert our degrees to radians
        // this gives us a normalized vector we can use to multiply our launch force against.
        var angle = this._sprite.angle / (180 / Math.PI);
        // Since we change our movement by inverting the X scale of the player sprite
        // We have to adjust for it when rotating our vector. If we're facing Right we need to get the inverse sine value.
        var dir = this._owner.scale.x;
        var newX = Math.cos(angle);
        var newY = dir == -1 ? -Math.sin(angle) : Math.sin(angle);
        // Apply the force
        football.body.velocity.setTo((newX * this.launchForce) * -this._owner.scale.x, (newY * this.launchForce) * -this._owner.scale.x);
        // Flip the switch so we can't fire again until we have reloaded
        this._hasFired = true;
    };
    return Weapon;
}());
exports.Weapon = Weapon;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Weapon_1 = require("./Weapon");
var Weapons = /** @class */ (function () {
    function Weapons(game) {
        this.game = game;
        this._weaponList = [];
    }
    Object.defineProperty(Weapons.prototype, "weapons", {
        get: function () {
            return this._weaponList;
        },
        enumerable: true,
        configurable: true
    });
    Weapons.prototype.addStandardWeapons = function () {
        var RPG7 = require("../weapon_configs/rpg7.json");
        this.add(RPG7);
    };
    Weapons.prototype.add = function (cfg) {
        var wep = new Weapon_1.Weapon(cfg, this.game);
        this._weaponList.push(wep);
    };
    return Weapons;
}());
exports.Weapons = Weapons;

},{"../weapon_configs/rpg7.json":13,"./Weapon":14}]},{},[5]);
