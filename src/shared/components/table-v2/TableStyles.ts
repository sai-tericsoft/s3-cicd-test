import styled from 'styled-components'

export const TableStyles = styled.div`
.table {
  border: 1px solid #ddd;
  .tr {
    :last-child {
      .td {
        border-bottom: 0;
      }
    }
  } 
  .th,
  .td {
    height: 56px;
    border-bottom: 1px solid #ddd;
    // border-right: 1px solid #ddd;
    background-color: #fff;
    overflow: hidden;
    padding: 18px 16px;

    :last-child {
      border-right: 0;
    }

     :not([data-sticky-td]) {
        flex-grow: 1;
      }

  }
  .td {
    // display: flex !important;
    // align-items: center;
  }
  &.small {
    .th,
    .td {
      padding: 6px 4px;
    }
  }
  &.medium {
    .th,
    .td {
      padding: 18px 8px;
    }
  }
  &.large {
    .th,
    .td {
      padding: 20px 10px;
    }
  }
  .th {
    background-color: #e1ebea;
    color: #212b36;
    font-weight: 700;
  }
  
  .tr {
     min-width: 100%;
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
  }
  
  &.sticky {
    overflow: scroll;
    .header,
    .footer {
      position: sticky;
      z-index: 1;
      width: fit-content;
    }
    .header {
      top: 0;
      box-shadow: 0px 1px 5px #ccc;
      min-width: 100%;
    }
    .footer {
      bottom: 0;
      box-shadow: 0px -1px 5px #ccc;
    }
    .body {
      position: relative;
      z-index: 0;
    }
    [data-sticky-td] {
      position: sticky;
    }
    [data-sticky-last-left-td] {
      box-shadow: 2px 0 5px #cccccc;
    }
    [data-sticky-first-right-td] {
      box-shadow: -2px 0 5px #cccccc;
    }
  }
}
`
