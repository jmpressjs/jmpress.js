/*
 * templates.js
 * The amazing template engine
 */
(function( $, document, window, undefined ) {

	"use strict";

	var $jmpress = $.jmpress,
		templateFromParentIdent = "_template_",
		templateFromApplyIdent = "_applied_template_",

		/* STATIC VARS */
		templates = {};

	/* FUNCTIONS */
	function addUndefined( target, values, prefix ) {
		var name, targetName;
		for ( name in values ) {
			targetName = name;
			if ( prefix ) {
				targetName = prefix +
					targetName.substr( 0, 1 ).toUpperCase() +
					targetName.substr( 1 );
			}
			if ( $.isPlainObject( values[ name ] ) ) {
				addUndefined( target, values[ name ], targetName );
			} else if ( target[ targetName ] === undefined ) {
				target[ targetName ] = values[ name ];
			}
		}
	}
	function applyChildrenTemplates( children, templateChildren ) {
		if ( $.isArray( templateChildren ) ) {
			if ( templateChildren.length < children.length ) {
				$.error( "More nested steps than children in template" );
			} else {
				children.each(function( idx, child ) {
					child = $( child );
					var tmpl = child.data( templateFromParentIdent ) || {};
					addUndefined( tmpl, templateChildren[ idx ] );
					child.data( templateFromParentIdent, tmpl );
				});
			}
		} else if ( $.isFunction( templateChildren ) ) {
			children.each(function( idx, child ) {
				child = $( child );
				var tmpl = child.data( templateFromParentIdent ) || {};
				addUndefined( tmpl, templateChildren( idx, child, children ) );
				child.data( templateFromParentIdent, tmpl );
			});
		} // TODO: else if (object)
	}
	function applyTemplate( data, element, template, eventData ) {
		if ( template.children ) {
			var children = element.children( eventData.settings.stepSelector );
			applyChildrenTemplates( children, template.children );
		}
		applyTemplateData( data, template );
	}
	function applyTemplateData( data, template ) {
		addUndefined( data, template );
	}

	/* HOOKS */
	$jmpress( "beforeInitStep", function( step, eventData ) {
		step = $( step );
		var data = eventData.data,
			templateFromAttr = data.template,
			templateFromApply = step.data( templateFromApplyIdent ),
			templateFromParent = step.data( templateFromParentIdent );
		if ( templateFromAttr ) {
			$.each( templateFromAttr.split( " " ), function( idx, tmpl ) {
				var template = templates[ tmpl ];
				applyTemplate( data, step, template, eventData );
			});
		}
		if ( templateFromApply ) {
			applyTemplate( data, step, templateFromApply, eventData );
		}
		if ( templateFromParent ) {
			applyTemplate( data, step, templateFromParent, eventData );
			step.data( templateFromParentIdent, null );
			if ( templateFromParent.template ) {
				$.each( templateFromParent.template.split( " " ), function( idx, tmpl ) {
					var template = templates[ tmpl ];
					applyTemplate( data, step, template, eventData );
				});
			}
		}
	});
	$jmpress( "beforeInit", function( nil, eventData ) {
		var template,
			data = $jmpress( "dataset", this ),
			dataTemplate = data.template,
			stepSelector = eventData.settings.stepSelector;
		if ( dataTemplate ) {
			template = templates[ dataTemplate ];
			applyChildrenTemplates( $( this ).find( stepSelector ).filter(function() {
				return !$( this ).parent().is( stepSelector );
			}), template.children );
		}
	});

	/* EXPORTED FUNCTIONS */
	$jmpress( "register", "template", function( name, tmpl ) {
		if ( templates[ name ] ) {
			templates[ name ] = $.extend( true, {}, templates[name], tmpl );
		} else {
			templates[ name ] = $.extend( true, {}, tmpl );
		}
	});
	$jmpress( "register", "apply", function( selector, tmpl ) {
		var template, stepSelector;
		if ( !tmpl ) {
			// TODO ERROR because settings not found
			stepSelector = $( this ).jmpress( "settings" ).stepSelector;
			applyChildrenTemplates( $( this ).find( stepSelector ).filter(function() {
				return !$( this ).parent().is( stepSelector );
			}), selector );
		} else if ( $.isArray( tmpl ) ) {
			applyChildrenTemplates( $( selector ), tmpl );
		} else {
			if ( typeof tmpl === "string" ) {
				template = templates[ tmpl ];
			} else {
				template = $.extend( true, {}, tmpl );
			}
			$( selector ).each(function( idx, element ) {
				element = $( element );
				var tmpl = element.data( templateFromApplyIdent ) || {};
				addUndefined( tmpl, template );
				element.data( templateFromApplyIdent, tmpl );
			});
		}
	});

}( jQuery, document, window ));
