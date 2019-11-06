import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent {

  clientForm: FormGroup;
  saving = false;

  constructor(
    private router: Router,
    private service: ClientService,
    public fb: FormBuilder,
  ) {

    this.clientForm = fb.group({
      firstName: [null, [Validators.required, Validators.maxLength(50)]],
      lastName: [null, [Validators.required, Validators.maxLength(50)]],
      birthdate: [null, [Validators.required, Validators.maxLength(10)]], // TODO: validate date
    });
  }

  get firstNameFormEx() { return this.clientForm.get('firstName'); }
  get lastNameFormEx() { return this.clientForm.get('lastName'); }
  get birthdateFormEx() { return this.clientForm.get('birthdate'); }

  public calendarOptions = {
    startAt: new Date(2000, 6, 15, 12, 0, 0),
    min: new Date(1870, 6, 15, 12, 0, 0),
    max: new Date()
  };

  get ready() {
    return this.saving
      || this.firstNameFormEx.invalid
      || this.lastNameFormEx.invalid
      || this.birthdateFormEx.invalid;
  }

  async onSave() {
    if (this.clientForm.valid) {
      this.saving = true;
      try {
        await this.service.create(this.clientForm.value);
        this.router.navigate(['/clientes']);
      } catch (ex) {
        console.log('error ' + ex);
      } finally {
        this.saving = false;
      }


    }
  }

}
