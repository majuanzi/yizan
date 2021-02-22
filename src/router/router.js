import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/',
    name: 'login',
    meta: {
        title: '望海医生综合管理系统 - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};
export const myCenterRouter = {
    path: '/my-center',
    name: 'my-center',
    title: '个人中心',
    component: resolve => { require(['@/views/my-center/my-center.vue'], resolve); }
}

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@/views/error-page/403.vue'], resolve); }
};


export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};
export const editquestion = {
    path: '/edit',
    name: 'edit',
    component: resolve => { require(['@/views/satisfact-setup/edit-question.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/otherRouter',
    name: 'otherRouter',
    component: Main,
    children: [
        {
            path: '/hos-admin/hos-mation',
            name: 'hos-mation',
            title: '医院详情',
            component: resolve => { require(['@/views/hos-admin/hos-mation.vue'], resolve); },
        },
        {
            path: '/hos-dept-doc',
            name: 'hos-dept-doc',
            title: '科室列表',
            component: resolve => { require(['@/views/hos-admin/hos-dept-doc.vue'], resolve); },
        },
        {
            path: '/addAdmin',
            name: 'addAdmin',
            title: '添加管理员',
            component: resolve => { require(['@/views/hos-admin/addAdmin.vue'], resolve); }
        },
        {
            path: '/physician-resource-list/:id',
            name: 'physician-resource-list',
            title: '医师资源列表',
            component: resolve => { require(['@/views/physician-resource/physician-resource-list.vue'], resolve); }
        },
        {
            path: '/physician-info-detail/:dentityKey/:hospitalCode/:empCode',
            name: 'physician-info-detail',
            title: '医师信息详情',
            component: resolve => { require(['@/views/physician-resource/physician-info-detail.vue'], resolve); }
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/hos-admin',
        icon: 'icon-yiyuanguanli',
        name: 'hos-admin',
        title: '医院管理',
        component: Main,
        children: [
            {
                path: 'hos-admin',
                name: 'hos-admin',
                title: '医院管理',
                component: resolve => { require(['@/views/hos-admin/hos-admin.vue'], resolve); }
            }
        ]
    },
    {
        path: '/parameter',
        icon: 'icon-canshupeizhi',
        name: 'parameter',
        title: '参数配置',
        component: Main,
        children: [
            {
                path: 'parameter-card',
                name: 'parameter-card',
                // title: '订单参数',
                title: '参数配置',
                component: resolve => { require(['@/views/parameter/parameter-card.vue'], resolve); }
            },
            // {
            //     path: 'parameter-card',
            //     name: 'parameter-card',
            //     title: '照护参数',
            //     component: resolve => { require(['@/views/parameter/parameter-card.vue'], resolve); }
            // },
            // {
            //     path: 'parameter-doctor',
            //     name: 'parameter-doctor',
            //     // title: '照护参数',
            //     title: '医生参数',
            //     component: resolve => { require(['@/views/parameter/parameter-doctor.vue'], resolve); }
            // },
            // {
            //     path: 'parameter-free',
            //     name: 'parameter-free',
            //     // title: '照护参数',
            //     title: '免费次数配置',
            //     component: resolve => { require(['@/views/parameter/parameter-free.vue'], resolve); }
            // }
        ]
    },
    {
        path: '/statistics',
        icon: 'icon-tongjiliebiao',
        title: '统计列表',
        name: 'statistics',
        component: Main,
        children: [
            {
                path: 'statistics-card',
                title: '照护统计',
                name: 'statistics-card',
                component: resolve => { require(['@/views/statistics/statistics-card.vue'], resolve); }
            },
            {
                path: 'statistics-order',
                title: '订单统计',
                name: 'statistics-order',
                component: resolve => { require(['@/views/statistics/statistics-order.vue'], resolve); }
            },
            {
                path: 'statistics-evaluate',
                title: '好评率统计',
                name: 'statistics-evaluate',
                component: resolve => { require(['@/views/statistics/statistics-evaluate.vue'], resolve); }
            }
        ]
    },
    {
        path: '/satisfact-setup',
        icon: 'icon-manyiduwenjuanshezhi',
        title: '满意度预置题库',
        name: 'satisfact-setup',
        component: Main,
        children: [
            {
                path: 'satisfact-dimension',
                title: '测评维度',
                name: 'satisfact-dimension',
                component: resolve => { require(['@/views/satisfact-setup/satisfact-dimension.vue'], resolve); }
            },
            {
                path: 'satisfact-ques',
                title: '满意度题库',
                name: 'satisfact-ques',
                component: resolve => { require(['@/views/satisfact-setup/satisfact-ques.vue'], resolve); }
            },
            {
                path: 'satisfact-template',
                title: '问卷模版',
                name: 'satisfact-template',
                component: resolve => { require(['@/views/satisfact-setup/satisfact-template.vue'], resolve); }
            }
        ]
    },
    {
        path: '/physician-resource',
        icon: 'icon-manyidutongji',
        title: '医师资源统计',
        name: 'physician-resource',
        component: Main,
        children: [
            {
                path: 'physician-resource-index',
                title: '医师资源统计',
                name: 'physician-resource-index',
                component: resolve => { require(['@/views/physician-resource/physician-resource-index.vue'], resolve); }
            },
            {
                path: 'physician-info-list',
                title: '医师信息查询',
                name: 'physician-info-list',
                component: resolve => { require(['@/views/physician-resource/physician-info-list.vue'], resolve); }
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,//登录
    myCenterRouter,//个人中心
    otherRouter,//content
    ...appRouter,//left
    editquestion,
    page500,
    page403,
    page404
];
