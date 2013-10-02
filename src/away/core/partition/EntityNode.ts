///<reference path="../../_definitions.ts"/>

module away.partition
{
	export class EntityNode extends NodeBase
	{
		
		private _entity:away.entities.Entity;
		public _iUpdateQueueNext:EntityNode;
		
		constructor( entity:away.entities.Entity )
		{
			super();
			this._entity = entity;
			this._iNumEntities = 1;
		}
		
		public get entity():away.entities.Entity
		{
			return this._entity;
		}
		
		public removeFromParent():void
		{
			if( this._iParent)
			{
				this._iParent.iRemoveNode( this );
			}
			this._iParent = null;
		}
		
		//@override
		public isInFrustum( planes:away.math.Plane3D[], numPlanes:number ):boolean
		{
			if( !this._entity._iIsVisible )
			{
				return false;
			}
			return this._entity.worldBounds.isInFrustum( planes, numPlanes );
		}

        /**
         * @inheritDoc
         */
        public acceptTraverser(traverser:away.traverse.PartitionTraverser):void
        {
            traverser.applyEntity(this._entity);
        }

        /**
         * @inheritDoc
         */
        public isIntersectingRay(rayPosition:away.geom.Vector3D, rayDirection:away.geom.Vector3D):boolean
        {
            if (!this._entity._iIsVisible )
                return false;

            return this._entity.isIntersectingRay(rayPosition, rayDirection);
        }


	}
}