import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { CoursesService } from '../services/courses.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Course } from './course.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {
  courses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private loadingCtrl: LoadingController
  ) {
    this.courses$ = new Observable<Course[]>();
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({ message: 'Loading...' });
    loading.present();

    this.courses$ = this.coursesService.getCourses().pipe(
      tap((courses) => {
        loading.dismiss();
        return courses;
      })
    );
  }
}
