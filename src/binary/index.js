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
const child_process_1 = require("child_process");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const treeKill = require("tree-kill");
const make_outfile_name_1 = require("../utils/make-outfile-name");
class BinaryBuilder {
    constructor(context) {
        this.context = context;
    }
    run(target) {
        const root = core_1.getSystemPath(this.context.workspace.root);
        const options = target.options;
        let subProcess = null;
        // TODO: probably need handling of this ChildProcess
        const killProcess = () => {
            return new rxjs_1.Observable(obs => {
                if (!subProcess) {
                    obs.next();
                    obs.complete();
                }
                else {
                    treeKill(subProcess.pid, 'SIGTERM', (err) => {
                        if (err) {
                            obs.error(err);
                        }
                        obs.next();
                        obs.complete();
                    });
                }
            });
        };
        const runProcess = (outfile) => {
            return new rxjs_1.Observable(obs => {
                subProcess = child_process_1.fork(outfile, [], {
                    // TODO: should be configurable to inspecet-brk
                    execArgv: options.args.concat(options.inspect ? ['--inspect'] : []),
                });
                obs.next();
                return () => killProcess();
            });
        };
        const restart = () => killProcess().pipe(operators_1.switchMap(() => runProcess(outfile)));
        const builderConfig = this._getBuildBuilderConfig(options);
        const outFileName = make_outfile_name_1.makeOutfileName(builderConfig.options.main);
        const outfile = path_1.resolve(root, builderConfig.options.outputPath, outFileName);
        if (builderConfig.options.hmr) {
            // in HMR mode the users handles restarting the process
            // we should only do that on an error
            return this._startBuild(builderConfig).pipe(operators_1.switchMap(() => {
                // only start it if it's never been run
                if (!subProcess) {
                    return runProcess(outfile);
                }
                else {
                    return new rxjs_1.Observable(obs => obs.next());
                }
            }), 
            // if something happens we'll restart it for the user
            operators_1.catchError(err => {
                // this.context.logger.error('An error occured, restarting process');
                // this.context.logger.error(err);
                return restart();
            }), operators_1.map(() => ({ success: true })));
        }
        else {
            return this._startBuild(builderConfig).pipe(
            // should always ensure the process is killed
            operators_1.concatMap(() => restart()), operators_1.map(() => ({ success: true })));
        }
    }
    _startBuild(builderConfig) {
        let buildDescription;
        return this.context.architect.getBuilderDescription(builderConfig).pipe(operators_1.tap(description => buildDescription = description), operators_1.concatMap(buildDescription => this.context.architect.validateBuilderOptions(builderConfig, buildDescription)), operators_1.map(() => this.context.architect.getBuilder(buildDescription, this.context)), operators_1.concatMap(builder => builder.run(builderConfig)));
    }
    _getBuildBuilderConfig(options) {
        const [project, targetName, configuration] = options.buildTarget.split(':');
        const overrides = { watch: true, verbose: options.verbose };
        const targetSpec = { project, target: targetName, configuration, overrides };
        return this.context.architect.getBuilderConfiguration(targetSpec);
    }
}
exports.BinaryBuilder = BinaryBuilder;
exports.default = BinaryBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX3dlYnBhY2tfbm9kZWpzL3NyYy9iaW5hcnkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCwrQ0FBcUQ7QUFDckQsaURBQW1EO0FBQ25ELCtCQUErQjtBQUMvQiwrQkFBa0M7QUFDbEMsOENBQTRFO0FBQzVFLHNDQUFzQztBQUV0QyxrRUFBNkQ7QUFTN0Q7SUFFRSxZQUFtQixPQUF1QjtRQUF2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtJQUFJLENBQUM7SUFFL0MsR0FBRyxDQUFDLE1BQWtEO1FBQ3BELE1BQU0sSUFBSSxHQUFHLG9CQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLFVBQVUsR0FBc0IsSUFBSSxDQUFDO1FBRXpDLG9EQUFvRDtRQUNwRCxNQUFNLFdBQVcsR0FBMkIsR0FBRyxFQUFFO1lBQy9DLE1BQU0sQ0FBQyxJQUFJLGlCQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNYLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDakIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTt3QkFDMUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs0QkFDUixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQixDQUFDO3dCQUNELEdBQUcsQ0FB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QixDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FDckUsZUFBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLEVBQ2xELHFCQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUN6RSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxFQUNuQyxlQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUM1RSxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUNqRCxDQUFDO0lBQ0osQ0FBQztJQUVPLHNCQUFzQixDQUFDLE9BQTZCO1FBQzFELE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzVELE1BQU0sVUFBVSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBRTdFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBNEIsVUFBVSxDQUFDLENBQUM7SUFDL0YsQ0FBQztDQUNGO0FBaEdELHNDQWdHQztBQUdELGtCQUFlLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgQnVpbGRFdmVudCwgQnVpbGRlciwgQnVpbGRlckNvbmZpZ3VyYXRpb24sXG4gICBCdWlsZGVyQ29udGV4dCwgQnVpbGRlckRlc2NyaXB0aW9uIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdCc7XG5pbXBvcnQgeyBnZXRTeXN0ZW1QYXRoIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgQ2hpbGRQcm9jZXNzLCBmb3JrIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBjb25jYXRNYXAsIG1hcCwgc3dpdGNoTWFwLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgKiBhcyB0cmVlS2lsbCBmcm9tICd0cmVlLWtpbGwnO1xuaW1wb3J0IHsgTm9kZWpzQnVpbGRCdWlsZGVyT3B0aW9ucyB9IGZyb20gJy4uL2J1aWxkJztcbmltcG9ydCB7IG1ha2VPdXRmaWxlTmFtZSB9IGZyb20gJy4uL3V0aWxzL21ha2Utb3V0ZmlsZS1uYW1lJztcblxuZXhwb3J0IGludGVyZmFjZSBCaW5hcnlCdWlsZGVyT3B0aW9ucyB7XG4gIGluc3BlY3Q6IGJvb2xlYW47XG4gIGFyZ3M6IHN0cmluZ1tdO1xuICBidWlsZFRhcmdldDogc3RyaW5nO1xuICB2ZXJib3NlOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgQmluYXJ5QnVpbGRlciBpbXBsZW1lbnRzIEJ1aWxkZXI8QmluYXJ5QnVpbGRlck9wdGlvbnM+IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGV4dDogQnVpbGRlckNvbnRleHQpIHsgfVxuXG4gIHJ1bih0YXJnZXQ6IEJ1aWxkZXJDb25maWd1cmF0aW9uPEJpbmFyeUJ1aWxkZXJPcHRpb25zPik6IE9ic2VydmFibGU8QnVpbGRFdmVudD4ge1xuICAgIGNvbnN0IHJvb3QgPSBnZXRTeXN0ZW1QYXRoKHRoaXMuY29udGV4dC53b3Jrc3BhY2Uucm9vdCk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRhcmdldC5vcHRpb25zO1xuICAgIGxldCBzdWJQcm9jZXNzOiBDaGlsZFByb2Nlc3N8bnVsbCA9IG51bGw7XG5cbiAgICAvLyBUT0RPOiBwcm9iYWJseSBuZWVkIGhhbmRsaW5nIG9mIHRoaXMgQ2hpbGRQcm9jZXNzXG4gICAgY29uc3Qga2lsbFByb2Nlc3M6ICgpID0+IE9ic2VydmFibGU8dm9pZD4gPSAoKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzID0+IHtcbiAgICAgICAgaWYgKCFzdWJQcm9jZXNzKSB7XG4gICAgICAgICAgb2JzLm5leHQoKTtcbiAgICAgICAgICBvYnMuY29tcGxldGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmVlS2lsbChzdWJQcm9jZXNzLnBpZCwgJ1NJR1RFUk0nLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIG9icy5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JzLm5leHQoKTtcbiAgICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHJ1blByb2Nlc3MgPSAob3V0ZmlsZTogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzID0+IHtcbiAgICAgICAgc3ViUHJvY2VzcyA9IGZvcmsob3V0ZmlsZSwgW10sIHtcbiAgICAgICAgICAvLyBUT0RPOiBzaG91bGQgYmUgY29uZmlndXJhYmxlIHRvIGluc3BlY2V0LWJya1xuICAgICAgICAgIGV4ZWNBcmd2OiBvcHRpb25zLmFyZ3MuY29uY2F0KG9wdGlvbnMuaW5zcGVjdCA/IFsnLS1pbnNwZWN0J10gOiBbXSksXG4gICAgICAgIH0pO1xuICAgICAgICBvYnMubmV4dCgpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiBraWxsUHJvY2VzcygpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlc3RhcnQgPSAoKSA9PiBraWxsUHJvY2VzcygpLnBpcGUoc3dpdGNoTWFwKCgpID0+IHJ1blByb2Nlc3Mob3V0ZmlsZSkpKTtcblxuICAgIGNvbnN0IGJ1aWxkZXJDb25maWcgPSB0aGlzLl9nZXRCdWlsZEJ1aWxkZXJDb25maWcob3B0aW9ucyk7XG4gICAgY29uc3Qgb3V0RmlsZU5hbWUgPSBtYWtlT3V0ZmlsZU5hbWUoYnVpbGRlckNvbmZpZy5vcHRpb25zLm1haW4pO1xuICAgIGNvbnN0IG91dGZpbGUgPSByZXNvbHZlKHJvb3QsIGJ1aWxkZXJDb25maWcub3B0aW9ucy5vdXRwdXRQYXRoLCBvdXRGaWxlTmFtZSk7XG5cbiAgICBpZiAoYnVpbGRlckNvbmZpZy5vcHRpb25zLmhtcikge1xuICAgICAgLy8gaW4gSE1SIG1vZGUgdGhlIHVzZXJzIGhhbmRsZXMgcmVzdGFydGluZyB0aGUgcHJvY2Vzc1xuICAgICAgLy8gd2Ugc2hvdWxkIG9ubHkgZG8gdGhhdCBvbiBhbiBlcnJvclxuICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0QnVpbGQoYnVpbGRlckNvbmZpZykucGlwZShcbiAgICAgICAgc3dpdGNoTWFwKCgpID0+IHtcbiAgICAgICAgICAvLyBvbmx5IHN0YXJ0IGl0IGlmIGl0J3MgbmV2ZXIgYmVlbiBydW5cbiAgICAgICAgICBpZiAoIXN1YlByb2Nlc3MpIHtcbiAgICAgICAgICAgIHJldHVybiBydW5Qcm9jZXNzKG91dGZpbGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzID0+IG9icy5uZXh0KCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIC8vIGlmIHNvbWV0aGluZyBoYXBwZW5zIHdlJ2xsIHJlc3RhcnQgaXQgZm9yIHRoZSB1c2VyXG4gICAgICAgIGNhdGNoRXJyb3IoZXJyID0+IHtcbiAgICAgICAgICAvLyB0aGlzLmNvbnRleHQubG9nZ2VyLmVycm9yKCdBbiBlcnJvciBvY2N1cmVkLCByZXN0YXJ0aW5nIHByb2Nlc3MnKTtcbiAgICAgICAgICAvLyB0aGlzLmNvbnRleHQubG9nZ2VyLmVycm9yKGVycik7XG5cbiAgICAgICAgICByZXR1cm4gcmVzdGFydCgpO1xuICAgICAgICB9KSxcbiAgICAgICAgbWFwKCgpID0+ICh7c3VjY2VzczogdHJ1ZX0pKSxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGFydEJ1aWxkKGJ1aWxkZXJDb25maWcpLnBpcGUoXG4gICAgICAgIC8vIHNob3VsZCBhbHdheXMgZW5zdXJlIHRoZSBwcm9jZXNzIGlzIGtpbGxlZFxuICAgICAgICBjb25jYXRNYXAoKCkgPT4gcmVzdGFydCgpKSxcbiAgICAgICAgbWFwKCgpID0+ICh7c3VjY2VzczogdHJ1ZX0pKSxcbiAgICAgICk7XG4gICAgfVxuXG5cbiAgfVxuXG4gIHByaXZhdGUgX3N0YXJ0QnVpbGQoYnVpbGRlckNvbmZpZzogQnVpbGRlckNvbmZpZ3VyYXRpb248Tm9kZWpzQnVpbGRCdWlsZGVyT3B0aW9ucz4pIHtcbiAgICBsZXQgYnVpbGREZXNjcmlwdGlvbjogQnVpbGRlckRlc2NyaXB0aW9uO1xuXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5hcmNoaXRlY3QuZ2V0QnVpbGRlckRlc2NyaXB0aW9uKGJ1aWxkZXJDb25maWcpLnBpcGUoXG4gICAgICB0YXAoZGVzY3JpcHRpb24gPT4gYnVpbGREZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uKSxcbiAgICAgIGNvbmNhdE1hcChidWlsZERlc2NyaXB0aW9uID0+IHRoaXMuY29udGV4dC5hcmNoaXRlY3QudmFsaWRhdGVCdWlsZGVyT3B0aW9ucyhcbiAgICAgICAgYnVpbGRlckNvbmZpZywgYnVpbGREZXNjcmlwdGlvbikpLFxuICAgICAgbWFwKCgpID0+IHRoaXMuY29udGV4dC5hcmNoaXRlY3QuZ2V0QnVpbGRlcihidWlsZERlc2NyaXB0aW9uLCB0aGlzLmNvbnRleHQpKSxcbiAgICAgIGNvbmNhdE1hcChidWlsZGVyID0+IGJ1aWxkZXIucnVuKGJ1aWxkZXJDb25maWcpKSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0QnVpbGRCdWlsZGVyQ29uZmlnKG9wdGlvbnM6IEJpbmFyeUJ1aWxkZXJPcHRpb25zKSB7XG4gICAgY29uc3QgW3Byb2plY3QsIHRhcmdldE5hbWUsIGNvbmZpZ3VyYXRpb25dID0gb3B0aW9ucy5idWlsZFRhcmdldC5zcGxpdCgnOicpO1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgd2F0Y2g6IHRydWUsIHZlcmJvc2U6IG9wdGlvbnMudmVyYm9zZSB9O1xuICAgIGNvbnN0IHRhcmdldFNwZWMgPSB7IHByb2plY3QsIHRhcmdldDogdGFyZ2V0TmFtZSwgY29uZmlndXJhdGlvbiwgb3ZlcnJpZGVzIH07XG5cbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LmFyY2hpdGVjdC5nZXRCdWlsZGVyQ29uZmlndXJhdGlvbjxOb2RlanNCdWlsZEJ1aWxkZXJPcHRpb25zPih0YXJnZXRTcGVjKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEJpbmFyeUJ1aWxkZXI7XG4iXX0=