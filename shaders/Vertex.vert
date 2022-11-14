#version 300 es

layout (location = 0) in vec3 Position;
layout (location = 1) in vec3 Color;

out vec3 FragmentPosition;

uniform mat4 Projection;

void main() {
    FragmentPosition = Color;
    gl_Position = Projection * vec4(Position, 1.0);
}
