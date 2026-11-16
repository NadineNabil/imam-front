import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 25,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'home',
        link: '/',
    },
            {
        id: 60,
        label: 'Platform Report',
        icon: 'bar-chart-2',
        link: '/report'
    },
    {
    id: 25,
    label: 'MENUITEMS.LOGS.TEXT',
    icon: 'clipboard',
    link: '/logs',
},

    {
        id: 2,
        label: 'MENUITEMS.SYSTEMSTRUCTURE.TEXT',
        icon: 'folder',
        link: '/tree',
    },
    /*   {
          id: 3,
          label: 'MENUITEMS.APPS.TEXT',
          icon: 'grid',
          subItems: [
              {
                  id: 4,
                  label: 'MENUITEMS.APPS.LIST.CALENDAR',
                  link: '/',
                  parentId: 3
              },
              {
                  id: 5,
                  label: 'MENUITEMS.APPS.LIST.CHAT',
                  link: '/',
                  parentId: 3
              },
              {
                  id: 6,
                  label: 'MENUITEMS.APPS.LIST.EMAIL',
                  icon: 'bx-receipt',
                  subItems: [
                      {
                          id: 7,
                          label: 'MENUITEMS.APPS.LIST.INBOX',
                          link: '/',
                          parentId: 6
                      },
                      {
                          id: 8,
                          label: 'MENUITEMS.APPS.LIST.READEMAIL',
                          link: '/',
                          parentId: 6
                      },
                  ]
              },
              {
                  id: 9,
                  label: 'MENUITEMS.APPS.LIST.INVOICES',
                  icon: 'bx-receipt',
                  subItems: [
                      {
                          id: 10,
                          label: 'MENUITEMS.APPS.LIST.INVOICELIST',
                          link: '/',
                          parentId: 9
                      },
                      {
                          id: 11,
                          label: 'MENUITEMS.APPS.LIST.INVOICEDETAIL',
                          link: '/',
                          parentId: 9
                      },
                  ]
              },
              {
                  id: 12,
                  label: 'MENUITEMS.APPS.LIST.CONTACTS',
                  subItems: [
                      {
                          id: 13,
                          label: 'MENUITEMS.APPS.LIST.USERGRID',
                          link: '/',
                          parentId: 12
                      },
                      {
                          id: 14,
                          label: 'MENUITEMS.APPS.LIST.USERLIST',
                          link: '/',
                          parentId: 12
                      },
                      {
                          id: 15,
                          label: 'MENUITEMS.APPS.LIST.PROFILE',
                          link: '/',
                          parentId: 12
                      }
                  ]
              },
              {
                  id: 12,
                  label: 'MENUITEMS.APPS.LIST.BLOG',
                  badge: {
                      variant: 'danger',
                      text: 'MENUITEMS.APPS.BADGE',
                  },
                  subItems: [
                      {
                          id: 13,
                          label: 'MENUITEMS.APPS.LIST.BLOGGRID',
                          link: '/',
                          parentId: 12
                      },
                      {
                          id: 14,
                          label: 'MENUITEMS.APPS.LIST.BLOGLIST',
                          link: '/',
                          parentId: 12
                      },
                      {
                          id: 15,
                          label: 'MENUITEMS.APPS.LIST.BLOGDETAILS',
                          link: '/',
                          parentId: 12
                      }
                  ]
              }
          ]
      }, */
    /*     {
            id: 16,
            label: 'MENUITEMS.AUTHENTICATION.TEXT',
            icon: 'users',
            subItems: [
                {
                    id: 17,
                    label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
                    link: '/',
                    parentId: 16
                },
                {
                    id: 18,
                    label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
                    link: '/',
                    parentId: 16
                },
    
                {
                    id: 19,
                    label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
                    link: '/',
                    parentId: 16
                },
                {
                    id: 20,
                    label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
                    link: '/',
                    parentId: 16
                },
                {
                    id: 21,
                    label: 'MENUITEMS.AUTHENTICATION.LIST.LOGOUT',
                    link: '/',
                    parentId: 16
                },
                {
                    id: 22,
                    label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL',
                    link: '/',
                    parentId: 16
                },
                {
                    id: 23,
                    label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION',
                    link: '/',
                    parentId: 16
                },
                {
                    id: 24,
                    label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
                    link: '/',
                    parentId: 16
                }
            ]
        }, */
    {
        id: 26, // make sure this is unique
        label: 'MENUITEMS.CATEGORIES.TEXT',
        icon: 'grid',
        subItems: [
            {
                id: 27,
                label: 'MENUITEMS.CATEGORIES.LIST.ADD',
                link: '/categories/add-category',
                parentId: 26
            }

        ]
    },
    {
        id: 20, // make sure this is unique
        label: 'MENUITEMS.COURSES.TEXT',
        icon: 'book',
        subItems: [
            {
                id: 21,
                label: 'MENUITEMS.COURSES.LIST.ADD',
                link: '/courses/add-course',
                parentId: 20
            },
            {
                id: 22,
                label: 'MENUITEMS.COURSES.LIST.VIEW',
                link: '/courses/all-courses',
                parentId: 20
            },
            {
                id: 23,
                label: 'MENUITEMS.COURSES.LIST.INV',
                link: 'view-invitations',
                parentId: 20
            }
        ]
    },
    {
        id: 30,
        label: 'MENUITEMS.EXAMS_MANAGEMENT.TEXT',
        icon: 'clipboard',
        subItems: [
            {
                id: 31,
                label: 'MENUITEMS.EXAMS_MANAGEMENT.LIST.CREATE',
                link: '/exams/create-exam',
                parentId: 30
            },
            {
                id: 32,
                label: 'MENUITEMS.EXAMS_MANAGEMENT.LIST.VIEW',
                link: '/view-exams',
                parentId: 30
            }
        ]
    },
    {
        id: 40,
        label: 'MENUITEMS.STUDENT-MANAGEMENT.TEXT',
        icon: 'users',
        subItems: [
            {
                id: 33,
                label: 'MENUITEMS.STUDENT-MANAGEMENT.LIST.VIEW',
                link: '/student-management',
                parentId: 31
            }
        ]
    },
    {
        id: 50,
        label: 'MENUITEMS.GROUP-MANAGEMENT.TEXT',
        icon: 'layers',
        subItems: [
            {
                id: 34,
                label: 'MENUITEMS.GROUP-MANAGEMENT.LIST.VIEW',
                link: '/group-management',
                parentId: 32
            }
        ]
    },
        {
        id: 51,
        label: 'MENUITEMS.USERS.TEXT',
        icon: 'users',
        subItems: [
            {
                id: 35,
                label: 'MENUITEMS.USERS.LIST.VIEW',
                link: '/users',
                parentId: 33
            },
                        {
                id: 36,
                label: 'MENUITEMS.USERS.LIST.ADD',
                link: '/users/add-user',
                parentId: 34
            }
        ]
    }

];

