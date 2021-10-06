export default [
    {
        title: 'Home',
        route: 'home',
        icon: 'HomeIcon',
    },
    {
        title: 'User',
        icon: 'UserIcon',
        children: [
            {
                title: 'List',
                route: 'apps-users-list',
            },
        ],
    },
    {
        title: 'Screen Contents',
        icon: 'EyeIcon',
        children: [
            {
                title: 'Bad WordList',
                route: 'badWordList',
            },
        ],
    },
]
