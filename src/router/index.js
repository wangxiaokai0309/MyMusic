import Vue from 'vue'
import Router from 'vue-router'

const Singer = resolve => {
  import('components/Singer').then(module => {
    resolve(module)
  })
}
const Rank = resolve => {
  import('components/Rank').then(module => {
    resolve(module)
  })
}
const Search = resolve => {
  import('components/Search').then(module => {
    resolve(module)
  })
}
const SingerDetail = resolve => {
  import('components/SingerDetail').then(module => {
    resolve(module)
  })
}
const Disc = resolve => {
  import('components/Disc').then(module => {
    resolve(module)
  })
}
const TopList = resolve => {
  import('components/TopList').then(module => {
    resolve(module)
  })
}
const Recommend = resolve => {
  import('components/Recommend').then(module => {
    resolve(module)
  })
}
const NotFound = resolve => {
  import('containers/NotFound').then(module => {
    resolve(module)
  })
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
