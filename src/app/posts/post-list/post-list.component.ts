import { AuthService } from './../../auth/auth.service';
import { PostSerice } from './../posts.service';
import {Component, OnInit, OnDestroy} from '@angular/core'
import {Post} from '../post.model'
import {Subscription} from 'rxjs'
import { PageEvent } from '@angular/material/paginator';


@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
    posts: Post[] = []
    private postSub: Subscription;
    isLoading = false

    totalPosts = 0;
    postsPerPage = 2
    pageSizeOptions = [1, 2, 5, 10]
    currentPage = 1
    
    private authStatusSub: Subscription
    private userIsAuthenticated = false

    userId: string

    constructor(public postsService: PostSerice, private authService: AuthService){}

    ngOnInit(){
        this.isLoading = true
        this.postsService.getPosts(this.postsPerPage, this.currentPage)
        this.userId = this.authService.getuserId()
        this.postSub = this.postsService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
            this.isLoading = false
            this.totalPosts = postData.postCount
            this.posts = postData.posts;
        })

        this.userIsAuthenticated = this.authService.getIsAuth()

        this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticate => {
            this.userIsAuthenticated = isAuthenticate
            this.userId = this.authService.getuserId()
        })
    }

    onChangePage(pageData: PageEvent){
        this.isLoading = true
        this.currentPage = pageData.pageIndex + 1
        this.postsPerPage = pageData.pageSize
        this.postsService.getPosts(this.postsPerPage, this.currentPage)
    }

    onDelete(postId: string){
        this.isLoading = true
        this.postsService.deletePost(postId).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage)
        }, error => {
            this.isLoading = false
        })
    }

    ngOnDestroy(){
        this.postSub.unsubscribe()
        this.authStatusSub.unsubscribe()
    }
}