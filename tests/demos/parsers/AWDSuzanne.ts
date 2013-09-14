///<reference path="../../../src/away/_definitions.ts" />
///<reference path="../../../src/away/loaders/parsers/AWDParser.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/library/AssetLibraryTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/library/AssetLibraryTest.js
//------------------------------------------------------------------------------------------------

module demos.parsers {

    export class AWDSuzanne
    {

        private _view           : away.containers.View3D;
        private _token          : away.loaders.AssetLoaderToken;
        private _timer          : away.utils.RequestAnimationFrame;
        private _suzane         : away.entities.Mesh;
        private _light          : away.lights.DirectionalLight;
        private _lightPicker    : away.materials.StaticLightPicker;
        private _hoverControl   : away.controllers.HoverController;

        private _move           : boolean = false;
        private _lastPanAngle   : number;
        private _lastTiltAngle  : number;
        private _lastMouseX     : number;
        private _lastMouseY     : number;

        constructor()
        {

            away.Debug.LOG_PI_ERRORS = true;
            away.Debug.THROW_ERRORS = false;

            away.library.AssetLibrary.enableParser( away.loaders.AWDParser ) ;

            this._token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/suzanne.awd') );
            this._token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this._token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );

            this._view = new away.containers.View3D();
            this._timer = new away.utils.RequestAnimationFrame( this.render, this );

            this._light                  = new away.lights.DirectionalLight();
            this._light.color            = 0x683019;//683019;
            this._light.direction        = new away.geom.Vector3D( 1 , 0 ,0 );
            this._light.ambient          = 0.1;//0.05;//.4;
            this._light.ambientColor     = 0x85b2cd;//4F6877;//313D51;
            this._light.diffuse          = 2.8;
            this._light.specular         = 1.8;
            this._view.scene.addChild( this._light );



            this._lightPicker           = new away.materials.StaticLightPicker( [this._light] );

            window.onresize = () => this.resize();

        }

        private resize( )
        {
            this._view.y         = 0;
            this._view.x         = 0;
            this._view.width     = window.innerWidth;
            this._view.height    = window.innerHeight;
        }

        private render( dt : number ) //animate based on dt for firefox
        {


            if ( this._suzane )
            {
                this._suzane.rotationY += 1;
            }

            this._view.render();

            if ( this._hoverControl  )
            {

                this._hoverControl.update(false);

            }

        }

        public onAssetComplete ( e : away.events.AssetEvent )
        {

            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.AssetEvent.ASSET_COMPLETE' , away.library.AssetLibrary.getAsset(e.asset.name) );
            console.log( '------------------------------------------------------------------------------');

        }

        public onResourceComplete ( e : away.events.LoaderEvent )
        {

            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.LoaderEvent.RESOURCE_COMPLETE' , e  );
            console.log( '------------------------------------------------------------------------------');

            var loader			: away.loaders.AssetLoader   	= <away.loaders.AssetLoader> e.target;
            var numAssets		: number 						= loader.baseDependency.assets.length;

            for( var i : number = 0; i < numAssets; ++i )
            {
                var asset: away.library.IAsset = loader.baseDependency.assets[ i ];

                switch ( asset.assetType )
                {
                    case away.library.AssetType.MESH:

                        var mesh : away.entities.Mesh = <away.entities.Mesh> asset;
                            mesh.scale( 400 );

                        this._suzane = mesh;
                        this._suzane.material.lightPicker = this._lightPicker;
                        this._suzane.y = -100;

                        this._view.scene.addChild( mesh );
                        this._timer.start();


                        this.resize();

                        break;

                    case away.library.AssetType.GEOMETRY:
                        break;

                    case away.library.AssetType.MATERIAL:

                        /*
                        var m : away.materials.MaterialBase = <away.materials.MaterialBase> asset;
                            m.lightPicker = this._lightPicker;

                        console.log( m );
                        //*/
                        break;

                }

            }

            /*
            this._hoverControl = new away.controllers.HoverController( this._view.camera , this._suzane );
            document.onmousedown = ( e ) => this.onMouseDownHandler( e );
            document.onmouseup = ( e ) => this.onMouseUpHandler( e );
            document.onmousemove = ( e ) => this.onMouseMove( e );
            */

        }

        /*

        private onMouseUpHandler( e  )
        {
            this._move = false;
        }

        private onMouseMove( e )
        {


            if (this._move)
            {

                this._hoverControl.panAngle = 0.3 * (window.event.clientX - this._lastMouseX) + this._lastPanAngle;
                this._hoverControl.tiltAngle = 0.3 * (window.event.clientY - this._lastMouseY) + this._lastTiltAngle;
            }



        }

        private onMouseDownHandler( e  )
        {

            this._lastPanAngle      = this._hoverControl.panAngle;
            this._lastTiltAngle     = this._hoverControl.tiltAngle;

            this._lastMouseX        = window.event.clientX;//e.clientX;
            this._lastMouseY        = window.event.clientY;//e.clientX;

            this._move              = true;


        }

        */
    }

}