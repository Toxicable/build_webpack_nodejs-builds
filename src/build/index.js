"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const webpack = require("webpack");
const read_tsconfig_1 = require("../copy-pasted-files/read-tsconfig");
const stats_1 = require("../copy-pasted-files/stats");
const utils_1 = require("../copy-pasted-files/utils");
const make_outfile_name_1 = require("../utils/make-outfile-name");
const common_1 = require("../webpack/common");
const dev_1 = require("../webpack/dev");
const prod_1 = require("../webpack/prod");
const webpackMerge = require('webpack-merge');
const WELL_KNOWN_NON_BUNDLEABLE_MODULES = [
    'pg',
    'optional',
];
class ServerBuilder {
    constructor(context) {
        this.context = context;
    }
    run(target) {
        const root = this.context.workspace.root;
        const options = target.options;
        const outfileName = make_outfile_name_1.makeOutfileName(path_1.resolve(root, options.main));
        const absMain = path_1.resolve(root, options.main);
        const absOutDir = path_1.resolve(root, options.outputPath);
        const absTsConfig = path_1.resolve(root, target.options.tsConfig);
        // TODO: Should these erros go through the Observable?
        if (!fs.existsSync(absMain)) {
            throw new Error(`Unable to find entry file
    Relative Path: ${options.main}
    Absolute Path: ${absMain}
`);
        }
        if (!fs.existsSync(absTsConfig)) {
            throw new Error(`Unable to find tsConfig file
    Relative Path: ${options.tsConfig}
    Absolute Path: ${absTsConfig}
`);
        }
        const commonWebpackConfig = common_1.getCommonWebpackConfig(absMain, absOutDir, absTsConfig, outfileName, options);
        const prodWebpackConfig = prod_1.getWebpackProdConfig();
        const devWebppackConfig = dev_1.getWebpackDevConfig(options);
        const webpackConfig = webpackMerge([commonWebpackConfig].concat(options.optimization ? prodWebpackConfig : devWebppackConfig));
        const tsConfig = read_tsconfig_1.readTsconfig(absTsConfig);
        if (tsConfig.options.paths) {
            Object.entries(tsConfig.options.paths).forEach(([importPath, values]) => {
                // tslint:disable-next-line:non-null-operator
                values.forEach(value => webpackConfig.resolve.alias[importPath] = path_1.resolve(root, value));
            });
        }
        if (options.pathReplacements) {
            options.pathReplacements
                .forEach(alias => webpackConfig.resolve.alias[alias.path] =
                path_1.resolve(root, alias.replaceWith));
        }
        const unbundledModules = [];
        if (options.optimization) {
            const externals = WELL_KNOWN_NON_BUNDLEABLE_MODULES.concat(options.externals);
            webpackConfig.externals = [
                function (context, request, callback) {
                    if (externals.includes(request)) {
                        unbundledModules.push(request);
                        // not bundled
                        return callback(null, 'commonjs ' + request);
                    }
                    // bundled
                    callback();
                },
            ];
        }
        const compiler = webpack(webpackConfig);
        return new rxjs_1.Observable(obs => {
            const handler = (err, stats) => {
                if (err) {
                    return obs.error(err);
                }
                const statsConfig = utils_1.getWebpackStatsConfig(options.verbose);
                const json = stats.toJson(statsConfig);
                if (options.verbose) {
                    this.context.logger.info(stats.toString(statsConfig));
                }
                else {
                    this.context.logger.info(stats_1.statsToString(json, statsConfig));
                }
                if (stats.hasWarnings()) {
                    this.context.logger.warn(stats_1.statsWarningsToString(json, statsConfig));
                }
                if (stats.hasErrors()) {
                    this.context.logger.error(stats_1.statsErrorsToString(json, statsConfig));
                }
                if (unbundledModules.length > 0) {
                    // TODO: generate package.json to match?
                    this.context.logger
                        .info(`The following modules have been excluded from the bundle.` +
                        ` Ensure they are avilable at runtime`);
                    this.context.logger.info(`    ${unbundledModules}`);
                }
                obs.next(!stats.hasErrors());
            };
            if (options.watch) {
                const watching = compiler.watch({}, handler);
                return () => watching.close(() => { });
            }
            else {
                compiler.run((err, stats) => {
                    handler(err, stats);
                    obs.complete();
                });
            }
        }).pipe(operators_1.map(success => ({ success })));
    }
}
exports.ServerBuilder = ServerBuilder;
exports.default = ServerBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX3dlYnBhY2tfbm9kZWpzL3NyYy9idWlsZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQVFILHlCQUF5QjtBQUN6QiwrQkFBK0I7QUFDL0IsK0JBQWtDO0FBQ2xDLDhDQUFzQztBQUN0QyxtQ0FBbUM7QUFDbkMsc0VBQWtFO0FBQ2xFLHNEQUNvQztBQUNwQyxzREFBbUU7QUFDbkUsa0VBQTZEO0FBQzdELDhDQUEyRDtBQUMzRCx3Q0FBcUQ7QUFDckQsMENBQXVEO0FBQ3ZELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUU5QyxNQUFNLGlDQUFpQyxHQUFHO0lBQ3hDLElBQUk7SUFDSixVQUFVO0NBQ1gsQ0FBQztBQXFCRjtJQUNFLFlBQW1CLE9BQXVCO1FBQXZCLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQUcsQ0FBQztJQUU5QyxHQUFHLENBQUMsTUFBdUQ7UUFDekQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ3pDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDL0IsTUFBTSxXQUFXLEdBQUcsbUNBQWUsQ0FBQyxjQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWpFLE1BQU0sT0FBTyxHQUFHLGNBQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLE1BQU0sU0FBUyxHQUFHLGNBQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sV0FBVyxHQUFHLGNBQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUv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Z2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBCdWlsZEV2ZW50LFxuICBCdWlsZGVyLFxuICBCdWlsZGVyQ29uZmlndXJhdGlvbixcbiAgQnVpbGRlckNvbnRleHQsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9hcmNoaXRlY3QnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwICB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCAqIGFzIHdlYnBhY2sgZnJvbSAnd2VicGFjayc7XG5pbXBvcnQgeyByZWFkVHNjb25maWcgfSBmcm9tICcuLi9jb3B5LXBhc3RlZC1maWxlcy9yZWFkLXRzY29uZmlnJztcbmltcG9ydCB7IHN0YXRzRXJyb3JzVG9TdHJpbmcsIHN0YXRzVG9TdHJpbmcsIHN0YXRzV2FybmluZ3NUb1N0cmluZyxcbn0gZnJvbSAnLi4vY29weS1wYXN0ZWQtZmlsZXMvc3RhdHMnO1xuaW1wb3J0IHsgZ2V0V2VicGFja1N0YXRzQ29uZmlnIH0gZnJvbSAnLi4vY29weS1wYXN0ZWQtZmlsZXMvdXRpbHMnO1xuaW1wb3J0IHsgbWFrZU91dGZpbGVOYW1lIH0gZnJvbSAnLi4vdXRpbHMvbWFrZS1vdXRmaWxlLW5hbWUnO1xuaW1wb3J0IHsgZ2V0Q29tbW9uV2VicGFja0NvbmZpZyB9IGZyb20gJy4uL3dlYnBhY2svY29tbW9uJztcbmltcG9ydCB7IGdldFdlYnBhY2tEZXZDb25maWcgfSBmcm9tICcuLi93ZWJwYWNrL2Rldic7XG5pbXBvcnQgeyBnZXRXZWJwYWNrUHJvZENvbmZpZyB9IGZyb20gJy4uL3dlYnBhY2svcHJvZCc7XG5jb25zdCB3ZWJwYWNrTWVyZ2UgPSByZXF1aXJlKCd3ZWJwYWNrLW1lcmdlJyk7XG5cbmNvbnN0IFdFTExfS05PV05fTk9OX0JVTkRMRUFCTEVfTU9EVUxFUyA9IFtcbiAgJ3BnJyxcbiAgJ29wdGlvbmFsJyxcbl07XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZWpzQnVpbGRCdWlsZGVyT3B0aW9ucyB7XG4gIG1haW46IHN0cmluZztcbiAgb3V0cHV0UGF0aDogc3RyaW5nO1xuICB0c0NvbmZpZzogc3RyaW5nO1xuICB3YXRjaDogYm9vbGVhbjtcbiAgb3B0aW1pemF0aW9uOiBib29sZWFuO1xuICBleHRlcm5hbHM6IHN0cmluZ1tdO1xuICB2ZXJib3NlOiBib29sZWFuO1xuXG4gIHBhdGhSZXBsYWNlbWVudHM6IHtwYXRoOiBzdHJpbmcsIHJlcGxhY2VXaXRoOiBzdHJpbmd9W107XG5cbiAgcHJvZ3Jlc3M6IGJvb2xlYW47XG4gIHN0YXRzSnNvbjogYm9vbGVhbjtcbiAgZXh0cmFjdExpY2Vuc2VzOiBib29sZWFuO1xuICBzaG93Q2lyY3VsYXJEZXBlbmRlbmNpZXM6IGJvb2xlYW47XG4gIGhtcjogYm9vbGVhbjtcbiAgaG1yUG9sbEludGVydmFsOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJCdWlsZGVyIGltcGxlbWVudHMgQnVpbGRlcjxOb2RlanNCdWlsZEJ1aWxkZXJPcHRpb25zPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb250ZXh0OiBCdWlsZGVyQ29udGV4dCkge31cblxuICBydW4odGFyZ2V0OiBCdWlsZGVyQ29uZmlndXJhdGlvbjxOb2RlanNCdWlsZEJ1aWxkZXJPcHRpb25zPik6IE9ic2VydmFibGU8QnVpbGRFdmVudD4ge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRleHQud29ya3NwYWNlLnJvb3Q7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRhcmdldC5vcHRpb25zO1xuICAgIGNvbnN0IG91dGZpbGVOYW1lID0gbWFrZU91dGZpbGVOYW1lKHJlc29sdmUocm9vdCwgb3B0aW9ucy5tYWluKSk7XG5cbiAgICBjb25zdCBhYnNNYWluID0gcmVzb2x2ZShyb290LCBvcHRpb25zLm1haW4pO1xuICAgIGNvbnN0IGFic091dERpciA9IHJlc29sdmUocm9vdCwgb3B0aW9ucy5vdXRwdXRQYXRoKTtcbiAgICBjb25zdCBhYnNUc0NvbmZpZyA9IHJlc29sdmUocm9vdCwgdGFyZ2V0Lm9wdGlvbnMudHNDb25maWcpO1xuXG4vLyBUT0RPOiBTaG91bGQgdGhlc2UgZXJyb3MgZ28gdGhyb3VnaCB0aGUgT2JzZXJ2YWJsZT9cbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoYWJzTWFpbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbmBVbmFibGUgdG8gZmluZCBlbnRyeSBmaWxlXG4gICAgUmVsYXRpdmUgUGF0aDogJHtvcHRpb25zLm1haW59XG4gICAgQWJzb2x1dGUgUGF0aDogJHthYnNNYWlufVxuYCk7XG4gICAgfVxuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGFic1RzQ29uZmlnKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuYFVuYWJsZSB0byBmaW5kIHRzQ29uZmlnIGZpbGVcbiAgICBSZWxhdGl2ZSBQYXRoOiAke29wdGlvbnMudHNDb25maWd9XG4gICAgQWJzb2x1dGUgUGF0aDogJHthYnNUc0NvbmZpZ31cbmApO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbW1vbldlYnBhY2tDb25maWcgPSBnZXRDb21tb25XZWJwYWNrQ29uZmlnKFxuICAgICAgYWJzTWFpbiwgYWJzT3V0RGlyLCBhYnNUc0NvbmZpZywgb3V0ZmlsZU5hbWUsIG9wdGlvbnMpO1xuICAgIGNvbnN0IHByb2RXZWJwYWNrQ29uZmlnID0gZ2V0V2VicGFja1Byb2RDb25maWcoKTtcbiAgICBjb25zdCBkZXZXZWJwcGFja0NvbmZpZyA9IGdldFdlYnBhY2tEZXZDb25maWcob3B0aW9ucyk7XG5cbiAgICBjb25zdCB3ZWJwYWNrQ29uZmlnID0gd2VicGFja01lcmdlKFxuICAgICAgW2NvbW1vbldlYnBhY2tDb25maWddLmNvbmNhdChvcHRpb25zLm9wdGltaXphdGlvbiA/IHByb2RXZWJwYWNrQ29uZmlnIDogZGV2V2VicHBhY2tDb25maWcpLFxuICAgICkgYXMgd2VicGFjay5Db25maWd1cmF0aW9uO1xuXG4gICAgY29uc3QgdHNDb25maWcgPSByZWFkVHNjb25maWcoYWJzVHNDb25maWcpO1xuXG4gICAgaWYgKHRzQ29uZmlnLm9wdGlvbnMucGF0aHMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRzQ29uZmlnLm9wdGlvbnMucGF0aHMpLmZvckVhY2goKFtpbXBvcnRQYXRoLCB2YWx1ZXNdKSA9PiB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpub24tbnVsbC1vcGVyYXRvclxuICAgICAgICB2YWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiB3ZWJwYWNrQ29uZmlnIS5yZXNvbHZlIS5hbGlhcyFbaW1wb3J0UGF0aF0gPSByZXNvbHZlKHJvb3QsIHZhbHVlKSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5wYXRoUmVwbGFjZW1lbnRzKSB7XG4gICAgICBvcHRpb25zLnBhdGhSZXBsYWNlbWVudHNcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vbi1udWxsLW9wZXJhdG9yXG4gICAgICAgIC5mb3JFYWNoKGFsaWFzID0+IHdlYnBhY2tDb25maWchLnJlc29sdmUhLmFsaWFzIVthbGlhcy5wYXRoXSA9XG4gICAgICAgICAgcmVzb2x2ZShyb290LCBhbGlhcy5yZXBsYWNlV2l0aCkpO1xuICAgIH1cblxuICAgIGNvbnN0IHVuYnVuZGxlZE1vZHVsZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICBpZiAob3B0aW9ucy5vcHRpbWl6YXRpb24pIHtcbiAgICAgIGNvbnN0IGV4dGVybmFscyA9IFdFTExfS05PV05fTk9OX0JVTkRMRUFCTEVfTU9EVUxFUy5jb25jYXQob3B0aW9ucy5leHRlcm5hbHMpO1xuICAgICAgd2VicGFja0NvbmZpZy5leHRlcm5hbHMgPSBbXG4gICAgICAgIGZ1bmN0aW9uKGNvbnRleHQsIHJlcXVlc3QsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgICAgIGlmIChleHRlcm5hbHMuaW5jbHVkZXMocmVxdWVzdCkpIHtcbiAgICAgICAgICAgIHVuYnVuZGxlZE1vZHVsZXMucHVzaChyZXF1ZXN0KTtcblxuICAgICAgICAgICAgLy8gbm90IGJ1bmRsZWRcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCAnY29tbW9uanMgJyArIHJlcXVlc3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBidW5kbGVkXG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuXG5cbiAgICBjb25zdCBjb21waWxlciA9IHdlYnBhY2sod2VicGFja0NvbmZpZyk7XG5cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8Ym9vbGVhbj4ob2JzID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSAoZXJyOiBFcnJvciwgc3RhdHM6IHdlYnBhY2suU3RhdHMpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBvYnMuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXRzQ29uZmlnID0gZ2V0V2VicGFja1N0YXRzQ29uZmlnKG9wdGlvbnMudmVyYm9zZSk7XG4gICAgICAgIGNvbnN0IGpzb24gPSBzdGF0cy50b0pzb24oc3RhdHNDb25maWcpO1xuICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5pbmZvKHN0YXRzLnRvU3RyaW5nKHN0YXRzQ29uZmlnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5pbmZvKHN0YXRzVG9TdHJpbmcoanNvbiwgc3RhdHNDb25maWcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0cy5oYXNXYXJuaW5ncygpKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci53YXJuKHN0YXRzV2FybmluZ3NUb1N0cmluZyhqc29uLCBzdGF0c0NvbmZpZykpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGF0cy5oYXNFcnJvcnMoKSkge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5sb2dnZXIuZXJyb3Ioc3RhdHNFcnJvcnNUb1N0cmluZyhqc29uLCBzdGF0c0NvbmZpZykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bmJ1bmRsZWRNb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBUT0RPOiBnZW5lcmF0ZSBwYWNrYWdlLmpzb24gdG8gbWF0Y2g/XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlclxuICAgICAgICAgIC5pbmZvKGBUaGUgZm9sbG93aW5nIG1vZHVsZXMgaGF2ZSBiZWVuIGV4Y2x1ZGVkIGZyb20gdGhlIGJ1bmRsZS5gICtcbiAgICAgICAgICAgICAgICBgIEVuc3VyZSB0aGV5IGFyZSBhdmlsYWJsZSBhdCBydW50aW1lYCk7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5pbmZvKGAgICAgJHt1bmJ1bmRsZWRNb2R1bGVzfWApO1xuICAgICAgICB9XG5cblxuICAgICAgICBvYnMubmV4dCghc3RhdHMuaGFzRXJyb3JzKCkpO1xuICAgICAgfTtcblxuICAgICAgaWYgKG9wdGlvbnMud2F0Y2gpIHtcbiAgICAgICAgY29uc3Qgd2F0Y2hpbmcgPSBjb21waWxlci53YXRjaCh7fSwgaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHdhdGNoaW5nLmNsb3NlKCgpID0+IHt9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBpbGVyLnJ1bigoZXJyLCBzdGF0cyApID0+IHtcbiAgICAgICAgICBoYW5kbGVyKGVyciwgc3RhdHMpO1xuICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KS5waXBlKFxuICAgICAgbWFwKHN1Y2Nlc3MgPT4gKHtzdWNjZXNzfSkpLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyQnVpbGRlcjtcbiJdfQ==