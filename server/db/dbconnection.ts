import {DBConfig} from "../config";
import * as mongoose from "mongoose";
(<any>mongoose).Promise = global.Promise;

function connectDB(onDBConnected: Function) {
    // const connection = mongoose.connect(DBConfig.host, {server: {socketOptions: {keepAlive: 1}}}).connection;
    // connection.connect(DBConfig.host, {server: {socketOptions: {keepAlive: 1}}})
    //    .on('error', onError)
    //    .on('disconnected', connectDB)
    //    .once('open', onDBConnected);

    let uri = DBConfig.host;
    let options = {}

 	mongoose.connect(uri, options).then(
	  () => { 
	  	/** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
	  	onDBConnected()
	  },
	  err => { 
	  	/** handle initial connection error */ 
	  	onError(err)
	  }
	);
}

function onError(error) {
    console.error('数据库连接错误...', error);
    process.exit(1);
}

export default mongoose

export {
    connectDB
}