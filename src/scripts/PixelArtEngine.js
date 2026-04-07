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
}