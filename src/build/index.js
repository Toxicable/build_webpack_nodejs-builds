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
                    // use a Set to remove duplicate entries
                    this.context.logger.info(`    ${[...(new Set(unbundledModules))]}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX3dlYnBhY2tfbm9kZWpzL3NyYy9idWlsZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQVFILCtDQUFxRDtBQUNyRCx5QkFBeUI7QUFDekIsK0JBQStCO0FBQy9CLCtCQUFrQztBQUNsQyw4Q0FBc0M7QUFDdEMsbUNBQW1DO0FBQ25DLHNFQUFrRTtBQUNsRSxzREFDb0M7QUFDcEMsc0RBQW1FO0FBQ25FLGtFQUE2RDtBQUM3RCw4Q0FBMkQ7QUFDM0Qsd0NBQXFEO0FBQ3JELDBDQUF1RDtBQUN2RCxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFOUMsTUFBTSxpQ0FBaUMsR0FBRztJQUN4QyxJQUFJO0lBQ0osVUFBVTtDQUNYLENBQUM7QUFxQkY7SUFDRSxZQUFtQixPQUF1QjtRQUF2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtJQUFHLENBQUM7SUFFOUMsR0FBRyxDQUFDLE1BQXVEO1FBQ3pELE1BQU0sSUFBSSxHQUFHLG9CQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUMvQixNQUFNLFdBQVcsR0FBRyxtQ0FBZSxDQUFDLGNBQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFakUsTUFBTSxPQUFPLEdBQUcsY0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsTUFBTSxTQUFTLEdBQUcsY0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEQsTUFBTSxXQUFXLEdBQUcsY0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMs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QztDQUNGO0FBMUhELHNDQTBIQztBQUVELGtCQUFlLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQnVpbGRFdmVudCxcbiAgQnVpbGRlcixcbiAgQnVpbGRlckNvbmZpZ3VyYXRpb24sXG4gIEJ1aWxkZXJDb250ZXh0LFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0JztcbmltcG9ydCB7IGdldFN5c3RlbVBhdGggfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0ICogYXMgd2VicGFjayBmcm9tICd3ZWJwYWNrJztcbmltcG9ydCB7IHJlYWRUc2NvbmZpZyB9IGZyb20gJy4uL2NvcHktcGFzdGVkLWZpbGVzL3JlYWQtdHNjb25maWcnO1xuaW1wb3J0IHsgc3RhdHNFcnJvcnNUb1N0cmluZywgc3RhdHNUb1N0cmluZywgc3RhdHNXYXJuaW5nc1RvU3RyaW5nLFxufSBmcm9tICcuLi9jb3B5LXBhc3RlZC1maWxlcy9zdGF0cyc7XG5pbXBvcnQgeyBnZXRXZWJwYWNrU3RhdHNDb25maWcgfSBmcm9tICcuLi9jb3B5LXBhc3RlZC1maWxlcy91dGlscyc7XG5pbXBvcnQgeyBtYWtlT3V0ZmlsZU5hbWUgfSBmcm9tICcuLi91dGlscy9tYWtlLW91dGZpbGUtbmFtZSc7XG5pbXBvcnQgeyBnZXRDb21tb25XZWJwYWNrQ29uZmlnIH0gZnJvbSAnLi4vd2VicGFjay9jb21tb24nO1xuaW1wb3J0IHsgZ2V0V2VicGFja0RldkNvbmZpZyB9IGZyb20gJy4uL3dlYnBhY2svZGV2JztcbmltcG9ydCB7IGdldFdlYnBhY2tQcm9kQ29uZmlnIH0gZnJvbSAnLi4vd2VicGFjay9wcm9kJztcbmNvbnN0IHdlYnBhY2tNZXJnZSA9IHJlcXVpcmUoJ3dlYnBhY2stbWVyZ2UnKTtcblxuY29uc3QgV0VMTF9LTk9XTl9OT05fQlVORExFQUJMRV9NT0RVTEVTID0gW1xuICAncGcnLFxuICAnb3B0aW9uYWwnLFxuXTtcblxuZXhwb3J0IGludGVyZmFjZSBOb2RlanNCdWlsZEJ1aWxkZXJPcHRpb25zIHtcbiAgbWFpbjogc3RyaW5nO1xuICBvdXRwdXRQYXRoOiBzdHJpbmc7XG4gIHRzQ29uZmlnOiBzdHJpbmc7XG4gIHdhdGNoOiBib29sZWFuO1xuICBvcHRpbWl6YXRpb246IGJvb2xlYW47XG4gIGV4dGVybmFsczogc3RyaW5nW107XG4gIHZlcmJvc2U6IGJvb2xlYW47XG5cbiAgcGF0aFJlcGxhY2VtZW50czoge3BhdGg6IHN0cmluZywgcmVwbGFjZVdpdGg6IHN0cmluZ31bXTtcblxuICBwcm9ncmVzczogYm9vbGVhbjtcbiAgc3RhdHNKc29uOiBib29sZWFuO1xuICBleHRyYWN0TGljZW5zZXM6IGJvb2xlYW47XG4gIHNob3dDaXJjdWxhckRlcGVuZGVuY2llczogYm9vbGVhbjtcbiAgaG1yOiBib29sZWFuO1xuICBobXJQb2xsSW50ZXJ2YWw6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFNlcnZlckJ1aWxkZXIgaW1wbGVtZW50cyBCdWlsZGVyPE5vZGVqc0J1aWxkQnVpbGRlck9wdGlvbnM+IHtcbiAgY29uc3RydWN0b3IocHVibGljIGNvbnRleHQ6IEJ1aWxkZXJDb250ZXh0KSB7fVxuXG4gIHJ1bih0YXJnZXQ6IEJ1aWxkZXJDb25maWd1cmF0aW9uPE5vZGVqc0J1aWxkQnVpbGRlck9wdGlvbnM+KTogT2JzZXJ2YWJsZTxCdWlsZEV2ZW50PiB7XG4gICAgY29uc3Qgcm9vdCA9IGdldFN5c3RlbVBhdGgodGhpcy5jb250ZXh0LndvcmtzcGFjZS5yb290KTtcbiAgICBjb25zdCBvcHRpb25zID0gdGFyZ2V0Lm9wdGlvbnM7XG4gICAgY29uc3Qgb3V0ZmlsZU5hbWUgPSBtYWtlT3V0ZmlsZU5hbWUocmVzb2x2ZShyb290LCBvcHRpb25zLm1haW4pKTtcblxuICAgIGNvbnN0IGFic01haW4gPSByZXNvbHZlKHJvb3QsIG9wdGlvbnMubWFpbik7XG4gICAgY29uc3QgYWJzT3V0RGlyID0gcmVzb2x2ZShyb290LCBvcHRpb25zLm91dHB1dFBhdGgpO1xuICAgIGNvbnN0IGFic1RzQ29uZmlnID0gcmVzb2x2ZShyb290LCB0YXJnZXQub3B0aW9ucy50c0NvbmZpZyk7XG5cbi8vIFRPRE86IFNob3VsZCB0aGVzZSBlcnJvcyBnbyB0aHJvdWdoIHRoZSBPYnNlcnZhYmxlP1xuICAgIGlmICghZnMuZXhpc3RzU3luYyhhYnNNYWluKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuYFVuYWJsZSB0byBmaW5kIGVudHJ5IGZpbGVcbiAgICBSZWxhdGl2ZSBQYXRoOiAke29wdGlvbnMubWFpbn1cbiAgICBBYnNvbHV0ZSBQYXRoOiAke2Fic01haW59XG5gKTtcbiAgICB9XG5cbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoYWJzVHNDb25maWcpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG5gVW5hYmxlIHRvIGZpbmQgdHNDb25maWcgZmlsZVxuICAgIFJlbGF0aXZlIFBhdGg6ICR7b3B0aW9ucy50c0NvbmZpZ31cbiAgICBBYnNvbHV0ZSBQYXRoOiAke2Fic1RzQ29uZmlnfVxuYCk7XG4gICAgfVxuXG4gICAgY29uc3QgY29tbW9uV2VicGFja0NvbmZpZyA9IGdldENvbW1vbldlYnBhY2tDb25maWcoXG4gICAgICBhYnNNYWluLCBhYnNPdXREaXIsIGFic1RzQ29uZmlnLCBvdXRmaWxlTmFtZSwgb3B0aW9ucyk7XG4gICAgY29uc3QgcHJvZFdlYnBhY2tDb25maWcgPSBnZXRXZWJwYWNrUHJvZENvbmZpZygpO1xuICAgIGNvbnN0IGRldldlYnBwYWNrQ29uZmlnID0gZ2V0V2VicGFja0RldkNvbmZpZyhvcHRpb25zKTtcblxuICAgIGNvbnN0IHdlYnBhY2tDb25maWcgPSB3ZWJwYWNrTWVyZ2UoXG4gICAgICBbY29tbW9uV2VicGFja0NvbmZpZ10uY29uY2F0KG9wdGlvbnMub3B0aW1pemF0aW9uID8gcHJvZFdlYnBhY2tDb25maWcgOiBkZXZXZWJwcGFja0NvbmZpZyksXG4gICAgKSBhcyB3ZWJwYWNrLkNvbmZpZ3VyYXRpb247XG5cbiAgICBjb25zdCB0c0NvbmZpZyA9IHJlYWRUc2NvbmZpZyhhYnNUc0NvbmZpZyk7XG5cbiAgICBpZiAodHNDb25maWcub3B0aW9ucy5wYXRocykge1xuICAgICAgT2JqZWN0LmVudHJpZXModHNDb25maWcub3B0aW9ucy5wYXRocykuZm9yRWFjaCgoW2ltcG9ydFBhdGgsIHZhbHVlc10pID0+IHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vbi1udWxsLW9wZXJhdG9yXG4gICAgICAgIHZhbHVlcy5mb3JFYWNoKHZhbHVlID0+IHdlYnBhY2tDb25maWchLnJlc29sdmUhLmFsaWFzIVtpbXBvcnRQYXRoXSA9IHJlc29sdmUocm9vdCwgdmFsdWUpKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnBhdGhSZXBsYWNlbWVudHMpIHtcbiAgICAgIG9wdGlvbnMucGF0aFJlcGxhY2VtZW50c1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm9uLW51bGwtb3BlcmF0b3JcbiAgICAgICAgLmZvckVhY2goYWxpYXMgPT4gd2VicGFja0NvbmZpZyEucmVzb2x2ZSEuYWxpYXMhW2FsaWFzLnBhdGhdID1cbiAgICAgICAgICByZXNvbHZlKHJvb3QsIGFsaWFzLnJlcGxhY2VXaXRoKSk7XG4gICAgfVxuXG4gICAgY29uc3QgdW5idW5kbGVkTW9kdWxlczogc3RyaW5nW10gPSBbXTtcblxuICAgIGlmIChvcHRpb25zLm9wdGltaXphdGlvbikge1xuICAgICAgY29uc3QgZXh0ZXJuYWxzID0gV0VMTF9LTk9XTl9OT05fQlVORExFQUJMRV9NT0RVTEVTLmNvbmNhdChvcHRpb25zLmV4dGVybmFscyk7XG4gICAgICB3ZWJwYWNrQ29uZmlnLmV4dGVybmFscyA9IFtcbiAgICAgICAgZnVuY3Rpb24oY29udGV4dCwgcmVxdWVzdCwgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgICAgaWYgKGV4dGVybmFscy5pbmNsdWRlcyhyZXF1ZXN0KSkge1xuICAgICAgICAgICAgdW5idW5kbGVkTW9kdWxlcy5wdXNoKHJlcXVlc3QpO1xuXG4gICAgICAgICAgICAvLyBub3QgYnVuZGxlZFxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsICdjb21tb25qcyAnICsgcmVxdWVzdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGJ1bmRsZWRcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG5cblxuICAgIGNvbnN0IGNvbXBpbGVyID0gd2VicGFjayh3ZWJwYWNrQ29uZmlnKTtcblxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxib29sZWFuPihvYnMgPT4ge1xuICAgICAgY29uc3QgaGFuZGxlciA9IChlcnI6IEVycm9yLCBzdGF0czogd2VicGFjay5TdGF0cykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIG9icy5lcnJvcihlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhdHNDb25maWcgPSBnZXRXZWJwYWNrU3RhdHNDb25maWcob3B0aW9ucy52ZXJib3NlKTtcbiAgICAgICAgY29uc3QganNvbiA9IHN0YXRzLnRvSnNvbihzdGF0c0NvbmZpZyk7XG4gICAgICAgIGlmIChvcHRpb25zLnZlcmJvc2UpIHtcbiAgICAgICAgICB0aGlzLmNvbnRleHQubG9nZ2VyLmluZm8oc3RhdHMudG9TdHJpbmcoc3RhdHNDb25maWcpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvbnRleHQubG9nZ2VyLmluZm8oc3RhdHNUb1N0cmluZyhqc29uLCBzdGF0c0NvbmZpZykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXRzLmhhc1dhcm5pbmdzKCkpIHtcbiAgICAgICAgICB0aGlzLmNvbnRleHQubG9nZ2VyLndhcm4oc3RhdHNXYXJuaW5nc1RvU3RyaW5nKGpzb24sIHN0YXRzQ29uZmlnKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXRzLmhhc0Vycm9ycygpKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5lcnJvcihzdGF0c0Vycm9yc1RvU3RyaW5nKGpzb24sIHN0YXRzQ29uZmlnKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuYnVuZGxlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vIFRPRE86IGdlbmVyYXRlIHBhY2thZ2UuanNvbiB0byBtYXRjaD9cbiAgICAgICAgICB0aGlzLmNvbnRleHQubG9nZ2VyXG4gICAgICAgICAgLmluZm8oYFRoZSBmb2xsb3dpbmcgbW9kdWxlcyBoYXZlIGJlZW4gZXhjbHVkZWQgZnJvbSB0aGUgYnVuZGxlLmAgK1xuICAgICAgICAgICAgICAgIGAgRW5zdXJlIHRoZXkgYXJlIGF2aWxhYmxlIGF0IHJ1bnRpbWVgKTtcbiAgICAgICAgICAvLyB1c2UgYSBTZXQgdG8gcmVtb3ZlIGR1cGxpY2F0ZSBlbnRyaWVzXG4gICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5pbmZvKGAgICAgJHtbLi4uKG5ldyBTZXQodW5idW5kbGVkTW9kdWxlcykpXX1gKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgb2JzLm5leHQoIXN0YXRzLmhhc0Vycm9ycygpKTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChvcHRpb25zLndhdGNoKSB7XG4gICAgICAgIGNvbnN0IHdhdGNoaW5nID0gY29tcGlsZXIud2F0Y2goe30sIGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB3YXRjaGluZy5jbG9zZSgoKSA9PiB7fSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21waWxlci5ydW4oKGVyciwgc3RhdHMgKSA9PiB7XG4gICAgICAgICAgaGFuZGxlcihlcnIsIHN0YXRzKTtcbiAgICAgICAgICBvYnMuY29tcGxldGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSkucGlwZShcbiAgICAgIG1hcChzdWNjZXNzID0+ICh7c3VjY2Vzc30pKSxcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlckJ1aWxkZXI7XG4iXX0=