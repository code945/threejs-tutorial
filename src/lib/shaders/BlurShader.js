var BlurShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"ratio": { value: 0.8 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float ratio;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"vec4 blur(vec2 _uv, sampler2D texture) {                            ",
		"	float disp = 0.;                                                 ",
		"	float intensity = .1;                                            ",
		"	const int passes = 6;                                            ",
		"	vec4 c1 = vec4(0.0);                                             ",
		"	disp = intensity* ratio/100.0;                     ",
		"                                                                    ",
		"	for (int xi=0; xi<passes; xi++) {                                ",
		"		float x = float(xi) / float(passes) - 0.5;                   ",
		"		for (int yi=0; yi<passes; yi++) {                            ",
		"			float y = float(yi) / float(passes) - 0.5;               ",
		"			vec2 v = vec2(x, y);                                     ",
		"			float d = disp;                                          ",
		"			c1 += texture2D(texture, _uv + d*v);                     ",
		"		}                                                            ",
		"	}                                                                ",
		"	c1 /= float(passes*passes);                                      ",
		"	return c1;                                                       ",
		"}                                                                   ",

		"void main() {", 
		"	gl_FragColor = blur(vUv, tDiffuse);",

		"}"

	].join( "\n" )

};

export { BlurShader };
