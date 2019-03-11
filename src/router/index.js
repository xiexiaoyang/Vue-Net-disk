import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Error from '@/components/404.vue'
import Main from '@/components/Main.vue'
import Regist from '@/components/Regist.vue'
import UpdateUIfo from '@/components/UpdateUIfo.vue'
import Login from '@/components/Login.vue'
import Video from '@/components/main/Video.vue'
import FileList from '@/components/main/FileList.vue'
import Doc from '@/components/main/Doc.vue'
import Music from '@/components/main/Music.vue'
import Picture from '@/components/main/Picture.vue'
import Other from '@/components/main/Other.vue'
import Member from '@/components/main/Member.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', name: 'Login', component: Login },
    {path: '/regist', name: 'Regist', component: Regist },
    {path: '/main/:uid/:uname', name: '菜单', component: Main,
      children: [
        {path: '/main/filelist/:uid', component: FileList, name: '全部文件'},
        {path: '/main/doc/:uid', component: Doc, name: '文本'},
        {path: '/main/pictrue/:uid', component: Picture, name: '图片'},
        {path: '/main/music/:uid', component: Music, name: '音乐'},
        {path: '/main/vedio/:uid', component: Video, name: '视频'},
        {path: '/main/other/:uid', component: Other, name: '其他'}
      ]

    },
    {path: '/updateuifo', name: 'UpdateUIfo', component: UpdateUIfo },
    {path: '*', name: '404', component: Error }
  ]
})
