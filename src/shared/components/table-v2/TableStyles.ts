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
    .th {
    
    }
    .th,
    .td {
      height: 52px;
      border-bottom: 1px solid #ddd;
      // border-right: 1px solid #ddd;
      background-color: #fff;
      overflow: hidden;

      :last-child {
        border-right: 0;
      }
    }
    .td {
      // display: flex !important;
      // align-items: center;
    }
    &.small {
    .th, .td {
        padding: 6px 4px;
        }
    }
    &.medium {
    .th, .td {
        padding: 18px 8px;
        }
    }
    &.large {
    .th, .td {
        padding: 20px 10px;
        }
    }
     .th{
     background-color: #E1EBEA;
     color: #212B36;
     font-weight: 700;
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
        box-shadow: 1px 0px 5px #ccc;
      }
      [data-sticky-first-right-td] {
        box-shadow: -1px 0px 5px #ccc;
      }
    }
  }
`
