import { environment } from './../../environments/environment';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs'
import {HttpClient} from '@angular/common/http'
import {map} from 'rxjs/operators'
import { Router } from '@angular/router';

const POST_URL = environment.api_url + '/posts/'

@Injectable({
    providedIn: 'root'
})
export class PostSerice{
    private posts: Post[] = []
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(postsPerPage: number, currentpage: number){
        const queryParams = `?pagesize=${postsPerPage}&page=${currentpage}`
        this.http.get<{message: string, posts: any, maxPosts: number}>(POST_URL + queryParams)
        .pipe(map((postData) => {
            return {posts: postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator
                }
            }), maxPosts: postData.maxPosts}
        }))
        .subscribe((transformedPostData) => {
            this.posts = transformedPostData.posts;
            this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
        })
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string, image: File){
        const postData = new FormData()
        postData.append("title", title)
        postData.append("content", content)
        postData.append("image", image, title)
        
        
        this.http.post<{message: string, post: Post}>(POST_URL, postData)
        .subscribe((responseData) => {
            this.router.navigate(["/"])
        })
        
    }

    updatePost(id: string, title: string, content: string, image: File | string){
        let postData: Post | FormData

        if(typeof image === "object"){
            postData = new FormData()
            postData.append("id", id)
            postData.append("title", title)
            postData.append("content", content)
            postData.append("image", image, title)
        }else{
            postData = {
                id: id, 
                title: title, 
                content: content, 
                imagePath: image,
                creator: null
            }

        }

        this.http.put(POST_URL + id, postData)
        .subscribe(response => {
            this.router.navigate(["/"])
        })
    }

    deletePost(postId: string){
        return this.http.delete(POST_URL + postId);
    }

    getPost(id: string){
        return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(POST_URL + id)
    }
}