import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { CoursesService } from '../services/courses.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Course } from './course.model';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {
  courses$: Observable<Course[]>;
  role: string = '';
  course: any = [
    {
      id: '',
      name: '',
      description: '',
      imageUrl: '',
      startDate: '',
      endDate: '',
    },
  ];

  constructor(
    private coursesService: CoursesService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {
    this.courses$ = new Observable<Course[]>();
  }

  async ngOnInit() {
    // get token from local storage
    const token = localStorage.getItem('token');
    if (!token) {
      return this.alertController
        .create({
          header: 'Error',
          message: 'You need to login first',
          buttons: ['OK'],
        })

        .then((alert) => {
          alert.present();
          alert.onDidDismiss().then(() => {
            window.location.href = '/login';
          });
        });
    }

    // decode token
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);

    // parse the payload
    const { exp, role } = JSON.parse(decodedPayload);
    console.log(exp, role);
    this.role = role;
    console.log(role);

    const loading = await this.loadingCtrl.create({ message: 'Loading...' });
    loading.present();

    this.courses$ = this.coursesService.getCourses().pipe(
      tap((courses) => {
        loading.dismiss();
        let course = [];
        course = courses;
        return courses;
      })
    );
  }

  editCourse(id: number) {
    window.location.href = `course-update/${id}`;
  }
  deleteCourse(id: number) {
    //  show alert

    this.alertController
      .create({
        header: 'Delete Course',
        message: 'Are you sure you want to delete this course?',
        buttons: [
          {
            text: 'Yes',
            handler: async () => {
              // delete course
              console.log('deleted');
              //fetch
              const deleteResult = await fetch(
                `http://127.0.0.1:8000/api/courses/${id}`,
                {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );
              if (deleteResult.status != 200) {
                return this.alertController
                  .create({
                    header: 'Error',
                    message: 'Failed to delete course',
                    buttons: ['OK'],
                  })
                  .then((alert) => alert.present());
              }
              return this.alertController
                .create({
                  header: 'Success',
                  message: 'Course deleted successfully',
                  buttons: ['OK'],
                })
                .then((alert) => {
                  alert.present();
                  alert.onDidDismiss().then(() => {
                    // refresh the page
                    window.location.href = '/courses';
                  });
                });

              // this.coursesService.deleteCourse(id).subscribe((data) => {
              //   console.log(data);
              //   // refresh the page
              //   window.location.href = '/courses';
              // });
            },
          },
          {
            text: 'No',
            role: 'cancel',
          },
        ],
      })
      .then((alert) => alert.present());
  }

  tambahCourse() {
    window.location.href = '/tambah-courses';
  }
}
