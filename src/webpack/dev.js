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
function getWebpackDevConfig(options) {
    const webpackConfig = {
        devtool: 'eval-source-map',
        externals: [
            nodeExterals({
                whitelist: options.hmr ? [`webpack/hot/poll?${options.hmrPollInterval}`] : [],
            }),
        ],
        plugins: [
            new webpack.NamedModulesPlugin(),
        ],
    };
    return webpackConfig;
}
exports.getWebpackDevConfig = getWebpackDevConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF93ZWJwYWNrX25vZGVqcy9zcmMvd2VicGFjay9kZXYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtQ0FBbUM7QUFDbkMsdURBQXVEO0FBSXZELDZCQUFvQyxPQUFxQjtJQUN2RCxNQUFNLGFBQWEsR0FBc0I7UUFDdkMsT0FBTyxFQUFFLGlCQUFpQjtRQUMxQixTQUFTLEVBQUU7WUFDVCxZQUFZLENBQUM7Z0JBQ1gsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2FBQzlFLENBQUM7U0FDSDtRQUNELE9BQU8sRUFBRTtZQUNQLElBQUksT0FBTyxDQUFDLGtCQUFrQixFQUFFO1NBQ2pDO0tBQ0YsQ0FBQztJQUVGLE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFFdkIsQ0FBQztBQWZELGtEQWVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snO1xuaW1wb3J0ICogYXMgbm9kZUV4dGVyYWxzIGZyb20gJ3dlYnBhY2stbm9kZS1leHRlcm5hbHMnO1xuaW1wb3J0IHsgQnVpbGRPcHRpb25zIH0gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IHsgUmVhbFdlYnBhY2tDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRXZWJwYWNrRGV2Q29uZmlnKG9wdGlvbnM6IEJ1aWxkT3B0aW9ucykge1xuICBjb25zdCB3ZWJwYWNrQ29uZmlnOiBSZWFsV2VicGFja0NvbmZpZyA9IHtcbiAgICBkZXZ0b29sOiAnZXZhbC1zb3VyY2UtbWFwJyxcbiAgICBleHRlcm5hbHM6IFtcbiAgICAgIG5vZGVFeHRlcmFscyh7XG4gICAgICAgIHdoaXRlbGlzdDogb3B0aW9ucy5obXIgPyBbYHdlYnBhY2svaG90L3BvbGw/JHtvcHRpb25zLmhtclBvbGxJbnRlcnZhbH1gXSA6IFtdLFxuICAgICAgfSksXG4gICAgXSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICBuZXcgd2VicGFjay5OYW1lZE1vZHVsZXNQbHVnaW4oKSxcbiAgICBdLFxuICB9O1xuXG4gIHJldHVybiB3ZWJwYWNrQ29uZmlnO1xuXG59XG4iXX0=