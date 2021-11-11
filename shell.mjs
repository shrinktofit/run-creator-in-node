import './polyfill-fetch.mjs';
import jsdom from "jsdom";

const { JSDOM, VirtualConsole } = jsdom;

const virtualConsole = new VirtualConsole();
virtualConsole.sendTo(console);

const engineURL = 'http://localhost:12138';

const url = 'http://localhost:12139';

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
    <div id="GameDiv">
        <canvas id="GameCanvas">
        </canvas>
    </div>
    <script src="./node_modules/systemjs/dist/system.js">
    </script>
    <script src="./node_modules/systemjs/dist/extras/named-register.js">
    </script>
    <script type="systemjs-importmap" src="${new URL('./import-map.json', engineURL)}">
    </script>
    <script src="${new URL('./bundled/index.js', engineURL)}">
    </script>
    <script>
        (async () => {
            const cc = await System.import('cce:/internal/x/cc-fu/base');
            // console.log(cc);
            const clip = new cc.AnimationClip();
            clip.duration = 1.0;
            const vectorTrack = new cc.animation.VectorTrack();
            vectorTrack.componentsCount = 3;
            vectorTrack.path.toProperty('position');
            clip.addTrack(vectorTrack);
            const animationState = new cc.AnimationState(clip);
            animationState.initialize(new cc.Node());
            for (let i = 0; i < 10000; ++i) {
                animationState.sample();
            }
        })();
    </script>
</html>
`, {
    url,
    runScripts: "dangerously",
    resources: "usable",
    virtualConsole,
});

dom.window.fetch = fetch;

