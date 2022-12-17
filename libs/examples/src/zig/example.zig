const std = @import("std");

pub fn main() void {
    std.io.getStdOut().writeAll(
        "Hello world and welcome to Codefarem!",
    ) catch unreachable;
}
