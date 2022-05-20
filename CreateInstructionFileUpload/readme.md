# Sample IDE Widget - Create instruction file upload widget

## Overview
Simple IDE widget that captures some (very) basic data concerning a new instruction (it's reference and title), and allows user to choose one or more files to upload to the instruction as supporting documentation (evidence/statements/other). The user can choose files directly or drag/drop upload them. Leverages the work item create API and the related documents API to upload the files.

## Screenshots
![](assets/widget-1.png?raw=true)

![](assets/widget-2.png?raw=true)


## Demonstrates
- IDE based simple global portal widget
- Custom styling
- Common validation
- Common bindings
- Advanced bindings
  - Native drop zone (`nativeDropZone:`)
- Calling sharedo APIs
  - The create work item API
  - The upload related document API


