/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuildEvent, Builder, BuilderConfiguration, BuilderContext } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
export interface NodejsBuildBuilderOptions {
    main: string;
    outputPath: string;
    tsConfig: string;
    watch: boolean;
    optimization: boolean;
    externals: string[];
    verbose: boolean;
    pathReplacements: {
        path: string;
        replaceWith: string;
    }[];
    progress: boolean;
    statsJson: boolean;
    extractLicenses: boolean;
    showCircularDependencies: boolean;
}
export declare class ServerBuilder implements Builder<NodejsBuildBuilderOptions> {
    context: BuilderContext;
    constructor(context: BuilderContext);
    run(target: BuilderConfiguration<NodejsBuildBuilderOptions>): Observable<BuildEvent>;
    private startWebpack(watch, compiler, verbose);
}
export default ServerBuilder;
