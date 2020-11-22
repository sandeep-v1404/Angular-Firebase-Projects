import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmployeeId } from 'src/app/shared/employee.model';
import { AngularFirestore } from "@angular/fire/firestore";
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeComponent } from '../employee/employee.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor(public firestore: AngularFirestore, private notificationservice: NotificationService, public dialogService: DialogService, public service: EmployeeService, private dialog: MatDialog) {
    this.service.getEmployees().subscribe(employees => {
      this.dataSource = employees;
      this.employeeListData = new MatTableDataSource(this.dataSource);
      this.employeeListData.sort = this.sort;
      this.employeeListData.paginator = this.paginator;
    });
  };

  dataSource: EmployeeId[] = [];
  displayedColumns: string[] = ["fullName", "city", "department", "gender", "mobile", 'actions'];
  employeeListData !: MatTableDataSource<any>;



  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchKey!: string;
  ngOnInit() {

  }
  onSearchClear() {
    this.searchKey = "";
  }
  applyFilter() {
    this.employeeListData.filter = this.searchKey.trim().toLowerCase();
  }
  onCreate() {
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%"
    this.dialog.open(EmployeeComponent, dialogConfig);
  }
  onEdit(id: string) {
    this.service.populateForm(id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%"
    this.dialog.open(EmployeeComponent, dialogConfig);
  }
  onDelete(id: string) {
    // if (confirm("Are You Sure ?"))
    //   this.service.deleteEmployee(id);
    // this.notificationservice.warn("! Deleted Successfully");
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.deleteEmployee(id);
          this.notificationservice.warn('! Deleted successfully');
        }
      });
  }
}

