# Pixel Art

![Alternativer Text](/images/pixel-art-demo.jpg)

## How to use?

Define a canvas in your HTML body:

```html
<canvas id="canvas" width="400" height="400">
```

Embed PixelArtEngine.js

```html
<script src="scripts/PixelArtEngine.js"></script>
```

Define a new script block, define an 2D-array, which represents the 'pixels'.
Define some colors and let's go.
```js
    <script>
        document.addEventListener("DOMContentLoaded", function() {
         
            const pixelArt = [
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,],
                            ];

            const PALETTE = {
                0: "#000000", // Black
                1: "#CC5500", // Dark Orange
                2: "#FFD700", // Gold
                3: "#FFBA00", // LightOrange
            };

            // Instance
            const renderer = new PixelRenderer();

            // Init
            renderer.initCanvas("canvas");
            renderer.setPalette(PALETTE);
            renderer.setPixelSize(16); // Optional: Standard is 8
            renderer.setSpace(2);     // Optional: Standard is 1
            
            // Glow on, 70% intensity
            renderer.setGlow(true, 0.7);

            // Draw the pixel art
            renderer.draw(pixelArt);

            // glow off
            renderer.setGlow(false);

            // set single pixel 
            renderer.setPixel(0, 0, "#ffffff");
        });
    </script>
```    