vec2 swirl(vec2 p, float amount, float n)
{
    // mat3 T1 = mat3(1.0);
    // mat3 T2 = mat3(2.0, 0.0, -0.5,
    //                0.0, 2.0, -0.5,
    //                0.0, 0.0, 1.0);
    // float c = cos(theta);
    // float s = sin(theta);
    // mat2 T2 = mat2(c, -s,
    //               s, c)
    // vec3 po = T1 * (T2 * vec3(p, 1.0));
    // vec3 po = T2 * vec3(p, 1.0);
    // float radius = sqrt(dot(po.xy, po.xy));
    float dx = 2.0 * (p.x - 0.5);
    float dy = 2.0 * (p.y - 0.5);
	float radius = sqrt(dx*dx + dy*dy);
    //if (radius > 1.0) return p;
    //float dir = atan(po.y, po.x);
    float dir = atan(dy, dx);
    float fr = 1.0 - radius; // linear
    // float fr = pow(radius - 1.0, 2.0); // quadratic
    // float fr = exp(-4.0*(1.0 - radius)); // exponential
    // float fr = ceil(n * (1.0 - radius)) / n; // step
    float new_dir = dir + amount * fr;
    vec2 new_p;
    new_p.x = radius * cos(new_dir);
    new_p.y = radius * sin(new_dir);
    new_p.x = new_p.x / 2.0 + 0.5;
    new_p.y = new_p.y / 2.0 + 0.5;
    return new_p;
}

vec2 unswirl(vec2 p, float amount)
{
    float dx = 2.0 * (p.x - 0.5);
    float dy = 2.0 * (p.y - 0.5);
	float radius = sqrt(dx*dx + dy*dy);
    if (radius > 1.0) return p;
    float dir = atan(dy, dx);
    float fr = 1.0 - radius;
    float new_dir = dir - amount * fr;
    vec2 new_p;
    new_p.x = radius * cos(new_dir);
    new_p.y = radius * sin(new_dir);
    new_p.x = new_p.x / 2.0 + 0.5;
    new_p.y = new_p.y / 2.0 + 0.5;
    return new_p;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv.y = 1.0 - uv.y;
    // float kt = 0.5 + 0.5*sin(iGlobalTime);
    
    float max_n = 100.0;
    float max_amount = 12.0;
    float amount = iMouse.x / iResolution.x;
    float n = ceil(max_n * iMouse.y / iResolution.y);
    
    fragColor = texture(iChannel0, swirl(uv, max_amount * amount, n));
}