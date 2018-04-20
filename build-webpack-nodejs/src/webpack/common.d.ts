import { RealWebpackConfig } from './config';
/**
 * Enumerate loaders and their dependencies from this file to let the dependency validator
 * know they are used.
 *
 * require('ts-loader')
 */
export interface BuildOptions {
    progress: boolean;
    statsJson: boolean;
    verbose: boolean;
    extractLicenses: boolean;
    showCircularDependencies: boolean;
}
export declare function getCommonWebpackConfig(entry: string, outDir: string, tsconfigPath: string, outfileName: string, buildOptions: BuildOptions): RealWebpackConfig;
