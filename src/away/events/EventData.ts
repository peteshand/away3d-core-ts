/*
 * Author: mr.doob / https://github.com/mrdoob/eventdispatcher.js/
 * TypeScript Conversion : Karim Beyrouti ( karim@kurst.co.uk )
 */

///<reference path="../_definitions.ts"/>

/**
 * @module kurst.events
 */
module away.events {

    
    /**
     * Event listener data container
     */
    class EventData{

        public listener     : Function;
        public target       : Object;
        public type         : string;

    }

}