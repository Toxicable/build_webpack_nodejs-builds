/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuildEvent, Builder, BuilderConfiguration, BuilderContext } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
export interface BinaryBuilderOptions {
    inspect: boolean;
    args: string[];
    buildTarget: string;
    verbose: boolean;
}
export declare class BinaryBuilder implements Builder<BinaryBuilderOptions> {
    context: BuilderContext;
    constructor(context: BuilderContext);
    run(target: BuilderConfiguration<BinaryBuilderOptions>): Observable<BuildEvent>;
    private _startBuild(builderConfig);
    private _getBuildBuilderConfig(options);
}
export default BinaryBuilder;
