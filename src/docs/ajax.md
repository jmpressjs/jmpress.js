# Ajax

This component enables you to load step via ajax. It handles the `data-src` and
`href` attribute and offers the `afterStepLoaded` event.

## `property` ajaxLoadedClass : `'loaded'`
Class given to ajax steps that have been loaded.

## `property` loadedClass : `'loaded'`
Class name to set on each step that has started loading.

## `callback` loadStep : `function( element, eventData )`
When a step has began loading via AJAX.

## `callback` afterStepLoaded : `function( element, eventData )`
Called after the AJAX step has finished loading.