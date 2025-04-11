import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { FormComponent } from '@shared/components/form/form.component';

@Component({
  selector: 'app-social-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './social-info.component.html',
  styleUrl: './social-info.component.scss'
})
export class SocialInfoComponent {
  @Input() formGroup!: FormGroup;
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() profilePictureUrl: string | null = null;
  @Input() isUploading: boolean = false;
  @Output() formSubmit = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() changeProfileImage = new EventEmitter<void>();
  @ViewChild('socialInfoFormComponent') socialInfoFormComponent!: FormComponent;
}
