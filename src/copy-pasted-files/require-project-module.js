"use strict";
// tslint:disable
// TODO: dont copy paste this
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: cleanup this file, it's copied as is from Angular CLI.
const resolve = require('resolve');
// Resolve dependencies within the target project.
function resolveProjectModule(root, moduleName) {
    return resolve.sync(moduleName, { basedir: root });
}
exports.resolveProjectModule = resolveProjectModule;
// Require dependencies within the target project.
function requireProjectModule(root, moduleName) {
    return require(resolveProjectModule(root, moduleName));
}
exports.requireProjectModule = requireProjectModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1wcm9qZWN0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfd2VicGFja19ub2RlanMvc3JjL2NvcHktcGFzdGVkLWZpbGVzL3JlcXVpcmUtcHJvamVjdC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlCQUFpQjtBQUNqQiw2QkFBNkI7O0FBRTdCLCtEQUErRDtBQUUvRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFbkMsa0RBQWtEO0FBQ2xELDhCQUFxQyxJQUFZLEVBQUUsVUFBa0I7SUFDbkUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUZELG9EQUVDO0FBRUQsa0RBQWtEO0FBQ2xELDhCQUFxQyxJQUFZLEVBQUUsVUFBa0I7SUFDbkUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBRkQsb0RBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZVxuLy8gVE9ETzogZG9udCBjb3B5IHBhc3RlIHRoaXNcblxuLy8gVE9ETzogY2xlYW51cCB0aGlzIGZpbGUsIGl0J3MgY29waWVkIGFzIGlzIGZyb20gQW5ndWxhciBDTEkuXG5cbmNvbnN0IHJlc29sdmUgPSByZXF1aXJlKCdyZXNvbHZlJyk7XG5cbi8vIFJlc29sdmUgZGVwZW5kZW5jaWVzIHdpdGhpbiB0aGUgdGFyZ2V0IHByb2plY3QuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVByb2plY3RNb2R1bGUocm9vdDogc3RyaW5nLCBtb2R1bGVOYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHJlc29sdmUuc3luYyhtb2R1bGVOYW1lLCB7IGJhc2VkaXI6IHJvb3QgfSk7XG59XG5cbi8vIFJlcXVpcmUgZGVwZW5kZW5jaWVzIHdpdGhpbiB0aGUgdGFyZ2V0IHByb2plY3QuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZVByb2plY3RNb2R1bGUocm9vdDogc3RyaW5nLCBtb2R1bGVOYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHJlcXVpcmUocmVzb2x2ZVByb2plY3RNb2R1bGUocm9vdCwgbW9kdWxlTmFtZSkpO1xufVxuIl19