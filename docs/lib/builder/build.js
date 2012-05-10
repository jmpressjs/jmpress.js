var config = require("./config.json");

function getComponent(component) {
	return require("raw!../../../src/components/"+component+".js");
}

function getPlugin(plugin) {
	return require("raw!../../../src/plugins/"+plugin+".js");
}

function build(options) {
	var usedComponents = {};
	function addComponent(component) {
		usedComponents[component.name] = true;
		if(component.dependencies) {
			component.dependencies.forEach(addComponent);
		}
	}
	config.components.forEach(function(component) {
		if(options[component.name]) {
			addComponent(component);
		}
	});
	var file = [getComponent("core"), getComponent("near")];
	config.components.forEach(function(component) {
		if(usedComponents[component.name])
			file.push(component.plugin ? getPlugin(component.name) : getComponent(component.name));
	});
	return file.join("\n");
}

module.exports = build;
