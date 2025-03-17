import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
// import { MatPaginator } from "@angular/material/paginator";
// import { MatSort } from "@angular/material/sort";
// import { MatTableDataSource } from "@angular/material/table";
import {Course} from "../model/course";
import {CoursesService} from "../services/courses.service";
import {debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize} from 'rxjs/operators';
import {throwError} from "rxjs";
import {Lesson} from "../model/lesson";
// import {merge, fromEvent} from "rxjs";


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss'],
    standalone: false
})
export class CourseComponent implements OnInit, AfterViewInit {

    isLoading: boolean = false;
    course:Course;
    lessons: Lesson[] = [];
    displayedColumns = ["seqNo", "description", "duration"];

    constructor(private route: ActivatedRoute,
                private coursesService: CoursesService) {

    }

    ngOnInit() {
        this.course = this.route.snapshot.data["course"];
        this.loadLesonsPage();
    }

    loadLesonsPage() {
      this.isLoading = true;
      this.coursesService.findLessons(this.course.id, "asc", 0, 3).pipe(
        tap(lessons => this.lessons = lessons),
        catchError(err => {
          console.log("Error Loading Lessons", err);
          return throwError(err);
        }),
        finalize(() => this.isLoading = false),
      ).subscribe();
    }

    ngAfterViewInit() { }

}
