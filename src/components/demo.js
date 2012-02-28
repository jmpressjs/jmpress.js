/*!
 * demo.js
 * Extras for running the main jmpress.js demo
 */
(function( $, document, window, undefined ) {

	'use strict';
	
	$.jmpress('register', 'demo', function() {
	
		$.jmpress("apply", "#showcase-nested", {
			x: 250
			,y: -30
			,rotate: { z: 20 }
			,secondary: {
				rotateZ: 90
				,y: 30
				,"": "siblings"
			}
			,scale: 0.3
		});
		$.jmpress("template", "main", { children: [
			{
				scale: 10
				,z: 1
			},
			{
				x: -800
				,y: -1100
				,rotate: -20
				,scale: 1.2
			},
			{
				x: -700
				,y: -500
				,rotate: -40
				,scale: 1.4
			},
			{
				x: 0
				,y: 100
				,rotate: -60
				,scale: 1.6
			},
			{
				x: 1000
				,y: 200
				,rotate: -95
				,scale: 1.8
			},
			{
				x: 1800
				,y: -100
				,rotate: -120
				,scale: 2
			},
			{
				x: 2500
				,y: -900
				,z: -350
				,rotate: -160
				,rotateX: 40
				,scale: 2.2
			},
			{
				x: 2600
				,y: -2500
				,rotate: -210
				,scale: 2.6
			}
		]});
		$('#jmpress').jmpress("route", ".step:not(#home)");
		var jmpressConfig = {
			// SET THE VIEW PORT
			viewPort: {
				height: 600
				,width: 1000
				,maxScale: 1 // do not scale up
			}
			// SET THE ACTIVE SLIDE IN THE NAV
			,setActive: function( slide ) {
				$('#nav a')
					.removeClass( 'ui-state-active' )
					.parent( 'li' )
						.removeClass( 'active' );
				var id = $(slide).attr('id');
				var idArr = id.split("-");
				id = "";
				for(var i = 0; i < idArr.length; i ++) {
					if ( id ) {
						id += "-";
					}
					id += idArr[i];
					$('#nav a[href=\"#' + id + '\"]')
						.addClass( 'ui-state-active' )
						.parent( 'li' )
							.addClass( 'active' );
				}
			}
			// UPON STEP LOAD/ENCODE CODE SAMPLES
			,afterStepLoaded: function( step, eventData ) {
				$(step).find('code:not(.noconvert)').each(function() {
					$(this).text($(this).html()).html();
				});
				$("pre").addClass('ui-state-default');
			}
			,afterInit: function( nil, eventData ) {
				$("#nav").css("opacity", 1);
				$("#reinit-jmpress").hide();
				$("#uninit-jmpress").show();
				$("#global-next").show();
				$("#global-prev").show();
				$("#read-docs").show();
				$("#docs").show();
				$('#home').find('.notinner').attr('class', 'inner').wrap('<div class="intro-top ui-state-default" />');
				$('#home').find('.intro-bottom').show();
			}
			,afterDeinit: function( nil, eventData ) {
				$("#nav").css("opacity", 0);
				$("#jmpress").addClass("normal-mode");
				$("#reinit-jmpress").show();
				$("#uninit-jmpress").hide();
				$("#global-next").hide();
				$("#global-prev").hide();
				$("#read-docs").hide();
				$("#docs").hide();
				$('#home').find('.intro-top .inner').attr('class', 'notinner').unwrap();
				$('#home').find('.intro-bottom').hide();
			}
			,containerClass: "ui-widget-content"
			,areaClass: ""
			,canvasClass: ""
			,initClass: "init-css"
			,notSupportedClass: "normal-mode"
			,presentationMode: { notesUrl: "index.notes.html" }
		};
		$('#jmpress').jmpress("toggle", 27, jmpressConfig, true);
		$('.next').click(function() {
			$('#jmpress').jmpress('next');
			return false;
		});
		$('.prev').click(function() {
			$('#jmpress').jmpress('prev');
			return false;
		});
		$('.nested-next').click(function() {
			$('#nested-jmpress').jmpress('next');
			return false;
		});
		$("#jmpress a[href], #global-next, #global-prev").addClass("ui-state-default ui-corner-all");
		$("#nav a, #nav-themes a").addClass("ui-button ui-widget ui-state-default");
		$("#nav a span").addClass("ui-button-text");
		//$('#home .intro-top, #home .intro-bottom').addClass('');
		$("#jmpress a[href], #nav a, #nav-themes a, #global-next, #global-prev").hover(function() {
			$(this).addClass("ui-state-hover");
		}, function() {
			$(this).removeClass("ui-state-hover");
		});
		// HACK TO CHANGE HINT IF IPAD
		var ua = navigator.userAgent.toLowerCase();
		if ( ua.search(/(ipad)/) !== -1 ) {
			$('.hint').text('Swipe support is coming :)');
		}

		$("a[data-theme]").click(function(event) {
			var theme = $(this).data("theme");

			$("#theme").remove();

			var link = $("<link>");
			link.attr({
					id: "theme",
					type: 'text/css',
					rel: 'stylesheet',
					href: "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/themes/"+theme+"/jquery-ui.css"
			});
			$("head").append( link );

			$("a[data-theme]").removeClass("ui-state-active");
			$(this).addClass("ui-state-active");

			event.preventDefault();
		});
		$("a[data-theme=start]").addClass("ui-state-active");
		$("#uninit-jmpress").click(function(event) {
			$("#jmpress").jmpress("deinit");
			window.location.hash = "";
			event.preventDefault();
		});
		$("#reinit-jmpress").click(function(event) {
			$("#jmpress").jmpress(jmpressConfig);
			event.preventDefault();
		});
		$("#nested-jmpress").jmpress({
			viewPort: {
				height: 200
				,width: 1000
			}
			,duration: { defaultValue: 3500, barSelector: "#nested-jmpress-bar" }
			,containerClass: "ui-widget-content"
			,hash: { use: false }
			,stepSelector: ".nested-step"
			,fullscreen: false
			,presentationMode: { use: false }
		});
		setTimeout(function() {
			$("#jmpress").removeClass("init-css");
		}, 500);
	
	});

}(jQuery, document, window));