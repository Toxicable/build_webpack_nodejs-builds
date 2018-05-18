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
                {
                    // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
                    // Removing this will cause deprecation warnings to appear.
                    test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                    parser: { system: true },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF93ZWJwYWNrX25vZGVqcy9zcmMvd2VicGFjay9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCxtRUFBOEQ7QUFDOUQsbUNBQW1DO0FBR25DLE1BQU0sd0JBQXdCLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdkUsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDN0QsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEQsTUFBTSwwQkFBMEIsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQXFCN0UsZ0NBQXVDLEtBQWEsRUFBRSxNQUFjLEVBQUUsWUFBb0IsRUFDbkQsV0FBbUIsRUFBRSxZQUEwQjtJQUNwRixNQUFNLGFBQWEsR0FBc0I7UUFDdkMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2QsSUFBSSxFQUFFLE1BQU07UUFDWixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxXQUFXO1NBQ3RCO1FBQ0QsTUFBTSxFQUFFO1lBQ04sS0FBSyxFQUFFO2dCQUNMO29CQUNFLElBQUksRUFBRSxPQUFPO29CQUNiLE1BQU0sRUFBRSxXQUFXO29CQUNuQixPQUFPLEVBQUU7d0JBQ1AsVUFBVSxFQUFFLFlBQVk7d0JBQ3hCLGFBQWEsRUFBRSxJQUFJO3dCQUNuQixtREFBbUQ7d0JBQ25ELG9CQUFvQixFQUFFLElBQUk7cUJBQzNCO2lCQUNGO2dCQUNEO29CQUNFLDZFQUE2RTtvQkFDN0UsMkRBQTJEO29CQUMzRCxJQUFJLEVBQUUsdUNBQXVDO29CQUM3QyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2lCQUN6QjtnQkFDRCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRTthQUVqQztTQUNWO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsVUFBVSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztZQUMxQixLQUFLLEVBQUUsRUFBRTtTQUNWO1FBQ0QsTUFBTSxFQUFFLE1BQU07UUFDZCxJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNLEVBQUUsS0FBSztZQUNiLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsS0FBSyxFQUFFLEtBQUs7U0FDYjtRQUNELE9BQU8sRUFBRTtZQUNQLElBQUksMEJBQTBCLENBQUM7Z0JBQzdCLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixPQUFPLEVBQUUsMEJBQTBCLENBQUMsYUFBYTthQUNsRCxDQUFDO1NBQ0g7S0FDRixDQUFDO0lBRUYsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBRXhCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzFCLFlBQVksQ0FBQyxJQUFJLENBQ2YsSUFBSSxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzQixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUNqQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksNkNBQW9CLENBQUM7WUFDekMsT0FBTyxFQUFFLElBQUk7WUFDYixjQUFjLEVBQUUsSUFBSTtZQUNwQixjQUFjLEVBQUUsS0FBSztZQUNyQixjQUFjLEVBQUUsc0JBQXNCO1NBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7UUFDMUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLHdCQUF3QixDQUFDO1lBQzdDLE9BQU8sRUFBRSwwQkFBMEI7U0FDcEMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckIsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxDQUFDLENBQUM7UUFDNUQsNkNBQTZDO1FBQzVDLGFBQWEsQ0FBQyxLQUFtQixDQUFDLElBQUksQ0FBQyxvQkFBb0IsWUFBWSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRXpFLE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFDdkIsQ0FBQztBQTFGRCx3REEwRkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cblxuaW1wb3J0IHsgTGljZW5zZVdlYnBhY2tQbHVnaW4gfSBmcm9tICdsaWNlbnNlLXdlYnBhY2stcGx1Z2luJztcbmltcG9ydCAqIGFzIHdlYnBhY2sgZnJvbSAnd2VicGFjayc7XG5pbXBvcnQgeyBSZWFsV2VicGFja0NvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcblxuY29uc3QgQ2lyY3VsYXJEZXBlbmRlbmN5UGx1Z2luID0gcmVxdWlyZSgnY2lyY3VsYXItZGVwZW5kZW5jeS1wbHVnaW4nKTtcbmNvbnN0IFByb2dyZXNzUGx1Z2luID0gcmVxdWlyZSgnd2VicGFjay9saWIvUHJvZ3Jlc3NQbHVnaW4nKTtcbmNvbnN0IFN0YXRzUGx1Z2luID0gcmVxdWlyZSgnc3RhdHMtd2VicGFjay1wbHVnaW4nKTtcbmNvbnN0IEZvcmtUc0NoZWNrZXJXZWJwYWNrUGx1Z2luID0gcmVxdWlyZSgnZm9yay10cy1jaGVja2VyLXdlYnBhY2stcGx1Z2luJyk7XG5cblxuLyoqXG4gKiBFbnVtZXJhdGUgbG9hZGVycyBhbmQgdGhlaXIgZGVwZW5kZW5jaWVzIGZyb20gdGhpcyBmaWxlIHRvIGxldCB0aGUgZGVwZW5kZW5jeSB2YWxpZGF0b3JcbiAqIGtub3cgdGhleSBhcmUgdXNlZC5cbiAqXG4gKiByZXF1aXJlKCd0cy1sb2FkZXInKVxuICovXG5cbi8vIFRPRE8gdXNlIGFuZ3VsYXItYnVpbGQgb25lc1xuZXhwb3J0IGludGVyZmFjZSBCdWlsZE9wdGlvbnMge1xuICBwcm9ncmVzczogYm9vbGVhbjtcbiAgc3RhdHNKc29uOiBib29sZWFuO1xuICB2ZXJib3NlOiBib29sZWFuO1xuICBleHRyYWN0TGljZW5zZXM6IGJvb2xlYW47XG4gIHNob3dDaXJjdWxhckRlcGVuZGVuY2llczogYm9vbGVhbjtcbiAgaG1yOiBib29sZWFuO1xuICBobXJQb2xsSW50ZXJ2YWw6IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1vbldlYnBhY2tDb25maWcoZW50cnk6IHN0cmluZywgb3V0RGlyOiBzdHJpbmcsIHRzY29uZmlnUGF0aDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZmlsZU5hbWU6IHN0cmluZywgYnVpbGRPcHRpb25zOiBCdWlsZE9wdGlvbnMpIHtcbiAgY29uc3Qgd2VicGFja0NvbmZpZzogUmVhbFdlYnBhY2tDb25maWcgPSB7XG4gICAgZW50cnk6IFtlbnRyeV0sXG4gICAgbW9kZTogJ25vbmUnLFxuICAgIG91dHB1dDoge1xuICAgICAgcGF0aDogb3V0RGlyLFxuICAgICAgZmlsZW5hbWU6IG91dGZpbGVOYW1lLFxuICAgIH0sXG4gICAgbW9kdWxlOiB7XG4gICAgICBydWxlczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGVzdDogL1xcLnRzJC8sXG4gICAgICAgICAgbG9hZGVyOiBgdHMtbG9hZGVyYCxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBjb25maWdGaWxlOiB0c2NvbmZpZ1BhdGgsXG4gICAgICAgICAgICB0cmFuc3BpbGVPbmx5OiB0cnVlLFxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL1R5cGVTdHJvbmcvdHMtbG9hZGVyL3B1bGwvNjg1XG4gICAgICAgICAgICBleHBlcmltZW50YWxXYXRjaEFwaTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgLy8gTWFyayBmaWxlcyBpbnNpZGUgYEBhbmd1bGFyL2NvcmVgIGFzIHVzaW5nIFN5c3RlbUpTIHN0eWxlIGR5bmFtaWMgaW1wb3J0cy5cbiAgICAgICAgICAvLyBSZW1vdmluZyB0aGlzIHdpbGwgY2F1c2UgZGVwcmVjYXRpb24gd2FybmluZ3MgdG8gYXBwZWFyLlxuICAgICAgICAgIHRlc3Q6IC9bXFwvXFxcXF1AYW5ndWxhcltcXC9cXFxcXWNvcmVbXFwvXFxcXF0uK1xcLmpzJC8sXG4gICAgICAgICAgcGFyc2VyOiB7IHN5c3RlbTogdHJ1ZSB9LFxuICAgICAgICB9LFxuICAgICAgICB7IHRlc3Q6IC9cXC50eHQkLywgbG9hZGVyOiAncmF3LWxvYWRlcicgfSxcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgIF0gIGFzIGFueSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGV4dGVuc2lvbnM6IFsnLnRzJywgJy5qcyddLFxuICAgICAgYWxpYXM6IHt9LFxuICAgIH0sXG4gICAgdGFyZ2V0OiAnbm9kZScsXG4gICAgbm9kZToge1xuICAgICAgY29uc29sZTogZmFsc2UsXG4gICAgICBnbG9iYWw6IGZhbHNlLFxuICAgICAgcHJvY2VzczogZmFsc2UsXG4gICAgICBCdWZmZXI6IGZhbHNlLFxuICAgICAgX19maWxlbmFtZTogZmFsc2UsXG4gICAgICBfX2Rpcm5hbWU6IGZhbHNlLFxuICAgIH0sXG4gICAgcGVyZm9ybWFuY2U6IHtcbiAgICAgIGhpbnRzOiBmYWxzZSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIG5ldyBGb3JrVHNDaGVja2VyV2VicGFja1BsdWdpbih7XG4gICAgICAgIHRzY29uZmlnOiB0c2NvbmZpZ1BhdGgsXG4gICAgICAgIHdvcmtlcnM6IEZvcmtUc0NoZWNrZXJXZWJwYWNrUGx1Z2luLlRXT19DUFVTX0ZSRUUsXG4gICAgICB9KSxcbiAgICBdLFxuICB9O1xuXG4gIGNvbnN0IGV4dHJhUGx1Z2lucyA9IFtdO1xuXG4gIGlmIChidWlsZE9wdGlvbnMucHJvZ3Jlc3MpIHtcbiAgICBleHRyYVBsdWdpbnMucHVzaChcbiAgICAgIG5ldyBQcm9ncmVzc1BsdWdpbih7IHByb2ZpbGU6IGJ1aWxkT3B0aW9ucy52ZXJib3NlLCBjb2xvcnM6IHRydWUgfSkpO1xuICB9XG5cbiAgaWYgKGJ1aWxkT3B0aW9ucy5zdGF0c0pzb24pIHtcbiAgICBleHRyYVBsdWdpbnMucHVzaChuZXcgU3RhdHNQbHVnaW4oJ3N0YXRzLmpzb24nLCAndmVyYm9zZScpKTtcbiAgfVxuXG4gIGlmIChidWlsZE9wdGlvbnMuZXh0cmFjdExpY2Vuc2VzKSB7XG4gICAgZXh0cmFQbHVnaW5zLnB1c2gobmV3IExpY2Vuc2VXZWJwYWNrUGx1Z2luKHtcbiAgICAgIHBhdHRlcm46IC8uKi8sXG4gICAgICBzdXBwcmVzc0Vycm9yczogdHJ1ZSxcbiAgICAgIHBlckNodW5rT3V0cHV0OiBmYWxzZSxcbiAgICAgIG91dHB1dEZpbGVuYW1lOiBgM3JkcGFydHlsaWNlbnNlcy50eHRgLFxuICAgIH0pKTtcbiAgfVxuXG4gIGlmIChidWlsZE9wdGlvbnMuc2hvd0NpcmN1bGFyRGVwZW5kZW5jaWVzKSB7XG4gICAgZXh0cmFQbHVnaW5zLnB1c2gobmV3IENpcmN1bGFyRGVwZW5kZW5jeVBsdWdpbih7XG4gICAgICBleGNsdWRlOiAvW1xcXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFxcXC9dLyxcbiAgICB9KSk7XG4gIH1cblxuICBpZiAoYnVpbGRPcHRpb25zLmhtcikge1xuICAgIGV4dHJhUGx1Z2lucy5wdXNoKG5ldyB3ZWJwYWNrLkhvdE1vZHVsZVJlcGxhY2VtZW50UGx1Z2luKCkpO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpub24tbnVsbC1vcGVyYXRvclxuICAgICh3ZWJwYWNrQ29uZmlnLmVudHJ5ISBhcyBzdHJpbmdbXSkucHVzaChgd2VicGFjay9ob3QvcG9sbD8ke2J1aWxkT3B0aW9ucy5obXJQb2xsSW50ZXJ2YWx9YCk7XG4gIH1cblxuICB3ZWJwYWNrQ29uZmlnLnBsdWdpbnMgPSBleHRyYVBsdWdpbnMuY29uY2F0KHdlYnBhY2tDb25maWcucGx1Z2lucyB8fCBbXSk7XG5cbiAgcmV0dXJuIHdlYnBhY2tDb25maWc7XG59XG4iXX0=