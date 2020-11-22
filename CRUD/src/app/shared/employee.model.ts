export interface Employee {
    fullName: string;
    email: string;
    mobile: number;
    city: string;
    gender: string;
    department: string;
    hireDate: string;
    isPermanent: boolean;
}
export interface EmployeeId extends Employee {
    id: string;
}