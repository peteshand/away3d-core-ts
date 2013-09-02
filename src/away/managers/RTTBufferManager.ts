///<reference path="../_definitions.ts"/>

module away.managers
{

	export class RTTBufferManager extends away.events.EventDispatcher
	{
		private static _instances:RTTBufferManagerVO[];
		
		private _renderToTextureVertexBuffer:away.display3D.VertexBuffer3D;
		private _renderToScreenVertexBuffer:away.display3D.VertexBuffer3D;
		
		private _indexBuffer:away.display3D.IndexBuffer3D;
		private _stage3DProxy:away.managers.Stage3DProxy;
		private _viewWidth:number = -1;
		private _viewHeight:number = -1;
		private _textureWidth:number = -1;
		private _textureHeight:number = -1;
		private _renderToTextureRect:away.geom.Rectangle;
		private _buffersInvalid:boolean = true;
		
		private _textureRatioX:number;
		private _textureRatioY:number;
		
		constructor(se:SingletonEnforcer, stage3DProxy:away.managers.Stage3DProxy)
		{

            super();

			if (!se)
            {

                throw new Error("No cheating the multiton!");

            }

			
			this._renderToTextureRect = new away.geom.Rectangle();
			
			this._stage3DProxy = stage3DProxy;

		}
		
		public static getInstance(stage3DProxy:away.managers.Stage3DProxy):RTTBufferManager
		{
			if (!stage3DProxy)
				throw new Error("stage3DProxy key cannot be null!");

            if ( RTTBufferManager._instances == null )
            {

                RTTBufferManager._instances = new Array<RTTBufferManagerVO>();
            }


            var rttBufferManager : RTTBufferManager = RTTBufferManager.getRTTBufferManagerFromStage3DProxy( stage3DProxy );

            if ( rttBufferManager == null )
            {

                rttBufferManager                = new away.managers.RTTBufferManager( new SingletonEnforcer() , stage3DProxy );

                var vo : RTTBufferManagerVO     = new RTTBufferManagerVO();

                    vo.stage3dProxy             = stage3DProxy;
                    vo.rttbfm                   = rttBufferManager;

                RTTBufferManager._instances.push( vo );

            }

            return rttBufferManager;

		}

        private static getRTTBufferManagerFromStage3DProxy( stage3DProxy:away.managers.Stage3DProxy ) : RTTBufferManager
        {

            var l : number = RTTBufferManager._instances.length;
            var r : RTTBufferManagerVO;

            for ( var c : number = 0 ; c < l ; c ++ )
            {

                r = RTTBufferManager._instances[ c ];

                if (r.stage3dProxy === stage3DProxy )
                {

                    return r.rttbfm;

                }

            }

            return null;

        }

        private static deleteRTTBufferManager( stage3DProxy:Stage3DProxy ) : void
        {

            var l : number = RTTBufferManager._instances.length;
            var r : RTTBufferManagerVO;

            for ( var c : number = 0 ; c < l ; c ++ )
            {

                r = RTTBufferManager._instances[ c ];

                if (r.stage3dProxy === stage3DProxy )
                {

                    RTTBufferManager._instances.splice( c , 1 );
                    return;

                }

            }


        }

		public get textureRatioX():number
		{

			if (this._buffersInvalid)
            {

                this.updateRTTBuffers();

            }

			return this._textureRatioX;

		}
		
		public get textureRatioY():number
		{

			if (this._buffersInvalid)
            {

                this.updateRTTBuffers();

            }

			return this._textureRatioY;

		}
		
		public get viewWidth():number
		{
			return this._viewWidth;
		}
		
		public set viewWidth(value:number)
		{
			if (value == this._viewWidth)
            {

                return;

            }

			this._viewWidth = value;

            this._buffersInvalid = true;

            this._textureWidth = away.utils.TextureUtils.getBestPowerOf2(this._viewWidth);
			
			if (this._textureWidth > this._viewWidth)
            {

                this._renderToTextureRect.x = Math.floor( (this._textureWidth - this._viewWidth)*.5);
                this._renderToTextureRect.width = this._viewWidth;

			}
            else
            {
				this._renderToTextureRect.x = 0;
                this._renderToTextureRect.width = this._textureWidth;

			}
			
			this.dispatchEvent( new away.events.Event(away.events.Event.RESIZE));

		}
		
		public get viewHeight():number
		{
			return this._viewHeight;
		}

		public set viewHeight(value:number)
		{
			if (value == this._viewHeight)
            {

                return;

            }

			this._viewHeight = value;

            this._buffersInvalid = true;

            this._textureHeight = away.utils.TextureUtils.getBestPowerOf2(this._viewHeight);
			
			if ( this._textureHeight > this._viewHeight)
            {

                this._renderToTextureRect.y = Math.floor((this._textureHeight - this._viewHeight)*.5);
                this._renderToTextureRect.height = this._viewHeight;

			}
            else
            {

                this._renderToTextureRect.y = 0;
                this._renderToTextureRect.height = this._textureHeight;

			}
			
			this.dispatchEvent(new away.events.Event(away.events.Event.RESIZE));

		}
		
		public get renderToTextureVertexBuffer():away.display3D.VertexBuffer3D
		{

			if (this._buffersInvalid)
            {

                this.updateRTTBuffers();

            }

			return this._renderToTextureVertexBuffer;
		}
		
		public get renderToScreenVertexBuffer():away.display3D.VertexBuffer3D
		{

			if (this._buffersInvalid)
            {

                this.updateRTTBuffers();

            }

			return this._renderToScreenVertexBuffer;

		}
		
		public get indexBuffer():away.display3D.IndexBuffer3D
		{
			return this._indexBuffer;
		}
		
		public get renderToTextureRect():away.geom.Rectangle
		{

			if (this._buffersInvalid)
            {

				this.updateRTTBuffers();

            }

			return this._renderToTextureRect;
		}
		
		public get textureWidth():number
		{
			return this._textureWidth;
		}
		
		public get textureHeight():number
		{
			return this._textureHeight;
		}
		
		public dispose()
		{

            RTTBufferManager.deleteRTTBufferManager( this._stage3DProxy );

			if (this._indexBuffer)
            {

                this._indexBuffer.dispose();
                this._renderToScreenVertexBuffer.dispose();
                this._renderToTextureVertexBuffer.dispose();
                this._renderToScreenVertexBuffer = null;
                this._renderToTextureVertexBuffer = null;
                this._indexBuffer = null;

			}
		}
		
		// todo: place all this in a separate model, since it's used all over the place
		// maybe it even has a place in the core (together with screenRect etc)?
		// needs to be stored per view of course
		private updateRTTBuffers()
		{
			var context:away.display3D.Context3D = this._stage3DProxy._iContext3D;
			var textureVerts:number[];
			var screenVerts:number[];

			var x:number;
            var y:number;

            if ( this._renderToTextureVertexBuffer  == null )
            {

                this._renderToTextureVertexBuffer = context.createVertexBuffer(4, 5);

            }

            if ( this._renderToScreenVertexBuffer == null )
            {

                this._renderToScreenVertexBuffer = context.createVertexBuffer(4, 5);

            }

			if (!this._indexBuffer)
            {

				this._indexBuffer = context.createIndexBuffer(6);

                this._indexBuffer.uploadFromArray( [2, 1, 0, 3, 2, 0], 0, 6);
			}
			
			this._textureRatioX = x = Math.min(this._viewWidth/this._textureWidth, 1);
            this._textureRatioY = y = Math.min(this._viewHeight/this._textureHeight, 1);
			
			var u1:number = (1 - x)*.5;
			var u2:number = (x + 1)*.5;
			var v1:number = (y + 1)*.5;
			var v2:number = (1 - y)*.5;
			
			// last element contains indices for data per vertex that can be passed to the vertex shader if necessary (ie: frustum corners for deferred rendering)
			textureVerts =[    -x, -y, u1, v1, 0,
				                x, -y, u2, v1, 1,
				                x, y, u2, v2, 2,
				                -x, y, u1, v2, 3 ];
			
			screenVerts = [     -1, -1, u1, v1, 0,
				                1, -1, u2, v1, 1,
				                1, 1, u2, v2, 2,
				                -1, 1, u1, v2, 3 ];
			
			this._renderToTextureVertexBuffer.uploadFromArray(textureVerts, 0, 4);
            this._renderToScreenVertexBuffer.uploadFromArray(screenVerts, 0, 4);
			
			this._buffersInvalid = false;
			
		}
	}
}