///<reference path="geom/Matrix3DTest.ts" />
///<reference path="geom/Vector3DTest.ts" />

module tests.unit
{
	export class TestSuite
	{
		
		private _test:tests.unit.tsUnit.Test;
		
		constructor()
		{
			var _div = document.createElement('div');
			_div.id = 'results';
			document.body.appendChild(_div);
			
			
			this._test = new tests.unit.tsUnit.Test();
            this._test.addTestClass( new tests.unit.geom.Matrix3DTest() , 'Matrix3DTest');
            this._test.addTestClass( new tests.unit.geom.Vector3DTest() , 'Vector3DTest');
			
			this._test.showResults( document.getElementById('results'), this._test.run() );
		}
		
		private addTests():void
		{
			
		}
		
		private bind
	}
}