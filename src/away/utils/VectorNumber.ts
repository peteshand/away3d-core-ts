module away.utils
{
	export class VectorNumber
	{
		public static init(length:Number=0, defaultValue:Number=0, v:number[]=null):number[]
        {
			if (!v) v = new Array<number>(length);
            for (var g:Number = 0; g < length; ++g) v[g] = defaultValue;
            return v;
        }
	}
}
