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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX3dlYnBhY2tfbm9kZWpzL3NyYy9iaW5hcnkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCwrQ0FBcUQ7QUFDckQsaURBQW1EO0FBQ25ELCtCQUErQjtBQUMvQiwrQkFBc0M7QUFDdEMsOENBQTRFO0FBQzVFLHNDQUFzQztBQUV0QyxrRUFBNkQ7QUFTN0Q7SUFFRSxZQUFtQixPQUF1QjtRQUF2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtJQUFJLENBQUM7SUFFL0MsR0FBRyxDQUFDLE1BQWtEO1FBQ3BELE1BQU0sSUFBSSxHQUFHLG9CQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLFVBQVUsR0FBc0IsSUFBSSxDQUFDO1FBRXpDLG9EQUFvRDtRQUNwRCxNQUFNLFdBQVcsR0FBMkIsR0FBRyxFQUFFO1lBQy9DLE1BQU0sQ0FBQyxJQUFJLGlCQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNYLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDakIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTt3QkFDMUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs0QkFDUixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQixDQUFDO3dCQUNELEdBQUcsQ0FB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QixDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FDckUsZUFBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLEVBQ2xELHFCQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUN6RSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxFQUNuQyxlQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUM1RSxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUNqRCxDQUFDO0lBQ0osQ0FBQztJQUVPLHNCQUFzQixDQUFDLE9BQTZCO1FBQzFELE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzVELE1BQU0sVUFBVSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBRTdFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBNEIsVUFBVSxDQUFDLENBQUM7SUFDL0YsQ0FBQztDQUNGO0FBaEdELHNDQWdHQztBQUdELGtCQUFlLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgQnVpbGRFdmVudCwgQnVpbGRlciwgQnVpbGRlckNvbmZpZ3VyYXRpb24sXG4gICBCdWlsZGVyQ29udGV4dCwgQnVpbGRlckRlc2NyaXB0aW9uIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdCc7XG5pbXBvcnQgeyBnZXRTeXN0ZW1QYXRoIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgQ2hpbGRQcm9jZXNzLCBmb3JrIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgY29uY2F0TWFwLCBtYXAsIHN3aXRjaE1hcCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0ICogYXMgdHJlZUtpbGwgZnJvbSAndHJlZS1raWxsJztcbmltcG9ydCB7IE5vZGVqc0J1aWxkQnVpbGRlck9wdGlvbnMgfSBmcm9tICcuLi9idWlsZCc7XG5pbXBvcnQgeyBtYWtlT3V0ZmlsZU5hbWUgfSBmcm9tICcuLi91dGlscy9tYWtlLW91dGZpbGUtbmFtZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmluYXJ5QnVpbGRlck9wdGlvbnMge1xuICBpbnNwZWN0OiBib29sZWFuO1xuICBhcmdzOiBzdHJpbmdbXTtcbiAgYnVpbGRUYXJnZXQ6IHN0cmluZztcbiAgdmVyYm9zZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEJpbmFyeUJ1aWxkZXIgaW1wbGVtZW50cyBCdWlsZGVyPEJpbmFyeUJ1aWxkZXJPcHRpb25zPiB7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNvbnRleHQ6IEJ1aWxkZXJDb250ZXh0KSB7IH1cblxuICBydW4odGFyZ2V0OiBCdWlsZGVyQ29uZmlndXJhdGlvbjxCaW5hcnlCdWlsZGVyT3B0aW9ucz4pOiBPYnNlcnZhYmxlPEJ1aWxkRXZlbnQ+IHtcbiAgICBjb25zdCByb290ID0gZ2V0U3lzdGVtUGF0aCh0aGlzLmNvbnRleHQud29ya3NwYWNlLnJvb3QpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0YXJnZXQub3B0aW9ucztcbiAgICBsZXQgc3ViUHJvY2VzczogQ2hpbGRQcm9jZXNzfG51bGwgPSBudWxsO1xuXG4gICAgLy8gVE9ETzogcHJvYmFibHkgbmVlZCBoYW5kbGluZyBvZiB0aGlzIENoaWxkUHJvY2Vzc1xuICAgIGNvbnN0IGtpbGxQcm9jZXNzOiAoKSA9PiBPYnNlcnZhYmxlPHZvaWQ+ID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9icyA9PiB7XG4gICAgICAgIGlmICghc3ViUHJvY2Vzcykge1xuICAgICAgICAgIG9icy5uZXh0KCk7XG4gICAgICAgICAgb2JzLmNvbXBsZXRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJlZUtpbGwoc3ViUHJvY2Vzcy5waWQsICdTSUdURVJNJywgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICBvYnMuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9icy5uZXh0KCk7XG4gICAgICAgICAgICBvYnMuY29tcGxldGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBydW5Qcm9jZXNzID0gKG91dGZpbGU6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9icyA9PiB7XG4gICAgICAgIHN1YlByb2Nlc3MgPSBmb3JrKG91dGZpbGUsIFtdLCB7XG4gICAgICAgICAgLy8gVE9ETzogc2hvdWxkIGJlIGNvbmZpZ3VyYWJsZSB0byBpbnNwZWNldC1icmtcbiAgICAgICAgICBleGVjQXJndjogb3B0aW9ucy5hcmdzLmNvbmNhdChvcHRpb25zLmluc3BlY3QgPyBbJy0taW5zcGVjdCddIDogW10pLFxuICAgICAgICB9KTtcbiAgICAgICAgb2JzLm5leHQoKTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ga2lsbFByb2Nlc3MoKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCByZXN0YXJ0ID0gKCkgPT4ga2lsbFByb2Nlc3MoKS5waXBlKHN3aXRjaE1hcCgoKSA9PiBydW5Qcm9jZXNzKG91dGZpbGUpKSk7XG5cbiAgICBjb25zdCBidWlsZGVyQ29uZmlnID0gdGhpcy5fZ2V0QnVpbGRCdWlsZGVyQ29uZmlnKG9wdGlvbnMpO1xuICAgIGNvbnN0IG91dEZpbGVOYW1lID0gbWFrZU91dGZpbGVOYW1lKGJ1aWxkZXJDb25maWcub3B0aW9ucy5tYWluKTtcbiAgICBjb25zdCBvdXRmaWxlID0gcmVzb2x2ZShyb290LCBidWlsZGVyQ29uZmlnLm9wdGlvbnMub3V0cHV0UGF0aCwgb3V0RmlsZU5hbWUpO1xuXG4gICAgaWYgKGJ1aWxkZXJDb25maWcub3B0aW9ucy5obXIpIHtcbiAgICAgIC8vIGluIEhNUiBtb2RlIHRoZSB1c2VycyBoYW5kbGVzIHJlc3RhcnRpbmcgdGhlIHByb2Nlc3NcbiAgICAgIC8vIHdlIHNob3VsZCBvbmx5IGRvIHRoYXQgb24gYW4gZXJyb3JcbiAgICAgIHJldHVybiB0aGlzLl9zdGFydEJ1aWxkKGJ1aWxkZXJDb25maWcpLnBpcGUoXG4gICAgICAgIHN3aXRjaE1hcCgoKSA9PiB7XG4gICAgICAgICAgLy8gb25seSBzdGFydCBpdCBpZiBpdCdzIG5ldmVyIGJlZW4gcnVuXG4gICAgICAgICAgaWYgKCFzdWJQcm9jZXNzKSB7XG4gICAgICAgICAgICByZXR1cm4gcnVuUHJvY2VzcyhvdXRmaWxlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9icyA9PiBvYnMubmV4dCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICAvLyBpZiBzb21ldGhpbmcgaGFwcGVucyB3ZSdsbCByZXN0YXJ0IGl0IGZvciB0aGUgdXNlclxuICAgICAgICBjYXRjaEVycm9yKGVyciA9PiB7XG4gICAgICAgICAgLy8gdGhpcy5jb250ZXh0LmxvZ2dlci5lcnJvcignQW4gZXJyb3Igb2NjdXJlZCwgcmVzdGFydGluZyBwcm9jZXNzJyk7XG4gICAgICAgICAgLy8gdGhpcy5jb250ZXh0LmxvZ2dlci5lcnJvcihlcnIpO1xuXG4gICAgICAgICAgcmV0dXJuIHJlc3RhcnQoKTtcbiAgICAgICAgfSksXG4gICAgICAgIG1hcCgoKSA9PiAoe3N1Y2Nlc3M6IHRydWV9KSksXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RhcnRCdWlsZChidWlsZGVyQ29uZmlnKS5waXBlKFxuICAgICAgICAvLyBzaG91bGQgYWx3YXlzIGVuc3VyZSB0aGUgcHJvY2VzcyBpcyBraWxsZWRcbiAgICAgICAgY29uY2F0TWFwKCgpID0+IHJlc3RhcnQoKSksXG4gICAgICAgIG1hcCgoKSA9PiAoe3N1Y2Nlc3M6IHRydWV9KSksXG4gICAgICApO1xuICAgIH1cblxuXG4gIH1cblxuICBwcml2YXRlIF9zdGFydEJ1aWxkKGJ1aWxkZXJDb25maWc6IEJ1aWxkZXJDb25maWd1cmF0aW9uPE5vZGVqc0J1aWxkQnVpbGRlck9wdGlvbnM+KSB7XG4gICAgbGV0IGJ1aWxkRGVzY3JpcHRpb246IEJ1aWxkZXJEZXNjcmlwdGlvbjtcblxuICAgIHJldHVybiB0aGlzLmNvbnRleHQuYXJjaGl0ZWN0LmdldEJ1aWxkZXJEZXNjcmlwdGlvbihidWlsZGVyQ29uZmlnKS5waXBlKFxuICAgICAgdGFwKGRlc2NyaXB0aW9uID0+IGJ1aWxkRGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbiksXG4gICAgICBjb25jYXRNYXAoYnVpbGREZXNjcmlwdGlvbiA9PiB0aGlzLmNvbnRleHQuYXJjaGl0ZWN0LnZhbGlkYXRlQnVpbGRlck9wdGlvbnMoXG4gICAgICAgIGJ1aWxkZXJDb25maWcsIGJ1aWxkRGVzY3JpcHRpb24pKSxcbiAgICAgIG1hcCgoKSA9PiB0aGlzLmNvbnRleHQuYXJjaGl0ZWN0LmdldEJ1aWxkZXIoYnVpbGREZXNjcmlwdGlvbiwgdGhpcy5jb250ZXh0KSksXG4gICAgICBjb25jYXRNYXAoYnVpbGRlciA9PiBidWlsZGVyLnJ1bihidWlsZGVyQ29uZmlnKSksXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEJ1aWxkQnVpbGRlckNvbmZpZyhvcHRpb25zOiBCaW5hcnlCdWlsZGVyT3B0aW9ucykge1xuICAgIGNvbnN0IFtwcm9qZWN0LCB0YXJnZXROYW1lLCBjb25maWd1cmF0aW9uXSA9IG9wdGlvbnMuYnVpbGRUYXJnZXQuc3BsaXQoJzonKTtcbiAgICBjb25zdCBvdmVycmlkZXMgPSB7IHdhdGNoOiB0cnVlLCB2ZXJib3NlOiBvcHRpb25zLnZlcmJvc2UgfTtcbiAgICBjb25zdCB0YXJnZXRTcGVjID0geyBwcm9qZWN0LCB0YXJnZXQ6IHRhcmdldE5hbWUsIGNvbmZpZ3VyYXRpb24sIG92ZXJyaWRlcyB9O1xuXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5hcmNoaXRlY3QuZ2V0QnVpbGRlckNvbmZpZ3VyYXRpb248Tm9kZWpzQnVpbGRCdWlsZGVyT3B0aW9ucz4odGFyZ2V0U3BlYyk7XG4gIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBCaW5hcnlCdWlsZGVyO1xuIl19