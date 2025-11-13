import { Component, inject, OnInit, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { RegisterCredentials, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account.service';
import { TextInput } from '../../../shared/text-input/text-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html'
})
export class Register implements OnInit {
  public readonly cancelRegister = output<boolean>();

  protected readonly credentials = {} as RegisterCredentials;
  protected readonly credentialsForm: FormGroup;
  protected readonly profileForm: FormGroup;
  protected readonly currentStep = signal(1);
  protected readonly validationErrors = signal<string[]>([]);

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly accountService = inject(AccountService);

  constructor() {
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });

    this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  private get password(): AbstractControl {
    return this.credentialsForm.controls['password'];
  }

  private get confirmPassword(): AbstractControl {
    return this.credentialsForm.controls['confirmPassword'];
  }

  public ngOnInit(): void {
    this.password.valueChanges.subscribe(() => this.confirmPassword.updateValueAndValidity());
  }

  protected register(): void {
    if (this.credentialsForm.invalid || this.profileForm.invalid) return;

    const formData = { ...this.credentialsForm.value, ...this.profileForm.value };
    this.accountService.register(formData).subscribe({
      next: () => this.router.navigateByUrl('/members'),
      error: (errors: string[]) => {
        console.error(errors);
        this.validationErrors.set(errors);
      }
    });
  }

  protected cancel(): void {
    this.cancelRegister.emit(false);
  }

  protected nextStep(): void {
    if (this.credentialsForm.valid) {
      this.currentStep.update(step => step + 1);
    }
  }

  protected prevStep(): void {
    this.currentStep.update(step => step - 1);
  }

  protected getMaxDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const { parent } = control;
      if (!parent) return null;

      return control.value === parent.get(matchTo)?.value ? null : { passwordMismatch: true };
    };
  }
}
