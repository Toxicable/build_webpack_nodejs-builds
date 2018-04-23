"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
function getWebpackProdConfig() {
    const webpackConfig = {
        devtool: 'source-map',
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
        ],
    };
    return webpackConfig;
}
exports.getWebpackProdConfig = getWebpackProdConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfd2VicGFja19ub2RlanMvc3JjL3dlYnBhY2svcHJvZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG1DQUFtQztBQUduQztJQUVFLE1BQU0sYUFBYSxHQUFzQjtRQUN2QyxPQUFPLEVBQUUsWUFBWTtRQUNyQixPQUFPLEVBQUU7WUFDUCxJQUFJLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRTtTQUNuQztLQUNGLENBQUM7SUFFRixNQUFNLENBQUMsYUFBYSxDQUFDO0FBRXZCLENBQUM7QUFYRCxvREFXQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgd2VicGFjayBmcm9tICd3ZWJwYWNrJztcbmltcG9ydCB7IFJlYWxXZWJwYWNrQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2VicGFja1Byb2RDb25maWcoKSB7XG5cbiAgY29uc3Qgd2VicGFja0NvbmZpZzogUmVhbFdlYnBhY2tDb25maWcgPSB7XG4gICAgZGV2dG9vbDogJ3NvdXJjZS1tYXAnLFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIG5ldyB3ZWJwYWNrLk5vRW1pdE9uRXJyb3JzUGx1Z2luKCksXG4gICAgXSxcbiAgfTtcblxuICByZXR1cm4gd2VicGFja0NvbmZpZztcblxufVxuIl19