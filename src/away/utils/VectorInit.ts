module away.utils
{
	export class VectorInit
	{
		public static Num(length:number=0, defaultValue:number=0, v:number[]=null):number[]
        {
			if (!v) v = new Array<number>();
			return away.utils.VectorInit.Pop(v, defaultValue, length);
        }
		
		public static Str(length:number=0, defaultValue:string='', v:string[]=null):string[]
        {
			if (!v) v = new Array<string>();
            return away.utils.VectorInit.Pop(v, defaultValue, length);
        }
		
		public static Bool(length:Number = 0, defaultValue:boolean = false, v:Array<boolean> = null):Array<boolean>
        {
			if (!v) v = new Array<boolean>();
            return away.utils.VectorInit.Pop(v, defaultValue, length);
        }
		
		public static VecNum(length:number=0, defaultValue:number=0, v:Array<Array<number>>=null):Array<Array<number>>
        {
			if (!v) v = new Array<Array<number>>();
            for (var g:number = 0; g < length; ++g) v.push(away.utils.VectorInit.Num());
			return v;
        }
		
		public static StarVec(length:number = 0, defaultValue:* = ""):Array<*>
        {
			var initVec:any[] = new Array<*>();
            for (var g:number = 0; g < length; ++g) initVec.push(defaultValue);
			return initVec;
        }

		public static AnyClass(_class:*, length:number = 0):*
        {
			var v:any[] = new Array<*>();
			for (var g:number = 0; g < length; ++g) v.push(null);
			return v;
        }
		
		private static Pop(v:*, defaultValue:*, length:number=0):*
        {
			if (length == 0) return v;
			for (var g:number = 0; g < length; ++g) v[g] = defaultValue;
            return v;
        }
	}
}
