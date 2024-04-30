import { _decorator, Color, Component, gfx, Graphics, Sprite, SpriteFrame, Texture2D } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('PickPixel')
@executeInEditMode()
export class PickPixel extends Component {
    @property(SpriteFrame)
    sourceSp: SpriteFrame;

    @property(Sprite)
    targetSprite: Sprite;

    @property(Graphics)
    targetGraphics: Graphics;

    @property({ displayName: "色值", type: [Color] })
    colorsOut: Color[] = [];

    @property({ displayName: "打印配置" })
    public get exportConfig() {
        return false;
    }
    public set exportConfig(v) {
        if (EDITOR) {
            this.pickPixel(this.sourceSp.texture);
        }
    }

    protected onLoad(): void {
       let buffer = this.pickPixel(this.sourceSp.texture);
       let pixels = this.bufferToPixelArray(buffer, this.sourceSp.texture.width, this.sourceSp.texture.height);
       this._pixels = pixels;
    }

    private _filledCount=0;
    private _pixels;
    protected start(): void {
        // this.schedule(()=>{
        //     this._filledCount++;
        //     this.drawPix(this._pixels, 2);
        // },0.02,1024,1);
        this._filledCount = -1;
        this.drawPix(this._pixels, 2);
    }

    private pickPixel(tex: any,offsetX = 0, offsetY = 0, widthExtend: number=1, heightExtend: number=1):Uint8Array {
        if (!this.sourceSp) {
            return;
        }
        const texture = tex;
        const gfxTexture = texture.getGFXTexture();
        if (!gfxTexture) {
            return;
        }
        let width = gfxTexture.info.width;
        let height = gfxTexture.info.height;
        const needSize = 4 * width * height;
        let buffer = new Uint8Array(needSize);
        const gfxDevice = texture._getGFXDevice();

        const bufferViews: ArrayBufferView[] = [];
        const regions: gfx.BufferTextureCopy[] = [];

        const region0 = new gfx.BufferTextureCopy();
        region0.texOffset.x = offsetX;
        region0.texOffset.y = offsetY;
        region0.texExtent.width = widthExtend*width;
        region0.texExtent.height = heightExtend*height;
        regions.push(region0);

        bufferViews.push(buffer);
        gfxDevice?.copyTextureToBuffers(gfxTexture, bufferViews, regions);
        return buffer;
        let dstTexture = new Texture2D();
        dstTexture.reset({
            width: width,
            height: height,
            format: Texture2D.PixelFormat.RGBA8888,
            mipmapLevel: 0
        });
        dstTexture.uploadData(buffer);
        // let sp = new SpriteFrame();
        // sp.texture = dstTexture;
        // this.targetSprite.spriteFrame = sp;
        let pixels = this.bufferToPixelArray(buffer, widthExtend, heightExtend);
        this.colorsOut.length=0;
        for (var i = 0; i < pixels.length; i++) {
            let pixel = pixels[i];
            for (let j = 0; j < pixel.length; j++) {
                const p = pixel[j];
                if(p.a == 0) continue;
                if(this.colorsOut.findIndex(e=>{e.r == p.r && e.g == p.g && e.b == p.b}) <0){
                    this.colorsOut.push(new Color(p.r, p.g, p.b));
                }
            }
        }
    }

    private drawPix(pixels: { r: number, g: number, b: number, a: number }[][], pixSize: number) {
        let g = this.targetGraphics;
        g.clear();
        let filledCount = this._filledCount;
        let startX = pixSize*pixels.length/2*-1;
        let startY =pixSize*pixels[0].length/2;
        let index =0;
        for (var i = 0; i < pixels.length; i++) {
            let pixel = pixels[i];
            for (let j = 0; j < pixel.length; j++) {
                const p = pixel[j];
                if(p.a == 0) continue;
                let color = new Color(p.r, p.g, p.b);
                if(filledCount>=0){
                    if(index >= filledCount) {
                        color = Color.GRAY;
                    }
                }
                g.fillColor = color;
                let y = startY-i * pixSize;
                let x = startX+j * pixSize;
                g.fillRect(x, y, pixSize, pixSize);
                index++;
            }
        }
        g.stroke();
    }

    private bufferToPixelArray(buffer: Uint8Array, width: number, height: number): { r: number, g: number, b: number, a: number }[][]{
        let pixelArray = [];
        for (var i = 0; i < width * height; i++) {
            pixelArray.push({ r: buffer[4 * i], g: buffer[4 * i + 1], b: buffer[4 * i + 2], a: buffer[4 * i + 3] });
        }
        let pixel = [];
        // let index = 0;
        // for (let i = 0; i < pixelArray.length; i++) {
        //     const p = pixelArray[i];

        //     index++;
        // }
        for (let i = 0; i < width; i++) {
            let row =[];
            for (let j = 0; j < height; j++) {
                row.push(pixelArray[i * width + j]);
            }
            pixel.push(row);
        }
        return pixel;
    }
}

