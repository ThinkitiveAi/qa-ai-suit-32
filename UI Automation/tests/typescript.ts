import { test, expect } from '@playwright/test';
interface Person {
  name: string;
  age: number;
  greet(): void;
}

// Create a class that implements the interface
class Student implements Person {
  constructor(public name: string, public age: number, public grade: number) {}

  greet(): void {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }

  showGrade(): void {
    console.log(`${this.name}'s grade is: ${this.grade}`);
  }
}

// Create a list of students
const students: Student[] = [
  new Student("Alice", 20, 90),
  new Student("Bob", 22, 85),
  new Student("Charlie", 19, 88),
];

// Loop through the array and call methods
for (const student of students) {
  student.greet();
  student.showGrade();
}