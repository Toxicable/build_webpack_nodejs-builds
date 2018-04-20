"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function makeOutfileName(path) {
    // TODO: should maybe be prefixed wit hthe project name?
    return path_1.basename(path).replace('.ts', '.js');
}
exports.makeOutfileName = makeOutfileName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFrZS1vdXRmaWxlLW5hbWUuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX3dlYnBhY2tfbm9kZWpzL3NyYy91dGlscy9tYWtlLW91dGZpbGUtbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtCQUFnQztBQUVoQyx5QkFBZ0MsSUFBWTtJQUMxQyx3REFBd0Q7SUFDeEQsTUFBTSxDQUFDLGVBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFIRCwwQ0FHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPdXRmaWxlTmFtZShwYXRoOiBzdHJpbmcpIHtcbiAgLy8gVE9ETzogc2hvdWxkIG1heWJlIGJlIHByZWZpeGVkIHdpdCBodGhlIHByb2plY3QgbmFtZT9cbiAgcmV0dXJuIGJhc2VuYW1lKHBhdGgpLnJlcGxhY2UoJy50cycsICcuanMnKTtcbn1cbiJdfQ==