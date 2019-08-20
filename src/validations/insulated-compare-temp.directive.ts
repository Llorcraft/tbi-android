import { Directive } from '@angular/core';
import { AbstractControl, ValidatorFn, Validator, FormControl, NG_VALIDATORS } from '@angular/forms';

function validateInsulatedCompareTempFactory(): ValidatorFn {
    return (c: AbstractControl) => {
        return c.value
            ? null
            : {
                insulatedCompareTemp: {
                    valid: false
                }
            }
    }
}

@Directive({
    selector: '[insulatedCompareTemp][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: InsulatedCompareTempValidator, multi: true }
    ]
})
export class InsulatedCompareTempValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validateInsulatedCompareTempFactory();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }
}