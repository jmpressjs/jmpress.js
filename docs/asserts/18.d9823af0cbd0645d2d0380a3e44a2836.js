webpackJsonp(18,{54:function(a,b,c){a.exports='<h1>Plugin: Duration</h1><p>For automatically changing steps after a given duration. Makes the attributes <code>data-duration</code> and <code>data-duration-action</code> available:</p><pre class="language-html">&lt;div id=&quot;jmpress&quot;&gt;<br/>	&lt;div class=&quot;step&quot; data-duration=&quot;3000&quot;&gt;<br/>		Auto advanced after 3 second<br/>	&lt;/div&gt;<br/>	&lt;div class=&quot;step&quot; data-duration=&quot;5000&quot; data-duration-action=&quot;prev&quot;&gt;<br/>		Then advanced after 5 seconds and go back to the previous step<br/>	&lt;/div&gt;<br/>&lt;/div&gt;</pre><p>You can also display a progress bar indicating how long until the change will occur:</p><pre class="language-html">&lt;div id=&quot;jmpress&quot;&gt;<br/>	&lt;div class=&quot;step&quot;&gt;Step 1&lt;/div&gt;<br/>	&lt;div class=&quot;step&quot;&gt;Step 2&lt;/div&gt;<br/>	&lt;div class=&quot;ui-progressbar ui-widget ui-widget-content ui-corner-all&quot;&gt;<br/>		&lt;div id=&quot;my-progress-bar&quot; class=&quot;ui-progressbar-value ui-widget-header ui-corner-left&quot; style=&quot;width:0&quot;&gt;&lt;/div&gt;<br/>	&lt;/div&gt;<br/>&lt;/div&gt;</pre><p>Specify the progress bar using the duration.barSelector option:</p><pre class="language-javascript">$(selector).jmpress({<br/>	duration: {<br/>		barSelector: &#39;#my-progress-bar&#39;<br/>	}<br/>});</pre><h2><code>property</code> duration.defaultValue</h2><p>The duration that should be taken if no data-duration is defined.</p><h2><code>property</code> duration.defaultAction : <code>&#39;next&#39;</code></h2><p>The action that should be executed if no data-duration-action is defined.</p><h2><code>property</code> duration.barSelector</h2><p>A jQuery selector to the bar element on which a property should be changed.</p><h2><code>property</code> duration.barProperty : <code>&#39;width&#39;</code></h2><p>Set to property and property values which should be changed. A transition for the property are automatically applied on the element.</p><h2><code>property</code> duration.barPropertyStart : <code>0</code></h2><h2><code>property</code> duration.barPropertyEnd : &#39;`100%&#39;`</h2>'}})