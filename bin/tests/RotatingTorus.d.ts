/// <reference path="../../lib/Away3D.next.d.ts" />
declare module scene {
    class RotatingTorus extends away.events.EventDispatcher {
        private _requestAnimationFrameTimer;
        private _image;
        private _context3D;
        private _iBuffer;
        private _mvMatrix;
        private _pMatrix;
        private _texture;
        private _program;
        private _stage;
        constructor();
        public stage : away.display.Stage;
        private loadResources();
        private imageCompleteHandler(e);
        private onContext3DCreateHandler(e);
        private tick(dt);
    }
}
