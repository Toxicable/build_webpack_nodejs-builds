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
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const StatsPlugin = require('stats-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
function getCommonWebpackConfig(entry, outDir, tsconfigPath, outfileName, buildOptions) {
    const webpackConfig = {
        entry: entry,
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
    webpackConfig.plugins = extraPlugins.concat(webpackConfig.plugins || []);
    return webpackConfig;
}
exports.getCommonWebpackConfig = getCommonWebpackConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF93ZWJwYWNrX25vZGVqcy9zcmMvd2VicGFjay9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCxtRUFBOEQ7QUFHOUQsTUFBTSx3QkFBd0IsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUN2RSxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUM3RCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNwRCxNQUFNLDBCQUEwQixHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBa0I3RSxnQ0FBdUMsS0FBYSxFQUFFLE1BQWMsRUFBRSxZQUFvQixFQUNuRCxXQUFtQixFQUFFLFlBQTBCO0lBQ3BGLE1BQU0sYUFBYSxHQUFzQjtRQUN2QyxLQUFLLEVBQUUsS0FBSztRQUNaLElBQUksRUFBRSxNQUFNO1FBQ1osTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsV0FBVztTQUN0QjtRQUNELE1BQU0sRUFBRTtZQUNOLEtBQUssRUFBRTtnQkFDTDtvQkFDRSxJQUFJLEVBQUUsT0FBTztvQkFDYixNQUFNLEVBQUUsV0FBVztvQkFDbkIsT0FBTyxFQUFFO3dCQUNQLFVBQVUsRUFBRSxZQUFZO3dCQUN4QixhQUFhLEVBQUUsSUFBSTt3QkFDbkIsbURBQW1EO3dCQUNuRCxvQkFBb0IsRUFBRSxJQUFJO3FCQUMzQjtpQkFDRjtnQkFDRCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRTthQUN6QztTQUNGO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsVUFBVSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztZQUMxQixLQUFLLEVBQUUsRUFBRTtTQUNWO1FBQ0QsTUFBTSxFQUFFLE1BQU07UUFDZCxJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNLEVBQUUsS0FBSztZQUNiLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsS0FBSyxFQUFFLEtBQUs7U0FDYjtRQUNELE9BQU8sRUFBRTtZQUNQLElBQUksMEJBQTBCLENBQUM7Z0JBQzdCLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixPQUFPLEVBQUUsMEJBQTBCLENBQUMsYUFBYTthQUNsRCxDQUFDO1NBQ0g7S0FDRixDQUFDO0lBRUYsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBRXhCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzFCLFlBQVksQ0FBQyxJQUFJLENBQ2YsSUFBSSxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzQixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUNqQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksNkNBQW9CLENBQUM7WUFDekMsT0FBTyxFQUFFLElBQUk7WUFDYixjQUFjLEVBQUUsSUFBSTtZQUNwQixjQUFjLEVBQUUsS0FBSztZQUNyQixjQUFjLEVBQUUsc0JBQXNCO1NBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7UUFDMUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLHdCQUF3QixDQUFDO1lBQzdDLE9BQU8sRUFBRSwwQkFBMEI7U0FDcEMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsYUFBYSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7SUFFekUsTUFBTSxDQUFDLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBN0VELHdEQTZFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuXG5pbXBvcnQgeyBMaWNlbnNlV2VicGFja1BsdWdpbiB9IGZyb20gJ2xpY2Vuc2Utd2VicGFjay1wbHVnaW4nO1xuaW1wb3J0IHsgUmVhbFdlYnBhY2tDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5cbmNvbnN0IENpcmN1bGFyRGVwZW5kZW5jeVBsdWdpbiA9IHJlcXVpcmUoJ2NpcmN1bGFyLWRlcGVuZGVuY3ktcGx1Z2luJyk7XG5jb25zdCBQcm9ncmVzc1BsdWdpbiA9IHJlcXVpcmUoJ3dlYnBhY2svbGliL1Byb2dyZXNzUGx1Z2luJyk7XG5jb25zdCBTdGF0c1BsdWdpbiA9IHJlcXVpcmUoJ3N0YXRzLXdlYnBhY2stcGx1Z2luJyk7XG5jb25zdCBGb3JrVHNDaGVja2VyV2VicGFja1BsdWdpbiA9IHJlcXVpcmUoJ2ZvcmstdHMtY2hlY2tlci13ZWJwYWNrLXBsdWdpbicpO1xuXG4vKipcbiAqIEVudW1lcmF0ZSBsb2FkZXJzIGFuZCB0aGVpciBkZXBlbmRlbmNpZXMgZnJvbSB0aGlzIGZpbGUgdG8gbGV0IHRoZSBkZXBlbmRlbmN5IHZhbGlkYXRvclxuICoga25vdyB0aGV5IGFyZSB1c2VkLlxuICpcbiAqIHJlcXVpcmUoJ3RzLWxvYWRlcicpXG4gKi9cblxuLy8gVE9ETyB1c2UgYW5ndWxhci1idWlsZCBvbmVzXG5leHBvcnQgaW50ZXJmYWNlIEJ1aWxkT3B0aW9ucyB7XG4gIHByb2dyZXNzOiBib29sZWFuO1xuICBzdGF0c0pzb246IGJvb2xlYW47XG4gIHZlcmJvc2U6IGJvb2xlYW47XG4gIGV4dHJhY3RMaWNlbnNlczogYm9vbGVhbjtcbiAgc2hvd0NpcmN1bGFyRGVwZW5kZW5jaWVzOiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbW9uV2VicGFja0NvbmZpZyhlbnRyeTogc3RyaW5nLCBvdXREaXI6IHN0cmluZywgdHNjb25maWdQYXRoOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRmaWxlTmFtZTogc3RyaW5nLCBidWlsZE9wdGlvbnM6IEJ1aWxkT3B0aW9ucykge1xuICBjb25zdCB3ZWJwYWNrQ29uZmlnOiBSZWFsV2VicGFja0NvbmZpZyA9IHtcbiAgICBlbnRyeTogZW50cnksXG4gICAgbW9kZTogJ25vbmUnLFxuICAgIG91dHB1dDoge1xuICAgICAgcGF0aDogb3V0RGlyLFxuICAgICAgZmlsZW5hbWU6IG91dGZpbGVOYW1lLFxuICAgIH0sXG4gICAgbW9kdWxlOiB7XG4gICAgICBydWxlczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGVzdDogL1xcLnRzJC8sXG4gICAgICAgICAgbG9hZGVyOiBgdHMtbG9hZGVyYCxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBjb25maWdGaWxlOiB0c2NvbmZpZ1BhdGgsXG4gICAgICAgICAgICB0cmFuc3BpbGVPbmx5OiB0cnVlLFxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL1R5cGVTdHJvbmcvdHMtbG9hZGVyL3B1bGwvNjg1XG4gICAgICAgICAgICBleHBlcmltZW50YWxXYXRjaEFwaTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7IHRlc3Q6IC9cXC50eHQkLywgbG9hZGVyOiAncmF3LWxvYWRlcicgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBleHRlbnNpb25zOiBbJy50cycsICcuanMnXSxcbiAgICAgIGFsaWFzOiB7fSxcbiAgICB9LFxuICAgIHRhcmdldDogJ25vZGUnLFxuICAgIG5vZGU6IHtcbiAgICAgIGNvbnNvbGU6IGZhbHNlLFxuICAgICAgZ2xvYmFsOiBmYWxzZSxcbiAgICAgIHByb2Nlc3M6IGZhbHNlLFxuICAgICAgQnVmZmVyOiBmYWxzZSxcbiAgICAgIF9fZmlsZW5hbWU6IGZhbHNlLFxuICAgICAgX19kaXJuYW1lOiBmYWxzZSxcbiAgICB9LFxuICAgIHBlcmZvcm1hbmNlOiB7XG4gICAgICBoaW50czogZmFsc2UsXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICBuZXcgRm9ya1RzQ2hlY2tlcldlYnBhY2tQbHVnaW4oe1xuICAgICAgICB0c2NvbmZpZzogdHNjb25maWdQYXRoLFxuICAgICAgICB3b3JrZXJzOiBGb3JrVHNDaGVja2VyV2VicGFja1BsdWdpbi5UV09fQ1BVU19GUkVFLFxuICAgICAgfSksXG4gICAgXSxcbiAgfTtcblxuICBjb25zdCBleHRyYVBsdWdpbnMgPSBbXTtcblxuICBpZiAoYnVpbGRPcHRpb25zLnByb2dyZXNzKSB7XG4gICAgZXh0cmFQbHVnaW5zLnB1c2goXG4gICAgICBuZXcgUHJvZ3Jlc3NQbHVnaW4oeyBwcm9maWxlOiBidWlsZE9wdGlvbnMudmVyYm9zZSwgY29sb3JzOiB0cnVlIH0pKTtcbiAgfVxuXG4gIGlmIChidWlsZE9wdGlvbnMuc3RhdHNKc29uKSB7XG4gICAgZXh0cmFQbHVnaW5zLnB1c2gobmV3IFN0YXRzUGx1Z2luKCdzdGF0cy5qc29uJywgJ3ZlcmJvc2UnKSk7XG4gIH1cblxuICBpZiAoYnVpbGRPcHRpb25zLmV4dHJhY3RMaWNlbnNlcykge1xuICAgIGV4dHJhUGx1Z2lucy5wdXNoKG5ldyBMaWNlbnNlV2VicGFja1BsdWdpbih7XG4gICAgICBwYXR0ZXJuOiAvLiovLFxuICAgICAgc3VwcHJlc3NFcnJvcnM6IHRydWUsXG4gICAgICBwZXJDaHVua091dHB1dDogZmFsc2UsXG4gICAgICBvdXRwdXRGaWxlbmFtZTogYDNyZHBhcnR5bGljZW5zZXMudHh0YCxcbiAgICB9KSk7XG4gIH1cblxuICBpZiAoYnVpbGRPcHRpb25zLnNob3dDaXJjdWxhckRlcGVuZGVuY2llcykge1xuICAgIGV4dHJhUGx1Z2lucy5wdXNoKG5ldyBDaXJjdWxhckRlcGVuZGVuY3lQbHVnaW4oe1xuICAgICAgZXhjbHVkZTogL1tcXFxcXFwvXW5vZGVfbW9kdWxlc1tcXFxcXFwvXS8sXG4gICAgfSkpO1xuICB9XG5cbiAgd2VicGFja0NvbmZpZy5wbHVnaW5zID0gZXh0cmFQbHVnaW5zLmNvbmNhdCh3ZWJwYWNrQ29uZmlnLnBsdWdpbnMgfHwgW10pO1xuXG4gIHJldHVybiB3ZWJwYWNrQ29uZmlnO1xufVxuIl19