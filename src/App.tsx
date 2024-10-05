import { Canvas, CanvasObject } from "../lib"

class WaveObject extends CanvasObject {
  timer = 0;

  create(): void { }

  update(delta: number): void {
    this.timer += delta;
  }

  draw(): void {
    const c = this.getContext();
    const canvas = c.canvas;

    const PAD = 4;

    const waveVPos = canvas.height * 3 / 4;
    const waveHPos = -PAD;
    const waveWidth = canvas.width + 2 * PAD;

    const waveF = 0.003;
    const waveH = waveVPos / 15;

    c.beginPath();

    c.moveTo(waveHPos, 0);
    c.lineTo(0, waveVPos);
    for (let i = waveHPos; i < waveWidth; i += 1) {
      const y = waveVPos + Math.sin(this.timer + i * waveF) * waveH;
      c.lineTo(i, y);
    }
    c.lineTo(waveHPos + waveWidth, 0);

    c.fillStyle = "#2563eb";
    c.fill();
  }
}

class Bubble extends CanvasObject {
  timer = 0;
  x = 0;
  y = 0;

  create(): void {}

  update(delta: number): void {
    this.timer += delta;
    this.y -= 200 * delta;
    if (this.y < -10) {
      this.destroy();
    }
  }

  draw(): void {
    const c = this.getContext();

    c.beginPath();
    c.arc(this.x + Math.sin(this.timer) * 50, this.y, 15, 0, 2 * Math.PI);
    c.fillStyle = "#FFFFFF";
    c.fill();
  }

}

class BubbleGenerator extends CanvasObject {
  timer = 0;

  create(): void {}

  update(delta: number): void {
    const TIMER = 2;

    this.timer += delta;
    if (this.timer < TIMER) return;

    const canvas = this.getContext().canvas;

    const bubble = new Bubble();
    bubble.y = canvas.height - 100;
    bubble.x = Math.random() * canvas.width;
    this.instanceObject(new Bubble());

    this.timer -= TIMER;
  }
  draw(): void { }

}

const objects = [new WaveObject(), new BubbleGenerator()];

function App() {
  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}>
      <Canvas style={{ flex: 1 }} canvasObjects={objects} />
    </div>
  )
}

export default App
