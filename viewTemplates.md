# View template management system 
To store and retrieve view templates for users. Uses MongoDB as the database.

## Definitions:
- `contextView`: is a specific part in ITM Platform. For example, the project list, or the resource analysis.
- `view configuration`: or simply **view**, is the set of filters, columns, and other configurations that define how the view should be displayed in a contextView. For example, in a project list, the view configuration could be the columns displayed and filters applied. 
- `view template`: is a set of configurations that define where and when the view should be displayed. It includes a name, description, and other classifying attributes, plus the *view configuration* itself represented in the `view` attribute.
- `default view template`: a *view template* marked as default view for a context and a company. Defaults to `system default view template`. 
- `system default view template`: created by ITM Platform, the system default view for that context and **any** company.


## Database structure
Example of a view template in the `viewTemplates` collection:	
```js
{
    viewTemplateId: 'cbafa593-5ad9-4803-9d6e-e6490d9117d4',
    companyId: 15,
    contextView: 'resourceAnalysis',
    name: 'Totals Q1 2024',
    description: 'Projects live in Q1 2024',
    isPrivateToOwner: false,
    isDefaultViewInContext: true,
    createdDate: '2023-09-01T00:00:00.000Z',
    createdBy: { userId: 3890, displayName: 'Ben Li' },
    owner: { userId: 3892, displayName: 'John Doe'},
    lastUpdatedDate: '2023-12-01T00:00:00.000Z',
    lastUpdatedBy: { userId: 3890, displayName: 'Ben Li' },
    view: {}
}
```
Example of aan entry in the `lastViewedTemplates` collection:	
```js
{
    userId: 3890,
    contextView: 'resourceAnalysis',
    lastTemplateId: 'cbafa593-5ad9-4803-9d6e-e6490d9117d4',
    lastViewedDate: '2023-12-01T00:00:00.000Z'
}
```

## Endpoint /viewTemplates. 

### GET `/viewTemplates/{viewTemplateId}` 
Returns the specified template
* if the template `isPrivateToOwner`, only the owner can access it
* update the lastViewed for the user in the `lastViewedTemplates` collection

Error codes:
* If the template is private and the user is not the owner, return `403 {message:"Forbidden. Template is private to owner"}`
* If the template does not exist, return `404 {message:"Template not found"}`

  
### GET `/viewTemplates/active?contextView={contextView}` 
Returns the active view template for the contextView.
  * if the user has a `lastViewed` for the contextView, return the last viewed
  * otherwise, return the *default view* (which defaults to *system default view*) 
  * update the `lastViewed` for the user in the `lastViewedTemplates` collection
  
  Error codes:
  * If no contextView is provided, return `400 {message:"contextView is required"}`
  * If the contextView is not found, return `404 {message:"contextView not found"}`
  

### POST `/viewTemplates/` 
Create a new template and return the `viewTemplateId`

* mandatory attributes in the request body:
    * `contextView`
    * `name`
    * `view`
* default values for non-specified attributes in the request body
    * `isPrivateToOwner`: false
    * `isDefaultViewInContext`: false. If the user wants to create a default view, it must be set to true, and isPrivateToOwner must be false.
* values that will be automatically updated by the server and cannot be send in the body request: 
    * `viewTemplateId`
    * `companyId`
    * `createdDate`
    * `createdBy`
    * `owner` (same as createdBy)
    * `lastUpdatedDate`
    * `lastUpdatedBy`

Error codes:
* If any mandatory attribute is missing, return `400 {message:"{attribute} is required"}`
* If both `isPrivateToOwner` and `isDefaultViewInContext` are true, return `400 {message:"isPrivateToOwner and isDefaultViewInContext cannot be true at the same time"}`

### POST /viewTemplates/search
Returns the templates that match the search criteria, having the a similar to v2 other endpoints but simpler allowing filter.

Body request examples:

Return all templates for the contextView resourceAnalysis that are public:
```json
{"filter": {"contextView": "resourceAnalysis", "isPrivateToOwner": false}}
```
Return all templates created by the user 3892:

```json
{"filter": {"owner.Id": 3892}}
```

Error codes:
* If the filter is not provided, return `400 {message:"filter is required"}`
* If the filter is not valid, return `400 {message:"filter is not valid"}`

### PATCH /viewTemplates/{viewTemplateId}
Updates the specified template. 
* Allowed attributes in the request body:
    * `name`
    * `description`
    * `isPrivateToOwner`
    * `isDefaultViewInContext`
    * `view`
* `lastUpdatedDate` and `lastUpdatedBy` are automatically updated by the server

Error codes:
* If the template does not exist, return `404 {message:"Template not found"}`
* If the user is not the owner and the template is private, return `403 {message:"Forbidden. Template is private to owner"}`
* If both `isPrivateToOwner` and `isDefaultViewInContext` are true, return `400 {message:"isPrivateToOwner and isDefaultViewInContext cannot be true at the same time"}`


### DELETE /viewTemplates/{viewTemplateId} 
Delete the specified template
* If the template is the default view in the context, the default view must be changed to the last created template for the contextView. 

Error codes:
* If the template does not exist, return `404 {message:"Template not found"}`
* If the user is not the owner and the template is private, return `403 {message:"Forbidden. Template is private to owner"}`

    
## Notes
  - The requirement with isDefaultViewInContext is that we need to create a system default view for context in the database when developing a new contextView. The owner will be a sueradmin user or a user that doesn't exist,  A user could make a default view (never private) for new users.
  - For now, isPrivateToOwner and createdBy are the same. In the future, we could have a different createdBy and owner.
  - Link to [Postman Collection](https://planetary-moon-805575.postman.co/workspace/ITM-Platform~0a69d185-fab5-48c3-890b-e619b2acb113/collection/26760249-23265505-bc5d-491e-be9f-c03765acbd56?action=share&creator=26760249&active-environment=26760249-54c65ffd-7589-49d4-b6f9-46d9f328d9e3)

## How it works in the UI
Use cases:

1. A user accesses a contextView (eg, resource  Analysis) for the first time. The UI will call `GET /viewTemplates/active?contextView={contextView}` and show the default view (since there is no last viewed) for the contextView. 
  - If there was not a *default view* for the company and contextView, the system will return the *system default view*.
  - The `lastViewed` will be updated in the `lastViewedTemplates` collection.
1. The user changes the *view configuration* in the UI. For example, changing filters in the project list. This will not update the current *view template* unless the user saves the changes.
1. The user wants to save the changes. Since she is not the owner, the UI will allow "save as" and call `POST /viewTemplates/` to create a new view template.
1. The user accesses the same contextView again, so the UI calls `GET /viewTemplates/active?contextView={contextView}` returning the last view configuration accessed by the user. 
1. The user makes changes to the view configuration and saves it. Since she's the owner, the UI will call `PATCH /viewTemplates/{viewTemplateId}`.

### Behavior when the UI has no "Save as" or any other template management feature
If we want to apply this template management system without any UI feature to manage the templates, we can use the following behavior:
- Set a context variable `isTemplateManagementEnabled` to false. When false, the UI will not show any template management feature
- When the user changes the view configuration in the UI, the UI will call `POST /viewTemplates/` to create a new view template. The `name` will be the current date and time. The `isPrivateToOwner` will be true. The `isDefaultViewInContext` will be false. The `view` will be the current view configuration.
- When the user accesses the contextView, the UI will call `GET /viewTemplates/active?contextView={contextView}` returning the last view configuration accessed by the user.


