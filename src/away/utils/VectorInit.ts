module away.utils
{
	export class VectorInit
	{
		public static Num(length:number=0, defaultValue:number=0, v:number[]=null):number[]
        {
			if (!v) v = new Array<number>(length);
			return away.utils.VectorInit.Pop(v, defaultValue, length);
        }
		
		public static Str(length:Number=0, defaultValue:string='', v:string[]=null):string[]
        {
			if (!v) v = new Array<string>(length);
            return away.utils.VectorInit.Pop(v, defaultValue, length);
        }
		
		public static VecNum(length:Number=0, defaultValue:Number=0, v:Array<Array<number>>=null):Array<Array<number>>
        {
			if (!v) v = Array<Array<number>>(length);
            for (var g:number = 0; g < length; ++g) v[g].push(away.utils.VectorInit.Num());
			return v;
        }
		
		private static Pop(v:*, defaultValue:*, length:number=0):*
        {
			if (length == 0) return v;
			for (var g:number = 0; g < length; ++g) v[g] = defaultValue;
            return v;
        }
		
		
		/*public static Any(length:Number=0, defaultValue:Number=0, v:any[]=null):any[]
        {
			if (!v) v = new Array<any>(length);
            return away.utils.VectorInit.Pop(v, defaultValue, length);
        } 
		
		public static VecStr(length:Number=0, defaultValue:Number=0, v:any[]=null):any[]
        {
			if (!v) v = new Array<any>(length);
            for (var g:number = 0; g < length; ++g) v[g] = defaultValue;
            return v;
        }
		
		public static VecAny(length:Number=0, defaultValue:Number=0, v:any[]=null):any[]
        {
			if (!v) v = new Array<any>(length);
            for (var g:number = 0; g < length; ++g) v[g] = defaultValue;
            return v;
        }*/
	}
}
