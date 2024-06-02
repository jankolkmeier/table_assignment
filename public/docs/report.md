# 1. Introduction
The assignment was to create a reusable Angular table component that can fetch and display table data from an API. In this document, I will describe in more detail how the table was implemented, given the different requirements from the assignment (see `description.md` or go to the [Assignment Page](/assignment) if viewing in the live demo). Below is a screenshot of the result, displaying a table of user data:

![Screenshot of the Table](/docs/screenshot_users.png)

I have generated code documentation for the Table module, which can be found here: 
 - [https://jankolkmeier.github.io/table_assignment/](https://jankolkmeier.github.io/table_assignment/)

I will link to this documentation throughout this report for reference.

# 2. Implementation of Requirements
There were 10 main requirements formulated. I will first describe them one by one, and then discuss the overall result more, including limitations and points of improvement.

## 2.1 The table should be created using Angular components and directives.
After setting up the `app` to render the user and products page in which the respective final tables should be included, I created the `baader-table` module folder. Inside this module folder, all components, services, and models related to the table module are placed. I used the Angular CLI to generate them. I chose a subfolder structure and naming conventions that align with Angular best practices.

Note that I decided not to use third-party dependencies for developing the table module. The only extra dependency added for the table module is the Angular component devkit (`@angular/cdk`), which features [CdkTable](https://material.angular.io/cdk/table/overview), an unopinionated starting point for building custom data tables.

## 2.2 The table receives the columns and the data as Input.
The result is the [TableView](https://jankolkmeier.github.io/table_assignment/components/TableViewComponent.html) component that can be used in the following way:

```html
<baader-table-view
    [columns]="products_display_columns"
    [url]="products_data_url">
</baader-table-view>
```

Here, `products_data_url` is the URL of the data, and `products_display_columns` is an array that describes the column names in the data and their indices. See below for how this array should be structured:

```typescript
products_data_url = "/data/products.json";
products_display_columns = [
  { name: "id", displayName: "ID" },
  { name: "title", displayName: "Title" },
  { name: "category", displayName: "Category" },
  { name: "price", displayName: "Price" },
];
```

In section 2.8, I will describe how to use different datasets and initialization options.

## 2.3 The table should fetch data from an API and display it in the table.
To fetch data, I implemented the injectable [TableDataService](https://jankolkmeier.github.io/table_assignment/injectables/TableDataService.html), which is responsible for fetching the data. The TableView uses this component to fetch and process table data when only a `url` is provided.

For this assignment, I prepared the two test endpoints, the `users.json` and `products.json` assets, which can be fetched locally.

Note that this implementation requires the data on the endpoint to be structured with the array of rows at the root of the JSON response object. As this may not always be the case, the TableDataService exposes the `getData$()` function, which can be used to first fetch the table data with a different structure. After extracting the row-array manually, the TableDataService's `processTableData()` can be used to turn it into a `Table`, which can be passed to our TableView component as an alternative to initializing it with the URL directly.

As an additional feature, the TableDataService has been expanded with caching and a mock saving functionality, allowing the same data to be viewed by multiple TableView components in parallel.

For displaying the table data, the table template (i.e., header row and table body rows) is created dynamically using `CdkTable`, depending on the selected columns and rows to display.

For the columns to display, a `displayColumns` property was created, describing the names (and displayNames) of the columns to show (defaulting to showing all columns). For the rows to display, a `dataView` object was created, which references the original rows from the `TableDataService`, but can be used to view a differently sorted, filtered, and paginated subset of the data (see the next sections). 

## 2.4 The table should support sorting by clicking on column headers.
To sort data by column, we listen to `(click)` events on the header, which affects the [SortState](https://jankolkmeier.github.io/table_assignment/interfaces/SortState.html) of the TableView, reflecting the column that was just clicked. When a column is pressed repeatedly, we cycle through the sort modes - ascending, descending, and back to the default sort (by original data order). Changing the SortState causes the dataView to be recomputed. For this, we generate a sort function for the given column and sort mode, which is one of the utility functions in [TableUtils](https://jankolkmeier.github.io/table_assignment/classes/TableUtils.html). 

## 2.5 The table should support filtering by a search term entered by the user.
To filter the data shown by the TableView component by a user-defined search string, a [FilterInputComponent](https://jankolkmeier.github.io/table_assignment/components/FilterInputComponent.html) was developed as part of the table module. 
This is a reusable component that provides UI elements for entering a filter string, and optionally selecting a category (or column). Here is the default use:

```html
<baader-filter-input 
    [filter]="filter" 
    (filterChange)="filterChanged()">
</baader-filter-input>
```

The FilterInputComponent drives the [FilterState](https://jankolkmeier.github.io/table_assignment/interfaces/FilterState.html) of the TableView. 
Just like when the SortState changes, the dataView is also recomputed when the FilterState changes. The dataView will include only the rows from the original data by `.filter()`-ing
the rows that contain columns with values including the filter search string. If a column is selected to search within, only the column is checked. String comparison is done by simply converting all values (numbers, booleans) inside the table `.toString()`.

## 2.6 The table should support pagination to display a limited number of rows at a time.
Similarly to the FilterInputComponent, a [PaginationComponent](https://jankolkmeier.github.io/table_assignment/components/PaginationComponent.html) was created, which drives the [RangeState](https://jankolkmeier.github.io/table_assignment/interfaces/RangeState.html) of the TableView.

Here, the dataView - after sorting and filtering, is subset based on the page selected in the paginator. The paginator needs only to know the total items for which to paginate to generate its UI. When the user changes the page, the paginator - based on the `pageItems` value - emits the `(pageChanged)` event that the TableView is subscribed to, containing a new RangeState, describing the index of the first row to show, and how many to show.

Since the rows to paginate on may be affected by the FilterState, the TableView does not bind the length of the total data to the Paginator input, but rather the length of the current items in the view after filtering:

```html
<baader-pagination 
    [totalItems]="currentFilteredItems()" 
    (pageChanged)="setRange($event)">
</baader-pagination>
```

## 2.7 The table should allow users to edit and update data directly from the table.
For the editing functionality, an extra internal column has been implemented that is displayed at the far right of the table. Inside this column are buttons that reflect the editing state. When no column is currently being edited, a pen is shown. Clicking the pen next to a row switches that row to editing mode. A copy of the row data is created, and the cells for that row turn into input fields modeling the data of the copied row.

The rightmost column for that row now shows two buttons, allowing the user to either revert or save the changes.

In a real application, the save function should be integrated with the business logic of the data service, i.e., causing a `PUT` or `PATCH` request to be made to the underlying database.

For the sake of the assignment, I have implemented the data manipulation in-memory only. The save function calls the TableDataService, which updates the cached version of the table that the TableView is rendering. Since in my implementation, multiple TableViews can display the same cached table data, a TableView subscribes to the TableDataService for a [dataSourceChanged](https://jankolkmeier.github.io/table_assignment/injectables/TableDataService.html#dataSourceChanged) event. 

## 2.8 The table should be configurable to work with different datasets and column configurations.
The TableView can be initialized by providing either the `url`, or a preprocessed (Observable) of the `data`. As described above, this way implementers of the table can modify the table data between fetching and rendering them in case they are not in the expected format.

The column configuration has also been described in section 2.2. One implementation challenge to discuss here is the case of nested data. Often, table data from databases or APIs contain nested data, such as the object below:

```typescript
[
    {
        "gender": "male",
        "name": {
            "title": "Mr",
            "first": "Gustav",
            "last": "Christiansen"
        }
    }, {
        // ...
    }, // ...
]
```

I have handled this as part of the data processing in the TableDataService, which uses the `TableUtils.flattenObjectToRow()` utility function to *flatten* the properties in an object recursively, joining property names of the nested values with a separator (`.`):

```typescript
{
    "gender": "male",
    "name.title": "Mr",
    "name.first": "Gustav",
    "name.last": "Christiansen"
}
```

Note that this approach is not foolproof, as conflicts can occur when the original data also uses dots in its property names (a more unique separator could help). Also, implementers of the `baader-table-view` need to be aware of this transformation, as it affects how the columns to be displayed need to be specified.

Finally, if we were to implement the above-mentioned business logic for updating changed data through an API, TableDataService needs to keep track of a mapping of this transformation, to be able to undo it for API calls.

## 2.9 (Nice to have) The table should support drag and drop to reorder rows.
Here I make use of the Angular CDK, which provides the [DragDropModule](https://material.angular.io/cdk/drag-drop/overview), which makes the table's rows draggable by applying the `cdkDrag` directive. The table is wrapped inside a `cdkDropList` container. 
To actually affect the display (and eventually the source data) of the drag-and-drop operation, I implement a callback for the `(cdkDropListDropped)` event. Here, I first change the order in the dataView only, to update the current view of the TableView immediately.

How a 'persistent' change of the table data should be implemented is difficult to define. For example, what effect should reordering have when the table is currently sorted by some column? Or where, relative to the entire dataset, should a row be placed when rearranging it while looking at a filtered view of the data?

For the sake of the assignment, I have elected to only update the view, not the source data, in the latter two cases.

If the current view is not filtered, and if it is sorted by its default sort (i.e., the order of the source data), I update the source data's order as part of the drop operation. This is not how such a feature should be implemented (the TableView should not manipulate the source data), but again, I made this choice for the sake of the assignment.

Finally, for compatibility with touchscreens, the drag operation uses a 400ms touch delay (i.e., press/click for at least 400ms on a row before the drag operation will unlock). This allows touchscreen users to still scroll the page/table contents without immediately dragging around rows.

## 2.10 (Nice to have) The table should allow users to reorder and resize columns.
I have implemented resizing of the columns using CSS only:

```css
.baader-table th {
    /* ... */
    resize: horizontal;
    /* ... */
}
```

However, having more control over the column width may be beneficial for the user experience going forward. While the current implementation adapts to the displayed data automatically, it also adapts whenever the data changes slightly, i.e., when changing page, filtering, sorting, or enabling row editing.

Resizing columns has not been implemented. I've looked into applying the same logic as used for reordering rows, but was unable to find a clean implementation. The issue is that `CdkTable` does not provide a directive for table header and body sections ([github issue](https://github.com/angular/components/issues/12402)). Manually templated `<thead>` and `<tbody>` templates will be overwritten by `CdkTable`. This way, we cannot separately have two drag groups inside the same table.

Reordering would still be possible by dynamically updating the `[column]` input of the TableView externally using a different UI element.

# 3. Other Implementation Notes & Future Improvements
Finally, some overall notes on my implementation of the assignment.

## 3.1 Unit Tests & Code Style
I have not written unit tests for this assignment. However, I have created an extensive test area (go to [Test Area](/test) on the live version) that at least allowed me to interactively validate various features of the table component. 

I have configured `eslint` to check linting before every commit.

## 3.2 Modularity
The components have been implemented with modularity in mind. Various controls have been exposed to be configurable (see also the test page), and text labels of the UI elements are exposed to be configured. The TableView itself may be broken down further, as it incorporates some functionality that may be reused elsewhere.

For example, the input elements for editing table cells could be factored out and replaced by elements from a library of input elements - allowing features such as input validation and feedback to the user. 

What's more, the integration with the TableDataService is pretty tight - perhaps the TableView should not be concerned with fetching the data directly. Instead, a Data component should perhaps be composable of a generic View component and DataSource service. But I deemed this level of abstraction to be out of scope for this assignment.

## 3.3 Accessibility
Reusable components such as the one described in this assignment should be developed with accessibility in mind from the start. My implementation does lack in this regard in many areas. However, at least I have attempted to make it accessible by keyboard (note: this works best on the User and Product pages, where only a single table is shown respectively). Tabbing through the elements allows controlling pagination, filtering, and sorting. To trigger a button press enter or space. Editing rows also works decently well using the keyboard.

## 3.4 Styling & Responsiveness
The CSS in this implementation was a bit of an afterthought. It is static (no SCSS, Sass). I have tried to keep styling per component limited, and apply an overall style for the project in the end. In the context of a real component library, this would be a more major point to consider.