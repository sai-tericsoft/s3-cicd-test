import styled from 'styled-components'

export const TableStyles = styled.div`

.table {

  .t-tr {
    :last-child {
      .td {
        border-bottom: 0;
      }
    }
  } 
  
  .t-th,
  .t-td {

    :last-child {
      border-right: 0;
    }

     :not([data-sticky-td]) {
        flex-grow: 1;
      }
  }

  .t-tr {
       min-width: 100%;
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
  }

  &.sticky {
    overflow: auto;
    .header,
    .footer {
      position: sticky;
      z-index: 1;
      width: fit-content;
    }
    .header {
      top: 0;
      // box-shadow: 0px 1px 5px #ccc;
      min-width: 100%;
    }
    .footer {
      bottom: 0;
      // box-shadow: 0px -1px 5px #ccc;
    }
    .body {
      position: relative;
      z-index: 0;
    }
    [data-sticky-td] {
      position: sticky;
    }
    [data-sticky-last-left-td] {
      // box-shadow: 2px 0 5px #cccccc;
    }
    [data-sticky-first-right-td] {
      // box-shadow: -2px 0 5px #cccccc;
    }
  }
}
`
