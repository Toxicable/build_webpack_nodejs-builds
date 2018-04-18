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
const nodeExterals = require("webpack-node-externals");
function getWebpackDevConfig() {
    const webpackConfig = {
        devtool: 'eval-source-map',
        externals: [
            nodeExterals(),
        ],
        plugins: [
            new webpack.NamedModulesPlugin(),
        ],
    };
    return webpackConfig;
}
exports.getWebpackDevConfig = getWebpackDevConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF93ZWJwYWNrX25vZGVqcy9zcmMvd2VicGFjay9kZXYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtQ0FBbUM7QUFDbkMsdURBQXVEO0FBR3ZEO0lBQ0UsTUFBTSxhQUFhLEdBQXNCO1FBQ3ZDLE9BQU8sRUFBRSxpQkFBaUI7UUFDMUIsU0FBUyxFQUFFO1lBQ1QsWUFBWSxFQUFFO1NBQ2Y7UUFDRCxPQUFPLEVBQUU7WUFDUCxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtTQUNqQztLQUNGLENBQUM7SUFFRixNQUFNLENBQUMsYUFBYSxDQUFDO0FBRXZCLENBQUM7QUFiRCxrREFhQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgd2VicGFjayBmcm9tICd3ZWJwYWNrJztcbmltcG9ydCAqIGFzIG5vZGVFeHRlcmFscyBmcm9tICd3ZWJwYWNrLW5vZGUtZXh0ZXJuYWxzJztcbmltcG9ydCB7IFJlYWxXZWJwYWNrQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2VicGFja0RldkNvbmZpZygpIHtcbiAgY29uc3Qgd2VicGFja0NvbmZpZzogUmVhbFdlYnBhY2tDb25maWcgPSB7XG4gICAgZGV2dG9vbDogJ2V2YWwtc291cmNlLW1hcCcsXG4gICAgZXh0ZXJuYWxzOiBbXG4gICAgICBub2RlRXh0ZXJhbHMoKSxcbiAgICBdLFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIG5ldyB3ZWJwYWNrLk5hbWVkTW9kdWxlc1BsdWdpbigpLFxuICAgIF0sXG4gIH07XG5cbiAgcmV0dXJuIHdlYnBhY2tDb25maWc7XG5cbn1cbiJdfQ==