const POSITIVE_INTEGERS_PARTIAL = /^(\d+)?(\.)?(\d+)?$/;
const POSITIVE_INTEGERS = /^\d+(\.\d+)?$/;
const POSITIVE_WHOLE_NUMBERS = /^\d+?$/;
const NEGATIVE_WHOLE_NUMBERS = /^-?(\d+)?$/;
const FLOATING_WHOLE_NUMBERS = /^[+-]?\d+(\.\d+)?$/;

const Patterns = {
    POSITIVE_INTEGERS,
    POSITIVE_INTEGERS_PARTIAL,
    POSITIVE_WHOLE_NUMBERS,
    NEGATIVE_WHOLE_NUMBERS,
    FLOATING_WHOLE_NUMBERS
}

export default Patterns;



