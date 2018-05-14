"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
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
        const root = core_1.getSystemPath(this.context.workspace.root);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX3dlYnBhY2tfbm9kZWpzL3NyYy9idWlsZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQVFILCtDQUFxRDtBQUNyRCx5QkFBeUI7QUFDekIsK0JBQStCO0FBQy9CLCtCQUFrQztBQUNsQyw4Q0FBc0M7QUFDdEMsbUNBQW1DO0FBQ25DLHNFQUFrRTtBQUNsRSxzREFDb0M7QUFDcEMsc0RBQW1FO0FBQ25FLGtFQUE2RDtBQUM3RCw4Q0FBMkQ7QUFDM0Qsd0NBQXFEO0FBQ3JELDBDQUF1RDtBQUN2RCxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFOUMsTUFBTSxpQ0FBaUMsR0FBRztJQUN4QyxJQUFJO0lBQ0osVUFBVTtDQUNYLENBQUM7QUFxQkY7SUFDRSxZQUFtQixPQUF1QjtRQUF2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtJQUFHLENBQUM7SUFFOUMsR0FBRyxDQUFDLE1BQXVEO1FBQ3pELE1BQU0sSUFBSSxHQUFHLG9CQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUMvQixNQUFNLFdBQVcsR0FBRyxtQ0FBZSxDQUFDLGNBQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFakUsTUFBTSxPQUFPLEdBQUcsY0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsTUFBTSxTQUFTLEdBQUcsY0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEQsTUFBTSxXQUFXLEdBQUcsY0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMs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WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEJ1aWxkRXZlbnQsXG4gIEJ1aWxkZXIsXG4gIEJ1aWxkZXJDb25maWd1cmF0aW9uLFxuICBCdWlsZGVyQ29udGV4dCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdCc7XG5pbXBvcnQgeyBnZXRTeXN0ZW1QYXRoIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwICB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCAqIGFzIHdlYnBhY2sgZnJvbSAnd2VicGFjayc7XG5pbXBvcnQgeyByZWFkVHNjb25maWcgfSBmcm9tICcuLi9jb3B5LXBhc3RlZC1maWxlcy9yZWFkLXRzY29uZmlnJztcbmltcG9ydCB7IHN0YXRzRXJyb3JzVG9TdHJpbmcsIHN0YXRzVG9TdHJpbmcsIHN0YXRzV2FybmluZ3NUb1N0cmluZyxcbn0gZnJvbSAnLi4vY29weS1wYXN0ZWQtZmlsZXMvc3RhdHMnO1xuaW1wb3J0IHsgZ2V0V2VicGFja1N0YXRzQ29uZmlnIH0gZnJvbSAnLi4vY29weS1wYXN0ZWQtZmlsZXMvdXRpbHMnO1xuaW1wb3J0IHsgbWFrZU91dGZpbGVOYW1lIH0gZnJvbSAnLi4vdXRpbHMvbWFrZS1vdXRmaWxlLW5hbWUnO1xuaW1wb3J0IHsgZ2V0Q29tbW9uV2VicGFja0NvbmZpZyB9IGZyb20gJy4uL3dlYnBhY2svY29tbW9uJztcbmltcG9ydCB7IGdldFdlYnBhY2tEZXZDb25maWcgfSBmcm9tICcuLi93ZWJwYWNrL2Rldic7XG5pbXBvcnQgeyBnZXRXZWJwYWNrUHJvZENvbmZpZyB9IGZyb20gJy4uL3dlYnBhY2svcHJvZCc7XG5jb25zdCB3ZWJwYWNrTWVyZ2UgPSByZXF1aXJlKCd3ZWJwYWNrLW1lcmdlJyk7XG5cbmNvbnN0IFdFTExfS05PV05fTk9OX0JVTkRMRUFCTEVfTU9EVUxFUyA9IFtcbiAgJ3BnJyxcbiAgJ29wdGlvbmFsJyxcbl07XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZWpzQnVpbGRCdWlsZGVyT3B0aW9ucyB7XG4gIG1haW46IHN0cmluZztcbiAgb3V0cHV0UGF0aDogc3RyaW5nO1xuICB0c0NvbmZpZzogc3RyaW5nO1xuICB3YXRjaDogYm9vbGVhbjtcbiAgb3B0aW1pemF0aW9uOiBib29sZWFuO1xuICBleHRlcm5hbHM6IHN0cmluZ1tdO1xuICB2ZXJib3NlOiBib29sZWFuO1xuXG4gIHBhdGhSZXBsYWNlbWVudHM6IHtwYXRoOiBzdHJpbmcsIHJlcGxhY2VXaXRoOiBzdHJpbmd9W107XG5cbiAgcHJvZ3Jlc3M6IGJvb2xlYW47XG4gIHN0YXRzSnNvbjogYm9vbGVhbjtcbiAgZXh0cmFjdExpY2Vuc2VzOiBib29sZWFuO1xuICBzaG93Q2lyY3VsYXJEZXBlbmRlbmNpZXM6IGJvb2xlYW47XG4gIGhtcjogYm9vbGVhbjtcbiAgaG1yUG9sbEludGVydmFsOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJCdWlsZGVyIGltcGxlbWVudHMgQnVpbGRlcjxOb2RlanNCdWlsZEJ1aWxkZXJPcHRpb25zPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb250ZXh0OiBCdWlsZGVyQ29udGV4dCkge31cblxuICBydW4odGFyZ2V0OiBCdWlsZGVyQ29uZmlndXJhdGlvbjxOb2RlanNCdWlsZEJ1aWxkZXJPcHRpb25zPik6IE9ic2VydmFibGU8QnVpbGRFdmVudD4ge1xuICAgIGNvbnN0IHJvb3QgPSBnZXRTeXN0ZW1QYXRoKHRoaXMuY29udGV4dC53b3Jrc3BhY2Uucm9vdCk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRhcmdldC5vcHRpb25zO1xuICAgIGNvbnN0IG91dGZpbGVOYW1lID0gbWFrZU91dGZpbGVOYW1lKHJlc29sdmUocm9vdCwgb3B0aW9ucy5tYWluKSk7XG5cbiAgICBjb25zdCBhYnNNYWluID0gcmVzb2x2ZShyb290LCBvcHRpb25zLm1haW4pO1xuICAgIGNvbnN0IGFic091dERpciA9IHJlc29sdmUocm9vdCwgb3B0aW9ucy5vdXRwdXRQYXRoKTtcbiAgICBjb25zdCBhYnNUc0NvbmZpZyA9IHJlc29sdmUocm9vdCwgdGFyZ2V0Lm9wdGlvbnMudHNDb25maWcpO1xuXG4vLyBUT0RPOiBTaG91bGQgdGhlc2UgZXJyb3MgZ28gdGhyb3VnaCB0aGUgT2JzZXJ2YWJsZT9cbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoYWJzTWFpbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbmBVbmFibGUgdG8gZmluZCBlbnRyeSBmaWxlXG4gICAgUmVsYXRpdmUgUGF0aDogJHtvcHRpb25zLm1haW59XG4gICAgQWJzb2x1dGUgUGF0aDogJHthYnNNYWlufVxuYCk7XG4gICAgfVxuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGFic1RzQ29uZmlnKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuYFVuYWJsZSB0byBmaW5kIHRzQ29uZmlnIGZpbGVcbiAgICBSZWxhdGl2ZSBQYXRoOiAke29wdGlvbnMudHNDb25maWd9XG4gICAgQWJzb2x1dGUgUGF0aDogJHthYnNUc0NvbmZpZ31cbmApO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbW1vbldlYnBhY2tDb25maWcgPSBnZXRDb21tb25XZWJwYWNrQ29uZmlnKFxuICAgICAgYWJzTWFpbiwgYWJzT3V0RGlyLCBhYnNUc0NvbmZpZywgb3V0ZmlsZU5hbWUsIG9wdGlvbnMpO1xuICAgIGNvbnN0IHByb2RXZWJwYWNrQ29uZmlnID0gZ2V0V2VicGFja1Byb2RDb25maWcoKTtcbiAgICBjb25zdCBkZXZXZWJwcGFja0NvbmZpZyA9IGdldFdlYnBhY2tEZXZDb25maWcob3B0aW9ucyk7XG5cbiAgICBjb25zdCB3ZWJwYWNrQ29uZmlnID0gd2VicGFja01lcmdlKFxuICAgICAgW2NvbW1vbldlYnBhY2tDb25maWddLmNvbmNhdChvcHRpb25zLm9wdGltaXphdGlvbiA/IHByb2RXZWJwYWNrQ29uZmlnIDogZGV2V2VicHBhY2tDb25maWcpLFxuICAgICkgYXMgd2VicGFjay5Db25maWd1cmF0aW9uO1xuXG4gICAgY29uc3QgdHNDb25maWcgPSByZWFkVHNjb25maWcoYWJzVHNDb25maWcpO1xuXG4gICAgaWYgKHRzQ29uZmlnLm9wdGlvbnMucGF0aHMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRzQ29uZmlnLm9wdGlvbnMucGF0aHMpLmZvckVhY2goKFtpbXBvcnRQYXRoLCB2YWx1ZXNdKSA9PiB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpub24tbnVsbC1vcGVyYXRvclxuICAgICAgICB2YWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiB3ZWJwYWNrQ29uZmlnIS5yZXNvbHZlIS5hbGlhcyFbaW1wb3J0UGF0aF0gPSByZXNvbHZlKHJvb3QsIHZhbHVlKSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5wYXRoUmVwbGFjZW1lbnRzKSB7XG4gICAgICBvcHRpb25zLnBhdGhSZXBsYWNlbWVudHNcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vbi1udWxsLW9wZXJhdG9yXG4gICAgICAgIC5mb3JFYWNoKGFsaWFzID0+IHdlYnBhY2tDb25maWchLnJlc29sdmUhLmFsaWFzIVthbGlhcy5wYXRoXSA9XG4gICAgICAgICAgcmVzb2x2ZShyb290LCBhbGlhcy5yZXBsYWNlV2l0aCkpO1xuICAgIH1cblxuICAgIGNvbnN0IHVuYnVuZGxlZE1vZHVsZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICBpZiAob3B0aW9ucy5vcHRpbWl6YXRpb24pIHtcbiAgICAgIGNvbnN0IGV4dGVybmFscyA9IFdFTExfS05PV05fTk9OX0JVTkRMRUFCTEVfTU9EVUxFUy5jb25jYXQob3B0aW9ucy5leHRlcm5hbHMpO1xuICAgICAgd2VicGFja0NvbmZpZy5leHRlcm5hbHMgPSBbXG4gICAgICAgIGZ1bmN0aW9uKGNvbnRleHQsIHJlcXVlc3QsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgICAgIGlmIChleHRlcm5hbHMuaW5jbHVkZXMocmVxdWVzdCkpIHtcbiAgICAgICAgICAgIHVuYnVuZGxlZE1vZHVsZXMucHVzaChyZXF1ZXN0KTtcblxuICAgICAgICAgICAgLy8gbm90IGJ1bmRsZWRcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCAnY29tbW9uanMgJyArIHJlcXVlc3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBidW5kbGVkXG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuXG5cbiAgICBjb25zdCBjb21waWxlciA9IHdlYnBhY2sod2VicGFja0NvbmZpZyk7XG5cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8Ym9vbGVhbj4ob2JzID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSAoZXJyOiBFcnJvciwgc3RhdHM6IHdlYnBhY2suU3RhdHMpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBvYnMuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXRzQ29uZmlnID0gZ2V0V2VicGFja1N0YXRzQ29uZmlnKG9wdGlvbnMudmVyYm9zZSk7XG4gICAgICAgIGNvbnN0IGpzb24gPSBzdGF0cy50b0pzb24oc3RhdHNDb25maWcpO1xuICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5pbmZvKHN0YXRzLnRvU3RyaW5nKHN0YXRzQ29uZmlnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5pbmZvKHN0YXRzVG9TdHJpbmcoanNvbiwgc3RhdHNDb25maWcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0cy5oYXNXYXJuaW5ncygpKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci53YXJuKHN0YXRzV2FybmluZ3NUb1N0cmluZyhqc29uLCBzdGF0c0NvbmZpZykpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGF0cy5oYXNFcnJvcnMoKSkge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5sb2dnZXIuZXJyb3Ioc3RhdHNFcnJvcnNUb1N0cmluZyhqc29uLCBzdGF0c0NvbmZpZykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bmJ1bmRsZWRNb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBUT0RPOiBnZW5lcmF0ZSBwYWNrYWdlLmpzb24gdG8gbWF0Y2g/XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlclxuICAgICAgICAgIC5pbmZvKGBUaGUgZm9sbG93aW5nIG1vZHVsZXMgaGF2ZSBiZWVuIGV4Y2x1ZGVkIGZyb20gdGhlIGJ1bmRsZS5gICtcbiAgICAgICAgICAgICAgICBgIEVuc3VyZSB0aGV5IGFyZSBhdmlsYWJsZSBhdCBydW50aW1lYCk7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5pbmZvKGAgICAgJHt1bmJ1bmRsZWRNb2R1bGVzfWApO1xuICAgICAgICB9XG5cblxuICAgICAgICBvYnMubmV4dCghc3RhdHMuaGFzRXJyb3JzKCkpO1xuICAgICAgfTtcblxuICAgICAgaWYgKG9wdGlvbnMud2F0Y2gpIHtcbiAgICAgICAgY29uc3Qgd2F0Y2hpbmcgPSBjb21waWxlci53YXRjaCh7fSwgaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHdhdGNoaW5nLmNsb3NlKCgpID0+IHt9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBpbGVyLnJ1bigoZXJyLCBzdGF0cyApID0+IHtcbiAgICAgICAgICBoYW5kbGVyKGVyciwgc3RhdHMpO1xuICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KS5waXBlKFxuICAgICAgbWFwKHN1Y2Nlc3MgPT4gKHtzdWNjZXNzfSkpLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyQnVpbGRlcjtcbiJdfQ==