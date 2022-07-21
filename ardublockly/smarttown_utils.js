/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
 'use strict';

 /** Create a namespace for the application. */
 var SmartTownUtils = SmartTownUtils || {};

 SmartTownUtils.EMOTION_COMMAND= "emotionalAction";
 SmartTownUtils.JUST_EMOTION_COMMAND= "justEmotionalAction";
 SmartTownUtils.BASE_COMMAND= "baseAction";
 SmartTownUtils.ACTIONLIST_COMMAND= "actionList";

SmartTownUtils.ACTION_PARAMS= {
    forward:["speed"],
    reverse:["speed"],
    left:["speed"],
    right:["speed"],
 };


 SmartTownUtils.EMOTION_OPTIONS= 
    [
        [
          "Muy Feliz",
          "very_happy"
        ],
        [
          "Feliz",
          "happy"
        ],
        [
          "Serio",
          "neutral"
        ],
        [
          "Triste",
          "sad"
        ],
        [
          "Muy Triste",
          "very_sad"
        ],
        [
          "Enfermo",
          "sick"
        ],
        [
          "Furioso",
          "angry"
        ],
        [
          "Sorprendido",
          "surprised"
        ]
      ];
