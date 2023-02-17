var request = 
{
    folio: "$model.Configuration.folio",
    delta: $model.Configuration.amount
};

let workItemId = null;

let workItemVariable = "$model.Configuration.workItemIdVariable";
if( workItemVariable )
{
    workItemId = ctx[workItemVariable];
}
if( !workItemId )
{
    log.Error("No work item id!");
    throw "Failed to set a work item id, cannot proceed!";
}

// Debug the request
log.Information("Tx against:" + workItemId);
log.Information("Tx payload:" + JSON.stringify(request, null, 4));

let response = sharedo.http.post("/api/proxy/custom/_/api/transactions/" + workItemId, request);

if( response.status !== "OK" )
{
    log.Warning("Response status was " + response.status);
    throw "Not a success response";
}
else
{
    log.Information("Response was OK!");
}
