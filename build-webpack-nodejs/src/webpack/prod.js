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
const WELL_KNOWN_NON_BUNDLEABLE_MODULES = [
    'pg',
];
function getWebpackProdConfig(extraExternals) {
    const externals = WELL_KNOWN_NON_BUNDLEABLE_MODULES.concat(extraExternals);
    const webpackConfig = {
        devtool: 'source-map',
        externals: [
            function (context, request, callback) {
                if (externals.includes(request)) {
                    // not bundled
                    return callback(null, 'commonjs ' + request);
                }
                // bundled
                callback();
            },
        ],
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
        ],
    };
    return webpackConfig;
}
exports.getWebpackProdConfig = getWebpackProdConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfd2VicGFja19ub2RlanMvc3JjL3dlYnBhY2svcHJvZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG1DQUFtQztBQUluQyxNQUFNLGlDQUFpQyxHQUFHO0lBQ3hDLElBQUk7Q0FDTCxDQUFDO0FBRUYsOEJBQXFDLGNBQXdCO0lBQzNELE1BQU0sU0FBUyxHQUFHLGlDQUFpQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUUzRSxNQUFNLGFBQWEsR0FBc0I7UUFDdkMsT0FBTyxFQUFFLFlBQVk7UUFDckIsU0FBUyxFQUFFO1lBQ1QsVUFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQWtCO2dCQUMzQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEMsY0FBYztvQkFDZCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLEdBQUcsT0FBTyxDQUFDLENBQUM7Z0JBQy9DLENBQUM7Z0JBQ0QsVUFBVTtnQkFDVixRQUFRLEVBQUUsQ0FBQztZQUNiLENBQUM7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLElBQUksT0FBTyxDQUFDLG9CQUFvQixFQUFFO1NBQ25DO0tBQ0YsQ0FBQztJQUVGLE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFFdkIsQ0FBQztBQXRCRCxvREFzQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHdlYnBhY2sgZnJvbSAnd2VicGFjayc7XG5pbXBvcnQgeyBSZWFsV2VicGFja0NvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcblxuXG5jb25zdCBXRUxMX0tOT1dOX05PTl9CVU5ETEVBQkxFX01PRFVMRVMgPSBbXG4gICdwZycsXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2VicGFja1Byb2RDb25maWcoZXh0cmFFeHRlcm5hbHM6IHN0cmluZ1tdKSB7XG4gIGNvbnN0IGV4dGVybmFscyA9IFdFTExfS05PV05fTk9OX0JVTkRMRUFCTEVfTU9EVUxFUy5jb25jYXQoZXh0cmFFeHRlcm5hbHMpO1xuXG4gIGNvbnN0IHdlYnBhY2tDb25maWc6IFJlYWxXZWJwYWNrQ29uZmlnID0ge1xuICAgIGRldnRvb2w6ICdzb3VyY2UtbWFwJyxcbiAgICBleHRlcm5hbHM6IFtcbiAgICAgIGZ1bmN0aW9uKGNvbnRleHQsIHJlcXVlc3QsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgICBpZiAoZXh0ZXJuYWxzLmluY2x1ZGVzKHJlcXVlc3QpKSB7XG4gICAgICAgICAgLy8gbm90IGJ1bmRsZWRcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgJ2NvbW1vbmpzICcgKyByZXF1ZXN0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBidW5kbGVkXG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9LFxuICAgIF0sXG4gICAgcGx1Z2luczogW1xuICAgICAgbmV3IHdlYnBhY2suTm9FbWl0T25FcnJvcnNQbHVnaW4oKSxcbiAgICBdLFxuICB9O1xuXG4gIHJldHVybiB3ZWJwYWNrQ29uZmlnO1xuXG59XG4iXX0=