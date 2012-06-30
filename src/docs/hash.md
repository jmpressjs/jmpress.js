# Hash in URL

This component handles updates to and change events from the url hash. It also handles clicks on link to other steps. As the initial hash also defines a starting step which should override the Starting Step component, this component should be included after that.

### `property` hash.use : `true`

Whether the url hash should be used with jmpress.

### `property` hash.update : `true`

Whether the url hash should be updated on step change.

### `property` hash.bindChange : `true`

Whether changes of the url hash and clicks on link should be converted into step selects.