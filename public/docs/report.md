# Introduction
TODO

```typescript
let test = 0;
```

# Explanation by Item

## The table should be created using Angular components and directives.
TODO

## The table receives the columns and the data as Input.
TODO

## The table should fetch data from an API and display it in the table.
TODO

## The table should support sorting by clicking on column headers.
TODO

## The table should support filtering by a search term entered by the user.
TODO

## The table should support pagination to display a limited number of rows at a time.
TODO

## The table should allow users to edit and update data directly from the table.
TODO

## The table should be configurable to work with different datasets and column configurations.
TODO

## (Nice to have) The table should support drag and drop to reorder rows.
    Note that there are some oddities with how drag & drop should/could behave when working with a sorted or filtered table.
     - I propose that we update only the filtered view order when any kind of filter or sorting is applied. 
     - That means once a filter is applied again or changed, the effect of the reordering is voided.
     - However if there is no other filter applied, we can change the order of the base dataset by changing the __index value.
TODO

## (Nice to have) The table should allow users to reorder and resize columns.
TODO

# Other Implementation Notes
TODO

## Accessibility
TODO

## Responsiveness
TODO

## Unit Tests

## Modularity
TODO