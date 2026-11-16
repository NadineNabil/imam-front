import { MenuItem } from './menu.model';

export const STUDENTMenu: MenuItem[] = [
 
    {
        id: 1,
        label: 'MENUITEMS.DASHBOARDS.TEXT', // Dashboard
        icon: 'home',
        link: '/student-dashboard',
    },
    {
        id: 2,
        label: 'MENUITEMS.MYCOURSES.TEXT', // My Courses
        icon: 'book-open',
        link: '/courses/my-courses',
    },
    {
        id: 3,
        label: 'MENUITEMS.MY_EXAMS.TEXT',
        icon: 'clipboard',
        link: '/student-assessments',
    },
    {
        id: 4,
        label: 'MENUITEMS.MY_TRAINING.TEXT',
        icon: 'award',
        link: '/student-trainings',
    }
  
];
