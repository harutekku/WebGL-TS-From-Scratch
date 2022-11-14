#version 300 es

precision highp float;

out vec4 Color;

in vec3 FragmentPosition;

uniform float RedTime;
uniform float GreenTime;
uniform float BlueTime;

void main() {
    Color = vec4(
        RedTime   * FragmentPosition.x,
        GreenTime * FragmentPosition.y,
        BlueTime  * FragmentPosition.z,
        1.0
    );
}
