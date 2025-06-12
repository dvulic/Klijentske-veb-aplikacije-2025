import {LocalGradeModel} from "../model/localGrade.model";
import {ModelUser} from "../model/model.user";

export class GradesService{
  static initGrades(){
    //Mock grades
    if(localStorage.getItem('users') === null) return
    let users: ModelUser[] = JSON.parse(localStorage.getItem('users')!)

    let grades: LocalGradeModel[] = [
      {
        user:users[0],
        movieId: 1,
        grade: 5,
        comment: "Odlican film. Sve preporuke."
      },
      {
        user:users[0],
        movieId: 1,
        grade: 4,
        comment: "Odlican film. Sve preporuke."
      },
      {
        user:users[0],
        movieId: 1,
        grade: 3,
        comment: "Odlican film. Sve preporuke."
      },
      {
        user:users[0],
        movieId: 1,
        grade: 3,
        comment: "Odlican film. Sve preporuke."
      },
      {
        user:users[0],
        movieId: 1,
        grade: 1,
        comment: "Odlican film. Sve preporuke."
      },
    ]

    localStorage.setItem('grades', JSON.stringify(grades))
  }

  static getMovieGradesData(movieId: number): LocalGradeModel[] {
    const allGrades: LocalGradeModel[] = JSON.parse(localStorage.getItem('grades') || '[]');
    return allGrades.filter(grade => grade.movieId === movieId);
  }

  static getAverageGrade(gradesArray?: LocalGradeModel[], movieId?: number){
    if(!(movieId || gradesArray)) return 0
    const grades = (gradesArray) ? gradesArray : this.getMovieGradesData(movieId!)

    let gradeSum = 0
    for (let grade of grades){
      gradeSum += grade.grade
    }

    if (gradeSum > 0) return Math.round((gradeSum / grades.length) * 10) / 10;
    return gradeSum
  }

  static addNewGrade(grade: LocalGradeModel){
    let grades: LocalGradeModel[] = JSON.parse(localStorage.getItem('grades') || '[]')
    grades.unshift(grade)
    console.log('After:', grades);

    localStorage.setItem('grades', JSON.stringify(grades))
  }

}
