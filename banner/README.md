# Profile banner

The 3D part of the banner is a [GSS](https://www.gss-lang.dev) scene: [`banner.gss`](banner.gss).

`render.html` draws it with the text. `capture.js` steps a fake clock and saves one PNG per frame (128 frames, 20 fps, one seamless 6.4 s loop).

```sh
npm i gss-lang@0.0.7 playwright   # in this folder
mkdir -p frames && python3 -m http.server 8765 &
node capture.js dark 128 20 frames/d_
node capture.js light 128 20 frames/l_
ffmpeg -framerate 20 -i frames/d_%04d.png -c:v libwebp_anim -lossless 1 -loop 0 ../assets/banner-dark.webp
ffmpeg -framerate 20 -i frames/l_%04d.png -c:v libwebp_anim -lossless 1 -loop 0 ../assets/banner-light.webp
```
