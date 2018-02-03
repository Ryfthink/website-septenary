import {Component, OnInit} from "@angular/core";
import {ArticleService} from "../article.service";
import {Article} from "../../../model/article";

import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterState, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {SlimLoadingBarService} from "../../../loading/slim-loading-bar.service";

class Pagination {
	limit: number;
	offset: number;
	total: number;
	pages: number[];
	urlPrefix: string;

	constructor(urlPrefix) {
		this.urlPrefix = urlPrefix;
	}
}

@Component({
	selector: 'app-article-list',
	templateUrl: './article-list.component.html',
	styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

	pagination: Pagination;
	articles: Article[];
	currentPage: number = 1;
	hasLoadData: boolean = false;

	constructor(private articleService: ArticleService,
							private router: Router,
							private slimLoadingService: SlimLoadingBarService,
							public activeRoute: ActivatedRoute) {
	}

	ngOnInit() {
		let activatedRouteSnapshot: ActivatedRouteSnapshot = this.activeRoute.snapshot;
		let routerState: RouterState = this.router.routerState;
		let routerStateSnapshot: RouterStateSnapshot = routerState.snapshot;

		// console.log(activatedRouteSnapshot, routerState, routerStateSnapshot);
		this.slimLoadingService.start();
		this.slimLoadingService.progress = 25;

		this.activeRoute.params.subscribe(params => {

			this.currentPage = params.page || 1;
			let observer: Observable<any> = null;
			let urlPrefix = null;

			if (params.category) {
				observer = this.articleService.listArticlesByCategory(this.currentPage, params.category);
				urlPrefix = `/category/${params.category}`;
			} else if (params.tag) {
				observer = this.articleService.listArticlesByTag(this.currentPage, params.tag);
				urlPrefix = `/tag/${params.tag}`;
			} else if (params.columnist) {
				observer = this.articleService.listArticlesByColumnist(this.currentPage, params.columnist);
				urlPrefix = `/columnist/${params.columnist}`;
			} else {
				observer = this.articleService.listArticles(this.currentPage);
				urlPrefix = `/page`;
			}

			observer.subscribe(result => {
				this.hasLoadData = true;
				if (result.success) {
					let data = result.data;
					this.articles = data.docs;
					delete data.docs;
					this.pagination = new Pagination(urlPrefix);
					Object.assign(this.pagination, data);
					this.pagination.pages = Array.from(Array(Math.ceil(this.pagination.total / this.pagination.limit)).keys()).map(page => page + 1);
					this.slimLoadingService.complete();
				} else {
					this.slimLoadingService.reset();
				}
			});
		});
	}

	onPaginationClick(page: number) {
		this.router.navigateByUrl(`${this.pagination.urlPrefix}/${page}`);
	}
}
