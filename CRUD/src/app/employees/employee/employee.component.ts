import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog"
import { EmployeeService } from "../../shared/employee.service";
import { NotificationService } from "../../shared/notification.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor(public service: EmployeeService,
    public notificationService: NotificationService,
    public dialogRef: MatDialogRef<EmployeeComponent>) { }

  departments = [
    { id: 1, value: 'CSE' },
    { id: 2, value: 'ECE' },
    { id: 3, value: 'IT' }];

  ngOnInit(): void {
  }
  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
  }
  onSubmit() {
    if (this.service.form.valid) {
      if (this.service.editEmployeeState) {
        this.service.updateEmployee(this.service.form.value, this.service.editEmployeeId);
        this.notificationService.success(":: Updated Successfully");
      }
      else {
        this.service.insertEmployee(this.service.form.value);
        this.notificationService.success(":: Submitted Successfully");
      }
      this.onClose();
    }
  }
  onClose() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();
  }
}
