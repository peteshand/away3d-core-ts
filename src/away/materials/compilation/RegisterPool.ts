///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import flash.utils.Dictionary;
	
	/**
	 * RegisterPool is used by the shader compilation process to keep track of which registers of a certain type are
	 * currently used and should not be allowed to be written to. Either entire registers can be requested and locked,
	 * or single components (x, y, z, w) of a single register.
	 * It is used by ShaderRegisterCache to track usages of individual register types.
	 *
	 * @see away3d.materials.compilation.ShaderRegisterCache
	 */
	export class RegisterPool
	{
		private static _regPool:Object = new Object();//= new Dictionary();
		private static _regCompsPool:Object = new Object();//new Dictionary();
		
		private _vectorRegisters:away.materials.ShaderRegisterElement[];//Vector.<ShaderRegisterElement>;
		private _registerComponents;
		
		private _regName:string;
		private _usedSingleCount:Array<Array<number>>;//Vector.<Vector.<uint>>;
		private _usedVectorCount:number[] /*uint*/;
		private _regCount:number;
		
		private _persistent:boolean;
		
		/**
		 * Creates a new RegisterPool object.
		 * @param regName The base name of the register type ("ft" for fragment temporaries, "vc" for vertex constants, etc)
		 * @param regCount The amount of available registers of this type.
		 * @param persistent Whether or not registers, once reserved, can be freed again. For example, temporaries are not persistent, but constants are.
		 */
		constructor(regName:string, regCount:number, persistent:boolean = true)
		{
			this._regName = regName;
            this._regCount = regCount;
            this._persistent = persistent;
            this.initRegisters(regName, regCount);
		}
		
		/**
		 * Retrieve an entire vector register that's still available.
		 */
		public requestFreeVectorReg():away.materials.ShaderRegisterElement
		{
			for (var i:number = 0; i < this._regCount; ++i)
            {

				if (!this.isRegisterUsed(i))
                {
					if (this._persistent)
						this._usedVectorCount[i]++;

					return this._vectorRegisters[i];

				}
			}
			
			throw new Error("Register overflow!");
		}
		
		/**
		 * Retrieve a single vector component that's still available.
		 */
		public requestFreeRegComponent():away.materials.ShaderRegisterElement
		{

            //away.Debug.log( 'RegisterPool' , 'requestFreeRegComponent' , this._regCount);

			for (var i:number = 0; i < this._regCount; ++i)
            {

                //away.Debug.log( 'RegisterPool' , 'requestFreeRegComponent' , this._regCount , 'this._usedVectorCount:' + this._usedVectorCount[i] );

				if (this._usedVectorCount[i] > 0)
					continue;

				for (var j:number = 0; j < 4; ++j)
                {

					if (this._usedSingleCount[j][i] == 0)
                    {

						if (this._persistent)
                        {

                            this._usedSingleCount[j][i]++;

                        }

						return this._registerComponents[j][i];

					}
				}
			}
			
			throw new Error("Register overflow!");
		}
		
		/**
		 * Marks a register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
		 * has been called usageCount times again.
		 * @param register The register to mark as used.
		 * @param usageCount The amount of usages to add.
		 */
		public addUsage(register:away.materials.ShaderRegisterElement, usageCount:number)
		{
			if (register._component > -1)
            {

                this._usedSingleCount[register._component][register.index] += usageCount;

            }
			else
            {

                this._usedVectorCount[register.index] += usageCount;

            }

		}
		
		/**
		 * Removes a usage from a register. When usages reach 0, the register is freed again.
		 * @param register The register for which to remove a usage.
		 */
		public removeUsage(register:ShaderRegisterElement)
		{
			if (register._component > -1)
            {

				if (--this._usedSingleCount[register._component][register.index] < 0)
                {

                    throw new Error("More usages removed than exist!");

                }


			}
            else
            {
				if (--this._usedVectorCount[register.index] < 0)
                {

                    throw new Error("More usages removed than exist!");

                }

			}
		}

		/**
		 * Disposes any resources used by the current RegisterPool object.
		 */
		public dispose()
		{
			this._vectorRegisters = null;
            this._registerComponents = null;
            this._usedSingleCount = null;
            this._usedVectorCount = null;
		}
		
		/**
		 * Indicates whether or not any registers are in use.
		 */
		public hasRegisteredRegs():boolean
		{
			for (var i:number = 0; i < this._regCount; ++i)
            {

				if (this.isRegisterUsed(i))
					return true;

			}
			
			return false;
		}
		
		/**
		 * Initializes all registers.
		 */
		private initRegisters(regName:string, regCount:number)
		{
			
			var hash:string = RegisterPool._initPool(regName, regCount);
			
			this._vectorRegisters = RegisterPool._regPool[hash];
			this._registerComponents = RegisterPool._regCompsPool[hash];
			
			this._usedVectorCount = new Array<number>(regCount);

            this._usedSingleCount = new Array<Array<number>>(4);
			this._usedSingleCount[0] = new Array<number>(regCount );
            this._usedSingleCount[1] = new Array<number>(regCount );
            this._usedSingleCount[2] = new Array<number>(regCount );
            this._usedSingleCount[3] = new Array<number>(regCount );

            //console.log( 'this._usedVectorCount: ' , this._usedVectorCount );
            //console.log( 'this._usedSingleCount: ' , this._usedSingleCount );

		}
		
		private static _initPool(regName:string, regCount:number):string
		{
			var hash:string = regName + regCount;
			
			if (RegisterPool._regPool[hash] != undefined)
            {

                return hash;

            }

			var vectorRegisters:away.materials.ShaderRegisterElement[] = new Array<away.materials.ShaderRegisterElement>(regCount);///Vector.<ShaderRegisterElement> = new Vector.<ShaderRegisterElement>(regCount, true);
            RegisterPool._regPool[hash] = vectorRegisters;
			
			var registerComponents = [
				[],
				[],
				[],
				[]
				];
            RegisterPool._regCompsPool[hash] = registerComponents;
			
			for (var i:number = 0; i < regCount; ++i)
            {

				vectorRegisters[i] = new away.materials.ShaderRegisterElement(regName, i);
				
				for (var j:number = 0; j < 4; ++j)
                {

                    registerComponents[j][i] = new away.materials.ShaderRegisterElement(regName, i, j);

                }

			}

            //console.log ( 'RegisterPool._regCompsPool[hash] : ' , RegisterPool._regCompsPool[hash]  );
            //console.log ( 'RegisterPool._regPool[hash] : ' , RegisterPool._regPool[hash]  );

			return hash;
		}


		/**
		 * Check if the temp register is either used for single or vector use
		 */
		private isRegisterUsed(index:number):boolean
		{
			if (this._usedVectorCount[index] > 0)
            {

                return true;

            }

			for (var i:number = 0; i < 4; ++i)
            {

				if (this._usedSingleCount[i][index] > 0)
                {

                    return true;

                }

			}
			
			return false;
		}
	}
}
