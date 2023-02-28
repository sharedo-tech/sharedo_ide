# Using linked services and the proxy for integration

This is the source code for everything demonstrated in the "Linked services and the proxy API" series of videos here: https://help.sharedo.co.uk/en_US/developer-guide-api-integration

# Running the demo service
The fake transaction service can be run from the `DemoApi` folder as follows;

To run with CORS disabled.
```
dotnet run
```

To run with CORS enabled.
```
dotnet run -- -cors
```

# Adding code to the IDE in sharedo
To add the IDE widget:

1. Create a new folder in the IDE called `ApiDemo`
2. Drag/drop `/IDE/ApiDemo.zip` onto that IDE folder
3. Click the menu button for the zip and select to extract all here.

To add the custom workflow action:

1. Create a ne folder in the IDE called `ApiDemoWF`
2. Drag/drop `/IDE/ApiDemoWF.zip` onto that IDE folder
3. Click the menu button for the zip and select to extract all here.