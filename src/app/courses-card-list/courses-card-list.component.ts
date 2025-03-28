import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {openEditCourseDialog} from "../course-dialog/course-dialog.component";
import {filter, take} from "rxjs/operators";

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css'],
    standalone: false
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    constructor(private dialog: MatDialog) {
    }

    ngOnInit() {

    }

    editCourse(course:Course) {
      openEditCourseDialog(this.dialog, course)
        .pipe(filter(val => !val))
        .subscribe(
          value => { console.log("New Course Val:",value); },
        )

    }

}









