namespace("");

/**
 * Constructor for your widget - remember the name of this JS type must match the ID of the widget in it's .widget.json manifest
 * @param {} element            The Html DOM element to which this widget will bind
 * @param {} configuration      The configuration passed in from the designer/config
 * @param {} baseModel          The base widget model (contains unique id etc)
 * @returns {} 
 */
ApiDemo = function(element, configuration, baseModel)
{
    var self = this;
    var defaults =
    {
        id: null
    };
    var options = $.extend(true, {}, defaults, configuration);

    if( !options.id )
    {
        options.id = $ui.pageContext.sharedoId();
    };

    self.id = options.id;

    // Setup the local model
    self.model =
    {
        balance: ko.observable(0),
        rows: ko.observableArray([])
    };
};

/**
 * Called by the UI framework when this widget is being unloaded - clean up
 * any subscriptions or references here that would keep this instance alive
 */
ApiDemo.prototype.onDestroy = function()
{
    var self = this;
};

/**
 * Called by the UI framework after initial creation and binding to load data
 * into it's model
 */
ApiDemo.prototype.loadAndBind = function()
{
    var self = this;
    
    $ajax.get("/api/proxy/custom/_/api/transactions/" + self.id).then(r =>
    {
        self.model.balance(r.balance);
        self.model.rows(r.rows);
    });
};

ApiDemo.prototype.addRow = function()
{
    var self = this;
    
    var request = 
    {
        folio: "Hello from widget",
        delta: 10.27
    };
    
    $ajax.post("/api/proxy/custom/_/api/transactions/" + self.id, request).then(r =>
    {
        self.loadAndBind();
    });
};

