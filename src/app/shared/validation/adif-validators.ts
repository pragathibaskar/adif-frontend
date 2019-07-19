import { AbstractControl, ValidationErrors, FormControl } from '@angular/forms';

export class AdifValidators {
    static forbiddenValue(control: AbstractControl): ValidationErrors | null {
        if (control.value && control.value !== '') {
            return  typeof control.value !== 'string' ? null :  { forbidden: true };
        }
    }
}
