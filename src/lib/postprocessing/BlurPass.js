/**
 * @author alteredq / http://alteredqualia.com/
 */

import {
    ShaderMaterial,
    LinearFilter,
    RGBAFormat,
    Vector2,
    WebGLRenderTarget,
    UniformsUtils,
} from "three";
import { Pass } from "../postprocessing/Pass.js";
import { BlurShader } from "../shaders/BlurShader.js";
import { CopyShader } from "../shaders/CopyShader.js";

var BlurPass = function (blur, resolution) {
    Pass.call(this);

    this.downSampleRatio = 2;
    this.blur = blur !== undefined ? blur : 0.8;
    this.resolution =
        resolution !== undefined
            ? new Vector2(resolution.x, resolution.y)
            : new Vector2(256, 256);
    var pars = {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat,
    };
    var resx = Math.round(this.resolution.x / this.downSampleRatio);
    var resy = Math.round(this.resolution.y / this.downSampleRatio);

    this.renderTargetBlurBuffer1 = new WebGLRenderTarget(resx, resy, pars);
    this.renderTargetBlurBuffer1.texture.name = "BlurPass.blur1";
    this.renderTargetBlurBuffer1.texture.generateMipmaps = false;
    this.renderTargetBlurBuffer2 = new WebGLRenderTarget(
        Math.round(resx / 2),
        Math.round(resy / 2),
        pars
    );
    this.renderTargetBlurBuffer2.texture.name = "BlurPass.blur2";
    this.renderTargetBlurBuffer2.texture.generateMipmaps = false;

    this.separableBlurMaterial1 = this.getSeperableBlurMaterial(16);
    this.separableBlurMaterial1.uniforms["texSize"].value = new Vector2(
        resx,
        resy
    );
    this.separableBlurMaterial1.uniforms["kernelRadius"].value = 1;
    this.separableBlurMaterial2 = this.getSeperableBlurMaterial(16);
    this.separableBlurMaterial2.uniforms["texSize"].value = new Vector2(
        Math.round(resx / 2),
        Math.round(resy / 2)
    );
    this.separableBlurMaterial2.uniforms["kernelRadius"].value = 1;

    var copyShader = CopyShader;
    this.copyUniforms = UniformsUtils.clone(copyShader.uniforms);
    this.materialCopy = new ShaderMaterial({
        uniforms: this.copyUniforms,
        vertexShader: copyShader.vertexShader,
        fragmentShader: copyShader.fragmentShader,
        depthTest: false,
        depthWrite: false,
        transparent: true,
    });

    //this.needsSwap = false;
    this.fsQuad = new Pass.FullScreenQuad(null);
};

BlurPass.prototype = Object.assign(Object.create(Pass.prototype), {
    constructor: BlurPass,

    render: function (
        renderer,
        writeBuffer,
        readBuffer /*, deltaTime, maskActive */
    ) {
        if (this.blur > 0) {
            // 4. Apply Blur on Half res
            this.fsQuad.material = this.separableBlurMaterial1;
            this.separableBlurMaterial1.uniforms[
                "kernelRadius"
            ].value = this.blur;
            this.separableBlurMaterial1.uniforms["colorTexture"].value =
                readBuffer.texture;
            this.separableBlurMaterial1.uniforms["direction"].value =
                BlurPass.BlurDirectionX;
            renderer.setRenderTarget(this.renderTargetBlurBuffer1);
            if (this.clear)
                renderer.clear(
                    renderer.autoClearColor,
                    renderer.autoClearDepth,
                    renderer.autoClearStencil
                );
            this.fsQuad.render(renderer);

            // Apply Blur on quarter res
            this.fsQuad.material = this.separableBlurMaterial2;
            this.separableBlurMaterial2.uniforms[
                "kernelRadius"
            ].value = this.blur;
            this.separableBlurMaterial2.uniforms[
                "colorTexture"
            ].value = this.renderTargetBlurBuffer1.texture;
            this.separableBlurMaterial2.uniforms["direction"].value =
                BlurPass.BlurDirectionY;
            renderer.setRenderTarget(writeBuffer);
            if (this.clear)
                renderer.clear(
                    renderer.autoClearColor,
                    renderer.autoClearDepth,
                    renderer.autoClearStencil
                );
            this.fsQuad.render(renderer);
        } else {
            this.fsQuad.material = this.materialCopy;
            this.copyUniforms["tDiffuse"].value = readBuffer.texture;
            renderer.setRenderTarget(writeBuffer);
            this.fsQuad.render(renderer);
        }
    },

    getSeperableBlurMaterial: function (maxRadius) {
        return new ShaderMaterial({
            depthTest: false,
            depthWrite: false,
            transparent: true,
            defines: {
                MAX_RADIUS: maxRadius,
            },

            uniforms: {
                colorTexture: { value: null },
                texSize: { value: new Vector2(0.5, 0.5) },
                direction: { value: new Vector2(0.5, 0.5) },
                kernelRadius: { value: 5.0 },
            },

            vertexShader:
                "varying vec2 vUv;\n\
				void main() {\n\
					vUv = uv;\n\
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
				}",

            fragmentShader:
                "#include <common>\
				varying vec2 vUv;\
				uniform sampler2D colorTexture;\
				uniform vec2 texSize;\
				uniform vec2 direction;\
				uniform float kernelRadius;\
				\
				float gaussianPdf(in float x, in float sigma) {\
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;\
				}\
				void main() {\
					vec2 invSize = 1.0 / texSize;\
					float weightSum = gaussianPdf(0.0, kernelRadius);\
					vec4 diffuseSum = texture2D( colorTexture, vUv) * weightSum;\
					vec2 delta = direction * invSize * kernelRadius/float(MAX_RADIUS);\
					vec2 uvOffset = delta;\
					for( int i = 1; i <= MAX_RADIUS; i ++ ) {\
						float w = gaussianPdf(uvOffset.x, kernelRadius);\
						vec4 sample1 = texture2D( colorTexture, vUv + uvOffset);\
						vec4 sample2 = texture2D( colorTexture, vUv - uvOffset);\
						diffuseSum += ((sample1 + sample2) * w);\
						weightSum += (2.0 * w);\
						uvOffset += delta;\
					}\
					gl_FragColor = diffuseSum/weightSum;\
				}",
        });
    },
});

BlurPass.BlurDirectionX = new Vector2(1.0, 0.0);
BlurPass.BlurDirectionY = new Vector2(0.0, 1.0);

export { BlurPass };
