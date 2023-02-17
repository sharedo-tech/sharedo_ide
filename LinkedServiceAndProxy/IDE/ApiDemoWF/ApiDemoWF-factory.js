(function()
{
    var createModel = function(actionModel, actionOptions, wfModel, stepModel)
    {
        // Reference self as the action model we're extending
        var self = actionModel;

        // Setup model defaults and extend from loaded config
        var defaults =
        {
            // Your custom config is passed in this object
            config:
            {
                workItemIdVariable: null,
                folio: null,
                amount: 0
            },
            
            // The list of connections as persisted
            connections: {}
        };
        var options = $.extend(true, {}, defaults, actionOptions);

        self.config.workItemIdVariable = ko.observable(options.config.workItemIdVariable);
        self.config.folio = ko.observable(options.config.folio);
        self.config.amount = ko.observable(options.config.amount);
        
        self.validation.workItemIdVariable = Validator.required(self, self.config.workItemIdVariable, "Specify the work item to record against");
        self.validation.folio = Validator.required(self, self.config.folio, "Folio is required");

        self.actionModelErrorCount = ko.pureComputed(() =>
        {
            var fails = 0;
            if(self.validation.workItemIdVariable()) fails++;
            if(self.validation.folio()) fails++;
            return fails;
        });

        self.ui.workItemIdVariable = self.trackVariable(self.config.workItemIdVariable, "/Identifier/Work Type Identifier");
    };

    var dispose = function(actionModel)
    {
        var self = actionModel;
        self.ui.workItemIdVariable.dispose();
    };

    return {
        createModel: createModel,
        dispose: dispose
    };
})();