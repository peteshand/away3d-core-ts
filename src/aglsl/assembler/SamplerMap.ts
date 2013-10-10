///<reference path="../../away/_definitions.ts" />

module aglsl.assembler
{
	
	export class SamplerMap
	{

        private static _map : Object[];
		
		constructor()
		{
			
		}
		
        public static map () : Object[]
        {
            if ( ! SamplerMap._map )
            {
                SamplerMap._map = new Array<Object>();
                SamplerMap._map['rgba'] = new Sampler( 8, 0xf, 0 );
                SamplerMap._map['rg'] = new Sampler( 8, 0xf, 5 );
                SamplerMap._map['r'] = new Sampler( 8, 0xf, 4 );
                SamplerMap._map['compressed'] = new Sampler( 8, 0xf, 1 );
                SamplerMap._map['compressed_alpha'] = new Sampler( 8, 0xf, 2 );
                SamplerMap._map['dxt1'] = new Sampler( 8, 0xf, 1 );
                SamplerMap._map['dxt5'] = new Sampler( 8, 0xf, 2 );

                // dimension
                SamplerMap._map['2d'] = new Sampler( 12, 0xf, 0 );
                SamplerMap._map['cube'] = new Sampler( 12, 0xf, 1 );
                SamplerMap._map['3d'] = new Sampler( 12, 0xf, 2 );

                // special
                SamplerMap._map['centroid'] = new Sampler( 16, 1, 1 );
                SamplerMap._map['ignoresampler'] = new Sampler( 16, 4, 4 );

                // repeat
                SamplerMap._map['clamp'] = new Sampler( 20, 0xf, 0 );
                SamplerMap._map['repeat'] = new Sampler( 20, 0xf, 1 );
                SamplerMap._map['wrap'] = new Sampler( 20, 0xf, 1 );

                // mip
                SamplerMap._map['nomip'] = new Sampler( 24, 0xf, 0 );
                SamplerMap._map['mipnone'] = new Sampler( 24, 0xf, 0 );
                SamplerMap._map['mipnearest'] = new Sampler( 24, 0xf, 1 );
                SamplerMap._map['miplinear'] = new Sampler( 24, 0xf, 2 );

                // filter
                SamplerMap._map['nearest'] = new Sampler( 28, 0xf, 0 );
                SamplerMap._map['linear'] = new Sampler( 28, 0xf, 1 );
            }
            return SamplerMap._map;
        }
	}
}

export class Sampler
{
	public shift:number;
	public mask:number;
	public value:number;
	
	constructor( shift:number, mask:number, value:number )
	{
		this.shift = shift;
		this.mask = mask;
		this.value = value;
	}
}


