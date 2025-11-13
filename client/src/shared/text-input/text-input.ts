import { Component, inject, input } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

type InputType =
  | 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email'
  | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password'
  | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel'
  | 'text' | 'time' | 'url' | 'week';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.html'
})
export class TextInput implements ControlValueAccessor {
  public readonly label = input<string>('');
  public readonly type = input<InputType>('text');
  public readonly maxDate = input<string>('');
  public readonly ngControl = inject(NgControl, { self: true });

  constructor() {
    this.ngControl.valueAccessor = this;
  }

  protected get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }
}
