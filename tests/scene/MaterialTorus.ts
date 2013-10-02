///<reference path="../../src/away/_definitions.ts" />

module scene
{
	export class MaterialTorus extends away.events.EventDispatcher
	{
		
		private _requestAnimationFrameTimer:away.utils.RequestAnimationFrame;
		private _image:HTMLImageElement;
		private _context3D:away.display3D.Context3D;
		
		private _iBuffer:away.display3D.IndexBuffer3D;
		private _normalMatrix:away.geom.Matrix3D;
		private _mvMatrix:away.geom.Matrix3D;
		private _pMatrix:away.utils.PerspectiveMatrix3D;
		private _texture:away.display3D.Texture;
		private _program:away.display3D.Program3D;
		
		private _stage:away.display.Stage;
		private _material:away.materials.ColorMaterial;
		
		private _stageProxy:away.managers.Stage3DProxy;
		private _stage3DManager:away.managers.Stage3DManager;
		
		constructor( )
		{
			super();

            away.Debug.THROW_ERRORS = false;
			
			if( !document )
			{
				throw "The document root object must be avaiable";
			}
			this._stage = new away.display.Stage( 800, 600 );
			
			this._stage3DManager = away.managers.Stage3DManager.getInstance( this._stage );
			
			this.loadResources();
		}
		
		public get stage():away.display.Stage
		{
			return this._stage;
		}
		
		private loadResources()
		{
			var urlRequest:away.net.URLRequest = new away.net.URLRequest( "130909wall_big.png" );
			var imgLoader:away.net.IMGLoader = new away.net.IMGLoader();
			imgLoader.addEventListener( away.events.Event.COMPLETE, this.imageCompleteHandler, this );
			imgLoader.load( urlRequest );
		}
		
		private imageCompleteHandler(e)
		{
			var imageLoader:away.net.IMGLoader = <away.net.IMGLoader> e.target
			this._image = imageLoader.image;
			
			this._stage.stage3Ds[0].addEventListener( away.events.Event.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
			this._stage.stage3Ds[0].requestContext();
		}
		
		private onContext3DCreateHandler( e )
		{
			this._stage.stage3Ds[0].removeEventListener( away.events.Event.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
			
			var stage3D: away.display.Stage3D = <away.display.Stage3D> e.target;
			
			//constructor(stage3DIndex:number, stage3D:away.display.Stage3D, stage3DManager:away.managers.Stage3DManager, forceSoftware:boolean = false, profile:string = "baseline")
		
			this._stageProxy = new away.managers.Stage3DProxy( 0, stage3D, this._stage3DManager );
			
			this._context3D = stage3D.context3D;
			
			//this._texture = this._context3D.createTexture( 512, 512, away.display3D.Context3DTextureFormat.BGRA, true );
			//this._texture.uploadFromHTMLImageElement( this._image );
			
			//var bitmapData: away.display.BitmapData = new away.display.BitmapData( 512, 512, true, 0x02C3D4 );
			//this._texture.uploadFromBitmapData( bitmapData );
			
			this._context3D.configureBackBuffer( 800, 600, 0, true );
			this._context3D.setColorMask( true, true, true, true );

            //var torus: away.primitives.TorusGeometry = new away.primitives.TorusGeometry( 1, 0.5, 32, 16, false );
            //var torus: away.primitives.CubeGeometry= new away.primitives.CubeGeometry( 1 , 1 , 1 , 32 , 32 , 32 );
            //var torus: away.primitives.CapsuleGeometry= new away.primitives.CapsuleGeometry( 1 , 1 , 32 , 32 );
            var torus: away.primitives.CylinderGeometry= new away.primitives.CylinderGeometry( 0 , 2 , 3 , 32 , 32 );
            //var torus: away.primitives.SphereGeometry= new away.primitives.SphereGeometry( 2 , 32 , 32 );
            //var torus: away.primitives.RegularPolygonGeometry= new away.primitives.RegularPolygonGeometry( 4 );// NOT WORKING
			torus.iValidate();
			
			var vertices:number[] = torus.getSubGeometries()[0].vertexData;
			var indices:number[] = torus.getSubGeometries()[0].indexData;
			
			/**
			  * Updates the vertex data. All vertex properties are contained in a single Vector, and the order is as follows:
			  * 0 - 2: vertex position X, Y, Z
			  * 3 - 5: normal X, Y, Z
			  * 6 - 8: tangent X, Y, Z
			  * 9 - 10: U V
			  * 11 - 12: Secondary U V
			  */
			var stride:number = 13;
			var numVertices: number = vertices.length / stride;
			var vBuffer: away.display3D.VertexBuffer3D = this._context3D.createVertexBuffer( numVertices, stride );
			vBuffer.uploadFromArray( vertices, 0, numVertices );
			
			var numIndices:number = indices.length;
			this._iBuffer = this._context3D.createIndexBuffer( numIndices );
			this._iBuffer.uploadFromArray( indices, 0, numIndices );
			
			this._program = this._context3D.createProgram();
			
			this._material = new away.materials.ColorMaterial();
			this._material._pScreenPass.iUpdateProgram( this._stageProxy );
			
			console.log( this._material._pScreenPass.iGetVertexCode() );
			
			var vProgram:string = 	"attribute vec3 aVertexPosition;\n" +
									"attribute vec2 aTextureCoord;\n" +
									"attribute vec3 aVertexNormal;\n" +
									
									"uniform mat4 uPMatrix;\n" +
									"uniform mat4 uMVMatrix;\n" +
									"uniform mat4 uNormalMatrix;\n" +
									
									"varying vec3 vNormalInterp;\n" +
									"varying vec3 vVertPos;\n" +
									
									"void main(){\n" +
									"	gl_Position = uPMatrix * uMVMatrix * vec4( aVertexPosition, 1.0 );\n" +
									"	vec4 vertPos4 = uMVMatrix * vec4( aVertexPosition, 1.0 );\n" +
									"	vVertPos = vec3( vertPos4 ) / vertPos4.w;\n" +
									"	vNormalInterp = vec3( uNormalMatrix * vec4( aVertexNormal, 0.0 ) );\n" +
									"}\n";
			
			var fProgram:string = 	"precision mediump float;\n" +
									"varying vec3 vNormalInterp;\n" +
									"varying vec3 vVertPos;\n" +
									
									"const vec3 lightPos = vec3( 1.0,1.0,1.0 );\n" +
									"const vec3 diffuseColor = vec3( 0.3, 0.6, 0.9 );\n" +
									"const vec3 specColor = vec3( 1.0, 1.0, 1.0 );\n" +
									
									"void main() {\n" +
									"	vec3 normal = normalize( vNormalInterp );\n" +
									"	vec3 lightDir = normalize( lightPos - vVertPos );\n" +
									"	float lambertian = max( dot( lightDir,normal ), 0.0 );\n" +
									"	float specular = 0.0;\n" +
									
									"	if( lambertian > 0.0 ) {\n" +
									"		vec3 reflectDir = reflect( -lightDir, normal );\n" +
									"		vec3 viewDir = normalize( -vVertPos );\n" +
									"		float specAngle = max( dot( reflectDir, viewDir ), 0.0 );\n" +
									"		specular = pow( specAngle, 4.0 );\n" +
									"		specular *= lambertian;\n" +
									"	}\n" +
									
									"	gl_FragColor = vec4( lambertian * diffuseColor + specular * specColor, 1.0 );\n" +
									"}\n";
			
			this._program.upload( vProgram, fProgram );
			this._context3D.setProgram( this._program );
			
			this._pMatrix = new away.utils.PerspectiveMatrix3D();
			this._pMatrix.perspectiveFieldOfViewLH( 45, 800/600, 0.1, 1000 );
			
			this._mvMatrix = new away.geom.Matrix3D();
			this._mvMatrix.appendTranslation( 0, 0, 7 );
			
			this._normalMatrix = this._mvMatrix.clone();
			this._normalMatrix.invert();
			this._normalMatrix.transpose();
			
			this._context3D.setGLSLVertexBufferAt( "aVertexPosition", vBuffer, 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3 );
			this._context3D.setGLSLVertexBufferAt( "aVertexNormal", vBuffer, 3, away.display3D.Context3DVertexBufferFormat.FLOAT_3 )
			
			this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame( this.tick , this );
			this._requestAnimationFrameTimer.start();
		}
		
		private tick( dt:number )
		{
			this._mvMatrix.appendRotation( dt * 0.05, new away.geom.Vector3D( 0, 1, 0 ) );
            this._mvMatrix.position = new away.geom.Vector3D(0, 0, 5);

			this._context3D.setProgram( this._program );
			this._context3D.setGLSLProgramConstantsFromMatrix( "uNormalMatrix", this._normalMatrix, true );
			this._context3D.setGLSLProgramConstantsFromMatrix( "uMVMatrix", this._mvMatrix, true );
			this._context3D.setGLSLProgramConstantsFromMatrix( "uPMatrix", this._pMatrix, true );
			
			this._context3D.clear( 0.16, 0.16, 0.16, 1 );
			this._context3D.drawTriangles( this._iBuffer, 0, this._iBuffer.numIndices/3 );
			this._context3D.present();
		}
	}
}