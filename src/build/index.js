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
        const devWebppackConfig = dev_1.getWebpackDevConfig();
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
                        .info(`The following modules have been excluded from the bundle.
          Ensure they are avilable at runtime`);
                    this.context.logger.info(`${unbundledModules}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX3dlYnBhY2tfbm9kZWpzL3NyYy9idWlsZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQVNILHlCQUF5QjtBQUN6QiwrQkFBK0I7QUFDL0IsK0JBQWtDO0FBQ2xDLDhDQUFzQztBQUN0QyxtQ0FBbUM7QUFDbkMsc0VBQWtFO0FBQ2xFLHNEQUNvQztBQUNwQyxzREFBbUU7QUFDbkUsa0VBQTZEO0FBQzdELDhDQUEyRDtBQUMzRCx3Q0FBcUQ7QUFDckQsMENBQXVEO0FBQ3ZELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUU5QyxNQUFNLGlDQUFpQyxHQUFHO0lBQ3hDLElBQUk7SUFDSixVQUFVO0NBQ1gsQ0FBQztBQW1CRjtJQUNFLFlBQW1CLE9BQXVCO1FBQXZCLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQUcsQ0FBQztJQUU5QyxHQUFHLENBQUMsTUFBdUQ7UUFDekQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ3pDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDL0IsTUFBTSxXQUFXLEdBQUcsbUNBQWUsQ0FBQyxjQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWpFLE1BQU0sT0FBTyxHQUFHLGNBQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLE1BQU0sU0FBUyxHQUFHLGNBQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sV0FBVyxHQUFHLGNBQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUv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QyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEMsd0NBQXdDO29CQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07eUJBQ2xCLElBQUksQ0FBQzs4Q0FDOEIsQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7Z0JBQ2xELENBQUM7Z0JBR0QsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQztZQUVGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFN0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFHLEVBQUU7b0JBQzNCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3BCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDakIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNMLGVBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQzVCLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUF6SEQsc0NBeUhDO0FBRUQsa0JBQWUsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBCdWlsZEV2ZW50LFxuICBCdWlsZGVyLFxuICBCdWlsZGVyQ29uZmlndXJhdGlvbixcbiAgQnVpbGRlckNvbnRleHQsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9hcmNoaXRlY3QnO1xuaW1wb3J0IHsgZ2V0U3lzdGVtUGF0aCB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgKiBhcyB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snO1xuaW1wb3J0IHsgcmVhZFRzY29uZmlnIH0gZnJvbSAnLi4vY29weS1wYXN0ZWQtZmlsZXMvcmVhZC10c2NvbmZpZyc7XG5pbXBvcnQgeyBzdGF0c0Vycm9yc1RvU3RyaW5nLCBzdGF0c1RvU3RyaW5nLCBzdGF0c1dhcm5pbmdzVG9TdHJpbmcsXG59IGZyb20gJy4uL2NvcHktcGFzdGVkLWZpbGVzL3N0YXRzJztcbmltcG9ydCB7IGdldFdlYnBhY2tTdGF0c0NvbmZpZyB9IGZyb20gJy4uL2NvcHktcGFzdGVkLWZpbGVzL3V0aWxzJztcbmltcG9ydCB7IG1ha2VPdXRmaWxlTmFtZSB9IGZyb20gJy4uL3V0aWxzL21ha2Utb3V0ZmlsZS1uYW1lJztcbmltcG9ydCB7IGdldENvbW1vbldlYnBhY2tDb25maWcgfSBmcm9tICcuLi93ZWJwYWNrL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRXZWJwYWNrRGV2Q29uZmlnIH0gZnJvbSAnLi4vd2VicGFjay9kZXYnO1xuaW1wb3J0IHsgZ2V0V2VicGFja1Byb2RDb25maWcgfSBmcm9tICcuLi93ZWJwYWNrL3Byb2QnO1xuY29uc3Qgd2VicGFja01lcmdlID0gcmVxdWlyZSgnd2VicGFjay1tZXJnZScpO1xuXG5jb25zdCBXRUxMX0tOT1dOX05PTl9CVU5ETEVBQkxFX01PRFVMRVMgPSBbXG4gICdwZycsXG4gICdvcHRpb25hbCcsXG5dO1xuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGVqc0J1aWxkQnVpbGRlck9wdGlvbnMge1xuICBtYWluOiBzdHJpbmc7XG4gIG91dHB1dFBhdGg6IHN0cmluZztcbiAgdHNDb25maWc6IHN0cmluZztcbiAgd2F0Y2g6IGJvb2xlYW47XG4gIG9wdGltaXphdGlvbjogYm9vbGVhbjtcbiAgZXh0ZXJuYWxzOiBzdHJpbmdbXTtcbiAgdmVyYm9zZTogYm9vbGVhbjtcblxuICBwYXRoUmVwbGFjZW1lbnRzOiB7cGF0aDogc3RyaW5nLCByZXBsYWNlV2l0aDogc3RyaW5nfVtdO1xuXG4gIHByb2dyZXNzOiBib29sZWFuO1xuICBzdGF0c0pzb246IGJvb2xlYW47XG4gIGV4dHJhY3RMaWNlbnNlczogYm9vbGVhbjtcbiAgc2hvd0NpcmN1bGFyRGVwZW5kZW5jaWVzOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgU2VydmVyQnVpbGRlciBpbXBsZW1lbnRzIEJ1aWxkZXI8Tm9kZWpzQnVpbGRCdWlsZGVyT3B0aW9ucz4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGV4dDogQnVpbGRlckNvbnRleHQpIHt9XG5cbiAgcnVuKHRhcmdldDogQnVpbGRlckNvbmZpZ3VyYXRpb248Tm9kZWpzQnVpbGRCdWlsZGVyT3B0aW9ucz4pOiBPYnNlcnZhYmxlPEJ1aWxkRXZlbnQ+IHtcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250ZXh0LndvcmtzcGFjZS5yb290O1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0YXJnZXQub3B0aW9ucztcbiAgICBjb25zdCBvdXRmaWxlTmFtZSA9IG1ha2VPdXRmaWxlTmFtZShyZXNvbHZlKHJvb3QsIG9wdGlvbnMubWFpbikpO1xuXG4gICAgY29uc3QgYWJzTWFpbiA9IHJlc29sdmUocm9vdCwgb3B0aW9ucy5tYWluKTtcbiAgICBjb25zdCBhYnNPdXREaXIgPSByZXNvbHZlKHJvb3QsIG9wdGlvbnMub3V0cHV0UGF0aCk7XG4gICAgY29uc3QgYWJzVHNDb25maWcgPSByZXNvbHZlKHJvb3QsIHRhcmdldC5vcHRpb25zLnRzQ29uZmlnKTtcblxuLy8gVE9ETzogU2hvdWxkIHRoZXNlIGVycm9zIGdvIHRocm91Z2ggdGhlIE9ic2VydmFibGU/XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGFic01haW4pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG5gVW5hYmxlIHRvIGZpbmQgZW50cnkgZmlsZVxuICAgIFJlbGF0aXZlIFBhdGg6ICR7b3B0aW9ucy5tYWlufVxuICAgIEFic29sdXRlIFBhdGg6ICR7YWJzTWFpbn1cbmApO1xuICAgIH1cblxuICAgIGlmICghZnMuZXhpc3RzU3luYyhhYnNUc0NvbmZpZykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbmBVbmFibGUgdG8gZmluZCB0c0NvbmZpZyBmaWxlXG4gICAgUmVsYXRpdmUgUGF0aDogJHtvcHRpb25zLnRzQ29uZmlnfVxuICAgIEFic29sdXRlIFBhdGg6ICR7YWJzVHNDb25maWd9XG5gKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb21tb25XZWJwYWNrQ29uZmlnID0gZ2V0Q29tbW9uV2VicGFja0NvbmZpZyhcbiAgICAgIGFic01haW4sIGFic091dERpciwgYWJzVHNDb25maWcsIG91dGZpbGVOYW1lLCBvcHRpb25zKTtcbiAgICBjb25zdCBwcm9kV2VicGFja0NvbmZpZyA9IGdldFdlYnBhY2tQcm9kQ29uZmlnKCk7XG4gICAgY29uc3QgZGV2V2VicHBhY2tDb25maWcgPSBnZXRXZWJwYWNrRGV2Q29uZmlnKCk7XG5cbiAgICBjb25zdCB3ZWJwYWNrQ29uZmlnID0gd2VicGFja01lcmdlKFxuICAgICAgW2NvbW1vbldlYnBhY2tDb25maWddLmNvbmNhdChvcHRpb25zLm9wdGltaXphdGlvbiA/IHByb2RXZWJwYWNrQ29uZmlnIDogZGV2V2VicHBhY2tDb25maWcpLFxuICAgICkgYXMgd2VicGFjay5Db25maWd1cmF0aW9uO1xuXG4gICAgY29uc3QgdHNDb25maWcgPSByZWFkVHNjb25maWcoYWJzVHNDb25maWcpO1xuXG4gICAgaWYgKHRzQ29uZmlnLm9wdGlvbnMucGF0aHMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRzQ29uZmlnLm9wdGlvbnMucGF0aHMpLmZvckVhY2goKFtpbXBvcnRQYXRoLCB2YWx1ZXNdKSA9PiB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpub24tbnVsbC1vcGVyYXRvclxuICAgICAgICB2YWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiB3ZWJwYWNrQ29uZmlnIS5yZXNvbHZlIS5hbGlhcyFbaW1wb3J0UGF0aF0gPSByZXNvbHZlKHJvb3QsIHZhbHVlKSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5wYXRoUmVwbGFjZW1lbnRzKSB7XG4gICAgICBvcHRpb25zLnBhdGhSZXBsYWNlbWVudHNcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vbi1udWxsLW9wZXJhdG9yXG4gICAgICAgIC5mb3JFYWNoKGFsaWFzID0+IHdlYnBhY2tDb25maWchLnJlc29sdmUhLmFsaWFzIVthbGlhcy5wYXRoXSA9XG4gICAgICAgICAgcmVzb2x2ZShyb290LCBhbGlhcy5yZXBsYWNlV2l0aCkpO1xuICAgIH1cblxuICAgIGNvbnN0IHVuYnVuZGxlZE1vZHVsZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICBpZiAob3B0aW9ucy5vcHRpbWl6YXRpb24pIHtcbiAgICAgIGNvbnN0IGV4dGVybmFscyA9IFdFTExfS05PV05fTk9OX0JVTkRMRUFCTEVfTU9EVUxFUy5jb25jYXQob3B0aW9ucy5leHRlcm5hbHMpO1xuICAgICAgd2VicGFja0NvbmZpZy5leHRlcm5hbHMgPSBbXG4gICAgICAgIGZ1bmN0aW9uKGNvbnRleHQsIHJlcXVlc3QsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgICAgIGlmIChleHRlcm5hbHMuaW5jbHVkZXMocmVxdWVzdCkpIHtcbiAgICAgICAgICAgIHVuYnVuZGxlZE1vZHVsZXMucHVzaChyZXF1ZXN0KTtcblxuICAgICAgICAgICAgLy8gbm90IGJ1bmRsZWRcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCAnY29tbW9uanMgJyArIHJlcXVlc3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBidW5kbGVkXG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuXG5cbiAgICBjb25zdCBjb21waWxlciA9IHdlYnBhY2sod2VicGFja0NvbmZpZyk7XG5cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8Ym9vbGVhbj4ob2JzID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSAoZXJyOiBFcnJvciwgc3RhdHM6IHdlYnBhY2suU3RhdHMpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBvYnMuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXRzQ29uZmlnID0gZ2V0V2VicGFja1N0YXRzQ29uZmlnKG9wdGlvbnMudmVyYm9zZSk7XG4gICAgICAgIGNvbnN0IGpzb24gPSBzdGF0cy50b0pzb24oc3RhdHNDb25maWcpO1xuICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5pbmZvKHN0YXRzLnRvU3RyaW5nKHN0YXRzQ29uZmlnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5pbmZvKHN0YXRzVG9TdHJpbmcoanNvbiwgc3RhdHNDb25maWcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0cy5oYXNXYXJuaW5ncygpKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci53YXJuKHN0YXRzV2FybmluZ3NUb1N0cmluZyhqc29uLCBzdGF0c0NvbmZpZykpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGF0cy5oYXNFcnJvcnMoKSkge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5sb2dnZXIuZXJyb3Ioc3RhdHNFcnJvcnNUb1N0cmluZyhqc29uLCBzdGF0c0NvbmZpZykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bmJ1bmRsZWRNb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBUT0RPOiBnZW5lcmF0ZSBwYWNrYWdlLmpzb24gdG8gbWF0Y2g/XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlclxuICAgICAgICAgIC5pbmZvKGBUaGUgZm9sbG93aW5nIG1vZHVsZXMgaGF2ZSBiZWVuIGV4Y2x1ZGVkIGZyb20gdGhlIGJ1bmRsZS5cbiAgICAgICAgICBFbnN1cmUgdGhleSBhcmUgYXZpbGFibGUgYXQgcnVudGltZWApO1xuICAgICAgICAgIHRoaXMuY29udGV4dC5sb2dnZXIuaW5mbyhgJHt1bmJ1bmRsZWRNb2R1bGVzfWApO1xuICAgICAgICB9XG5cblxuICAgICAgICBvYnMubmV4dCghc3RhdHMuaGFzRXJyb3JzKCkpO1xuICAgICAgfTtcblxuICAgICAgaWYgKG9wdGlvbnMud2F0Y2gpIHtcbiAgICAgICAgY29uc3Qgd2F0Y2hpbmcgPSBjb21waWxlci53YXRjaCh7fSwgaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHdhdGNoaW5nLmNsb3NlKCgpID0+IHt9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBpbGVyLnJ1bigoZXJyLCBzdGF0cyApID0+IHtcbiAgICAgICAgICBoYW5kbGVyKGVyciwgc3RhdHMpO1xuICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KS5waXBlKFxuICAgICAgbWFwKHN1Y2Nlc3MgPT4gKHtzdWNjZXNzfSkpLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyQnVpbGRlcjtcbiJdfQ==