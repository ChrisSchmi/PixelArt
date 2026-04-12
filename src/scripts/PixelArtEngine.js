class PixelRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.palette = {};
        this.pixelSize = 8;
        this.space = 1;

        // Glow Einstellungen
        this.glowEnabled = false;
        this.glowOpacity = 0.5; // Standard 50%

        // für 3d
        this.renderer = null; // Für Three.js WebGLRenderer
        this.scene = null;
        this.camera = null;        
    }

    initCanvas(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas) {
            this.ctx = this.canvas.getContext("2d");
        }
    }

    setPalette(palette) {
        this.palette = palette;
    }

    setPixelSize(size) {
        this.pixelSize = size;
    }

    setSpace(space) {
        this.space = space;
    }

    // Neue Methode: Glow steuern
    // enabled: boolean, opacity: 0.0 bis 1.0
    setGlow(enabled, opacity = 0.5) {
        this.glowEnabled = enabled;
        this.glowOpacity = opacity;
    }

    // Hilfsfunktion: Wandelt Hex-Farben in RGBA um für Transparenz
    _hexToRgba(hex, alpha) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    draw(pixelArtArray) {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < pixelArtArray.length; row++) {
            for (let col = 0; col < pixelArtArray[row].length; col++) {
                const colorId = pixelArtArray[row][col];
                if (this.palette[colorId]) {
                    this.setPixel(col, row, this.palette[colorId]);
                }
            }
        }
    }

    setPixel(x, y, color) {
        if (!this.ctx) return;

        // Glow Effekt anwenden
        if (this.glowEnabled) {
            this.ctx.shadowBlur = this.pixelSize * 0.8; // Glow-Radius basierend auf Pixelgröße
            this.ctx.shadowColor = this._hexToRgba(color, this.glowOpacity);
        } else {
            this.ctx.shadowBlur = 0;
        }

        this.ctx.fillStyle = color;
        const posX = x * (this.pixelSize + this.space);
        const posY = y * (this.pixelSize + this.space);

        this.ctx.fillRect(posX, posY, this.pixelSize, this.pixelSize);

        // Wichtig: Shadow nach dem Zeichnen zurücksetzen, 
        // damit andere Canvas-Operationen nicht beeinflusst werden
        this.ctx.shadowBlur = 0;
    }

    // Innerhalb deiner PixelRenderer Klasse:
    autoSize(enabled, data) {
        if (!enabled || !data || !this.canvas) return;

        const rows = data.length;
        const cols = data[0].length;

        // Die Logik: (Anzahl * Größe) + (Zwischenräume * Space)
        const calculatedWidth = (cols * this.pixelSize) + ((cols - 1) * this.space);
        const calculatedHeight = (rows * this.pixelSize) + ((rows - 1) * this.space);

        this.canvas.width = calculatedWidth;
        this.canvas.height = calculatedHeight;
        
        // Falls deine Engine interne Skalierungen nutzt, hier updaten
        console.log(`Canvas resized to: ${calculatedWidth}x${calculatedHeight}`);
    }

    init3D(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas)
        {
            console.error("Canvas ID '" + canvasId + "' not found!");
            return;
        }

        // Scene & Camera Setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 15; // Etwas weiter weg für bessere Sicht

        // 2. Renderer init
        try {
            this.renderer = new THREE.WebGLRenderer({ 
                canvas: this.canvas, 
                antialias: true 
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x111111); // Dunkler Hintergrund
        } catch (e) {
            console.error("WebGL initialization failed:", e);
        }
    }


    draw3D(pixelArtArray, rotate) {
        const rotateArtwork = rotate || false;
        if (!this.renderer || !this.scene) return;

        // Scene leeren, damit bei neuem Draw nichts übereinander liegt
while(this.scene.children.length > 0) { 
        const object = this.scene.children[0];
        
        // Geometrie vom Grafikspeicher löschen
        if (object.geometry) object.geometry.dispose();
        
        // Material vom Grafikspeicher löschen
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(m => m.dispose());
            } else {
                object.material.dispose();
            }
        }
        
        this.scene.remove(object); 
    }

        const size = this.pixelSize;

        pixelArtArray.forEach((layer, z) => {
            layer.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0 && this.palette[value]) {
                        const geometry = new THREE.BoxGeometry(size, size, size);
                        const material = new THREE.MeshBasicMaterial({ color: this.palette[value] });
                        const cube = new THREE.Mesh(geometry, material);
                        
                        // Positionierung (zentriert x und y grob)
                        cube.position.set(
                            x * size - (layer[0].length * size / 2), 
                            -y * size + (layer.length * size / 2), 
                            z * size
                        );
                        //cube.position.set(x, -y, z);
                        this.scene.add(cube);
                    }
                });
            });
        });

        // Animation Loop 
        if (!this.animationStarted) {
            this.animationStarted = true;
            const animate = () => {
                requestAnimationFrame(animate);
                if(rotateArtwork === true)
                {
                    this.scene.rotation.y += 0.01; // rotate
                }

                this.renderer.render(this.scene, this.camera);
            };
            animate();
        }
    }
}

