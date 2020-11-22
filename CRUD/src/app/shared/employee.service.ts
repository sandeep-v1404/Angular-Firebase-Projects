import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Employee, EmployeeId } from "./employee.model";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  editEmployeeId: string = '';
  editEmployeeState: boolean = false;
  private employeeCollection!: AngularFirestoreCollection<Employee>;
  private employeeDoc!: AngularFirestoreDocument<EmployeeId>;
  employees!: Observable<EmployeeId[]>;
  constructor(public firestore: AngularFirestore) {
    this.employeeCollection = this.firestore.collection<Employee>("employees");
    this.employees = this.employeeCollection.snapshotChanges().pipe(map(actions =>
      actions.map(emp => {
        const data = emp.payload.doc.data() as Employee;
        const id = emp.payload.doc.id;
        return { id, ...data };
      }
      )
    ));
  }

  form: FormGroup = new FormGroup({
    fullName: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    mobile: new FormControl("", [Validators.required, Validators.minLength(8)]),
    city: new FormControl("", Validators.required),
    gender: new FormControl("", Validators.required),
    department: new FormControl("", Validators.required),
    hireDate: new FormControl("", Validators.required),
    isPermanent: new FormControl("", Validators.required),
  });
  initializeFormGroup() {
    this.form.setValue({
      fullName: '',
      email: '',
      mobile: '',
      city: '',
      gender: '',
      department: '',
      hireDate: '',
      isPermanent: false
    });
  }
  getEmployees() {
    return this.employees;
  }
  insertEmployee(employee: Employee) {
    this.employeeCollection.add(employee);
  }
  updateEmployee(employee: Employee, employeeId: string) {
    this.editEmployeeId = employeeId;
    this.employeeDoc.update(employee);
  }
  populateForm(employeeId: string) {
    this.employeeDoc = this.firestore.doc<EmployeeId>(`employees/${employeeId}`);
    this.employeeDoc.snapshotChanges().subscribe(emp => {
      const data = emp.payload.data();
      this.form.setValue({
        fullName: data?.fullName,
        email: data?.email,
        mobile: data?.mobile,
        city: data?.city,
        gender: data?.gender,
        department: data?.department,
        hireDate: data?.hireDate,
        isPermanent: data?.isPermanent
      });
      this.editEmployeeState = true;
    })
  }
  deleteEmployee(employeeId: string) {
    this.employeeDoc = this.firestore.doc<EmployeeId>(`employees/${employeeId}`);
    this.employeeDoc.delete();
  }
}