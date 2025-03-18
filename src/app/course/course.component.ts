import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
// import { MatTableDataSource } from "@angular/material/table";
import {Course} from "../model/course";
import {CoursesService} from "../services/courses.service";
import {debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize} from 'rxjs/operators';
import {merge, throwError} from "rxjs";
import {Lesson} from "../model/lesson";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss'],
    standalone: false
})
export class CourseComponent implements OnInit, AfterViewInit {

    isLoading: boolean = false;
    defaultPageSize: number = 3;
    defaultPageIndex: number = 0;
    course:Course;
    lessons: Lesson[] = [];
    expandedLesson: Lesson = null;
    displayedColumns = ["select", "seqNo", "description", "duration"];
    selection = new SelectionModel(true, []);

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort:MatSort;

    constructor(private route: ActivatedRoute,
                private coursesService: CoursesService) {

    }

    ngOnInit() {
        this.course = this.route.snapshot.data["course"];
        this.loadLesonsPage();
    }

    isAllSelected() {
      return this.selection.selected?.length == this.lessons.length
    }

    onToggleLesson(lesson: Lesson) {
      if(lesson == this.expandedLesson) {
        this.expandedLesson = null;
      }
      else {
        this.expandedLesson = lesson;
      }
  }

    onLessonToggled(lesson:Lesson) {
      this.selection.toggle(lesson);
      console.log(lesson);
  }

    loadLesonsPage() {
      this.isLoading = true;
      this.coursesService
        .findLessons(
            this.course.id,
            this.sort?.direction ?? "asc",
            this.paginator?.pageIndex ?? this.defaultPageIndex,
            this.paginator?.pageSize ?? this.defaultPageSize,
            this.sort?.active ?? "seqNo")
        .pipe(
        tap(lessons => this.lessons = lessons),
        catchError(err => {
          console.log("Error Loading Lessons", err);
          return throwError(err);
        }),
        finalize(() => this.isLoading = false),
      ).subscribe();
    }

    ngAfterViewInit() {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = this.defaultPageIndex)
      merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadLesonsPage()),
      ).subscribe();
    }

    toggleAll() {
    if(this.isAllSelected()) {
      this.selection.clear()
    } else {
      this.selection.select(...this.lessons);
    }

  }
}
