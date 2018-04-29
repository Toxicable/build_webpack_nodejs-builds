"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const license_webpack_plugin_1 = require("license-webpack-plugin");
const webpack = require("webpack");
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const StatsPlugin = require('stats-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
function getCommonWebpackConfig(entry, outDir, tsconfigPath, outfileName, buildOptions) {
    const webpackConfig = {
        entry: [entry],
        mode: 'none',
        output: {
            path: outDir,
            filename: outfileName,
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: `ts-loader`,
                    options: {
                        configFile: tsconfigPath,
                        transpileOnly: true,
                        // https://github.com/TypeStrong/ts-loader/pull/685
                        experimentalWatchApi: true,
                    },
                },
                { test: /\.txt$/, loader: 'raw-loader' },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {},
        },
        target: 'node',
        node: {
            console: false,
            global: false,
            process: false,
            Buffer: false,
            __filename: false,
            __dirname: false,
        },
        performance: {
            hints: false,
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                tsconfig: tsconfigPath,
                workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
            }),
        ],
    };
    const extraPlugins = [];
    if (buildOptions.progress) {
        extraPlugins.push(new ProgressPlugin({ profile: buildOptions.verbose, colors: true }));
    }
    if (buildOptions.statsJson) {
        extraPlugins.push(new StatsPlugin('stats.json', 'verbose'));
    }
    if (buildOptions.extractLicenses) {
        extraPlugins.push(new license_webpack_plugin_1.LicenseWebpackPlugin({
            pattern: /.*/,
            suppressErrors: true,
            perChunkOutput: false,
            outputFilename: `3rdpartylicenses.txt`,
        }));
    }
    if (buildOptions.showCircularDependencies) {
        extraPlugins.push(new CircularDependencyPlugin({
            exclude: /[\\\/]node_modules[\\\/]/,
        }));
    }
    if (buildOptions.hmr) {
        extraPlugins.push(new webpack.HotModuleReplacementPlugin());
        // tslint:disable-next-line:non-null-operator
        webpackConfig.entry.push(`webpack/hot/poll?${buildOptions.hmrPollInterval}`);
    }
    webpackConfig.plugins = extraPlugins.concat(webpackConfig.plugins || []);
    return webpackConfig;
}
exports.getCommonWebpackConfig = getCommonWebpackConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF93ZWJwYWNrX25vZGVqcy9zcmMvd2VicGFjay9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCxtRUFBOEQ7QUFDOUQsbUNBQW1DO0FBR25DLE1BQU0sd0JBQXdCLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdkUsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDN0QsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEQsTUFBTSwwQkFBMEIsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQXFCN0UsZ0NBQXVDLEtBQWEsRUFBRSxNQUFjLEVBQUUsWUFBb0IsRUFDbkQsV0FBbUIsRUFBRSxZQUEwQjtJQUNwRixNQUFNLGFBQWEsR0FBc0I7UUFDdkMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2QsSUFBSSxFQUFFLE1BQU07UUFDWixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxXQUFXO1NBQ3RCO1FBQ0QsTUFBTSxFQUFFO1lBQ04sS0FBSyxFQUFFO2dCQUNMO29CQUNFLElBQUksRUFBRSxPQUFPO29CQUNiLE1BQU0sRUFBRSxXQUFXO29CQUNuQixPQUFPLEVBQUU7d0JBQ1AsVUFBVSxFQUFFLFlBQVk7d0JBQ3hCLGFBQWEsRUFBRSxJQUFJO3dCQUNuQixtREFBbUQ7d0JBQ25ELG9CQUFvQixFQUFFLElBQUk7cUJBQzNCO2lCQUNGO2dCQUNELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFO2FBQ3pDO1NBQ0Y7UUFDRCxPQUFPLEVBQUU7WUFDUCxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO1lBQzFCLEtBQUssRUFBRSxFQUFFO1NBQ1Y7UUFDRCxNQUFNLEVBQUUsTUFBTTtRQUNkLElBQUksRUFBRTtZQUNKLE9BQU8sRUFBRSxLQUFLO1lBQ2QsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRSxLQUFLO1lBQ2IsVUFBVSxFQUFFLEtBQUs7WUFDakIsU0FBUyxFQUFFLEtBQUs7U0FDakI7UUFDRCxXQUFXLEVBQUU7WUFDWCxLQUFLLEVBQUUsS0FBSztTQUNiO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsSUFBSSwwQkFBMEIsQ0FBQztnQkFDN0IsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLE9BQU8sRUFBRSwwQkFBMEIsQ0FBQyxhQUFhO2FBQ2xELENBQUM7U0FDSDtLQUNGLENBQUM7SUFFRixNQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7SUFFeEIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDMUIsWUFBWSxDQUFDLElBQUksQ0FDZixJQUFJLGNBQWMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzNCLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSw2Q0FBb0IsQ0FBQztZQUN6QyxPQUFPLEVBQUUsSUFBSTtZQUNiLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLGNBQWMsRUFBRSxzQkFBc0I7U0FDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztRQUMxQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksd0JBQXdCLENBQUM7WUFDN0MsT0FBTyxFQUFFLDBCQUEwQjtTQUNwQyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQztRQUM1RCw2Q0FBNkM7UUFDNUMsYUFBYSxDQUFDLEtBQW1CLENBQUMsSUFBSSxDQUFDLG9CQUFvQixZQUFZLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQsYUFBYSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7SUFFekUsTUFBTSxDQUFDLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBbkZELHdEQW1GQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuXG5pbXBvcnQgeyBMaWNlbnNlV2VicGFja1BsdWdpbiB9IGZyb20gJ2xpY2Vuc2Utd2VicGFjay1wbHVnaW4nO1xuaW1wb3J0ICogYXMgd2VicGFjayBmcm9tICd3ZWJwYWNrJztcbmltcG9ydCB7IFJlYWxXZWJwYWNrQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG5jb25zdCBDaXJjdWxhckRlcGVuZGVuY3lQbHVnaW4gPSByZXF1aXJlKCdjaXJjdWxhci1kZXBlbmRlbmN5LXBsdWdpbicpO1xuY29uc3QgUHJvZ3Jlc3NQbHVnaW4gPSByZXF1aXJlKCd3ZWJwYWNrL2xpYi9Qcm9ncmVzc1BsdWdpbicpO1xuY29uc3QgU3RhdHNQbHVnaW4gPSByZXF1aXJlKCdzdGF0cy13ZWJwYWNrLXBsdWdpbicpO1xuY29uc3QgRm9ya1RzQ2hlY2tlcldlYnBhY2tQbHVnaW4gPSByZXF1aXJlKCdmb3JrLXRzLWNoZWNrZXItd2VicGFjay1wbHVnaW4nKTtcblxuXG4vKipcbiAqIEVudW1lcmF0ZSBsb2FkZXJzIGFuZCB0aGVpciBkZXBlbmRlbmNpZXMgZnJvbSB0aGlzIGZpbGUgdG8gbGV0IHRoZSBkZXBlbmRlbmN5IHZhbGlkYXRvclxuICoga25vdyB0aGV5IGFyZSB1c2VkLlxuICpcbiAqIHJlcXVpcmUoJ3RzLWxvYWRlcicpXG4gKi9cblxuLy8gVE9ETyB1c2UgYW5ndWxhci1idWlsZCBvbmVzXG5leHBvcnQgaW50ZXJmYWNlIEJ1aWxkT3B0aW9ucyB7XG4gIHByb2dyZXNzOiBib29sZWFuO1xuICBzdGF0c0pzb246IGJvb2xlYW47XG4gIHZlcmJvc2U6IGJvb2xlYW47XG4gIGV4dHJhY3RMaWNlbnNlczogYm9vbGVhbjtcbiAgc2hvd0NpcmN1bGFyRGVwZW5kZW5jaWVzOiBib29sZWFuO1xuICBobXI6IGJvb2xlYW47XG4gIGhtclBvbGxJbnRlcnZhbDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbW9uV2VicGFja0NvbmZpZyhlbnRyeTogc3RyaW5nLCBvdXREaXI6IHN0cmluZywgdHNjb25maWdQYXRoOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRmaWxlTmFtZTogc3RyaW5nLCBidWlsZE9wdGlvbnM6IEJ1aWxkT3B0aW9ucykge1xuICBjb25zdCB3ZWJwYWNrQ29uZmlnOiBSZWFsV2VicGFja0NvbmZpZyA9IHtcbiAgICBlbnRyeTogW2VudHJ5XSxcbiAgICBtb2RlOiAnbm9uZScsXG4gICAgb3V0cHV0OiB7XG4gICAgICBwYXRoOiBvdXREaXIsXG4gICAgICBmaWxlbmFtZTogb3V0ZmlsZU5hbWUsXG4gICAgfSxcbiAgICBtb2R1bGU6IHtcbiAgICAgIHJ1bGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXN0OiAvXFwudHMkLyxcbiAgICAgICAgICBsb2FkZXI6IGB0cy1sb2FkZXJgLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGNvbmZpZ0ZpbGU6IHRzY29uZmlnUGF0aCxcbiAgICAgICAgICAgIHRyYW5zcGlsZU9ubHk6IHRydWUsXG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vVHlwZVN0cm9uZy90cy1sb2FkZXIvcHVsbC82ODVcbiAgICAgICAgICAgIGV4cGVyaW1lbnRhbFdhdGNoQXBpOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHsgdGVzdDogL1xcLnR4dCQvLCBsb2FkZXI6ICdyYXctbG9hZGVyJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGV4dGVuc2lvbnM6IFsnLnRzJywgJy5qcyddLFxuICAgICAgYWxpYXM6IHt9LFxuICAgIH0sXG4gICAgdGFyZ2V0OiAnbm9kZScsXG4gICAgbm9kZToge1xuICAgICAgY29uc29sZTogZmFsc2UsXG4gICAgICBnbG9iYWw6IGZhbHNlLFxuICAgICAgcHJvY2VzczogZmFsc2UsXG4gICAgICBCdWZmZXI6IGZhbHNlLFxuICAgICAgX19maWxlbmFtZTogZmFsc2UsXG4gICAgICBfX2Rpcm5hbWU6IGZhbHNlLFxuICAgIH0sXG4gICAgcGVyZm9ybWFuY2U6IHtcbiAgICAgIGhpbnRzOiBmYWxzZSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIG5ldyBGb3JrVHNDaGVja2VyV2VicGFja1BsdWdpbih7XG4gICAgICAgIHRzY29uZmlnOiB0c2NvbmZpZ1BhdGgsXG4gICAgICAgIHdvcmtlcnM6IEZvcmtUc0NoZWNrZXJXZWJwYWNrUGx1Z2luLlRXT19DUFVTX0ZSRUUsXG4gICAgICB9KSxcbiAgICBdLFxuICB9O1xuXG4gIGNvbnN0IGV4dHJhUGx1Z2lucyA9IFtdO1xuXG4gIGlmIChidWlsZE9wdGlvbnMucHJvZ3Jlc3MpIHtcbiAgICBleHRyYVBsdWdpbnMucHVzaChcbiAgICAgIG5ldyBQcm9ncmVzc1BsdWdpbih7IHByb2ZpbGU6IGJ1aWxkT3B0aW9ucy52ZXJib3NlLCBjb2xvcnM6IHRydWUgfSkpO1xuICB9XG5cbiAgaWYgKGJ1aWxkT3B0aW9ucy5zdGF0c0pzb24pIHtcbiAgICBleHRyYVBsdWdpbnMucHVzaChuZXcgU3RhdHNQbHVnaW4oJ3N0YXRzLmpzb24nLCAndmVyYm9zZScpKTtcbiAgfVxuXG4gIGlmIChidWlsZE9wdGlvbnMuZXh0cmFjdExpY2Vuc2VzKSB7XG4gICAgZXh0cmFQbHVnaW5zLnB1c2gobmV3IExpY2Vuc2VXZWJwYWNrUGx1Z2luKHtcbiAgICAgIHBhdHRlcm46IC8uKi8sXG4gICAgICBzdXBwcmVzc0Vycm9yczogdHJ1ZSxcbiAgICAgIHBlckNodW5rT3V0cHV0OiBmYWxzZSxcbiAgICAgIG91dHB1dEZpbGVuYW1lOiBgM3JkcGFydHlsaWNlbnNlcy50eHRgLFxuICAgIH0pKTtcbiAgfVxuXG4gIGlmIChidWlsZE9wdGlvbnMuc2hvd0NpcmN1bGFyRGVwZW5kZW5jaWVzKSB7XG4gICAgZXh0cmFQbHVnaW5zLnB1c2gobmV3IENpcmN1bGFyRGVwZW5kZW5jeVBsdWdpbih7XG4gICAgICBleGNsdWRlOiAvW1xcXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFxcXC9dLyxcbiAgICB9KSk7XG4gIH1cblxuICBpZiAoYnVpbGRPcHRpb25zLmhtcikge1xuICAgIGV4dHJhUGx1Z2lucy5wdXNoKG5ldyB3ZWJwYWNrLkhvdE1vZHVsZVJlcGxhY2VtZW50UGx1Z2luKCkpO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpub24tbnVsbC1vcGVyYXRvclxuICAgICh3ZWJwYWNrQ29uZmlnLmVudHJ5ISBhcyBzdHJpbmdbXSkucHVzaChgd2VicGFjay9ob3QvcG9sbD8ke2J1aWxkT3B0aW9ucy5obXJQb2xsSW50ZXJ2YWx9YCk7XG4gIH1cblxuICB3ZWJwYWNrQ29uZmlnLnBsdWdpbnMgPSBleHRyYVBsdWdpbnMuY29uY2F0KHdlYnBhY2tDb25maWcucGx1Z2lucyB8fCBbXSk7XG5cbiAgcmV0dXJuIHdlYnBhY2tDb25maWc7XG59XG4iXX0=