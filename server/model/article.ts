import mongoose from "../db/dbconnection";
import {IPaginate, MongoosePaginate} from "../db/plugins/paginate";
import autoIncrementPlugin from "../db/plugins/identity-counter";
import Schema = mongoose.Schema;

interface IArticle extends mongoose.Document {
    title: string; // 标题
    banner: string; // 横幅
    tags: string[]; // 标签
    category: string; // 分类
    content: string; // 正文
    summary: string; // 摘要
		summaryImages: string[]; // 摘要贴图
    views: number; // 浏览数
    createdTime: Date; // 创建时间
    updatedTime: Date; // 更新时间
		imageResources: string[] // 图床
    author: number // 作者

    log(): void
}

interface IArticleModel extends mongoose.Model<IArticle>, IPaginate {
    staticMethod(): void
}

const ArticleSchema = new Schema({
    title: {type: String, required: true}, // 标题
    banner: String, // 横幅
    tags: [String], // 标签
    category: String, // 分类
    content: String, // 正文
    summary: String, // 摘要
		summaryImages: {type: [String], default: null}, // 摘要贴图
    views: {type: Number, default: 0}, // 浏览数
    createdTime: {type: Date, default: Date.now}, // 创建时间
    updatedTime: {type: Date, default: Date.now}, // 更新时间
		imageResources: [String], // 图床
    author: {type: Number, ref: 'User', required: true}
});

// 日志 实例方法
ArticleSchema.methods.log = () => {
    console.log('InstanceMethod....')
};

// 加载自增 id 插件
ArticleSchema.plugin(autoIncrementPlugin, {
    _model: 'Article',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

// 翻页实现
ArticleSchema.statics.paginate = MongoosePaginate.paginate;

// 静态方法
ArticleSchema.statics.staticMethod = () => {
    console.log('StaticMethod....')
};

const Article = <IArticleModel>mongoose.model('Article', ArticleSchema);

export default Article;